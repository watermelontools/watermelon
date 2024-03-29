import {
  missingParamsResponse,
  successResponse,
} from "../../../../utils/api/responses";
import validateParams from "../../../../utils/api/validateParams";
import sendWelcome from "../../../../utils/sendgrid/sendWelcome";

export async function POST(request: Request) {
  const req = await request.json();
  const { missingParams } = validateParams(req, ["sender", "emails"]);

  if (missingParams.length > 0) {
    return missingParamsResponse({ url: request.url, missingParams });
  }
  const { sender, emails } = req;

  let emailSent = await sendWelcome({ sender, emails });
  return successResponse({
    url: request.url,
    email: req.email,
    data: emailSent,
  });
}
