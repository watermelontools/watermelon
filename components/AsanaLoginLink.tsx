import Link from "next/link";

const AsanaLoginLink = ({ userEmail }) => (
  <div className="Box">
    <Link
      href={`https://app.asana.com/-/oauth_authorize?client_id=${process.env.ASANA_CLIENT_ID}&redirect_uri=https%3A%2F%2Fapp.watermelontools.com%2Fasana&response_type=code&state=${userEmail}`}
      className="button block"
    >
      <div className="Box d-flex flex-items-center flex-justify-start p-2">
        <img className="avatar avatar-8" src="/logos/asana.svg" />
        <div className="p-2">
          <h2>Login to Asana</h2>
          <p>View your Tasks and Stories</p>
        </div>
      </div>
    </Link>
  </div>
);
export default AsanaLoginLink;
