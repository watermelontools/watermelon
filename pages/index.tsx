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
import ComingSoonService from "../components/dashboard/ComingSoonService";
import Header from "../components/Header";
import DownloadExtension from "../components/dashboard/DownloadExtension";
function HomePage({ hasPaidServerSide }) {
  const [userEmail, setUserEmail] = useState(null);
  const [jiraUserData, setJiraUserData] = useState(null);
  const [githubUserData, setGithubUserData] = useState(null);
  const [hasPaid, setHasPaid] = useState(false);
  const { data: session, status } = useSession();
  useEffect(() => {
    setUserEmail(session?.user?.email);
  }, [session]);
  useEffect(() => {
    if (userEmail) {
      getJiraInfo(userEmail).then((data) => {
        setJiraUserData(data);
      });
      getGitHubInfo(userEmail).then((data) => {
        setGithubUserData(data);
      });
    }
  }, [userEmail]);

  const nextServicesList = [
    "Bitbucket",
    "Gitlab",
    "Notion",
    "Slack",
    "Trello",
    "Asana",
    "Confluence",
    "Google Drive",
    "Dropbox",
    "Microsoft Teams",
    "Zoom",
  ];
  return (
    <div>
      {status === "loading" && <div>Loading...</div>}
      {status === "unauthenticated" && <LogInBtn />}
      {status === "authenticated" && (
        <>
          {session ? <Header /> : <LogInBtn />}

          {userEmail && (
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(350px, 1fr))",
              }}
            >
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
                  // <JiraLoginLink userEmail={userEmail} hasPaid={hasPaid}/>
                  <JiraLoginLink userEmail={userEmail} hasPaid={hasPaidServerSide}/>
                )}
              </div>
              <div className="p-3">
                <DownloadExtension
                  name="VSCode"
                  email={userEmail}
                  accessToken={session.user.name}
                />
              </div>
              <div className="p-3">
                <DownloadExtension
                  name="VSCode Insiders"
                  email={userEmail}
                  accessToken={session.user.name}
                />
              </div>
              {nextServicesList.map((service) => (
                <div className="p-3">
                  <ComingSoonService name={service} />
                </div>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}

// This gets called on every request
export async function getServerSideProps() {
  // Fetch data from external API
  let hasPaidServerSide = false;
  await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/payments/getByEmail`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    // body: JSON.stringify({ email: userEmail }),
    body: JSON.stringify({ email: "info@watermelon.tools" })
  })
  .then((res) => res.json())
  .then((data) => {
    if (data.email) {
      hasPaidServerSide = true;
    }
  })

  // Pass data to the page via props
  return { props: { hasPaidServerSide } }
}

export default HomePage;
