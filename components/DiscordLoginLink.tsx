import Link from "next/link";

const DiscordLoginLink = ({ userEmail }) => (
  <div className="Box">
    <Link
      href={`https://discord.com/api/oauth2/authorize?client_id=1105902302839189514&permissions=26783953042448&redirect_uri=https%3A%2F%2Fapp.watermelontools.com%2Fdiscord&response_type=code&scope=identify%20email%20webhook.incoming%20relationships.read%20messages.read%20bot%20connections%20dm_channels.read&state=${userEmail}`}
      className="button block"
    >
      <div className="Box d-flex flex-items-center flex-justify-start p-2">
        <img className="avatar avatar-8" src="/logos/github.svg" />
        <div className="p-2">
          <h2>Login to Discord</h2>
          <p>View your Messages from the selected Server</p>
        </div>
      </div>
    </Link>
  </div>
);
export default DiscordLoginLink;
