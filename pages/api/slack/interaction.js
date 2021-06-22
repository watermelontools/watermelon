export default function handler(req, res) {
    let {payload} = req.body
    Object.keys(payload).map(key=> console.log(key))
    fetch(payload.response_url,{
        method: "POST",
        headers: {
            'Content-Type': 'application/json'
          },
        body: JSON.stringify(
            { 
                text: "Thanks for your request, we'll process it and get back to you."
        }
        )
    })
    .then(response => response.json())
  .then(data => console.log(data))
  .catch(error=> console.error(error))
    res.status(200).json({status: "ok"})
}