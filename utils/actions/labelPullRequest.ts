const { Configuration, OpenAIApi } = require("openai");
import { App } from "@octokit/app";
import {
  failedPosthogTracking,
  missingParamsPosthogTracking,
  successPosthogTracking,
} from "../../utils/api/posthogTracking";
import {
  failedToFetchResponse,
  missingParamsResponse
} from "../../utils/api/responses";
import validateParams from "../../utils/api/validateParams";

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
  reqEmail
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

  const { missingParams } = validateParams("", ["prTitle", "businessLogicSummary", "installationId", "owner", "repo", "issue_number", "reqUrl", "reqEmail"]);

  if (missingParams.length > 0) {
    missingParamsPosthogTracking({
      missingParams,
      url: reqUrl,
    });
    return missingParamsResponse({ missingParams });
  }

  const prompt = `The goal of this PR is to: ${prTitle}. \n The information related to this PR is: ${businessLogicSummary}. \n On a scale of 1(very different)-10(very similar), how similar the PR's goal and the PR's related information are? Take into account semantics. Don't explain your reasoning, just print the rating. Don't give a range for the rating, print a single value.`;

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
            prRating
          },
        });

        if (prRating >= 2) {
          octokit.request(
            "POST /repos/{owner}/{repo}/issues/{issue_number}/labels", //add label
            {
              owner,
              repo,
              issue_number,
              labels: ["🍉 Safe to Merge"],
            }
          );
        } else {
          // remove label
          octokit.request(
            "DELETE /repos/{owner}/{repo}/issues/{issue_number}/labels/{name}",
            {
              owner,
              repo,
              issue_number,
              name: "🍉 Safe to Merge",
            }
          );
        }
      });
  } catch (error) {
    failedPosthogTracking({
      url: reqUrl,
      error: error.message,
      email: reqEmail,
    });
    return failedToFetchResponse({ error });
  }
}
