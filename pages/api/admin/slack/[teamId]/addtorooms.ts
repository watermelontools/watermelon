import logger from "../../../../../logger/logger";
import { findWorkspaceRecord } from "../../../../../utils/airtable/backend";
const axios = require("axios").default;

async function getInstallationToken(teamId) {
  let workspaceRecord = await findWorkspaceRecord({ workspaceId: teamId });
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
const getAnswers = async (teamId, questionName) => {
  let answerTitles = [];

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

  let alreadyPopulated = [];
  let responses = [];
  // The question titles, used for accessing the doc on the DB.

  // returns the answers in an array for a given question

  res.send(responses);
}
