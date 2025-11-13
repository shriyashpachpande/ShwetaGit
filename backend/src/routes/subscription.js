// import express from "express";
// import Stripe from "stripe";
// import { requireAuth } from "@clerk/express";
// import dotenv from "dotenv";
// import UserSubscription from "../models/UserSubscription.js";  // MongoDB model
// import { getCustomerIdForUser } from "../utils/db.js";         // Helper function to get customerId
// import nodemailer from "nodemailer";

// dotenv.config();
// const router = express.Router();
// const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// const PRICES = {
//   starter_monthly: "price_1S4GsfFaYPopwXSaRXfswroL",
//   pro_monthly: "price_1S4GtyFaYPopwXSaPl7LsVqI",
//   enterprise_monthly: "price_1S4GuRFaYPopwXSa8Ciw865S",
//   starter_yearly: "price_1S4H1KFaYPopwXSaxLhFuTf1",
//   pro_yearly: "price_1S4H5OFaYPopwXSaFs4qoBMj",
//   enterprise_yearly: "price_1S4H73FaYPopwXSaoKG3k0Sr",
// };

// // ✅ Create checkout session
// router.post("/create", requireAuth(), async (req, res) => {
//   try {
//     const { priceKey } = req.body;
//     const { userId } = req.auth();

//     let userSub = await UserSubscription.findOne({ userId });

//     let customer;
//     if (userSub) {
//       customer = await stripe.customers.retrieve(userSub.customerId);
//     } else {
//       customer = await stripe.customers.create();
//       await UserSubscription.create({ userId, customerId: customer.id });
//     }

//     const session = await stripe.checkout.sessions.create({
//       payment_method_types: ["card"],
//       mode: "subscription",
//       line_items: [{ price: PRICES[priceKey], quantity: 1 }],
//       success_url: "http://localhost:5173/success",
//       cancel_url: "http://localhost:5173/cancel",
//       customer: customer.id,
//       client_reference_id: userId,
//     });

//     res.json({ url: session.url });
//   } catch (err) {
//     res.status(400).json({ error: err.message });
//   }
// });

// // ✅ Get current user subscription
// router.get("/me", requireAuth(), async (req, res) => {
//   try {
//     const { userId } = req.auth();
//     const userSub = await UserSubscription.findOne({ userId });

//     if (!userSub) {
//       return res.json({ active: false });
//     }

//     const subscriptions = await stripe.subscriptions.list({
//       customer: userSub.customerId,
//       status: "all",
//       expand: ["data.default_payment_method"],
//     });

//     if (!subscriptions.data.length) {
//       return res.json({ active: false });
//     }

//     const sub = subscriptions.data[0];
//     const daysLeft = Math.ceil(
//       (sub.current_period_end * 1000 - Date.now()) / (1000 * 60 * 60 * 24)
//     );

//     res.json({
//       active: sub.status === "active" || sub.status === "trialing",
//       plan: sub.items.data[0].price.nickname || sub.items.data[0].price.id,
//       currentPeriodEnd: sub.current_period_end * 1000,
//       daysLeft,
//     });
//   } catch (err) {
//     console.error("Subscription check failed:", err);
//     res.status(500).json({ active: false, error: err.message });
//   }
// });

// // ✅ Customer billing portal
// router.post("/portal", requireAuth(), async (req, res) => {
//   try {
//     const { userId } = req.auth();
//     const userSub = await UserSubscription.findOne({ userId });

//     if (!userSub) {
//       return res.status(400).json({ error: "Customer not found" });
//     }

//     const portal = await stripe.billingPortal.sessions.create({
//       customer: userSub.customerId,
//       return_url: "http://localhost:5173/pricing",
//     });

//     res.json({ url: portal.url });
//   } catch (err) {
//     res.status(400).json({ error: err.message });
//   }
// });





// //if crash then remove this
// router.post("/webhook", express.raw({ type: "application/json" }), async (req, res) => {
//   const sig = req.headers["stripe-signature"];
//   let event;

//   try {
//     event = stripe.webhooks.constructEvent(
//       req.body,
//       sig,
//       process.env.STRIPE_WEBHOOK_SECRET
//     );
//   } catch (err) {
//     console.log("⚠️ Webhook signature verification failed.", err.message);
//     return res.status(400).send(`Webhook Error: ${err.message}`);
//   }

//   // ✅ Listen for subscription created event
//   if (event.type === "checkout.session.completed") {
//     const session = event.data.object;

//     const customerId = session.customer;
//     const email = session.customer_email;
//     const userId = session.client_reference_id;

//     console.log("✅ Checkout Session Completed!", email, userId);

//     // ✅ Send email logic yaha dalenge
//     async function sendSubscriptionConfirmationEmail(email, userId) {
//       const transporter = nodemailer.createTransport({
//         host: "smtp.example.com",  // eg. smtp.gmail.com
//         port: 587,
//         secure: false,
//         auth: {
//           user: process.env.SMTP_USER,
//           pass: process.env.SMTP_PASS,
//         },
//       });

