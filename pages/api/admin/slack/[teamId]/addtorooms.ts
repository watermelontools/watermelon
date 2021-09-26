import logger from "../../../../../logger/logger";
import { findWorkspaceRecord, getLastWeekAnswerers, getRooms } from "../../../../../utils/airtable/backend";
import { inviteToRoom, kickFromRoom, listRoomMembers, sendDM, sendIcebreaker } from "../../../../../utils/slack/backend";
const axios = require("axios").default;

async function getInstallationToken({ workspaceId }) {
  let workspaceRecord = await findWorkspaceRecord({ workspaceId });
  return workspaceRecord.fields.AccessToken
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
  let responses = await getLastWeekAnswerers({ workspaceId: teamId })
  if (responses.length > 0) {
    let accessToken = await getInstallationToken({ workspaceId: teamId });
    let roomIds = await getRooms({ workspaceId: teamId })
    let questions = {}
    responses.map(response => {
      if (questions[response.fields.Question]) {
        let foundAnswer = questions[response.fields.Question].answers.findIndex(q =>
          q.answerRecord.includes(response.fields.Answer[0])
        )
        if (foundAnswer > -1) {
          questions[response.fields.Question].answers[foundAnswer].users.push(
            ...response.fields.SlackId)
          questions[response.fields.Question].answers[foundAnswer].icebreaker = response.fields.IcebreakerToSend
        }
        else {
          questions[response.fields.Question].answers.push({
            answerRecord: response.fields.Answer,
            icebreaker: response.fields.IcebreakerToSend,
            answerText: response.fields.AnswerText,
            users: response.fields.SlackId
          }
          )
        }
      }
      else {
        questions[response.fields.Question] = {
          questionText: response.fields.QuestionText,
          answers: [{
            answerRecord: response.fields.Answer,
            answerText: response.fields.AnswerText,
            users: response.fields.SlackId
          }]
        }
      }
    })
    for (let index = 0; index < roomIds.length; index++) {
      const element = roomIds[index];
      let roomMembers = await listRoomMembers({ accessToken, channel: element.fields.RoomId })
      for (let j = 0; j < roomMembers.members.length; j++) {
        const member = roomMembers.members[j];
        await kickFromRoom({ accessToken, channel: element.fields.RoomId, user: member })
        await sendDM({ accessToken, channel: member, text: "You have been removed from last's week :watermelon: room, we're starting a new round." })
      }
    }
    let questionNames = Object.keys(questions)
    for (let index = 0; index < questionNames.length; index++) {
      let element = questions[questionNames[index]]
      for (let j = 0; j < element.answers.length; j++) {
        const answer = element.answers[j];
        let room = roomIds.shift()
        let icebreakerData = {
          text: `
          Welcome to this :watermelon: room, you answered the question "${element.questionText[0]}".
          ${answer.icebreaker[0].replace("${answer}", `*${answer.answerText[0]}*`)}
        `}
        let watermelonRoomData = { channel: room.fields.RoomId, users: answer.users }
        await inviteToRoom({ accessToken, watermelonRoomData })
        await sendIcebreaker({ accessToken, icebreakerData })
      }
    }
    res.status(200).send({ ok: "ok" });
  }
  else res.status(500).send({ error: "No responses last week" })
}
