import Link from "next/link";

const ConfluenceLoginLink = ({ userEmail }) => (
  <div className="Box" style={{ height: "100%" }}>
    <div className="Subhead px-3 pt-2">
      <h2 className="Subhead-heading d-flex flex-items-center flex-justify-start">
        <img className="avatar avatar-4" src="/logos/confluence.svg" />
        <span>Confluence</span>
      </h2>
    </div>

    <div className="pl-3 pr-3 pt-1 pb-3" style={{ flex: 1 }}>
      <Link
        href={`https://auth.atlassian.com/authorize?audience=api.atlassian.com&client_id=VUngRAClu8ZE56vxXCFBocTxCTLEUQTT&scope=offline_access%20read%3Acontent%3Aconfluence%20read%3Acontent-details%3Aconfluence%20read%3Ablogpost%3Aconfluence%20read%3Acomment%3Aconfluence%20read%3Auser%3Aconfluence%20read%3Auser.property%3Aconfluence%20read%3Ainlinetask%3Aconfluence&redirect_uri=https%3A%2F%2Fapp.watermelontools.com%2Fatlassian&state=${
          "c" + userEmail
        }&response_type=code&prompt=consent`}
        className="button block"
      >
        <div className="d-flex flex-items-center">
          <img className="avatar avatar-8 mr-2" src="/logos/confluence.svg" />
          <div style={{ flex: 1 }}>
            <h3>Login to Confluence</h3>
            <p>Index Relevant Docs</p>
          </div>
        </div>
      </Link>
    </div>
  </div>
);

export default ConfluenceLoginLink;
