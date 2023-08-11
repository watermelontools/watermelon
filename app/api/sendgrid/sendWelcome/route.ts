import { NextResponse } from "next/server";
import validateParams from "../../../../utils/api/validateParams";
import sendWelcome from "../../../../utils/sendgrid/sendWelcome";

export default async function POST(request: Request) {
  const req = await request.json();
  const { missingParams } = validateParams(req, ["sender", "emails"]);

  if (missingParams.length > 0) {
    return NextResponse.json({
      error: `Missing parameters: ${missingParams.join(", ")}`,
    });
  }
  const { sender, emails } = req;

  let emailSent = await sendWelcome({ sender, emails });
  return NextResponse.json(emailSent);
}
