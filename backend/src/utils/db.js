import UserSubscription from "../models/userSubscription.js";

import mongoose from "mongoose";
export async function getCustomerIdForUser(userId) {
  const userSub = await UserSubscription.findOne({ userId });
  return userSub ? userSub.customerId : null;
}



export const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("✅ MongoDB connected");
  } catch (err) {
    console.error("❌ MongoDB connection failed:", err.message);
    process.exit(1);
  }
};
