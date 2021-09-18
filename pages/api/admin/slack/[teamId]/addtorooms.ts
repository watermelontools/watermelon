import logger from "../../../../../logger/logger";
import { findWorkspaceRecord, getLastWeekAnswerers, getRooms } from "../../../../../utils/airtable/backend";
const axios = require("axios").default;

async function getInstallationToken(teamId) {
  let workspaceRecord = await findWorkspaceRecord({ workspaceId: teamId });
  return workspaceRecord.fields.AccessToken
}
const sendIcebreaker = ({ icebreakerData, accessToken }) => {
  axios
    .post("https://slack.com/api/chat.postMessage", icebreakerData, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    })
    .then(function (response) {
      console.log(response);
    })
    .catch(function (error) {
      console.log(error);
    });
};
const inviteToRoom = ({ accessToken, watermelonRoomData }) => {
  axios
    .post("https://slack.com/api/conversations.invite", watermelonRoomData, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    })
    .then(function (response) {
      console.log(response);
    })
    .catch(function (error) {
      console.log(error);
    });
};
const listRoomMembers =async ({ accessToken, channel }) => {
  return (await axios
    .get(`https://slack.com/api/conversations.members?channel=${channel}`,  {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    })).data
};
const kickFromRoom =async ({ accessToken, channel, user }) => {
  return (await axios
    .post(`https://slack.com/api/conversations.members?channel=${channel}&user=${user}`,  {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }))
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
/*   let accessToken = await getInstallationToken(teamId);
  let roomIds = await getRooms(teamId) */
  let responses = await getLastWeekAnswerers({workspaceId:teamId})
/*   for (let index = 0; index < roomIds.length; index++) {
    const element = roomIds[index];
    let roomMembers = await listRoomMembers({accessToken, channel:"C029NA3V4E4"})
    for (let j = 0; j < roomMembers.members.length; j++) {
      const member = roomMembers.members[j];
      await kickFromRoom({accessToken, channel: element.fields.RoomId, user: member})
    }
  } */
let questions = {}
console.log(responses.length)
  responses.map(response=>{
    if(questions[response.fields.Question]){
    let foundAnswer=  questions[response.fields.Question].answers.findIndex(q=> 
       q.answerRecord.includes(response.fields.Answer[0])
    )
    if(foundAnswer>-1){
    questions[response.fields.Question].answers[foundAnswer].users.push(
     ...response.fields.SlackId)
    }
    else{
      questions[response.fields.Question].answers.push  ({
          answerRecord: response.fields.Answer,
          answerText: response.fields.AnswerText,
          users:response.fields.SlackId
      }
      )}
    }
    else{
    questions[response.fields.Question] = {
      questionText: response.fields.QuestionText,
      answers: [{
        answerRecord: response.fields.Answer,
        answerText: response.fields.AnswerText,
        users:response.fields.SlackId
      }]      
    }}
  })
  res.send({questions});
}
