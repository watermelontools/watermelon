import admin from "../../../utils/firebase/backend";

import Airtable from "airtable";
Airtable.configure({
  endpointUrl: "https://api.airtable.com",
  apiKey: process.env.AIRTABLE_API_KEY,
});
const airtableBase = Airtable.base("appyNw8U8LEBl4iPs");
let allQuestions = [];
let db = admin.firestore();
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
        // console.log(allQuestions);
        res.status(200).send({ ok: "ok" });
      }
    );
};
const postMessage = async ({ data, token }) => {
  fetch("https://slack.com/api/chat.postMessage", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  })
    .then((response3) => {
      console.log("post Message", response3.data);
    })
    .catch((err) => {
      console.log(err);
    });
};
export default function handler(req, res) {
  getQuestions({ language: "en" });
  getQuestions({ language: "es" });
  db.collection("teams")
    .get()
    .then((querySnapshot) => {
      querySnapshot.forEach((doc) => {
        // doc.data() is never undefined for query doc snapshots
        let data = doc.data();
        console.log(doc.id);
        if (data?.add_to_slack_token?.acces_token)
          postMessage({
            data: {
              text: allQuestions[0]?.Question || "Holi",
              channel: incoming_webhook.channel_id,
            },
            token: data.add_to_slack_token.acces_token,
          });
      });
    })
    .catch(function (error) {
      console.error("Error fetching: ", error);
      res.status(500).json(JSON.stringify({ ok: false }));
    });
}
