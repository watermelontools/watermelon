import logger from "../../../../../logger/logger";
import { postMessage } from "../../../../../utils/slack/backend";
import {
  findWorkspaceRecord,
  getAllUnusedQuestions,
} from "../../../../../utils/airtable/backend";
export default async function handler(req, res) {
  const {
    query: { teamId },
  } = req;
  if (!teamId) {
    logger.error({
      message: "no teamid",
    });
    res.status(400).json({ status: "error", error: "no team id" });
  }
  let questions = await getAllUnusedQuestions({ workspaceId: teamId });
  let questionsToSend = [];
  while (questionsToSend.length < 2) {
    let item = questions[Math.floor(Math.random() * questions.length)];
    if (!questionsToSend.includes(item)) questionsToSend.push(item);
  }

  let blocks = [];
  for (let i = 0; i < questionsToSend.length; i++) {
    let record = questionsToSend[i];
    let questionElements = {
      type: "actions",
      elements: [],
    };
    let possibleAnswers = ["A", "B", "C", "D"];

    for (let index = 0; index < possibleAnswers.length; index++) {
      const element = possibleAnswers[index];
      questionElements.elements.push({
        action_id: `${record.id}-${element}`,
        type: "button",
        text: {
          text: record.fields[`Answer${element}`][0],
          type: "plain_text",
        },
        value: record.fields[`Answer${element}Record`][0],
      });
    }
    blocks.push(
      {
        type: "section",
        text: { text: "*" + record.fields["Question"] + "*", type: "mrkdwn" },
      },
      questionElements,
      {
        type: "divider",
      }
    );
  }
  let workspaceRecord = await findWorkspaceRecord({ workspaceId: teamId });

  let postMessageRes = await postMessage({
    data: {
      text: "Time to answer some questions 🍉",
      blocks: [
        {
          type: "header",
          text: {
            type: "plain_text",
            text: "Welcome to Watermelon!",
            emoji: true,
          },
        },
        {
          type: "section",
          text: {
            type: "mrkdwn",
            text: `:one:. Answer the question below :point_down:
:two:. Get added to a Watermelon room
:three:. Start chatting with like-minded co-workers 
:watermelon: <!here>`,
          },
        },
        ...blocks,
        {
          type: "image",
          image_url:
            "https://app.watermelon.tools/images/questionsHappyTulia.png",
          alt_text: "Tulia, the watermelon mascot in front of a computer",
        },
      ],
      channel: workspaceRecord.ChannelId,
    },
    token: workspaceRecord.AccessToken,
  });
  if (postMessageRes.status === "ok") {
    logger.info(postMessageRes);
    res.status(200).send(postMessageRes);
  } else {
    logger.error(postMessageRes);
    res.status(500).send(postMessageRes);
  }
}
