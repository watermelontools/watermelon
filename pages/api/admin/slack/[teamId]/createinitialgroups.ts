import { createGroup } from "../../../../../utils/slack/backend";
import logger from "../../../../../logger/logger";
import { createRoom } from "../../../../../utils/airtable/backend";

const createInitialGroups = ({ token }) => {
  const createPromiseArray = [];
  for (let index = 0; index < 8; index++) {
    createPromiseArray.push(
      createGroup({
        data: {
          name: `watermelon-${index + 1}`,
          is_private: true,
        },
        token,
      })
    );
  }
  return createPromiseArray;
};
export const createAndSave = async ({
  access_token,
  teamId,
}: {
  access_token: string;
  teamId: string;
}) => {
  let createPromiseArray = createInitialGroups({
    token: access_token,
  });
  let finishedProms = await Promise.all(createPromiseArray);
  for (let index = 0; index < finishedProms.length; index++) {
    const element = finishedProms[index];
    await createRoom({ roomId: element.channel.id, workspaceId: teamId, name: element.channel.name })
  }
  return finishedProms;
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
}
