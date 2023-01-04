import Link from "next/link";

const BitbucketLoginLink = ({ userEmail }) => (
  <div className="Box">
    <Link
      href={`https://bitbucket.org/site/oauth2/authorize?client_id=qvxNH4EGH4sjZysZAu&response_type=code`}
      className="button block">

      <div className="Box d-flex flex-items-center flex-justify-start p-2">
        <img className="avatar avatar-8" src="/logos/bitbucket.svg" />
        <div className="p-2">
          <h2>Login to Bitbucket</h2>
          <p>View your Assigned Issues and Relevant Pull Requests</p>
        </div>
      </div>

    </Link>
  </div>
);
export default BitbucketLoginLink;
