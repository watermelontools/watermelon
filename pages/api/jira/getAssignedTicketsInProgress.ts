import getJiraOrganization from "../../../utils/db/jira/getOrganization";

export default async function handler(req, res) {
  let { user, access_token } = req.body;

  let {jira_id, user_email} = await getJiraOrganization(user);

  let returnVal;
  if (!jira_id) {
    res.send({ error: "no Jira cloudId" });
  }
  if (!access_token) {
    res.send({ error: "no access_token" });
  }
  await fetch(
    `https://api.atlassian.com/ex/jira/${jira_id}/rest/api/3/search`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: `Bearer ${access_token}`,
      },
      body: JSON.stringify({
        jql: `assignee="${user_email}" AND status not in (Backlog, Done)`,
      }),
    }
  )
    .then((res) => res.json())
    .then((resJson) => {
      console.log("resJson: ", resJson);
      returnVal = resJson.issues;
    });
  return res.send(returnVal);
}
