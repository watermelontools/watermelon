import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import LogOutBtn from "../components/logout-btn";
import LogInBtn from "../components/login-btn";
import GitHubInfo from "../components/dashboard/GitHubInfo";
import JiraInfo from "../components/dashboard/JiraInfo";
import JiraLoginLink from "../components/JiraLoginLink";
import GitHubLoginLink from "../components/GitHubLoginLink";
import getGitHubInfo from "../utils/api/getGitHubInfo";
import getJiraInfo from "../utils/api/getJiraInfo";
function HomePage({}) {
  const [userEmail, setUserEmail] = useState(null);
  const [jiraUserData, setJiraUserData] = useState(null);
  const [githubUserData, setGithubUserData] = useState(null);
  const { data: session } = useSession();
  useEffect(() => {
    setUserEmail(session?.user?.email);
  }, [session]);
  useEffect(() => {
    console.log("userEmail", userEmail);
    getJiraInfo(userEmail).then((data) => {
      setJiraUserData(data);
    });
    getGitHubInfo(userEmail).then((data) => {
      setGithubUserData(data);
    });
  }, [userEmail]);

  return (
    <div className="container" style={{ padding: "50px 0 100px 0" }}>
      {session ? <LogOutBtn /> : <LogInBtn />}

      {userEmail && (
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr" }}>
          <div className="p-3">
            {githubUserData?.name || githubUserData?.email ? (
              <GitHubInfo {...githubUserData} />
            ) : (
              <GitHubLoginLink userEmail={userEmail} />
            )}
          </div>
          <div className="p-3">
            {jiraUserData?.organization ? (
              <JiraInfo {...jiraUserData} />
            ) : (
              <JiraLoginLink userEmail={userEmail} />
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default HomePage;
