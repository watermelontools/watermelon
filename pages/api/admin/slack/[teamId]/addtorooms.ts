import admin from "../../../../../utils/firebase/backend";
import logger from "../../../../../logger/logger";
const axios = require("axios").default;

let db = admin.firestore();

async function getInstallationToken(teamId) {
  const teamRef = db.collection("teams").doc(teamId);
  const doc = await teamRef.get();
  if (!doc.exists) {
    console.log("No such document!");
  } else {
    return doc.data().add_to_slack_token.access_token;
  }
}
const sendIcebreaker = ({ icebreakerData, accessToken }) => {
  return fetch("https://slack.com/api/chat.postMessage", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
    body: JSON.stringify(icebreakerData),
  });
};
const inviteToRoom = ({ accessToken, watermelonRoomData }) => {
  return fetch("https://slack.com/api/conversations.invite", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
    body: JSON.stringify(watermelonRoomData),
  });
};
const getAnswers = async (teamId, questionName) => {
  let answerTitles = [];
  const answersRef = db
    .collection("teams")
    .doc(teamId)
    .collection("weekly_questions")
    .doc(questionName);
  const collections = await answersRef.listCollections();
  collections.forEach(async (collection) => {
    answerTitles.push(collection.id);
  });
  return answerTitles;
};

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
  let accessToken = await getInstallationToken(teamId);
  let room_ids = [];

  // Get list of room ids
  const teamRef = db.collection("teams").doc(teamId);
  const doc = await teamRef.get();
  if (!doc.exists) {
    console.log("No such document!");
  } else {
    // For each room id, execute what we have on Glitch
    room_ids = doc.data().room_ids;
  }

  let alreadyPopulated = [];

  let responses = [];
  async function populateRooms() {
    // The question titles, used for accessing the doc on the DB.

    // returns the answers in an array for a given question

    let weeklyQuestionsRef = db
      .collection("teams")
      .doc(teamId)
      .collection("weekly_questions");

    let allQuestions = await weeklyQuestionsRef.get();
    allQuestions.forEach(async (doc) => {
      let questionName = doc.id;
      let answerTitles = await getAnswers(teamId, questionName);

      for (let i = 0; i < answerTitles.length; i++) {
        let answerTitle = answerTitles[i];
        console.log("answer title: ", answerTitles[i]);
        // For each answer, assign a watermelon room
        let currentAnswerers = [];
        let weeklyQsPickedByRef = db
          .collection("teams")
          .doc(teamId)
          .collection("weekly_questions")
          .doc(questionName)
          .collection(answerTitle)
          .doc("picked_by");

        let respondents = await weeklyQsPickedByRef.get();
        let icebreakerRef = db
          .collection("teams")
          .doc(teamId)
          .collection("weekly_questions")
          .doc(questionName);

        let icebreaker = (await icebreakerRef.get()).data().icebreaker;

        currentAnswerers = respondents.data().picked_by;

        let usersParsed = currentAnswerers.toString();

        let channelId = "";

        for (let j = 0; j < room_ids.length; j++) {
          if (!alreadyPopulated.includes(room_ids[j])) {
            channelId = room_ids[j];
            alreadyPopulated.push(channelId);
            break;
          }
        }

        if (usersParsed != "") {
          const watermelonRoomData = {
            channel: channelId,
            users: usersParsed,
          };
          await inviteToRoom({ watermelonRoomData, accessToken });
          const icebreakerData = {
            channel: channelId,
            text: icebreaker
              .replace(/\$\{answer}/g, answerTitle)
              .replace(/\$\{person}/g, `<@${currentAnswerers[0]}>`),
          };
          await sendIcebreaker({ icebreakerData, accessToken });
          responses.push({ channelId, icebreaker, usersParsed });
        }
      }
    });
  }

  await populateRooms();
  res.send(responses);
}
