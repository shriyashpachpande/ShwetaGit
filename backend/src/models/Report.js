// import mongoose from 'mongoose';
// const ReportSchema = new mongoose.Schema({
//   filename: String,
//   mimeType: String,
//   rawText: { type: String, required: true },
//   diagnosis: String,
//   severity: String,
//   treatment: String,
//   description: String,
//    summary: String
// }, { timestamps: true });
// export default mongoose.model('Report', ReportSchema);












import mongoose from 'mongoose';

const ReportSchema = new mongoose.Schema({
  filename: String,
  mimeType: String,
  rawText: String,

  diagnosis: String,
  severity: { type: String, default: 'Unknown' },
  treatment: String,
  description: String,
  summary: String,

  panels: { type: Object, default: {} },  // ← new
}, { timestamps: true });

export default mongoose.model('Report', ReportSchema);
