import mongoose from 'mongoose';
const ClauseSchema = new mongoose.Schema({ id: String, text: String }, { _id: false });
const PolicySchema = new mongoose.Schema({
  policyName: String,
  filename: String,
  mimeType: String,
  clauses: [ClauseSchema],
  rawText: String
}, { timestamps: true });
export default mongoose.model('Policy', PolicySchema);
