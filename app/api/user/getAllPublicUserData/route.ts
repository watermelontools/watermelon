import {
  failedPosthogTracking,
  missingParamsPosthogTracking,
  successPosthogTracking,
} from "../../../../utils/api/posthogTracking";
import {
  failedToFecthResponse,
  missingParamsResponse,
  successResponse,
} from "../../../../utils/api/responses";
import validateParams from "../../../../utils/api/validateParams";
import getAllPublicUserData from "../../../../utils/db/user/getAllPublicUserData";

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
    let dbResponse = await getAllPublicUserData({ email: req.email });
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
    return failedToFecthResponse({ error: err });
  }
}
