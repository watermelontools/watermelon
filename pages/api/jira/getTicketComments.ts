import getTicketComments from "../../../utils/jira/getTicketComments";
import getToken from "../../../utils/jira/refreshTokens";
export default async function handler(req, res) {
  let { user, issueIdOrKey } = req.body;

  if (!user) {
    return res.send({ error: "no user" });
  }
  if (!issueIdOrKey) {
    return res.send({ error: "no issueIdOrKey" });
  }
  let { access_token, cloudId } = await getToken({ user });

  let response = await getTicketComments({
    issueIdOrKey,
    access_token,
    cloudId,
  });

  return res.send(response);
}
