// Set your secret key. Remember to switch to your live secret key in production.
// See your keys here: https://dashboard.stripe.com/apikeys
const stripe = require("stripe")(process.env.STRIPE_TEST_SECRET_KEY);

export default async function getPaymentIntent(paymentAmount): Promise<any> {
  const paymentIntent = await stripe.paymentIntents.create({
    amount: paymentAmount,
    currency: "usd",
    automatic_payment_methods: { enabled: true },
  });

  return paymentIntent.client_secret;
}
