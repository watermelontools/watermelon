import executeRequest from "../azuredb";

export default async function updateUserSettings({
  email,
  userSettings,
}): Promise<any> {
  try {
    let data = await executeRequest(
      `EXEC dbo.update_userSettings @watermelon_user = '${email}', @AISummary='${userSettings.AISummary}', @JiraTickets='${userSettings.JiraTickets}', @SlackMessages='${userSettings.SlackMessages}', @GitHubPRs='${userSettings.GitHubPRs}', @NotionPages= '${userSettings.NotionPages}', @LinearTickets= '${userSettings.LinearTickets}', @ConfluenceDocs= '${userSettings.ConfluenceDocs}'`
    );
    return data;
  } catch (err) {
    console.error(err);
    throw err;
  }
}
