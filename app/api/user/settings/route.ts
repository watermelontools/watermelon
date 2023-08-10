import { NextResponse } from "next/server";
import getUserSettings from "../../../../utils/db/user/settings";
import validateParams from "../../../../utils/api/validateParams";

export async function POST(request: Request) {
  const req = await request.json();
  const { missingParams } = validateParams(req, ["email"]);

  if (missingParams.length > 0) {
    return NextResponse.json({
      error: `Missing parameters: ${missingParams.join(", ")}`,
    });
  }

  let dbUser = await getUserSettings({ email: req.email as string });
  return NextResponse.json(dbUser);
}
