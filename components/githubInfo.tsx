const GitHubInfo = (githubUserData) => (
  <div>
    <h1>GitHub</h1>
    <h2>{githubUserData.name}</h2>
    <h3>{githubUserData.login}</h3>
    <img src={githubUserData.avatar_url} />
  </div>
);
export default GitHubInfo;
