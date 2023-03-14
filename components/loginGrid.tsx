import InfoPanel from "../components/dashboard/InfoPanel";
import JiraLoginLink from "../components/JiraLoginLink";
import SlackLoginLink from "../components/SlackLoginLink";
import GitHubLoginLink from "../components/GitHubLoginLink";
import GitLabLoginLink from "../components/GitLabLoginLink";
import BitbucketLoginLink from "../components/BitbucketLoginLink";

import getJiraInfo from "../utils/api/getJiraInfo";
import getGitHubInfo from "../utils/api/getGitHubInfo";
import getSlackInfo from "../utils/api/getSlackInfo";
import getBitbucketInfo from "../utils/api/getBitbucketInfo";
import getGitLabInfo from "../utils/api/getGitLabInfo";
import getPaymentInfo from "../utils/api/getPaymentInfo";
import { useEffect, useState } from "react";

function LoginGrid({ userEmail }) {
  const [jiraUserData, setJiraUserData] = useState(null);
  const [githubUserData, setGithubUserData] = useState(null);
  const [bitbucketUserData, setBitbucketUserData] = useState(null);
  const [gitlabUserData, setGitlabUserData] = useState(null);
  const [slackUserData, setSlackUserData] = useState(null);
  const [hasPaid, setHasPaid] = useState(false);

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
      getPaymentInfo(userEmail).then((data) => {
        setHasPaid(data);
      });
    }
  }, [userEmail]);
  return (
    <div
      style={{
        width: "100%",
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(350px, 1fr))",
      }}
    >
      {userEmail && (
        <div>
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
                <InfoPanel
                  info={{
                    organization: bitbucketUserData?.organization,
                    user_avatar_url: bitbucketUserData?.avatar_url,
                    user_displayname: bitbucketUserData?.name,
                    user_email: bitbucketUserData?.email,
                    service_name: "Bitbucket",
                  }}
                />
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
                <JiraLoginLink userEmail={userEmail} />
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
                <SlackLoginLink userEmail={userEmail} />
              )}
            </div>
          </div>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(350px, 1fr))",
            }}
          ></div>
        </div>
      )}
    </div>
  );
}
export default LoginGrid;
