import getJiraOrganization from "../../../utils/db/jira/getOrganization";
import getToken from "./getToken";

export default async function handler(req, res) {
  let { user } = req.body.user;

  // get token from getToken.ts
  let access_token = await getToken(req, res)
    .then(token => token.access_token)
    .catch(error => {console.error(error); return error});

  console.log("retrieved access token - getAssignedTicketsInProgress", access_token);
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
      returnVal = resJson.issues;
    });
  return res.send(returnVal);
}
