import getAllData from "../../../utils/db/user/getAllData";
import { Octokit } from "octokit";
import { trackEvent } from "../../../utils/analytics/azureAppInsights";
import updateTokensFromJira from "../../../utils/jira/updateTokens";
import updateTokens from "../../../utils/db/jira/updateTokens";
import searchMessageByText from "../../../utils/slack/searchMessageByText";
function replaceSpecialChars(inputString) {
  const specialChars = /[!"#$%&/()=?_"{}¨*]/g; // Edit this list to include or exclude characters
  return inputString.toLowerCase().replace(specialChars, " ");
}
export default async function handler(req, res) {
  const { user, gitSystem, repo, owner, commitTitle } = req.body;

  if (!user) {
    return res.send({ error: "no user" });
  }
  if (!repo) {
    return res.send({ error: "no repo" });
  }
  if (!owner) {
    return res.send({ error: "no owner" });
  }
  if (!gitSystem) {
    return res.send({ error: "no gitSystem" });
  }
  if (!commitTitle) {
    return res.send({ error: "no commitTitle" });
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
        per_page: 1,
      });

      return issues?.data?.items;
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
            maxResults: 1,
          }),
        }
      )
        .then((res) => res.json())
        .then((resJson) => resJson.issues)
        .catch((error) => {
          console.error(error);
        });

      return returnVal;
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
        count: 1,
      });
      slackValue = response?.messages?.matches;
    }
    return slackValue;
  }
  const githubIssues = await fetchGitHubIssues(userTokens, owner, repo);
  let PRTitles = githubIssues.map((issue) => issue.title);
  const jiraTickets = await fetchJiraTickets({ user, ...userTokens }, PRTitles);
  const slackConversations = await fetchSlackConversations(
    userTokens,
    PRTitles
  );
  trackEvent({
    name: "unifiedHoverData",
    properties: { user, gitSystem, repo, owner, commitTitle },
  });

  return res.send({
    github: githubIssues,
    jira: jiraTickets,
    slack: slackConversations,
  });
}
