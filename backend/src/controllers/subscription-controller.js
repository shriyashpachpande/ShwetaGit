// src/controllers/subscription-controller.js
import stripe, { findOrCreateCustomer, createCheckoutSession, createBillingPortal } from "../services/stripe-service.js";
import Subscription from "../models/subscription-model.js";
import { sendSubscriptionEmail, successTemplate } from "../services/email-service.js";
import { daysLeft } from "../utils/date.js";

/**
 * POST /api/subscription/create
 * body: { priceId, successUrl?, cancelUrl? }
 * auth: Clerk (requireAuth)
 */
export const create = async (req, res) => {
  try {
    const { priceId, successUrl, cancelUrl } = req.body;
    if (!priceId) return res.status(400).json({ error: "priceId required" });

    // 1) Stripe customer for this user
    const customer = await findOrCreateCustomer({
      email: req.auth.email,
      clerkUserId: req.auth.clerkUserId,
    });

    // 2) Create checkout session
    const session = await createCheckoutSession({
      priceId,
      customerId: customer.id,
      successUrl,
      cancelUrl,
    });

    return res.json({ url: session.url });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: "Failed to create session" });
  }
};

/**
 * GET /api/subscription/me
 * returns current subscription status + daysLeft
 */
export const me = async (req, res) => {
  try {
    const sub = await Subscription.findOne({
      $or: [{ clerkUserId: req.auth.clerkUserId }, { email: req.auth.email }],
    }).sort({ updatedAt: -1 });

    if (!sub) return res.json({ active: false });

    return res.json({
      active: ["active", "trialing", "past_due"].includes(sub.status),
      status: sub.status,
      plan: sub.planNickname,
      priceId: sub.priceId,
      currentPeriodEnd: sub.currentPeriodEnd,
      daysLeft: daysLeft(sub.currentPeriodEnd),
      stripeCustomerId: sub.stripeCustomerId,
      stripeSubscriptionId: sub.stripeSubscriptionId,
    });
  } catch (e) {
    res.status(500).json({ error: "Failed to fetch subscription" });
  }
};

/**
 * POST /api/subscription/portal
 * body: { returnUrl }
 */
export const portal = async (req, res) => {
  try {
    // find by user
    const record = await Subscription.findOne({
      $or: [{ clerkUserId: req.auth.clerkUserId }, { email: req.auth.email }],
    }).sort({ updatedAt: -1 });

    if (!record?.stripeCustomerId)
      return res.status(404).json({ error: "Customer not found" });

    const session = await createBillingPortal({
      customerId: record.stripeCustomerId,
      returnUrl: req.body?.returnUrl,
    });

    res.json({ url: session.url });
  } catch (e) {
    res.status(500).json({ error: "Failed to create portal session" });
  }
};

/**
 * POST /api/subscription/webhook  (raw body)
 */
export const webhook = (req, res) => {
  const sig = req.headers["stripe-signature"];
  let event;

  try {
    event = stripe.webhooks.constructEvent(
      req.body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (err) {
    console.error("⚠️  Webhook signature verification failed.", err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  // handle events
  switch (event.type) {
    case "checkout.session.completed": {
      const sess = event.data.object;
      // session.mode === 'subscription'
      // fetch subscription to read details
      stripe.subscriptions
        .retrieve(sess.subscription)
        .then(async (subscription) => {
          const cust = await stripe.customers.retrieve(sess.customer);
          const price = subscription.items.data[0].price;
          const doc = await Subscription.findOneAndUpdate(
            { stripeSubscriptionId: subscription.id },
            {
              clerkUserId: cust?.metadata?.clerkUserId ?? null,
              email: cust?.email ?? null,
              stripeCustomerId: subscription.customer,
              stripeSubscriptionId: subscription.id,
              status: subscription.status,
              priceId: price.id,
              planNickname: price.nickname || price.product,
              currentPeriodStart: new Date(subscription.current_period_start * 1000),
              currentPeriodEnd: new Date(subscription.current_period_end * 1000),
              latestInvoiceId: subscription.latest_invoice,
              cancelAtPeriodEnd: subscription.cancel_at_period_end,
            },
            { upsert: true, new: true }
          );

          // email success
          const currency = price.currency?.toUpperCase();
          const amount = (price.unit_amount / 100).toFixed(2);
          await sendSubscriptionEmail({
            to: doc.email,
            subject: "Payment Successful – Subscription Activated",
            html: successTemplate({
              name: null,
              plan: doc.planNickname || "Your plan",
              amount: `${currency} ${amount}`,
              periodEnd: doc.currentPeriodEnd,
            }),
          });
        })
        .catch(console.error);
      break;
    }

    case "customer.subscription.updated":
    case "customer.subscription.created":
    case "customer.subscription.deleted": {
      const sub = event.data.object;
      const price = sub.items.data[0].price;
      Subscription.findOneAndUpdate(
        { stripeSubscriptionId: sub.id },
        {
          stripeCustomerId: sub.customer,
          status: sub.status,
          priceId: price.id,
          planNickname: price.nickname || price.product,
          currentPeriodStart: new Date(sub.current_period_start * 1000),
          currentPeriodEnd: new Date(sub.current_period_end * 1000),
          cancelAtPeriodEnd: sub.cancel_at_period_end,
          latestInvoiceId: sub.latest_invoice,
        },
        { upsert: true }
      ).exec();
      break;
    }

    case "invoice.payment_succeeded":
    case "invoice.payment_failed": {
      // optional: send receipts / failure notice
      break;
    }

    default:
      // ignore
      break;
  }

  res.json({ received: true });
};
