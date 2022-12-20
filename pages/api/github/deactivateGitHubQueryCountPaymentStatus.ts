import deactivateGitHubQueryCountPaymentStatus from "../../../utils/db/github/deactivateGitHubQueryCountPaymentStatus";

export default async function handler(req, res) {
  let { email } = req.body;
  if (!email) {
    return res.send({ error: "no email" });
  }
  let dbEmail = await deactivateGitHubQueryCountPaymentStatus(email);
  return res.send(dbEmail);
}
