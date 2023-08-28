import InfoPanel from "../components/dashboard/InfoPanel";
import JiraLoginLink from "../components/JiraLoginLink";
import SlackLoginLink from "../components/SlackLoginLink";
import GitHubLoginLink from "../components/GitHubLoginLink";
import GitLabLoginLink from "../components/GitLabLoginLink";
import BitbucketLoginLink from "../components/BitbucketLoginLink";
import LinearLoginLink from "../components/LinearLoginLink";
import NotionLoginLink from "./NotionLoginLink";
import ConfluenceLoginLink from "./ConfluenceLoginLink";
import AsanaLoginLink from "./AsanaLoginLink";

function LoginGrid({ userEmail, data }) {
  const services = [
    {
      name: "GitHub",
      dataProp: "github_data",
      loginComponent: <GitHubLoginLink userEmail={userEmail} />,
      type: "git_platforms",
    },
    {
      name: "Bitbucket",
      dataProp: "bitbucket_data",
      loginComponent: <BitbucketLoginLink userEmail={userEmail} />,
      type: "git_platforms",
    },
    {
      name: "GitLab",
      dataProp: "gitlab_data",
      loginComponent: <GitLabLoginLink userEmail={userEmail} />,
      type: "git_platforms",
    },

    {
      name: "Jira",
      dataProp: "jira_data",
      loginComponent: <JiraLoginLink userEmail={userEmail} />,
      type: "project_management",
    },
    {
      name: "Linear",
      dataProp: "linear_data",
      loginComponent: <LinearLoginLink userEmail={userEmail} />,
      type: "project_management",
    },

    {
      name: "Asana",
      dataProp: "asana_data",
      loginComponent: <AsanaLoginLink userEmail={userEmail} />,
      type: "project_management",
    },

    {
      name: "Slack",
      dataProp: "slack_data",
      loginComponent: <SlackLoginLink userEmail={userEmail} />,
      type: "internal_messaging",
    },

    {
      name: "Confluence",
      dataProp: "confluence_data",
      loginComponent: <ConfluenceLoginLink userEmail={userEmail} />,
      type: "documentation",
    },
    {
      name: "Notion",
      dataProp: "notion_data",
      loginComponent: <NotionLoginLink userEmail={userEmail} />,
      type: "documentation",
    },
  ];
  const typeToName = {
    git_platforms: "Git Platforms",
    project_management: "Project Management",
    internal_messaging: "Internal Messaging",
    documentation: "Documentation",
  };
  const groupedServices = services.reduce((acc, service) => {
    if (!acc[service.type]) {
      acc[service.type] = [];
    }
    acc[service.type].push(service);
    return acc;
  }, {});
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
          {Object.keys(groupedServices).map((type) => (
            <div key={type}>
              <div
                className="Subhead p-3"
                style={{
                  position: "sticky",
                  top: 0,
                  zIndex: 2,
                  backgroundColor: "var(--color-canvas-default)",
                }}
              >
                <h2 className="Subhead-heading">{typeToName[type]}</h2>
              </div>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fit, minmax(350px, 1fr))",
                }}
              >
                {groupedServices[type].map((service) => (
                  <div key={service.name} className="p-3">
                    {data?.[service.dataProp] ? (
                      <InfoPanel
                        info={{
                          ...JSON.parse(data[service.dataProp]),
                          service_name: service.name,
                        }}
                      />
                    ) : (
                      service.loginComponent
                    )}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
export default LoginGrid;
