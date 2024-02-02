import { App } from "@octokit/app";

const app = new App({
  appId: process.env.GITHUB_APP_ID!,
  privateKey: process.env.GITHUB_PRIVATE_KEY!,
});
export default async function getLatestCommitHash({
  installationId,
  owner,
  repo,
  issue_number,
}: {
  installationId: number;
  owner: string;
  repo: string;
  issue_number: number;
}) {
  const octokit = await app.getInstallationOctokit(installationId);

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
      throw err;
    });
}
