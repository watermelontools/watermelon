import { useEffect, useState } from "react";
import Router, { useRouter } from "next/router";
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
        // before redirecting, add user to DB

        // First get access-token from window.location.hash
        let retrievedAccessToken = window.location.hash.split("=")[1].split("&")[0];

        // Second, fetch user data from the Bitbucket API
        fetch('https://api.bitbucket.org/2.0/user', {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${retrievedAccessToken}`,
            'Accept': 'application/json'
          }
        })
          .then(response => {
            console.log(
              `Response: ${response.status} ${response.statusText}`
            );
            return response.text();
          })
          .then(text => console.log(text))
          .catch(err => console.error(err));

        // Third, call the create_bitbucket stored procedure
        // await saveUserInfo({
        //   access_token: "DNKhmncVIHChqVY5YG9mAQgpvLfbt2KLjS7xWfXyrt0MiXBbye8phEkvgGNVYIgcBS03qNMp4HgKOHGpdCXe-WG0vWwZwrcgWV6eWRfA1tFLYyquM1PAA5FuTCFv0muq0DJavb2n0Ia3DYgeNxXU5b4U5rw",
        //   // access_token: json.access_token,
        //   scope: json.scope,
        //   login: userJson.login,
        //   id: userJson.id,
        //   avatar_url: userJson.avatar_url,
        //   watermelon_user: context.query.state,
        //   name: userJson.name,
        //   company: userJson.company,
        //   blog: userJson.blog,
        //   email: userJson.email,
        //   location: userJson.location,
        //   bio: userJson.bio,
        //   twitter_username: userJson.twitter_username,
        // });

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

export async function getServerSideProps() {
  // Here we had the old code that retrieved the access_token from the API of other services, but Bitbucket doesn't work like that. So we're using the code below instead.

    // Then, we should fetch the user data to get avatar_url, login, etc, and then send that to the create_bitbucket stored procedure
    
    // Call endpoint to retrieve user
    // let user = await fetch(`https://api.bitbucket.org/2.0/user`, {
    //   headers: {
    //     Authorization: `Bearer ${json.access_token}`,
    //     'Accept': 'application/json'
    //   },
    // });

    // call user.json();
    // let userJson = await user.json();

    // Send it to the DB
    // await saveUserInfo({
    //   access_token: "DNKhmncVIHChqVY5YG9mAQgpvLfbt2KLjS7xWfXyrt0MiXBbye8phEkvgGNVYIgcBS03qNMp4HgKOHGpdCXe-WG0vWwZwrcgWV6eWRfA1tFLYyquM1PAA5FuTCFv0muq0DJavb2n0Ia3DYgeNxXU5b4U5rw",
    //   // access_token: json.access_token,
    //   scope: json.scope,
    //   login: userJson.login,
    //   id: userJson.id,
    //   avatar_url: userJson.avatar_url,
    //   watermelon_user: context.query.state,
    //   name: userJson.name,
    //   company: userJson.company,
    //   blog: userJson.blog,
    //   email: userJson.email,
    //   location: userJson.location,
    //   bio: userJson.bio,
    //   twitter_username: userJson.twitter_username,
    // });
    // return {
    //   props: {
    //     loggedIn: true,
    //     userEmail: context.query.state,
    //     login: userJson.login,
    //     avatar_url: userJson.avatar_url,
    //   },
    // };
  
}
