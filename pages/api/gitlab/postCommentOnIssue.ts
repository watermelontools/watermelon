import getToken from "../../../utils/gitlab/refreshTokens";
import postCommentOnIssue from "../../../utils/gitlab/postCommentOnIssue";

export default async function handler(req, res) {
  let { user, issue_iid, owner, project_name, comment_body } = req.body;
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
  if (!comment_body) {
    return res.send({ error: "no comment_body" });
  }
  let { access_token } = await getToken({ user });
  try {
    let comment = await postCommentOnIssue({
      access_token,
      issue_iid,
      owner,
      project_name,
      comment_body: "🍉" + comment_body,
    });
    return res.send(comment);
  } catch (error) {
    return res.send({ error });
  }
}
