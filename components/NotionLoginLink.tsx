import Link from "next/link";

const NotionLoginLink = ({ userEmail }) => (
  <div className="Box" style={{ height: "100%" }}>
    <div className="Subhead px-3 pt-2">
      <h2 className="Subhead-heading d-flex flex-items-center flex-justify-start">
        <img className="avatar avatar-4" src="/logos/notion.svg" />
        <span>Notion</span>
      </h2>
    </div>

    <div className="pl-3 pr-3 pt-1 pb-3" style={{ flex: 1 }}>
      <Link
        href={`https://api.notion.com/v1/oauth/authorize?client_id=e94d4cdc-25d1-45b4-b4f4-e252d6f014c4&response_type=code&owner=user&redirect_uri=https%3A%2F%2Fapp.watermelontools.com%2Fnotion&state=${userEmail}`}
        className="button block"
      >
        <div className="d-flex flex-items-center">
          <img className="avatar avatar-8 mr-2" src="/logos/notion.svg" />
          <div style={{ flex: 1 }}>
            <h3>Login to Notion</h3>
            <p>Index Relevant Blocks</p>
          </div>
        </div>
      </Link>
    </div>
  </div>
);

export default NotionLoginLink;
