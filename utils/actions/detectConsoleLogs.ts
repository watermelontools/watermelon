const { Configuration, OpenAIApi } = require("openai");
import { App } from "@octokit/app";
import { successPosthogTracking } from "../../utils/api/posthogTracking";
import {
  failedToFetchResponse,
  missingParamsResponse,
} from "../../utils/api/responses";
import validateParams from "../../utils/api/validateParams";
import { Octokit } from "octokit";

const configuration = new Configuration({
  apiKey: process.env.OPEN_AI_KEY,
});
const openai = new OpenAIApi(configuration);

const app = new App({
  appId: process.env.GITHUB_APP_ID!,
  privateKey: process.env.GITHUB_PRIVATE_KEY!,
});

function getAdditions(filePatch: string) {
  const additions: string[] = [];

  // Split the patch into lines
  const lines = filePatch.split("\n");

  // Track if we are in a deletion block
  let inDeletionBlock = false;

  // Loop through lines
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    // Check if entering a deletion block
    if (line.startsWith("-")) {
      inDeletionBlock = true;
      continue;
    }

    // Check if exiting a deletion block
    if (line.startsWith("+") && inDeletionBlock) {
      inDeletionBlock = false;
      continue;
    }

    // If not in a deletion block, add lines starting with +
    if (!inDeletionBlock && line.startsWith("+")) {
      additions.push(line);
    }

    // Delete the pluses
    lines[i] = line.replace("+", "");

    // Trim the line to delete leading spaces
    lines[i] = lines[i].trim();

    // If the line is a comment, remove it
    if (
      lines[i].startsWith("#") ||
      lines[i].startsWith("//") ||
      lines[i].startsWith("/*")
    ) {
      lines.splice(i, 1);
      i--;
    }
  }

  return lines.join("\n");
}

function getConsoleLogPosition(filePatchAndIndividualLine: any) {
  let positionInDiff = 1;
  const { filePatch, individualLine } = filePatchAndIndividualLine;

  // get the position of the indiviudalLine in th filePatch
  const lines = filePatch.split("\n");
  for (let i = 1; i < lines.length; i++) {
    if (lines[i].includes(individualLine)) {
      positionInDiff = i;
      break;
    }
  }

  return positionInDiff;
}

export default async function detectConsoleLogs({
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

  // get the diffs
  const { data: diffFiles } = await octokit.request(
    "GET /repos/{owner}/{repo}/pulls/{pull_number}/files",
    {
      owner,
      repo,
      pull_number: issue_number,
    }
  );

  const commentPromises = diffFiles.map(async (file) => {
    const additions = getAdditions(file.patch ?? "");

    const consoleLogDetectionPrompt = `You are going to parse code diffs in 
    a Pull Request to detect if there are security vulnerabilities.
    You are going to detect console logs or its equivalent in another programming language,
    and exposed environment variables. You are going to be given a list of code additions to
    identify the following:
    
    First: 
    If there's a console log or its equivalent in another programming language 
    such as Java, Golang, Python, C, Rust, C++, etc.
    (console.log(), println(), println!(), System.out.println(), print(), fmt.Println(), and  
    cout << "Print a String" << endl; are some examples). 
    If the console log or its equivalent in another language is in a code comment, don't
    count it as a detected console log. For example JavaScript comments start with // or /*, 
    Python comments start with #.
    Other console functions such as console.info() shouldn't be counted as console logs.
    Ignore code comments from this analysis. 
    If there is a console log, return "true", else return "false".
    If you return true, return a string that that has 3 values: result (true), the line of code,
      and the vulnerability type detected with is consoleLog in this case.
    The line value, is the actual line in the file that contains the console log.
    For example: true,console.log("hello world");,console log
    
    Second:
    If there's an exposed environment variable or environment secret. 
    Search for embedded secrets. Identify patterns that resembble API keys,
    passwords, and secret tokens. 
    Look for strings matching common key formats (eg., API_KEY=, PASSWORD=, SECRET=).
    Detect if the credentials are hardcoded. Calling process.env (and its equivalent
      in other programming languages) is fine.
    For example: API_KEY=process.env.OPENAI_API_KEY is fine. 
    However, something like API_KEY='abcd1234' is not.
    If there is an exposed environment secret, return "true", else return "false".
    If you return true, return a string that that has 3 values: result (true), the line of code,
      and the vulnerability type detected with is exposedEnvSecret in this case.
    The line value, is the actual line in the file that contains the exposed environment secret.
    For example: true,const API_KEY='abcd1234';,exposed environment secret
    `;

    // detect if the additions contain console logs or not
    try {
      return await openai
        .createChatCompletion({
          model: "gpt-4-1106-preview",
          messages: [
            {
              role: "system",
              content: `${consoleLogDetectionPrompt} \n ${additions}`,
            },
          ],
        })
        .then((result) => {
          const openAIResult =
            result.data.choices[0].message.content.split(",");

          const addtionsHaveConsoleLog = openAIResult[0];
          const individualLine = openAIResult[1];
          const vulnerabilityTypeDetected = openAIResult[2];

          if (addtionsHaveConsoleLog === "true") {
            const commentFileDiff = () => {
              return octokit
                .request("GET /repos/{owner}/{repo}/pulls/{pull_number}", {
                  owner,
                  repo,
                  pull_number: issue_number,
                })
                .then((result) => {
                  const latestCommitHash = result.data.head.sha;

                  const consoleLogPosition = getConsoleLogPosition({
                    filePatch: file.patch ?? "",
                    individualLine,
                  });

                  return octokit
                    .request(
                      "POST /repos/{owner}/{repo}/pulls/{pull_number}/reviews",
                      {
                        owner,
                        repo,
                        pull_number: issue_number,
                        commit_id: latestCommitHash,
                        event: "COMMENT",
                        path: file.filename,
                        comments: [
                          {
                            path: file.filename,
                            position: consoleLogPosition || 1, // comment at the beggining of the file by default
                            body: `This file contains at least one ${vulnerabilityTypeDetected}. Please remove any present.`,
                          },
                        ],
                      }
                    )
                    .catch((err) => {
                      console.log(err);
                    });
                })
                .catch((err) => {
                  console.log(err);
                });
            };

            commentFileDiff();
          }
        });
    } catch {}
  });
  try {
    await Promise.allSettled(commentPromises);
  } catch {}
}
