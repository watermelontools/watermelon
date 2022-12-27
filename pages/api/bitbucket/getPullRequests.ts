export default async function handler(req, res) {
  let { workspace, repo_slug, commitHash } = req.body;

  await fetch(
    `https://api.bitbucket.org/2.0/repositories/${workspace}/${repo_slug}/commit/${commitHash}/pullrequests`,
    {
      method: "GET",
      headers: {
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
      return res.send( err );
    });
}
