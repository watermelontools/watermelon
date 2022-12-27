import getGitHubQueryCountStatusByEmail from "../../../utils/db/github/getGitHubQueryCountStatusByEmail";

export default async function handler(req, res) {
  let { email } = req.body;
  if (!email) {
    return res.send({ error: "no email" });
  }
  let dbEmail = await getGitHubQueryCountStatusByEmail(email);
  return res.send(dbEmail);
}
