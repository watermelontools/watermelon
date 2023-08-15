import { NextResponse } from "next/server";
import { missingParamsResponse } from "../../../../utils/api/responses";
import validateParams from "../../../../utils/api/validateParams";
import posthog from "../../../../utils/posthog/posthog";
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
    posthog.capture({
      event: `${request.url}-missing-params`,
      properties: missingParams,
    });
    return missingParamsResponse({ missingParams });
  }
  const { sender, email, inviteUrl, teamName } = req;

  let emailSent = await sendTeammateInvite({
    sender,
    teammateEmail: email,
    inviteUrl,
    teamName,
  });
  return NextResponse.json(emailSent);
}
