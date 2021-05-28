import Airtable from "airtable";
Airtable.configure({
  endpointUrl: "https://api.airtable.com",
  apiKey: process.env.AIRTABLE_API_KEY,
});

const airtableBase = Airtable.base("appyNw8U8LEBl4iPs");

// airtableBase(settings.language)
//   .select({
//     Selecting the first 3 records in Grid view:

//     filterByFormula: `({Category} = '${settings.category}')`,
//   })
//   .eachPage(
//     function page(records, fetchNextPage) {
//       This function (`page`) will get called for each page of records.
//       records.forEach(function (record) {
//         allQuestions.push(record);
//       });
//       fetchNextPage();
//     },

//     function done(err) {
//       if (err) {
//         console.error("errDone", err);
//         return;
//       }
//       let questions = [];
//       while (questions.length < 2) {
//         let item =
//           allQuestions[Math.floor(Math.random() * allQuestions.length)];
//         if (!questions.includes(item)) questions.push(item);
//       }
//       for (let i = 0; i < questions.length; i++) {
//         let record = questions[i];
//         let blocks = [];
//         let questionElements = {
//           type: "actions",
//           elements: [
//             {
//               action_id: `q${record.get("Number")}Aa`,
//               type: "button",
//               text: {
//                 text: record.get("AnswerA"),
//                 type: "plain_text",
//               },
//               value: record.get("AnswerA"),
//             },
//             {
//               action_id: `q${record.get("Number")}Ab`,
//               type: "button",
//               text: {
//                 text: record.get("AnswerB"),
//                 type: "plain_text",
//               },
//               value: record.get("AnswerB"),
//             },
//           ],
//         };
//         if (record.get("AnswerC"))
//           questionElements.elements.push({
//             action_id: `q${record.get("Number")}Ac`,
//             type: "button",
//             text: {
//               text: record.get("AnswerC"),
//               type: "plain_text",
//             },
//             value: record.get("AnswerC"),
//           });
//         if (record.get("AnswerD"))
//           questionElements.elements.push({
//             action_id: `q${record.get("Number")}Ad`,
//             type: "button",
//             text: {
//               text: record.get("AnswerD"),
//               type: "plain_text",
//             },
//             value: record.get("AnswerD"),
//           });
//         blocks.push(
//           {
//             type: "context",
//             elements: [{ text: record.get("Question"), type: "plain_text" }],
//           },
//           questionElements,
//           {
//             type: "divider",
//           }
//         );

//         say({ blocks });

//         db.collection("teams")
//           .doc(`${teamId}/weekly_questions/${record.get("Question")}`)
//           .set(
//             { icebreaker: record.get("Icebreaker"), respondents: [] },
//             { merge: true }
//           )
//           .then(function (docRef) {
//             console.log("Wrote question", {
//               question: record.get("Question"),
//               icebreaker: record.get("Icebreaker"),
//               answers: {
//                 a: record.get("AnswerA"),
//                 b: record.get("AnswerB"),
//                 c: record.get("AnswerC"),
//                 d: record.get("AnswerD"),
//               },
//             });
//           })
//           .catch(function (error) {
//             console.error("Error writing: ", error);
//           });
//         const setQuestion = (questionTitle) => {
//           db.collection("teams")
//             .doc(`${teamId}`)
//             .collection("weekly_questions")
//             .doc(record.get("Question"))
//             .collection(questionTitle)
//             .doc("picked_by")
//             .set({ picked_by: [] }, { merge: true })
//             .then(() => {})
//             .catch(function (error) {
//               console.error("Error writing: ", error);
//             });
//         };
//         setQuestion(record.get("AnswerA"));
//         setQuestion(record.get("AnswerB"));

//         if (record.get("AnswerC")) setQuestion(record.get("AnswerC"));

//         if (record.get("AnswerD")) setQuestion(record.get("AnswerD"));

//         app.action(`q${record.get("Number")}Aa`, async ({ body, ack, say }) => {
//           await ack();
//           let answerTitle = body.actions[0].value;
//           let userId = body.user.id;
//           let contextQuestionName = body.message.blocks.find(
//             (el) => el.type === "context"
//           ).elements[0].text;

