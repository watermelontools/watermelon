import { Octokit } from "octokit";
import { trackEvent } from "../../../utils/analytics/azureAppInsights";
import getAllData from "../../../utils/db/user/getAllData";
import updateTokensFromJira from "../../../utils/jira/updateTokens";
import updateTokens from "../../../utils/db/jira/updateTokens";
import searchMessageByText from "../../../utils/slack/searchMessageByText";
function replaceSpecialChars(inputString) {
  const specialChars = /[!"#$%&/()=?_"{}¨*]/g; // Edit this list to include or exclude characters
  return inputString.toLowerCase().replace(specialChars, " ");
}

async function fetchGitHubIssues(userTokens, owner, repo) {
  const parsedGithubData = JSON.parse(userTokens.github_data);
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
async function fetchJiraTickets(userTokens, PRTitles) {
  const parsedJiraData = JSON.parse(userTokens.jira_data);

  if (!parsedJiraData.access_token || !parsedJiraData.refresh_token) {
    return { error: "no jira token" };
  } else {
    const newAccessTokens = await updateTokensFromJira({
      refresh_token: parsedJiraData.refresh_token,
    });
    if (!newAccessTokens?.access_token) {
      return { error: "no access_token" };
    }

    if (!parsedJiraData.cloudId) {
      return { error: "no Jira cloudId" };
    }
    await updateTokens({
      access_token: newAccessTokens.access_token,
      refresh_token: newAccessTokens.refresh_token,
      user: userTokens.user,
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
      `https://api.atlassian.com/ex/jira/${parsedJiraData.cloudId}/rest/api/3/search`,
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
        `https://api.atlassian.com/ex/jira/${parsedJiraData.cloudId}/rest/api/3/serverInfo`,
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
async function fetchSlackConversations(userTokens, PRTitles) {
  let parsedSlackData = JSON.parse(userTokens.slack_data);
  let slackValue = {};

  if (!parsedSlackData.user_token) {
    slackValue = { error: "no slack token" };
  } else {
    let response = await searchMessageByText({
      text: `${PRTitles.join("  ")}`,
      user_token: parsedSlackData.user_token,
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
    userTokens = await getAllData(user);
  } catch (error) {
    console.error(
      "An error occurred while getting user tokens:",
      error.message
    );
    return res.send({ error });
  }

  const githubIssues = await fetchGitHubIssues(userTokens, owner, repo);
  let PRTitles = githubIssues.map((issue) => issue.title);
  const jiraIssues = await fetchJiraTickets({ user, ...userTokens }, PRTitles);
  const slackConversations = await fetchSlackConversations(
    userTokens,
    PRTitles
  );

  return res.send({
    github: githubIssues,
    jira: jiraIssues,
    slack: slackConversations,
  });
}
