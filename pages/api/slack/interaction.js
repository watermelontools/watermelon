export default async function handler(req, res) {
    let {payload} = req.body
    let slackResponse= await JSON.parse(payload)
    console.log(slackResponse.response_url)
    await fetch(slackResponse.response_url,
        {
        method: "POST",
        headers: {
            'Content-Type': 'application/json'
          },
        body: JSON.stringify(
        { 
            text: "Thanks for your request, we'll process it and get back to you."
        })
    })
    .then(response => response.json())
  .then(data => {
      res.status(200).json({status: "ok"})
      console.log(data)})
  .catch(error=> console.error(error))
}