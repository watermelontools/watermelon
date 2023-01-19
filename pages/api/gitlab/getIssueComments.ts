import getIssueComments from "../../../utils/gitlab/getIssueComments";
import getToken from "../../../utils/gitlab/refreshTokens";

export default async function handler(req, res) {
  let { user, issue_iid, owner, project_name } = req.body;
  if (!user) {
    return res.send({ error: "no user" });
  }
  if (!issue_iid) {
    return res.send({ error: "no issue_number" });
  }
  if (!owner) {
    return res.send({ error: "no owner" });
  }
  if (!project_name) {
    return res.send({ error: "no project_name" });
  }
  let { access_token } = await getToken({ user });
  try {
    let issueComments = await getIssueComments({
      access_token,
      issue_iid,
      owner,
      project_name,
    });
    console.log(issueComments);
    return res.send(issueComments);
  } catch (error) {
    return res.send({ error });
  }
}
