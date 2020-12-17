let db = { questions: [] }

const sendMail = () => {
  console.log("mail")
}
export default function handler(req, res) {
  res.statusCode = 200
  res.setHeader('Content-Type', 'application/json')
  sendMail()
  res.end(JSON.stringify({ questions: db }))
}
