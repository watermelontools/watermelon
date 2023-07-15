import Link from "next/link";

const JiraLoginLink = ({ userEmail }) => (
  <div>
    <Link
      href={`https://auth.atlassian.com/authorize?audience=api.atlassian.com&client_id=VUngRAClu8ZE56vxXCFBocTxCTLEUQTT&scope=read%3Ajira-work%20read%3Ajira-user%20write%3Ajira-work&redirect_uri=https%3A%2F%2Fapp.watermelontools.com%2Fjira&state=${userEmail}&response_type=code&prompt=consent`}
      className="button block"
    >
      <div className="Box d-flex flex-items-center flex-justify-start p-2">
        <img className="avatar avatar-8" src="/logos/jira.svg" />
        <div className="p-2">
          <h2>Login to Jira</h2>
          <p>View your Most Relevant Ticket and Active Tickets</p>
        </div>
      </div>
    </Link>
  </div>
);
export default JiraLoginLink;
