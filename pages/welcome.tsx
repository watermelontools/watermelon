import { useEffect } from "react";

const FirstAuth = ({ firebaseApp, token }) => {
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
      question.answers.forEach((answer) => {
        db.collection("teams")
          .doc(token.team.id)
          .collection("weekly_questions")
          .doc(question.question)
          .collection(answer)
          .doc("picked_by")
          .set({ picked_by: [] }, { merge: true })
          .then(function (docRef) {
            console.log("Wrote to db", docRef);
          })
          .catch(function (error) {
            console.error("Error writing: ", error);
          });
      });
    });
  };
  useEffect(() => {
    saveToken();
    window.localStorage.setItem("add_to_slack_token", JSON.stringify(token));
  }, []);
  console.log(token);
  return (
    <div>
      <h1>Congratulations</h1>
      <p>You're ready to start helping your coworkers know each other</p>
    </div>
  );
};
export default FirstAuth;
export async function getServerSideProps(context) {
  let token = "token";
  let f = await fetch(
    `https://slack.com/api/oauth.v2.access?client_id=${process.env.SLACK_CLIENT_ID}&client_secret=${process.env.SLACK_CLIENT_SECRET}&code=${context.query.code}&redirect_uri=https://app.watermelon.tools/welcome`
  );
  let json = await f.json();
  token = json;
  console.log(token);
  return {
    props: {
      token,
    }, // will be passed to the page component as props
  };
}

let t = {
  ok: true,
  app_id: "A01GX682DQD",
  authed_user: {
    id: "U01J9G2DHAS",
    scope: "identity.basic,identity.email,identity.avatar,identity.team",
    access_token:
      "xoxp-1628322446642-1621546459366-1628555838242-42a9bdb82c90c13e57054413f014e397",
    token_type: "user",
  },
  team: { id: "T01JG9GD4JW" },
  enterprise: null,
  is_enterprise_install: false,
};
