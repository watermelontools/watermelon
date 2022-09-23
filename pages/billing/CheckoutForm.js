import React, { useEffect, useState } from "react";
import {
  useStripe,
  useElements,
  PaymentElement,
} from "@stripe/react-stripe-js";
import createStripeSubscription from "../../utils/stripe/createSubscription";

const CheckoutForm = () => {
  const stripe = useStripe();
  const elements = useElements();

  const [numberOfSeats, setNumberOfSeats] = useState(5);
  const [subscriptionPrice, setSubscriptionPrice] = useState(50);
  const [interval, setInterval] = useState("Monthly");

  const [errorMessage, setErrorMessage] = useState(null);

  useEffect(() => {
    if (interval === "Monthly") {
      const calculatedPrice = numberOfSeats * 10;
      setSubscriptionPrice(calculatedPrice);
    } else if (interval === "Yearly") {
      const calculatedPrice = numberOfSeats * 10 * 12 * 0.8;
      setSubscriptionPrice(calculatedPrice);
    }
  }, [numberOfSeats, interval]);

  const handleSubmit = async (event) => {
    // We don't want to let default form submission happen here,
    // which would refresh the page.
    event.preventDefault();

    if (!stripe || !elements) {
      // Stripe.js has not yet loaded.
      // Make sure to disable form submission until Stripe.js has loaded.
      return;
    }

    const { error } = await stripe.confirmPayment({
      //`Elements` instance that was used to create the Payment Element
      elements,
      confirmParams: {
        return_url: "https://example.com/order/123/complete",
      },
    });

    if (error) {
      // This point will only be reached if there is an immediate error when
      // confirming the payment. Show error to your customer (for example, payment
      // details incomplete)
      setErrorMessage(error.message);
    } else {
      // Your customer will be redirected to your `return_url`. For some payment
      // methods like iDEAL, your customer will be redirected to an intermediate
      // site first to authorize the payment, then redirected to the `return_url`.
      
      console.log("Payment confirmed!");
      await createStripeSubscription(subscriptionPrice, interval);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <label htmlFor="number-of-seats">Number of seats</label>
      <br />
      <input
        required
        type="number"
        className="form-control mb-2 mr-2"
        id="exampleFormControlSelect1"
        placeholder="Number of seats"
        value={numberOfSeats}
        onChange={(e) => {
          setNumberOfSeats(e.target.value);
        }}
      />
      <select
        required
        className="form-control mb-2"
        id="exampleFormControlSelect1"
        value={interval}
        onChange={(e) => {
          setInterval(e.target.value);
        }}
      >
        <option value="Monthly">Monthly</option>
        <option value="Yearly">Yearly</option>
      </select>
      <br />
      <p className="text-danger">
        {interval} subscription price: ${subscriptionPrice}
      </p>
      <input
        required
        label="Number of seats"
        type="text"
        className="form-control mb-2 mr-2"
        id="exampleFormControlSelect1"
        placeholder="Admin First Name"
      />
      <input
        required
        label="Number of seats"
        type="text"
        className="form-control mb-2"
        id="exampleFormControlSelect1"
        placeholder="Admin Last Name"
      />
      <PaymentElement />
      <br />
      <div className="d-flex flex-items-center flex-justify-center">
        <button className="btn btn-primary" id="checkout-and-portal-button" type="submit" disabled={!stripe}>
          Purchase
        </button>
      </div>
      {errorMessage && <div>{errorMessage}</div>}
    </form>
  );
};

export default CheckoutForm;
