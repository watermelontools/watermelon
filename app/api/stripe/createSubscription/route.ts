import { NextResponse } from "next/server";
import Stripe from "stripe";
import { missingParamsResponse } from "../../../../utils/api/responses";
import validateParams from "../../../../utils/api/validateParams";
import { missingParamsPosthogTracking } from "../../../../utils/api/posthogTracking";
const stripe = new Stripe(process.env.NEXT_PUBLIC_STRIPE_SECRET_KEY!, {
  apiVersion: "2022-08-01",
});

export async function POST(request: Request) {
  const req = await request.json();
  const { missingParams } = validateParams(req, ["email"]);

  if (missingParams.length > 0) {
    missingParamsPosthogTracking({ missingParams, url: request.url });
    return missingParamsResponse({ missingParams });
  }
  try {
    // create a stripe customer and get its id
    const customerId = await stripe.customers
      .create({
        email: req.email,
      })
      .then((customer) => {
        return customer.id;
      });
    const priceId = process.env.NEXT_PUBLIC_STRIPE_PRICE_ID;
    // Create the subscription. Note we're expanding the Subscription's
    // latest invoice and that invoice's payment_intent
    // so we can pass it to the front end to confirm the payment
    const subscription = await stripe.subscriptions.create({
      customer: customerId,
      items: [
        {
          price: priceId,
          quantity: req.quantity,
        },
      ],
      payment_behavior: "default_incomplete",
      payment_settings: { save_default_payment_method: "on_subscription" },
      expand: ["latest_invoice.payment_intent"],
    });

    return NextResponse.json({
      subscriptionId: subscription.id,
      // We use Stripe's Expand functionality to get the latest invoice and its payment intent
      // So we can pass it to the front end to confirm the payment
      // We're adding a type assertion here in order to get the CI/CD to pass
      clientSecret: (subscription.latest_invoice as any).payment_intent
        .client_secret,
    });
  } catch (error) {
    // get error code
    const errorCode = error.raw?.code;
    return NextResponse.json({
      error: { message: error.message, errorCode },
    });
  }
}
