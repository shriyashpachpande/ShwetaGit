import mongoose from "mongoose";

const userSubscriptionSchema = new mongoose.Schema({
  userId: { type: String, required: true, unique: true },
  customerId: { type: String, required: true },
});

export default mongoose.model("UserSubscription", userSubscriptionSchema);
