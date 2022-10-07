import Stripe from "stripe";

const stripe = new Stripe(process.env.NEXT_PUBLIC_STRIPE_TEST_SECRET_KEY, {
  apiVersion: null,
});

export default async function handler(req, res) {
  try {
    // create a stripe customer and get its id
    const customerId = await stripe.customers
      .create({
        email: req.body.email,
      })
      .then((customer) => {
        return customer.id;
      });
    const priceId = "price_1LpVZKCM8rWyG1fMUfuYpk9f";
    // Create the subscription. Note we're expanding the Subscription's
    // latest invoice and that invoice's payment_intent
    // so we can pass it to the front end to confirm the payment
    const subscription = await stripe.subscriptions.create({
      customer: customerId,
      items: [
        {
          price: priceId,
          quantity: req.body.quantity,
        },
      ],
      payment_behavior: "default_incomplete",
      payment_settings: { save_default_payment_method: "on_subscription" },
      expand: ["latest_invoice.payment_intent"],
    });

    res.send({
      subscriptionId: subscription.id,
      clientSecret: subscription.latest_invoice.payment_intent.client_secret,
    });
  } catch (error) {
    return res.status(400).send({ error: { message: error.message } });
  }
}
