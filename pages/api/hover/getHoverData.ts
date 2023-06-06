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
function handleRejection(reason) {
  console.error(reason);
  return { error: reason };
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
  async function fetchJiraTickets(userTokens, commitTitle) {
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

      let jql = `(summary ~ "${commitTitle}") AND (description ~ "${commitTitle}") ORDER BY created DESC`;
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
  async function fetchSlackConversations(userTokens, commitTitle) {
    let parsedSlackData = JSON.parse(userTokens.slack_data);
    let slackValue = {};

    if (!parsedSlackData.user_token) {
      slackValue = { error: "no slack token" };
    } else {
      let response = await searchMessageByText({
        text: commitTitle,
        user_token: parsedSlackData.user_token,
        count: 1,
      });
      slackValue = response?.messages?.matches;
    }
    return slackValue;
  }
  const [githubResult, jiraResult, slackResult] = await Promise.allSettled([
    fetchGitHubIssues(userTokens, owner, repo),
    fetchJiraTickets(userTokens, commitTitle),
    fetchSlackConversations(userTokens, commitTitle),
  ]);

  const githubIssues =
    githubResult.status === "fulfilled"
      ? githubResult.value
      : handleRejection(githubResult.reason);
  const jiraTickets =
    jiraResult.status === "fulfilled"
      ? jiraResult.value
      : handleRejection(jiraResult.reason);
  const slackConversations =
    slackResult.status === "fulfilled"
      ? slackResult.value
      : handleRejection(slackResult.reason);

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
