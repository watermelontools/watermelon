import { StandardAPIResponse } from "../../types/watermelon";
import searchMessageByText from "../../utils/slack/searchMessageByText";
async function getSlack({
  title,
  body,
  slack_token,
  randomWords,
  amount = 3,
}): Promise<StandardAPIResponse> {
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
  return {
    fullData: slackValue,
    data:
      slackValue?.map(({ permalink, username, channel, text }) => ({
        title: username,
        link: permalink,
        number: channel.name,
        body: text,
      })) || [],
  };
}
export default getSlack;
