import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import { useEffect, useState, useCallback } from "react";
import CheckoutForm from "./CheckoutForm";
import { useRouter } from "next/router";

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY);

function BillingPage() {
  const [retrievedClientSecret, setRetrievedClientSecret] = useState("");
  const router = useRouter();

  useEffect(() => {
    const { quantity, email } = router.query;

    // create async function that fetches the client secret
    const fetchClientSecret = async () => {
      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/stripe/createSubscription`, {
        method: "POST",
        headers: {  
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          quantity,
          email,
        }),
      });
      const { clientSecret } = await response.json();
      setRetrievedClientSecret(clientSecret);
    };

    fetchClientSecret();
    // const resSecret = await fetch(
    //   `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/stripe/createSubscription`,
    //   {
    //     method: "POST",
    //     headers: {
    //       "Content-Type": "application/json",
    //     },
    //     body: JSON.stringify({
    //       email: email,
    //       quantity: quantity,
    //     }),
    //   }
    // ).then((res) => res.json());
    // setRetrievedClientSecret(resSecret.clientSecret);
  }, [router.query]);

  const options = {
    clientSecret: retrievedClientSecret,

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
          {/* render if component already mounted */}
          {retrievedClientSecret && stripePromise && options && (
            <div>
              {router.isFallback ? (
                <div>Loading...</div>
              ) : (
                // @ts-ignore
                <Elements stripe={stripePromise} options={options}>
                  <CheckoutForm />
                </Elements>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default BillingPage;
