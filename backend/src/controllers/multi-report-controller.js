import path from 'path';
import fs from 'fs';
import MultiReport from '../models/multi-report-model.js';
import { extractTxtFromPdf, extractTxtFromDoc, extractTxtFromTxt } from '../services/text-extract-service.js';
import { ocrImageOrScannedPdf } from '../services/ocr-service.js';
import { isAllowedReportMime } from '../utils/file-type-guard.js';

const guessIfScannedPdf = (text) => !text || text.length < 50;


function extractMeta(text = '') {
  const src = String(text || '');

  // 1) Name via label
  let name;
  const nameLabel = src.match(/(?:patient\s*(?:full\s*)?name|pt\s*name|name)\s*[:：-]\s*([A-Za-z .]{2,120})/i);
  if (nameLabel) {
    name = nameLabel[1].trim();
  }

  // 2) Age: ASCII/Unicode colon + hyphen variants
  let age;
  const ageDirect = src.match(/\bage[^\S\r\n]*[:：-]?[^\S\r\n]*([0-9]{1,3})\b/i);
  const ageLoose = src.match(/\b([0-9]{1,3})\s*(yrs?|years?)\b/i);
  if (ageDirect) age = Number(ageDirect[1]);
  else if (ageLoose) age = Number(ageLoose[1]);
  if (!Number.isFinite(age)) age = undefined;

  // 3) Diagnosis/Treatment from labels (groups!)
  const diagLabel = src.match(/(diagnosis|diagnoses|dx|impression)\s*[:：-]\s*([^\n\r]+)/i);
  let diag = diagLabel ? String(diagLabel).trim() : '';
  const treatLabel = src.match(/(treatment|rx|plan|management|therapy)\s*[:：-]\s*([^\n\r]+)/i);
  let treat = treatLabel ? String(treatLabel).trim() : '';

  // 4) Name fallback and tail strip (“Age …”)
  if (!name) {
    const honor = src.match(/\b(Mr.?|Mrs.?|Ms.?|Dr.?)\s+([A-Z][a-z]+(?:\s+[A-Z][a-z]+){0,3})\b/);
    if (honor) {
      name = `${honor[1].replace('.', '')} ${honor[2]}`.replace(/\s+/g, ' ').trim();
    }
  }
  if (!name) {
    const afterColon = src.match(/:\s*(Mr.?|Mrs.?|Ms.?|Dr.?)\s+([A-Z][a-z]+(?:\s+[A-Z][a-z]+){0,3})\b/);
    if (afterColon) {
      name = `${afterColon[1].replace('.', '')} ${afterColon[2]}`.replace(/\s+/g, ' ').trim();
    }
  }
  if (name) name = name.replace(/\sAge[^A-Za-z0-9].*$/i, '').replace(/\s+/g, ' ').trim();

  // 5) Strong fallback from “Diagnosis Notes” / “Notes”
 if (!diag) {
  const notes = src.match(/(?:primary\s+diagnosis|diagnosis\s+notes?|notes)\s*[:：-]\s*([^\n\r.]+(?:.[^\n\r.]+)?)/i);
  if (notes) diag = notes[1].trim();
}

  // 6) Heuristic diagnosis if still blank (covers Anemia/Diabetes/Hypertension/Liver)
  if (!diag) {
    const low = src.toLowerCase();
    if (/\bdiabet/i.test(low)) diag = 'Type 2 Diabetes Mellitus';
    else if (/\bhypothyroid/i.test(low)) diag = 'Hypothyroidism';
    else if (/\bhypertens/i.test(low)) diag = 'Hypertension';
    else if (/\bcholesterol|triglyc|hyperlipid/i.test(low)) diag = 'Dyslipidemia';
    else if (/\biron\s+deficiency|anemia/i.test(low)) diag = 'Iron Deficiency Anemia';
    else if (/\bgastroenteritis/i.test(low)) diag = 'Acute Gastroenteritis with Dehydration';
    else if (/\bliver\s+dysfunction|liver\s+function/i.test(low)) diag = 'Liver Dysfunction';
  }

  // 7) Heuristic treatment (meds/phrases including iron/B12/statin/lifestyle)
  if (!treat) {
  const rx = src.match(/\b(Metformin|Insulin|Amlodipine|Atorvastatin|Levothyroxine|B12\s+injections?|iron\s+supplements?|statin\s+(?:therapy|treatment)|lifestyle\s+modification|consultation|monitoring|follow[- ]?up|diet|rehydration)[^\n\r,;]*/i);
  if (rx) treat = rx[0].trim();
}

  // 8) Hard cleanup for OCR-merged duplicates and labels (ASCII + Unicode colon)
  const scrub = (s) => String(s || '')
    .replace(/\b(Diagnosis|Diagnoses|DX)\s*[:：-]\s*/ig, '')
    .replace(/\b(Treatment|Rx|Plan|Management|Therapy)\s*[:：-]\s*/ig, '')
    .replace(/,\s*(Diagnosis|Diagnoses|DX)\b.$/i, '')
    .replace(/,\s(Treatment|Rx|Plan|Management|Therapy)\b.$/i, '')
    .replace(/[.,;:]\s[.,;:]+/g, '.') // collapse double punctuation
    .replace(/\s+/g, ' ')
    .trim();

  const dropMerged = (s) => s
    .replace(/,\s*(Diagnosis|Diagnoses|DX)\b.$/i, '')
    .replace(/,\s(Treatment|Rx|Plan|Management|Therapy)\b.*$/i, '')
    .trim();

  let diagClean = dropMerged(scrub(diag));
  let treatClean = dropMerged(scrub(treat));

  // 9) Final arrays
  const diagnoses = diagClean ? [diagClean] : [];
  const treatments = treatClean ? [treatClean] : [];

  return { name: name || undefined, age, diagnoses, treatments };
}










export const uploadReport = async (req, res, next) => {
    try {
        const f = req.file;
        if (!f) return res.status(400).json({ error: 'No file' });
        if (!isAllowedReportMime(f.mimetype))
            return res.status(400).json({ error: 'Unsupported type' });
        let text = '';
        if (f.mimetype === 'application/pdf') {
            text = await extractTxtFromPdf(f.path);
            if (guessIfScannedPdf(text)) {
                const ocr = await ocrImageOrScannedPdf(f.path);
                if ((ocr?.length || 0) > text.length) text = ocr;
            }
        } else if (f.mimetype.includes('word')) {
            text = await extractTxtFromDoc(f.path);
        } else if (f.mimetype.startsWith('image/')) {
            text = await ocrImageOrScannedPdf(f.path);
        } else if (f.mimetype === 'text/plain') {
            text = await extractTxtFromTxt(f.path);
        }

        // Debug logs (dev only)
        console.log('[EXTRACTED SAMPLE]', text.slice(0, 200).replace(/\n/g, ' ⏎ '));
        const extracted = extractMeta(text);
        console.log('[META]', extracted);

        const saved = await MultiReport.create({
            filename: f.filename,
            path: f.path,
            mimetype: f.mimetype,
            text,
            extracted,
            status: 'ready',
        });

        res.json({
            reportId: saved._id,
            filename: saved.filename,
            status: saved.status,
            extractedMeta: extracted,
        });
    } catch (e) {
        next(e);
    }
};

export const removeReport = async (req, res, next) => {
    try {
        const { id } = req.params;
        const r = await MultiReport.findById(id);
        if (!r) return res.status(404).json({ error: 'Not found' });
        try { fs.unlinkSync(r.path); } catch { }
        await r.deleteOne();
        res.json({ ok: true });
    } catch (e) { next(e); }
};