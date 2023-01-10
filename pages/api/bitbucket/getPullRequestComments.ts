import updateBitbucketAccessToken from "../../../utils/bitbucket/updateBitbucketAccessToken";

export default async function handler(req, res) {
  try {
    const { workspace, repo_slug, pull_request_id, userEmail } = req.body;

    if (!workspace) {
      return res.send({ error: "no workspace" });
    }
    if (!repo_slug) {
      return res.send({ error: "no repo_slug" });
    }
    if (!pull_request_id) {
      return res.send({ error: "no pull_request_id" });
    }

    const access_token = await updateBitbucketAccessToken(userEmail);
    const response = await fetch(
      `https://api.bitbucket.org/2.0/repositories/${workspace}/${repo_slug}/pullrequests/${pull_request_id}/comments`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${access_token}`,
          Accept: "application/json",
        },
      }
    );
    const data = await response.json();
    res.send(data);
  } catch (err) {
    res.send(err);
  }
}
