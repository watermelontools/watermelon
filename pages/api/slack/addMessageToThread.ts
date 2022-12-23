import addMessageToThread from "../../../utils/slack/addMessageToThread";
import getToken from "../../../utils/db/slack/getToken";
export default async function handler(req, res) {
  let { user, channelId, text, threadTS, broadcast } = req.body;

  if (!user) {
    return res.send({ error: "no user" });
  }
  if (!channelId) {
    return res.send({ error: "no channelId" });
  }
  if (!text) {
    return res.send({ error: "no text" });
  }
  if (!threadTS) {
    return res.send({ error: "no threadTS" });
  }
  let { user_token } = await getToken({ user });

  let response = await addMessageToThread({
    text,
    user_token,
    channelId,
    threadTS,
    broadcast,
  });

  return res.send(response);
}
