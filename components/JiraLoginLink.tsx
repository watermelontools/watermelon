import Link from "next/link";

const JiraLoginLink = ({ userEmail }) => (
  <div className="Box" style={{ height: "100%" }}>
    <div className="Subhead px-3 pt-2">
      <h2 className="Subhead-heading d-flex flex-items-center flex-justify-start">
        <img className="avatar avatar-4" src="/logos/jira.svg" />
        <span>Jira</span>
      </h2>
    </div>

    <div className="pl-3 pr-3 pt-1 pb-3" style={{ flex: 1 }}>
      <Link
        href={`https://auth.atlassian.com/authorize?audience=api.atlassian.com&client_id=VUngRAClu8ZE56vxXCFBocTxCTLEUQTT&scope=offline_access%20read%3Ajira-work%20read%3Ajira-user%20write%3Ajira-work&redirect_uri=https%3A%2F%2Fapp.watermelontools.com%2Fatlassian&state=${
          "j" + userEmail
        }&response_type=code&prompt=consent`}
        className="button block"
      >
        <div className="d-flex flex-items-center">
          <img className="avatar avatar-8 mr-2" src="/logos/jira.svg" />
          <div style={{ flex: 1 }}>
            <h3>Login to Jira</h3>
            <p>Index Relevant Tickets</p>
          </div>
        </div>
      </Link>
    </div>
  </div>
);

export default JiraLoginLink;
