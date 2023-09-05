import { App } from "@octokit/app";
import executeRequest from "../../../../utils/db/azuredb";
import addActionCount from "../../../../utils/db/teams/addActionCount";

import getGitHub from "../../../../utils/actions/getGitHub";
import getJira from "../../../../utils/actions/getJira";
import getSlack from "../../../../utils/actions/getSlack";
import getNotion from "../../../../utils/actions/getNotion";
import getLinear from "../../../../utils/actions/getLinear";
import getConfluence from "../../../../utils/actions/getConfluence";
import getOpenAISummary from "../../../../utils/actions/getOpenAISummary";

import countMarkdown from "../../../../utils/actions/markdownHelpers/count";
import generalMarkdownHelper from "../../../../utils/actions/markdownHelpers/helper";

import addActionLog from "../../../../utils/db/github/addActionLog";
import { missingParamsResponse } from "../../../../utils/api/responses";
import validateParams from "../../../../utils/api/validateParams";
import {
  failedPosthogTracking,
  missingParamsPosthogTracking,
  successPosthogTracking,
} from "../../../../utils/api/posthogTracking";
import { NextResponse } from "next/server";
const app = new App({
  appId: process.env.GITHUB_APP_ID!,
  privateKey: process.env.GITHUB_PRIVATE_KEY!,
});

