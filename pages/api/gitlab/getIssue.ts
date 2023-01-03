import getIssue from "../../../utils/gitlab/getIssue";
import getToken from "../../../utils/gitlab/refreshTokens";

export default async function handler(req, res) {
  let { user, issue_iid, project_id } = req.body;
  if (!user) {
    return res.send({ error: "no user" });
  }
  if (!issue_iid) {
    return res.send({ error: "no issue_number" });
  }
  if (!project_id) {
    return res.send({ error: "no project_id" });
  }
  let { access_token } = await getToken({ user });
  try {
    let issue = await getIssue({ access_token, issue_iid, project_id });
    return res.send(issue);
  } catch (error) {
    return res.send({ error });
  }
}
