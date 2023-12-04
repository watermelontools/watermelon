import {
  failedToFetchResponse,
  missingParamsResponse,
  successResponse,
} from "../../../../utils/api/responses";
import validateParams from "../../../../utils/api/validateParams";
import patchUserSettings from "../../../../utils/db/user/patchUserSettings";

export async function POST(request: Request) {
  const req = await request.json();
  const { missingParams } = validateParams(req, ["email", "prompt"]);

  if (missingParams.length > 0) {
    return missingParamsResponse({ url: request.url, missingParams });
  }

  try {
    const response = await fetch(
      "https://api-inference.huggingface.co/models/mistralai/Mistral-7B-v0.1",
      {
        headers: { Authorization: `Bearer ${process.env.HUGGINGFACE_TOKEN}` },
        method: "POST",
        body: JSON.stringify(req.prompt),
      }
    );
    const result = await response.json();
    console.log(result);

    return successResponse({
      url: request.url,
      email: req.email,
      data: result,
    });
  } catch (err) {
    console.error("Error using Mistral on huggingface:", err);

    return failedToFetchResponse({
      url: request.url,
      error: err.message,
      email: req.email,
    });
  }
}
