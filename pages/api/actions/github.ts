import { Octokit } from "@octokit/rest";

const octokit = new Octokit({
  appId: process.env.GITHUB_APP_ID,
  privateKey: process.env.GITHUB_PRIVATE_KEY,
});

export default async (req, res) => {
  if (req.method === "POST") {
    try {
      // Verify and parse the webhook event
      const eventName = req.headers["x-github-event"];
      let { payload } = req.body;
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

      res.status(200).send("Webhook event processed");
    } catch (error) {
      console.error(error);
      res.status(500).send("Error processing webhook event");
    }
  } else {
    res.setHeader("Allow", "POST");
    res.status(405).end("Method Not Allowed");
  }
};
