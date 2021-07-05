import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import PageTitle from "../components/PageTitle";

const FirstAuth = ({ token }) => {
  const router = useRouter();
  useEffect(() => {
    window.localStorage.setItem("sign_in_token", JSON.stringify(token));
  }, []);

  return (
    <>
      <PageTitle pageTitle="Welcome to Watermelon!" />
      <div
        className="flex justify-center items-center h-screen w-full"
        style={{ backgroundImage: "url(bg-pink.png)", backgroundSize: "cover" }}>
        <div className="grid-rows-2">
          <div className="flex justify-center items-center h-screen w-full row-span-full">
            <div className="rounded shadow p-4 bg-white">
              <p>Please install the app on your workspace</p>
              <div className="w-full flex justify-center items-center my-2">
                {token && <a
                  href={`https://slack.com/oauth/v2/authorize${token?.team?.id ? "?team=" + token.team.id + "&" : "?"
                    }scope=incoming-webhook,groups:write,channels:manage,channels:read,chat:write,commands,chat:write.public,users.profile:read,users:read.email,users:read,groups:read
                    &client_id=${process.env.NEXT_PUBLIC_SLACK_CLIENT_ID}
                    &redirect_uri=https://${process.env.NEXT_PUBLIC_IS_DEV === "true" ? "dev." : ""
                    }app.watermelon.tools/wizard`}
                >
                  <img
                    alt="Add to Slack"
                    height="40"
                    width="139"
                    src="https://platform.slack-edge.com/img/add_to_slack.png"
                    srcSet="https://platform.slack-edge.com/img/add_to_slack.png 1x, https://platform.slack-edge.com/img/add_to_slack@2x.png 2x"
                  />
                </a>}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
export default FirstAuth;

import admin from '../utils/firebase/backend';
import logger from "../logger/logger";

export async function getServerSideProps(context) {
  let f
  if (context.query.code)
    f = await fetch(
      `https://slack.com/api/oauth.v2.access?client_id=${process.env.SLACK_CLIENT_ID
      }&client_secret=${process.env.SLACK_CLIENT_SECRET}&code=${context.query.code
      }&redirect_uri=https://${process.env.IS_DEV === "true" ? "dev." : ""
      }app.watermelon.tools/firstAuth`
    )
  else return {
    props: {
      error: "no code"
    }
  }
  let data = await f.json();
  let token = {
    team: data.team,
    app_id: data.app_id,
    authed_user: {
      id: data.authed_user?.id,
      scope: data.authed_user?.scope
    },
    enterprise: data.enterprise,
    is_enterprise_install: data.is_enterprise_install
  }
  let teamId = token.team.id

  let db = admin.firestore();
  let add_to_slack_token
  if (data.ok) {
    await db.collection("teams")
      .doc(teamId)
      .get()
      .then((res) => {
        if (res.exists) {
          let responseData = res.data();
          if (responseData.add_to_slack_token) {
            add_to_slack_token = responseData.add_to_slack_token
            delete add_to_slack_token.access_token;
          }
        }
      });
    if (add_to_slack_token) {
      return {
        redirect: {
          destination: "/",
          permanent: false
        }
      }
    }
    else {

      const response = await fetch("https://slack.com/api/users.identity", {
        headers: {
          'Authorization': `Bearer ${data?.authed_user?.access_token}`
        },
      })
      const respJson = await response.json()
      await db.collection("teams")
        .doc(teamId)
        .set(
          {
            loggedUser: respJson,
            sign_in_token: data,
            settings: { language: "en", category: "hobbies", weekday: "THU", hour: "15" },
            installation: {
              user: {
                token: data?.authed_user?.access_token,
                scopes: data?.authed_user?.scope,
                id: data?.authed_user?.id,
              },
            },
          },
          { merge: true }
        )
        .then(function () {
          logger.info({ message: "new-signin", data: data.team })
        })
        .catch(function (error) {
          console.error("Error adding document: ", error);
        })
      const initialState = [
        {
          question: "What instrument would you like to play?",
          icebreaker: "Hey ${person}, what song would you play with your ${answer}?",
          answers: ["Guitar in a hard rock band", "Violin in an orchestra"],
        },
        {
          question: "Who would you rather be?",
          icebreaker:
            "Hey ${person} would you rather be rich or famous due to being ${answer}?",
          answers: ["The first person on Mars", "The person that cures cancer"],
        },
      ];
      initialState.forEach((question) => {
        db.collection("teams")
          .doc(
            `${teamId}/weekly_questions/${question.question}`
          )
          .set({ icebreaker: question.icebreaker, respondents: [] }, { merge: true })
          .then(function () {
            logger.info({
              message: "Wrote default question", data: {
                question: question.question,
                icebreaker: question.icebreaker,
                answers: question.answers
              }
            });
          })
          .catch(function (error) {
            console.error("Error writing: ", error);
          });
        question.answers.forEach((answer) => {
          db.collection("teams")
            .doc(
              `${teamId}`
            )
            .collection("weekly_questions")
            .doc(question.question)
            .collection(answer)
            .doc("picked_by")
            .set({ picked_by: [] }, { merge: true })
            .then(() => { })
            .catch(function (error) {
              console.error("Error writing: ", error);
            });
        });
      });
    }
    return {
      props: {
        token
      }, // will be passed to the page component as props
    };
  }

  return {
    props: {
      error: "error in the data"
    }
  }
}
