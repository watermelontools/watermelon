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

export default async function handler(req, res) {
  client.capture({
    distinctId: 'slack',
    event: `slack-help`
  })
  let createdRecord = await base("Slackhelp").create({
    Click:"click",
  });
  res.status(200).json(createdRecord.fields);
}
