import logger from "../../../../../logger/logger";
export default function handler(req, res) {
  let { signInToken, weekday, hour } = req.body;

  if (!signInToken) {
    logger.error({
      function: "admin/cron/create/sendquestions",
      error: "no token",
    });
    return res.status(401).json({ error: "no token", code: 1 });
  }

  let url = `https://${
    process.env.isDev === "true" ? "dev." : ""
  }app.watermelon.tools/api/admin/slack/sendquestions/${signInToken?.team?.id}`;

  let responseObject = {
    hour: hour || "no hour",
    weekday: weekday || "no weekday",
  };

  fetch(
    `https://www.easycron.com/rest/add?token=${process.env.EASYCRON_API_KEY}
    &cron_expression=0 ${hour || 15} * * ${weekday || "THU"} *
    &url=${url}
    &cron_job_name=sendquestions-${signInToken?.team?.id}`
  )
    .then((response) => response.json())
    .then((data) => {
      logger.log({
        data,
        function: "admin/cron/create/sendquestions",
        ...responseObject,
      });
      res.status(200).json(JSON.stringify({ ok: "ok", ...responseObject }));
    })
    .catch((error) => {
      logger.error({
        error,
        function: "admin/cron/create/sendquestions",
        ...responseObject,
      });
      res.status(500).json(error);
    });
}
