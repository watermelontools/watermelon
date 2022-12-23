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
import GitLabLoginLink from "../components/GitLabLoginLink";
function HomePage({}) {
  const [userEmail, setUserEmail] = useState(null);
  const [jiraUserData, setJiraUserData] = useState(null);
  const [githubUserData, setGithubUserData] = useState(null);
  const [gitlabUserData, setGitlabUserData] = useState(null);
  const [slackUserData, setSlackUserData] = useState(null);
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
      getSlackInfo(userEmail).then((data) => {
        setSlackUserData(data);
      });
      // use getByEmail to check if user has paid
      // TODO: As stated on Jira ticket WM-66, we'll refactor this later in order to not block render
      // and have a perfect self-serve experience
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
    }
  }, [userEmail]);

  const nextServicesList = [
    "Bitbucket",
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
      {status === "loading" && (
        <>
          <Header />
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(350px, 1fr))",
            }}
          >
            {nextServicesList.map((service) => (
              <div className="p-3">
                <ComingSoonService name={service} />
              </div>
            ))}
          </div>
        </>
      )}
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
                {gitlabUserData?.name || gitlabUserData?.email ? (
                  <GitHubInfo {...gitlabUserData} />
                ) : (
                  <GitLabLoginLink userEmail={userEmail} />
                )}
              </div>
              <div className="p-3">
                {jiraUserData?.organization ? (
                  <JiraInfo {...jiraUserData} />
                ) : (
                  <JiraLoginLink userEmail={userEmail} hasPaid={hasPaid} />
                )}
              </div>
              <div className="p-3">
                {slackUserData?.user_username || slackUserData?.user_email ? (
                  <InfoPanel
                    info={{
                      organization: slackUserData?.team_name,
                      user_avatar_url: slackUserData?.user_picture_url,
                      user_displayname: slackUserData?.user_real_name,
                      user_email: slackUserData?.user_email,
                      service_name: "Slack",
                    }}
                  />
                ) : (
                  <SlackLoginLink userEmail={userEmail} hasPaid={hasPaid} />
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

export default HomePage;
