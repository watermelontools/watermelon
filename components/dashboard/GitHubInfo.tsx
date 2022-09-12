const GitHubInfo = (githubUserData) => (
  <div className="Box">
    <div className="Subhead">
      <h2 className="Subhead-heading">GitHub</h2>
    </div>
    <div className="d-flex flex-items-center flex-justify-start">
      <img className="avatar avatar-8" src={githubUserData.avatar_url} />
      <div className="p-3">
        <h3>{githubUserData.name}</h3>
        <p className="text-light">{githubUserData.email}</p>
        <p className="text-light">{githubUserData.company}</p>
      </div>
    </div>
  </div>
);
export default GitHubInfo;
