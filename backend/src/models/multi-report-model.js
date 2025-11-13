import mongoose from 'mongoose';

const ExtractedSchema = new mongoose.Schema({
    name: String,
    age: { type: Number, required: false },
    diagnoses: [String],
    treatments: [String],
}, { _id: false });

const MultiReportSchema = new mongoose.Schema({
    filename: String,
    path: String,
    mimetype: String,
    uploadedAt: { type: Date, default: Date.now },
    text: String,
    extracted: ExtractedSchema,
    status: { type: String, enum: ['queued', 'ready', 'error'], default: 'queued' },
}, { timestamps: true });

export default mongoose.model('MultiReport', MultiReportSchema, 'multi-reports');