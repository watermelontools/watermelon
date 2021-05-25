export default function handler(req, res) {
  let { signInToken, weekday, hour } = req.body;
  let url = `https://${
    process.env.isDev === "true" ? "dev." : ""
  }app.watermelon.tools/api/admin/slack/sendquestions/${signInToken?.team?.id}`;
  if(!signInToken)
   return res.status(401).json({error: "no token", code: 1})
  if(!weekday)
   return res.status(401).json({error: "no weekday", code: 2})
  if(!hour)
   return res.status(401).json({error: "no hour", code: 3})
  fetch(
    `https://www.easycron.com/rest/add?token=${process.env.EASYCRON_API_KEY}
    &cron_expression=0 ${hour} * * ${weekday} *
    &url=${url}
    &cron_job_name=sendquestions-${ signInToken?.team?.id }`
  )
    .then((response) => response.json())
    .then((data) => {
      console.log(data);
      res.status(200).json(JSON.stringify({ ok: "ok" }));
    })
    .catch((error) => res.status(500).json(error));
}
