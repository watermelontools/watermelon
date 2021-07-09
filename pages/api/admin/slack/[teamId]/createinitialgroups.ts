import { createGroup } from "../../../../../utils/slack/backend";
import logger from "../../../../../logger/logger";
import admin from "../../../../../utils/firebase/backend";

let db = admin.firestore();
async function getTeam(teamId: string) {
  let fbRes = await db.collection("teams").doc(teamId).get();
  return fbRes;
}

const createInitialGroups = ({ token }) => {
  const createPromiseArray = [];
  for (let index = 0; index < 8; index++) {
    createPromiseArray.push(
      createGroup({
        data: {
          name: `wm-${index}`,
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
  console.log("func called");
  let createPromiseArray = createInitialGroups({
    token: access_token,
  });
  let finishedProms = await Promise.all(createPromiseArray);
  await db
    .collection("teams")
    .doc(teamId)
    .set(
      {
        room_ids: finishedProms,
      },
      { merge: true }
    )
    .then(async function () {
      logger.info({ message: "rooms-created", data: finishedProms });
    })
    .catch(function (error) {
      console.error("Error adding document: ", error);
    });
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
  let fbRes = await getTeam(teamId);
  if (fbRes.exists) {
    let data = fbRes.data();
    if (data?.add_to_slack_token?.access_token) {
      createAndSave(data.token.access_token)
        .then((settled) => {
          for (let index = 0; index < settled.length; index++) {
            const element = settled[index];

            if (element.status === "ok") {
              logger.info(element);
            }
            res.status(200).send({ status: "ok", message: "groups created" });
          }
        })
        .catch((error) => {
          logger.error(error);
          res.status(500).send(error);
        });
    } else {
      logger.error({ message: "no data", data });
    }
  }
}
