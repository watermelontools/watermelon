import getJiraOrganization from "../../../utils/db/jira/getOrganization";
import getJiraToken from "../../../utils/jira/refreshTokens";
import updateTokens from "../../../utils/db/jira/updateTokens";
import updateTokensFromJira from "../../../utils/jira/updateTokens";
import executeRequest from "../../../utils/db/azuredb";
import getGitHub from "../../../utils/actions/getGitHub";
import getSlack from "../../../utils/actions/getSlack";

async function getJira({
  user,
  title,
  body,
  jira_token,
  jira_refresh_token,
  randomWords,
}) {
  let jiraValue = {};
  if (jira_token !== null && jira_refresh_token !== null) {
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
    if (!newAccessTokens?.access_token) {
      return { error: "no access_token" };
    }

    const { jira_id } = await getJiraOrganization(user);
    if (!jira_id) {
      return { error: "no Jira cloudId" };
    }

    let returnVal = await fetch(
      `https://api.atlassian.com/ex/jira/${jira_id}/rest/api/3/search`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          Authorization: `Bearer ${newAccessTokens.access_token}`,
        },
        body: JSON.stringify({
          // ORDER BY issuetype ASC gives priority to bug tickets. If there are no bug tickets, it will still return stories
          // Sorting by description might be better than completely filtering out tickets without a description
          jql: `text ~ "${randomWords} OR ${title} OR ${body}" AND issuetype in (Bug, Story, Task, Sub-task, Epic) ORDER BY issuetype ASC, "Story Points" DESC, description DESC`,
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

            Authorization: `Bearer ${newAccessTokens.access_token}`,
          },
        }
      )
        .then((res) => res.json())
        .then((resJson) => resJson);
      returnVal.forEach((element, index) => {
        returnVal[index].serverInfo = serverInfo;
      });
    };

    if (returnVal) {
      await Promise.allSettled([serverPromise()]);
    }
    jiraValue = returnVal;
  } else {
    jiraValue = { error: "no jira token" };
  }
  return jiraValue;
}

export default async function handler(req, res) {
  const { user, title, body, repo, owner, number, commitList } = req.body;
  if (!user) {
    return res.send({ error: "no user" });
  }
  if (!title) {
    return res.send({ error: "no title" });
  }
  if (!body) {
    return res.send({ error: "no body" });
  }
  if (!repo) {
    return res.send({ error: "no repo" });
  }
  if (!owner) {
    return res.send({ error: "no owner" });
  }
  if (!number) {
    return res.send({ error: "no number" });
  }
  if (!commitList) {
    return res.send({ error: "no commitList" });
  }
  const query = `EXEC dbo.get_all_tokens_from_gh_username @github_user='${user}'`;
  const resp = await executeRequest(query);
  const {
    github_token,
    jira_token,
    jira_refresh_token,
    slack_token,
    cloudId,
    user_email,
  } = resp;
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
  // select six random words from the search string
  const randomWords = searchStringSetWTitleABody
    .split(" ")
    .sort(() => Math.random() - 0.5)
    .slice(0, 6);

  const [ghValue, jiraValue, slackValue] = await Promise.all([
    getGitHub({
      repo,
      owner,
      github_token,
      randomWords,
    }),
    getJira({
      user: user_email,
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
