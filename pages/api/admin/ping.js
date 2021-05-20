export default function handler(req, res) {
  console.log("ping", Date.now);
  res.status(200).send({ ok: "ok" });
}
