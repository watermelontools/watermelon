import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import saveUserInfo from "../utils/db/slack/saveUserInfo";
import GitHubLoginLink from "../components/GitHubLoginLink";
export default function Slack({ organization, avatar_url, userEmail, error }) {
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
        alt="slack user image"
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
            here
          </Link>
        </p>
        {error && <p>{error}</p>}
      </div>
    </div>
  );
}
export async function getServerSideProps(context) {
  let f;
  if (context.query.code) {
    f = await fetch(`https://slack.com/api/oauth.v2.access`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        grant_type: "authorization_code",
        code: context.query.code,
        redirect_uri: "https://app.watermelontools.com/slack",
        client_id: process.env.SLACK_CLIENT_ID,
        client_secret: process.env.SLACK_CLIENT_SECRET,
      }),
    });
  } else
    return {
      props: {
        error: "no code",
      },
    };
  const json = await f.json();
  console.log(json)
  if (json.error) {
    console.error("Slack error", json);
    return {
      props: {
        error: json.error,
      },
    };
  } else {
    const { authed_user } = json;
    const userInfo = await fetch(
      `https://slack.com/api/users.info?user=${authed_user.id}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${authed_user.access_token}`,
        },
      }
    );
    let userJson = await userInfo.json();
    const saveitem = {
      user_token: authed_user.access_token,
      bot_token: json.access_token,
      bot_user_id: json.bot_user_id,
      user_id: authed_user.id,
      team_id: json.team.id,
      team_name: json.team.name,
      bot_scopes: json.scope,
      user_scopes: authed_user.scope,
      incoming_webhook_channel_id: json.incoming_webhook.channel_id,
      watermelon_user: context.query.state,
      incoming_webhook_configuration_url:
        json.incoming_webhook.configuration_url,
      incoming_webhook_url: json.incoming_webhook.url,
      is_enterprise_install: json.is_enterprise_install,
      user_username: userJson.user.name,
      user_title: userJson.user.profile.title,
      user_real_name: userJson.user.real_name,
      user_picture_url: userJson.user.profile.image_512,
    };
    saveUserInfo(saveitem);
    return {
      props: {
        userEmail: context.query.state,
        organization: json.team.name,
        avatar_url: userJson.user.profile.image_512,
      },
    };
  }
}
