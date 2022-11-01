import commentOnJiraTicket from "../../../utils/jira/commentOnJiraTicket";
import getToken from "../../../utils/jira/refreshTokens";
export default async function handler(req, res) {
  let { user, issueIdOrKey, text } = req.body;

  if (!user) {
    return res.send({ error: "no user" });
  }
  if (!issueIdOrKey) {
    return res.send({ error: "no issueIdOrKey" });
  }
  if (!text) {
    return res.send({ error: "no text" });
  }
  let { access_token, cloudId } = await getToken({ user });

  let response = await commentOnJiraTicket({
    issueIdOrKey,
    text,
    access_token,
    cloudId,
  });

  return res.send(response);
}
