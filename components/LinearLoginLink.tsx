import Link from "next/link";

const LinearLoginLink = ({ userEmail }) => (
  <div className="Box" style={{ height: "100%" }}>
    <div className="Subhead px-3 pt-2">
      <h2 className="Subhead-heading d-flex flex-items-center flex-justify-start">
        <img className="avatar avatar-4" src="/logos/linear.svg" />
        <span>Linear</span>
      </h2>
    </div>

    <div className="pl-3 pr-3 pt-1 pb-3" style={{ flex: 1 }}>
      <Link
        href={`https://linear.app/oauth/authorize?client_id=7247b6d23748af49ec0d7fd6cb5dae75&scope=read%20issues:create%20comments:create&redirect_uri=https://app.watermelontools.com/linear&state=${userEmail}&response_type=code&prompt=consent&actor=application`}
        className="button block"
      >
        <div className="d-flex flex-items-center">
          <img className="avatar avatar-8 mr-2" src="/logos/linear.svg" />
          <div style={{ flex: 1 }}>
            <h3>Login to Linear</h3>
            <p>Index Relevant Tickets</p>
          </div>
        </div>
      </Link>
    </div>
  </div>
);

export default LinearLoginLink;
