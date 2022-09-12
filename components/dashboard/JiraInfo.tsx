const JiraInfo = (jiraUserData) => (
  <div className="Box">
    <div className="Subhead px-3">
      <h2 className="Subhead-heading">Jira ({jiraUserData.organization})</h2>
    </div>
    <div className="d-flex flex-items-center flex-justify-start py-2">
      <img className="avatar avatar-8" src={jiraUserData.user_avatar_url} />
      <div className="px-2">
        <h3>{jiraUserData.user_displayname}</h3>
        <p className="text-light">{jiraUserData.user_email} </p>
      </div>
    </div>
  </div>
);
export default JiraInfo;
