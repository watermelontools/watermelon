import logger from "../../../../../logger/logger";
import { findWorkspaceRecord } from "../../../../../utils/airtable/backend";
const axios = require("axios").default;

async function getInstallationToken(teamId) {
  let workspaceRecord = await findWorkspaceRecord({ workspaceId: teamId });
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

  let accessToken = await getInstallationToken(teamId);
  console.log("token: ", accessToken);
  let room_ids = [];

  // Get list of room ids

  room_ids.forEach((room) => {
    let roomData = { channel: room };

    axios
      .get(
        "https://slack.com/api/conversations.members?channel=" +
          room +
          "&pretty=1",
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      )
      .then((res1) => {
        console.log("res1.data: ", res1.data);
        let channelMembers = res1.data.members;
        // console.log('channel members: ', channelMembers)

        // if (channelMembers !== []) {
        channelMembers.forEach((userId) => {
          let userAndChannelData = {
            channel: room,
            user: userId,
          };

          console.log("userand channel data: ", userAndChannelData);

          // axios
          // .post("https://slack.com/api/conversations.kick", userAndChannelData, {
          //   headers: {
          //     Authorization: `Bearer ${accessToken}`
          //   }
          // })
          // .then(res2 => {
          //   console.log('res2: ', res2.data)
          //   // res.status(200).json(JSON.stringify({ ok: "ok", ...res2.data }));
          // })
          // .catch(err => {
          //   console.log(err);
          // });
        });
        // }
      })
      .catch((err) => {
        console.log(err);
      });
  });
}
