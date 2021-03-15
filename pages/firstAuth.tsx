import { Router } from "next/router";
import { useEffect } from "react";
import { useRouter } from "next/router";

const FirstAuth = ({ firebaseApp, token }) => {
  const router = useRouter();
  let db = firebaseApp.firestore();
  const saveToken = () => {
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
            teamId: token.team.id,
            userToken: token.authed_user.access_token,
            userId: token.authed_user.id,
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
    window.localStorage.setItem("sign_in_token", JSON.stringify(token));
    if (db.collection("teams").doc(token.team.id).get())
      router.push("/weeklyquestions");
    else saveToken();
  }, []);
  console.log(token);
  return (
    <div className="grid-rows-2">
      <div className="row-start-1 row-end-2 bg-pink-600 w-full"></div>
      <div className="row-start-2 row-end-3 white w-full"></div>
      <div className="flex justify-center items-center h-screen w-full row-span-full">
        <div className="rounded shadow p-4">
          <h1>Welcome to Watermelon!</h1>
          <p>Please install the app on your workspace</p>
          <div className="w-full flex justify-center items-center my-2">
            <a
              href={`https://slack.com/oauth/v2/authorize?scope=incoming-webhook,groups:write,channels:manage,channels:read,chat:write,commands&client_id=1471534976662.1575212081829&team=${token.team.id}&redirect_uri=https://app.watermelon.tools/welcome`}
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
        </div>
      </div>
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
