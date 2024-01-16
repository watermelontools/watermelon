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

const consoleLogCommentBody = `This PR contains console logs. Please review or remove them.`;
const leftoverCommentBody = `This PR contains leftover multi-line comments. Please review or remove them.`;

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

  /*
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
  */

  const latestCommitHash = await getLatestCommitHash();

  console.log("before comment promises")

  const commentPromises = diffFiles.map(async (file) => {
    const { additions } = getLineDiffs(file.patch ?? "");


    // Leftover comment
    // const leftoverCommentRegex = /\*[^*]*\*+(?:[^/*][^*]*\*+)*\//
    // const leftoverCommentRegex = /^\/\*[^*]*\*+(?:[^/*][^*]*\*+)*\/(?!\*/gm;
    // const leftoverCommentRegex = /^\/\*[^*]*\*+(?:[^/*][^*]*\*+)*\/(?!\*/g;
    const leftoverCommentRegex = /^\/\*[\s\S]*?\*\//gm;


    console.log("leftover regex will be called")
    const matches = additions.match(leftoverCommentRegex);
    console.log("matches: ", matches)
    // This control flow isn't being reached 
    if (matches) {
      // line contains leftover comment
      console.log("LEFTOVER COMMENT HERE - additions scope");

      const firstMatch = matches[0];
  
      // Find the position of the start of the comment
      const startPos = additions.indexOf(firstMatch);
    
      // Split the additions into lines
      const lines = additions.split('\n');
    
      // Loop through the lines to find the line index
      let lineIndex;
      let pos = 0;
      for (let i = 0; i < lines.length; i++) {
        const line = lines[i];
        if (pos + line.length >= startPos) {
          lineIndex = i;
          break;
        }
        pos += line.length + 1; // +1 for newline
      }
    
      // Line number is line index + 1
      const lineNumber = lineIndex + 1;

      console.log("lineNumber", lineNumber);

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
            position:  8, // comment at the beggining of the file by default
            body: leftoverCommentBody,
          },
        ],
      })
      .catch((err) => {
        throw err;
      });
    } 

    const splitAdditions = additions.split("\n");

    // RegEx to detect console log equivalents in different languages
    const consoleLogRegex = /(console\.log|print|printf|fmt\.Print|log\.Print|NSLog|puts|println|println!)\([^)]*\)(?![^]*?\/\/|[^]*?\/\*|#)/;
    
    // RegEx to ignore lines that contian //, /*, etc.
    const commentRegex = /^\s*\/{2,}|^\s*\/\*|\*\/|#/;

    for (let i=0; i < splitAdditions.length; i++) {
      let currentLine = splitAdditions[i];

      if (!currentLine.match(commentRegex) && currentLine.match(consoleLogRegex)) {
        // const commentFileDiff = async () => {

        //   const consoleLogPosition = i + 1; // The +1 is because IDEs and GitHub file diff view index LOC at 1, not 0
  
        //   await octokit
        //     .request("POST /repos/{owner}/{repo}/pulls/{pull_number}/reviews", {
        //       owner,
        //       repo,
        //       pull_number: issue_number,
        //       commit_id:
        //         typeof latestCommitHash === "string"
        //           ? latestCommitHash
        //           : undefined,
        //       event: "COMMENT",
        //       path: file.filename,
        //       comments: [
        //         {
        //           path: file.filename,
        //           position: consoleLogPosition || 1, // comment at the beggining of the file by default
        //           body: consoleLogCommentBody,
        //         },
        //       ],
        //     })
        //     .catch((err) => {
        //       throw err;
        //     });
        // };
  
        // commentFileDiff();
      }
  
    }
  });
  try {
    await Promise.allSettled(commentPromises);
  } catch {}
}
