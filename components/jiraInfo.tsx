const JiraInfo = (jiraUserData) => (
  <div className="Box">
    <div className="Subhead">
      <h2 className="Subhead-heading">Jira</h2>
    </div>
    <div className="d-flex flex-items-center flex-justify-start">
      <img className="avatar avatar-8" src={jiraUserData.user_avatar_url} />
      <div className="p-3">
        <h3>{jiraUserData.user_displayname}</h3>
        <span className="text-light">{jiraUserData.user_email} </span>
        <span className="text-light">{jiraUserData.organization}</span>
      </div>
    </div>
  </div>
);
export default JiraInfo;
