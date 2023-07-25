import { App } from "@octokit/app";
import { trackEvent } from "../../../utils/analytics/azureAppInsights";
import executeRequest from "../../../utils/db/azuredb";
import getGitHub from "../../../utils/actions/getGitHub";
import getJira from "../../../utils/actions/getJira";
import getSlack from "../../../utils/actions/getSlack";
import getOpenAISummary from "../../../utils/actions/getOpenAISummary";
import addActionCount from "../../../utils/db/teams/addActionCount";
import getNotion from "../../../utils/actions/getNotion";

const app = new App({
  appId: process.env.GITHUB_APP_IDx,
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
          notion_token,
          cloudId,
          AISummary,
          JiraTickets,
          GitHubPRs,
          SlackMessages,
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

        const [ghValue, jiraValue, slackValue, notionValue] = await Promise.all(
          [
            getGitHub({
              repo,
              owner,
              github_token,
              randomWords,
              amount: GitHubPRs,
            }),
            getJira({
              user: user_email,
              title,
              body,
              jira_token,
              jira_refresh_token,
              randomWords,
              amount: JiraTickets,
            }),
            getSlack({
              title,
              body,
              slack_token,
              randomWords,
              amount: SlackMessages,
            }),
            getNotion({
              notion_token,
              randomWords,
              amount: 3,
            }),
          ]
        );
        let businessLogicSummary;
        let textToWrite = "";

        textToWrite += "### WatermelonAI Summary (BETA)";
        textToWrite += `\n`;

        if (AISummary) {
          businessLogicSummary = await getOpenAISummary({
            values: {
              ghValue,
              jiraValue,
              confluenceValue,
              slackValue,
              notionValue,
              linearValue,
            },
            commitList,
            title,
            body,
          });

          if (businessLogicSummary) {
            textToWrite += businessLogicSummary;
          } else {
            textToWrite += "Error getting summary" + businessLogicSummary.error;
          }
        } else {
          textToWrite += `AI Summary deactivated by ${pull_request.user.login}`;
        }

        textToWrite += githubMarkdown({
          GitHubPRs,
          ghValue,
          userLogin: pull_request.user.login,
        });
        textToWrite += jiraMarkdown({
          JiraTickets,
          jiraValue,
          userLogin: pull_request.user.login,
        });
        textToWrite += slackMarkdown({
          SlackMessages,
          slackValue,
          userLogin: pull_request.user.login,
        });
        textToWrite += notionMarkdown({
          NotionPages,
          notionValue,
          userLogin: pull_request.user.login,
        });
        textToWrite += countMarkdown({
          count,
          isPrivateRepo: repository.private,
          repoName: repo,
        });

        // Fetch all comments on the PR
        const comments = await octokit.request(
          "GET /repos/{owner}/{repo}/issues/comments",
          {
            owner,
            repo,
            issue_number: number,
            headers: {
              "X-GitHub-Api-Version": "2022-11-28",
            },
          }
        );
        console.log("length", comments.data.length);
        // Find our bot's comment
        let botComment = comments.data.find((comment) =>
          comment.user.login.includes("watermelon-context")
        );
        console.log("bc", botComment);
        if (botComment) {
          console.log("bcID", botComment.id);
          // Update the existing comment
          await octokit.request(
            "PATCH /repos/{owner}/{repo}/issues/comments/{comment_id}",
            {
              owner,
              repo,
              comment_id: botComment.id,
              body: textToWrite,
            }
          );
        } else {
          // Post a new comment if no existing comment was found
          await octokit
            .request(
              "POST /repos/{owner}/{repo}/issues/{issue_number}/comments",
              {
                owner,
                issue_number: number,
                repo,
                body: textToWrite,
              }
            )
            .then((response) => {
              console.log(response.data);
            })
            .catch((error) => {
              return console.error("posting comment error", error);
            });
        }
      }
      return res.status(200).send("Webhook event processed");
    } catch (error) {
      console.error("general action processing error", error);
      res.status(500).send("Error processing webhook event");
    }
  } else {
    res.setHeader("Allow", "POST");
    res.status(405).end("Method Not Allowed");
  }
};
