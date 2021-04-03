import { useEffect } from "react";
import { useRouter } from "next/router";
import PageTitle from "../components/PageTitle";

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
    db.collection("teams")
      .doc(token.team.id)
      .get()
      .then((res) => {
        if (res.exists) {
          let responseData = res.data();
          window.localStorage.setItem(
            "add_to_slack_token",
            JSON.stringify(responseData.add_to_slack_token)
          );
          router.push("/weeklyquestions");
        } else saveToken();
      });
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
              <a
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
              </a>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
export default FirstAuth;
export async function getServerSideProps(context) {
  let f = await fetch(
    `https://slack.com/api/oauth.v2.access?client_id=${process.env.SLACK_CLIENT_ID
    }&client_secret=${process.env.SLACK_CLIENT_SECRET}&code=${context.query.code
    }&redirect_uri=https://${process.env.IS_DEV ? "dev." : ""
    }app.watermelon.tools/firstAuth`
  );
  let token = await f.json();
  console.log(token);
  return {
    props: {
      token,
    }, // will be passed to the page component as props
  };
}
