import { MarkdownRequest, MarkdownResponse } from "../../../types/watermelon";

const jiraMarkdown = ({
  amount,
  value,
  userLogin,
}: MarkdownRequest): MarkdownResponse => {
  if (!amount) {
    return `\n Jira Tickets deactivated by ${userLogin}`;
  }

  if (value?.error === "no jira token") {
    return `\n [Click here to login to Jira](https://app.watermelontools.com)`;
  }

  let markdown: MarkdownResponse = `\n ### Jira Tickets`;

  if (Array.isArray(value.data) && value?.data?.length) {
    markdown += (value?.data || [])
      .map(
        ({ number, title, link }) => `\n - [#${number} - ${title}](${link}) \n`
      )
      .join("");
  } else {
    markdown += `\n No results found :(`;
  }
  return markdown;
};

export default jiraMarkdown;
