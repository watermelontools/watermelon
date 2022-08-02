import { supabase } from "../../../utils/supabase";
const updateTokens = async ({ access_token, refresh_token, user }) => {
  const { data, error } = await supabase
    .from("Jira")
    .update({ access_token, refresh_token })
    .match({ user });
};
export default async function handler(req, res) {
  let { userId } = req.body;
  let { data, error, status } = await supabase
    .from("Jira")
    .select("refresh_token")
    .eq("user", userId);
  if (error) res.send(error);
  console.log(data[0].refresh_token);
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

  console.log(newAccessTokens);
  res.send(newAccessTokens);
}
