import {
  failedToFetchResponse,
  missingParamsResponse,
  successResponse,
} from "../../../../utils/api/responses";
import validateParams from "../../../../utils/api/validateParams";
import patchUserSettings from "../../../../utils/db/user/patchUserSettings";

export async function POST(request: Request) {
  const req = await request.json();
  const { missingParams } = validateParams(req, ["email", "userSettings"]);

  if (missingParams.length > 0) {
    return missingParamsResponse({ url: request.url, missingParams });
  }

  try {
    let dbResponse = await patchUserSettings({
      email: req.email,
      userSettings: req.userSettings,
    });

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
