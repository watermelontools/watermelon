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

  try {
    let dbResponse = await getAllPublicUserData({ email: req.email });
    return NextResponse.json(dbResponse);
  } catch (err) {
    console.error("Error fetching db data:", err);
    return NextResponse.json({ error: "Failed to fetch db data." });
  }
}
