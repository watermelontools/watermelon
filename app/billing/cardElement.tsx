"use client";

import { Elements } from "@stripe/react-stripe-js";
import CheckoutForm from "./CheckoutForm";
import { loadStripe, StripeElementsOptions } from "@stripe/stripe-js";
import { useEffect, useState } from "react";
import { Octokit } from "octokit";
import getToken from "../../utils/db/github/getToken";

export default function CardElement({ userEmail }) {
  const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY!);
  const [clientSecret, setClientSecret] = useState<string | undefined>("");
  const [numberOfTeammates, setNumberOfTeammates] = useState(1);


  async function getOrgMemberCount() {
    let { access_token } = await getToken(userEmail);
    const octokit = new Octokit({
      auth: access_token,
    })

    const membersList = await octokit.request('GET /orgs/watermelontools/members', {
      org: 'ORG',
      headers: {
        'X-GitHub-Api-Version': '2022-11-28'
      }
    }).then(() => {
      return octokit.paginate(octokit.rest.orgs.listMembers, {
        org: 'watermelontools'
      })
    })
    setNumberOfTeammates(membersList.length);
  }


  const fetchClientSecret = async () => {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/stripe/createSubscription`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          quantity: numberOfTeammates,
          email: userEmail,
        }),
      }
    );
    const { clientSecret } = await response.json();
    setClientSecret(clientSecret);
  };

  useEffect(() => {
    getOrgMemberCount();
  }, [])

  useEffect(() => {
    fetchClientSecret();
  }, []);

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
      {clientSecret && (
        <Elements stripe={stripePromise} options={options}>
          <CheckoutForm numberOfSeats={numberOfTeammates} />
        </Elements>
      )}
    </div>
  );
}
