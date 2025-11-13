import mongoose from 'mongoose';

const govtSchemeSchema = new mongoose.Schema({
  schemeName: { type: String, required: true },
  coveredDiseases: { type: [String], required: true },
  maxClaimLimit: { type: String, required: true },
  description: { type: String }
});

export default mongoose.model('GovtScheme', govtSchemeSchema);
