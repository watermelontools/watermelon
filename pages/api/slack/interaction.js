export default function handler(req, res) {
    let {body} = req
    console.log(body)
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
    res.status(200).json({status: "ok"})
}