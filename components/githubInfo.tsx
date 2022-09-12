const GitHubInfo = (githubUserData) => (
  <div className="Box">
    <div className="Subhead">
      <h2 className="Subhead-heading">GitHub</h2>
    </div>
    <h2>{githubUserData.name}</h2>
    <h3>{githubUserData.login}</h3>
    <img
      className="avatar"
      src={githubUserData.avatar_url}
      width="48"
      height="48"
    />
  </div>
);
export default GitHubInfo;
