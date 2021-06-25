import logger from "../../../logger/logger";
import admin from "../../../utils/firebase/backend";

export default async function handler(req, res) {
  let db = admin.firestore();

  let { payload } = req.body;
  let slackResponse = await JSON.parse(payload);
  async function savePickedBy({ teamId, questionName, answerTitle, userId }) {
    let testWeeklyQuestionsRef = db
      .collection("teams")
      .doc(teamId)
      .collection("weekly_questions")
      .doc(questionName)
      .collection(answerTitle)
      .doc("picked_by");
    const res = await testWeeklyQuestionsRef.update({
      picked_by: admin.firestore.FieldValue.arrayUnion(userId),
    });
  }
  let questionName =
    slackResponse.message.blocks[
      slackResponse.message.blocks.findIndex(
        (block) => block.block_id == slackResponse.actions[0].block_id
      ) - 1
    ].elements[0].text;
  let respondentsRef = db
    .collection("teams")
    .doc(slackResponse.message.team)
    .collection("weekly_questions")
    .doc(questionName);
  const ephimeralMessageData = {
    attachments:
      "[{'text': 'This response is anonymous.', 'color': '#75b855'}]",
    channel: slackResponse.channel.id,
    text: `🍉 Ahoy from Watermelon! You selected *${slackResponse.actions[0].value}*`,
    user: slackResponse.user.id,
  };
  await db
    .collection("teams")
    .doc(slackResponse.team.id)
    .get()
    .then(async (res) => {
      if (res.exists) {
        let responseData = res.data();
        if (responseData.add_to_slack_token) {
          await fetch("https://slack.com/api/chat.postEphemeral", {
            method: "POST",
            headers: {
              Authorization: `Bearer ${responseData.add_to_slack_token.access_token}`,
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
        }
      }
    });
  const respondents = await respondentsRef.get();
  const respondentsArray = respondents.data().respondents;
  /*   if (respondentsArray.includes(userId)) {
    // console.log('user id included')
    const ephimeralMessageData = {
      attachments:
        '[{"text": "Try answering the other question.", "color": "#75b855"}]',
      channel: body.channel.id,
      text: `You have already responded this question`,
      user: body.user.id,
    };
    Slack.postEphemeral(ephimeralMessageData, context.botToken);
  } */
  await respondentsRef.update({
    respondents: admin.firestore.FieldValue.arrayUnion(slackResponse.user.id),
  });

  savePickedBy({
    teamId: slackResponse.message.team,
    questionName,
    answerTitle: slackResponse.actions[0].value,
    userId: slackResponse.user.id,
  });
  await fetch(slackResponse.response_url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      text: "Watermelon question answered.",
      blocks: [
        ...slackResponse.message.blocks.slice(0, -1),
        {
          type: "section",
          text: {
            type: "plain_text",
            text: `🍉 question answered ${respondentsArray.length} time`,
            emoji: true,
          },
        },
      ],
    }),
  })
    .then((response) => response.json())
    .then((data) => {
      res.status(200).json({ status: "ok" });
    })
    .catch((error) => console.error(error));
}
