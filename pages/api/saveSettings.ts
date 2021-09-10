import logger from "../../logger/logger";
import { nextWeekday } from "../../utils/cronUtils";
import { createSettings } from "../../utils/airtable/backend";
export default async function handler(req, res) {
  let body = JSON.parse(req.body);
  let { lang, cat, signInToken, weekday, hour, isWizard, timezone } = body;
  const baseurl = `https://${process.env.VERCEL_URL}/api/admin/`;
  await createSettings({
    settings: {
      Language: lang,
      Day: weekday,
      Hour: hour,
      Timezone: timezone,
      Category: cat,
    },
    workspaceId: signInToken.team.id,
  });
  if (isWizard) {
    let urls = [
      { route: "sendquestions", hour, weekday },
      { route: "clearooms", hour: hour - 1, weekday: nextWeekday(weekday) },
      { route: "addtorooms", hour: hour, weekday: nextWeekday(weekday) },
    ];
    urls.forEach(async (element) => {
      await fetch(
        `https://www.easycron.com/rest/add?token=${process.env.EASYCRON_API_KEY}
      &cron_expression=0 ${element.hour} * * ${element.weekday} *
      &url=${baseurl + element.route}
      &cron_job_name=${signInToken.team.id}
      ${
        timezone
          ? `&timezone_from=2
            &timezone=${timezone}`
          : ""
      }`
      )
        .then((response) => response.json())
        .then((data) => {
          logger.info({ message: "cron-created", data });
        });
    });
  }
  res.status(200).json(JSON.stringify({ ok: "ok" }));
}
