import userTest from "./userTest";

export default async function handler(req, res) {
  let { cloudId, access_token } = req.body;
  let userID = userTest(cloudId, access_token);
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
        jql: `assignee = ${userID}`,
        fields: ["summary", "status", "assignee", "created", "updated"],
      }),
    }
  )
    .then((res) => {
      console.log(res.body);
      res.json();
    })
    .then((resJson) => {
      console.log(resJson);
      returnVal = resJson;
    });
  return res.send(returnVal);
}
