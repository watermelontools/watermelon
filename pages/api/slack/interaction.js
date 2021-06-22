export default function handler(req, res) {
    let {body} = req
    Object.keys(body).map(key=> console.log(key, body[key]))
    fetch(body.response_url,{
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