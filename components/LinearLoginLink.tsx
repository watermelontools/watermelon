import Link from "next/link";

const LinearLoginLink = ({ userEmail }) => (
  <div>
    <Link
      href={`https://linear.app/oauth/authorize?client_id=7247b6d23748af49ec0d7fd6cb5dae75&scope=read%20issues:create%20comments:create&redirect_uri=https://app.watermelontools.com/linear&state=${userEmail}&response_type=code&prompt=consent&actor=application`}
      className="button block"
    >
      <div className="Box d-flex flex-items-center flex-justify-start p-2">
        <img className="avatar avatar-8" src="/logos/slack.svg" />
        <div className="p-2">
          <h2>Login to Linear</h2>
          <p>View your Most Relevant Tickets</p>
        </div>
      </div>
    </Link>
  </div>
);
export default LinearLoginLink;
