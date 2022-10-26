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
    await octokit.rest.activity.checkRepoIsStarredByAuthenticatedUser({
      owner: "watermelontools",
      repo: "wm-extension",
    });
    return res.send({ starredWM: true });
  } catch {
    return res.send({ starredWM: false });
  }
}
