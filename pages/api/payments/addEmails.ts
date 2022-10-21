import addEmails from "../../../utils/db/payments/addEmails";

export default async function handler(req, res) {
  let { email } = req.body;
  if (!email) {
    return res.send({ error: "no email" });
  }
  let emailsAdded = await addEmails( {email} );
  return res.send(emailsAdded);
}
