import getJiraOrganization from "../../../utils/db/jira/getOrganization";
import getJiraToken from "../../../utils/jira/refreshTokens";
import { Octokit } from "octokit";
import updateTokens from "../../../utils/db/jira/updateTokens";
import updateTokensFromJira from "../../../utils/jira/updateTokens";
import executeRequest from "../../../utils/db/azuredb";
import searchMessageByText from "../../../utils/slack/searchMessageByText";
import getConversationReplies from "../../../utils/slack/getConversationReplies";
import Slack from "../../slack";

export default async function handler(req, res) {
  const { user, title, body, repo, owner, commitList } = req.body;
  const query = `EXEC dbo.get_all_tokens_from_gh_username @github_user='${user}'`;
  const resp = await executeRequest(query);
  const { github_token, jira_token, jira_refresh_token, slack_token, cloudId } =
    resp;
  const commitSet = new Set(commitList);
  const stopwords = [
    "a",
    "about",
    "add comments",
    "add",
    "all",
    "an",
    "and",
    "as",
    "at",
    "better",
    "build",
    "bump dependencies",
    "bump version",
    "but",
    "by",
    "call",
    "cd",
    "change",
    "changed",
    "changes",
    "changing",
    "chore",
    "ci",
    "cleanup",
    "code review",
    "comment out",
    "commit",
    "commits",
    "config",
    "config",
    "create",
    "critical",
    "debug",
    "delete",
    "dependency update",
    "deploy",
    "docs",
    "documentation",
    "eslint",
    "feat",
    "feature",
    "fix",
    "fix",
    "fixed",
    "fixes",
    "fixing",
    "for",
    "from",
    "get",
    "github",
    "gitignore",
    "hack",
    "he",
    "hotfix",
    "husky",
    "if",
    "ignore",
    "improve",
    "improved",
    "improvement",
    "improvements",
    "improves",
    "improving",
    "in",
    "init",
    "is",
    "lint-staged",
    "lint",
    "linting",
    "list",
    "log",
    "logging",
    "logs",
    "major",
    "merge conflict",
    "merge",
    "minor",
    "npm",
    "of",
    "on",
    "oops",
    "or",
    "package-lock.json",
    "package.json",
    "prettier",
    "print",
    "quickfix",
    "refactor",
    "refactored",
    "refactoring",
    "refactors",
    "release",
    "remove comments",
    "remove console",
    "remove",
    "remove",
    "removed",
    "removes",
    "removing",
    "revert",
    "security",
    "setup",
    "squash",
    "start",
    "style",
    "stylelint",
    "temp",
    "test",
    "tested",
    "testing",
    "tests",
    "the",
    "to",
    "try",
    "typo",
    "up",
    "update dependencies",
    "update",
    "updated",
    "updates",
    "updating",
    "use",
    "version",
    "was",
    "wip",
    "with",
    "yarn.lock",
    "master",
    "main",
    "dev",
    "development",
    "prod",
    "production",
    "staging",
    "stage",
  ];
  let ghValue = {};
  // create a string from the commitlist set and remove stopwords in lowercase
  const commitListString = Array.from(commitSet)
    .join(" ")
    .split(" ")
    .filter((word) => !stopwords.includes(word.toLowerCase()))
    .join(" ")
    .split(",");
  // now take the max 256 characters of the string
  const commitListString256 = commitListString.slice(0, 256);
  console.log("commitListString256", commitListString256);
  const octokit = new Octokit({
    auth: github_token,
  });
  let searchString = `${commitListString256.toString()} ${title} ${body ?? ""}`
    .toLowerCase()
    .replace(/\s{2,}/g, " ")
    .slice(0, 230);

  let q = `${searchString} org:${owner}`;
  console.log("q", q);
  let issues = await octokit.rest.search.issuesAndPullRequests({
    q,
    is: "pr",
    type: "pr",
  });
  console.log("issues", issues.data);
  let ghcommentsPromises = issues.data.items.map(
    async (issue, index) =>
      await octokit.rest.issues
        .listComments({
          owner,
          repo,
          issue_number: issue.number,
        })
        .then((comments) => {
          //@ts-ignore
          issues.data.items[index].comments = comments.data;
        })
  );
  await Promise.allSettled(ghcommentsPromises);
  ghValue = issues.data.items;
  let jiraValue = {};
  if (jira_token && jira_refresh_token) {
    const newAccessTokens = await updateTokensFromJira({
      refresh_token: jira_refresh_token,
    });
    await updateTokens({
      access_token: newAccessTokens.access_token,
      refresh_token: newAccessTokens.refresh_token,
      user,
    });

    // parse pr_title
    let parsedTitle = "";

    if (title) {
      parsedTitle = title
        .trim()
        .split(" ")
        .filter((word) => !stopwords.includes(word.toLowerCase()))
        .join(" ")
        .split(" ")
        .join(" OR ");
    }

    if (!user) {
      return res.send({ error: "no user" });
    }

    let { access_token } = await getJiraToken({ user });
    if (!access_token) {
      return res.send({ error: "no access_token" });
    }

    let { jira_id } = await getJiraOrganization(user);
    if (!jira_id) {
      return res.send({ error: "no Jira cloudId" });
    }

    let returnVal = await fetch(
      `https://api.atlassian.com/ex/jira/${jira_id}/rest/api/3/search`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          Authorization: `Bearer ${access_token}`,
        },
        body: JSON.stringify({
          // ORDER BY issuetype ASC gives priority to bug tickets. If there are no bug tickets, it will still return stories
          // Sorting by description might be better than completely filtering out tickets without a description
          jql: `text ~ "${parsedTitle} OR ${title} OR ${body}" AND issuetype in (Bug, Story, Task, Sub-task, Epic) ORDER BY issuetype ASC, "Story Points" DESC, description DESC`,
          expand: ["renderedFields"],
        }),
      }
    )
      .then((res) => res.json())
      .then((resJson) => resJson.issues);
    let serverPromise = async () => {
      let serverInfo = await fetch(
        `https://api.atlassian.com/ex/jira/${jira_id}/rest/api/3/serverInfo`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",

            Authorization: `Bearer ${access_token}`,
          },
        }
      )
        .then((res) => res.json())
        .then((resJson) => resJson);
      returnVal.forEach((element, index) => {
        returnVal[index].serverInfo = serverInfo;
      });
    };
    let commentsPromises = returnVal?.map(async (element, index) => {
      returnVal[index].comments = [];
      return await fetch(
        `https://api.atlassian.com/ex/jira/${jira_id}/rest/api/3/issue/${element.key}/comment?expand=renderedBody`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
            Authorization: `Bearer ${access_token}`,
          },
        }
      )
        .then((res) => res.json())
        .then((resJson) => {
          returnVal[index].comments.push(...resJson.comments);
          return resJson;
        });
    });
    if (returnVal) {
      await Promise.allSettled([...commentsPromises, serverPromise()]);
    }
    jiraValue = returnVal;
  } else {
    jiraValue = { error: "no jira token" };
  }
  let slackValue = {};
  if (slack_token) {
    let response = await searchMessageByText({
      text: commitListString256.toString() + " OR " + title + " OR " + body,
      user_token: slack_token,
    });
    let repliesPromises = response.messages.matches.map(
      async (match, index) => {
        response.messages.matches[index].comments = [];
        let replies = await getConversationReplies({
          ts: match.ts,
          user_token: slack_token,
          channelId: match.channel.id,
        });
        response.messages.matches[index].replies.push(...replies.messages);
      }
    );
    await Promise.allSettled(repliesPromises);
    slackValue = response.messages.matches;
  } else {
    slackValue = { error: "no slack token" };
  }
  return res.send({ ghValue, jiraValue, slackValue });
}
