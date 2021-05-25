import admin from "../../../../../utils/firebase/backend";

import Airtable from "airtable";
Airtable.configure({
  endpointUrl: "https://api.airtable.com",
  apiKey: process.env.AIRTABLE_API_KEY,
});
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
      })
      .catch((err) => {
        console.error("post Message", err);
      });
  };
export default function handler(req, res) {
    const {
        query: { teamid },
      } = req
    
      db.collection("teams")
      .doc(teamid)
    .get()
    .then(async (fbres) => {
        if(fbres.exists){
        let data = fbres.data();
        if (data?.add_to_slack_token?.access_token)
          await postMessage({
            data: {
              text: "ping",
              channel: data.add_to_slack_token.incoming_webhook.channel_id,
            },
            token: data.add_to_slack_token.access_token,
          });
        else console.log("no access token", data);
    }
    res.status(200).send({ status: "finished" });
    })
    .catch(function (error) {
      console.error("Error fetching: ", error);
      res.status(500).json(JSON.stringify({ ok: false }));
    });
    
}