//       const mailOptions = {
//         from: '"Your App" <noreply@yourapp.com>',
//         to: email,
//         subject: "Subscription Successful 🎉",
//         text: `Hello, your subscription has been activated. Your userId: ${userId}`,
//         html: `<p>Hello, your subscription has been activated ✅<br>UserId: <b>${userId}</b></p>`,
//       };

//       await transporter.sendMail(mailOptions);
//       console.log("📧 Confirmation email sent to", email);
//     }
//     await sendSubscriptionConfirmationEmail(email, userId);
//   }

//   res.json({ received: true });
// });











// export default router;
















// import express from "express";
// import Stripe from "stripe";
// import { requireAuth } from "@clerk/express";
// import dotenv from "dotenv";
// import UserSubscription from "../models/UserSubscription.js";
// import { getCustomerIdForUser } from "../utils/db.js";
// import nodemailer from "nodemailer";

// dotenv.config();
// const router = express.Router();
// const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// const PRICES = {
//   starter_monthly: "price_1S4GsfFaYPopwXSaRXfswroL",
//   pro_monthly: "price_1S4GtyFaYPopwXSaPl7LsVqI",
//   enterprise_monthly: "price_1S4GuRFaYPopwXSa8Ciw865S",
//   starter_yearly: "price_1S4H1KFaYPopwXSaxLhFuTf1",
//   pro_yearly: "price_1S4H5OFaYPopwXSaFs4qoBMj",
//   enterprise_yearly: "price_1S4H73FaYPopwXSaoKG3k0Sr",
// };

// // Create checkout session
// router.post("/create", requireAuth(), async (req, res) => {
//   try {
//     const { priceKey } = req.body;
//     const { userId } = req.auth();

//     let userSub = await UserSubscription.findOne({ userId });
//     let customer;

//     if (userSub) {
//       customer = await stripe.customers.retrieve(userSub.customerId);
//     } else {
//       customer = await stripe.customers.create();
//       await UserSubscription.create({ userId, customerId: customer.id });
//     }

//     const session = await stripe.checkout.sessions.create({
//       payment_method_types: ["card"],
//       mode: "subscription",
//       line_items: [{ price: PRICES[priceKey], quantity: 1 }],
//       success_url: "http://localhost:5173/success",
//       cancel_url: "http://localhost:5173/cancel",
//       customer: customer.id,
//       client_reference_id: userId,
//     });

//     res.json({ url: session.url });
//   } catch (err) {
//     res.status(400).json({ error: err.message });
//   }
// });

// // Get current user subscription
// router.get("/me", requireAuth(), async (req, res) => {
//   try {
//     const { userId } = req.auth();
//     const userSub = await UserSubscription.findOne({ userId });

//     if (!userSub) return res.json({ active: false });

//     const subscriptions = await stripe.subscriptions.list({
//       customer: userSub.customerId,
//       status: "all",
//       expand: ["data.default_payment_method"],
//     });

//     if (!subscriptions.data.length) return res.json({ active: false });

//     const sub = subscriptions.data[0];
//     const daysLeft = Math.ceil(
//       (sub.current_period_end * 1000 - Date.now()) / (1000 * 60 * 60 * 24)
//     );

//     res.json({
//       active: sub.status === "active" || sub.status === "trialing",
//       plan: sub.items.data[0].price.nickname || sub.items.data[0].price.id,
//       currentPeriodEnd: sub.current_period_end * 1000,
//       daysLeft,
//     });
//   } catch (err) {
//     console.error("Subscription check failed:", err);
//     res.status(500).json({ active: false, error: err.message });
//   }
// });

// // Customer billing portal
// router.post("/portal", requireAuth(), async (req, res) => {
//   try {
//     const { userId } = req.auth();
//     const userSub = await UserSubscription.findOne({ userId });

//     if (!userSub) return res.status(400).json({ error: "Customer not found" });

//     const portal = await stripe.billingPortal.sessions.create({
//       customer: userSub.customerId,
//       return_url: "http://localhost:5173/pricing",
//     });

//     res.json({ url: portal.url });
//   } catch (err) {
//     res.status(400).json({ error: err.message });
//   }
// });

// // Webhook to handle checkout completion + send email
// router.post("/webhook", express.raw({ type: "application/json" }), async (req, res) => {
//   const sig = req.headers["stripe-signature"];
//   let event;

//   try {
//     event = stripe.webhooks.constructEvent(
//       req.body,
//       sig,
//       process.env.STRIPE_WEBHOOK_SECRET
//     );
//   } catch (err) {
//     console.error("⚠️ Webhook signature verification failed:", err.message);
//     return res.status(400).send(`Webhook Error: ${err.message}`);
//   }

//   if (event.type === "checkout.session.completed") {
//     const session = event.data.object;
//     const customerId = session.customer;
//     const email = session.customer_email;
//     const userId = session.client_reference_id;

