const { Configuration, OpenAIApi } = require("openai");
import { App } from "@octokit/app";

const configuration = new Configuration({
  apiKey: process.env.OPEN_AI_KEY,
});
const openai = new OpenAIApi(configuration);

const app = new App({
  appId: process.env.GITHUB_APP_ID!,
  privateKey: process.env.GITHUB_PRIVATE_KEY!,
});
const commentBody = `This PR contains console logs. Please review or remove them.`;

function getLineDiffs(filePatch: string) {
  const additions: string[] = [];
  const removals: string[] = [];

  // Split the patch into lines
  const lines = filePatch.split("\n");

  // Loop through lines
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    // Check if entering a deletion block
    if (line.startsWith("-")) {
      removals.push(line.replace("-", "").trim());
    }

    // Check if exiting a deletion block
    if (line.startsWith("+")) {
      additions.push(line.replace("+", "").trim());
    }
  }
  return { additions: additions.join("\n"), removals: removals.join("\n") };
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

  function getLatestCommitHash() {
    return octokit
      .request("GET /repos/{owner}/{repo}/pulls/{pull_number}", {
        owner,
        repo,
        pull_number: issue_number,
      })
      .then((result) => {
        return result.data.head.sha;
      })
      .catch((err) => {
        console.log(err);
      });
  }
  const latestCommitHash = await getLatestCommitHash();

  const commentPromises = diffFiles.map(async (file) => {
    const { additions } = getLineDiffs(file.patch ?? "");

    const splitAdditions = additions.split("\n");

    // RegEx to detect console log equivalents in different languages
    const consoleLogRegex = /(console\.log|print|printf|fmt\.Print|log\.Print|NSLog|puts|println|println!)\([^)]*\)(?![^]*?\/\/|[^]*?\/\*|#)/;
    
    // RegEx to ignore lines that contian //, /*, etc.
    const commentRegex = /^\s*\/{2,}|^\s*\/\*|\*\/|#/;

    for (let i=0; i < splitAdditions.length; i++) {
      let currentLine = splitAdditions[i];
      if (!currentLine.match(commentRegex) && currentLine.match(consoleLogRegex)) {
        const commentFileDiff = async () => {

          const consoleLogPosition = i + 1; // The +1 is because IDEs and GitHub file diff view index LOC at 1, not 0
  
          // await octokit
          // .request("POST /repos/{owner}/{repo}/pulls/{pull_number}/reviews", {
          //   owner,
          //   repo,
          //   pull_number: issue_number,
          //   commit_id:
          //     typeof latestCommitHash === "string"
          //       ? latestCommitHash
          //       : undefined,
          //   event: "COMMENT",
          //   path: file.filename,
          //   comments: [
          //     {
          //       path: file.filename,
          //       position: consoleLogPosition || 1, // comment at the beggining of the file by default
          //       body: commentBody,
          //     },
          //   ],
          // })

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
                  body: commentBody,
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
