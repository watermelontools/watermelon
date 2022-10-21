import addEmail from "../../../utils/db/payments/addEmail";

export default async function handler(req, res) {
  let { emailList } = req.body;
  if (!emailList) {
    return res.send({ error: "no email list" });
  }
//   let hasPaid = await getByEmail({ email });
  return res.send(hasPaid);
}
