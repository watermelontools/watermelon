import { Webhooks } from "@octokit/webhooks";
import { Octokit } from "@octokit/rest";

const webhooks = new Webhooks({
  secret: process.env.WEBHOOK_SECRET,
});

const octokit = new Octokit({ auth: process.env.GITHUB_ACCESS_TOKEN });

// Handle the "pull_request" event
webhooks.on("pull_request", async ({ payload }) => {
  console.log("pull_request", payload);
  if (payload.action === "opened") {
    const { repository, pull_request } = payload;
    const comment = {
      owner: repository.owner.login,
      repo: repository.name,
      //@ts-ignore
      issue_number: pull_request.number,
      body: "Thank you for your pull request! We will review it shortly.",
    };

    // Add a comment to the pull request
    await octokit.rest.issues.createComment(comment);
  }
});

export const config = {
  api: {
    bodyParser: false,
  },
};

export default webhooks;
