import searchMessageByText from "../../utils/slack/searchMessageByText";
const getSlackData = async ({ slack_token, amount, title }) => {
  let slackValue;
  let response = await searchMessageByText({
    text: `${title}`,
    user_token: slack_token,
    count: amount,
  });
  let publicMessages = response.messages.matches.filter(
    (message) => !message.channel.is_private
  );
  slackValue = publicMessages?.matches;
  return slackValue;
};

async function getSlack({
  title,
  body,
  slack_token,
  randomWords,
  amount = 3,
  userLogin,
}: {
  title: string;
  body: string;
  slack_token: string;
  randomWords: string[];
  amount?: number;
  userLogin: string;
}): Promise<string> {
  let markdown = `\n ### Slack Threads \n`;

  if (!slack_token) {
    markdown += `\n Error - no slack token \n`;
    return markdown;
  }
  if (!amount) {
    markdown += `\n Slack Threads deactivated by ${userLogin} \n`;
    return markdown;
  }
  let slackValue = await getSlackData({ slack_token, amount, title });
  markdown += slackMarkdown({ slackValue });
  return markdown;
}
export default getSlack;
