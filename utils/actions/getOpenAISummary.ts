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
  const extractData = (key: string) => values?.[key]?.data || [];

  const ghValue: StandardProcessedDataArray = extractData("ghValue");
  const jiraValue: StandardProcessedDataArray = extractData("jiraValue");
  const slackValue: StandardProcessedDataArray = extractData("slackValue");
  const confluenceValue: StandardProcessedDataArray =
    extractData("confluenceValue");
  const linearValue: StandardProcessedDataArray = extractData("linearValue");
  const notionValue: StandardProcessedDataArray = extractData("notionValue");

  let promptList = "";
  const promptGenerator = (value, name) => {
    if (value?.length) {
      for (let i = 0; i < value.length; i++) {
        promptList += `${name} ${i + 1} title: ${value[i].title || ""} \n`;
      }
    }
  };
  let summaryPrompt = "";
  const summaryGenerator = (value, name) => {
    if (value.length) {
      summaryPrompt += `${value.length} ${name}, `;
    }
  };
  const callList = [
    { value: ghValue, name: "GitHub PRs" },
    { value: jiraValue, name: "Jira Tickets" },
    { value: slackValue, name: "Slack Messages" },
    { value: confluenceValue, name: "Confluence Docs" },
    { value: linearValue, name: "Linear Tickets" },
    { value: notionValue, name: "Notion Pages" },
  ];
  for (let i = 0; i < callList.length; i++) {
    const { value, name } = callList[i];
    promptGenerator(value, name);
    summaryGenerator(value, name);
  }
  for (let i = 0; i < commitList.length; i++) {
    promptList += `Commit ${i + 1} message: ${commitList[i]} \n`;
  }
  promptList += `Current PR Title: ${title} \n ${
    body ? `Current PR Body: ${body} \n` : ""
  }`;

  const prompt = `Summarize what the ${summaryPrompt} ${
    commitList?.length ? `the ${commitList?.length} commits,` : ""
  } are about. What do they tell us about the business logic? Don't summarize each piece or block of data separately, combine them and process all data. Take into consideration the current PR title and body. Don't look at each part or service of the list as a separate thing, but as a whole. The list will be available to me so you don't need to repeat it. Try to keep the summary to 5 or 6 sentences.
  Here is the list:\n  ${promptList} \n`;

  const completion = await openai.createChatCompletion({
    model: "gpt-3.5-turbo",
    messages: [
      {
        role: "system",
        content:
          "You are a Technical PM, that understands the business and will help the user what is going in this recently opened Pull Request. The user will give you some context and you will summarize it in a succinct but not jargon filled way. You will avoid going over each individual data point, but will reason about the business logic.",
      },
      { role: "user", content: prompt },
    ],
  });
  return completion.data.choices[0].message.content;
}
