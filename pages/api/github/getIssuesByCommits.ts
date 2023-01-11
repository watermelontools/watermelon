import { Octokit } from "octokit";
import getToken from "../../../utils/db/github/getToken";
import addToGitHubQueryCount from "../../../utils/db/github/addToGitHubQueryCount";
import getGitHubQueryCountStatusByEmail from "../../../utils/db/github/getGitHubQueryCountStatusByEmail";

export default async function handler(req, res) {
  let { user, repo, owner, commitList } = req.body;
  if (!user) {
    return res.send({ error: "no user" });
  }
  if (!repo) {
    return res.send({ error: "no repo" });
  }
  if (!owner) {
    return res.send({ error: "no owner" });
  }
  if (!commitList) {
    return res.send({ error: "no commitList" });
  }
  let { access_token, login } = await getToken(user);
  const octokit = new Octokit({
    auth: access_token,
  });
  let q = `repo:${owner}/${repo}+hash:${commitList}`;

  // if the github query count for the user with that email address is over 50 and the user hasn't paid, return an error
  let { hasPaid, git_query_count } = await getGitHubQueryCountStatusByEmail(
    user
  );
  if (git_query_count > 50 && !hasPaid) {
    return res.send({ error: "GitHub query limit reached" });
  }

  try {
    let issues = await octokit.rest.search.issuesAndPullRequests({
      q,
      is: "pr",
      type: "pr",
    });

    addToGitHubQueryCount(user);

    return res.send(issues.data);
  } catch (error) {
    return res.send({ error });
  }
}
