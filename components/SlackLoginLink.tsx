import Link from "next/link";

const SlackLoginLink = ({ userEmail }) => (
  <div className="Box" style={{ height: "100%" }}>
    <div className="Subhead px-3 pt-2">
      <h2 className="Subhead-heading d-flex flex-items-center flex-justify-start">
        <img className="avatar avatar-4" src="/logos/slack.svg" />
        <span>Slack</span>
      </h2>
    </div>

    <div className="pl-3 pr-3 pt-1 pb-3" style={{ flex: 1 }}>
      <Link
        href={`https://slack.com/oauth/v2/authorize?client_id=2258283433764.3516691319939&scope=chat:write,chat:write.customize,incoming-webhook,channels:history,groups:history,users:read&user_scope=chat:write,channels:history,groups:history,identify,search:read,users:read&state=${userEmail}`}
        className="button block"
      >
        <div className="d-flex flex-items-center">
          <img className="avatar avatar-8 mr-2" src="/logos/slack.svg" />
          <div style={{ flex: 1 }}>
            <h3>Login to Slack</h3>
            <p>Index Relevant Messages</p>
          </div>
        </div>
      </Link>
    </div>
  </div>
);

export default SlackLoginLink;
