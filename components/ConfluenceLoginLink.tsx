import Link from "next/link";

const ConfluenceLoginLink = ({ userEmail }) => (
  <div>
    <Link
      href={`https://auth.atlassian.com/authorize?audience=api.atlassian.com&client_id=VUngRAClu8ZE56vxXCFBocTxCTLEUQTT&scope=offline_access%20read%3Acontent%3Aconfluence%20read%3Acontent-details%3Aconfluence%20read%3Ablogpost%3Aconfluence%20read%3Acomment%3Aconfluence%20read%3Auser%3Aconfluence%20read%3Auser.property%3Aconfluence%20read%3Ainlinetask%3Aconfluence&redirect_uri=https%3A%2F%2Fapp.watermelontools.com%2Fatlassian&state=${
        "c" + userEmail
      }&response_type=code&prompt=consent`}
      className="button block"
    >
      <div className="Box d-flex flex-items-center flex-justify-start p-2">
        <img className="avatar avatar-8" src="/logos/confluence.svg" />
        <div className="p-2">
          <h2>Login to Confluence</h2>
          <p>View your Most Relevant Docs</p>
        </div>
      </div>
    </Link>
  </div>
);
export default ConfluenceLoginLink;
