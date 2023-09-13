import { Octokit } from "octokit";

function flagPullRequest({
  repo, 
  owner,
  issue_number,
  github_token
}): any {

  if (!github_token) {
    return { error: "no github token" };
  }

  const octokit = new Octokit({
    auth: github_token
  });

  octokit.rest.issues.addLabels({
    owner,
    repo,
    issue_number,
    labels: ["🍉 Safe to Merge"] 
  });

}

export default flagPullRequest;
