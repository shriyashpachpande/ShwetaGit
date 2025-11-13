import mongoose from 'mongoose';

const ClauseSchema = new mongoose.Schema({
    id: String,
    text: String,
    type: { type: String, enum: ['inclusion', 'exclusion', 'limit', 'waiting'], default: 'inclusion' },
    limit: { type: String, default: null },
}, { _id: false });

const MultiPolicySchema = new mongoose.Schema({
    filename: String,
    path: String,
    uploadedAt: { type: Date, default: Date.now },
    rawText: String,
    clauses: [ClauseSchema],
}, { timestamps: true });

export default mongoose.model('MultiPolicy', MultiPolicySchema, 'multi-policies');