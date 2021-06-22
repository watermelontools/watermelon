export default function handler(req, res) {
    let {body} = req
    console.log(body)
    res.status(200).json({status: "ok"})
}