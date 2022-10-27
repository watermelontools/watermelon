import sendWelcome from "../../../utils/sendgrid/sendWelcome";
export default async function handler(req, res) {
  let { emails, sender } = req.body;
  if (!emails) {
    return res.send({ error: "no email" });
  }
  if (!sender) {
    return res.send({ error: "no sender" });
  }
  let emailSent = await sendWelcome({ sender, emails });
  return res.send(emailSent);
}
