import getUserSettings from "../../../utils/db/user/settings";
import patchUserSettings from "../../../utils/db/user/patchUserSettings";

export default async function handler(req, res) {
  let { user } = req.body;
  if (!user) {
    return res.send({ error: "no user" });
  }
  if (res.method === "PATCH") {
    let { settings } = req.body;
    if (!settings) {
      return res.send({ error: "no settings" });
    }
    return await patchUserSettings(user, settings);
  }
  let dbUser = await getUserSettings(user);
  return res.send(dbUser);
}
