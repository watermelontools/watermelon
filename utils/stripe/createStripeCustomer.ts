import Stripe from "stripe";

const stripe = new Stripe(
  process.env.NEXT_PUBLIC_STRIPE_TEST_SECRET_KEY,
  {
    apiVersion: null,
  }
);

export default async function (customerDetails) {
    // const customer = await stripe.customers.create({
    await stripe.customers.create({
        email: customerDetails.email,
        name: customerDetails.name,
        // Is this needed? 
        // shipping: {
        //   address: {
        //     city: 'Brothers',
        //     country: 'US',
        //     line1: '27 Fredrick Ave',
        //     postal_code: '97712',
        //     state: 'CA',
        //   },
        //   name: customDetails.name,
        // },
        address: {
          city: customerDetails.city,
          country: customerDetails.country,
          line1: customerDetails.address,
          postal_code: customerDetails.zipCode,
          state: customerDetails.state,
        },
      });
}
