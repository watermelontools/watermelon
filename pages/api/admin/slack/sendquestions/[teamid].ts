import admin from "../../../../../utils/firebase/backend";
import logger from "../../../../../logger/logger";
import { postMessage } from "../../../../../utils/slack/backend";
import Airtable from "airtable";
Airtable.configure({
  endpointUrl: "https://api.airtable.com",
  apiKey: process.env.AIRTABLE_API_KEY,
});
export default async function handler(req, res) {
  const {
    query: { teamid },
  } = req;
  if (!teamid) {
    logger.error({
      message: "no teamid",
    });
    res.status(400).json({ status: "error", error: "no team id" });
  }
  let db = admin.firestore();
  let fbRes = await db.collection("teams").doc(teamid).get();
  if (fbRes.exists) {
    let data = fbRes.data();
    if (data?.add_to_slack_token?.access_token) {
      let postMessageRes = await postMessage({
        data: {
          text: "Hellow from watermelon api aaaa",
          channel: data.add_to_slack_token.incoming_webhook.channel_id,
        },
        token: data.add_to_slack_token.access_token,
      });
      if (postMessageRes.status === "ok") {
        logger.info(postMessageRes);
        res.status(200).send(postMessageRes);
      } else {
        logger.error(postMessageRes);
        res.status(500).send(postMessageRes);
      }
    } else {
      logger.error({ message: "no access token", data });
      res.status(500).send({ status: "error", error: "no access token" });
    }
  } else {
    logger.error({ message: "Error fetching: " });
    res
      .status(500)
      .json(JSON.stringify({ ok: false, message: "error fetching" }));
  }
}