export async function POST(request: Request) {
  const { headers } = request;
  let textToWrite = "";
  const req = await request.json();
  const { missingParams } = validateParams(req, [
    "pull_request",
    "repository",
    "organization",
    "action",
    "number",
  ]);
  if (missingParams.length > 0) {
    missingParamsPosthogTracking({ url: request.url, missingParams });
    return missingParamsResponse({ missingParams });
  }
  try {
    // Verify and parse the webhook event
    const eventName = headers["x-github-event"];

    if (
      req.action === "opened" ||
      req.action === "reopened" ||
      req.action === "synchronize"
    ) {
      const { installation, repository, pull_request } = req;
      const installationId = installation.id;
      const { title, body } = req.pull_request;
      const owner = repository.owner.login;
      const repo = repository.name;
      const number = pull_request.number;
      const userLogin = pull_request.user.login;

      const octokit = await app.getInstallationOctokit(installationId);

      const query = `EXEC dbo.get_all_tokens_from_gh_username @github_user='${userLogin}'`;
      const wmUserData = await executeRequest(query);
      const {
        github_token,
        jira_token,
        jira_refresh_token,
        confluence_token,
        confluence_refresh_token,
        confluence_id,
        cloudId,
        slack_token,
        notion_token,
        linear_token,
        AISummary,
        JiraTickets,
        GitHubPRs,
        SlackMessages,
        NotionPages,
        LinearTickets,
        ConfluencePages,
        user_email,
        watermelon_user,
      } = wmUserData;
      if (!watermelon_user) {
        {
          // Post a new comment if no existing comment was found
          await octokit
            .request(
              "POST /repos/{owner}/{repo}/issues/{issue_number}/comments",
              {
                owner,
                issue_number: number,
                repo,
                body: "[Please login to Watermelon to see the results](https://app.watermelontools.com/)",
              }
            )
            .then((response) => {
              console.info("post comment", response.data);
            })
            .catch((error) => {
              return console.error("posting comment error", error);
            });
          return NextResponse.json("User not registered");
        }
      }
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
            .split(" ")
            .flatMap((word) => word.split(","))
            .map((word: string) => word.toLowerCase())
            .filter((word) => !stopwords.includes(word))
        )
      ).join(" ");
      // select six random words from the search string
      const randomWords = searchStringSetWTitleABody
        .split(" ")
        .sort(() => Math.random() - 0.5)
        .slice(0, 6);

      const [
        ghValue,
        jiraValue,
        confluenceValue,
        slackValue,
        notionValue,
        linearValue,
        count,
      ] = await Promise.all([
        getGitHub({
          repo,
          owner,
          github_token,
          randomWords,
          amount: GitHubPRs,
        }),
        getJira({
          user: user_email,
          token: jira_token,
          refresh_token: jira_refresh_token,
          randomWords,
          cloudId,
          amount: JiraTickets,
        }),
        getConfluence({
          token: confluence_token,
          refresh_token: confluence_refresh_token,
          cloudId: confluence_id,
          user: user_email,
          randomWords,
          amount: ConfluencePages,
        }),
        getSlack({
          slack_token,
          searchString: randomWords.join(" "),
          amount: SlackMessages,
        }),
        getNotion({
          notion_token,
          randomWords,
          amount: NotionPages,
        }),
        getLinear({
          linear_token,
          randomWords,
          amount: LinearTickets,
        }),
        addActionCount({ watermelon_user }),
      ]);
      textToWrite += `### WatermelonAI Summary \n`;

      let businessLogicSummary;
      if (AISummary) {
        businessLogicSummary = await getOpenAISummary({
          commitList,
          values: {
            ghValue,
            jiraValue,
            confluenceValue,
            slackValue,
            notionValue,
            linearValue,
          },
          title,
          body,
        });

        if (businessLogicSummary) {
          textToWrite += businessLogicSummary + "\n";
        } else {
          textToWrite +=
            "Error getting summary" + businessLogicSummary?.error + "\n";
        }
      } else {
        textToWrite += `AI Summary deactivated by ${userLogin} \n`;
      }

      textToWrite += generalMarkdownHelper({
        amount: GitHubPRs,
        value: ghValue,
        userLogin,
        systemName: "GitHub",
        systemResponseName: "GitHub PRs",
      });
      textToWrite += generalMarkdownHelper({
        amount: JiraTickets,
        value: jiraValue,
        userLogin,
        systemName: "Jira",
        systemResponseName: "Jira Tickets",
      });
      textToWrite += generalMarkdownHelper({
        amount: 3,
        value: confluenceValue,
        userLogin,
        systemName: "Confluence",
        systemResponseName: "Confluence Docs",
      });
      textToWrite += generalMarkdownHelper({
        amount: SlackMessages,
        value: slackValue,
        userLogin,
        systemName: "Slack",
        systemResponseName: "Slack Threads",
      });
      textToWrite += generalMarkdownHelper({
        amount: NotionPages,
        value: notionValue,
        userLogin,
        systemName: "Notion",
        systemResponseName: "Notion Pages",
      });
      textToWrite += generalMarkdownHelper({
        amount: LinearTickets,
        value: linearValue,
        userLogin,
        systemName: "Linear",
        systemResponseName: "Linear Tickets",
      });
      textToWrite += countMarkdown({
        count,
        isPrivateRepo: repository.private,
        repoName: repo,
      });

      await addActionLog({
        randomWords,
        ghValue,
        jiraValue,
        slackValue,
        notionValue,
        linearValue,
        textToWrite,
        businessLogicSummary,
        owner,
        repo,
        number,
        payload: req,
        count,
        watermelon_user,
      });
      // Fetch all comments on the PR
      const comments = await octokit.request(
        "GET /repos/{owner}/{repo}/issues/{issue_number}/comments?sort=created&direction=desc",
        {
          owner,
          repo,
          issue_number: number,
          headers: {
            "X-GitHub-Api-Version": "2022-11-28",
          },
        }
      );
      console.info("comments.data.length", comments.data.length);
      // Find our bot's comment
      let botComment = comments.data.find((comment) => {
        return comment.user.login.includes("watermelon-context");
      });
      if (botComment?.id) {
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
            console.log("post comment", {
              url: response.data.html_url,
              body: response.data.body,
              user: response.data?.user?.login,
            });
          })
          .catch((error) => {
            return console.error("posting comment error", error);
          });
      }
      successPosthogTracking({
        url: request.url,
        email: user_email,
        data: {
          repo,
          owner,
          number,
          action: req.action,
          textToWrite,
        },
      });
      return NextResponse.json({
        message: "success",
        textToWrite,
      });
    }
    return NextResponse.json({
      message: "wat",
      textToWrite,
    });
  } catch (error) {
    console.error("general action processing error", error);
    failedPosthogTracking({
      url: request.url,
      error: error.message,
      email: req.email,
    });

    return NextResponse.json({
      message: "Error processing webhook event",
      error,
      textToWrite,
    });
  }
}
