const slackMarkdown = ({
  SlackMessages,
  slackValue,
  userLogin,
}: {
  SlackMessages: number;
  slackValue: any;
  userLogin: string;
}) => {
  let markdown = "";
  markdown += `\n`;

  markdown += "### Slack Threads";
  if (SlackMessages) {
    if (!Array.isArray(slackValue) && slackValue?.error === "no slack token") {
      markdown += `\n [Click here to login to Slack](https://app.watermelontools.com)`;
    } else if (Array.isArray(slackValue)) {
      if (slackValue?.length) {
        for (let index = 0; index < slackValue.length; index++) {
          const element = slackValue[index];
          markdown += `\n - [#${element.channel.name} - ${element.username}\n ${
            element.text.length > 100
              ? element.text.substring(0, 100) + "..."
              : element.text
          }](${element.permalink})`;
          markdown += `\n`;
        }
      } else {
        markdown += `\n No results found :(`;
      }
    }
  } else {
    markdown += `Slack Threads deactivated by ${userLogin}`;
    markdown += `\n`;
  }
  return markdown;
};
