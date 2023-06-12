const slackMarkdown = ({ slackValue }: { slackValue: any }) => {
  let markdown = "";

  if (!Array.isArray(slackValue) || !slackValue.length) {
    markdown += `\n No results found :( \n`;
  } else {
    for (let index = 0; index < slackValue.length; index++) {
      const element = slackValue[index];
      markdown += `\n - [${element.channel.name} - ${element.username}\n ${
        element.text.length > 100
          ? element.text.substring(0, 100) + "..."
          : element.text
      }](${element.permalink}) \n`;
    }
  }
  return markdown;
};
