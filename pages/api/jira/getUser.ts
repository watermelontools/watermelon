import getUser from "../../../utils/db/jira/getUser";

export default async function handler(req, res) {
  console.log("req.body", req.body);
  let { user } = req.body;
  console.log("user", user);
  if (!user) {
    return res.send({ error: "no user" });
  }
  let organization = await getUser(user);
  return res.send(organization);
}
