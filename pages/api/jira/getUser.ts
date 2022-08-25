import getUser from "../../../utils/db/jira/getUser";

export default async function handler(req, res) {
  let { user } = req.body;
  if (!user) {
    return res.send({ error: "no user" });
  }
  let organization = await getUser(user);
  return res.send(organization);
}
