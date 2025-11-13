
import mongoose from 'mongoose';

const RowSchema = new mongoose.Schema({
    reportFile: String,
    name: String,
    age: Number,
    diagnosis: String,
    treatment: String,
    covered: String,
    policyClause: String,
    limit: String,
    confidence: Number,
    explain: String,
}, { _id: false });

const MultiAnalysisSchema = new mongoose.Schema({
    policyId: { type: mongoose.Schema.Types.ObjectId, ref: 'MultiPolicy' },
    reportIds: [{ type: mongoose.Schema.Types.ObjectId, ref: 'MultiReport' }],
    rows: [RowSchema],
}, { timestamps: true });

export default mongoose.model('MultiAnalysis', MultiAnalysisSchema, 'multi-analysis');