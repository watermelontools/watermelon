export default async function handler(req, res) {
  let { payload } = req.body;
  let slackResponse = await JSON.parse(payload);
  console.log("msg", slackResponse.message);
  console.log("acts", slackResponse.actions);
  await fetch(slackResponse.response_url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      text: "Watermelon question answered.",
    }),
  })
    .then((response) => response.json())
    .then((data) => {
      res.status(200).json({ status: "ok" });
      console.log(data);
    })
    .catch((error) => console.error(error));
}
