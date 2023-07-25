import { MarkdownRequest, MarkdownResponse } from "../../../types/watermelon";

type generalMarkdown = MarkdownRequest & {
  systemName: string;
  systemResponseName: string;
};
const generalMarkdownHelper = ({
  amount,
  value,
  userLogin,
  systemName,
  systemResponseName,
}: generalMarkdown): MarkdownResponse => {
  if (!amount) {
    return `\n ${systemResponseName} deactivated by ${userLogin}`;
  }
  if (value?.error?.match(/no (\w+) token/)) {
    return `\n [Click here to login to ${systemName}](https://app.watermelontools.com)`;
  }
  let markdown: MarkdownResponse = `\n ### ${systemResponseName}`;
  if (Array.isArray(value.data) && value?.data?.length) {
    markdown += (value?.data || [])
      .map(
        ({ number, title, link }) =>
          `\n - [${number ? `#${number} - ` : ""}${title}](${link}) \n`
      )
      .join("");
  } else {
    markdown += `\n No results found :(`;
  }
  return markdown;
};

export default generalMarkdownHelper;
