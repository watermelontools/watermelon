import { Octokit } from "octokit";
import getToken from "../../../utils/db/github/getToken";

export default async function handler(req, res) {
  let { user } = req.body;
  if (!user) {
    return res.send({ error: "no user" });
  }

  let { access_token } = await getToken(user);
  const octokit = new Octokit({
    auth: access_token,
  });
  try {
    let issue = await octokit.rest.activity.starRepoForAuthenticatedUser({
      owner: "watermelontools",
      repo: "wm-extension",
    });
    return res.send(issue.data);
  } catch (error) {
    return res.send({ error });
  }
}
