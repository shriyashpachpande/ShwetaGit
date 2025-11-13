// src/models/subscription-model.js
import mongoose from "mongoose";

const subSchema = new mongoose.Schema(
  {
    clerkUserId: { type: String, index: true },     // from Clerk
    email: { type: String, index: true },
    stripeCustomerId: { type: String, index: true },
    stripeSubscriptionId: { type: String, index: true },
    priceId: String,                 // price_xxx (monthly / yearly)
    planNickname: String,            // optional nickname from Stripe
    status: { type: String, index: true }, // active, trialing, past_due, canceled, etc.
    currentPeriodStart: Date,
    currentPeriodEnd: Date,
    cancelAtPeriodEnd: { type: Boolean, default: false },
    latestInvoiceId: String,
  },
  { timestamps: true }
);

export default mongoose.model("Subscription", subSchema);
