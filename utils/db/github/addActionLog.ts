import executeRequest from "../azuredb";

export default async function addActionLog({
  randomWords,
  github,
  jira,
  slack,
  notion,
  linear,
  asana,
  textToWrite,
  businessLogicSummary,
  owner,
  repo,
  number,
  payload,
  count,
  watermelon_user,
}): Promise<any> {
  function isEmpty(value) {
    // Check for undefined or null
    if (value === null || value === undefined) return true;

    // Check for empty string or empty array
    if (typeof value === "string" || Array.isArray(value))
      return value.length === 0;

    // Check for empty object
    if (typeof value === "object") return Object.keys(value).length === 0;

    return false;
  }

  function stringifyAndEscape(value) {
    if (isEmpty(value)) return "''"; // or return whatever you want in the case of empty values

    return `'${JSON.stringify(value).replace(/'/g, "''")}'`;
  }

  try {
    const saveLog = `EXEC dbo.create_gh_action_log 
    @randomWords='${randomWords.join(" ")}', 
    @github_response='${JSON.stringify(github)}', 
    @jira_response='${stringifyAndEscape(jira)}', 
    @slack_response='${stringifyAndEscape(slack)}', 
    @notion_response='${stringifyAndEscape(notion)}', 
    @linear_response='${stringifyAndEscape(linear)}', 
    @asana_response='${stringifyAndEscape(asana)}',
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