//     console.log("✅ Checkout Session Completed!", email, userId);

//     const transporter = nodemailer.createTransport({
//       host: "smtp.brevo.com",
//       port: 587,
//       secure: false,
//       auth: {
//         user: process.env.SMTP_USER,
//         pass: process.env.SMTP_PASS,
//       },
//     });

//     const mailOptions = {
//       from: `"Your App" <${process.env.SENDER_EMAIL}>`,
//       to: email,
//       subject: "🎉 Subscription Activated",
//       text: `Hello, your subscription is active. UserId: ${userId}`,
//       html: `<p>Hello, your subscription is now active ✅<br>UserId: <b>${userId}</b></p>`,
//     };

//     transporter.sendMail(mailOptions, (err, info) => {
//       if (err) {
//         console.error("❌ Email send failed:", err);
//       } else {
//         console.log("📧 Confirmation email sent:", info.messageId);
//       }
//     });
//   }

//   res.json({ received: true });
// });

// export default router;





























import express from "express";
import Stripe from "stripe";
import { requireAuth } from "@clerk/express";
import dotenv from "dotenv";

import nodemailer from "nodemailer";
import UserSubscription from "../models/userSubscription.js";

dotenv.config();
const router = express.Router();
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

const PRICES = {
  starter_monthly: "price_1S4GsfFaYPopwXSaRXfswroL",
  pro_monthly: "price_1S4GtyFaYPopwXSaPl7LsVqI",
  enterprise_monthly: "price_1S4GuRFaYPopwXSa8Ciw865S",
  starter_yearly: "price_1S4H1KFaYPopwXSaxLhFuTf1",
  pro_yearly: "price_1S4H5OFaYPopwXSaFs4qoBMj",
  enterprise_yearly: "price_1S4H73FaYPopwXSaoKG3k0Sr",
};

// ➤ Checkout session creation
router.post("/create", requireAuth(), async (req, res) => {
  try {
    const { priceKey } = req.body;
    const { userId } = req.auth();

    let userSub = await UserSubscription.findOne({ userId });

    let customer;
    if (userSub) {
      customer = await stripe.customers.retrieve(userSub.customerId);
    } else {
      customer = await stripe.customers.create();
      await UserSubscription.create({ userId, customerId: customer.id });
    }

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "subscription",
      line_items: [{ price: PRICES[priceKey], quantity: 1 }],
      success_url: "http://localhost:5173/pricing",
      cancel_url: "http://localhost:5173/cancel",
      customer: customer.id,
      client_reference_id: userId,
    });

    res.json({ url: session.url });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// ➤ Get user subscription status
router.get("/me", requireAuth(), async (req, res) => {
  try {
    const { userId } = req.auth();
    const userSub = await UserSubscription.findOne({ userId });

    if (!userSub) return res.json({ active: false });

    const subscriptions = await stripe.subscriptions.list({
      customer: userSub.customerId,
      status: "all",
      expand: ["data.default_payment_method"],
    });

    if (!subscriptions.data.length) return res.json({ active: false });

    const sub = subscriptions.data[0];
    const daysLeft = Math.ceil(
      (sub.current_period_end * 1000 - Date.now()) / (1000 * 60 * 60 * 24)
    );

    res.json({
      active: sub.status === "active" || sub.status === "trialing",
      plan: sub.items.data[0].price.nickname || sub.items.data[0].price.id,
      currentPeriodEnd: sub.current_period_end * 1000,
      daysLeft,
    });
  } catch (err) {
    res.status(500).json({ active: false, error: err.message });
  }
});

// ➤ Customer billing portal
router.post("/portal", requireAuth(), async (req, res) => {
  try {
    const { userId } = req.auth();
    const userSub = await UserSubscription.findOne({ userId });

    if (!userSub) return res.status(400).json({ error: "Customer not found" });

    const portal = await stripe.billingPortal.sessions.create({
      customer: userSub.customerId,
      return_url: "http://localhost:5173/pricing",
    });

    res.json({ url: portal.url });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// ➤ Webhook for checkout completion and sending email
router.post("/webhook", express.raw({ type: "application/json" }), async (req, res) => {
  const sig = req.headers["stripe-signature"];
  let event;

  try {
    event = stripe.webhooks.constructEvent(
      req.body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (err) {
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object;
    const email = session.customer_email;
    const userId = session.client_reference_id;

    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 587,
      secure: false,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const mailOptions = {
      from: `"Your App" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: "🎉 Subscription Activated",
      text: `Hello, your subscription is now active. UserId: ${userId}`,
      html: `<p>Hello, your subscription is active ✅<br>UserId: <b>${userId}</b></p>`,
    };

    transporter.sendMail(mailOptions, (err, info) => {
      if (err) {
        console.error("❌ Email sending failed:", err);
      } else {
        console.log("📧 Email sent:", info.messageId);
      }
    });
  }

  res.json({ received: true });
});

export default router;
