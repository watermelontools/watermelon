import getToken from "../../../utils/gitlab/refreshTokens";

export default async function handler(req, res) {
  let { user, issue_number } = req.body;
  if (!user) {
    return res.send({ error: "no user" });
  }
  if (!issue_number) {
    return res.send({ error: "no issue_number" });
  }
  console.log("user", user);
  console.log("issue_number", issue_number);
  let { access_token } = await getToken(user);
  try {
    console.log("access_token", access_token);
    return res.send("issue.data");
  } catch (error) {
    return res.send({ error });
  }
}
