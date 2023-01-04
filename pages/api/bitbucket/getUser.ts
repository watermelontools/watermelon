import getUser from "../../../utils/db/bitbucket/getUser";

export default async function handler(req, res) {
  let { email } = req.body;
  if (!email) {
    return res.send({ error: "no email" });
  }
  let dbUser = await getUser(email);
  return res.send(dbUser);
}
