import { MarkdownRequest, MarkdownResponse } from "../../../types/watermelon";

const githubMarkdown = ({
  amount,
  value,
  userLogin,
}: MarkdownRequest): MarkdownResponse => {
  let markdown: MarkdownResponse = "";

  markdown += `\n ### GitHub PRs`;
  if (amount) {
    if (!Array.isArray(value) && value?.error === "no github token") {
      markdown += `\n No results found :(`;
    } else if (Array.isArray(value) && value?.length) {
      for (let index = 0; index < value?.length; index++) {
        const element = value[index];
        markdown += `\n - [#${element.number} - ${element.title}](${element.html_url}) \n`;
      }
    }
  } else {
    markdown += `GitHub PRs deactivated by ${userLogin}`;

    markdown += `\n`;
  }
  return markdown;
};

export default githubMarkdown;
