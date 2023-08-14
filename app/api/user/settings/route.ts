import { NextResponse } from "next/server";
import getUserSettings from "../../../../utils/db/user/settings";
import validateParams from "../../../../utils/api/validateParams";
import posthog from "../../../../utils/posthog/posthog";

export async function POST(request: Request) {
  const req = await request.json();
  const { missingParams } = validateParams(req, ["email"]);

  if (missingParams.length > 0) {
    return NextResponse.json({
      error: `Missing parameters: ${missingParams.join(", ")}`,
    });
  }
  posthog.capture({
    distinctId: req.email,
    event: "user_settings_viewed",
    properties: {
      email: req.email,
    },
  });
  try {
    let dbResponse = await getUserSettings({ email: req.email });
    return NextResponse.json(dbResponse);
  } catch (err) {
    console.error("Error fetching db data:", err);
    return NextResponse.json({ error: "Failed to fetch db data." });
  }
}
