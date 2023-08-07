import InfoPanel from "../components/dashboard/InfoPanel";
import DiscordLoginLink from "./DiscordLoginLink";
import { SelectedServiceLoginLink } from "./services/loginArray";
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
          <div>
            <div
              className="Subhead p-3"
              style={{
                position: "sticky",
                top: 0,
                zIndex: 2,
                backgroundColor: "var(--color-canvas-default)",
              }}
            >
              <h2 className="Subhead-heading">Git Platforms</h2>
            </div>
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
                  <SelectedServiceLoginLink
                    service="GitHub"
                    userEmail={userEmail}
                  />
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
                  <SelectedServiceLoginLink
                    service="Bitbucket"
                    userEmail={userEmail}
                  />
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
                  <SelectedServiceLoginLink
                    service="GitLab"
                    userEmail={userEmail}
                  />
                )}
              </div>
            </div>
            <a
              href="https://github.com/apps/watermelon-context"
              target="_blank"
            >
              <div className="Box d-flex flex-items-center flex-justify-start m-3 p-2">
                <img className="avatar avatar-8" src="/logos/github.svg" />
                <div className="p-2">
                  <h2>Try our GitHub App</h2>
                  <p>Context on each Pr</p>
                </div>
              </div>
            </a>
          </div>
          <div>
            <div
              className="Subhead p-3"
              style={{
                position: "sticky",
                top: 0,
                zIndex: 2,
                backgroundColor: "var(--color-canvas-default)",
              }}
            >
              <h2 className="Subhead-heading">Internal Messaging</h2>
            </div>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(350px, 50%))",
              }}
            >
              <div className="p-3">
                {slackUserData?.user_displayname ? (
                  <InfoPanel
                    info={{
                      ...slackUserData,
                      service_name: "Slack",
                    }}
                  />
                ) : (
                  <SelectedServiceLoginLink
                    service="Slack"
                    userEmail={userEmail}
                  />
                )}
              </div>
            </div>
          </div>
          <div>
            <div
              className="Subhead p-3"
              style={{
                position: "sticky",
                top: 0,
                zIndex: 2,
                backgroundColor: "var(--color-canvas-default)",
              }}
            >
              <h2 className="Subhead-heading">Project Management</h2>
            </div>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(350px, 50%))",
              }}
            >
              <div className="p-3">
                {jiraUserData?.user_displayname ? (
                  <InfoPanel
                    info={{
                      ...jiraUserData,
                      service_name: "Jira",
                    }}
                  />
                ) : (
                  <SelectedServiceLoginLink
                    service="Jira"
                    userEmail={userEmail}
                  />
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
                  <SelectedServiceLoginLink
                    service="Linear"
                    userEmail={userEmail}
                  />
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
            </div>
          </div>
          <div>
            <div
              className="Subhead p-3"
              style={{
                position: "sticky",
                top: 0,
                zIndex: 2,
                backgroundColor: "var(--color-canvas-default)",
              }}
            >
              <h2 className="Subhead-heading">Documentation</h2>
            </div>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(350px, 50%))",
              }}
            >
              <div className="p-3">
                {notionUserData?.user_displayname ? (
                  <InfoPanel
                    info={{
                      ...notionUserData,
                      service_name: "Notion",
                    }}
                  />
                ) : (
                  <SelectedServiceLoginLink
                    service={"Notion"}
                    userEmail={userEmail}
                  />
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
                  <SelectedServiceLoginLink
                    service={"Confluence"}
                    userEmail={userEmail}
                  />
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
export default LoginGrid;
