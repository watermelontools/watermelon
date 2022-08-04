import getJiraOrganization from "../../../utils/db/jira/getOrganization";

export default async function handler(req, res) {
  let { user } = req.body;
  if (!user) {
    return res.send({ error: "no user" });
  }
  let organization = await getJiraOrganization(user);
  return res.send(organization);
}
