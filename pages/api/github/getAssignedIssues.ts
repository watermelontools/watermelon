import { Octokit } from "octokit";
import getToken from "../../../utils/db/github/getToken";

export default async function handler(req, res) {
  let { user, repo, owner } = req.body;
  if (!user) {
    return res.send({ error: "no user" });
  }
  if (!repo) {
    return res.send({ error: "no repo" });
  }
  if (!owner) {
    return res.send({ error: "no owner" });
  }
  let { access_token, login } = await getToken(user);
  const octokit = new Octokit({
    auth: access_token,
  });
  try {
    let issues = await octokit.rest.issues.listForRepo({
      owner,
      repo,
      state: "open",
      assignee: login,
    });
    return res.send(issues.data);
  } catch (error) {
    return res.send({ error });
  }
}
