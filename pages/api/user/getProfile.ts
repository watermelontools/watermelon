import getUserProfile from "../../../utils/db/user/getProfile";

export default async function handler(req, res) {
  let { user } = req.body;
  if (!user) {
    return res.send({ error: "no user" });
  }
  let userProfile = await getUserProfile(user);
  return res.send(userProfile);
}
