import { useEffect } from "react";
import { useRouter } from "next/router";
import PageTitle from "../components/PageTitle";

const FirstAuth = ({ firebaseApp, token, add_to_slack_token }) => {
  const router = useRouter();
  token = token ?? JSON.parse(window.localStorage.getItem("sign_in_token"))
  useEffect(() => {
    window.localStorage.setItem("sign_in_token", JSON.stringify(token));
    if (add_to_slack_token) {
      window.localStorage.setItem(
        "add_to_slack_token",
        JSON.stringify(add_to_slack_token)
      )
      router.push("/weeklyquestions")
    }
  }, []);
  return (
    <>
      <PageTitle pageTitle="Welcome to Watermelon!" />
      <div className="grid-rows-2">
        <div className="row-start-1 row-end-2 bg-pink-600 w-full"></div>
        <div className="row-start-2 row-end-3 white w-full"></div>
        <div className="flex justify-center items-center h-screen w-full row-span-full">
          <div className="rounded shadow p-4">
            <p>Please install the app on your workspace</p>
            <div className="w-full flex justify-center items-center my-2">
              {token && <a
                href={`https://slack.com/oauth/v2/authorize?team=${token.team.id
                  }&scope=incoming-webhook,groups:write,channels:manage,channels:read,chat:write,commands,chat:write.public&client_id=${process.env.NEXT_PUBLIC_SLACK_CLIENT_ID
                  }&redirect_uri=https://${process.env.NEXT_PUBLIC_IS_DEV === "true" ? "dev." : ""
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
    </>
  );
};
export default FirstAuth;

import admin from '../utils/firebase/backend';

export async function getServerSideProps(context) {
  let f = await fetch(
    `https://slack.com/api/oauth.v2.access?client_id=${process.env.SLACK_CLIENT_ID
    }&client_secret=${process.env.SLACK_CLIENT_SECRET}&code=${context.query.code
    }&redirect_uri=https://${process.env.IS_DEV === "true" ? "dev." : ""
    }app.watermelon.tools/firstAuth`
  );
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
  let db = admin.firestore();
  let add_to_slack_token
  db.collection("teams")
    .doc(token.team.id)
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
  await db.collection("teams")
    .doc(data.team.id)
    .set(
      {
        sign_in_token: data,
        settings: { language: "en", category: "hobbies" },
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
      console.log("New signin", data.team);
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
        `${data.team.id}/weekly_questions/${question.question}`
      )
      .set({ icebreaker: question.icebreaker, respondents: [] }, { merge: true })
      .then(function (docRef) {
        console.log("Wrote default question", {
          question: question.question,
          icebreaker: question.icebreaker,
          answers: question.answers
        });
      })
      .catch(function (error) {
        console.error("Error writing: ", error);
      });
    question.answers.forEach((answer) => {
      db.collection("teams")
        .doc(
          `${data.team.id}`
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
  return {
    props: {
      token,
      add_to_slack_token
    }, // will be passed to the page component as props
  };
}
