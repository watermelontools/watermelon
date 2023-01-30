import getToken from "../../../utils/gitlab/refreshTokens";
import getIssuesByCommits from "../../../utils/gitlab/getIssuesByCommits";
import addToGitHubQueryCount from "../../../utils/db/github/addToGitHubQueryCount";
import getGitHubQueryCountStatusByEmail from "../../../utils/db/github/getGitHubQueryCountStatusByEmail";

export default async function handler(req, res) {
  let { user, project_name, owner, commitList } = req.body;
  if (!user) {
    return res.send({ error: "no user" });
  }
  if (!owner) {
    return res.send({ error: "no owner" });
  }
  if (!project_name) {
    return res.send({ error: "no project_name" });
  }
  if (!commitList) {
    return res.send({ error: "no commitList" });
  }
  let { access_token } = await getToken({ user });
  
  // if the gitlab query count for the user with that email address is over 50 and the user hasn't paid, return an error
  let { hasPaid, git_query_count } = await getGitHubQueryCountStatusByEmail(
    user
  );
  if (git_query_count > 50 && !hasPaid) {
    return res.send({ error: "Context query limit reached" });
  }


  try {
    let issues = await getIssuesByCommits({
      access_token,
      project_name,
      owner,
      commitList,
    });

    addToGitHubQueryCount(user);

    return res.send(issues);
  } catch (error) {
    return res.send({ error });
  }
}
