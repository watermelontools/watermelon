export default async function handler(req, res) {
  let { user, cloudId, access_token } = req.body;
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
        // jql: `assignee = ${user} AND status="Open" OR status="In Progress"`,
        jql: `status="Open" OR status="In Progress"`,
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
