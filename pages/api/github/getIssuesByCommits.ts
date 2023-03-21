import { Octokit } from "octokit";
import getToken from "../../../utils/db/github/getToken";
import addToGitHubQueryCount from "../../../utils/db/github/addToGitHubQueryCount";
import getGitHubQueryCountStatusByEmail from "../../../utils/db/github/getGitHubQueryCountStatusByEmail";

export default async function handler(req, res) {
  let { user, repo, owner, commitList } = req.body;
  if (!user) {
    return res.send({ error: "no user" });
  }
  if (!repo) {
    return res.send({ error: "no repo" });
  }
  if (!owner) {
    return res.send({ error: "no owner" });
  }
  if (!commitList) {
    return res.send({ error: "no commitList" });
  }
  let { access_token } = await getToken(user);

  if (!access_token) {
    return res.send({ error: "no access_token" });
  }
  const octokit = new Octokit({
    auth: access_token,
  });
  let q = `repo:${owner}/${repo}+hash:${commitList}`;

  // if the github query count for the user with that email address is over 50 and the user hasn't paid, return an error
  let { hasPaid, git_query_count } = await getGitHubQueryCountStatusByEmail(
    user
  );
  if (git_query_count > 500 && !hasPaid) {
    return res.send({ error: "Context query limit reached" });
  }

  try {
    let issues = await octokit.rest.search.issuesAndPullRequests({
      q,
      is: "pr",
      type: "pr",
    });
    let commentsPromises = issues.data.items.map(
      async (issue, index) =>
        await octokit.rest.issues
          .listComments({
            owner,
            repo,
            issue_number: issue.number,
          })
          .then((comments) => {
            //@ts-ignore
            issues.data.items[index].comments = comments.data.filter(
              (comment) => {
                if (comment.user.type === "Bot") {
                  return false;
                }
                return true;
              }
            );
          })
    );
    await Promise.allSettled(commentsPromises);
    addToGitHubQueryCount(user);
    return res.send(issues.data);
  } catch (error) {
    return res.send({ error });
  }
}
