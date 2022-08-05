import updateTokens from "../../../utils/db/jira/updateTokens";
import updateTokensFromJira from "../../../utils/jira/updateTokens";
import getAPIAccessInfo from "../../../utils/db/jira/getAPIAccessInfo";

export default async function handler(req, res) {
  let { user } = req.body;

  if (!user) {
    return res.send({ error: "no user" });
  }
  let data;
  try {
    data = await getAPIAccessInfo(user);
  } catch (error) {
    console.error(error);
    return res.send(error);
  }
  let newAccessTokens = await updateTokensFromJira({
    refresh_token: data.refresh_token,
  });
  const { access_token, refresh_token } = newAccessTokens;
  await updateTokens({ access_token, refresh_token, user });
  res.send({ access_token, cloudId: data.jira_id });
}
