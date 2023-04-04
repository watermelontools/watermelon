import searchMessageByText from "../../utils/slack/searchMessageByText";
async function getSlack({ title, body, slack_token, randomWords }) {
  let slackValue = {};
  if (slack_token) {
    let response = await searchMessageByText({
      text: `${randomWords.toString()} OR ${title} OR  ${body}`,
      user_token: slack_token,
    });

    slackValue = response.messages.matches.slice(0, 3);
  } else {
    slackValue = { error: "no slack token" };
  }
  return slackValue;
}
export default getSlack;
