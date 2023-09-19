import { Octokit } from "octokit";
import { StandardAPIResponse } from "../../types/watermelon";
async function getGitHub({
  repo,
  owner,
  github_token,
  randomWords,
  amount = 3,
}): Promise<StandardAPIResponse> {
  // create the query with the random words and the owner
  const q = `${randomWords.join(" OR ")} org:${owner}`;
  if (!github_token) {
    return { error: "no github token" };
  } else {
    const octokit = new Octokit({
      auth: github_token,
    });
    const issues = await octokit.rest.search.issuesAndPullRequests({
      q,
      is: "pr",
      type: "pr",
      per_page: amount,
    });

    console.log("issues[0] - getGithub.ts", issues.data.items[0]);
    // author is issues.data.items[0].user.login

    return {
      fullData: issues.data?.items,
      data:
        issues.data?.items?.map(({ title, body, html_url: link, number, created_at, user  }) => ({
          title,
          body,
          link,
          number,
          created_at,
          author: user?.login
        })) || [],
    };
  }
}
export default getGitHub;
