import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import saveUserInfo from "../utils/db/bitbucket/saveUser";
import BitbucketLoginLink from "../components/BitbucketLoginLink";
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
        <p className="text-emphasized">We recommend you login to Bitbucket</p>
        <BitbucketLoginLink userEmail={userEmail}  />
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
    // This wouldn't be needed if we get the access_token from the url param
    f = await fetch(`https://bitbucket.org/site/oauth2/access_token`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({
        grant_type: "authorization_code",
        code: context.query.code,
        redirect_uri: "https://app.watermelontools.com/bitbucket",
        client_id: process.env.BITBUCKET_CLIENT_ID,
        client_secret: process.env.BITBUCKET_CLIENT_SECRET,
      }),
    });
    console.log("bitbucket access_token: ", f)
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
    let user = await fetch(`https://api.bitbucket.org/2.0/user`, {
      headers: {
        Authorization: `Bearer ${json.access_token}`,
        'Accept': 'application/json'
      },
    });
    let userJson = await user.json();
    console.log("bitbucket userJson: ", userJson);

    // If this works, we would use location to get the access_token from the url param here
    console.log("await save user info with hardcoded token called.")
    // Via something like this 
    // const searchParams = new URLSearchParams(window.location.hash);
    // const accessToken = searchParams.get('access_token');
    await saveUserInfo({
      access_token: "DNKhmncVIHChqVY5YG9mAQgpvLfbt2KLjS7xWfXyrt0MiXBbye8phEkvgGNVYIgcBS03qNMp4HgKOHGpdCXe-WG0vWwZwrcgWV6eWRfA1tFLYyquM1PAA5FuTCFv0muq0DJavb2n0Ia3DYgeNxXU5b4U5rw",
      // access_token: json.access_token,
      scope: json.scope,
      login: userJson.login,
      id: userJson.id,
      avatar_url: userJson.avatar_url,
      watermelon_user: context.query.state,
      name: userJson.name,
      company: userJson.company,
      blog: userJson.blog,
      email: userJson.email,
      location: userJson.location,
      bio: userJson.bio,
      twitter_username: userJson.twitter_username,
    });
    return {
      props: {
        loggedIn: true,
        userEmail: context.query.state,
        login: userJson.login,
        avatar_url: userJson.avatar_url,
      },
    };
  }
}
