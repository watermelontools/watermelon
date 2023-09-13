import validateParams from "../../../../utils/api/validateParams";
import {
  failedPosthogTracking,
  missingParamsPosthogTracking,
  successPosthogTracking,
} from "../../../../utils/api/posthogTracking";
import {
  failedToFetchResponse,
  missingParamsResponse,
  successResponse,
} from "../../../../utils/api/responses";
import getOpenAISummary from "../../../../utils/actions/getOpenAISummary";
import { StandardProcessedDataArray } from "../../../../types/watermelon";
import getAllServices from "../../../../utils/actions/getAllServices";
function replaceSpecialChars(inputString) {
  const specialChars = /[!"#$%&/()=?_"{}¨*]/g; // Edit this list to include or exclude characters
  return inputString.toLowerCase().replace(specialChars, " ");
}

export async function POST(request: Request) {
  const req = await request.json();
  const { email, repo, owner, commitList } = req;

  const { missingParams } = validateParams(req, [
    "email",
    "repo",
    "owner",
    "commitList",
  ]);

  if (missingParams.length > 0) {
    missingParamsPosthogTracking({ url: request.url, missingParams });
    return missingParamsResponse({ missingParams });
  }
  const query = `EXEC dbo.get_all_user_tokens @watermelon_user='${email}'`;
  let wmUserData = await executeRequest(query);
  const {
    github_token,
    jira_token,
    jira_refresh_token,
    confluence_token,
    confluence_refresh_token,
    confluence_id,
    cloudId,
    slack_token,
    notion_token,
    linear_token,
    user_email,
    AISummary,
    JiraTickets,
    GitHubPRs,
    SlackMessages,
    NotionPages,
    LinearTickets,
    ConfluencePages,
  } = wmUserData;
  try {
    wmUserData = await executeRequest(query);
  } catch (error) {
    console.error(
      "An error occurred while getting user tokens:",
      error.message
    );
    failedPosthogTracking({
      url: request.url,
      error: error.message,
      email: email,
    });
    return failedToFetchResponse({ error: error.message });
  }
  let searchStringSet;
  if (Array.isArray(commitList)) {
    searchStringSet = commitList.join(" ");
  } else {
    searchStringSet = Array.from(new Set(commitList.split(","))).join(" ");
  }

  // select six random words from the search string
  const randomWords = searchStringSet
    .split(" ")
    .sort(() => Math.random() - 0.5)
    .slice(0, 6);

  const serviceAnswers = await getAllServices({
    email,
    repo,
    owner,
    randomWords,
    url: request.url,
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
  const WatermelonAISummary = await getOpenAISummary({
    commitList: searchStringSet.replace(/\r?\n|\r/g, "").split(","),
    values: {
      github: github?.data,
      jira: jira?.data,
      confluence: confluence?.data,
      slack: slack?.data,
      notion: notion?.data,
      linear: linear?.data,
      asana: asana?.data,
    },
  });

  const standardWatermelonAISummary: StandardProcessedDataArray = [
    {
      title: "WatermelonAISummary",
      body: WatermelonAISummary,
      link: "https://app.watermelontools.com",
    },
  ];

  successPosthogTracking({
    url: request.url,
    email: email,
    data: {
      github: github?.fullData || github?.error,
      jira: jira?.fullData || jira?.error,
      confluence: confluence?.fullData || confluence?.error,
      slack: slack?.fullData || slack?.error,
      notion: notion?.fullData || notion?.error,
      linear: linear?.fullData || linear?.error,
      asana: asana?.fullData || asana?.error,
      watermelonSummary: standardWatermelonAISummary,
    },
  });
  return successResponse({
    data: {
      github: github?.data || github?.error,
      jira: jira?.data || jira?.error,
      confluence: confluence?.data || confluence?.error,
      slack: slack?.data || slack?.error,
      notion: notion?.data || notion?.error,
      linear: linear?.data || linear?.error,
      asana: asana?.data || asana?.error,
      watermelonSummary: standardWatermelonAISummary,
    },
  });
}
