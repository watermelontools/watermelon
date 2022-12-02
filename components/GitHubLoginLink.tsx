import Link from "next/link";

const GitHubLoginLink = ({ userEmail }) => (
  <div className="Box">
    <Link
      href={`https://github.com/login/oauth/authorize?client_id=8543242e428085df968c&redirect_uri=https://app.watermelontools.com/github&state=${userEmail}&scope=repo%20user%20notifications`}
      className="button block">

      <div className="Box d-flex flex-items-center flex-justify-start p-2">
        <img className="avatar avatar-8" src="/logos/github.svg" />
        <div className="p-2">
          <h2>Login to GitHub</h2>
          <p>View your Assigned Issues and Relevant Pull Requests</p>
        </div>
      </div>

    </Link>
  </div>
);
export default GitHubLoginLink;
