import sendTeammateInvite from "../../../utils/sendgrid/sendTeammateInvite";
export default async function handler(req, res) {
  let { sender, email, inviteUrl, teamName } = req.body;
  if (!email) {
    return res.send({ error: "no email" });
  }
  if (!sender) {
    return res.send({ error: "no sender" });
  }
  let emailSent = await sendTeammateInvite({
    sender,
    email,
    inviteUrl,
    teamName,
  });
  return res.send(emailSent);
}
