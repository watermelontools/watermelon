import { App } from "@octokit/app";
import addActionCount from "../../../../utils/db/teams/addActionCount";

import getOpenAISummary from "../../../../utils/actions/getOpenAISummary";

import countMarkdown from "../../../../utils/actions/markdownHelpers/count";
import generalMarkdownHelper from "../../../../utils/actions/markdownHelpers/helper";

import addActionLog from "../../../../utils/db/github/addActionLog";
import {
  failedToFetchResponse,
  missingParamsResponse,
} from "../../../../utils/api/responses";
import validateParams from "../../../../utils/api/validateParams";

import labelPullRequest from "../../../../utils/actions/labelPullRequest";
import detectConsoleLogs from "../../../../utils/actions/detectConsoleLogs";

import {
  failedPosthogTracking,
  successPosthogTracking,
} from "../../../../utils/api/posthogTracking";
import { NextResponse } from "next/server";
import getAllServices from "../../../../utils/actions/getAllServices";
import randomText from "../../../../utils/actions/markdownHelpers/randomText";
import createTeamAndMatchUser from "../../../../utils/db/teams/createTeamAndMatchUser";
const app = new App({
  appId: process.env.GITHUB_APP_ID!,
  privateKey: process.env.GITHUB_PRIVATE_KEY!,
});

export async function POST(request: Request) {
  const { headers } = request;
  let textToWrite = "";
  const req = await request.json();
  const { missingParams } = validateParams(req, ["action"]);
  if (missingParams.length > 0) {
    return missingParamsResponse({ url: request.url, missingParams });
  }
  try {
    // Verify and parse the webhook event
    const eventName = headers["x-github-event"];

    if (
      req.action === "opened" ||
      req.action === "reopened" ||
      req.action === "synchronize"
    ) {
      const { missingParams } = validateParams(req, [
        "pull_request",
        "repository",
        "number",
      ]);
      if (missingParams.length > 0) {
        return missingParamsResponse({ url: request.url, missingParams });
      }
      const { installation, repository, pull_request } = req;
      const installationId = installation.id;
      const { title, body } = req.pull_request;
      const owner = repository.owner.login;
      const repo = repository.name;
      const number = pull_request.number;
      const userLogin = pull_request.user.login;

      const octokit = await app.getInstallationOctokit(installationId);

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
      const serviceAnswers = await getAllServices({
        userLogin,
        repo,
        owner,
        randomWords,
        url: request.url,
      });
      const {
        error,
        github,
        jira,
        confluence,
        slack,
        notion,
        linear,
        asana,
        watermelon_user,
        AISummary,
        user_email,
      } = serviceAnswers;
      if (error) {
        return failedToFetchResponse({
          url: request.url,
          error: error.message,
          email: req.email,
        });
      }
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

      const count = await addActionCount({ owner });

      textToWrite += `### WatermelonAI Summary \n`;
      let businessLogicSummary;
      if (AISummary) {
        businessLogicSummary = await getOpenAISummary({
          commitList,
          values: {
            github: github?.data,
            jira: jira?.data,
            confluence: confluence?.data,
            slack: slack?.data,
            notion: notion?.data,
            linear: linear?.data,
            asana: asana?.data,
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
        value: github,
        userLogin,
        systemName: "GitHub",
        systemResponseName: "GitHub PRs",
      });
      textToWrite += generalMarkdownHelper({
        value: jira,
        userLogin,
        systemName: "Jira",
        systemResponseName: "Jira Tickets",
      });
      textToWrite += generalMarkdownHelper({
        value: confluence,
        userLogin,
        systemName: "Confluence",
        systemResponseName: "Confluence Docs",
      });
      textToWrite += generalMarkdownHelper({
        value: slack,
        userLogin,
        systemName: "Slack",
        systemResponseName: "Slack Threads",
      });
      textToWrite += generalMarkdownHelper({
        value: notion,
        userLogin,
        systemName: "Notion",
        systemResponseName: "Notion Pages",
      });
      textToWrite += generalMarkdownHelper({
        value: linear,
        userLogin,
        systemName: "Linear",
        systemResponseName: "Linear Tickets",
      });
      textToWrite += generalMarkdownHelper({
        value: asana,
        userLogin,
        systemName: "Asana",
        systemResponseName: "Asana Tasks",
      });
      textToWrite += countMarkdown({
        count,
        isPrivateRepo: repository.private,
        repoName: repo,
      });
      textToWrite += randomText();

      await addActionLog({
        randomWords,
        github,
        jira,
        slack,
        notion,
        linear,
        asana,
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
          })
          .catch((error) => {
            failedPosthogTracking({
              url: request.url,
              error: error.message,
              email: req.email,
            });
            return console.error("posting comment error", error);
          });
      }

      // If the count is surpassed, we replace the
      if (count.github_app_uses > 500) {
        textToWrite = `Your team has surpassed the free monthly usage. [Please click here](https://calendly.com/evargas-14/watermelon-business) to upgrade.`;

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

        // Find our bot's comment
        let botComment = comments.data.find((comment) => {
          return comment.user.login.includes("watermelon-context");
        });

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
    } else if (req.action === "created" || req.action === "edited") {
      const { missingParams } = validateParams(req, [
        "installation",
        "repository",
        "comment",
        "issue",
      ]);
      if (missingParams.length > 0) {
        return missingParamsResponse({ url: request.url, missingParams });
      }
      const { installation, repository, comment, issue } = req;
      const { title, body } = req.issue;
      const owner = repository.owner.login;
      const repo = repository.name;
      const number = issue.number;
      const installationId = installation.id;
      const userLogin = comment.user.login;
      let botComment = comment.body;
      if (
        userLogin === "watermelon-context[bot]" &&
        botComment.includes("WatermelonAI Summary")
      ) {
        // extract the business logic summary, it's always the first paragraph under the title
        const businessLogicSummary = botComment
          .split("### WatermelonAI Summary")[1]
          .split("\n")[1];

        // Detect console.logs and its equivalent in other languages
        await detectConsoleLogs({
          prTitle: title,
          businessLogicSummary,
          repo,
          owner,
          issue_number: number,
          installationId,
          reqUrl: request.url,
          reqEmail: req.email,
        });

        // Make Watermelon Review the PR's business logic here by comparing the title with the AI-generated summary
        await labelPullRequest({
          prTitle: title,
          businessLogicSummary,
          repo,
          owner,
          issue_number: number,
          installationId,
          reqUrl: request.url,
          reqEmail: req.email,
        });
        successPosthogTracking({
          url: request.url,
          email: req.email,
          data: {
            repo,
            owner,
            number,
            action: req.action,
            businessLogicSummary,
          },
        });
      }
    }
    return NextResponse.json({
      message: "wat",
      textToWrite,
    });
  } catch (error) {
    console.error("general action processing error", error);

    return failedToFetchResponse({
      url: request.url,
      error: error.message,
      email: req.email,
    });
  }
}
