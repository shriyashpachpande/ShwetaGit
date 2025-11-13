import MultiPolicy from '../models/multi-policy-model.js';
import { extractTxtFromPdf, extractTxtFromDoc, extractTxtFromTxt } from '../services/text-extract-service.js';
import { ocrImageOrScannedPdf } from '../services/ocr-service.js';

export const uploadPolicy = async (req, res, next) => {
    try {
        const f = req.file;
        const textInput = req.body?.text;
        let rawText = '';
        if (textInput) {
            rawText = String(textInput);
        } else if (f) {
            if (f.mimetype === 'application/pdf') {
                rawText = await extractTxtFromPdf(f.path);
                if (!rawText || rawText.length < 50) rawText = await ocrImageOrScannedPdf(f.path);
            } else if (f.mimetype.includes('word')) {
                rawText = await extractTxtFromDoc(f.path);
            } else if (f.mimetype.startsWith('image/')) {
                rawText = await ocrImageOrScannedPdf(f.path);
            } else if (f.mimetype === 'text/plain') {
                rawText = await extractTxtFromTxt(f.path);
            }
        } else {
            return res.status(400).json({ error: 'No policy file or text' });
        }

        const { parsePolicyClauses } = await import('../services/policy-parse-service.js');
        const clauses = parsePolicyClauses(rawText).map(c => ({ ...c, limit: c.limit == null ? null : String(c.limit) }));

        const saved = await MultiPolicy.create({
            filename: f?.filename || 'inline-text',
            path: f?.path || '',
            rawText,
            clauses,
        });

        res.json({ policyId: saved._id, clauses: saved.clauses });
    } catch (e) { next(e); }
};