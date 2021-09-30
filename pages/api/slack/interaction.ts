import logger from "../../../logger/logger";
import {
  findWorkspaceRecord,
  saveAnswerPicked,
} from "../../../utils/airtable/backend";

export default async function handler(req, res) {
  let { payload } = req.body;
  let slackResponse = await JSON.parse(payload);
  console.log(payload)
  logger.info({ message: "NEW_INTERACTION", payload })

  const ephimeralMessageData = {
    attachments:
      "[{'text': 'This response is anonymous.', 'color': '#75b855'}]",
    channel: slackResponse.channel.id,
    text: `🍉 Ahoy from Watermelon! You selected *${slackResponse.actions[0].text.text}*`,
    user: slackResponse.user.id,
  };
  let workspaceRecord = await findWorkspaceRecord({
    workspaceId: slackResponse.user.team_id,
  });
  let qrecord = slackResponse.message.blocks.find(
    (el) => el.type === "section" && el.block_id.startsWith("rec")
  ).block_id;

  await saveAnswerPicked({
    questionRecord: qrecord,
    answerRecord: slackResponse.actions[0].value,
    workspaceId: slackResponse.team.id,
    userId: slackResponse.user.id,
    username: slackResponse.user.username,
    workspaceRecordId: workspaceRecord.id,
  });
  await fetch("https://slack.com/api/chat.postEphemeral", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${workspaceRecord.fields.AccessToken}`,

      "Content-Type": "application/json",
    },
    body: JSON.stringify(ephimeralMessageData),
  })
    .then(function (resp) {
      logger.info({ message: "sent-ephemeral", data: resp });
    })
    .catch(function (error) {
      logger.error("error-sending-ephemeral ", error);
    });

  await fetch(slackResponse.response_url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      text: "Watermelon question answered.",
      blocks: [...slackResponse.message.blocks],
    }),
  })
    .then((response) => response.json())
    .then((data) => {
      logger.info({ message: "question-answered", data });
    })
    .catch((error) => console.error(error));
  res.status(200).json({ status: "ok" });
}
