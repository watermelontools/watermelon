import getAssignedIssues from "../../../utils/gitlab/getAssignedIssues";
import getToken from "../../../utils/gitlab/refreshTokens";
import getUser from "../../../utils/db/gitlab/getUser";
export default async function handler(req, res) {
  let { user, project_id } = req.body;
  if (!user) {
    return res.send({ error: "no user" });
  }
  if (!project_id) {
    return res.send({ error: "no project_id" });
  }
  let { access_token } = await getToken({ user });
  let { id } = await getUser(user);
  try {
    let issues = await getAssignedIssues({
      access_token,
      userId: id,
      project_id,
    });
    return res.send(issues);
  } catch (error) {
    return res.send({ error });
  }
}
