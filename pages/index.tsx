import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import LogInBtn from "../components/login-btn";
import InfoPanel from "../components/dashboard/InfoPanel";
import JiraLoginLink from "../components/JiraLoginLink";
import GitHubLoginLink from "../components/GitHubLoginLink";
import BitbucketLoginLink from "../components/BitbucketLoginLink";
import getGitHubInfo from "../utils/api/getGitHubInfo";
import getBitbucketInfo from "../utils/api/getBitbucketInfo";
import getJiraInfo from "../utils/api/getJiraInfo";
import ComingSoonService from "../components/dashboard/ComingSoonService";
import Header from "../components/Header";
import DownloadExtension from "../components/dashboard/DownloadExtension";
import getSlackInfo from "../utils/api/getSlackInfo";
import getGitLabInfo from "../utils/api/getGitLabInfo";
import SlackLoginLink from "../components/SlackLoginLink";
import BitbucketInfo from "../components/dashboard/BitbucketInfo";
import GitLabLoginLink from "../components/GitLabLoginLink";
function HomePage({}) {
  const [userEmail, setUserEmail] = useState(null);
  const [jiraUserData, setJiraUserData] = useState(null);
  const [githubUserData, setGithubUserData] = useState(null);
  const [bitbucketUserData, setBitbucketUserData] = useState(null);
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

      getBitbucketInfo(userEmail).then((data) => {
        setBitbucketUserData(data);
      });
      getGitLabInfo(userEmail).then((data) => {
        setGitlabUserData(data);
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
                  <InfoPanel
                    info={{
                      organization: githubUserData?.company,
                      user_avatar_url: githubUserData?.avatar_url,
                      user_displayname: githubUserData?.name,
                      user_email: githubUserData?.email,
                      service_name: "GitHub",
                    }}
                  />
                ) : (
                  <GitHubLoginLink userEmail={userEmail} />
                )}
              </div>

              <div className="p-3">
                {bitbucketUserData?.name || bitbucketUserData?.email ? (
                  <BitbucketInfo {...bitbucketUserData} />
                ) : (
                  <BitbucketLoginLink userEmail={userEmail} />
                )}
              </div>

              <div className="p-3">
                {gitlabUserData?.name || gitlabUserData?.email ? (
                  <InfoPanel
                    info={{
                      organization: gitlabUserData?.organization,
                      user_avatar_url: gitlabUserData?.avatar_url,
                      user_displayname: gitlabUserData?.name,
                      user_email: gitlabUserData?.email,
                      service_name: "GitLab",
                    }}
                  />
                ) : (
                  <GitLabLoginLink userEmail={userEmail} />
                )}
              </div>
              <div className="p-3">
                {jiraUserData?.organization ? (
                  <InfoPanel
                    info={{
                      organization: jiraUserData?.organization,
                      user_avatar_url: jiraUserData?.user_avatar_url,
                      user_displayname: jiraUserData?.user_displayname,
                      user_email: jiraUserData?.user_email,
                      service_name: "Jira",
                    }}
                  />
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
                  urlStart="vscode"
                  accessToken={session.user.name}
                />
              </div>
              <div className="p-3">
                <DownloadExtension
                  name="VSCode Insiders"
                  urlStart="vscode-insiders"
                  email={userEmail}
                  accessToken={session.user.name}
                />
              </div>
              <div className="p-3">
                <DownloadExtension
                  name="VSCodium"
                  urlStart="vscodium"
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
