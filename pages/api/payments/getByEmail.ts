import getByEmail from "../../../utils/db/payments/getByEmail";

export default async function handler(req, res) {
  let { email } = req.body;
  console.log("req.body: ", req.body)
  if (!email) {
    return res.send({ error: "no email" });
  }
  let hasPaid = await getByEmail({email});
  return res.send(hasPaid);
}
