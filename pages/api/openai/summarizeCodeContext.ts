const { Configuration, OpenAIApi } = require("openai");
const configuration = new Configuration({
  apiKey: process.env.OPEN_AI_KEY,
});
const openai = new OpenAIApi(configuration);

export default async function handler(req, res) {
  let {
    pr_title,
    pr_body,
    block_of_code,
    ticket_title,
    ticket_body,
    thread_body,
    user_email
  } = req.body;

  // The product reason why we only make the code and git parameters mandatory is because there might not
  // always be a ticket or Slack thread associated with the PR.
  if (!pr_title) {
    return res.send({ error: "no PR Title" });
  }

  if (!pr_body) {
    return res.send({ error: "no PR Body" });
  }

  if (!block_of_code) {
    return res.send({ error: "no Block of code" });
  }

  if (!user_email) {
    return res.send({ error: "No user email" })
  }

  const prTitlePrompt = `Most relevant Pull Request title: ${pr_title}`;
  const prBodyPrompt = `Most relevant Pull Request body: ${pr_body}`;
  const codePrompt = `Block of code: ${block_of_code}`;
  const additionalInstructions =
    "Explain the context of the highlighted piece of code. Don't focus on explaining the syntax. Explain the complexities of the code taking into account its context from the pull request. Enclose the keywords between two underscores (**key_word**) to make it bold on markdown. Don't consider 'Pull Request', 'Slack thread' or 'Jira Ticket' as keywords. Highlight the 3 most imporant words.";

  let ticketTitlePrompt = "";
  let ticketBodyPrompt = "";
  let threadBodyPrompt = "";

  if (ticket_title) {
    ticketTitlePrompt = `Most relevant ticket title: ${ticket_title}`;
  }
  if (ticket_body) {
    ticketBodyPrompt = `Most relevant ticket body: ${ticket_body}`;
  }
  if (thread_body) {
    threadBodyPrompt = `Most relevant message thread body: ${thread_body}`;
  }

  try {
    const codeContextSummary = await openai
      .createCompletion({
        model: "text-davinci-003",
        prompt: `${prTitlePrompt} \n ${prBodyPrompt} \n ${codePrompt} \n ${ticketTitlePrompt} \n ${ticketBodyPrompt} \n ${threadBodyPrompt} \n ${additionalInstructions}`,
        max_tokens: 128,
        temperature: 0.7,
      })
      .then((res) => res.data.choices[0].text);

    return res.send(codeContextSummary);
  } catch (error) {
    return res.send({ error });
  }
}
