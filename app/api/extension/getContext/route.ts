import getGitHub from "../../../../utils/actions/getGitHub";
import getJira from "../../../../utils/actions/getJira";
import getSlack from "../../../../utils/actions/getSlack";
import getNotion from "../../../../utils/actions/getNotion";
import getLinear from "../../../../utils/actions/getLinear";
import getConfluence from "../../../../utils/actions/getConfluence";
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
import executeRequest from "../../../../utils/db/azuredb";
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
  const query = `EXEC dbo.get_all_user_tokens @watermelon_user='${req.email}'`;
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
      email: req.email,
    });
    return failedToFetchResponse({ error: error.message });
  }

  const searchStringSet = Array.from(
    new Set(req.commitList.split(",").split("/"))
  ).join(" ");

  // select six random words from the search string
  const randomWords = searchStringSet
    .split(" ")
    .sort(() => Math.random() - 0.5)
    .slice(0, 6);

  const [github, jira, confluence, slack, notion, linear] = await Promise.all([
    getGitHub({
      repo,
      owner,
      github_token,
      randomWords,
      amount: GitHubPRs,
    }),
    getJira({
      user: user_email,
      token: jira_token,
      refresh_token: jira_refresh_token,
      randomWords,
      amount: JiraTickets,
    }),
    getConfluence({
      confluence_token,
      confluence_refresh_token,
      confluence_id,
      user: user_email,
      randomWords,
      amount: ConfluencePages,
    }),
    getSlack({
      slack_token,
      searchString: randomWords.join(" "),
      amount: SlackMessages,
    }),
    getNotion({
      notion_token,
      randomWords,
      amount: NotionPages,
    }),
    getLinear({
      linear_token,
      randomWords,
      amount: LinearTickets,
    }),
  ]);

  successPosthogTracking({
    url: request.url,
    email: req.email,
    data: {
      github: github.fullData || github.error,
      jira: jira.fullData || jira.error,
      confluence: confluence.fullData || confluence.error,
      slack: slack.fullData || slack.error,
      notion: notion.fullData || notion.error,
      linear: linear.fullData || linear.error,
    },
  });
  return successResponse({
    data: {
      github: github.data || github.error,
      jira: jira.data || jira.error,
      confluence: confluence.data || confluence.error,
      slack: slack.data || slack.error,
      notion: notion.data || notion.error,
      linear: linear.data || linear.error,
    },
  });
}
