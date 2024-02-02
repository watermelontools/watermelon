import { App } from "@octokit/app";

const app = new App({
  appId: process.env.GITHUB_APP_ID!,
  privateKey: process.env.GITHUB_PRIVATE_KEY!,
});

export default async function getDiffFiles({
  owner,
  repo,
  issue_number,
  installationId,
}: {
  owner: string;
  repo: string;
  issue_number: number;
  installationId: number;
}): Promise<any> {
  const octokit = await app.getInstallationOctokit(installationId);
  const { data: diffFiles } = await octokit.request(
    "GET /repos/{owner}/{repo}/pulls/{pull_number}/files",
    {
      owner,
      repo,
      pull_number: issue_number,
    }
  );
  return diffFiles;
}
