const JiraInfo = (jiraUserData) => (
  <div className="Box">
    <div className="Subhead">
      <h2 className="Subhead-heading">Jira</h2>
    </div>
    <div className="d-flex flex-items-center flex-justify-start">
      <img className="avatar avatar-8" src={jiraUserData.user_avatar_url} />
      <div className="p-3">
        <h3>{jiraUserData.user_displayname}</h3>
        <p className="text-light">{jiraUserData.user_email} </p>
        <p className="text-light">{jiraUserData.organization}</p>
      </div>
    </div>
  </div>
);
export default JiraInfo;
