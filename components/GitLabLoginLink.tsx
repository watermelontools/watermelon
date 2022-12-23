import Link from "next/link";

const GitLabLoginLink = ({ userEmail }) => (
  <div>
    <Link
      href={`https://gitlab.example.com/oauth/authorize?client_id=399843bda5477334e51f2aa88d96dfff694ce2da3130dabc685e34e1aa55b8f3&redirect_uri=https://app.watermelontools.com/gitlab&response_type=code&state=${userEmail}&scope=api,read_api,read_user,read_repository,write_repository,read_registry,openid,profile,email`}
      className="button block"
    >
      <div className="Box d-flex flex-items-center flex-justify-start p-2">
        <img className="avatar avatar-8" src="/logos/gitlab.svg" />
        <div className="p-2">
          <h2>Login to GitLab</h2>
          <p>View your Assigned Issues and Relevant Pull Requests</p>
        </div>
      </div>
    </Link>
  </div>
);
export default GitLabLoginLink;
