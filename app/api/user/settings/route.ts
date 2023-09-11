import getUserSettings from "../../../../utils/db/user/settings";
import validateParams from "../../../../utils/api/validateParams";
import {
  failedToFetchResponse,
  missingParamsResponse,
  successResponse,
} from "../../../../utils/api/responses";
import {
  failedPosthogTracking,
  missingParamsPosthogTracking,
  successPosthogTracking,
} from "../../../../utils/api/posthogTracking";

export async function POST(request: Request) {
  const req = await request.json();
  const { missingParams } = validateParams(req, ["email"]);

  if (missingParams.length > 0) {
    missingParamsPosthogTracking({
      missingParams,
      url: request.url,
    });
    return missingParamsResponse({ missingParams });
  }
  try {
    let dbResponse = await getUserSettings({ email: req.email });
    successPosthogTracking({
      email: req.email,
      url: request.url,
      data: dbResponse,
    });
    return successResponse({ data: dbResponse });
  } catch (err) {
    console.error("Error fetching db data:", err);
    failedPosthogTracking({
      error: err,
      email: req.email,
      url: request.url,
    });
    return failedToFetchResponse({ error: err });
  }
}
