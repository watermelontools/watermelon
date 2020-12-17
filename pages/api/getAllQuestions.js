import Bolt from "bolt"

export default function handler(req, res) {
  res.statusCode = 200
  res.setHeader('Content-Type', 'application/json')
  res.end(JSON.stringify({ questions: ["hola"] }))
}
