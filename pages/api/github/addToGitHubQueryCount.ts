import addToGitHubQueryCount from "../../../utils/db/github/addToGitHubQueryCount";

export default async function handler(req, res) {
  let { email } = req.body;
  if (!email) {
    return res.send({ error: "no email" });
  }
  let dbEmail = await addToGitHubQueryCount(email);
  return res.send(dbEmail);
}
