import { useEffect, useState } from "react";
import { supabase } from "../utils/supabase";
import { useRouter } from "next/router";
import Link from "next/link";
export default function Github({ loggedIn }) {
  const [timeToRedirect, setTimeToRedirect] = useState(5);
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
    <div>
      <h1>You have logged in with GitHub </h1>
      <div>
        <p>You will be redirected in {timeToRedirect}...</p>
        <p>
          If you are not redirected, please click{" "}
          <Link href="/">
            <a>here</a>
          </Link>
        </p>
      </div>
    </div>
  );
}
export async function getServerSideProps(context) {
  let f;
  if (context.query.code) {
    f = await fetch(`https://github.com/login/oauth/access_token`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({
        grant_type: "authorization_code",
        code: context.query.code,
        redirect_uri: "https://app.watermelon.tools/github",
        client_id: process.env.GITHUB_CLIENT_ID,
        client_secret: process.env.GITHUB_CLIENT_SECRET,
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
    let { data, error, status } = await supabase.from("GitHub").insert({
      access_token: json.access_token,
      scopes: json.scope,
      user: context.query.state,
    });
    if (error) {
      console.error(error);
    } else {
      console.log(data);
    }
    return {
      props: { loggedIn: true },
    };
  }
}
