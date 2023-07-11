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
    @github_response='${JSON.stringify(ghValue).replace(/'/g, "''")}', 
    @jira_response='${JSON.stringify(jiraValue).replace(/'/g, "''")}', 
    @slack_response='${JSON.stringify(slackValue).replace(/'/g, "''")}', 
    @notion_response='${JSON.stringify(notionValue).replace(/'/g, "''")}', 
    @linear_response='${JSON.stringify(linearValue).replace(/'/g, "''")}', 
    @markdown='${textToWrite}', 
    @GPT_summary='${businessLogicSummary}', 
    @github_owner='${owner}', 
    @github_repo='${repo}', 
    @github_issue_number=${number}, 
    @github_event_type='${payload.action}', 
    @userTeam=${count.id}, 
    @watermelon_user='${watermelon_user}'`;
    return await executeRequest(saveLog);
  } catch (err) {
    console.error(err);
    return err;
  }
}