//           let respondentsRef = db
//             .collection("teams")
//             .doc(teamId)
//             .collection("weekly_questions")
//             .doc(contextQuestionName);

//           const respondents = await respondentsRef.get();

//           const respondentsArray = respondents.data().respondents;

//           if (respondentsArray.includes(userId)) {
//             console.log('user id included')
//             const ephimeralMessageData = {
//               attachments:
//                 '[{"text": "Try answering the other question.", "color": "#75b855"}]',
//               channel: body.channel.id,
//               text: `You have already responded this question`,
//               user: body.user.id,
//             };
//             Slack.postEphemeral(ephimeralMessageData, context.botToken);
//           } else {
//             savePickedBy({
//               teamId: context.teamId,
//               questionName: contextQuestionName,
//               answerTitle,
//               userId: body.user.id,
//             });

//             let respondentsRef = db
//               .collection("teams")
//               .doc(teamId)
//               .collection("weekly_questions")
//               .doc(contextQuestionName);

//             const res = await respondentsRef.update({
//               respondents: admin.firestore.FieldValue.arrayUnion(userId),
//             });

//             const ephimeralMessageData = {
//               attachments:
//                 '[{"text": "This response is anonymous.", "color": "#75b855"}]',
//               channel: body.channel.id,
//               text: `🍉 Ahoy from Watermelon! You selected *${answerTitle}*`,
//               user: body.user.id,
//             };
//             Slack.postEphemeral(ephimeralMessageData, context.botToken);
//           }
//         });

//         app.action(`q${record.get("Number")}Ab`, async ({ body, ack, say }) => {
//           await ack();
//           let answerTitle = body.actions[0].value;
//           let userId = body.user.id;
//           let contextQuestionName = body.message.blocks.find(
//             (el) => el.type === "context"
//           ).elements[0].text;

//           let respondentsRef = db
//             .collection("teams")
//             .doc(teamId)
//             .collection("weekly_questions")
//             .doc(contextQuestionName);

//           const respondents = await respondentsRef.get();

//           const respondentsArray = respondents.data().respondents;
//           console.log(
//             contextQuestionName,
//             " respondentsArray: ",
//             respondentsArray
//           );

//           if (respondentsArray.includes(userId)) {
//             console.log('user id included')
//             const ephimeralMessageData = {
//               attachments:
//                 '[{"text": "Try answering the other question.", "color": "#75b855"}]',
//               channel: body.channel.id,
//               text: `You have already responded this question`,
//               user: body.user.id,
//             };
//             Slack.postEphemeral(ephimeralMessageData, context.botToken);
//           } else {
//             savePickedBy({
//               teamId: context.teamId,
//               questionName: contextQuestionName,
//               answerTitle,
//               userId: body.user.id,
//             });

//             let respondentsRef = db
//               .collection("teams")
//               .doc(teamId)
//               .collection("weekly_questions")
//               .doc(contextQuestionName);

//             const res = await respondentsRef.update({
//               respondents: admin.firestore.FieldValue.arrayUnion(userId),
//             });

//             const ephimeralMessageData = {
//               attachments:
//                 '[{"text": "This response is anonymous.", "color": "#75b855"}]',
//               channel: body.channel.id,
//               text: `🍉 Ahoy from Watermelon! You selected *${answerTitle}*`,
//               user: body.user.id,
//             };
//             Slack.postEphemeral(ephimeralMessageData, context.botToken);
//           }
//         });
//         if (record.get("AnswerC")) {
//           app.action(
//             `q${record.get("Number")}Ac`,
//             async ({ body, ack, say }) => {
//               await ack();
//               let answerTitle = body.actions[0].value;
//               let userId = body.user.id;
//               let contextQuestionName = body.message.blocks.find(
//                 (el) => el.type === "context"
//               ).elements[0].text;

//               let respondentsRef = db
//                 .collection("teams")
//                 .doc(teamId)
//                 .collection("weekly_questions")
//                 .doc(contextQuestionName);

//               const respondents = await respondentsRef.get();

