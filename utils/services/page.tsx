import Link from "next/link";
import TimeToRedirect from "../../../components/redirect";

export default function ConnectedService({
  serviceName,
  displayName,
  teamName,
  avatarUrl,
  loginArray,
  error,
}) {
  return (
    <div className="Box" style={{ maxWidth: "100ch", margin: "auto" }}>
      <div className="Subhead">
        <h2 className="Subhead-heading px-2">
          You have logged in with {serviceName} as {displayName} in the team{" "}
          {teamName}
        </h2>
      </div>
      <img
        src={avatarUrl}
        alt="linear user image"
        className="avatar avatar-8"
      />
      <div>
        <TimeToRedirect url={"/"} />
        <p>
          If you are not redirected, please click <Link href="/">here</Link>
        </p>
        {loginArray.length ? (
          <div>
            <h3>You might also be interested: </h3>
            {loginArray.map((login) => (
              <>{login}</>
            ))}
          </div>
        ) : null}
        {error && <p>{error}</p>}
      </div>
    </div>
  );
}
