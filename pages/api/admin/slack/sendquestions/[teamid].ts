import admin from "../../../../../utils/firebase/backend";
import logger from "../../../../../logger/logger";

import Airtable from "airtable";
Airtable.configure({
  endpointUrl: "https://api.airtable.com",
  apiKey: process.env.AIRTABLE_API_KEY,
});
export default function handler(req, res) {
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
  const postMessage = async ({ data, token }) => {
    let postData = { ...data };
    console.log("postData", postData);
    let postURL = `https://slack.com/api/chat.postMessage?channel=${
      data.channel
    }&text=${encodeURI(data.text)}`;
    console.log(postURL);
    fetch(postURL, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((response) => response.json())
      .then((resjson) => {
        console.log("postmessage", resjson);
        res.status(200).send({ status: "finished", resjson });
      })
      .catch((err) => {
        console.error("post Message", err);
      });
  };

  db.collection("teams")
    .doc(teamid)
    .get()
    .then(async (fbres) => {
      if (fbres.exists) {
        let data = fbres.data();
        if (data?.add_to_slack_token?.access_token)
          await postMessage({
            data: {
              text: "Hellow from watermelon api",
              channel: data.add_to_slack_token.incoming_webhook.channel_id,
            },
            token: data.add_to_slack_token.access_token,
          });
        else {
          logger.error({ message: "no access token", data });
          res.status(500).send({ status: "error", error: "no access token" });
        }
      }
    })
    .catch(function (error) {
      logger.error({ message: "Error fetching: ", error });
      res.status(500).json(JSON.stringify({ ok: false }));
    });
}
