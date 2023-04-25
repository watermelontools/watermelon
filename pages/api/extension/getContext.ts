import { Octokit } from "octokit";
import { trackEvent } from "../../../utils/analytics/azureAppInsights";
import getAllData from "../../../utils/db/user/getAllData";

export default async function handler(req, res) {
  const { user, gitSystem, repo, owner, commitList } = req.body;
  console.log("req.body", req.body);

  trackEvent({
    name: "extensionContext",
    properties: { user, repo, owner, gitSystem },
  });

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
  if (!gitSystem) {
    return res.send({ error: "no gitSystem" });
  }
  let userTokens;
  try {
    userTokens = await getAllData(user);
    // Do something with userTokens, e.g., console.log(userTokens);
  } catch (error) {
    console.error(
      "An error occurred while getting user tokens:",
      error.message
    );
    return res.send({ error });
  }
  const {
    github_data,
    jira_data,
    jira_refresh_data,
    slack_data,
    cloudId,
    user_email,
  } = userTokens;
  const commitSet = new Set(commitList.split(","));
  const parsedGithubData = JSON.parse(github_data);
  const octokit = new Octokit({
    auth: parsedGithubData.access_token,
  });
  let q = `repo:${owner}/${repo}`;
  let issues;
  try {
    issues = await octokit.rest.search.issuesAndPullRequests({
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
  } catch (error) {
    console.error("An error occurred while getting issues:", error.message);
    return res.send({ error });
  }

  return res.send({ issues: issues.data.items });
}
