import updateBitbucketAccessToken from "../../../utils/bitbucket/updateBitbucketAccessToken";
import addToGitHubQueryCount from "../../../utils/db/github/addToGitHubQueryCount";
import getGitHubQueryCountStatusByEmail from "../../../utils/db/github/getGitHubQueryCountStatusByEmail";

export default async function handler(req, res) {
  let { workspace, repo_slug, commitHash, userEmail } = req.body;

  if (!workspace) {
    return res.send({ error: "no workspace" });
  }
  if (!repo_slug) {
    return res.send({ error: "no repo_slug" });
  }
  if (!commitHash) {
    return res.send({ error: "no commitHash" });
  }

  let access_token = await updateBitbucketAccessToken(userEmail);

  // if the git query count for the user with that email address is over 50 and the user hasn't paid, return an error
  let { hasPaid, git_query_count } = await getGitHubQueryCountStatusByEmail(
    userEmail
  );

  if (git_query_count  > 50 && !hasPaid) {
    return res.send({ error: "Git query limit reached" });
  }

  try {
    const response = await fetch(
      `https://api.bitbucket.org/2.0/repositories/${workspace}/${repo_slug}/commit/${commitHash}/pullrequests`,
      {
        method: "GET",
        headers: {
          // https://developer.atlassian.com/cloud/bitbucket/rest/api-group-pullrequests/#api-repositories-workspace-repo-slug-commit-commit-pullrequests-get
          // Docs say it shouldn't have an access token
          // with the auth tokens it returns "invalid or unknown installation"
          Authorization: `Bearer ${access_token}`,
          // without it, it returns "resource not found"
          Accept: "application/json",
        },
      }
    );
    const data = await response.json();

    addToGitHubQueryCount(userEmail);

    return res.send(data);
  } catch (err) {
    return res.send(err);
  }
}
