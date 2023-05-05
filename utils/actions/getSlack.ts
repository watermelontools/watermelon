import searchMessageByText from "../../utils/slack/searchMessageByText";
async function getSlack({
  title,
  body,
  slack_token,
  randomWords,
}): Promise<any[] | { error: string }> {
  let slackValue;

  if (!slack_token) {
    slackValue = { error: "no slack token" };
  } else {
    let response = await searchMessageByText({
      text: `${title}`,
      user_token: slack_token,
    });
    slackValue = response?.messages?.matches.slice(0, 3);
  }
  return slackValue;
}
export default getSlack;
