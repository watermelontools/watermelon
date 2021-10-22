import { createSettings } from "../../utils/airtable/backend";
export default async function handler(req, res) {
  let body = JSON.parse(req.body);
  let { lang, cat, signInToken, weekday, hour, isWizard, timezone } = body;
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

  res.status(200).json(JSON.stringify({ ok: "ok" }));
}
