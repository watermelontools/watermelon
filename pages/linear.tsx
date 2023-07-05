import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import saveUserInfo from "../utils/db/linear/saveUser";
export default function Linear({
  login,
  avatar_url,
  userEmail,
  team_name,
  error,
}) {
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
          You have logged in with Linear as {login} in the team {team_name}
        </h2>
      </div>
      <img
        src={avatar_url}
        alt="linear user image"
        className="avatar avatar-8"
      />
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
    f = await fetch(`https://api.linear.app/oauth/token`, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        Accept: "application/json",
      },
      body: `grant_type=authorization_code&code=${context.query.code}&client_id=${process.env.LINEAR_CLIENT_ID}&client_secret=${process.env.LINEAR_CLIENT_SECRET}&redirect_uri=https://app.watermelontools.com/linear`,
    });
  } else
    return {
      props: {
        error: "no code",
      },
    };
  const json = await f.json();
  if (json.error) {
    return {
      props: {
        error: json.error,
      },
    };
  } else {
    const graphql = JSON.stringify({
      query:
        "query Me {\nviewer {\n  id,\n  name,\n  displayName, email,\n  avatarUrl\n},\nteams {\n  nodes {\n    id,\n    name\n  }\n}\n}",
      variables: {},
    });
    let user = await fetch(`https://api.linear.app/graphql`, {
      method: "POST",
      headers: {
        "content-type": "application/json",
        Authorization: `Bearer ${json.access_token}`,
      },
      body: graphql,
    });
    let userText = await user.text();
    let userJson = JSON.parse(userText).data;
    console.log(userJson);
    console.log({
      access_token: json.access_token,
      id: userJson.id,
      avatarUrl: userJson.avatarUrl,
      watermelon_user: context.query.state,
      displayName: userJson.displayName,
      name: userJson.name,
      email: userJson.email,
      team_id: userJson.team_id,
      team_name: userJson.team_name,
    });
    await saveUserInfo({
      access_token: json.access_token,
      id: userJson.id,
      avatarUrl: userJson.avatarUrl,
      watermelon_user: context.query.state,
      displayName: userJson.displayName,
      name: userJson.name,
      email: userJson.email,
      team_id: userJson.team_id,
      team_name: userJson.team_name,
    });
    return {
      props: {
        loggedIn: true,
        userEmail: context.query.state,
        login: userJson.displayName,
        avatar_url: userJson.avatarUrl,
        team_name: userJson.team_name,
      },
    };
  }
}
