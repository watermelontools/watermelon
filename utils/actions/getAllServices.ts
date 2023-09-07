import { failedPosthogTracking } from "../api/posthogTracking";
import { failedToFetchResponse } from "../api/responses";
import executeRequest from "../db/azuredb";
import getGitHub from "./getGitHub";
import getJira from "./getJira";
import getSlack from "./getSlack";
import getNotion from "./getNotion";
import getLinear from "./getLinear";
import getConfluence from "./getConfluence";
import getAsana from "./getAsana";
export default async function getAllServices({
  email,
  url,
  repo,
  owner,
  randomWords,
  hardMax,
}: {
  email: string;
  url: string;
  repo: string;
  owner: string;
  randomWords: string[];
  hardMax?: number;
}) {
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
    asana_token,
    asana_workspace,
    user_email,
    AISummary,
    JiraTickets,
    GitHubPRs,
    SlackMessages,
    NotionPages,
    LinearTickets,
    ConfluencePages,
    AsanaTasks,
  } = wmUserData;
  try {
    wmUserData = await executeRequest(query);
  } catch (error) {
    console.error(
      "An error occurred while getting user tokens:",
      error.message
    );
    failedPosthogTracking({
      url: url,
      error: error.message,
      email: email,
    });
    return { error: error.message };
  }
  const [github, jira, confluence, slack, notion, linear, asana] =
    await Promise.all([
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
        token: confluence_token,
        refresh_token: confluence_refresh_token,
        cloudId: confluence_id,
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
      getAsana({
        access_token: asana_token,
        user: user_email,
        randomWords,
        workspace: asana_workspace,
        amount: AsanaTasks,
      }),
    ]);
  return {
    github,
    jira,
    confluence,
    slack,
    notion,
    linear,
    asana,
    wmUserData,
  };
}
