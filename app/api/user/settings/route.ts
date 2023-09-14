import getUserSettings from "../../../../utils/db/user/settings";
import validateParams from "../../../../utils/api/validateParams";
import posthog from "../../../../utils/posthog/posthog";
import {
  failedToFetchResponse,
  missingParamsResponse,
  successResponse,
} from "../../../../utils/api/responses";
import { failedPosthogTracking } from "../../../../utils/api/posthogTracking";

export async function POST(request: Request) {
  const req = await request.json();
  const { missingParams } = validateParams(req, ["email"]);

  if (missingParams.length > 0) {
    return missingParamsResponse({ url: request.url, missingParams });
  }
  try {
    let dbResponse = await getUserSettings({ email: req.email });

    return successResponse({
      url: request.url,
      email: req.email,
      data: dbResponse,
    });
  } catch (err) {
    console.error("Error fetching db data:", err);
    posthog.capture({
      distinctId: req.email,
      event: `${request.url}-failed`,
      properties: {
        error: err,
      },
    });
    return failedToFetchResponse({ error: err });
  }
}
