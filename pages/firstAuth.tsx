import { useEffect } from "react";

const FirstAuth = ({ firebaseApp, token }) => {
  const saveToken = () => {
    let db = firebaseApp.firestore();
    db.collection("teams")
      .doc(token.team.id)
      .set(
        {
          sign_in_token: token,
        },
        { merge: true }
      )
      .then(function (docRef) {
        console.log("Document written with ID: ", docRef);
      })
      .catch(function (error) {
        console.error("Error adding document: ", error);
      });
    db.collection("teams")
      .doc(token.team.id)
      .set(
        {
          installation: {
            botId: token.bot_user_id,
            botToken: token.access_token,
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
  useEffect(() => {
    saveToken();
    window.localStorage.setItem("sign_in_token", JSON.stringify(token));
  }, []);
  console.log(token);
  return (
    <div>
      <h1>Welcome to watermelon</h1>
      <p>Please install the app on your workspace</p>
      <a href="https://slack.com/oauth/v2/authorize?client_id=1471534976662.1575212081829&scope=channels:manage,chat:write,commands,team:read,users:read&user_scope=">
        <img
          alt="Add to Slack"
          height="40"
          width="139"
          src="https://platform.slack-edge.com/img/add_to_slack.png"
          srcSet="https://platform.slack-edge.com/img/add_to_slack.png 1x, https://platform.slack-edge.com/img/add_to_slack@2x.png 2x"
        />
      </a>
      <a
        href={`https://slack.com/oauth/v2/authorize?scope=incoming-webhook,commands,chat:write&client_id=1471534976662.1575212081829&team=${token.team.id}&redirect_uri=https://app.watermelon.tools/welcome`}
      >
        <img
          alt="Add to Slack"
          height="40"
          width="139"
          src="https://platform.slack-edge.com/img/add_to_slack.png"
          srcSet="https://platform.slack-edge.com/img/add_to_slack.png 1x, https://platform.slack-edge.com/img/add_to_slack@2x.png 2x"
        />
      </a>
    </div>
  );
};
export default FirstAuth;
export async function getServerSideProps(context) {
  let token = "token";
  let f = await fetch(
    `https://slack.com/api/oauth.v2.access?client_id=${process.env.SLACK_CLIENT_ID}&client_secret=${process.env.SLACK_CLIENT_SECRET}&code=${context.query.code}&redirect_uri=https://app.watermelon.tools/firstAuth`
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
