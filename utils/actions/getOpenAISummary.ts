import { StandardProcessedDataArray } from "../../types/watermelon";

const { Configuration, OpenAIApi } = require("openai");

const configuration = new Configuration({
  apiKey: process.env.OPEN_AI_KEY,
});
const openai = new OpenAIApi(configuration);
export default async function getOpenAISummary({
  commitList,
  title,
  body,
  values,
}) {
  let ghValue: StandardProcessedDataArray = values?.github?.data;
  let jiraValue: StandardProcessedDataArray = values?.jira?.data;
  let slackValue: StandardProcessedDataArray = values?.slack?.data;
  let confluenceValue: StandardProcessedDataArray = values?.confluence?.data;
  let linearValue: StandardProcessedDataArray = values?.linear?.data;
  let notionValue: StandardProcessedDataArray = values?.notion?.data;

  let prompt = "";
  const promptGenerator = (value, name) => {
    if (value?.length) {
      for (let i = 0; i < value.length; i++) {
        prompt += `${name} ${i + 1} title: ${value[i].title || ""} \n ${
          value[i].body
            ? `${name} ${i + 1} body: ${value[i].body || ""} \n`
            : ""
        }`;
      }
    }
  };
  promptGenerator(ghValue, "PR");
  promptGenerator(jiraValue, "Jira");
  promptGenerator(slackValue, "Slack");
  promptGenerator(confluenceValue, "Confluence");
  promptGenerator(linearValue, "Linear");
  promptGenerator(notionValue, "Notion");

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
