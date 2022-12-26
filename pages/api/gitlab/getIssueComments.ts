import getIssueComments from "../../../utils/gitlab/getIssueComments";
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
    let issueComments = await getIssueComments({
      access_token,
      issue_iid,
      project_id,
    });
    console.log(issueComments);
    return res.send(issueComments);
  } catch (error) {
    return res.send({ error });
  }
}
