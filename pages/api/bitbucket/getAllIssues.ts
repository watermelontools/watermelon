import updateBitbucketAccessToken from "../../../utils/bitbucket/updateBitbucketAccessToken";

export default async function handler(req, res) {
  let { workspace, repo_slug, userEmail } = req.body;
  let { access_token } = await updateBitbucketAccessToken(userEmail);
  fetch(
    `https://api.bitbucket.org/2.0/repositories/${workspace}/${repo_slug}/issues`,
    {
      method: "GET",
      headers: {
        Authorization: `Bearer ${access_token}`,
        Accept: "application/json",
      },
    }
  )
    .then((response) => {
      return response.text();
    })
    .then((text) => console.log(text))
    .catch((err) => console.error(err));
}
