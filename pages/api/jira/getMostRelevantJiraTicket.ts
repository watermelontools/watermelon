import getJiraOrganization from "../../../utils/db/jira/getOrganization";
import getToken from "../../../utils/jira/refreshTokens";

export default async function handler(req, res) {
  let { user, pr_title} = req.body;

  if (!user) {
    return res.send({ error: "no user" });
  }

  let { access_token } = await getToken({ user });
  if (!access_token) {
    res.send({ error: "no access_token" });
  }

  let { jira_id, user_email } = await getJiraOrganization(user);
  if (!jira_id) {
    res.send({ error: "no Jira cloudId" });
  }

  let returnVal = await fetch(
    `https://api.atlassian.com/ex/jira/${jira_id}/rest/api/3/search`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: `Bearer ${access_token}`,
      },
      body: JSON.stringify({
        query: pr_title,
        jql: `status="Closed"`,
      }),
    }
  )
    .then((res) => res.json())
    .then((resJson) => resJson.issues);
  return res.send(returnVal);
}
