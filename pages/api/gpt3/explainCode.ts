import Airtable from "airtable";
import PostHog from 'posthog-node'

const client = new PostHog(
    process.env.POSTHOG_API_KEY,
    { host: 'https://app.posthog.com' }
)

Airtable.configure({
  endpointUrl: "https://api.airtable.com",
  apiKey: process.env.AIRTABLE_API_KEY,
});
const base = require("airtable").base("appDpKitgxjDIUwZ3");

const { Configuration, OpenAIApi } = require("openai");

export default async function handler(req, res) {

    const configuration = new Configuration({
        apiKey: process.env.OPENAI_API_KEY,
      });
      
    const openai = new OpenAIApi(configuration);

    const response = await openai.createCompletion("text-davinci-002", {
        prompt: "Explain code: "+req.body.codeBlock,
        temperature: 0.7,
        max_tokens: 64,
        top_p: 1.0,
    });
      
    // Analytics
    const { owner, repo, localUser, userEmail } = req.body;
    client.capture({
      distinctId: 'run-watermelon',
      event: `${owner} search`
    })
    let createdRecord = await base("Searches").create({
      Type: "Explain code",
      Owner: owner,
      Repo: repo,
      Username: localUser,
      Email: userEmail,
    });
    res.status(200).json(response.data.choices[0].text);
  }
  