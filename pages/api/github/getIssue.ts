import { Octokit } from "octokit";
import getToken from "../../../utils/db/github/getToken";

export default async function handler(req, res) {
  let { user, repo, owner, issue_number } = req.body;
  if (!user) {
    return res.send({ error: "no user" });
  }
  if (!repo) {
    return res.send({ error: "no repo" });
  }
  if (!owner) {
    return res.send({ error: "no owner" });
  }
  if (!issue_number) {
    return res.send({ error: "no issue_number" });
  }
  let { access_token, login } = await getToken(user);
  const octokit = new Octokit({
    auth: access_token,
  });
  try {
    let issue = await octokit.rest.issues.listForRepo({
      owner,
      repo,
      issue_number,
    });
    return res.send(issue.data);
  } catch (error) {
    return res.send({ error });
  }
}
