import {
  missingParamsPosthogTracking,
  successPosthogTracking,
} from "../../../../utils/api/posthogTracking";
import {
  missingParamsResponse,
  successResponse,
} from "../../../../utils/api/responses";
import validateParams from "../../../../utils/api/validateParams";
import sendTeammateInvite from "../../../../utils/sendgrid/sendTeammateInvite";

export async function POST(request: Request) {
  const req = await request.json();
  const { missingParams } = validateParams(req, [
    "sender",
    "email",
    "inviteUrl",
    "teamName",
  ]);

  if (missingParams.length > 0) {
    missingParamsPosthogTracking({ missingParams, url: request.url });
    return missingParamsResponse({ missingParams });
  }
  const { sender, email, inviteUrl, teamName } = req;

  let emailSent = await sendTeammateInvite({
    sender,
    teammateEmail: email,
    inviteUrl,
    teamName,
  });

  successPosthogTracking({ url: request.url, email: sender, data: emailSent });
  return successResponse({ data: emailSent });
}
