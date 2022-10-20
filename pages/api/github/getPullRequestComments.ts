import { Octokit } from "octokit";
import getToken from "../../../utils/db/github/getToken";

export default async function handler(req, res) {
  let { user, owner, repo, pull_number } = req.body;
  if (!user) {
    return res.send({ error: "no user" });
  }
  if (!repo) {
    return res.send({ error: "no repo" });
  }
  if (!owner) {
    return res.send({ error: "no owner" });
  }
  if (!pull_number) {
    return res.send({ error: "no pull_number" });
  }
  let { access_token } = await getToken(user);
  const octokit = new Octokit({
    auth: access_token,
  });
  let comments = await octokit.rest.pulls.listReviewComments({
    owner,
    repo,
    pull_number,
  });
  return res.send(comments.data);
}
