import {
  failedToFecthResponse,
  missingParamsResponse,
  successResponse,
} from "../../../../utils/api/responses";
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
    return successResponse({ data: dbResponse });
  } catch (err) {
    console.error("Error fetching db data:", err);
    return failedToFecthResponse({ error: err });
  }
}
