import { useSession } from "next-auth/react";
import Link from "next/link";
import { useEffect, useState } from "react";
import LogInBtn from "../components/login-btn";

function HomePage({}) {
  const [userEmail, setUserEmail] = useState(null);
  const [userData, setUserData] = useState(null);
  const { data: session } = useSession();
  useEffect(() => {
    setUserEmail(session?.user?.email);
  }, [session]);
  useEffect(() => {
    getJiraInfo();
  }, [userEmail]);
  async function getJiraInfo() {
    const res = await fetch("/api/jira/getUser", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        user: userEmail,
      }),
    });
    const data = await res.json();
    setUserData(data);
  }

  return (
    <div className="container" style={{ padding: "50px 0 100px 0" }}>
      <LogInBtn />

      {userEmail && (
        <div>
          <div>
            <Link
              href={`https://github.com/login/oauth/authorize?client_id=8543242e428085df968c&redirect_uri=https://app.watermelontools.com/github&state=${userEmail}&scope=repo%20user%20notifications`}
            >
              <a>Sign in with GitHub</a>
            </Link>
          </div>
          <div>
            {userData?.organization ? (
              <div>
                <p> Logged into {userData.organization}</p>
                <img src={userData.org_avatar_url} />
                <div>
                  <img src={userData.user_avatar_url} />
                  <p>Your Jira email:{userData.user_email} </p>
                  <p>Your Jira name: {userData.user_displayname}</p>
                </div>
              </div>
            ) : (
              <Link
                href={`https://auth.atlassian.com/authorize?audience=api.atlassian.com&client_id=VUngRAClu8ZE56vxXCFBocTxCTLEUQTT&scope=read:jira-user%20read:jira-work%20write:jira-work%20offline_access&redirect_uri=https://app.watermelontools.com/jira&state=${userEmail}&response_type=code&prompt=consent`}
              >
                <a className="button block">Login to Jira</a>
              </Link>
            )}{" "}
          </div>
        </div>
      )}
    </div>
  );
}

export default HomePage;
