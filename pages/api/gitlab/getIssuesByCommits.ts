import getToken from "../../../utils/gitlab/refreshTokens";
import getIssuesByCommits from "../../../utils/gitlab/getIssuesByCommits";

export default async function handler(req, res) {
  let { user, project_id, commitList } = req.body;
  if (!user) {
    return res.send({ error: "no user" });
  }
  if (!project_id) {
    return res.send({ error: "no project_id" });
  }
  if (!commitList) {
    return res.send({ error: "no commitList" });
  }
  let { access_token } = await getToken({ user });
  try {
    let issues = await getIssuesByCommits({
      access_token,
      project_id,
      commitList,
    });
    return res.send(issues);
  } catch (error) {
    return res.send({ error });
  }
}
