import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import CheckoutForm from "./CheckoutForm";

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_TEST_PUBLIC_KEY);

function BillingPage() {
  // const paymentIntentClientSecret = await getPaymentIntent("1000");

  const options = {
    // passing the client secret obtained from the server
    clientSecret: "pi_3LkbR2CM8rWyG1fM0I9GrW3i_secret_rRdNOYCIuCD6Ky6CctY9dtUob",
      

    appearance: {
      theme: "night",
      labels: "floating",

      variables: {
        colorPrimary: "#79c0ff",
        colorBackground: "#0d1117",
        colorText: "#c9d1d9",
        colorDanger: "#df1b41",
        fontFamily: "Ideal Sans, system-ui, sans-serif",
        fontSize: "14-px",
        spacingUnit: "2px",
        borderRadius: "4px",
      },
    },
  };

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
            Purchase your Watermelon subscription
          </h1>
          <Elements stripe={stripePromise} options={options}>
            <CheckoutForm />
          </Elements>
        </div>
      </div>
    </div>
  );
}

export default BillingPage;
