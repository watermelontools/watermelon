import {
  failedPosthogTracking,
  successPosthogTracking,
} from "../../../../utils/api/posthogTracking";
import {
  failedToFetchResponse,
  missingParamsResponse,
  successResponse,
} from "../../../../utils/api/responses";
import validateParams from "../../../../utils/api/validateParams";
import getAllPublicUserData from "../../../../utils/db/user/getAllPublicUserData";
import posthog from "../../../../utils/posthog/posthog";

export async function POST(request: Request) {
  const req = await request.json();
  const { missingParams } = validateParams(req, ["email"]);

  if (missingParams.length > 0) {
    return missingParamsResponse({ url: request.url, missingParams });
  }

  try {
    let dbResponse = await getAllPublicUserData({ email: req.email });
    posthog.capture({
      distinctId: req.email,
      event: `${request.url}-success`,
      properties: dbResponse,
    });
    return successResponse({ data: dbResponse });
  } catch (err) {
    console.error("Error fetching db data:", err);
    posthog.capture({
      distinctId: req.email,
      event: `${request.url}-failed`,
      properties: { error: err },
    });
    return failedToFetchResponse({ error: err });
  }
}
