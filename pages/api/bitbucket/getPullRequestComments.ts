import updateBitbucketAccessToken from "../../../utils/bitbucket/updateBitbucketAccessToken";

export default async function handler(req, res) {
  let { workspace, repo_slug, pull_request_id, userEmail } = req.body;
  let  access_token  = await updateBitbucketAccessToken(userEmail);

  await fetch(
    `https://api.bitbucket.org/2.0/repositories/${workspace}/${repo_slug}/pullrequests/${pull_request_id}/comments`,
    {
      method: "GET",
      headers: {
      Authorization: `Bearer ${access_token}`, // works with hardcoded updated token
        Accept: "application/json",
      },
    }
  )
    .then((response) => {
      response.json().then((data) => {
        return res.send(data);
      });
    })
    .catch((err) => {
      return res.send({ err });
    });
}
