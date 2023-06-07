import searchMessageByText from "../../utils/slack/searchMessageByText";
type SlackResult = { error: string } | any[];
async function getSlack({
  title,
  body,
  slack_token,
  randomWords,
  amount = 3,
}): Promise<SlackResult> {
  let slackValue;

  if (!slack_token) {
    slackValue = { error: "no slack token" };
  } else {
    let response = await searchMessageByText({
      text: `${title}`,
      user_token: slack_token,
    });
    let publicMessages = response.messages.matches.filter(
      (message) => !message.channel.is_private
    );
    slackValue = publicMessages?.matches?.slice(0, amount);
  }
  return slackValue;
}
export default getSlack;
