import { App } from "@octokit/app";

const app = new App({
  appId: process.env.GITHUB_APP_ID,
  privateKey: process.env.GITHUB_PRIVATE_KEY,
});

export default async (req, res) => {
  if (req.method === "POST") {
    try {
      // Verify and parse the webhook event
      const eventName = req.headers["x-github-event"];
      let payload = req.body;
      console.log(payload);
      console.log(payload.action);

      if (
        payload.action === "opened" ||
        payload.action === "reopened" ||
        payload.action === "synchronize"
      ) {
        const { installation, repository, pull_request } = payload;
        const installationId = installation.id;

        const octokit = await app.getInstallationOctokit(installationId);

        const comment = {
          owner: repository.owner.login,
          repo: repository.name,
          //@ts-ignore
          issue_number: pull_request.number,
          body: "Thank you for your pull request! We will review it shortly.",
        };
        console.log(comment);

        // Add a comment to the pull request
        await octokit
          .request(
            `POST /repos/${repository.owner.login}/${repository.name}/issues/${pull_request.numbers}/comments`,
            comment
          )
          .then((response) => {
            console.log(response);
          })
          .catch((error) => {
            console.log(error);
          });
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
