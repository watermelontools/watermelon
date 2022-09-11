const JiraInfo = (jiraUserData) => (
  <div>
    <p> Logged into {jiraUserData.organization}</p>
    <img src={jiraUserData.org_avatar_url} />
    <div>
      <img src={jiraUserData.user_avatar_url} />
      <p>Your Jira email:{jiraUserData.user_email} </p>
      <p>Your Jira name: {jiraUserData.user_displayname}</p>
    </div>
  </div>
);
export default JiraInfo;
