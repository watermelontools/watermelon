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
      count: amount,
    });
    slackValue = response.messages.matches.filter(
      (message) => !message.channel.is_private
    );
  }
  return {
    fullData: slackValue,
    data:
      slackValue?.map(({ permalink, username, channel, text }) => ({
        title:
          username +
          `: ${
            text.length && text?.length > 100
              ? text.substring(0, 100) + "..."
              : text
          } `,
        link: permalink,
        number: channel.name,
        body: text,
      })) || [],
  };
}
export default getSlack;
