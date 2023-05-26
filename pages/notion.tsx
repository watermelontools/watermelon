import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import saveUser from "../utils/db/notion/saveUser";
import JiraLoginLink from "../components/JiraLoginLink";
export default function GitHub({ login, avatar_url, userEmail, error }) {
  const [hasPaid, setHasPaid] = useState(false);
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

  useEffect(() => {
    // use getByEmail to check if user has paid
    fetch("/api/payments/getByEmail", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email: userEmail }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.email) {
          setHasPaid(true);
        }
      });
  }, []);

  return (
    <div className="Box" style={{ maxWidth: "100ch", margin: "auto" }}>
      <div className="Subhead">
        <h2 className="Subhead-heading px-2">
          You have logged in with Notion as {login}
        </h2>
      </div>
      <img
        src={avatar_url}
        alt="github user image"
        className="avatar avatar-8"
      />
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
    f = await fetch(`https://api.notion.com/v1/oauth/token`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: `Basic "${btoa(
          process.env.NOTION_CLIENT_ID + ":" + process.env.NOTION_CLIENT_SECRET
        )}"`,
      },
      body: JSON.stringify({
        grant_type: "authorization_code",
        code: context.query.code,
        redirect_uri: "https://app.watermelontools.com/notion",
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
    return {
      props: {
        error: json.error,
      },
    };
  } else {
    let userInfo = await fetch(
      `https://api.notion.com/v1/users/${json.owner.user.id}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${json.access_token}`,
          "Notion-Version": "2021-05-13",
        },
      }
    ).then((res) => res.json());
    console.log(userInfo);
    await saveUser({
      watermelon_user: context.query.state,
      access_token: json.access_token,
      token_type: json.token_type,
      bot_id: json.bot_id,
      workspace_name: json.workspace_name,
      workspace_icon: json.workspace_icon,
      workspace_id: json.workspace_id,
      owner_type: json.owner,
      owner_user_object: json.owner.user,
      owner_user_id: json.owner.user.id,
      duplicated_template_id: json.duplicated_template_id,
      user_id: userInfo.id,
      user_name: userInfo.name,
      user_avatar_url: userInfo.avatar_url,
      user_email: userInfo.person.email,
    });
  }
  return {
    props: {
      loggedIn: true,
      userEmail: context.query.state,
      login: json.workspace_name,
      avatar_url: json.workspace_icon,
    },
  };
}
