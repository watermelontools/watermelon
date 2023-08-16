import TimeToRedirect from "../../../components/redirect";

export default function LoadingConnectedService() {
  return (
    <div className="Box" style={{ maxWidth: "100ch", margin: "auto" }}>
      <div className="Subhead">
        <h2 className="Subhead-heading px-2">
          You have logged in with Service as Tulia in the team Watermelon
        </h2>
      </div>
      <img
        src="/logos/github.svg"
        alt="linear user image"
        className="avatar avatar-8"
      />
      <div>
        <TimeToRedirect url={"/"} />
        <p>If you are not redirected, please click here</p>
      </div>
    </div>
  );
}
