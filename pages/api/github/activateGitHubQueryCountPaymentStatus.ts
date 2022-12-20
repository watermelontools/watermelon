import activateGitHubQueryCountPaymentStatus from "../../../utils/db/github/activateGitHubQueryCountPaymentStatus";

export default async function handler(req, res) {
  let { email } = req.body;
  if (!email) {
    return res.send({ error: "no email" });
  }
  let dbEmail = await activateGitHubQueryCountPaymentStatus(email);
  return res.send(dbEmail);
}
