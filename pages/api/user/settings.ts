import getUserSettings from "../../../utils/db/user/settings";

export default async function handler(req, res) {
  let { user } = req.body;
  if (!user) {
    return res.send({ error: "no user" });
  }
  let dbUser = await getUserSettings(user);
  return res.send(dbUser);
}
