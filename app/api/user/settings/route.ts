import getUserSettings from "../../../../utils/db/user/settings";
import validateParams from "../../../../utils/api/validateParams";
import posthog from "../../../../utils/posthog/posthog";
import {
  failedToFetchResponse,
  missingParamsResponse,
  successResponse,
} from "../../../../utils/api/responses";

export async function POST(request: Request) {
  const req = await request.json();
  const { missingParams } = validateParams(req, ["email"]);

  if (missingParams.length > 0) {
    posthog.capture({
      event: "api-user-settings-missing-params",
      properties: missingParams,
    });
    return missingParamsResponse({ missingParams });
  }

  try {
    let dbResponse = await getUserSettings({ email: req.email });
    return successResponse({ data: dbResponse });
  } catch (err) {
    console.error("Error fetching db data:", err);
    return failedToFetchResponse({ error: err });
  }
}
