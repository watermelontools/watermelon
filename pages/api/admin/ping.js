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
  fetch("https://slack.com/api/chat.postMessage", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: postData,
  })
    .then((response3) => {
      console.log("post Message", response3.data);
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
              channel: data.add_to_slack_token.incoming_webhook.channel_id,
              blocks: [
                {
                  type: "section",
                  text: {
                    type: "mrkdwn",
                    text: "New Paid Time Off request from <example.com|Fred Enriquez>\n\n<https://example.com|View request>",
                  },
                },
              ],
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
