import updateTokens from "../../../utils/db/jira/updateTokens";
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

  console.log("data", data);
  let newAccessTokens = await fetch("https://auth.atlassian.com/oauth/token", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      grant_type: "refresh_token",
      client_id: process.env.NEXT_PUBLIC_JIRA_CLIENT_ID,
      client_secret: process.env.JIRA_CLIENT_SECRET,
      refresh_token: data[0].refresh_token,
    }),
  }).then((response) => response.json());
  const { access_token, refresh_token } = newAccessTokens;
  await updateTokens({ access_token, refresh_token, user });
  res.send({ access_token, cloudId: data[0].jira_id });
}
