export default async function handler(req, res) {
  let { query } = req.body;
  let queryString = JSON.stringify({ query: query });
  let resp = await fetch(process.env.AZURE_WEBAPP_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: queryString,
  })
    .then((response) => response.json())
    .then((data) => {
      console.log(data);
      return data;
    })
    .catch((error) => {
      console.error(error);
      return error;
    });
  return res.send(resp);
}
