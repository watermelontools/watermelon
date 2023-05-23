import Link from "next/link";

const NotionLoginLink = ({ userEmail }) => (
  <div>
    <Link
      href={`https://api.notion.com/v1/oauth/authorize?client_id=e94d4cdc-25d1-45b4-b4f4-e252d6f014c4&response_type=code&owner=user&redirect_uri=https%3A%2F%2Fapp.watermelontools.com%2Fnotion&state=${userEmail}`}
      className="button block"
    >
      <div className="Box d-flex flex-items-center flex-justify-start p-2">
        <img className="avatar avatar-8" src="/logos/notion.svg" />
        <div className="p-2">
          <h2>Login to Notion</h2>
          <p>View your Most Relevant Pages and Blocks</p>
        </div>
      </div>
    </Link>
  </div>
);
export default NotionLoginLink;
