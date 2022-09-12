const JiraInfo = (jiraUserData) => (
  <div className="Box">
    <div className="Subhead">
      <h2 className="Subhead-heading">Jira</h2>
    </div>

    <div>
      <img
        className="avatar"
        src={jiraUserData.user_avatar_url}
        width="48"
        height="48"
      />
      <p>Your Jira email:{jiraUserData.user_email} </p>
      <p>Your Jira name: {jiraUserData.user_displayname}</p>
    </div>
    <span className="text-light">Logged into {jiraUserData.organization}</span>
    <img
      className="avatar"
      src={jiraUserData.org_avatar_url}
      width="48"
      height="48"
    />
  </div>
);
export default JiraInfo;
