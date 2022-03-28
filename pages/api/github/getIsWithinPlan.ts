import Airtable from "airtable";
Airtable.configure({
  endpointUrl: "https://api.airtable.com",
  apiKey: "keyOgeDU8McqfrAJa",
});
const base = require("airtable").base("appesXek3hiDnF4lt");

export default async function handler(req, res) {
  const organizationName = req.body.organizationName;
  let organization;
  let isWithinPlan = false;
  await base("Organizations")
  .select({
    filterByFormula: `{OrganizationName} = "${organizationName}"`,
  })
  .eachPage(function page(records: any[], fetchNextPage: () => void) {
    records.forEach(function (record) {
      organization = { ...record.fields, id: record.id };
      isWithinPlan = organization.IsInPlan;
    });

  res.status(200).json({
    organizationIsWithinPlan: isWithinPlan,
  });
  })
}
