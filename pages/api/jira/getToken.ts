import refreshTokens from "../../../utils/jira/refreshTokens";
export default async function handler(req, res) {
  let { user } = req.body;

  if (!user) {
    return res.send({ error: "no user" });
  }
  let response = await refreshTokens({ user });
  return res.send(response);
}
