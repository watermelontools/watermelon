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
        // Before redirecting, add user to DB
  
        // First, get code from URL
        let retrievedCode = window.location.hash.split("=")[1].split("&")[0];
  
        // Second, get access_token from Bitbucket
        fetch('https://bitbucket.org/site/oauth2/access_token', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
          },
          body: `grant_type=authorization_code&code=${retrievedCode}`
        }).then(response => {
          let responseJson = response.json().then(async (data) => {
            // get access_token from the response
            let retrievedAccessToken = data.access_token;
  
            // Third, fetch user data from the Bitbucket API
            fetch('https://api.bitbucket.org/2.0/user', {
              method: 'GET',
              headers: {
                'Authorization': `Bearer ${retrievedAccessToken}`,
                'Accept': 'application/json'
              }
            })
              .then(response => {
                let responseJson = response.json().then(async (data) => {
                  // Third, call the create_bitbucket stored procedure
                  await saveUserInfo({
                    access_token: retrievedAccessToken, 
                    id: data.account_id,
                    avatar_url: data?.links?.avatar?.href,
                    watermelon_user: userEmail,
                    name: data.display_name,
                    location: data.location,
                    refresh_token: data.refresh_token,
                  });
                });
    
                return response.text();
              })
              .catch(err => console.error(err));
          });
        });
        router.push("/");
      }
    }, 1000);
    return () => clearInterval(interval);
  }, []);

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