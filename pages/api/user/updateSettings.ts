import getUserSettings from "../../../utils/db/user/settings";
import patchUserSettings from "../../../utils/db/user/patchUserSettings";

export default async function handler(req, res) {
  let { user } = req.body;
  if (!user) {
    return res.send({ error: "no user" });
  }
  let { userSettings } = req.body;
  if (!userSettings) {
    return res.send({ error: "no userSettings" });
  }
  let patchedSettings = await patchUserSettings(user, userSettings);
  return res.status(200).send(patchedSettings);
}
