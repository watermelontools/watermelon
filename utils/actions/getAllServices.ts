import { failedPosthogTracking } from "../api/posthogTracking";
import executeRequest from "../db/azuredb";
import getGitHub from "./getGitHub";
import getJira from "./getJira";
import getSlack from "./getSlack";
import getNotion from "./getNotion";
import getLinear from "./getLinear";
import getConfluence from "./getConfluence";
import getAsana from "./getAsana";
import getTeamGitHub from "./getTeamGitHub";

export default async function getAllServices({
  email,
  url,
  repo,
  owner,
  randomWords,
  hardMax,
  userLogin,
  installationId,
}: {
  email?: string;
  userLogin?: string;
  url: string;
  repo: string;
  owner: string;
  randomWords: string[];
  hardMax?: number;
  installationId?: number;
}) {
  let query = "";
  if (email) {
    query = `EXEC dbo.get_all_user_tokens @watermelon_user='${email}'`;
    try {
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
        SearchAmount,
        ResponseTexts,
        watermelon_user,
      } = wmUserData;
      const [github, jira, confluence, slack, notion, linear, asana] =
        await Promise.all([
          getGitHub({
            repo,
            owner,
            github_token,
            randomWords,
            amount: SearchAmount,
          }),
          getJira({
            user: user_email,
            token: jira_token,
            refresh_token: jira_refresh_token,
            randomWords,
            amount: SearchAmount,
          }),
          getConfluence({
            token: confluence_token,
            refresh_token: confluence_refresh_token,
            cloudId: confluence_id,
            user: user_email,
            randomWords,
            amount: SearchAmount,
          }),
          getSlack({
            slack_token,
            searchString: randomWords.join(" "),
            amount: SearchAmount,
          }),
          getNotion({
            notion_token,
            randomWords,
            amount: SearchAmount,
          }),
          getLinear({
            linear_token,
            randomWords,
            amount: SearchAmount,
          }),
          getAsana({
            access_token: asana_token,
            user: user_email,
            randomWords,
            workspace: asana_workspace,
            amount: SearchAmount,
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
        watermelon_user,
        AISummary,
        user_email,
      };
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
  } else {
    query = `EXEC dbo.get_all_tokens_from_gh_username @github_user='${userLogin}'`;
    try {
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
        SearchAmount,
        ResponseTexts,
        watermelon_user,
      } = wmUserData;
      if (!watermelon_user) {
        const [github] = await Promise.all([
          getTeamGitHub({
            repo,
            owner,
            installationId,
            randomWords,
            amount: SearchAmount,
          }),
        ]);
        return {
          github,
          asana: { error: "no asana token", data: [], fullData: [] },
          confluence: { error: "no confluence token", data: [], fullData: [] },
          jira: { error: "no jira token", data: [], fullData: [] },
          linear: { error: "no linear token", data: [], fullData: [] },
          notion: { error: "no notion token", data: [], fullData: [] },
          slack: { error: "no slack token", data: [], fullData: [] },
          watermelon_user: "team",
          AISummary,
          ResponseTexts,
          SearchAmount,
        };
      } else {
        const [github, jira, confluence, slack, notion, linear, asana] =
          await Promise.all([
            getGitHub({
              repo,
              owner,
              github_token,
              randomWords,
              amount: SearchAmount,
            }),
            getJira({
              user: user_email,
              token: jira_token,
              refresh_token: jira_refresh_token,
              randomWords,
              amount: SearchAmount,
            }),
            getConfluence({
              token: confluence_token,
              refresh_token: confluence_refresh_token,
              cloudId: confluence_id,
              user: user_email,
              randomWords,
              amount: SearchAmount,
            }),
            getSlack({
              slack_token,
              searchString: randomWords.join(" "),
              amount: SearchAmount,
            }),
            getNotion({
              notion_token,
              randomWords,
              amount: SearchAmount,
            }),
            getLinear({
              linear_token,
              randomWords,
              amount: SearchAmount,
            }),
            getAsana({
              access_token: asana_token,
              user: user_email,
              randomWords,
              workspace: asana_workspace,
              amount: SearchAmount,
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
          watermelon_user,
          AISummary,
          ResponseTexts,
          user_email,
        };
      }
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
  }
}
