import mongoose from 'mongoose';
const AnalysisSchema = new mongoose.Schema({
  reportId: { type: mongoose.Schema.Types.ObjectId, ref: 'Report' },
  policyId: { type: mongoose.Schema.Types.ObjectId, ref: 'Policy' },
  decision: String,
  clauseRef: String,
  justification: String,
  confidence: String,
  resultJson: Object
}, { timestamps: true });
export default mongoose.model('Analysis', AnalysisSchema);
