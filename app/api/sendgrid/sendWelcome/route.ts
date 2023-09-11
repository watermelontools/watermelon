import {
  missingParamsPosthogTracking,
  successPosthogTracking,
} from "../../../../utils/api/posthogTracking";
import {
  missingParamsResponse,
  successResponse,
} from "../../../../utils/api/responses";
import validateParams from "../../../../utils/api/validateParams";
import sendWelcome from "../../../../utils/sendgrid/sendWelcome";

export default async function POST(request: Request) {
  const req = await request.json();
  const { missingParams } = validateParams(req, ["sender", "emails"]);

  if (missingParams.length > 0) {
    missingParamsPosthogTracking({ missingParams, url: request.url });
    return missingParamsResponse({ missingParams });
  }
  const { sender, emails } = req;

  let emailSent = await sendWelcome({ sender, emails });
  successPosthogTracking({ url: request.url, email: sender, data: emailSent });
  return successResponse({ data: emailSent });
}
