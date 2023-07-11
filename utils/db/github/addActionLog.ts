import executeRequest from "../azuredb";

export default async function addActionLog({
  randomWords,
  ghValue,
  jiraValue,
  slackValue,
  notionValue,
  linearValue,
  textToWrite,
  businessLogicSummary,
  owner,
  repo,
  number,
  payload,
  count,
  watermelon_user,
}): Promise<any> {
  try {
    const saveLog = `EXEC dbo.create_gh_action_log 
    @randomWords='${randomWords.join(" ")}', 
    @github_response='${JSON.stringify(ghValue)}', 
    @jira_response='${JSON.stringify(jiraValue)}', 
    @slack_response='${JSON.stringify(slackValue)}', 
    @notion_response='${JSON.stringify(notionValue)}', 
    @linear_response='${JSON.stringify(linearValue)}', 
    @markdown='${textToWrite}', 
    @GPT_summary='${businessLogicSummary}', 
    @github_owner='${owner}', 
    @github_repo='${repo}', 
    @github_issue_number=${number}, 
    @github_event_type='${payload.action}', 
    @userTeam=${count.id}, 
    @watermelon_user='${watermelon_user}'`;
    const savedLog = await executeRequest(saveLog);
    console.log("savedLog", savedLog);
    return savedLog;
  } catch (err) {
    console.error(err);
    return err;
  }
}
