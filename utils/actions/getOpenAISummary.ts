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
  let prompt = "";
  if (ghValue.error && jiraValue.error && slackValue.error) {
    return { error: "no data" };
  }
  for (let i = 0; i < ghValue.length; i++) {
    prompt += `PR ${i + 1} title: ${ghValue[i].title || ""} \n ${
      ghValue[i].body ? `PR ${i + 1} body: ${ghValue[i].body || ""} \n` : ""
    }`;
  }
  if (jiraValue?.length) {
    for (let i = 0; i < jiraValue.length; i++) {
      prompt += `Jira ${i + 1} title: ${
        jiraValue[i].fields.summary || ""
      } \n  ${
        jiraValue[i].renderedFields.description
          ? `Jira ${i + 1} body: ${
              jiraValue[i].renderedFields.description || ""
            } \n`
          : ""
      }`;
    }
  }
  if (slackValue?.length) {
    for (let i = 0; i < slackValue.length; i++) {
      prompt += `Slack ${i + 1} text: ${slackValue[i].text || ""} \n`;
    }
  }
  for (let i = 0; i < commitList.length; i++) {
    prompt += `Commit ${i + 1} message: ${commitList[i]} \n`;
  }
  prompt += `Current PR Title: ${title} \n ${
    body ? `Current PR Body: ${body} \n` : ""
  }`;
  prompt += `Summarize what the ${ghValue?.length} PRs, ${
    jiraValue?.length ? `the ${jiraValue?.length} Jira tickets, ` : ""
  } ${slackValue?.length ? `the ${slackValue?.length} Slack messages, ` : ""} ${
    commitList?.length ? `the ${commitList?.length} commits, ` : ""
  } are about. What do they tell us about the business logic? Don't summarize each PR and commit separately, combine them. Don't say "these PRs", instead say "related PRs". Take into consideration the current PR title and body. \n\n`;
  const businessLogicSummary = await openai
    .createCompletion({
      model: "text-davinci-003",
      prompt,
      max_tokens: 512,
      temperature: 0.7,
    })
    .then((res) => {
      return res.data.choices[0].text.trim();
    })
    .catch((err) => console.error("error: ", err.message));

  return businessLogicSummary;
}
