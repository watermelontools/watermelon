import { Octokit } from "octokit";
import { trackEvent } from "../../../utils/analytics/azureAppInsights";
import getUserTokens from "../../../utils/db/user/getUserTokens";
import updateTokensFromJira from "../../../utils/jira/updateTokens";
import updateTokens from "../../../utils/db/jira/updateTokens";
import searchMessageByText from "../../../utils/slack/searchMessageByText";
function replaceSpecialChars(inputString) {
  const specialChars = /[!"#$%&/()=?_"{}¨*]/g; // Edit this list to include or exclude characters
  return inputString.toLowerCase().replace(specialChars, " ");
}

async function fetchGitHubIssues(parsedUserTokens, owner, repo) {
  const { github_token } = parsedUserTokens;
  const octokit = new Octokit({
    auth: github_token,
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
            issues.data.items[index].comments = comments.data.filter(
              (comment) => {
                if (comment?.user?.type === "Bot") {
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
  }
  return issues?.data?.items;
}
async function fetchJiraTickets(parsedUserTokens, PRTitles) {
  const { jira_token, jira_refresh_token, cloudId, user } = parsedUserTokens;

  if (!jira_token || !jira_refresh_token) {
    return { error: "no jira token" };
  } else {
    const newAccessTokens = await updateTokensFromJira({
      refresh_token: jira_refresh_token,
    });
    if (!newAccessTokens?.access_token) {
      return { error: "no access_token" };
    }

    if (!cloudId) {
      return { error: "no Jira cloudId" };
    }
    await updateTokens({
      access_token: newAccessTokens.access_token,
      refresh_token: newAccessTokens.refresh_token,
      user: user,
    });

    let cleanPRTitles = Array.from(
      new Set(PRTitles.map((title) => replaceSpecialChars(title)))
    );

    const summaryQuery = cleanPRTitles
      .map((title) => `summary ~ "${title}"`)
      .join(" OR ");

    const descriptionQuery = cleanPRTitles
      .map((title) => `description ~ "${title}"`)
      .join(" OR ");
    let jql = `(${summaryQuery}) AND (${descriptionQuery}) ORDER BY created DESC`;
    let returnVal = await fetch(
      `https://api.atlassian.com/ex/jira/${cloudId}/rest/api/3/search`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          Authorization: `Bearer ${newAccessTokens.access_token}`,
        },
        body: JSON.stringify({
          jql,
          expand: ["renderedFields"],
        }),
      }
    )
      .then((res) => res.json())
      .then((resJson) => resJson.issues)
      .catch((error) => {
        console.error(error);
      });
    const serverPromise = async () => {
      const serverInfo = await fetch(
        `https://api.atlassian.com/ex/jira/${cloudId}/rest/api/3/serverInfo`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",

            Authorization: `Bearer ${newAccessTokens.access_token}`,
          },
        }
      )
        .then((res) => res.json())
        .then((resJson) => resJson)
        .catch((error) => {
          console.error(error);
        });

      returnVal.forEach((element, index) => {
        returnVal[index].serverInfo = serverInfo;
      });
    };

    if (returnVal) {
      await Promise.allSettled([serverPromise()]);
    }
    return returnVal?.slice(0, 3);
  }
}
async function fetchSlackConversations(parsedUserTokens, PRTitles) {
  let { slack_token } = parsedUserTokens;
  let slackValue = {};

  if (!slack_token) {
    slackValue = { error: "no slack token" };
  } else {
    let response = await searchMessageByText({
      text: `${PRTitles.join("  ")}`,
      user_token: slack_token,
    });
    slackValue = response?.messages?.matches?.slice(0, 3);
  }
  return slackValue;
}
export default async function handler(req, res) {
  const { user, gitSystem, repo, owner, commitList } = req.body;
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
    userTokens = await getUserTokens({ email: user });
  } catch (error) {
    console.error(
      "An error occurred while getting user tokens:",
      error.message
    );
    return res.send({ error });
  }

  const githubIssues = await fetchGitHubIssues(userTokens, owner, repo);
  const PRTitles = githubIssues.map((issue) => issue.title);
  const [jiraIssues, slackConversations] = await Promise.all([
    fetchJiraTickets({ user, ...userTokens }, PRTitles),
    fetchSlackConversations(userTokens, PRTitles),
  ]);

  return res.send({
    github: githubIssues,
    jira: jiraIssues,
    slack: slackConversations,
  });
}
