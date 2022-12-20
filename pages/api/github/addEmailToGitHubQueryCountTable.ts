import addEmailToGitHubQueryCountTable from "../../../utils/db/github/addEmailToGitHubQueryCountTable";

export default async function handler(req, res) {
  let { email } = req.body;
  if (!email) {
    return res.send({ error: "no email" });
  }
  let dbEmail = await addEmailToGitHubQueryCountTable(email);
  return res.send(dbEmail);
}
