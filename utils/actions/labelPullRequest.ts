const { Configuration, OpenAIApi } = require("openai");
import { App } from "@octokit/app";
import { successPosthogTracking } from "../../utils/api/posthogTracking";
import { failedToFetchResponse } from "../../utils/api/responses";

const configuration = new Configuration({
  apiKey: process.env.OPEN_AI_KEY,
});
const openai = new OpenAIApi(configuration);

const app = new App({
  appId: process.env.GITHUB_APP_ID!,
  privateKey: process.env.GITHUB_PRIVATE_KEY!,
});

export default async function flagPullRequest({
  prTitle,
  businessLogicSummary,
  installationId,
  owner,
  repo,
  issue_number,
  reqUrl,
  reqEmail,
}: {
  prTitle?: string;
  businessLogicSummary?: string;
  installationId: number;
  owner: string;
  repo: string;
  issue_number: number;
  reqUrl: string;
  reqEmail: string;
}) {
  const octokit = await app.getInstallationOctokit(installationId);

  let prompt = `The goal of this PR is to: ${prTitle}. \n The information related to this PR is: ${businessLogicSummary}. \n On a scale of 1(very different)-10(very similar), how similar the PR's goal and the PR's related information are? Take into account semantics. Don't explain your reasoning, just print the rating. Don't give a range for the rating, print a single value.`;

  // Fetch all comments on the PR
  const comments = await octokit.request(
    "GET /repos/{owner}/{repo}/issues/{issue_number}/comments?sort=created&direction=desc",
    {
      owner,
      repo,
      issue_number,
      headers: {
        "X-GitHub-Api-Version": "2022-11-28",
      },
    }
  );

  // Find our bot's comment
  let botComment = comments.data.find((comment) => {
    if (comment.body.includes("This PR contains console logs")) {
      // concat to the prompt
      prompt +=
        "Since the PR contains console logs, make the maximum rating 8.";
    }
  });

  let labels = {
    SAFE_TO_MERGE: "🍉 Safe to Merge",
    TAKE_A_DEEPER_DIVE: "👀 Take a deeper dive",
    DONT_MERGE: "🚨 Don't Merge",
  };

  async function modifyLabel(issue_number, labelName, action) {
    try {
      await octokit.request(
        `/${action} /repos/{owner}/{repo}/issues/{issue_number}/labels`,
        {
          owner,
          repo,
          issue_number,
          labels: action === "POST" ? [labelName] : labelName,
        }
      );
    } catch (error) {
      console.error(`Error during label ${action}`, error);
    }
  }
  const addLabel = (labelName) => modifyLabel(issue_number, labelName, "POST");
  const deleteLabel = (labelName) =>
    modifyLabel(issue_number, labelName, "DELETE");

  try {
    return await openai
      .createChatCompletion({
        model: "gpt-3.5-turbo-16k",
        messages: [
          {
            role: "system",
            content: prompt,
          },
        ],
      })
      .then((result) => {
        const prRating = result.data.choices[0].message.content;

        successPosthogTracking({
          url: reqUrl,
          email: reqEmail,
          data: {
            repo,
            owner,
            prRating,
          },
        });

        if (prRating >= 9) {
          deleteLabel(labels.DONT_MERGE);
          deleteLabel(labels.TAKE_A_DEEPER_DIVE);

          addLabel(labels.SAFE_TO_MERGE);
        } else if (prRating > 6) {
          deleteLabel(labels.SAFE_TO_MERGE);
          deleteLabel(labels.DONT_MERGE);

          addLabel(labels.TAKE_A_DEEPER_DIVE);
        } else {
          deleteLabel(labels.SAFE_TO_MERGE);
          deleteLabel(labels.TAKE_A_DEEPER_DIVE);

          addLabel(labels.DONT_MERGE);
        }
      });
  } catch (error) {
    return failedToFetchResponse({
      url: reqUrl,
      error: error.message,
      email: reqEmail,
    });
  }
}
