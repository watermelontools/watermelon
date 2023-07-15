import InfoPanel from "../components/dashboard/InfoPanel";
import JiraLoginLink from "../components/JiraLoginLink";
import SlackLoginLink from "../components/SlackLoginLink";
import GitHubLoginLink from "../components/GitHubLoginLink";
import GitLabLoginLink from "../components/GitLabLoginLink";
import BitbucketLoginLink from "../components/BitbucketLoginLink";
import LinearLoginLink from "../components/LinearLoginLink";
import DiscordLoginLink from "./DiscordLoginLink";
import NotionLoginLink from "./NotionLoginLink";
import ConfluenceLoginLink from "./ConfluenceLoginLink";
type LoginGridProps = {
  userEmail: string;
  user_displayname: string;
};
function LoginGrid({ userEmail, data }) {
  let githubUserData: null | LoginGridProps = null;
  let bitbucketUserData: null | LoginGridProps = null;
  let gitlabUserData: null | LoginGridProps = null;
  let slackUserData: null | LoginGridProps = null;
  let jiraUserData: null | LoginGridProps = null;
  let confluenceUserData: null | LoginGridProps = null;
  let discordUserData: null | LoginGridProps = null;
  let notionUserData: null | LoginGridProps = null;
  let linearUserData: null | LoginGridProps = null;

  if (data?.github_data) {
    githubUserData = JSON.parse(data.github_data);
  }
  if (data?.bitbucket_data) {
    bitbucketUserData = JSON.parse(data.bitbucket_data);
  }
  if (data?.gitlab_data) {
    gitlabUserData = JSON.parse(data.gitlab_data);
  }
  if (data?.slack_data) {
    slackUserData = JSON.parse(data.slack_data);
  }
  if (data?.jira_data) {
    jiraUserData = JSON.parse(data.jira_data);
  }
  if (data?.confluence_data) {
    confluenceUserData = JSON.parse(data.confluence_data);
  }
  if (data?.discord_data) {
    discordUserData = JSON.parse(data.discord_data);
  }
  if (data?.notion_data) {
    notionUserData = JSON.parse(data.notion_data);
  }
  if (data?.linear_data) {
    linearUserData = JSON.parse(data.linear_data);
  }

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
              {githubUserData?.user_displayname ? (
                <InfoPanel
                  info={{
                    ...githubUserData,
                    service_name: "GitHub",
                  }}
                />
              ) : (
                <GitHubLoginLink userEmail={userEmail} />
              )}
            </div>
            <div className="p-3">
              {bitbucketUserData?.user_displayname ? (
                <InfoPanel
                  info={{
                    ...bitbucketUserData,
                    service_name: "Bitbucket",
                  }}
                />
              ) : (
                <BitbucketLoginLink userEmail={userEmail} />
              )}
            </div>
            <div className="p-3">
              {gitlabUserData?.user_displayname ? (
                <InfoPanel
                  info={{
                    ...gitlabUserData,
                    service_name: "GitLab",
                  }}
                />
              ) : (
                <GitLabLoginLink userEmail={userEmail} />
              )}
            </div>
            <div className="p-3">
              {jiraUserData?.user_displayname ? (
                <InfoPanel
                  info={{
                    ...jiraUserData,
                    service_name: "Jira",
                  }}
                />
              ) : (
                <JiraLoginLink userEmail={userEmail} />
              )}
            </div>
            <div className="p-3">
              {confluenceUserData?.user_displayname ? (
                <InfoPanel
                  info={{
                    ...confluenceUserData,
                    service_name: "Confluence",
                  }}
                />
              ) : (
                <ConfluenceLoginLink userEmail={userEmail} />
              )}
            </div>
            <div className="p-3">
              {slackUserData?.user_displayname ? (
                <InfoPanel
                  info={{
                    ...slackUserData,
                    service_name: "Slack",
                  }}
                />
              ) : (
                <SlackLoginLink userEmail={userEmail} />
              )}
            </div>
            <div className="p-3">
              {linearUserData?.user_displayname ? (
                <InfoPanel
                  info={{
                    ...linearUserData,
                    service_name: "Linear",
                  }}
                />
              ) : (
                <LinearLoginLink userEmail={userEmail} />
              )}
            </div>
            {/*         
  DISCORD DOES NOT ALLOW MESSAGE SEARCH, DEVELOPMENT PAUSED FOR NOW
  MAYBE READ THE LAST FEW DAYS?
    <div className="p-3">
              {discordUserData?.user_displayname ? (
                <InfoPanel
                  info={{
                    user_avatar_url: `https://cdn.discordapp.com/avatars/${discordUserData.id}/${discordUserData.avatar_url}`,
                    ...discordUserData,
                    service_name: "Discord",
                  }}
                />
              ) : (
                <DiscordLoginLink userEmail={userEmail} />
              )}
            </div> */}
            <div className="p-3">
              {notionUserData?.user_displayname ? (
                <InfoPanel
                  info={{
                    ...notionUserData,
                    service_name: "Notion",
                  }}
                />
              ) : (
                <NotionLoginLink userEmail={userEmail} />
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
