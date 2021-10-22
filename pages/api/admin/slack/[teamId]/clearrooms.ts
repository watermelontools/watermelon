import logger from "../../../../../logger/logger";
import {
  findWorkspaceRecord,
  getLastWeekAnswerers,
  getRooms,
} from "../../../../../utils/airtable/backend";
import {
  inviteToRoom,
  kickFromRoom,
  listRoomMembers,
  sendDM,
  sendIcebreaker,
} from "../../../../../utils/slack/backend";
const axios = require("axios").default;

async function getInstallationToken({ workspaceId }) {
  let workspaceRecord = await findWorkspaceRecord({ workspaceId });
  return workspaceRecord.fields.AccessToken;
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
  let responses = await getLastWeekAnswerers({ workspaceId: teamId });
  if (responses.length > 0) {
    let accessToken = await getInstallationToken({ workspaceId: teamId });
    let roomIds = await getRooms({ workspaceId: teamId });

    for (let index = 0; index < roomIds.length; index++) {
      const element = roomIds[index];
      let roomMembers = element.fields.TextMembers.split(",")
      for (let j = 0; j < roomMembers.length; j++) {
        const member = roomMembers[j];
        await kickFromRoom({
          accessToken,
          channel: element.fields.RoomId,
          user: member,
        });
        await sendDM({
          accessToken,
          channel: member,
          text: "You have been removed from last's week :watermelon: room, we're starting a new round.",
        });
      }
    }
    res.status(200).send({ ok: "ok" });
  }
}