import { App } from "@octokit/app";
import { trackEvent } from "../../../utils/analytics/azureAppInsights";
import executeRequest from "../../../utils/db/azuredb";
import getGitHub from "../../../utils/actions/getGitHub";
import getJira from "../../../utils/actions/getJira";
import getSlack from "../../../utils/actions/getSlack";
import getOpenAISummary from "../../../utils/actions/getOpenAISummary";

const app = new App({
  appId: process.env.GITHUB_APP_ID,
  privateKey: process.env.GITHUB_PRIVATE_KEY,
});

export default async (req, res) => {
  if (req.method === "POST") {
    try {
      // Verify and parse the webhook event
      const eventName = req.headers["x-github-event"];
      let payload = req.body;

      if (
        payload.action === "opened" ||
        payload.action === "reopened" ||
        payload.action === "synchronize"
      ) {
        const { installation, repository, pull_request } = payload;
        const installationId = installation.id;
        const { title, body } = payload.pull_request;
        const owner = repository.owner.login;
        const repo = repository.name;
        const number = pull_request.number;
        trackEvent({
          name: "gitHubApp",
          properties: {
            user: pull_request.user.login,
            owner,
            repo,
            action: payload.action,
            //@ts-ignore
            issue_number: number,
          },
        });

        const octokit = await app.getInstallationOctokit(installationId);

        const query = `EXEC dbo.get_all_tokens_from_gh_username @github_user='${pull_request.user.login}'`;
        const wmUserData = await executeRequest(query);
        const {
          github_token,
          jira_token,
          jira_refresh_token,
          slack_token,
          cloudId,
          user_email,
        } = wmUserData;
        let octoCommitList = await octokit.request(
          "GET /repos/{owner}/{repo}/pulls/{pull_number}/commits",
          {
            repo: repository.name,
            owner: repository.owner.login,
            pull_number: number,
            headers: {
              "X-GitHub-Api-Version": "2022-11-28",
            },
          }
        );
        let commitList: string[] = [];

        for (let index = 0; index < octoCommitList?.data?.length; index++) {
          commitList.push(octoCommitList.data[index].commit.message);
        }
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
          "[",
          "]",
          "!",
          "{",
          "}",
          "(",
          ")",
          "''",
          '"',
          "``",
          "-",
          "_",
          ":",
          ";",
          ",",
          ".",
          "?",
          "/",
          "|",
          "&",
          "*",
          "^",
          "%",
          "$",
          "#",
          "##",
          "###",
          "####",
          "#####",
          "######",
          "#######",
          "@",
          "\n",
          "\t",
          "\r",
          "<!--",
          "-->",
          "/*",
          "*/",
          "[x]",
          "[]",
          "[ ]",
        ];
        // create a string from the commitlist set and remove stopwords in lowercase

        const searchStringSet = Array.from(commitSet).join(" ");
        // add the title and body to the search string, remove stopwords and remove duplicates
        const searchStringSetWTitleABody = Array.from(
          new Set(
            searchStringSet
              .concat(` ${title.split("/").join(" ")}`)
              .concat(` ${body}`.split("\n").join(" "))
              .split("\n")
              .flatMap((line) => line.split(","))
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

        const businessLogicSummary = await getOpenAISummary({
          ghValue,
          commitList,
          jiraValue,
          slackValue,
          title,
          body,
        });
        let textToWrite = "";

        textToWrite += "### WatermelonAI Summary (BETA)";
        textToWrite += `\n`;
        if (businessLogicSummary) {
          textToWrite += businessLogicSummary;
          textToWrite += `\n`;
        } else {
          textToWrite += "Error getting summary" + businessLogicSummary.error;
        }
        textToWrite += "### GitHub PRs";
        if (!Array.isArray(ghValue) && ghValue?.error === "no github token") {
          textToWrite += `\n No results found :(`;
        } else if (Array.isArray(ghValue) && ghValue?.length) {
          for (let index = 0; index < ghValue?.length; index++) {
            const element = ghValue[index];
            textToWrite += `\n - [#${element.number} - ${element.title}](${element.html_url})`;
            textToWrite += `\n`;
          }
        }

        textToWrite += `\n`;

        textToWrite += "### Jira Tickets";
        if (jiraValue?.error === "no jira token") {
          textToWrite += `\n [Click here to login to Jira](https://app.watermelontools.com)`;
        } else {
          if (jiraValue?.length) {
            for (let index = 0; index < jiraValue.length; index++) {
              const element = jiraValue[index];
              textToWrite += `\n - [${element.key} - ${element.fields.summary}](${element.serverInfo.baseUrl}/browse/${element.key})`;
              textToWrite += `\n`;
            }
          } else {
            textToWrite += `\n No results found :(`;
          }
        }
        textToWrite += `\n`;

        textToWrite += "### Slack Threads";
        if (
          !Array.isArray(slackValue) &&
          slackValue?.error === "no slack token"
        ) {
          textToWrite += `\n [Click here to login to Slack](https://app.watermelontools.com)`;
        } else if (Array.isArray(slackValue)) {
          if (slackValue?.length) {
            for (let index = 0; index < slackValue.length; index++) {
              const element = slackValue[index];
              textToWrite += `\n - [#${element.channel.name} - ${
                element.username
              }\n ${
                element.text.length > 100
                  ? element.text.substring(0, 100) + "..."
                  : element.text
              }](${element.permalink})`;
              textToWrite += `\n`;
            }
          } else {
            textToWrite += `\n No results found :(`;
          }
        }
        console.log(textToWrite);
        // Add a comment to the pull request
        const comment = {
          owner,
          repo,
          //@ts-ignore
          issue_number: number,
          body: textToWrite,
        };

        await octokit
          .request(
            `POST /repos/${repository.owner.login}/${repository.name}/issues/${pull_request.number}/comments`,
            comment
          )
          .then((response) => {
            console.log(response.data);
          })
          .catch((error) => {
            console.log(error);
          });
      }

      res.status(200).send("Webhook event processed");
    } catch (error) {
      console.error(error);
      res.status(500).send("Error processing webhook event");
    }
  } else {
    res.setHeader("Allow", "POST");
    res.status(405).end("Method Not Allowed");
  }
};
