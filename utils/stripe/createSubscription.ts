import Stripe from "stripe";

const stripe = new Stripe(
  process.env.NEXT_PUBLIC_STRIPE_TEST_SECRET_KEY,
  {
    apiVersion: null,
  }
);

export default async function createStripeSubscription(paymentAmount, paymentInterval) {
  const lowerCasePaymentInterval = paymentInterval.toLowerCase();
  console.log("createSubscription.ts - lowerCasePaymentInterval", lowerCasePaymentInterval);
  stripe.products
    .create({
      name: `$${paymentAmount} ${lowerCasePaymentInterval} Subscription`,
      description: `$${paymentAmount} ${paymentInterval} subscription`,
    })
    .then((product) => {
      console.log("createSubscription.ts - product", product);
      stripe.prices
        .create({
          unit_amount: paymentAmount * 100, // this unit is cents, not dollars
          currency: "usd",
          recurring: {
            interval: lowerCasePaymentInterval,
          },
          product: product.id,
        })
        .then((price) => {
          console.log(
            "Success! Here is your starter subscription product id: " +
              product.id
          );
          console.log(
            "Success! Here is your premium subscription price id: " + price.id
          );
        }).catch((err) => {
          console.log("createSubscription.ts - err", err);
        });
    });
}
