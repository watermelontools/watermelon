import { NextResponse } from "next/server";
import {
  failedPosthogTracking,
  missingParamsPosthogTracking,
  successPosthogTracking,
  unauthorizedPosthogTracking,
} from "./posthogTracking";

export function successResponse({ url, email, data }) {
  successPosthogTracking({ url, email, data });
  return NextResponse.json(
    {
      data,
    },
    { status: 200 }
  );
}

export function missingParamsResponse({ url, missingParams }) {
  const missingParamsText = `Missing parameters: ${missingParams.join(", ")}`;
  missingParamsPosthogTracking({ url, missingParams });
  return NextResponse.json(
    {
      error: missingParamsText,
    },
    { status: 400 }
  );
}

export function unauthorizedResponse({ email, url }) {
  const responseText = `email: ${email} is not authorized`;
  unauthorizedPosthogTracking({ email, url, error: responseText });

  return NextResponse.json(
    {
      error: responseText,
    },
    { status: 401 }
  );
}

export function failedToFetchResponse({ url, email, error }) {
  failedPosthogTracking({ url, email, error });
  return NextResponse.json(
    {
      error,
      message: "Failed to fetch db data.",
    },
    { status: 500 }
  );
}
