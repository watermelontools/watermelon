import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
export default function GitHub({ context, error }) {
  const [timeToRedirect, setTimeToRedirect] = useState(10);
  console.log(context);
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

  /* useEffect(() => {
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
 */
  return (
    <div className="Box" style={{ maxWidth: "100ch", margin: "auto" }}>
      <div className="Subhead">
        <h2 className="Subhead-heading px-2">
          You have logged in with Discord as
        </h2>
      </div>

      <div>
        <p className="text-emphasized">We recommend you login to Jira</p>
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
    console.log("code", context.query.code);
  } else
    return {
      props: {
        error: "no code",
      },
    };
  console.log("context", context);
  return {
    props: {
      context,
    },
  };
}
