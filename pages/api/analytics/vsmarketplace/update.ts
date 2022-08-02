import Airtable from "airtable";
Airtable.configure({
  endpointUrl: "https://api.airtable.com",
  apiKey: process.env.AIRTABLE_API_KEY,
});
const base = require("airtable").base("appDpKitgxjDIUwZ3");

export default async function handler(req, res) {
  const { dailyStats } = req.body;

  let records: any[] = [];
  for (let index = 0; index < dailyStats.length; index++) {
    const element = dailyStats[index];
    const counts = element.counts;

    records.push({
      fields: {
        Date: element.statisticDate,
        "Web-PageViews": counts?.webPageViews ?? undefined ?? undefined,
        InstallCount: counts?.installCount ?? undefined,
        UninstallCount: counts?.uninstallCount ?? undefined,
        AverageRating: counts?.averageRating ?? undefined,
        "Web-DownloadCount": counts?.webDownloadCount ?? undefined,
      },
    });
  }
  let createdRecord = await base("vscmarketplace").create(records);
  res.status(200).json(createdRecord);
}
