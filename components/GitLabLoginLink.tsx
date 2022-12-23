import Link from "next/link";

// This conditional render is the fastest solution towards manually onboarding our first paid customers
// We will replace this with a more robust solution in the near future
// This will happen once we release the billing page, which will allow companies to sign up for a paid plan via self-serve
// Until then, we will manually add the companies and their employees to the database
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
