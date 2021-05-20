import admin from "../../../utils/firebase/backend";

import Airtable from "airtable";
Airtable.configure({
  endpointUrl: "https://api.airtable.com",
  apiKey: process.env.AIRTABLE_API_KEY,
});
const airtableBase = Airtable.base("appyNw8U8LEBl4iPs");
let db = admin.firestore();

export default function handler(req, res) {
  let settings = { language: "en", category: "hobbies" };
  let allQuestions = [];
  db.collection("teams")
    .doc(`T01JG9GD4JW`)
    .get()
    .then((fbRes) => {
      let responseData = fbRes.data();
      if (responseData.settings) {
        settings = responseData.settings;
      }
      console.log("settings", settings);
    })
    .catch(function (error) {
      console.error("Error writing: ", error);
      res.status(500).json(JSON.stringify({ ok: false }));
    });
  airtableBase(settings.language)
    .select({
      // Selecting the first 3 records in Grid view:

      filterByFormula: `({Category} = '${settings.category}')`,
    })
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
        console.log(allQuestions);
        res.status(200).send({ ok: "ok" });
      }
    );
}
