import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import JiraLoginLink from "../components/JiraLoginLink";
import saveUser from "../utils/db/discord/saveUser";
export default function Discord({ userData, userEmail, error }) {
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
          You have logged in with Discord as
        </h2>
        <img
          src={`https://cdn.discordapp.com/avatars/${userData.id}/${userData.avatar}`}
          alt="github user image"
          className="avatar avatar-8"
        />
      </div>

      <div>
        <p className="text-emphasized">We recommend you login to Jira</p>
        <JiraLoginLink userEmail={userEmail} />
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
    const API_ENDPOINT = "https://discord.com/api/v10";
    const CLIENT_ID = process.env.DISCORD_CLIENT_ID;
    const CLIENT_SECRET = process.env.DISCORD_CLIENT_SECRET;
    const REDIRECT_URI = "https://app.watermelontools.com/discord";
    const data = {
      client_id: CLIENT_ID,
      client_secret: CLIENT_SECRET,
      grant_type: "authorization_code",
      code: context.query.code,
      redirect_uri: REDIRECT_URI,
    };
    const headers = {
      "Content-Type": "application/x-www-form-urlencoded",
    };
    const response = await fetch(`${API_ENDPOINT}/oauth2/token`, {
      method: "POST",
      headers: headers,
      body: new URLSearchParams(data),
    });
    const json = await response.json();
    const user = await fetch(`${API_ENDPOINT}/users/@me`, {
      headers: {
        Authorization: `Bearer ${json.access_token}`,
      },
    });

    const userJson = await user.json();
    await saveUser({
      access_token: json.access_token,
      scope: json.scope,
      login: userJson.login,
      id: userJson.id,
      avatar_url: userJson.avatar_url,
      watermelon_user: context.query.state,
      email: userJson.email,
      refresh_token: json.refresh_token,
    });
    return {
      props: {
        userData: userJson,
        userEmail: context.query.state,
      },
    };
  } else
    return {
      props: {
        error: "no code",
      },
    };
}
