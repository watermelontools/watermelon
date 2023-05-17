import Link from "next/link";

const SlackLoginLink = ({ userEmail }) => (
  <div>
    <Link
      href={`https://slack.com/oauth/v2/authorize?client_id=2258283433764.3516691319939&scope=chat:write,chat:write.customize,incoming-webhook,channels:history,groups:history,users:read&user_scope=chat:write,channels:history,groups:history,identify,search:read,users:read&state=${userEmail}`}      className="button block"
    >
      <div className="Box d-flex flex-items-center flex-justify-start p-2">
        <img className="avatar avatar-8" src="/logos/slack.svg" />
        <div className="p-2">
          <h2>Login to Slack</h2>
          <p>View your Most Relevant Threads and Groups</p>
        </div>
      </div>
    </Link>
  </div>
);
export default SlackLoginLink;
