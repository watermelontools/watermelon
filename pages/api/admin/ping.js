import admin from "../../../utils/firebase/backend";

import Airtable from "airtable";
Airtable.configure({
  endpointUrl: "https://api.airtable.com",
  apiKey: process.env.AIRTABLE_API_KEY,
});
const airtableBase = Airtable.base("appyNw8U8LEBl4iPs");
const getQuestions = ({ language }) => {
  airtableBase(language)
    .select({})
    .eachPage(
      function page(records, fetchNextPage) {
        // This function (`page`) will get called for each page of records.
        records.forEach(function (record) {
          allQuestions.push(record.fields);
        });
        fetchNextPage();
      },

      function done(err) {
        if (err) {
          console.error("errDone", err);
          return;
        }
        console.log("AllQs", allQuestions.length);
      }
    );
};
getQuestions({ language: "en" });
getQuestions({ language: "es" });
let allQuestions = [];
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
      console.err("post Message", err);
    });
};
export default function handler(req, res) {
  db.collection("teams")
    .get()
    .then(async (querySnapshot) => {
      querySnapshot.forEach(async (doc) => {
        // doc.data() is never undefined for query doc snapshots
        let data = doc.data();
        console.log(doc.id);
        if (data?.add_to_slack_token?.access_token)
          await postMessage({
            data: {
              text: "Holi",
              channel: data.add_to_slack_token.incoming_webhook.channel_id,
            },
            token: data.add_to_slack_token.access_token,
          });
        else console.log("no access token", data);
      });
    })
    .catch(function (error) {
      console.error("Error fetching: ", error);
      res.status(500).json(JSON.stringify({ ok: false }));
    });
}
