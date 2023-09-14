import validateParams from "../../../../utils/api/validateParams";
import { failedPosthogTracking } from "../../../../utils/api/posthogTracking";
import {
  failedToFetchResponse,
  missingParamsResponse,
  successResponse,
} from "../../../../utils/api/responses";
import getAllServices from "../../../../utils/actions/getAllServices";

export async function POST(request: Request) {
  const req = await request.json();

  const { missingParams } = validateParams(req, [
    "email",
    "repo",
    "owner",
    "commitTitle",
  ]);

  if (missingParams.length > 0) {
    return missingParamsResponse({ url: request.url, missingParams });
  }

  const searchStringSet = Array.from(new Set(req.commitTitle.split(" "))).join(
    " "
  );

  // select six random words from the search string
  const randomWords = searchStringSet
    .split(" ")
    .sort(() => Math.random() - 0.5)
    .slice(0, 6);
  const { repo, owner, email } = req;

  const serviceAnswers = await getAllServices({
    email,
    repo,
    owner,
    randomWords,
    url: request.url,
    hardMax: 1,
  });
  const { error, github, jira, confluence, slack, notion, linear, asana } =
    serviceAnswers;
  if (error) {
    failedPosthogTracking({
      url: request.url,
      error: error.message,
      email: req.email,
    });
    return failedToFetchResponse({ error: error.message });
  }

  return successResponse({
    url: request.url,
    email: req.email,
    data: {
      github: github?.data || github?.error,
      jira: jira?.data || jira?.error,
      confluence: confluence?.data || confluence?.error,
      slack: slack?.data || slack?.error,
      notion: notion?.data || notion?.error,
      linear: linear?.data || linear?.error,
      asana: asana?.data || asana?.error,
    },
  });
}
