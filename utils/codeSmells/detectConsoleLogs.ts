const { Configuration, OpenAIApi } = require("openai");
import { App } from "@octokit/app";
import getLatestCommitHash from "./getLatestCommitHash";
import { getLineDiffs } from "./getLineDiffs";

const configuration = new Configuration({
  apiKey: process.env.OPEN_AI_KEY,
});
const openai = new OpenAIApi(configuration);

const app = new App({
  appId: process.env.GITHUB_APP_ID!,
  privateKey: process.env.GITHUB_PRIVATE_KEY!,
});

const consoleLogCommentBody = `This PR contains console logs. Please review or remove them.`;

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

  const latestCommitHash = await getLatestCommitHash({
    installationId,
    owner,
    repo,
    issue_number,
  });

  const commentPromises = diffFiles.map(async (file) => {
    const { additions } = getLineDiffs(file.patch ?? "");

    // Leftout comment RegEx
    const leftoverCommentRegex = /^\/\*[\s\S]*?\*\/|\/\/[\s\S]*?\n/gm;
    const matches = additions.match(leftoverCommentRegex);
    const splitAdditions = additions.split("\n");

    // RegEx to detect console log equivalents in different languages
    const consoleLogRegex =
      /(console\.log|print|printf|fmt\.Print|log\.Print|NSLog|puts|println|println!)\([^)]*\)(?![^]*?\/\/|[^]*?\/\*|#)/;

    // RegEx to ignore lines that contian //, /*, etc.
    const commentRegex = /^\s*\/{2,}|^\s*\/\*|\*\/|#/;

    for (let i = 0; i < splitAdditions.length; i++) {
      let currentLine = splitAdditions[i];

      if (
        !currentLine.match(commentRegex) &&
        currentLine.match(consoleLogRegex)
      ) {
        const commentFileDiff = async () => {
          const consoleLogPosition = i + 1; // The +1 is because IDEs and GitHub file diff view index LOC at 1, not 0

          await octokit
            .request("POST /repos/{owner}/{repo}/pulls/{pull_number}/reviews", {
              owner,
              repo,
              pull_number: issue_number,
              commit_id:
                typeof latestCommitHash === "string"
                  ? latestCommitHash
                  : undefined,
              event: "COMMENT",
              path: file.filename,
              comments: [
                {
                  path: file.filename,
                  position: consoleLogPosition || 1, // comment at the beggining of the file by default
                  body: consoleLogCommentBody,
                },
              ],
            })
            .catch((err) => {
              throw err;
            });
        };

        commentFileDiff();
      }
    }
  });
  try {
    await Promise.allSettled(commentPromises);
  } catch {}
}
