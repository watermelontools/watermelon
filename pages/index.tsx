import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import LogOutBtn from "../components/logout-btn";
import LogInBtn from "../components/login-btn";
import GitHubInfo from "../components/dashboard/GitHubInfo";
import InfoPanel from "../components/dashboard/InfoPanel";
import JiraInfo from "../components/dashboard/JiraInfo";
import JiraLoginLink from "../components/JiraLoginLink";
import GitHubLoginLink from "../components/GitHubLoginLink";
import getGitHubInfo from "../utils/api/getGitHubInfo";
import getJiraInfo from "../utils/api/getJiraInfo";
import ComingSoonService from "../components/dashboard/ComingSoonService";
import Header from "../components/Header";
import DownloadExtension from "../components/dashboard/DownloadExtension";
import getSlackInfo from "../utils/api/getSlackInfo";
import SlackLoginLink from "../components/SlackLoginLink";
import getByEmail from "../utils/db/payments/getByEmail";
function HomePage({hasPaidServerSide}) {
  const [userEmail, setUserEmail] = useState(null);
  const [jiraUserData, setJiraUserData] = useState(null);
  const [githubUserData, setGithubUserData] = useState(null);
  const [slackUserData, setSlackUserData] = useState(null);
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
      getSlackInfo(userEmail).then((data) => {
        setSlackUserData(data);
      });
    }
  }, [userEmail]);

  const nextServicesList = [
    "Bitbucket",
    "Gitlab",
    "Notion",
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
                  <JiraLoginLink userEmail={userEmail} hasPaid={hasPaidServerSide} />
                )}
              </div>
              <div className="p-3">
                {slackUserData?.name || slackUserData?.email ? (
                  <InfoPanel
                    info={{
                      organization: slackUserData?.team_name,
                      user_avatar_url: slackUserData?.user_avatar_url,
                      user_displayname: slackUserData?.name,
                      user_email: slackUserData?.email,
                      service_name: "Slack",
                    }}
                  />
                ) : (
                  <SlackLoginLink userEmail={userEmail} hasPaid={hasPaidServerSide} />
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
  let hasPaidServerSide = await getByEmail({ email: "evargas@watermelon.tools"}).then((data) => {
    if (data["email"]) {
      return true;
    }
    return false;
  });
  return { props: { hasPaidServerSide } }
}

export default HomePage;
