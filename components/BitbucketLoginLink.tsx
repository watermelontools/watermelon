import Link from "next/link";

const BitbucketLoginLink = ({ userEmail }) => (
  <div className="Box" style={{ height: "100%" }}>
    <div className="Subhead px-3 pt-2">
      <h2 className="Subhead-heading d-flex flex-items-center flex-justify-start">
        <img 
          className="avatar avatar-4"
          src="/logos/bitbucket.svg" 
        />
        <span>Bitbucket</span>
      </h2>
    </div>

    <div className="pl-3 pr-3 pt-1 pb-3" style={{ flex: 1 }}>
      <Link
        href={`https://bitbucket.org/site/oauth2/authorize?client_id=qvxNH4EGH4sjZysZAu&response_type=code&state=${userEmail}`}
        className="button block"
      >
        <div className="d-flex flex-items-center">
          <img className="avatar avatar-8 mr-2" src="/logos/bitbucket.svg" />
          <div style={{ flex: 1 }}>
            <h3>Login to Bitbucket</h3>
            <p>View your Assigned Issues and Relevant Pull Requests</p>
          </div>
        </div>
      </Link>
    </div>
  </div>
);

export default BitbucketLoginLink;
