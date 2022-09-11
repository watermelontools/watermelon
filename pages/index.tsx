import { useSession } from "next-auth/react";
import Link from "next/link";
import { useEffect, useState } from "react";
import LogOutBtn from "../components/logout-btn";
import LogInBtn from "../components/login-btn";
import GitHubInfo from "../components/githubInfo";
import JiraInfo from "../components/jiraInfo";
import JiraLoginLink from "../components/JiraLoginLink";
import GitHubLoginLink from "../components/GitHubLoginLink";

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
      {session ? <LogOutBtn /> : <LogInBtn />}

      {userEmail && (
        <div>
          <div>
            {githubUserData?.name || githubUserData?.email ? (
              <GitHubInfo {...githubUserData} />
            ) : (
              <GitHubLoginLink userEmail={userEmail} />
            )}
          </div>
          <div>
            {jiraUserData?.organization ? (
              <JiraInfo {...jiraUserData} />
            ) : (
              <JiraLoginLink userEmail={userEmail} />
            )}{" "}
          </div>
        </div>
      )}
    </div>
  );
}

export default HomePage;
