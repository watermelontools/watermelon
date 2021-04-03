import Link from "next/link";
import { useEffect } from "react";
import PagePadder from "../components/PagePadder";
import PageTitle from "../components/PageTitle";

const Welcome = ({ firebaseApp, token }) => {
  let db = firebaseApp.firestore();
  const saveToken = () => {
    db.collection("teams")
      .doc(token.team.id)
      .set(
        {
          add_to_slack_token: token,
        },
        { merge: true }
      )
      .then(function (docRef) {
        console.log("Document written with ID: ", docRef);
      })
      .catch(function (error) {
        console.error("Error adding document: ", error);
      });
    let userToken = JSON.parse(window?.localStorage?.getItem("sign_in_token"));
    db.collection("teams")
      .doc(token.team.id)
      .set(
        {
          installation: {
            team: token.team,
            enterprise: token.enterprise ?? false,
            user: {
              token: userToken.authed_user.access_token,
              scopes: userToken.authed_user.scope,
              id: userToken.authed_user.id,
            },
            tokenType: "bot",
            isEnterpriseInstall: token.is_enterprise_install ?? false,
            appId: token.app_id,
            authVersion: "v2",
            bot: {
              scopes: token.scope.split(","),
              token: token.access_token,
              userId: token.bot_user_id,
              id: token.incoming_webhook.channel_id,
            },
          },
        },
        { merge: true }
      )
      .then(function (docRef) {
        console.log("Document written with ID: ", docRef);
      })
      .catch(function (error) {
        console.error("Error adding document: ", error);
      });
  };
  let saveQuestions = () => {
    [
      {
        question: "What instrument would you like to play?",
        icebreaker:
          "Hey ${person}, what song would you play with your ${answer}?",
        answers: ["Guitar in a hard rock band", "Violin in an orchestra"],
      },
      {
        question: "Who would you rather be?",
        icebreaker:
          "Hey ${person} would you rather be rich or famous due to being ${answer}?",
        answers: ["The first person on Mars", "The person that cures cancer"],
      },
    ].forEach((question) => {
      db.collection("teams")
        .doc(`${token.team.id}/weekly_questions/${question.question}`)
        .set({ icebreaker: question.icebreaker, respondents: [] }, { merge: true })
        .then(function (docRef) {
          console.log("Wrote weekly questions to db", docRef);
        })
        .catch(function (error) {
          console.error("Error writing: ", error);
        });
      question.answers.forEach((answer) => {
        db.collection("teams")
          .doc(token.team.id)
          .collection("weekly_questions")
          .doc(question.question)
          .collection(answer)
          .doc("picked_by")
          .set({ picked_by: [] }, { merge: true })
          .then(function (docRef) {
            console.log("Wrote picked by to db", docRef);
          })
          .catch(function (error) {
            console.error("Error writing: ", error);
          });
      });
    });
  };
  useEffect(() => {
    saveToken();
    saveQuestions();
    window.localStorage.setItem("add_to_slack_token", JSON.stringify(token));
  }, []);
  console.log(token);
  return (
    <>
      <PageTitle pageTitle="Congratulations" />
      <PagePadder>
        <div className="rounded shadow p-4">
          <p>✅You are ready to go!</p>
          <p>
            You may set questions over at{" "}
            <Link href="/weeklyquestions">
              <a>questions</a>
            </Link>
          , but we have added a couple for you 😉
        </p>
          <h3>In Slack:</h3>
          <ol>
            <li>
              Add <strong>@watermelon</strong> to a channel
          </li>
            <li>
              Use <strong>/ask</strong> to send the questions
          </li>
            <li>Have people answer them (you do it too, don’t miss the fun)</li>
            <li>
              Use <strong>/create</strong> and watch the groups be created!
          </li>
          </ol>
          <h3>Remember</h3>
          <p>Change the questions every week, we’ll send you a reminder</p>
        </div>
      </PagePadder>
    </>
  );
};
export default Welcome;
export async function getServerSideProps(context) {
  let f = await fetch(
    `https://slack.com/api/oauth.v2.access?client_id=${process.env.SLACK_CLIENT_ID
    }&client_secret=${process.env.SLACK_CLIENT_SECRET}&code=${context.query.code
    }&redirect_uri=https://${process.env.IS_DEV ? "dev." : ""
    }app.watermelon.tools/wizard`
  );
  let token = await f.json();

  return {
    props: {
      token,
    }, // will be passed to the page component as props
  };
}
