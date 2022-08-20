import getJiraOrganization from "../../../utils/db/jira/getOrganization";
import getToken from "./getToken";

export default async function handler(req, res) {
  console.log("req.body - getAssignedTicketsInProgress", req.body);
  let { user } = req.body.user;

  // get token from getToken.ts
  let access_token = await getToken(user, res).then(token => token);
  console.log("access_token - getAssignedTicketsInProgress.ts", access_token);

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
