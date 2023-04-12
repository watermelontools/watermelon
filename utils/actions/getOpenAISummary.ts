const { Configuration, OpenAIApi } = require("openai");

const configuration = new Configuration({
  apiKey: process.env.OPEN_AI_KEY,
});
const openai = new OpenAIApi(configuration);
export default async function getOpenAISummary({
  ghValue,
  commitList,
  jiraValue,
  slackValue,
  title,
  body,
}) {
  const businessLogicSummary = await openai
    .createCompletion({
      model: "text-davinci-003",
      prompt: `PR 1 title: ${ghValue[0].title || ""} \n PR 1 body: ${
        ghValue[0].body || ""
      } \n PR 2 title: ${ghValue[1].title || ""} \n PR 2 body: ${
        ghValue[1].body || ""
      } \n PR 3 title: ${ghValue[2].title || ""} \n PR 3 body: ${
        ghValue[2].body || ""
      } \n ${
        commitList || ""
      } \n Summarize what the 3 PRs and the commit list are about. What are these 3 PRs and the commit list tell us about the business logic? Don't summarize each PR and commit separately, combine them. Don't say "these PRs", instead say "related PRs".`,
      max_tokens: 512,
      temperature: 0.7,
    })
    .then((res) => res.data.choices[0].text.trim())
    .catch((err) => console.error("error: ", err.message));
  return businessLogicSummary;
}
