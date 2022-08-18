import updateTokens from "../../../utils/db/jira/updateTokens";
import updateTokensFromJira from "../../../utils/jira/updateTokens";
import getAPIAccessInfo from "../../../utils/db/jira/getAPIAccessInfo";

export default async function handler(req, res) {
  let { user } = req.body;

  if (!user) {
    return res.send({ error: "no user" });
  }
  try {
    let { refresh_token, access_token, cloudId } = await getAPIAccessInfo(
      user
    )[0];
    let newAccessTokens = await updateTokensFromJira({
      refresh_token: refresh_token,
    });
    refresh_token = newAccessTokens.refresh_token;
    access_token = newAccessTokens.access_token;
    await updateTokens({ access_token, refresh_token, user });
    res.send({ access_token, cloudId });
  } catch (error) {
    console.error(error);
    return res.send(error);
  }
}
