import { Octokit } from "octokit";

async function flagPullRequest({
  repo,
  owner,
  issue_number,
  github_token,
}): Promise<any> {
  if (!github_token) {
    return { error: "no github token" };
  } else {
    const octokit = new Octokit({
      auth: github_token,
    });

    const labelsInPR = await octokit.rest.issues.listLabelsOnIssue({
      owner,
      repo,
      issue_number,
    });

    if (labelsInPR.data.some((label) => label.name === "safe-to-merge")) {
      return { message: "PR already flagged as safe to merge" };
    } else {
      await octokit.rest.issues.addLabels({
        owner,
        repo,
        issue_number,
        labels: ["🍉 Safe to Merge"],
      });

      return { message: "PR flagged as safe to merge" };
    }
  }
}

export default flagPullRequest;
