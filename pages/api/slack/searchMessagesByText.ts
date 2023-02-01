import searchMessageByText from "../../../utils/slack/searchMessageByText";
import getToken from "../../../utils/db/slack/getToken";
import getConversationReplies from "../../../utils/slack/getConversationReplies";
export default async function handler(req, res) {
  let { user, text } = req.body;

  if (!user) {
    return res.send({ error: "no user" });
  }
  if (!text) {
    return res.send({ error: "no text" });
  }
  let { user_token } = await getToken({ user });
  if (!user_token) {
    return res.send({ error: "no access_token" });
  }
  let response = await searchMessageByText({
    text,
    user_token,
  });
  let repliesPromises = response.messages.matches.map(async (match, index) => {
    response.messages.matches[index].comments = [];
    let replies = await getConversationReplies({
      ts: match.ts,
      user_token: match.user_token,
      channelId: match.channel.id,
    });
    response.messages.matches[index].replies.push(...replies.messages);
  });
  await Promise.allSettled(repliesPromises);
  return res.send(response);
}
