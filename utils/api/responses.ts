import { NextResponse } from "next/server";

export function successResponse({ data }) {
  return NextResponse.json(
    {
      data,
    },
    { status: 200 }
  );
}
export function unauthorizedResponse({ email }) {
  const missingParamsText = `email: ${email} is not authorized`;
  return NextResponse.json(
    {
      error: missingParamsText,
    },
    { status: 401 }
  );
}
export function missingParamsResponse({ missingParams }) {
  const missingParamsText = `Missing parameters: ${missingParams.join(", ")}`;
  return NextResponse.json(
    {
      error: missingParamsText,
    },
    { status: 400 }
  );
}

export function failedToFetchResponse({ error }) {
  return NextResponse.json(
    {
      error,
      message: "Failed to fetch db data.",
    },
    { status: 500 }
  );
}
