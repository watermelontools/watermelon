import { NextResponse } from "next/server";
import getUserSettings from "../../../../utils/db/user/settings";
import validateParams from "../../../../utils/api/validateParams";
import posthog from "../../../../utils/posthog/posthog";

export async function POST(request: Request) {
  const req = await request.json();
  const { missingParams } = validateParams(req, ["email"]);

  if (missingParams.length > 0) {
    return missingParamsResponse({ url: request.url, missingParams });
  }
  posthog.capture({
    distinctId: req.email,
    event: "user_settings_viewed",
    properties: {
      email: req.email,
    },
  });
  try {
    let dbResponse = await getUserSettings({ email: req.email });

    return successResponse({
      url: request.url,
      email: req.email,
      data: dbResponse,
    });
  } catch (err) {
    console.error("Error fetching db data:", err);
    return failedToFetchResponse({
      url: request.url,
      error: err.message,
      email: req.email,
    });
  }
}
