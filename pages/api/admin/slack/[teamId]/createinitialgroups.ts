import { createGroup } from "../../../../../utils/slack/backend";
import logger from "../../../../../logger/logger";
import admin from "../../../../../utils/firebase/backend";
export const createInitialGroups = ({ token }) => {
  const createPromiseArray = [];
  for (let index = 0; index < 4; index++) {
    createPromiseArray.push(
      createGroup({
        data: {
          name: `wmtest-${index}`,
          is_private: false,
        },
        token,
      })
    );
  }
  return createPromiseArray;
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
  let db = admin.firestore();
  let fbRes = await db.collection("teams").doc(teamId).get();
  if (fbRes.exists) {
    let data = fbRes.data();
    if (data?.add_to_slack_token?.access_token) {
      let createPromiseArray = createInitialGroups({
        token: data.add_to_slack_token.access_token,
      });
      let finishedProms = Promise.all(createPromiseArray);
      finishedProms
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
    }
    else{
      logger.error({message: "no data", data})
    }
  }
}
