import Airtable from "airtable";
Airtable.configure({
  endpointUrl: "https://api.airtable.com",
  apiKey: process.env.AIRTABLE_API_KEY,
});
const airtableBase = Airtable.base("appyNw8U8LEBl4iPs");
export default function handler(req, res) {
  const settings = { language: "en", category: "hobbies" };
  let allQuestions = [];

  airtableBase(settings.language)
    .select({
      // Selecting the first 3 records in Grid view:

      filterByFormula: `({Category} = '${settings.category}')`,
    })
    .eachPage(
      function page(records, fetchNextPage) {
        // This function (`page`) will get called for each page of records.
        records.forEach(function (record) {
          allQuestions.push(record);
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