//               const respondentsArray = respondents.data().respondents;
//               console.log(
//                 contextQuestionName,
//                 " respondentsArray: ",
//                 respondentsArray
//               );

//               if (respondentsArray.includes(userId)) {
//                 console.log('user id included')
//                 const ephimeralMessageData = {
//                   attachments:
//                     '[{"text": "Try answering the other question.", "color": "#75b855"}]',
//                   channel: body.channel.id,
//                   text: `You have already responded this question`,
//                   user: body.user.id,
//                 };
//                 Slack.postEphemeral(ephimeralMessageData, context.botToken);
//               } else {
//                 savePickedBy({
//                   teamId: context.teamId,
//                   questionName: contextQuestionName,
//                   answerTitle,
//                   userId: body.user.id,
//                 });

//                 let respondentsRef = db
//                   .collection("teams")
//                   .doc(teamId)
//                   .collection("weekly_questions")
//                   .doc(contextQuestionName);

//                 const res = await respondentsRef.update({
//                   respondents: admin.firestore.FieldValue.arrayUnion(userId),
//                 });

//                 const ephimeralMessageData = {
//                   attachments:
//                     '[{"text": "This response is anonymous.", "color": "#75b855"}]',
//                   channel: body.channel.id,
//                   text: `🍉 Ahoy from Watermelon! You selected *${answerTitle}*`,
//                   user: body.user.id,
//                 };
//                 Slack.postEphemeral(ephimeralMessageData, context.botToken);
//               }
//             }
//           );
//         }
//         if (record.get("AnswerD")) {
//           app.action(
//             `q${record.get("Number")}Ab`,
//             async ({ body, ack, say }) => {
//               await ack();
//               let answerTitle = body.actions[0].value;
//               let userId = body.user.id;
//               let contextQuestionName = body.message.blocks.find(
//                 (el) => el.type === "context"
//               ).elements[0].text;

//               let respondentsRef = db
//                 .collection("teams")
//                 .doc(teamId)
//                 .collection("weekly_questions")
//                 .doc(contextQuestionName);

//               const respondents = await respondentsRef.get();

//               const respondentsArray = respondents.data().respondents;
//               console.log(
//                 contextQuestionName,
//                 " respondentsArray: ",
//                 respondentsArray
//               );

//               if (respondentsArray.includes(userId)) {
//                 console.log('user id included')
//                 const ephimeralMessageData = {
//                   attachments:
//                     '[{"text": "Try answering the other question.", "color": "#75b855"}]',
//                   channel: body.channel.id,
//                   text: `You have already responded this question`,
//                   user: body.user.id,
//                 };
//                 Slack.postEphemeral(ephimeralMessageData, context.botToken);
//               } else {
//                 savePickedBy({
//                   teamId: context.teamId,
//                   questionName: contextQuestionName,
//                   answerTitle,
//                   userId: body.user.id,
//                 });

//                 let respondentsRef = db
//                   .collection("teams")
//                   .doc(teamId)
//                   .collection("weekly_questions")
//                   .doc(contextQuestionName);

//                 const res = await respondentsRef.update({
//                   respondents: admin.firestore.FieldValue.arrayUnion(userId),
//                 });

//                 const ephimeralMessageData = {
//                   attachments:
//                     '[{"text": "This response is anonymous.", "color": "#75b855"}]',
//                   channel: body.channel.id,
//                   text: `🍉 Ahoy from Watermelon! You selected *${answerTitle}*`,
//                   user: body.user.id,
//                 };
//                 Slack.postEphemeral(ephimeralMessageData, context.botToken);
//               }
//             }
//           );
//         }
//       }
//     }
//   );

const getAllQuestions = async () => {
  let allQuestions = [];
  await airtableBase("en")
    .select({
      // Selecting the first 3 records in Grid view:

      filterByFormula: `({Category} = '${"hobbies"}')`,
    })
    .eachPage(function page(records, fetchNextPage) {
      // This function (`page`) will get called for each page of records.
      records.forEach(function (record) {
        allQuestions.push(record);
      });
      fetchNextPage();
    });
  return allQuestions;
};

module.exports = {
  getAllQuestions,
};
