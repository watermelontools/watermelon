import getJiraOrganization from "../../../utils/db/jira/getOrganization";

export default async function handler(req, res) {
  let { cloudId, user, access_token } = req.body;
  // get access_token from getToken.ts
  // let access_token = await getToken(req.body.refresh_token);
  // get cloudID and user from getJirgaOrganization.ts

  await getJiraOrganization(access_token).then(organization => {
    console.log("returned organization: ", organization);
    return res.send(organization);
  }).catch(err => {
    return res.send({ error: err });
  })

  let returnVal;
  if (!cloudId) {
    res.send({ error: "no cloudId" });
  }
  if (!access_token) {
    res.send({ error: "no access_token" });
  }
  await fetch(
    `https://api.atlassian.com/ex/jira/${cloudId}/rest/api/3/search`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: `Bearer ${access_token}`,
      },
      body: JSON.stringify({
        jql: `assignee="${user}" AND status not in (Backlog, Done)`,
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
