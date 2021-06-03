import admin from "../../../../../utils/firebase/backend";
import logger from "../../../../../logger/logger";
const axios = require('axios').default;

let db = admin.firestore();

async function getInstallationToken (teamId) {
  const teamRef = db.collection('teams').doc(teamId);
  const doc = await teamRef.get();
  if (!doc.exists) {
    console.log('No such document!');
  } else {
    return doc.data().add_to_slack_token.access_token;
}
}

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
async function createRooms(channelId) {
      // returned object
      let groups = [];
      // saves the answerer's ID locally. An array of arrays
      let pickedByIdsArray = [];
      // The question titles, used for accessing the doc on the DB.
      let questions = [];
  
      // returns the answers in an array for a given question
      const getAnswers = async (teamId, questionName) => {
        let answerTitles = [];
        const answersRef = db
          .collection("teams")
          .doc(teamId)
          .collection("weekly_questions")
          .doc(questionName);
        const collections = await answersRef.listCollections();
        collections.forEach(async collection => {
          answerTitles.push(collection.id);
        });
        return answerTitles;
      };
  
      let weeklyQuestionsRef = db
        .collection("teams")
        .doc(teamId)
        .collection("weekly_questions");
  
      let allQuestions = await weeklyQuestionsRef.get();
      let final = allQuestions.forEach(async doc => {
        questions.push(doc.id);
        let questionName = doc.id;
  
        let answerTitles = await getAnswers(teamId, questionName);
        for (let i = 0; i < answerTitles.length; i++) {
          let currentAnswerers = [];
          let answerTitle = answerTitles[i];
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

          console.log('respondents.data(): ', respondents.data())
          currentAnswerers = respondents.data().picked_by;

          const watermelonRoomData = {
            channel: channelId,
            users: currentAnswerers,
          };

          console.log('watermelonRoomData: ', watermelonRoomData)

          axios
          .post("https://slack.com/api/conversations.invite", watermelonRoomData, {
            headers: {
              Authorization: `Bearer ${getInstallationToken()}`
            }
          })
          .then(response2 => {
            console.log('conversation.invite promise resolved')
            const icebreakerData = {
              channel: channelId,
              text: icebreaker
                .replace(/\$\{answer}/g, answerTitle)
                .replace(/\$\{person}/g, `<@${currentAnswerers[0]}>`)
            };

            axios
              .post("https://slack.com/api/chat.postMessage", icebreakerData, {
                headers: {
                  Authorization: `Bearer ${getInstallationToken()}`
                }
              })
              .then(response3 => {
                console.log("created groups and sent icebreakers");
              })
              .catch(err => {
                console.log(err);
              });
          })
          .catch(err => {
            console.log(err);
          });

          pickedByIdsArray.push(currentAnswerers);
        }
        return groups;
      });
}

// Get list of room ids

  console.log('teamId: ', teamId)
  const teamRef = db.collection('teams').doc(teamId);
  const doc = await teamRef.get();
  if (!doc.exists) {
    console.log('No such document!');
  } else {
    console.log('Document data:', doc.data().room_ids);

    // For each room id, execute what we have on Glitch
    let room_ids = doc.data().room_ids

    console.log('room_ids: ', room_ids)
    room_ids.forEach(room => {
      createRooms(room)
    })
  }
}

