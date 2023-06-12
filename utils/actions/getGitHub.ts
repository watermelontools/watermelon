import { Octokit } from "octokit";
type GHResult = { error: string } | any[];
const getGitHubData = async ({ github_token, amount, query }) => {
  let ghValue;
  const octokit = new Octokit({
    auth: github_token,
  });
  const issues = await octokit.rest.search.issuesAndPullRequests({
    q: query,
    is: "pr",
    type: "pr",
    per_page: amount,
  });
  ghValue = issues.data?.items;
  return ghValue;
};
async function getGitHub({
  repo,
  owner,
  github_token,
  randomWords,
  amount = 3,
  userLogin,
}: {
  repo: string;
  owner: string;
  github_token: string;
  randomWords: string[];
  amount?: number;
  userLogin: string;
}): Promise<string> {
  let markdown = "### GitHub PRs";
  if (!github_token) {
    markdown += `\n Error - no github token \n`;
    return markdown;
  }
  if (!amount) {
    markdown += `\n GitHub PRs deactivated by ${userLogin} \n`;
    return markdown;
  }
  // create the query with the random words and the owner
  const query = `${randomWords.join(" OR ")} org:${owner}`;
  let ghValue = await getGitHubData({ github_token, amount, query });
  markdown += githubMarkdown({ ghValue });
  return markdown;
}
export default getGitHub;
