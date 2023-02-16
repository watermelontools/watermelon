const { Configuration, OpenAIApi } = require("openai");
const configuration = new Configuration({
  apiKey: process.env.OPEN_AI_KEY,
});
const openai = new OpenAIApi(configuration);

export default async function handler(req, res) {
  let {
    pr_title,
    pr_body,
    ticket_title,
    ticket_body,
    thread_body,
    user_email,
  } = req.body;

  // The product reason why we only make the code and git parameters mandatory is because there might not
  // always be a ticket or Slack thread associated with the PR.
  if (!pr_title) {
    return res.send({ error: "no PR Title" });
  }

  if (!pr_body) {
    return res.send({ error: "no PR Body" });
  }

  if (!user_email) {
    return res.send({ error: "No user email" });
  }

  const prTitlePrompt = `Most relevant Pull Request title: ${pr_title} \n`;
  const prBodyPrompt = `Most relevant Pull Request body: ${pr_body} \n`;
  const additionalInstructions =
    "Explain the context of the code taking into account its context from the most relevant pull request, the most relevant ticket, the most relevant commit message and most relevant thread body.";

  let ticketTitlePrompt = "";
  let ticketBodyPrompt = "";
  let threadBodyPrompt = "";

  if (ticket_title) {
    ticketTitlePrompt = `Most relevant ticket title: ${ticket_title} \n`;
  }
  if (ticket_body) {
    ticketBodyPrompt = `Most relevant ticket body: ${ticket_body} \n`;
  }
  if (thread_body) {
    threadBodyPrompt = `Most relevant message thread body: ${thread_body} \n`;
  }

  try {
    const codeContextSummary = await openai
      .createCompletion({
        model: "text-davinci-003",
        prompt: `${prTitlePrompt} ${prBodyPrompt} ${ticketTitlePrompt} ${ticketBodyPrompt} ${threadBodyPrompt} ${additionalInstructions}`,
        max_tokens: 128,
        temperature: 0.7,
      })
      .then((res) => res.data.choices[0].text.trim())
      .catch((err) => res.send("error: ", err.message));

    return res.send(codeContextSummary);
  } catch (error) {
    return res.send({ error });
  }
}
