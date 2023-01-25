import searchMessageByText from "../../../utils/slack/searchMessageByText";
import getToken from "../../../utils/db/slack/getToken";
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
    return { error: "no access_token" };
  }
  let response = await searchMessageByText({
    text,
    user_token,
  });

  return res.send(response);
}
