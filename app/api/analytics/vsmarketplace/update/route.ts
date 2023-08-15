import { NextResponse } from "next/server";
import validateParams from "../../../../../utils/api/validateParams";
import Airtable from "airtable";
import { missingParamsResponse } from "../../../../../utils/api/responses";
import posthog from "../../../../../utils/posthog/posthog";
Airtable.configure({
  endpointUrl: "https://api.airtable.com",
  apiKey: process.env.AIRTABLE_API_KEY,
});
const base = require("airtable").base("appDpKitgxjDIUwZ3");
function toRecords(infoArray) {
  let records: any[] = [];

  for (let index = 0; index < infoArray.length; index++) {
    const element = infoArray[index];
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
  return records;
}
export async function POST(request: Request) {
  const req = await request.json();
  const { missingParams } = validateParams(req, ["dailyStats"]);

  if (missingParams.length > 0) {
    return missingParamsResponse({ url: request.url, missingParams });
  }
  const { dailyStats } = req;
  let records;
  if (dailyStats.length < 10) {
    records = toRecords(dailyStats.slice(0, 10));
    let createdRecord = await base("vscmarketplace").create(records);
    return NextResponse.json(createdRecord);
  } else {
    records = toRecords(dailyStats);
    // now take the records and chunk them into groups of 10
    let chunkedRecords = [];
    let i,
      j,
      temparray,
      chunk = 10;
    for (i = 0, j = records.length; i < j; i += chunk) {
      temparray = records.slice(i, i + chunk);
      // @ts-ignore
      chunkedRecords.push(temparray);
    }
    // now we have an array of arrays of 10 records each
    // we can now loop through each array and create the records
    let createdRecords = [];
    for (let index = 0; index < chunkedRecords.length; index++) {
      const element = chunkedRecords[index];
      let createdRecord = await base("vscmarketplace").create(element);
      // @ts-ignore
      createdRecords.push(createdRecord);
    }
    return NextResponse.json(createdRecords);
  }
}
