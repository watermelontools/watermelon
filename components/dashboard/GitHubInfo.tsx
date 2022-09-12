const GitHubInfo = (githubUserData) => (
  <div className="Box">
    <div className="Subhead px-3">
      <h2 className="Subhead-heading">
        GitHub {githubUserData.company ? `(${githubUserData.company})` : ""}
      </h2>
    </div>
    <div className="d-flex flex-items-center flex-justify-start py-2">
      <img className="avatar avatar-8" src={githubUserData.avatar_url} />
      <div className="px-2">
        <h3>{githubUserData.name}</h3>
        <p className="text-light">{githubUserData.email}</p>
      </div>
    </div>
  </div>
);
export default GitHubInfo;
