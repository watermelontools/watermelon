import admin from "../../utils/firebase/backend";
export default function handler(req, res) {
  let db = admin.firestore();
  let body = JSON.parse(req.body);
  let { lang, cat, signInToken, weekday, hour, isWizard } = body;
  let url = `https://${
    proces.env.isDev === "true" ? "dev." : ""
  }app.watermelon.tools/api/admin/ping`;
  db.collection("teams")
    .doc(`${signInToken.team.id}`)
    .set(
      { settings: { language: lang, category: cat, weekday, hour } },
      { merge: true }
    )
    .then(function (docRef) {
      if (isWizard)
        fetch(
          `https://www.easycron.com/rest/add?token=${process.env.EASYCRON_API_KEY}&cron_expression=0 ${hour} * * ${weekday} *&url=${url}&cron_job_name=${signInToken.team.id}`
        )
          .then((response) => response.json())
          .then((data) => {
            console.log(data);
            res.status(200).json(JSON.stringify({ ok: "ok" }));
          });
    })
    .catch(function (error) {
      console.error("Error writing: ", error);
      res.status(500).json(JSON.stringify({ ok: false }));
    });
}
