import { authOptions } from "../api/auth/[...nextauth]/route";
import { getServerSession } from "next-auth";
import CardElement from "./cardElement";

async function BillingPage() {
  const session = await getServerSession(authOptions);
  let userEmail = session?.user?.email;

  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(350px, 1fr))",
      }}
    >
      <div className="p-3">
        <div className="d-flex flex-items-center flex-justify-center flex-column">
          <div
            className="Box d-flex flex-items-center flex-justify-center flex-column p-4 p-6 m-6"
            style={{ maxWidth: "80ch" }}
          >
            <h1 className="h3 mb-3 f4 text-normal">
              Purchase your Watermelon subscription
            </h1>
            <CardElement userEmail={userEmail} />
          </div>
        </div>
      </div>
    </div>
  );
}

export default BillingPage;
