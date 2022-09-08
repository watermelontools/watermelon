import { useSession } from "next-auth/react";
import Link from "next/link";
import { useEffect, useState } from "react";
import LogInBtn from "../components/login-btn";

function HomePage({}) {
  const [userEmail, setUserEmail] = useState(null);
  const [jiraUserData, setJiraUserData] = useState(null);
  const [githubUserData, setGithubUserData] = useState(null);
  const { data: session } = useSession();
  useEffect(() => {
    setUserEmail(session?.user?.email);
  }, [session]);
  useEffect(() => {
    getJiraInfo();
    getGitHubInfo();
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
    setJiraUserData(data);
  }
  async function getGitHubInfo() {
    const res = await fetch("/api/github/getUser", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        user: userEmail,
      }),
    });
    const data = await res.json();
    setGithubUserData(data);
  }
  return (
    <div className="container" style={{ padding: "50px 0 100px 0" }}>
      <LogInBtn />

      {userEmail && (
        <div>
          <div>
            {githubUserData?.name || githubUserData?.email ? (
              <div>
                <h1>GitHub</h1>
                <h2>{githubUserData.name}</h2>
                <h3>{githubUserData.login}</h3>
                <img src={githubUserData.avatar_url} />
              </div>
            ) : (
              <Link
                href={`https://github.com/login/oauth/authorize?client_id=8543242e428085df968c&redirect_uri=https://app.watermelontools.com/github&state=${userEmail}&scope=repo%20user%20notifications`}
              >
                <a>Sign in with GitHub</a>
              </Link>
            )}
          </div>
          <div>
            {jiraUserData?.organization ? (
              <div>
                <p> Logged into {jiraUserData.organization}</p>
                <img src={jiraUserData.org_avatar_url} />
                <div>
                  <img src={jiraUserData.user_avatar_url} />
                  <p>Your Jira email:{jiraUserData.user_email} </p>
                  <p>Your Jira name: {jiraUserData.user_displayname}</p>
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
