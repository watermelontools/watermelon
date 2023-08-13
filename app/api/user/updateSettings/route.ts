import { NextResponse } from "next/server";
import validateParams from "../../../../utils/api/validateParams";
import patchUserSettings from "../../../../utils/db/user/patchUserSettings";

export async function POST(request: Request) {
  const req = await request.json();
  const { missingParams } = validateParams(req, ["email", "userSettings"]);

  if (missingParams.length > 0) {
    return NextResponse.json(
      {
        error: `Missing parameters: ${missingParams.join(", ")}`,
      },
      { status: 400 }
    );
  }

  try {
    let dbResponse = await patchUserSettings({
      email: req.email,
      userSettings: req.userSettings,
    });
    return NextResponse.json(dbResponse);
  } catch (err) {
    console.error("Error fetching db data:", err);
    return NextResponse.json({ error: "Failed to fetch db data." });
  }
}
