import { useRouter } from "next/router";

function TeammatesInvited() {
  const router = useRouter();

  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(350px, 1fr))",
      }}
    >
      <div className="d-flex flex-items-center flex-justify-center flex-column">
        <div
          className="Box d-flex flex-items-center flex-justify-center flex-column p-4 p-6 m-6"
          style={{ maxWidth: "80ch" }}
        >
          <h1 className="h3 mb-3 f4 text-normal">
            Your team members have been invited!
          </h1>
          <p>They will receive an invitation shortly</p>
          <div className="d-flex flex-items-center flex-justify-center">
            <button
              className="btn btn-primary"
              id="checkout-and-portal-button"
              type="submit"
              onClick={() => router.push("/")}
            >
              Go to Watermelon Dashboard
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default TeammatesInvited;
