// src/services/stripe-service.js
import Stripe from "stripe";
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export async function findOrCreateCustomer({ email, clerkUserId }) {
  // Search by email
  const existing = await stripe.customers.search({
    query: `email:"${email}"`,
  });

  if (existing.data.length > 0) return existing.data[0];

  // create new customer with metadata linking Clerk user
  return await stripe.customers.create({
    email,
    metadata: { clerkUserId },
  });
}

export async function createCheckoutSession({ priceId, customerId, successUrl, cancelUrl }) {
  return await stripe.checkout.sessions.create({
    mode: "subscription",
    customer: customerId,
    line_items: [{ price: priceId, quantity: 1 }],
    allow_promotion_codes: true,
    success_url: successUrl || "http://localhost:3000/success?session_id={CHECKOUT_SESSION_ID}",
    cancel_url: cancelUrl || "http://localhost:3000/cancel",
  });
}

export async function createBillingPortal({ customerId, returnUrl }) {
  return await stripe.billingPortal.sessions.create({
    customer: customerId,
    return_url: returnUrl || "http://localhost:3000/account",
  });
}

export default stripe; // export raw for webhook verify, etc.
