import sendMessageToChannel from "../../../utils/slack/sendMessageToChannel";
import getToken from "../../../utils/db/slack/getToken";
export default async function handler(req, res) {
  let { user, channelId, text } = req.body;

  if (!user) {
    return res.send({ error: "no user" });
  }
  if (!channelId) {
    return res.send({ error: "no channelId" });
  }
  if (!text) {
    return res.send({ error: "no text" });
  }
  let { user_token } = await getToken({ user });

  let response = await sendMessageToChannel({
    text,
    user_token,
    channelId,
  });

  return res.send(response);
}
