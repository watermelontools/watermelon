import updateBitbucketAccessToken from "../../../utils/bitbucket/updateBitbucketAccessToken";

export default async function handler(req, res) {
    let { workspace, repo_slug, commitHash } = req.body;
    // let  access_token  = await updateBitbucketAccessToken(userEmail);
 
    fetch(`https://api.bitbucket.org/2.0/repositories/${workspace}/${repo_slug}/commit/${commitHash}/pullrequests`, {
    method: 'GET',
    headers: {
        // Authorization: `Bearer ${access_token}`, // do we need this?
        'Accept': 'application/json'
    }
    })
    .then(response => {
        return res.send({response});
    })
    .catch(err => {
        return res.send({ err });
    })
}
