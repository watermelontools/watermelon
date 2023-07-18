import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import saveUserInfo from "../utils/db/bitbucket/saveUser";
import JiraLoginLink from "../components/JiraLoginLink";
export default function Bitbucket({ login, avatar_url, userEmail, error }) {
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
          You have logged in with Bitbucket as {login}
        </h2>
      </div>
      <img
        src={avatar_url}
        alt="bitbucket user image"
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
    f = await fetch(`https://bitbucket.org/site/oauth2/access_token`, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: `grant_type=authorization_code&code=${context.query.code}&client_id=${process.env.BITBUCKET_CLIENT_ID}&client_secret=${process.env.BITBUCKET_CLIENT_SECRET}`,
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
    const headers = {
      Authorization: `Bearer ${json.access_token}`,
    };

    const requests = [
      fetch(`https://api.bitbucket.org/2.0/user`, { headers }),
      fetch(`https://api.bitbucket.org/2.0/user/permissions/workspaces`, {
        headers,
      }),
      fetch(`https://api.bitbucket.org/2.0/user/emails`, { headers }),
    ];

    let [user, workspace, email] = await Promise.all(requests);

    let userJson = await user.json();
    let workspaceJson = await workspace.json();
    let emailJson = await email.json();

    await saveUserInfo({
      access_token: json.access_token,
      refresh_token: json.refresh_token,
      id: userJson.account_id,
      avatar_url: userJson.links.avatar.href,
      watermelon_user: context.query.state,
      name: userJson.display_name,
      location: userJson.location,
      workspace: workspaceJson.values[0].workspace.slug,
      email: emailJson.values[0].email,
    });
    return {
      props: {
        loggedIn: true,
        userEmail: context.query.state,
        login: userJson.username,
        avatar_url: userJson.links.avatar.href,
      },
    };
  }
}
