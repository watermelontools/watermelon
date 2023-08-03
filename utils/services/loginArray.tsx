import SlackLoginLink from "../../components/SlackLoginLink";
import NotionLoginLink from "../../components/NotionLoginLink";
import ConfluenceLoginLink from "../../components/ConfluenceLoginLink";
import JiraLoginLink from "../../components/JiraLoginLink";
import GitHubLoginLink from "../../components/GitHubLoginLink";
import LinearLoginLink from "../../components/LinearLoginLink";
import BitbucketLoginLink from "../../components/BitbucketLoginLink";
import GitLabLoginLink from "../../components/GitLabLoginLink";
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
  ];
  const loginArray = services
    .filter((service) => nameList.includes(service.name))
    .map((service) =>
      userData?.[service.dataProp] ? null : service.loginComponent
    )
    .filter((component) => component !== null);
  return loginArray;
}
