import mongoose from "mongoose";

const govtSchemeSchema = new mongoose.Schema({
  schemeName: { type: String, required: true },
  coveredDiseases: [String],   // Example: ["Diabetes", "Cancer"]
  maxClaimLimit: String,
  description: String
});

export default mongoose.model("GovtScheme", govtSchemeSchema);
