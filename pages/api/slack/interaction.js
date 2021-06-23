export default async function handler(req, res) {
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
  savePickedBy({
    teamId: slackResponse.message.team,
    questionName:
      slackResponse.message.blocks[
        slackResponse.message.blocks.findIndex(
          (block) => block.block_id == slackResponse.actions[0].block_id
        ) - 1
      ].elements[0].text,
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
        ...slackResponse.message.blocks,
        {
          type: "section",
          text: {
            type: "plain_text",
            text: "🍉 question answered 1 time",
            emoji: true,
          },
        },
      ],
    }),
  })
    .then((response) => response.json())
    .then((data) => {
      res.status(200).json({ status: "ok" });
      console.log(data);
    })
    .catch((error) => console.error(error));
}
