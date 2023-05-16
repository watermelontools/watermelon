import getUserSettings from "../../../utils/db/user/settings";

export default async function handler(req, res) {
  let { userEmail } = req.body;
  if (!userEmail) {
    return res.send({ error: "no user" });
  }
  let dbUser = await getUserSettings(userEmail);
  return res.send(dbUser);
}
