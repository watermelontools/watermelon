import getAllPublicUserData from "../../../utils/db/user/getAllPublicUserData";

export default async function handler(req, res) {
  let { userEmail } = req.body;
  if (!userEmail) {
    return res.send({ error: "no user" });
  }
  let dbUser = await getAllPublicUserData(userEmail);
  return res.send(dbUser);
}
