import Airtable from "airtable";
Airtable.configure({
  endpointUrl: "https://api.airtable.com",
  apiKey: "keyOgeDU8McqfrAJa",
});
const base = require("airtable").base("appesXek3hiDnF4lt");

export default async function handler(req, res) {
  const organizationName = req.body.organizationName;
  let organization;
  await base("Organizations")
    .select({
      filterByFormula: `{OrganizationName} = "${organizationName}"`,
    })
    .eachPage(function page(records, fetchNextPage) {
      records.forEach(function (record) {
        organization = { ...record.fields, id: record.id };
      });
      fetchNextPage();
    });
  if (organization) {
    const organizationId = organization.id;
    base("Organizations").update(
      organizationId,
      {
        Count: organization.Count + 1,
      },
      function (err, record) {
        if (err) {
          console.error(err);
          return;
        }
        console.log(record.getId());
      }
    );
  } else {
    base("Organizations").create(
      {
        OrganizationName: organizationName,
        Count: 1,
      },
      function (err, record) {
        if (err) {
          console.error(err);
          return;
        }
        console.log(record.getId());
      }
    );
  }

  res.status(200).json({
    userQueries: organization,
  });
}
