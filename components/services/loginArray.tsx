import SlackLoginLink from "../SlackLoginLink";
import NotionLoginLink from "../NotionLoginLink";
import ConfluenceLoginLink from "../ConfluenceLoginLink";
import JiraLoginLink from "../JiraLoginLink";
import GitHubLoginLink from "../GitHubLoginLink";
import LinearLoginLink from "../LinearLoginLink";
import BitbucketLoginLink from "../BitbucketLoginLink";
import GitLabLoginLink from "../GitLabLoginLink";
import AsanaLoginLink from "../AsanaLoginLink";
export default function LoginArray({ nameList, userEmail, userData }) {
  const services = [
    {
      name: "Jira",
      dataProp: "jira_data",
      loginComponent: <JiraLoginLink userEmail={userEmail} />,
    },
    {
      name: "Linear",
      dataProp: "linear_data",
      loginComponent: <LinearLoginLink userEmail={userEmail} />,
    },
    {
      name: "Slack",
      dataProp: "slack_data",
      loginComponent: <SlackLoginLink userEmail={userEmail} />,
    },
    {
      name: "Confluence",
      dataProp: "confluence_data",
      loginComponent: <ConfluenceLoginLink userEmail={userEmail} />,
    },
    {
      name: "Notion",
      dataProp: "notion_data",
      loginComponent: <NotionLoginLink userEmail={userEmail} />,
    },
    {
      name: "GitHub",
      dataProp: "github_data",
      loginComponent: <GitHubLoginLink userEmail={userEmail} />,
    },
    {
      name: "Bitbucket",
      dataProp: "bitbucket_data",
      loginComponent: <BitbucketLoginLink userEmail={userEmail} />,
    },
    {
      name: "GitLab",
      dataProp: "gitlab_data",
      loginComponent: <GitLabLoginLink userEmail={userEmail} />,
    },
    {
      name: "Asana",
      dataProp: "asana_data",
      loginComponent: <AsanaLoginLink userEmail={userEmail} />,
    },
  ];
  const loginArray = services
    .filter((service) => nameList.includes(service.name))
    .map((service) =>
      userData?.[service.dataProp] ? null : service.loginComponent
    )
    .filter((component) => component !== null);
  return loginArray;
}
