import { Octokit } from "octokit";
import getToken from "../../../utils/db/github/getToken";

export default async function handler(req, res) {
  let { user, owner, repo } = req.body;
  if (!user) {
    return res.send({ error: "no user" });
  }
  if (!repo) {
    return res.send({ error: "no repo" });
  }
  if (!owner) {
    return res.send({ error: "no owner" });
  }
  let { access_token } = await getToken(user);
  try {
    const octokit = new Octokit({
      auth: access_token,
    });
    let pullRequests = await octokit.rest.pulls.list({
      owner,
      repo,
    });
    return res.send(pullRequests.data);
  } catch (error) {
    return res.send({ error });
  }
}
