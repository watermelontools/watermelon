import ServiceLoginLink from "./loginLink";
export function SelectedServiceLoginLink({ service, userEmail }) {
  switch (service) {
    case "Jira":
      return (
        <ServiceLoginLink
          link={`https://auth.atlassian.com/authorize?audience=api.atlassian.com&client_id=VUngRAClu8ZE56vxXCFBocTxCTLEUQTT&scope=offline_access%20read%3Ajira-work%20read%3Ajira-user%20write%3Ajira-work&redirect_uri=https%3A%2F%2Fapp.watermelontools.com%2Fatlassian&state=${
            "j" + userEmail
          }&response_type=code&prompt=consent`}
          logoName="jira"
          serviceName="Jira"
          serviceText="View your Most Relevant Ticket and Active Tickets"
        />
      );
    case "Linear":
      return (
        <ServiceLoginLink
          link={`https://linear.app/oauth/authorize?client_id==${process.env.LINEAR_CLIENT_ID}&scope=read%20issues:create%20comments:create&redirect_uri=https://app.watermelontools.com/linear&state=${userEmail}&response_type=code&prompt=consent&actor=application`}
          logoName="linear"
          serviceName="Linear"
          serviceText="View your Most Relevant Tickets"
        />
      );
    case "Slack":
      return (
        <ServiceLoginLink
          link={`https://slack.com/oauth/v2/authorize?client_id=${process.env.SLACK_CLIENT_ID}&scope=chat:write,chat:write.customize,incoming-webhook,channels:history,groups:history,users:read&user_scope=chat:write,channels:history,groups:history,identify,search:read,users:read&state=${userEmail}`}
          logoName="slack"
          serviceName="Slack"
          serviceText="View your Most Relevant Threads and Groups"
        />
      );
    case "GitLab":
      return (
        <ServiceLoginLink
          link={`https://gitlab.com/oauth/authorize?client_id=${process.env.GITLAB_CLIENT_ID}&redirect_uri=https://app.watermelontools.com/gitlab&response_type=code&state=${userEmail}&scope=api%20read_api%20read_user%20read_repository%20write_repository%20read_registry%20openid%20profile%20email`}
          logoName="gitlab"
          serviceName="GitLab"
          serviceText="View your Assigned Issues and Relevant Merge Requests"
        />
      );
    case "Bitbucket":
      return (
        <ServiceLoginLink
          link={`https://bitbucket.org/site/oauth2/authorize?client_id=${process.env.BITBUCKET_CLIENT_ID}&response_type=code&state=${userEmail}&redirect_uri=https://app.watermelontools.com/bitbucket`}
          logoName="bitbucket"
          serviceName="Bitbucket"
          serviceText="View your Assigned Issues and Relevant Pull Requests"
        />
      );
    case "GitHub":
      return (
        <ServiceLoginLink
          link={`https://github.com/login/oauth/authorize?client_id=${process.env.GITHUB_CLIENT_ID}&redirect_uri=https://app.watermelontools.com/github&state=${userEmail}&scope=repo%20user%20notifications`}
          logoName="github"
          serviceName="GitHub"
          serviceText="View your Assigned Issues and Relevant Pull Requests"
        />
      );
    case "Notion":
      return (
        <ServiceLoginLink
          link={`https://api.notion.com/v1/oauth/authorize?client_id=${process.env.NOTION_CLIENT_ID}&response_type=code&owner=user&redirect_uri=https%3A%2F%2Fapp.watermelontools.com%2Fnotion&state=${userEmail}`}
          logoName="notion"
          serviceName="Notion"
          serviceText="View your Most Relevant Documents and Blocks"
        />
      );
    case "Confluence":
      return (
        <ServiceLoginLink
          link={`https://auth.atlassian.com/authorize?audience=api.atlassian.com&client_id=${
            process.env.CONFLUENCE_CLIENT_ID
          }&scope=offline_access%20read%3Acontent%3Aconfluence%20read%3Acontent-details%3Aconfluence%20read%3Ablogpost%3Aconfluence%20read%3Acomment%3Aconfluence%20read%3Auser%3Aconfluence%20read%3Auser.property%3Aconfluence%20read%3Ainlinetask%3Aconfluence&redirect_uri=https%3A%2F%2Fapp.watermelontools.com%2Fatlassian&state=${
            "c" + userEmail
          }&response_type=code&prompt=consent`}
          logoName="confluence"
          serviceName="Confluence"
          serviceText="View your Most Relevant Documents"
        />
      );
    default:
      return <div>Not Found</div>;
  }
}

export default function LoginArray({ nameList, userEmail, userData }) {
  const services = [
    {
      name: "Jira",
      dataProp: "jira_data",
      loginComponent: (
        <SelectedServiceLoginLink service="Jira" userEmail={userEmail} />
      ),
    },
    {
      name: "Linear",
      dataProp: "linear_data",
      loginComponent: (
        <SelectedServiceLoginLink service="Linear" userEmail={userEmail} />
      ),
    },
    {
      name: "Slack",
      dataProp: "slack_data",
      loginComponent: (
        <SelectedServiceLoginLink service="Slack" userEmail={userEmail} />
      ),
    },
    {
      name: "Confluence",
      dataProp: "confluence_data",
      loginComponent: (
        <SelectedServiceLoginLink service="Confluence" userEmail={userEmail} />
      ),
    },
    {
      name: "Notion",
      dataProp: "notion_data",
      loginComponent: (
        <SelectedServiceLoginLink service={"Notion"} userEmail={userEmail} />
      ),
    },
    {
      name: "GitHub",
      dataProp: "github_data",
      loginComponent: (
        <SelectedServiceLoginLink service={"GitHub"} userEmail={userEmail} />
      ),
    },
    {
      name: "Bitbucket",
      dataProp: "bitbucket_data",
      loginComponent: (
        <SelectedServiceLoginLink service={"Bitbucket"} userEmail={userEmail} />
      ),
    },
    {
      name: "GitLab",
      dataProp: "gitlab_data",
      loginComponent: (
        <SelectedServiceLoginLink service={"GitLab"} userEmail={userEmail} />
      ),
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
