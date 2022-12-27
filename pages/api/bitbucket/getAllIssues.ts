import updateBitbucketAccessToken from "../../../utils/bitbucket/updateBitbucketAccessToken";

export default async function handler(req, res) {
  let { workspace, repo_slug, userEmail } = req.body;
  let  access_token  = await updateBitbucketAccessToken(userEmail);
  await fetch(
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
      return res.send({response});
    })
    .catch((err) => {
      return res.send({ err });
    });
}
