import { NextResponse } from "next/server";
import validateParams from "../../../../utils/api/validateParams";
import getUser from "../../../../utils/db/discord/getUser";

export async function POST(request: Request) {
  const req = await request.json();
  const { missingParams } = validateParams(req, ["email"]);

  if (missingParams.length > 0) {
    return NextResponse.json({
      error: `Missing parameters: ${missingParams.join(", ")}`,
    });
  }
  let dbResponse = await getUser(req.email);
  return NextResponse.json(dbResponse);
}
