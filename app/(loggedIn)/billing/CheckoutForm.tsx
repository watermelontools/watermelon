import React, { useEffect, useState } from "react";
import {
  useStripe,
  useElements,
  PaymentElement,
} from "@stripe/react-stripe-js";
import dynamic from "next/dynamic";

const CheckoutForm = ({ numberOfSeats }) => {
  const stripe = useStripe();
  const elements = useElements();
  const [errorMessage, setErrorMessage] = useState<string | null | undefined>(
    null
  );

  const handleSubmit = async (event) => {
    // We don't want to let default form submission happen here,
    // which would refresh the page.
    event.preventDefault();
    if (stripe && elements) {
      const { error } = await stripe.confirmPayment({
        //`Elements` instance that was used to create the Payment Element
        elements,
        confirmParams: {
          return_url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/billing/paymentSuccess/?seats=${numberOfSeats}`,
        },
      });

      if (error) {
        // This point will only be reached if there is an immediate error when
        // confirming the payment. Show error to your customer (for example, payment
        // details incomplete)
        setErrorMessage(error.message);
      }
    }
  };
  return (
    <form onSubmit={handleSubmit}>
      <PaymentElement />
      <br />
      <div className="d-flex flex-items-center flex-justify-center">
        <button
          className="btn btn-primary"
          id="checkout-and-portal-button"
          type="submit"
          disabled={!stripe}
        >
          Purchase
        </button>
      </div>
      {errorMessage && <div>{errorMessage}</div>}
    </form>
  );
};

export default dynamic(() => Promise.resolve(CheckoutForm), {
  ssr: false,
});
