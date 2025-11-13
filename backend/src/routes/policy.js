import express from 'express';
import { upload } from '../utils/uploader.js';
import Policy from '../models/Policy.js';
import { uploadToGemini, generateFromParts, partFromFile } from '../services/gemini.js';
import { extractTextSmart } from '../services/extractors.js';

const router = express.Router();

// --- same cleaners as report route ---
const stripAllFences = (s) => String(s || '')
  .replace(/^\uFEFF/, '')
  .replace(/```/g, '')
  .replace(/```+/g, '')
  .trim();

const hardClean = (s) => {
  let x = String(s || '');
  x = x.replace(/^\uFEFF/, '');
  x = x.replace(/^\s*`{3,}\s*\w*\s*/i, '');
  x = x.replace(/\s*`{3,}\s*$/i, '');
  x = x.replace(/^\s*json\s*/i, '');
  x = x.replace(/^[`]+/g, '');
  return x.trim();
};

const tinyRepair = (s) => {
  let t = String(s || '').trim();
  if (/(\\)?"+\s*$/.test(t) && !/"}\s*$/.test(t)) {
    t = t.replace(/"+\s*$/, '');
  }
  t = t.replace(/,(\s*[}\]])\s*$/m, '$1');
  return t;
};

const tryParse = (s) => { try { return JSON.parse(s); } catch { return null; } };

router.post('/upload', upload.single('file'), async (req, res) => {
  try {
    const policyName = req.body?.policyName || 'User Policy';
    const textInput = typeof req.body?.textInput === 'string' ? req.body.textInput : '';
    const userLang = typeof req.body?.language === 'string' ? req.body.language : 'en';
    const hasFile = !!req.file;
    const hasText = !!textInput && textInput.trim().length > 0;

    console.log('[policy/upload] hasFile:', hasFile, 'hasText:', hasText);

    if (hasFile && hasText) {
      return res.status(400).json({ error: 'Provide file OR text only (not both)' });
    }
    if (!hasFile && !hasText) {
      return res.status(400).json({ error: 'No file or non-empty text provided' });
    }

    let rawText = '';
    let filename = null;
    let mimeType = null;

    if (hasFile) {
      filename = req.file.filename;
      mimeType = req.file.mimetype;

      rawText = await extractTextSmart(req.file.path, mimeType);
      if (!rawText?.trim()) {
        const file = await uploadToGemini(req.file.path);
        const text = await generateFromParts([
          partFromFile(file),
          '\n\n',
          'Extract full plain text from this insurance policy.'
        ]);
        rawText = (text || '').trim();
      }

      rawText = (rawText || '').replace(/\r\n/g, '\n').trim();
      console.log('[policy/upload] rawText length:', rawText.length);

      if (!rawText) {
        return res.status(422).json({ error: 'Policy file se text read nahi hua. Dusra file try karo ya text paste karo.' });
      }
    } else {
      rawText = textInput.trim();
      if (!rawText) return res.status(400).json({ error: 'Empty text provided' });
    }

    // Strict JSON array of clauses
    const clausePrompt = `Return ONLY a JSON array (no extra text, no code fences) of objects:
[
  { "id": "<clause number or label>", "text": "<clause text>" },
  ...
]
Rules:
- Preserve existing numbering like "5.1", "4.3" when present; else generate sequential "1","2",...
- Keep each clause concise but self-contained (1-3 sentences).
- Use only the policy text. Do not guess. If unsure, return an empty array.
Translate all values into "${userLang}" language.
Do not wrap output in code fences or add the word json. Output a single JSON array only.
Policy:
"""${rawText.slice(0, 12000)}"""`;

    const rawModel = await generateFromParts([ clausePrompt ]);

    let cleaned = hardClean(stripAllFences(rawModel)).replace(/^\s*json\s*/i, '').trim();
    console.log('[policy/upload] cleaned length:', cleaned.length);

    // Parse attempts: array expected
    let clauses = tryParse(cleaned);

    if (!Array.isArray(clauses)) {
      const start = cleaned.indexOf('[');
      const end = cleaned.lastIndexOf(']');
      if (start !== -1 && end !== -1 && end > start) {
        const core = cleaned.slice(start, end + 1);
        clauses = tryParse(core) || tryParse(tinyRepair(core));
      }
    }

    if (!Array.isArray(clauses)) {
      const unquoted = cleaned
        .replace(/^"+|"+$/g, '')
        .replace(/\\"/g, '"')
        .replace(/\\n/g, '\n');
      clauses = tryParse(unquoted);
      if (!Array.isArray(clauses)) {
        const s = unquoted;
        const start2 = s.indexOf('[');
        const end2 = s.lastIndexOf(']');
        if (start2 !== -1 && end2 !== -1 && end2 > start2) {
          const core2 = s.slice(start2, end2 + 1);
          clauses = tryParse(core2) || tryParse(tinyRepair(core2));
        }
      }
    }

    if (!Array.isArray(clauses)) {
      console.error('[policy/upload] Clause parse failed. Model sample:', String(rawModel).slice(0, 400));
      return res.status(422).json({
        error: 'Policy clause extraction failed: invalid JSON. Try text mode or another file.'
      });
    }

    // minimal sanitize: ensure each has id/text string
    clauses = clauses
      .filter(c => c && typeof c === 'object')
      .map((c, i) => ({
        id: typeof c.id === 'string' && c.id.trim() ? c.id.trim() : String(i + 1),
        text: typeof c.text === 'string' ? c.text.trim() : ''
      }))
      .filter(c => c.text);

    const policyDoc = await Policy.create({
      policyName,
      filename,
      mimeType,
      rawText,
      clauses
    });

    return res.json({ ok: true, policy: policyDoc });
  } catch (e) {
    console.error(e);
    return res.status(500).json({ error: 'Policy processing failed', details: e.message });
  }
});

export default router;
