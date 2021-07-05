import Airtable from "airtable";
Airtable.configure({
  endpointUrl: "https://api.airtable.com",
  apiKey: process.env.AIRTABLE_API_KEY,
});

const airtableBase = Airtable.base("appyNw8U8LEBl4iPs");

export const getAllQuestions = async () => {
  let allQuestions = [];
  await airtableBase("en")
    .select({
      // Selecting the first 3 records in Grid view:

      filterByFormula: `({Category} = '${"hobbies"}')`,
    })
    .eachPage(function page(records, fetchNextPage) {
      // This function (`page`) will get called for each page of records.
      records.forEach(function (record) {
        allQuestions.push(record);
      });
      fetchNextPage();
    });
  return allQuestions;
};
