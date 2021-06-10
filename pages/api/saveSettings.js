import admin from "../../utils/firebase/backend";
import logger from "../../logger/logger";
export default function handler(req, res) {
  let db = admin.firestore();
  let body = JSON.parse(req.body);
  let { lang, cat, signInToken, weekday, hour, isWizard } = body;
  const baseurl = `https://${
    proces.env.isDev === "true" ? "dev." : ""
  }app.watermelon.tools/api/admin/`;
  let nextWeekday = (weekday) => {
    switch (weekday) {
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
  };
  db.collection("teams")
    .doc(`${signInToken.team.id}`)
    .set(
      { settings: { language: lang, category: cat, weekday, hour } },
      { merge: true }
    )
    .then(function () {
      if (isWizard) {
        let urls = [
          { route: "sendquestions", hour, weekday },
          { route: "clearooms", hour: hour - 1, weekday: nextWeekday(weekday) },
          { route: "addtorooms", hour: hour, weekday: nextWeekday(weekday) },
        ];
        urls.forEach((element) => {
          await fetch(
            `https://www.easycron.com/rest/add?token=${
              process.env.EASYCRON_API_KEY
            }
          &cron_expression=0 ${element.hour} * * ${element.weekday} *
          &url=${baseurl + element.url}
          &cron_job_name=${signInToken.team.id}`
          )
            .then((response) => response.json())
            .then((data) => {
              logger.info({ message: "cron-created", data });
            });
        });
        res.status(200).json(JSON.stringify({ ok: "ok" }));
      }
    })
    .catch(function (error) {
      console.error("Error writing: ", error);
      res.status(500).json(JSON.stringify({ ok: false }));
    });
}
