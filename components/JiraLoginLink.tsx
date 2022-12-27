import Link from "next/link";

// This conditional render is the fastest solution towards manually onboarding our first paid customers
// We will replace this with a more robust solution in the near future
// This will happen once we release the billing page, which will allow companies to sign up for a paid plan via self-serve
// Until then, we will manually add the companies and their employees to the database
const JiraLoginLink = ({ userEmail, hasPaid }) => (
  <div>
    {hasPaid ? (
      (<Link
        href={`https://auth.atlassian.com/authorize?audience=api.atlassian.com&client_id=VUngRAClu8ZE56vxXCFBocTxCTLEUQTT&scope=read:jira-user%20read:jira-work%20write:jira-work%20offline_access&redirect_uri=https://app.watermelontools.com/jira&state=${userEmail}&response_type=code&prompt=consent`}
        className="button block">

        <div className="Box d-flex flex-items-center flex-justify-start p-2">
          <img className="avatar avatar-8" src="/logos/jira.svg" />
          <div className="p-2">
            <h2>Login to Jira</h2>
            <p>View your Most Relevant Ticket and Active Tickets</p>
          </div>
        </div>

      </Link>)
    ) : (
      <Link href={`https://app.watermelontools.com/billing`}>
        <a className="button block">
          <div className="Box d-flex flex-items-center flex-justify-start p-2">
            <img className="avatar avatar-8" src="/logos/jira.svg" />
            <div className="p-2">
              <h2>Activate Jira</h2>
              <p>Upgrade your plan to index code context from Jira</p>
            </div>
          </div>
        </a>

      </Link>)
    }
  </div>
);
export default JiraLoginLink;
