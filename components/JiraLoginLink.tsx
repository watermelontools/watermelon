import JiraLogo from "/logos/jira-logo.svg";
import Link from "next/link";
const JiraLoginLink = (userEmail) => (
  <div className="Box d-flex flex-items-center flex-justify-start">
    <img className="avatar avatar-8" src={JiraLogo} />
    <Link
      href={`https://auth.atlassian.com/authorize?audience=api.atlassian.com&client_id=VUngRAClu8ZE56vxXCFBocTxCTLEUQTT&scope=read:jira-user%20read:jira-work%20write:jira-work%20offline_access&redirect_uri=https://app.watermelontools.com/jira&state=${userEmail}&response_type=code&prompt=consent`}
    >
      <a className="button block">Login to Jira</a>
    </Link>
  </div>
);
export default JiraLoginLink;
