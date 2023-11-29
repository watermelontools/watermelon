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
const consoleLogDetectionPrompt = `This is a list of code additions. Identify 
if there's a console log or its equivalent in another programming language 
such as Java, Golang, Python, C, Rust, C++, Ruby, etc.
(console.log(), println(), println!(), System.out.println(), print(), fmt.Println(), puts, and  cout << "Print a String" << endl; are some examples). 
If the console log or its equivalent in another language is in a code comment, don't
count it as a detected console log. For example JavaScript comments start with // or /*, 
Python comments start with #.
Other console functions such as console.info() shouldn't be counted as console logs.
Ignore code comments from this analysis. 
Something like 'input[type="email"]' is fine and should not be counted as a console log.
If there is a console log, return "true", else return "false".
If you return true, return a string that that has 2 values: result (true) and the line of code.
The line value, is the actual line in the file that contains the console log.
For example: true,console.log("hello world");`;

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

function getConsoleLogPosition({ filePatch, individualLine }) {
  // Split the filePatch into lines and find the index of the line that includes individualLine
  const lines = filePatch.split("\n");
  const zeroBasedIndex = lines.findIndex((line) =>
    line.includes(individualLine)
  );

  // Convert to one-based index, or return -1 if not found
  return zeroBasedIndex === -1 ? 0 : zeroBasedIndex + 1;
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

          if (addtionsHaveConsoleLog === "true") {
            const commentFileDiff = () => {
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
                  }
                )
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
