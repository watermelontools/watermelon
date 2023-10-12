import { App } from "@octokit/app";
import { StandardAPIResponse } from "../../types/watermelon";
async function getTeamGitHub({
  repo,
  owner,
  installationId,
  randomWords,
  amount = 3,
}): Promise<StandardAPIResponse> {
  // create the query with the random words and the owner
  const q = `${randomWords.join(" OR ")} org:${owner}`;
  const app = new App({
    appId: process.env.GITHUB_APP_ID!,
    privateKey: process.env.GITHUB_PRIVATE_KEY!,
  });
  const octokit = await app.getInstallationOctokit(installationId);

  const issues = await octokit.request("GET /search/issues", {
    q,
    is: "pr",
    type: "pr",
    per_page: amount,
  });

  return {
    fullData: issues.data?.items,
    data:
      issues.data?.items?.map(
        ({ title, body, html_url: link, number, created_at, user }) => ({
          title,
          body,
          link,
          number,
          created_at,
          author: user?.login,
        })
      ) || [],
  };
}
export default getTeamGitHub;
