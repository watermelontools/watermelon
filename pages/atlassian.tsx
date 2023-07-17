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
    <div className="Box" style={{ maxWidth: "100ch", margin: "auto" }}>
      <div className="Subhead">
        <h2 className="Subhead-heading px-2">
          You have logged in with Jira to {organization}
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
          If you are not redirected, please click <Link href="/">here</Link>
        </p>
        {error && <p>{error}</p>}
      </div>
    </div>
  );
}
export async function getServerSideProps(context) {
  let f;

  if (context.query.code) {
    f = await fetch(`https://auth.atlassian.com/oauth/token`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        grant_type: "authorization_code",
        code: context.query.code,
        redirect_uri: "https://app.watermelontools.com/atlassian",
        client_id: process.env.NEXT_PUBLIC_JIRA_CLIENT_ID,
        client_secret: process.env.JIRA_CLIENT_SECRET,
      }),
    });
  } else
    return {
      props: {
        error: "no code",
      },
    };
  const json = await f.json();
  if (json.error) {
    console.error("Atlassian error", json);
    return {
      props: {
        error: json.error,
      },
    };
  } else {
    const { access_token } = json;
    console.log("access_token", access_token);
    const orgInfo = await fetch(
      "https://api.atlassian.com/oauth/token/accessible-resources",
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${access_token}`,
        },
      }
    );
    const orgInfoJson = await orgInfo.json();
    let isConfluence = context.query.state.startsWith("c");
    if (isConfluence) {
      const userInfo = await fetch(
        `https://api.atlassian.com/ex/jira/${orgInfoJson[0].id}/rest/api/3/myself`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${access_token}`,
          },
        }
      );
      const userInfoJson = await userInfo.json();
    } else {
      const userInfo = await fetch(
        `https://api.atlassian.com/ex/jira/${orgInfoJson[0].id}/rest/api/3/myself`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${access_token}`,
          },
        }
      );
      const userInfoJson = await userInfo.json();
      await saveUserInfo({
        access_token: json.access_token,
        refresh_token: json.refresh_token,
        jira_id: orgInfoJson[0].id,
        organization: orgInfoJson[0].name,
        url: orgInfoJson[0].url,
        org_avatar_url: orgInfoJson[0].avatarUrl,
        scopes: orgInfoJson[0].scopes,
        watermelon_user: context.query.state,
        user_email: userInfoJson.emailAddress,
        user_avatar_url: userInfoJson?.avatarUrls?.["48x48"],
        user_id: userInfoJson.accountId,
        user_displayname: userInfoJson.displayName,
      });
    }

    return {
      props: {
        userEmail: context.query.state,
        organization: orgInfoJson[0]?.name,
        avatar_url: orgInfoJson[0]?.avatar_url,
      },
    };
  }
}
