import Link from "next/link";

const GitHubLoginLink = ({ userEmail }) => (
  <div className="Box" style={{ height: "100%" }}>
    <div className="Subhead px-3 pt-2">
      <h2 className="Subhead-heading d-flex flex-items-center flex-justify-start">
        <img 
          className="avatar avatar-4"
          src="/logos/github.svg" 
        />
        <span>GitHub</span>
      </h2>
    </div>

    <div className="pl-3 pr-3 pt-1 pb-3" style={{ flex: 1 }}>
      <Link
        href={`https://github.com/login/oauth/authorize?client_id=8543242e428085df968c&redirect_uri=https://app.watermelontools.com/github&state=${userEmail}&scope=repo%20user%20notifications`}
        className="button block"
      >
        <div className="d-flex flex-items-center">
          <img className="avatar avatar-8 mr-2" src="/logos/github.svg" />
          <div style={{ flex: 1 }}>
            <h3>Login to GitHub</h3>
            <p>Index Relevant Pull Requests</p>
          </div>
        </div>
      </Link>
    </div>
  </div>
);

export default GitHubLoginLink;
