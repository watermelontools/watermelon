import getConversationReplies from "../../../utils/slack/getConversationReplies";
import getToken from "../../../utils/db/slack/getToken";
export default async function handler(req, res) {
  let { user, channelId, ts } = req.body;

  if (!user) {
    return res.send({ error: "no user" });
  }
  if (!channelId) {
    return res.send({ error: "no channelId" });
  }
  if (!ts) {
    return res.send({ error: "no ts" });
  }
  let { user_token } = await getToken({ user });

  let response = await getConversationReplies({
    ts,
    user_token,
    channelId,
  });

  return res.send(response);
}