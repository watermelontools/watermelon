import Airtable from "airtable";
Airtable.configure({
  endpointUrl: "https://api.airtable.com",
  apiKey: "keyOgeDU8McqfrAJa",
});
const base = require("airtable").base("appesXek3hiDnF4lt");

export default async function handler(req, res) {
  const organizationName = req.body.organizationName;
  let organization;
  let isWithinPlan;
  let organizationCount = -1;
  let organizationPlan = "";
  await base("Organizations")
    .select({
      filterByFormula: `{OrganizationName} = "${organizationName}"`,
    })
    .eachPage(function page(records: any[], fetchNextPage: () => void) {
      records.forEach(function (record) {
        organization = { ...record.fields, id: record.id };
        organizationCount = organization.Count;
        organizationPlan = organization.Plan;
      });
      fetchNextPage();
    });

  if (organizationPlan === "Free") {
    if (organizationCount < 50) {
      isWithinPlan = true;
    } else {
      isWithinPlan = false;
    }
  } else if (organizationPlan === "Starter") {
    if (organizationCount < 150) {
      isWithinPlan = true;
    } else {
      isWithinPlan = false;
    }
  } else if (organizationPlan === "Pro") {
    if (organizationCount < 500) {
      isWithinPlan = true;
    } else {
      isWithinPlan = false;
    }
  } else if (organizationPlan === "Enterprise") {
    isWithinPlan = true;
  } else {
    isWithinPlan = false;
  }

  res.status(200).json({
    organizationIsWithinPlan: isWithinPlan,
  });
}
