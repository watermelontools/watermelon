import { NextResponse } from "next/server";
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
    return NextResponse.json(
      {
        error: `Missing parameters: ${missingParams.join(", ")}`,
      },
      { status: 400 }
    );
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
