const jiraMarkdown = ({
  JiraTickets,
  jiraValue,
  userLogin,
}: {
  JiraTickets: number;
  jiraValue: any;
  userLogin: string;
}) => {
  let markdown = `\n ### Jira Tickets`;
  if (JiraTickets) {
    if (jiraValue?.error === "no jira token") {
      markdown += `\n [Click here to login to Jira](https://app.watermelontools.com)`;
    } else {
      if (jiraValue?.length) {
        for (let index = 0; index < jiraValue.length; index++) {
          const element = jiraValue[index];
          markdown += `\n - [${element.key} - ${element.fields.summary}](${element.serverInfo.baseUrl}/browse/${element.key}) \n`;
        }
      } else {
        markdown += `\n No results found :(`;
      }
    }
  } else {
    markdown += `Jira Tickets deactivated by ${userLogin} \n`;
  }
  return markdown;
};
export default jiraMarkdown;
