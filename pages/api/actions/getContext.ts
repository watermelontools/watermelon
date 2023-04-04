import getJiraOrganization from "../../../utils/db/jira/getOrganization";
import getJiraToken from "../../../utils/jira/refreshTokens";
import { Octokit } from "octokit";
import updateTokens from "../../../utils/db/jira/updateTokens";
import updateTokensFromJira from "../../../utils/jira/updateTokens";
import executeRequest from "../../../utils/db/azuredb";
import searchMessageByText from "../../../utils/slack/searchMessageByText";
import getConversationReplies from "../../../utils/slack/getConversationReplies";

const { Configuration, OpenAIApi } = require("openai");
const configuration = new Configuration({
  apiKey: process.env.OPEN_AI_KEY,
});
const openai = new OpenAIApi(configuration);

async function getGitHub({ repo, owner, github_token, randomWords }) {
  let ghValue = {};

  // create the query with the random words and the owner
  const q = `${randomWords.join(" OR ")} org:${owner}`;
  const octokit = new Octokit({
    auth: github_token,
  });
  const issues = await octokit.rest.search.issuesAndPullRequests({
    q,
    is: "pr",
    type: "pr",
  });
  const ghcommentsPromises = issues.data.items.map(
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
  return ghValue;
}
async function getJira({
  user,
  title,
  body,
  jira_token,
  jira_refresh_token,
  randomWords,
}) {
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

    if (!user) {
      return { error: "no user" };
    }

    const { access_token } = await getJiraToken({ user });
    if (!access_token) {
      return { error: "no access_token" };
    }

    const { jira_id } = await getJiraOrganization(user);
    if (!jira_id) {
      return { error: "no Jira cloudId" };
    }

    const summaryQuery = randomWords
      .split(" OR ")
      .map((word) => `summary ~ "${word}"`)
      .join(" OR ");
    const descriptionQuery = randomWords
      .split(" OR ")
      .map((word) => `description ~ "${word}"`)
      .join(" OR ");

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
          jql: `(${summaryQuery}) AND (${descriptionQuery}) ORDER BY created DESC`,
          expand: ["renderedFields"],
        }),
      }
    )
      .then((res) => res.json())
      .then((resJson) => resJson.issues);
    const serverPromise = async () => {
      const serverInfo = await fetch(
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
    const commentsPromises = returnVal?.map(async (element, index) => {
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
  return jiraValue;
}
async function getSlack({ title, body, slack_token, randomWords }) {
  let slackValue = {};
  if (slack_token) {
    let response = await searchMessageByText({
      text: `${randomWords.toString()} OR ${title} OR  ${body}`,
      user_token: slack_token,
    });
    const repliesPromises = response.messages.matches.map(
      async (match, index) => {
        response.messages.matches[index].comments = [];
        const replies = await getConversationReplies({
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
  return slackValue;
}
export default async function handler(req, res) {
  const { user, title, body, repo, owner, commitList } = req.body;
  const query = `EXEC dbo.get_all_tokens_from_gh_username @github_user='${user}'`;
  const resp = await executeRequest(query);
  const { github_token, jira_token, jira_refresh_token, slack_token, cloudId } =
    resp;
  const commitSet = new Set(commitList.split(","));
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
  // create a string from the commitlist set and remove stopwords in lowercase

  const searchStringSet = Array.from(commitSet).join(" ");

  // add the title and body to the search string, remove stopwords and remove duplicates
  const searchStringSetWTitleABody = Array.from(
    new Set(
      searchStringSet
        .concat(` ${title.split("/").join(" ")}`)
        .concat(` ${body}`)
        .split(" ")
        .map((commit: string) => commit.toLowerCase())
        .filter((commit) => !stopwords.includes(commit))
        .join(" ")
        .split(" ")
    )
  ).join(" ");

  // let GPT choose the 6 most relevant words from the search string
  const randomWords = await openai
    .createCompletion({
      model: "text-davinci-003",
      prompt: `"Get the 6 most relevant words from the following string: ${searchStringSetWTitleABody}"`,
      max_tokens: 128,
      temperature: 0.7,
    })
    .then((res) => res.data.choices[0].text.trim())
    .catch((err) => res.send("error: ", err.message));

  const [ghValue, jiraValue, slackValue] = await Promise.all([
    getGitHub({
      repo,
      owner,
      github_token,
      randomWords,
    }),
    getJira({
      user,
      title,
      body,
      jira_token,
      jira_refresh_token,
      randomWords,
    }),
    getSlack({ title, body, slack_token, randomWords }),
  ]);
  return res.send({ ghValue, jiraValue, slackValue });
}
