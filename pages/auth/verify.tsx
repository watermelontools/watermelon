import Image from "next/image";

function verify() {
  return (
    <div
      className="d-flex flex-items-center flex-justify-center flex-column"
      style={{ height: "100vh" }}
    >
      <div
        className="Box d-flex flex-items-center flex-justify-center flex-column p-4 p-4 m-2"
        style={{ maxWidth: "80ch" }}
      >
        <h1 className="h3 mb-3 f4 text-normal">Check your email</h1>
        <p className="text-gray mb-4">
          You have received a confirmation email. Please click the link to
          finish logging in.
        </p>
        <div
          className="d-flex flex flex-justify-around flex-content-around"
          style={{ width: "100%" }}
        >
          <a className="btn btn-primary" href="gmail.com">
            Gmail
          </a>
          <a className="btn btn-primary" href="outlook.com">
            Outlook
          </a>
          <a className="btn btn-primary" href="yahoo.com">
            Yahoo
          </a>
        </div>
      </div>

      <a
        href="https://github.com/marketplace/actions/watermelon-context-action"
        target="_blank"
      >
        <div
          className="Box d-flex flex-items-center flex-justify-center flex-column p-4 p-4 m-2"
          style={{ maxWidth: "80ch" }}
        >
          <h2 className="h3 mb-3 f4 text-normal">Try our GitHub Action</h2>
          <p className="text-gray mb-4">
            Connect all your services to view context on each PR.
          </p>
        </div>
      </a>
    </div>
  );
}

export default verify;
