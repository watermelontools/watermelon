import { NextResponse } from "next/server";
import {
  missingParamsPosthogTracking,
  successPosthogTracking,
} from "../../../../utils/api/posthogTracking";
import {
  missingParamsResponse,
  successResponse,
  unauthorizedResponse,
} from "../../../../utils/api/responses";
import validateParams from "../../../../utils/api/validateParams";
import intellijLogin from "../../../../utils/db/user/intellijLogin";

export async function POST(request: Request) {
  const req = await request.json();
  const { token } = req;
  const { missingParams } = validateParams(req, ["token"]);

  if (missingParams.length > 0) {
    missingParamsPosthogTracking({ url: request.url, missingParams });
    return missingParamsResponse({ missingParams });
  }

  const userData = await intellijLogin({ watermelon_user: token });
  if (!userData || !userData.email) {
    return unauthorizedResponse({ email: token });
  }

  successPosthogTracking({
    url: request.url,
    email: userData.email,
    data: userData,
  });
  return successResponse({ data: userData });
}
