import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import saveUserInfo from "../utils/db/gitlab/saveUser";
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
          You have logged in with GitLab as {login}
        </h2>
      </div>
      <img
        src={avatar_url}
        alt="github user image"
        className="avatar avatar-8"
      />
      <div>
        <p className="text-emphasized">We recommend you login to Jira</p>
        <JiraLoginLink userEmail={userEmail} hasPaid={hasPaid} />
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
    f = await fetch(`https://gitlab.com/oauth/token`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({
        grant_type: "authorization_code",
        code: context.query.code,
        redirect_uri: "https://app.watermelontools.com/gitlab",
        client_id: process.env.GITLAB_APP_ID,
        client_secret: process.env.GITLAB_CLIENT_SECRET,
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
    let user = await fetch(`https://gitlab.com/api/v4/user`, {
      headers: {
        Authorization: `Bearer ${json.access_token}`,
      },
    });
    let userJson = await user.json();
     await saveUserInfo({
      access_token: json.access_token,
      refresh_token: json.refresh_token,
      scope: json.scope,
      username: userJson.username,
      id: userJson.id,
      avatar_url: userJson.avatar_url,
      watermelon_user: context.query.state,
      name: userJson.name,
      organization: userJson.organization,
      website: userJson.website,
      email: userJson.email,
      location: userJson.location,
      bio: userJson.bio,
      twitter: userJson.twitter,
      linkedin: userJson.linkedin
    }); 
    return {
      props: {
        loggedIn: true,
        userEmail: context.query.state,
        login: userJson.username,
        avatar_url: userJson.avatar_url,
      },
    };
  }
}