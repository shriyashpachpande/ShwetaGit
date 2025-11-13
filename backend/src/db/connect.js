import mongoose from "mongoose";
export default async function connectDB() {
    const uri = process.env.MONGODB_URI;
    if (!uri) throw new Error("MONGODB_URI missing");
    await mongoose.connect(uri, { autoIndex: true });
    console.log("✅ MongoDB connected");
}