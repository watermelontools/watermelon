import { NextResponse } from "next/server";
import validateParams from "../../../../utils/api/validateParams";
import patchUserSettings from "../../../../utils/db/user/patchUserSettings";
import posthog from "../../../../utils/posthog/posthog";

export async function POST(request: Request) {
  const req = await request.json();
  const { missingParams } = validateParams(req, ["email", "userSettings"]);

  if (missingParams.length > 0) {
    posthog.capture({
      event: `${request.url}-missing-params`,
      properties: missingParams,
    });
    return missingParamsResponse({ missingParams });
  }

  try {
    let dbResponse = await patchUserSettings({
      email: req.email,
      userSettings: req.userSettings,
    });
    posthog.capture({
      distinctId: req.email,
      event: `${request.url}-success`,
      properties: {
        dbResponse,
      },
    });
    return successResponse({ data: dbResponse });
  } catch (err) {
    console.error("Error fetching db data:", err);
    return NextResponse.json({ error: "Failed to fetch db data." });
  }
}
