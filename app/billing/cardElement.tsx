"use client";

import { Elements } from "@stripe/react-stripe-js";
import CheckoutForm from "./CheckoutForm";
import { loadStripe, StripeElementsOptions } from "@stripe/stripe-js";
import { useEffect, useState } from "react";
import { signIn, useSession } from "next-auth/react";

export default function CardElement() {
  const { status, data } = useSession({
    required: true,
    onUnauthenticated() {
      signIn();
    },
  });
  let promptNumber = window.prompt("Number of seats") || 2;
  const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY!);
  const [clientSecret, setClientSecret] = useState<string | undefined>("");
  const [userEmail, setUserEmail] = useState<string | undefined | null>(null);

  useEffect(() => {
    setUserEmail(data?.user?.email);
  }, [data]);
  const fetchClientSecret = async () => {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/stripe/createSubscription`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          quantity: promptNumber,
          email: userEmail,
        }),
      }
    );
    const { clientSecret } = await response.json();
    setClientSecret(clientSecret);
  };
  useEffect(() => {
    fetchClientSecret();
  }, [promptNumber]);
  const options: StripeElementsOptions = {
    clientSecret,
    loader: "auto",
    appearance: {
      theme: "night",
      labels: "floating",

      variables: {
        colorPrimary: "#79c0ff",
        colorBackground: "#0d1117",
        colorText: "#c9d1d9",
        colorDanger: "#df1b41",
        fontFamily: "Ideal Sans, system-ui, sans-serif",
        spacingUnit: "2px",
        borderRadius: "4px",
      },
    },
  };
  return (
    <div>
      <p>
        You are about to purchase {promptNumber}
        {promptNumber === 1 ? " seat " : " seats "}
        for ${+promptNumber * 16} per month
      </p>
      {clientSecret && (
        <Elements stripe={stripePromise} options={options}>
          {promptNumber ? <CheckoutForm numberOfSeats={promptNumber} /> : null}
        </Elements>
      )}
    </div>
  );
}
