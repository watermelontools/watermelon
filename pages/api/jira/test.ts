var zlib = require("zlib");
export default async function handler(req, res) {
  let { cloudId, access_token } = req.body;
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
        jql: "assignee = 6205b6df506317006b092e68",
        fields: ["summary", "status", "assignee", "created", "updated"],
      }),
    }
  )
    .then((res) => {
      console.log(res.body);
      var output = zlib.inflate(res.body);
      console.log(output);
      res.json();
    })
    .then((resJson) => {
      console.log(resJson);
      returnVal = resJson;
    });
  return res.send(returnVal);
}
