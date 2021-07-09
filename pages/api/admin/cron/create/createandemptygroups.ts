import logger from "../../../../../logger/logger";
export default function handler(req, res) {
  let { signInToken, weekday, hour } = req.body;
  console.log(signInToken);
  if (!signInToken) {
    logger.error({
      message: "no token",
    });
    return res.status(401).json({ error: "no token", code: 1 });
  }

  let url = `https://${
    process.env.isDev === "true" ? "dev." : ""
  }app.watermelon.tools/api/admin/slack/createandemptygroups/${
    signInToken?.team?.id
  }`;

  let responseObject = {
    hour: hour || "no hour",
    weekday: weekday || "no weekday",
  };
  const replaceDay = (day) => {
    if (!day) return false;
    else {
      switch (day) {
        case "MON":
          return "TUE";
        case "TUE":
          return "WED";
        case "WED":
          return "THU";
        case "THU":
          return "FRI";
        case "FRI":
          return "SAT";
        case "SAT":
          return "MON";
        default:
          break;
      }
    }
  };
  fetch(
    `https://www.easycron.com/rest/add?token=${process.env.EASYCRON_API_KEY}
    &cron_expression=0 ${hour || 15} * * ${replaceDay(weekday) || "THU"} *
    &url=${url}
    &cron_job_name=createandemptygroups-${signInToken?.team?.id}`
  )
    .then((response) => response.json())
    .then((data) => {
      logger.info({
        data,
        ...responseObject,
      });
      res.status(200).json(JSON.stringify({ ok: "ok", ...responseObject }));
    })
    .catch((error) => {
      logger.error({
        message: "could not create cron",
        error,
        ...responseObject,
      });
      res.status(500).json(error);
    });
}
