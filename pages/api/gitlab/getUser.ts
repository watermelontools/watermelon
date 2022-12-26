import getUser from "../../../utils/db/gitlab/getUser";

export default async function handler(req, res) {
  let { user } = req.body;
  if (!user) {
    return res.send({ error: "no user" });
  }
  let dbUser = await getUser(user);
  return res.send(dbUser);
}
