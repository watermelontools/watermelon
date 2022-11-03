import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import saveUserInfo from "../utils/db/jira/saveUserInfo";
import GitHubLoginLink from "../components/GitHubLoginLink";
export default function Jira({ organization, avatar_url, userEmail, error }) {
  const [timeToRedirect, setTimeToRedirect] = useState(10);
  const router = useRouter();
  useEffect(() => {
    const interval = setInterval(() => {
      setTimeToRedirect(timeToRedirect - 1);
      if (timeToRedirect === 0) {
        router.push("/");
      }
    }, 1000);
    return () => clearInterval(interval);
  }, [timeToRedirect]);

  return (
    <div className="Box">
      <div className="Subhead">
        <h2 className="Subhead-heading px-2">
          You have logged in with Slack to {organization}
        </h2>
      </div>
      <img
        src={avatar_url}
        alt="jira organization image"
        className="avatar avatar-8"
      />
      <div>
        <p className="text-emphasized">We recommend you login to GitHub</p>
        <GitHubLoginLink userEmail={userEmail} />
      </div>
      <div>
        <p>You will be redirected in {timeToRedirect}...</p>
        <p>
          If you are not redirected, please click{" "}
          <Link href="/">
            <a>here</a>
          </Link>
        </p>
        {error && <p>{error}</p>}
      </div>
    </div>
  );
}
export async function getServerSideProps(context) {
  let f;
  console.log(context.query.code);
  if (context.query.code) {
    let body = JSON.stringify({
      grant_type: "authorization_code",
      code: context.query.code,
      redirect_uri: "https://app.watermelontools.com/slack",
      client_id: process.env.SLACK_CLIENT_ID,
      client_secret: process.env.SLACK_CLIENT_SECRET,
    });
    console.log(body);
    f = await fetch(`https://slack.com/api/oauth.v2.access`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json; charset=utf-8",
      },
      body,
    });
  } else
    return {
      props: {
        error: "no code",
      },
    };
  const json = await f.json();
  if (json.error) {
    console.log("jira error", json);
    return {
      props: {
        error: json.error,
      },
    };
  } else {
    console.log(json);
    const { access_token } = json;
    const userInfo = await fetch(
      "https://slack.com/api/openid.connect.userInfo",
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${access_token}`,
        },
      }
    );
    console.log(userInfo);
    return {
      props: {
        userEmail: context.query.state,
      },
    };
  }
}
