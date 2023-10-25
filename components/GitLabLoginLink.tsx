import Link from "next/link";

const GitLabLoginLink = ({ userEmail }) => (
  <div className="Box" style={{ height: "100%" }}>
    <div className="Subhead px-3 pt-2">
      <h2 className="Subhead-heading d-flex flex-items-center flex-justify-start">
        <img 
          className="avatar avatar-4"
          src="/logos/gitlab.svg" 
        />
        <span>GitLab</span>
      </h2>
    </div>

    <div className="pl-3 pr-3 pt-1 pb-3" style={{ flex: 1 }}>
      <Link
        href={`https://gitlab.com/oauth/authorize?client_id=399843bda5477334e51f2aa88d96dfff694ce2da3130dabc685e34e1aa55b8f3&redirect_uri=https://app.watermelontools.com/gitlab&response_type=code&state=${userEmail}&scope=api%20read_api%20read_user%20read_repository%20write_repository%20read_registry%20openid%20profile%20email`}
        className="button block"
      >
        <div className="d-flex flex-items-center">
          <img className="avatar avatar-8 mr-2" src="/logos/gitlab.svg" />
          <div style={{ flex: 1 }}>
            <h3>Login to GitLab</h3>
            <p>View your Assigned Issues and Relevant Pull Requests</p>
          </div>
        </div>
      </Link>
    </div>
  </div>
);


export default GitLabLoginLink;
