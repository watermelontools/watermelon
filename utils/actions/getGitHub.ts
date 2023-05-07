import { Octokit } from "octokit";
type GHResult = { error: string } | any[];
async function getGitHub({
  repo,
  owner,
  github_token,
  randomWords,
}): Promise<GHResult> {
  let ghValue;

  // create the query with the random words and the owner
  const q = `${randomWords.join(" OR ")} org:${owner}`;
  if (!github_token) {
    ghValue = { error: "no github token" };
    return ghValue;
  } else {
    const octokit = new Octokit({
      auth: github_token,
    });
    const issues = await octokit.rest.search.issuesAndPullRequests({
      q,
      is: "pr",
      type: "pr",
    });
    ghValue = issues.data?.items?.slice(0, 3);
    return ghValue;
  }
}
export default getGitHub;
