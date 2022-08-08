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
    `https://api.atlassian.com/ex/jira/${cloudId}/rest/api/3/field/search?query=assignee:6205b6df506317006b092e68'`,
    {
      method: "GET",
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${access_token}`,
      },
    }
  )
    .then((res) => res.json())
    .then((resJson) => {
      console.log(resJson);
      returnVal = resJson;
    });
  return res.send(returnVal);
}
