import Link from "next/link";

const AsanaLoginLink = ({ userEmail }) => (
  <div className="Box" style={{ height: "100%" }}>
    <div className="Subhead px-3 pt-2">
      <h2 className="Subhead-heading d-flex flex-items-center flex-justify-start">
        <img 
          className="avatar avatar-4"
          src="/logos/asana.svg" 
        />
        <span>Asana</span>
      </h2>
    </div>

    <div className="pl-3 pr-3 pt-1 pb-3" style={{ flex: 1 }}>
      <Link
        href={`https://app.asana.com/-/oauth_authorize?client_id=${process.env.ASANA_CLIENT_ID}&redirect_uri=https%3A%2F%2Fapp.watermelontools.com%2Fasana&response_type=code&state=${userEmail}`}
        className="button block"
      >
        <div className="d-flex flex-items-center">
          <img className="avatar avatar-8 mr-2" src="/logos/asana.svg" />
          <div style={{ flex: 1 }}>
            <h3>Login to Asana</h3>
            <p>View your Tasks and Stories</p>
          </div>
        </div>
      </Link>
    </div>
  </div>
);

export default AsanaLoginLink;
