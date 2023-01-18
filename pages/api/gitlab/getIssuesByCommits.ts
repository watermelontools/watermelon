import getToken from "../../../utils/gitlab/refreshTokens";
import getIssuesByCommits from "../../../utils/gitlab/getIssuesByCommits";

export default async function handler(req, res) {
  let { user, project_name, owner, commitList } = req.body;
  if (!user) {
    return res.send({ error: "no user" });
  }
  if (!owner) {
    return res.send({ error: "no owner"})
  }
  if (!project_name) {
    return res.send({ error: "no project_name" });
  }
  if (!commitList) {
    return res.send({ error: "no commitList" });
  }
  let { access_token } = await getToken({ user });
  try {
    let issues = await getIssuesByCommits({
      access_token,
      project_name,
      owner,
      commitList,
    });
    return res.send(issues);
  } catch (error) {
    return res.send({ error });
  }
}
