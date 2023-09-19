import { MarkdownRequest, MarkdownResponse } from "../../../types/watermelon";

type generalMarkdown = MarkdownRequest & {
  systemName: string;
  systemResponseName: string;
};
const generalMarkdownHelper = ({
  value,
  userLogin,
  systemName,
  systemResponseName,
}: generalMarkdown): MarkdownResponse => {
  if (!value || value?.data?.length === 0) {
    return `\n ${systemResponseName} deactivated by ${userLogin}`;
  }
  if (value?.error?.match(/no (\w+) token/)) {
    return `\n [Click here to login to ${systemName}](https://app.watermelontools.com)`;
  }
  let markdown: MarkdownResponse = ``;
  if (Array.isArray(value.data) && value?.data?.length) {
    markdown = `\n #### ${systemResponseName}`;

    console.log("value.data", value.data[0]);

    if (systemName === "GitHub") {
      markdown += (value?.data || [])
        .map(
          ({ number, title, link, body, created_at }) =>
            `\n - [#${number} - ${title}](${link}) - On ${created_at} \n`
        )
        .join("");
    } else {
      markdown += (value?.data || [])
        .map(
          ({ number, title, link, body }) =>
            `\n - [#${number} - ${title}](${link})\n`
        )
        .join("");
    }
  } else {
    markdown += `\n No results found in **${systemResponseName}** :( \n`;
  }
  return markdown;
};

export default generalMarkdownHelper;
