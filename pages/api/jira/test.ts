export default async function handler(req, res) {
  let { cloudId, access_token } = req.body;
  let returnVal;
  await fetch(
    `https://api.atlassian.com/ex/jira/${cloudId}/rest/api/2/project`,
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
