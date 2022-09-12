const GitHubInfo = (githubUserData) => (
  <div className="Box">
    <div className="Subhead">
      <h2 className="Subhead-heading">GitHub</h2>
    </div>
    <h3>{githubUserData.name}</h3>
    <span className="text-light">{githubUserData.login}</span>
    <img
      className="avatar"
      src={githubUserData.avatar_url}
      width="48"
      height="48"
    />
  </div>
);
export default GitHubInfo;
