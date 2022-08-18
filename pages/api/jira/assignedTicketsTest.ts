// import userTest from './userTest';

export default async function handler(req, res) {
  let { user, cloudId, access_token } = req.body;
  console.log("cloudId, accesss_token: ", cloudId, access_token);
  // let userID = userTest(cloudId, access_token);
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
        jql: `assignee = ${user}`,
        fields: ["summary", "status", "assignee", "created", "updated"],
      }),
    }
  )
    .then((res) => {
      res.json();
      console.log("res after res.json(): ", res);
    })
    .then((resJson) => {
      console.log("resJson: ", resJson);
      returnVal = resJson;
    });
  return res.send(returnVal);
}
