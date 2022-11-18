import { Octokit } from "octokit";
import getToken from "../../../utils/db/github/getToken";

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
  let q= `repo:${owner}/${repo}+hash:${commitList}`
  try {
    let issues = await octokit.rest.search.issuesAndPullRequests({
        q,
        is: "pr",
        type: "pr"
    })

    return res.send(issues.data);
  } catch (error) {
    return res.send({ error });
  }
}
