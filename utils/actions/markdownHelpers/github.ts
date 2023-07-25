import { MarkdownRequest, MarkdownResponse } from "../../../types/watermelon";

const githubMarkdown = ({
  amount,
  value,
  userLogin,
}: MarkdownRequest): MarkdownResponse => {
  if (!amount) {
    return `\n GitHub PRs deactivated by ${userLogin}`;
  }
  if (value?.error === "no github token") {
    return `\n [Click here to login to GitHub](https://app.watermelontools.com)`;
  }
  let markdown: MarkdownResponse = `\n ### GitHub PRs`;
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

export default githubMarkdown;
