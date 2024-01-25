import { App } from "@octokit/app";
import getDiffFiles from "./getDiffFiles";
import getLatestCommitHash from "./getLatestCommitHash";
import { getLineDiffs } from "./getLineDiffs";

const app = new App({
  appId: process.env.GITHUB_APP_ID!,
  privateKey: process.env.GITHUB_PRIVATE_KEY!,
});

const leftoverCommentBody = `This PR contains leftover multi-line comments. Please review or remove them.`;

export default async function detectLeftoutComments({
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
  const diffFiles = await getDiffFiles({
    owner,
    repo,
    issue_number,
    installationId,
  });

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

    if (matches) {
      const firstMatch = matches[0];

      // Find the position of the start of the comment, then split the additions into lines
      const startPos = additions.indexOf(firstMatch);
      const lines = additions.split("\n");

      // This is very important
      // lineNumber is not the position of the comment in the file, but the line number in the diff (this is on the Octokit docs)
      // What's important to note here is that after the header that contains a "@@" on the GitHub code review UI, GitHub adds 3 lines before the code diff. So that's why we need to index this variable at 4.
      let lineNumber = 4;

      for (let i = 0; i < lines.length; i++) {
        const line = lines[i];
        if (line.includes(firstMatch)) {
          lineNumber = i + 1;
          break;
        }
      }

      await octokit
        .request("POST /repos/{owner}/{repo}/pulls/{pull_number}/reviews", {
          owner,
          repo,
          pull_number: issue_number,
          commit_id:
            typeof latestCommitHash === "string" ? latestCommitHash : undefined,
          event: "COMMENT",
          path: file.filename,
          comments: [
            {
              path: file.filename,
              position: lineNumber, // comment at the beggining of the file by default
              body: leftoverCommentBody,
            },
          ],
        })
        .catch((err) => {
          throw err;
        });
    }
  });
  try {
    await Promise.allSettled(commentPromises);
  } catch {}
}
