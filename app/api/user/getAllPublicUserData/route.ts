import { NextResponse } from "next/server";
import validateParams from "../../../../utils/api/validateParams";
import getAllPublicUserData from "../../../../utils/db/user/getAllPublicUserData";

export async function POST(request: Request) {
  const req = await request.json();
  const { missingParams } = validateParams(req, ["email"]);

  if (missingParams.length > 0) {
    return NextResponse.json({
      error: `Missing parameters: ${missingParams.join(", ")}`,
    });
  }
  let dbUser = await getAllPublicUserData({ email: req.email });
  return NextResponse.json(dbUser);
}
