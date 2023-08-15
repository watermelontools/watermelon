import getGitHub from "../../../../utils/actions/getGitHub";
import getJira from "../../../../utils/actions/getJira";
import getSlack from "../../../../utils/actions/getSlack";
import getNotion from "../../../../utils/actions/getNotion";
import getLinear from "../../../../utils/actions/getLinear";
import getConfluence from "../../../../utils/actions/getConfluence";
import getAsana from "../../../../utils/actions/getAsana";
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

function handleRejection(reason) {
  console.error(reason);
  return { error: reason };
}
export async function POST(request: Request) {
  const req = await request.json();

  const { missingParams } = validateParams(req, [
    "email",
    "repo",
    "owner",
    "gitSystem",
    "commitTitle",
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
    asana_token,
    asana_workspace,
    user_email,
    watermelon_user,
  } = wmUserData;
  try {
    userTokens = await getUserTokens({ email: req.email });
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
  async function fetchGitHubIssues(userTokens, owner, repo) {
    const { github_token } = userTokens;

    const octokit = new Octokit({
      auth: github_token,
    });

  // select six random words from the search string
  const randomWords = searchStringSet
    .split(" ")
    .sort(() => Math.random() - 0.5)
    .slice(0, 6);
  const { repo, owner } = req;
  const [github, jira, confluence, slack, notion, linear] = await Promise.all([
    getGitHub({
      repo,
      owner,
      github_token,
      randomWords,
      amount: 1,
    }),
    getJira({
      user: user_email,
      token: jira_token,
      refresh_token: jira_refresh_token,
      randomWords,
      amount: 1,
    }),
    getConfluence({
      token: confluence_token,
      refresh_token: confluence_refresh_token,
      cloudId: confluence_id,
      user: user_email,
      randomWords,
      amount: 1,
    }),
    getSlack({
      slack_token,
      searchString: randomWords.join(" "),
      amount: 1,
    }),
    getNotion({
      notion_token,
      randomWords,
      amount: 1,
    }),
    getLinear({
      linear_token,
      randomWords,
      amount: 1,
    }),
    getAsana({
      access_token: asana_token,
      user: user_email,
      randomWords,
      workspace: asana_workspace,
      amount: 1,
    }),
  ]);

  const githubIssues =
    githubResult.status === "fulfilled"
      ? githubResult.value
      : handleRejection(githubResult.reason);
  const jiraTickets =
    jiraResult.status === "fulfilled"
      ? jiraResult.value
      : handleRejection(jiraResult.reason);
  const slackConversations =
    slackResult.status === "fulfilled"
      ? slackResult.value
      : handleRejection(slackResult.reason);

  successPosthogTracking({
    url: request.url,
    email: req.email,
    data: {
      github: githubIssues,
      jira: jiraTickets,
      slack: slackConversations,
    },
  });
  return successResponse({
    data: {
      github: githubIssues,
      jira: jiraTickets,
      slack: slackConversations,
    },
  });
}
