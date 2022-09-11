import Link from "next/link";

const GitHubLoginLink = (userEmail) => (
  <Link
    href={`https://github.com/login/oauth/authorize?client_id=8543242e428085df968c&redirect_uri=https://app.watermelontools.com/github&state=${userEmail}&scope=repo%20user%20notifications`}
  >
    <a>Sign in with GitHub</a>
  </Link>
);
export default GitHubLoginLink;
