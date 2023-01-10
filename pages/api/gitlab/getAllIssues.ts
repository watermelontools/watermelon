import getAllIssues from "../../../utils/gitlab/getAllIssues";
import getToken from "../../../utils/gitlab/refreshTokens";
export default async function handler(req, res) {
  let { user } = req.body;
  if (!user) {
    return res.send({ error: "no user" });
  }
  let { access_token } = await getToken({ user });
  try {
    let issues = await getAllIssues({
      access_token,
    });
    return res.send(issues);
  } catch (error) {
    return res.send({ error });
  }
}
