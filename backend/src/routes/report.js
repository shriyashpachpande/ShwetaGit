// import express from 'express';
// import { upload } from '../utils/uploader.js';
// import Report from '../models/Report.js';
// import { uploadToGemini, generateFromParts, partFromFile } from '../services/gemini.js';
// import { extractTextSmart } from '../services/extractors.js';

// const router = express.Router();

// // Robust cleaners
// const stripAllFences = (s) => String(s || '')
//   .replace(/^\uFEFF/, '')               // BOM
//   // Remove all code fences (e.g., ```json, ```python, etc.)
//   .replace(/`{3,}\s*\w*\s*\n?/g, '')
//   .trim();

// const hardClean = (s) => {
//   let x = String(s || '');
//   x = x.replace(/^\uFEFF/, '');
//   // Remove leading fences like ```````python etc.
//   x = x.replace(/^\s*`{3,}\s*\w*\s*/i, '');
//   // Remove trailing closing fences
//   x = x.replace(/\s*`{3,}\s*$/i, '');
//   // Some models emit a bare 'json' token line
//   x = x.replace(/^\s*json\s*/i, '');
//   // Remove stray leading backticks
//   x = x.replace(/^[`]+/g, '');
//   return x.trim();
// };

// // Normalize LLM output -> object
// const coerceObject = (val) => {
//   if (Array.isArray(val)) return val[0] && typeof val[0] === 'object' ? val[0] : {};
//   if (typeof val === 'string') {
//     try { return JSON.parse(val); } catch { return {}; }
//   }
//   return val && typeof val === 'object' ? val : {};
// };

// // Try to repair small truncations (remove trailing comma/quote)
// const tinyRepair = (s) => {
//   let t = String(s || '').trim();
//   // If ends with an unclosed string, drop last partial line
//   if (/(\\)?"+\s*$/.test(t) && !/"}\s*$/.test(t)) {
//     t = t.replace(/"+\s*$/, '');
//   }
//   // Remove trailing dangling comma before final }
//   t = t.replace(/,(\s*[}\]])\s*$/m, '$1');
//   return t;
// };

// router.post('/upload', upload.single('file'), async (req, res) => {
//   try {
//     const textInput = typeof req.body?.textInput === 'string' ? req.body.textInput : '';
//     const hasFile = !!req.file;
//     const hasText = !!textInput && textInput.trim().length > 0;

//     console.log('[report/upload] hasFile:', hasFile, 'hasText:', hasText, 'fileKey:', req.file?.fieldname);

//     if (hasFile && hasText) {
//       return res.status(400).json({ error: 'Provide file OR text only (not both)' });
//     }
//     if (!hasFile && !hasText) {
//       return res.status(400).json({ error: 'No file or non-empty text provided' });
//     }

//     let rawText = '';
//     let filename = null;
//     let mimeType = null;

//     if (hasFile) {
//       filename = req.file.filename;
//       mimeType = req.file.mimetype;

//       // 1) Local extraction
//       rawText = await extractTextSmart(req.file.path, mimeType);

//       // 2) Fallback via Files API
//       if (!rawText?.trim()) {
//         const file = await uploadToGemini(req.file.path);
//         const text = await generateFromParts([
//           partFromFile(file),
//           '\n\n',
//           'Extract the full plain text content from this medical report.'
//         ]);
//         rawText = (text || '').trim();
//       }

//       rawText = (rawText || '').replace(/\r\n/g, '\n').trim();
//       console.log('[report/upload] rawText length:', rawText.length);

//       if (!rawText) {
//         return res.status(422).json({ error: 'File se text read nahi hua. Dusra file try karo ya text paste karo.' });
//       }
//     } else {
//       rawText = textInput.trim();
//       if (!rawText) return res.status(400).json({ error: 'Empty text provided' });
//     }

//     // Strict JSON-only prompt
//     const extractPrompt = `Return ONLY valid JSON (no extra text, no code fences).
// Keys (all strings):
// - "diagnosis"
// - "severity" (one of "Low","Medium","High","Critical","Unknown")
// - "treatment"
// - "description" (2–4 sentences)
// "summary" (around 100 words, plain text, no repetition)   
// - "rawTextPreview" (first 500 chars)

// Use only the source text. Do not guess. If unsure, set "Unknown".
// Do not wrap output in code fences or add the word json. Output a single JSON object only.
// Source:
// """${rawText.slice(0, 8000)}"""`;

//     // Get model output
//     const rawModel = await generateFromParts([extractPrompt]);

//     // Clean aggressively
//     let cleaned = hardClean(stripAllFences(rawModel));
//     cleaned = cleaned.replace(/^\s*json\s*/i, '').trim();
//     console.log('[report/upload] cleaned length:', cleaned.length);

//     // Parse attempts
//     let parsed;
//     const tryParse = (s) => {
//       try { return JSON.parse(s); } catch { return null; }
//     };

//     // A) direct
//     parsed = tryParse(cleaned);

//     // B) brace slice
//     if (!parsed) {
//       const start = cleaned.indexOf('{');
//       const end = cleaned.lastIndexOf('}');
//       if (start !== -1 && end !== -1 && end > start) {
//         const core = cleaned.slice(start, end + 1);
//         parsed = tryParse(core) || tryParse(tinyRepair(core));
//       }
//     }

//     // C) double-encoded
//     if (!parsed) {
//       const unquoted = cleaned
//         .replace(/^"+|"+$/g, '')
//         .replace(/\\"/g, '"')
//         .replace(/\\n/g, '\n');
//       parsed = tryParse(unquoted)
//         || (() => {
//           const s = unquoted;
//           const start = s.indexOf('{');
//           const end = s.lastIndexOf('}');
//           if (start !== -1 && end !== -1 && end > start) {
//             const core = s.slice(start, end + 1);
//             return tryParse(core) || tryParse(tinyRepair(core));
//           }
//           return null;
//         })();
//     }

//     if (!parsed) {
//       console.error('[report/upload] JSON parse failed after repairs. Model sample:', String(rawModel).slice(0, 400));
//       return res.status(422).json({
//         error: 'Extraction failed: model did not return valid JSON. Try text mode or another file.'
//       });
//     }

//     // Normalize to plain object
//     parsed = coerceObject(parsed);

//     // Sanitize (no guessing)
//     const norm = (v) => (typeof v === 'string' ? v.trim() : '');
//     const sev = norm(parsed.severity);
//     const ALLOWED = ['Low', 'Medium', 'High', 'Critical', 'Unknown'];

//     const doc = await Report.create({
//       filename,
//       mimeType,
//       rawText,
//       diagnosis: norm(parsed.diagnosis) || '',
//       severity: ALLOWED.includes(sev) ? sev : 'Unknown',
//       treatment: norm(parsed.treatment) || '',
//       description: norm(parsed.description) || '',
//       summary: norm(parsed.summary) || ''   // 🔥 NEW
//     });

//     return res.json({ ok: true, report: doc });
//   } catch (e) {
//     console.error(e);
//     return res.status(500).json({ error: 'Report processing failed', details: e.message });
//   }
// });

// export default router;



//---------------------------------------------------------------------------------------------------------------------------------


// import express from 'express';
// import { upload } from '../utils/uploader.js';
// import Report from '../models/Report.js';
// import { uploadToGemini, generateFromParts, partFromFile } from '../services/gemini.js';
// import { extractTextSmart } from '../services/extractors.js';

// const router = express.Router();

// // Robust cleaners
// const stripAllFences = (s) => String(s || '')
//   .replace(/^\uFEFF/, '')               // BOM
//   // Remove all code fences (e.g., ```json, ```python, etc.)
//   .replace(/`{3,}\s*\w*\s*\n?/g, '')
//   .trim();

// const hardClean = (s) => {
//   let x = String(s || '');
//   x = x.replace(/^\uFEFF/, '');
//   // Remove leading fences like ```````python etc.
//   x = x.replace(/^\s*`{3,}\s*\w*\s*/i, '');
//   // Remove trailing closing fences
//   x = x.replace(/\s*`{3,}\s*$/i, '');
//   // Some models emit a bare 'json' token line
//   x = x.replace(/^\s*json\s*/i, '');
//   // Remove stray leading backticks
//   x = x.replace(/^[`]+/g, '');
//   return x.trim();
// };

// // Normalize LLM output -> object
// const coerceObject = (val) => {
//   if (Array.isArray(val)) return val[0] && typeof val[0] === 'object' ? val[0] : {};
//   if (typeof val === 'string') {
//     try { return JSON.parse(val); } catch { return {}; }
//   }
//   return val && typeof val === 'object' ? val : {};
// };

// // Try to repair small truncations (remove trailing comma/quote)
// const tinyRepair = (s) => {
//   let t = String(s || '').trim();
//   // If ends with an unclosed string, drop last partial line
//   if (/(\\)?"+\s*$/.test(t) && !/"}\s*$/.test(t)) {
//     t = t.replace(/"+\s*$/, '');
//   }
//   // Remove trailing dangling comma before final }
//   t = t.replace(/,(\s*[}\]])\s*$/m, '$1');
//   return t;
// };

// router.post('/upload', upload.single('file'), async (req, res) => {
//   try {
//     const textInput = typeof req.body?.textInput === 'string' ? req.body.textInput : '';
//     const userLang = typeof req.body?.language === 'string' ? req.body.language : 'en';
//     const hasFile = !!req.file;
//     const hasText = !!textInput && textInput.trim().length > 0;

//     console.log('[report/upload] hasFile:', hasFile, 'hasText:', hasText, 'fileKey:', req.file?.fieldname);

//     if (hasFile && hasText) {
//       return res.status(400).json({ error: 'Provide file OR text only (not both)' });
//     }
//     if (!hasFile && !hasText) {
//       return res.status(400).json({ error: 'No file or non-empty text provided' });
//     }

//     let rawText = '';
//     let filename = null;
//     let mimeType = null;

//     if (hasFile) {
//       filename = req.file.filename;
//       mimeType = req.file.mimetype;

//       // 1) Local extraction
//       rawText = await extractTextSmart(req.file.path, mimeType);

//       // 2) Fallback via Files API
//       if (!rawText?.trim()) {
//         const file = await uploadToGemini(req.file.path);
//         const text = await generateFromParts([
//           partFromFile(file),
//           '\n\n',
//           'Extract the full plain text content from this medical report.'
//         ]);
//         rawText = (text || '').trim();
//       }

//       rawText = (rawText || '').replace(/\r\n/g, '\n').trim();
//       console.log('[report/upload] rawText length:', rawText.length);

//       if (!rawText) {
//         return res.status(422).json({ error: 'File se text read nahi hua. Dusra file try karo ya text paste karo.' });
//       }
//     } else {
//       rawText = textInput.trim();
//       if (!rawText) return res.status(400).json({ error: 'Empty text provided' });
//     }

//     // Strict JSON-only prompt
//     const extractPrompt = `Return ONLY valid JSON (no extra text, no code fences).
// Keys (all strings):
// - "diagnosis"
// - "severity" (one of "Low","Medium","High","Critical","Unknown")
// - "treatment"
// - "description" (2–4 sentences)
// "summary" (around 100 words, plain text, no repetition)   
// - "rawTextPreview" (first 500 chars)

// Use only the source text. Do not guess. If unsure, set "Unknown".
// Translate all values into "${userLang}" language.
// Do not wrap output in code fences or add the word json. Output a single JSON object only.
// Source:
// """${rawText.slice(0, 8000)}"""`;

//     // Get model output
//     const rawModel = await generateFromParts([extractPrompt]);

//     // Clean aggressively
//     let cleaned = hardClean(stripAllFences(rawModel));
//     cleaned = cleaned.replace(/^\s*json\s*/i, '').trim();
//     console.log('[report/upload] cleaned length:', cleaned.length);

//     // Parse attempts
//     let parsed;
//     const tryParse = (s) => {
//       try { return JSON.parse(s); } catch { return null; }
//     };

//     // A) direct
//     parsed = tryParse(cleaned);

//     // B) brace slice
//     if (!parsed) {
//       const start = cleaned.indexOf('{');
//       const end = cleaned.lastIndexOf('}');
//       if (start !== -1 && end !== -1 && end > start) {
//         const core = cleaned.slice(start, end + 1);
//         parsed = tryParse(core) || tryParse(tinyRepair(core));
//       }
//     }

//     // C) double-encoded
//     if (!parsed) {
//       const unquoted = cleaned
//         .replace(/^"+|"+$/g, '')
//         .replace(/\\"/g, '"')
//         .replace(/\\n/g, '\n');
//       parsed = tryParse(unquoted)
//         || (() => {
//           const s = unquoted;
//           const start = s.indexOf('{');
//           const end = s.lastIndexOf('}');
//           if (start !== -1 && end !== -1 && end > start) {
//             const core = s.slice(start, end + 1);
//             return tryParse(core) || tryParse(tinyRepair(core));
//           }
//           return null;
//         })();
//     }

//     if (!parsed) {
//       console.error('[report/upload] JSON parse failed after repairs. Model sample:', String(rawModel).slice(0, 400));
//       return res.status(422).json({
//         error: 'Extraction failed: model did not return valid JSON. Try text mode or another file.'
//       });
//     }

//     // Normalize to plain object
//     parsed = coerceObject(parsed);

//     // Sanitize (no guessing)
//     const norm = (v) => (typeof v === 'string' ? v.trim() : '');
//     const sev = norm(parsed.severity);
//     const ALLOWED = ['Low', 'Medium', 'High', 'Critical', 'Unknown'];

//     const doc = await Report.create({
//       filename,
//       mimeType,
//       rawText,
//       diagnosis: norm(parsed.diagnosis) || '',
//       severity: ALLOWED.includes(sev) ? sev : 'Unknown',
//       treatment: norm(parsed.treatment) || '',
//       description: norm(parsed.description) || '',
//       summary: norm(parsed.summary) || ''   // 🔥 NEW
//     });

//     return res.json({ ok: true, report: doc });
//   } catch (e) {
//     console.error(e);
//     return res.status(500).json({ error: 'Report processing failed', details: e.message });
//   }
// });

// export default router;





























// import express from 'express';
// import { upload } from '../utils/uploader.js';
// import Report from '../models/Report.js';
// import { uploadToGemini, generateFromParts, partFromFile } from '../services/gemini.js';
// import { extractTextSmart } from '../services/extractors.js';

// const router = express.Router();

// // cleaners
// const stripAllFences = (s) => String(s || '')
//   .replace(/^\uFEFF/, '')
//   .replace(/`{3,}\s*\w*\s*\n?/g, '')
//   .trim();

// const hardClean = (s) => {
//   let x = String(s || '');
//   x = x.replace(/^\uFEFF/, '');
//   x = x.replace(/^\s*`{3,}\s*\w*\s*/i, '');
//   x = x.replace(/\s*`{3,}\s*$/i, '');
//   x = x.replace(/^\s*json\s*/i, '');
//   x = x.replace(/^[`]+/g, '');
//   return x.trim();
// };

// const coerceObject = (val) => {
//   if (Array.isArray(val)) return val[0] && typeof val[0] === 'object' ? val[0] : {};
//   if (typeof val === 'string') { try { return JSON.parse(val); } catch { return {}; } }
//   return val && typeof val === 'object' ? val : {};
// };

// const safeParse = (s) => {
//   const tryParse = (t)=>{ try { return JSON.parse(t); } catch { return null; } };
//   let cleaned = hardClean(stripAllFences(s)).replace(/^\s*json\s*/i,'').trim();
//   let parsed = tryParse(cleaned);
//   if (parsed) return parsed;
//   const a = cleaned.indexOf('{'), b = cleaned.lastIndexOf('}');
//   if (a>-1 && b>a) {
//     const core = cleaned.slice(a,b+1);
//     return tryParse(core) || tryParse(core.replace(/,(\s*[}\]])\s*$/m,'$1'));
//   }
//   // double-encoded
//   const unq = cleaned.replace(/^"+|"+$/g,'').replace(/\\"/g,'"').replace(/\\n/g,'\n');
//   try { return JSON.parse(unq); } catch { 
//     const aa=unq.indexOf('{'), bb=unq.lastIndexOf('}');
//     if (aa>-1 && bb>aa) { try { return JSON.parse(unq.slice(aa,bb+1)); } catch { return {}; } }
//     return {};
//   }
// };

// router.post('/upload', upload.single('file'), async (req, res) => {
//   try {
//     const textInput = typeof req.body?.textInput === 'string' ? req.body.textInput : '';
//     const userLang = typeof req.body?.language === 'string' ? req.body.language : 'en';
//     const hasFile = !!req.file;
//     const hasText = !!textInput && textInput.trim().length > 0;

//     if (hasFile && hasText) return res.status(400).json({ error: 'Provide file OR text only' });
//     if (!hasFile && !hasText) return res.status(400).json({ error: 'No file or non-empty text provided' });

//     let rawText = '';
//     let filename = null;
//     let mimeType = null;

//     if (hasFile) {
//       filename = req.file.filename;
//       mimeType = req.file.mimetype;

//       // local extraction
//       rawText = await extractTextSmart(req.file.path, mimeType);

//       // LLM extraction fallback (Files API)
//       if (!rawText?.trim()) {
//         const file = await uploadToGemini(req.file.path);
//         const text = await generateFromParts([ partFromFile(file), '\n\n', 'Extract full plain text content.' ]);
//         rawText = (text || '').trim();
//       }

//       rawText = (rawText || '').replace(/\r\n/g, '\n').trim();
//       if (!rawText) return res.status(422).json({ error: 'File text not readable. Try a different file or paste text.' });
//     } else {
//       rawText = textInput.trim();
//       if (!rawText) return res.status(400).json({ error: 'Empty text provided' });
//     }

//     // 1) Summary block (diagnosis etc.)
//     const extractPrompt = `Return ONLY valid JSON (single object).
// Keys:
// - "diagnosis"
// - "severity" (one of "Low","Medium","High","Critical","Unknown")
// - "treatment"
// - "description" (2–4 sentences)
// - "summary" (around 100 words)
// - "rawTextPreview" (first 500 chars)
// Rules: Use only the source text below. If unsure, set "Unknown". Translate values into "${userLang}".
// Source:
// """${rawText.slice(0,8000)}"""`;

//     const rawSummary = await generateFromParts([extractPrompt]);
//     let parsedSummary = coerceObject(safeParse(rawSummary));

//     const norm = (v) => (typeof v === 'string' ? v.trim() : '');
//     const sev = norm(parsedSummary.severity);
//     const ALLOWED = ['Low','Medium','High','Critical','Unknown'];

//     // 2) Panels block (CBC/Renal/Widal ...)
//     const panelsPrompt = `Return ONLY valid JSON:
// {
//   "panels": {
//     "cbc": {
//       "haemoglobin_g_dl": number|null,
//       "rbc_million_per_cumm": number|null,
//       "wbc_per_cumm": number|null,
//       "platelets_per_cumm": number|null,
//       "haematocrit_pct": number|null,
//       "mcv_fl": number|null,
//       "mch_pg": number|null,
//       "mchc_g_dl": number|null,
//       "rdw_fl": number|null,
//       "diff_wbc_pct": {
//         "polymorphs": number|null,
//         "eosinophils": number|null,
//         "lymphocytes": number|null,
//         "basophils": number|null,
//         "monocytes": number|null
//       }
//     },
//     "renal": {
//       "serum_creatinine_mg_dl": number|null,
//       "urea_mg_dl": number|null,
//       "egfr_ml_min_1_73m2": number|null
//     },
//     "widal": {
//       "s_typhi_o": "Positive"|"Negative"|null,
//       "s_typhi_h": "Positive"|"Negative"|null
//     }
//   }
// }
// Rules:
// - Parse ONLY what exists in source; unknown → null.
// - Convert numbers; handle Platelets like "3.15000 Lakhs/cumm" → 315000.
// - Do not include extra keys.
// Source:
// """${rawText.slice(0,8000)}"""`;

//     const rawPanels = await generateFromParts([panelsPrompt]);
//     const parsedPanels = coerceObject(safeParse(rawPanels));
//     const panels = parsedPanels.panels || {};

//     const doc = await Report.create({
//       filename,
//       mimeType,
//       rawText,
//       diagnosis: norm(parsedSummary.diagnosis) || '',
//       severity: ALLOWED.includes(sev) ? sev : 'Unknown',
//       treatment: norm(parsedSummary.treatment) || '',
//       description: norm(parsedSummary.description) || '',
//       summary: norm(parsedSummary.summary) || '',
//       panels
//     });

//     return res.json({ ok: true, report: doc });
//   } catch (e) {
//     console.error(e);
//     return res.status(500).json({ error: 'Report processing failed', details: e.message });
//   }
// });

// export default router;









































// import express from 'express';
// import { upload } from '../utils/uploader.js';
// import Report from '../models/Report.js';
// import { uploadToGemini, generateFromParts, partFromFile } from '../services/gemini.js';
// import { extractTextSmart } from '../services/extractors.js';
// import { parseCbcHeuristics } from '../services/cbc-heuristics.js';

// const router = express.Router();

// // cleaners
// const stripAllFences = (s) => String(s || '')
//   .replace(/^\uFEFF/, '')
//   .replace(/`{3,}\s*\w*\s*\n?/g, '')
//   .trim();

// const hardClean = (s) => {
//   let x = String(s || '');
//   x = x.replace(/^\uFEFF/, '');
//   x = x.replace(/^\s*`{3,}\s*\w*\s*/i, '');
//   x = x.replace(/\s*`{3,}\s*$/i, '');
//   x = x.replace(/^\s*json\s*/i, '');
//   x = x.replace(/^[`]+/g, '');
//   return x.trim();
// };

// const coerceObject = (val) => {
//   if (Array.isArray(val)) return val[0] && typeof val[0] === 'object' ? val[0] : {};
//   if (typeof val === 'string') { try { return JSON.parse(val); } catch { return {}; } }
//   return val && typeof val === 'object' ? val : {};
// };

// const safeParse = (s) => {
//   const tryParse = (t)=>{ try { return JSON.parse(t); } catch { return null; } };
//   let cleaned = hardClean(stripAllFences(s)).replace(/^\s*json\s*/i,'').trim();
//   let parsed = tryParse(cleaned);
//   if (parsed) return parsed;
//   const a = cleaned.indexOf('{'), b = cleaned.lastIndexOf('}');
//   if (a>-1 && b>a) {
//     const core = cleaned.slice(a,b+1);
//     return tryParse(core) || tryParse(core.replace(/,(\s*[}\]])\s*$/m,'$1'));
//   }
//   const unq = cleaned.replace(/^"+|"+$/g,'').replace(/\\"/g,'"').replace(/\\n/g,'\n');
//   try { return JSON.parse(unq); } catch {
//     const aa = unq.indexOf('{'), bb = unq.lastIndexOf('}');
//     if (aa>-1 && bb>aa) { try { return JSON.parse(unq.slice(aa,bb+1)); } catch { return {}; } }
//     return {};
//   }
// };

// router.post('/upload', upload.single('file'), async (req, res) => {
//   try {
//     const textInput = typeof req.body?.textInput === 'string' ? req.body.textInput : '';
//     const userLang = typeof req.body?.language === 'string' ? req.body.language : 'en';
//     const hasFile = !!req.file;
//     const hasText = !!textInput && textInput.trim().length > 0;

//     if (hasFile && hasText) return res.status(400).json({ error: 'Provide file OR text only (not both)' });
//     if (!hasFile && !hasText) return res.status(400).json({ error: 'No file or non-empty text provided' });

//     let rawText = '';
//     let filename = null;
//     let mimeType = null;

//     if (hasFile) {
//       filename = req.file.filename;
//       mimeType = req.file.mimetype;

//       // local extraction
//       rawText = await extractTextSmart(req.file.path, mimeType);

//       // LLM fallback
//       if (!rawText?.trim()) {
//         const file = await uploadToGemini(req.file.path);
//         const text = await generateFromParts([
//           partFromFile(file),
//           '\n\n',
//           'Extract the full plain text content from this medical report.'
//         ]);
//         rawText = (text || '').trim();
//       }

//       rawText = (rawText || '').replace(/\r\n/g, '\n').replace(/\u00A0/g,' ').trim();
//       if (!rawText) return res.status(422).json({ error: 'File se text read nahi hua. Dusra file try karo ya text paste karo.' });
//     } else {
//       rawText = textInput.trim();
//       if (!rawText) return res.status(400).json({ error: 'Empty text provided' });
//     }

//     // 1) Summary block (diagnosis, etc.)
//     const extractPrompt = `Return ONLY valid JSON (single object).
// Keys:
// - "diagnosis"
// - "severity" (one of "Low","Medium","High","Critical","Unknown")
// - "treatment"
// - "description" (2–4 sentences)
// - "summary" (around 100 words)
// - "rawTextPreview" (first 500 chars)
// Rules: Use only the source text below. If unsure, set "Unknown". Translate values into "${userLang}".
// Source:
// """${rawText.slice(0,8000)}"""`;

//     const rawSummary = await generateFromParts([extractPrompt]);
//     const parsedSummary = coerceObject(safeParse(rawSummary));
//     const norm = (v) => (typeof v === 'string' ? v.trim() : '');
//     const sev = norm(parsedSummary.severity);
//     const ALLOWED = ['Low','Medium','High','Critical','Unknown'];

//     // 2) Panels via LLM
//     const panelsPrompt = `Return ONLY valid JSON:
// {
//   "panels": {
//     "cbc": {
//       "haemoglobin_g_dl": number|null,
//       "rbc_million_per_cumm": number|null,
//       "wbc_per_cumm": number|null,
//       "platelets_per_cumm": number|null,
//       "haematocrit_pct": number|null,
//       "mcv_fl": number|null,
//       "mch_pg": number|null,
//       "mchc_g_dl": number|null,
//       "rdw_fl": number|null,
//       "diff_wbc_pct": {
//         "neutrophils": number|null,
//         "eosinophils": number|null,
//         "lymphocytes": number|null,
//         "basophils": number|null,
//         "monocytes": number|null
//       }
//     },
//     "renal": {
//       "serum_creatinine_mg_dl": number|null,
//       "urea_mg_dl": number|null,
//       "egfr_ml_min_1_73m2": number|null
//     },
//     "widal": {
//       "s_typhi_o": "Positive"|"Negative"|null,
//       "s_typhi_h": "Positive"|"Negative"|null
//     }
//   }
// }
// Rules:
// - Use only the source text. Unknown → null. Convert numbers.
// - If WBC/Platelet units state 10^3/uL, multiply numeric by 1000.
// Source:
// """${rawText.slice(0,8000)}"""`;

//     const rawPanels = await generateFromParts([panelsPrompt]);
//     const parsedPanels = coerceObject(safeParse(rawPanels));
//     let panels = parsedPanels.panels || {};

//     // 2b) Heuristic CBC merge (captures OCR/table variants)
//     const heuristicCBC = parseCbcHeuristics(rawText);
//     panels.cbc = { ...(panels.cbc || {}), ...heuristicCBC };

//     // 3) Save
//     const doc = await Report.create({
//       filename,
//       mimeType,
//       rawText,
//       diagnosis: norm(parsedSummary.diagnosis) || '',
//       severity: ALLOWED.includes(sev) ? sev : 'Unknown',
//       treatment: norm(parsedSummary.treatment) || '',
//       description: norm(parsedSummary.description) || '',
//       summary: norm(parsedSummary.summary) || '',
//       panels
//     });

//     return res.json({ ok: true, report: doc });
//   } catch (e) {
//     console.error(e);
//     return res.status(500).json({ error: 'Report processing failed', details: e.message });
//   }
// });

// export default router;


















































// import express from 'express';
// import { upload } from '../utils/uploader.js';
// import Report from '../models/Report.js';
// import { uploadToGemini, generateFromParts, partFromFile } from '../services/gemini.js';
// import { extractTextSmart } from '../services/extractors.js';

// const router = express.Router();

// // cleaners
// const stripAllFences = (s) => String(s || '')
//   .replace(/^\uFEFF/, '')
//   .replace(/`{3,}\s*\w*\s*\n?/g, '')
//   .trim();

// const hardClean = (s) => {
//   let x = String(s || '');
//   x = x.replace(/^\uFEFF/, '');
//   x = x.replace(/^\s*`{3,}\s*\w*\s*/i, '');
//   x = x.replace(/\s*`{3,}\s*$/i, '');
//   x = x.replace(/^\s*json\s*/i, '');
//   x = x.replace(/^[`]+/g, '');
//   return x.trim();
// };

// const coerceObject = (val) => {
//   if (Array.isArray(val)) return val[0] && typeof val[0] === 'object' ? val[0] : {};
//   if (typeof val === 'string') { try { return JSON.parse(val); } catch { return {}; } }
//   return val && typeof val === 'object' ? val : {};
// };

// const safeParse = (s) => {
//   const tryParse = (t)=>{ try { return JSON.parse(t); } catch { return null; } };
//   let cleaned = hardClean(stripAllFences(s)).replace(/^\s*json\s*/i,'').trim();
//   let parsed = tryParse(cleaned);
//   if (parsed) return parsed;
//   const a = cleaned.indexOf('{'), b = cleaned.lastIndexOf('}');
//   if (a>-1 && b>a) {
//     const core = cleaned.slice(a,b+1);
//     return tryParse(core) || tryParse(core.replace(/,(\s*[}\]])\s*$/m,'$1'));
//   }
//   // double-encoded
//   const unq = cleaned.replace(/^"+|"+$/g,'').replace(/\\"/g,'"').replace(/\\n/g,'\n');
//   try { return JSON.parse(unq); } catch { 
//     const aa=unq.indexOf('{'), bb=unq.lastIndexOf('}');
//     if (aa>-1 && bb>aa) { try { return JSON.parse(unq.slice(aa,bb+1)); } catch { return {}; } }
//     return {};
//   }
// };

// router.post('/upload', upload.single('file'), async (req, res) => {
//   try {
//     const textInput = typeof req.body?.textInput === 'string' ? req.body.textInput : '';
//     const userLang = typeof req.body?.language === 'string' ? req.body.language : 'en';
//     const hasFile = !!req.file;
//     const hasText = !!textInput && textInput.trim().length > 0;

//     if (hasFile && hasText) return res.status(400).json({ error: 'Provide file OR text only' });
//     if (!hasFile && !hasText) return res.status(400).json({ error: 'No file or non-empty text provided' });

//     let rawText = '';
//     let filename = null;
//     let mimeType = null;

//     if (hasFile) {
//       filename = req.file.filename;
//       mimeType = req.file.mimetype;

//       // local extraction
//       rawText = await extractTextSmart(req.file.path, mimeType);

//       // LLM extraction fallback (Files API)
//       if (!rawText?.trim()) {
//         const file = await uploadToGemini(req.file.path);
//         const text = await generateFromParts([ partFromFile(file), '\n\n', 'Extract full plain text content.' ]);
//         rawText = (text || '').trim();
//       }

//       rawText = (rawText || '').replace(/\r\n/g, '\n').trim();
//       if (!rawText) return res.status(422).json({ error: 'File text not readable. Try a different file or paste text.' });
//     } else {
//       rawText = textInput.trim();
//       if (!rawText) return res.status(400).json({ error: 'Empty text provided' });
//     }

//     // 1) Summary block (diagnosis etc.)
//     const extractPrompt = `Return ONLY valid JSON (single object).
// Keys:
// - "diagnosis"
// - "severity" (one of "Low","Medium","High","Critical","Unknown")
// - "treatment"
// - "description" (2–4 sentences)
// - "summary" (around 100 words)
// - "rawTextPreview" (first 500 chars)
// Rules: Use only the source text below. If unsure, set "Unknown". Translate values into "${userLang}".
// Source:
// """${rawText.slice(0,8000)}"""`;

//     const rawSummary = await generateFromParts([extractPrompt]);
//     let parsedSummary = coerceObject(safeParse(rawSummary));

//     const norm = (v) => (typeof v === 'string' ? v.trim() : '');
//     const sev = norm(parsedSummary.severity);
//     const ALLOWED = ['Low','Medium','High','Critical','Unknown'];

//     // 2) Panels block (CBC/Renal/Widal ...)
//     const panelsPrompt = `Return ONLY valid JSON:
// {
//   "panels": {
//     "cbc": {
//       "haemoglobin_g_dl": number|null,
//       "rbc_million_per_cumm": number|null,
//       "wbc_per_cumm": number|null,
//       "platelets_per_cumm": number|null,
//       "haematocrit_pct": number|null,
//       "mcv_fl": number|null,
//       "mch_pg": number|null,
//       "mchc_g_dl": number|null,
//       "rdw_fl": number|null,
//       "diff_wbc_pct": {
//         "polymorphs": number|null,
//         "eosinophils": number|null,
//         "lymphocytes": number|null,
//         "basophils": number|null,
//         "monocytes": number|null
//       }
//     },
//     "renal": {
//       "serum_creatinine_mg_dl": number|null,
//       "urea_mg_dl": number|null,
//       "egfr_ml_min_1_73m2": number|null
//     },
//     "widal": {
//       "s_typhi_o": "Positive"|"Negative"|null,
//       "s_typhi_h": "Positive"|"Negative"|null
//     }
//   }
// }
// Rules:
// - Parse ONLY what exists in source; unknown → null.
// - Convert numbers; handle Platelets like "3.15000 Lakhs/cumm" → 315000.
// - Do not include extra keys.
// Source:
// """${rawText.slice(0,8000)}"""`;

//     const rawPanels = await generateFromParts([panelsPrompt]);
//     const parsedPanels = coerceObject(safeParse(rawPanels));
//     const panels = parsedPanels.panels || {};

//     const doc = await Report.create({
//       filename,
//       mimeType,
//       rawText,
//       diagnosis: norm(parsedSummary.diagnosis) || '',
//       severity: ALLOWED.includes(sev) ? sev : 'Unknown',
//       treatment: norm(parsedSummary.treatment) || '',
//       description: norm(parsedSummary.description) || '',
//       summary: norm(parsedSummary.summary) || '',
//       panels
//     });

//     return res.json({ ok: true, report: doc });
//   } catch (e) {
//     console.error(e);
//     return res.status(500).json({ error: 'Report processing failed', details: e.message });
//   }
// });

// export default router;























import express from 'express';
import { upload } from '../utils/uploader.js';
import Report from '../models/Report.js';
import { uploadToGemini, generateFromParts, partFromFile } from '../services/gemini.js';

import { extractTextSmart } from '../services/extractTextSmart.js';  // <== ✅ corrected import

const router = express.Router();

// -------- Helpers ----------
const stripAllFences = (s) => String(s || '')
  .replace(/^\uFEFF/, '')
  .replace(/`{3,}\s*\w*\s*\n?/g, '')
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

const coerceObject = (val) => {
  if (Array.isArray(val)) return val[0] && typeof val[0] === 'object' ? val[0] : {};
  if (typeof val === 'string') { try { return JSON.parse(val); } catch { return {}; } }
  return val && typeof val === 'object' ? val : {};
};

const safeParse = (s) => {
  const tryParse = (t) => { try { return JSON.parse(t); } catch { return null; } };
  let cleaned = hardClean(stripAllFences(s)).replace(/^\s*json\s*/i, '').trim();
  let parsed = tryParse(cleaned);
  if (parsed) return parsed;
  const a = cleaned.indexOf('{'), b = cleaned.lastIndexOf('}');
  if (a > -1 && b > a) {
    const core = cleaned.slice(a, b + 1);
    return tryParse(core) || tryParse(core.replace(/,(\s*[}\]])\s*$/m, '$1'));
  }
  const unq = cleaned.replace(/^"+|"+$/g, '').replace(/\\"/g, '"').replace(/\\n/g, '\n');
  try { return JSON.parse(unq); } catch {
    const aa = unq.indexOf('{'), bb = unq.lastIndexOf('}');
    if (aa > -1 && bb > aa) { try { return JSON.parse(unq.slice(aa, bb + 1)); } catch { return {}; } }
    return {};
  }
};

// -------- Upload Route ----------
router.post('/upload', upload.single('file'), async (req, res) => {
  try {
    const textInput = typeof req.body?.textInput === 'string' ? req.body.textInput : '';
    const userLang = typeof req.body?.language === 'string' ? req.body.language : 'en';
    const hasFile = !!req.file;
    const hasText = !!textInput && textInput.trim().length > 0;

    if (hasFile && hasText) return res.status(400).json({ error: 'Provide file OR text only' });
    if (!hasFile && !hasText) return res.status(400).json({ error: 'No file or non-empty text provided' });

    let rawText = '';
    let filename = null;
    let mimeType = null;

    if (hasFile) {
      filename = req.file.filename;
      mimeType = req.file.mimetype;

      // ✅ Local extraction
      rawText = await extractTextSmart(req.file.path);

      // ✅ Fallback: Gemini se plain text
      if (!rawText?.trim()) {
        const file = await uploadToGemini(req.file.path);
        const text = await generateFromParts([
          partFromFile(file),
          '\n\n',
          'Extract full plain text content.'
        ]);
        rawText = (text || '').trim();
      }

      rawText = (rawText || '').replace(/\r\n/g, '\n').trim();
      if (!rawText) return res.status(422).json({ error: 'File text not readable. Try a different file or paste text.' });

    } else {
      rawText = textInput.trim();
      if (!rawText) return res.status(400).json({ error: 'Empty text provided' });
    }

    // ---------- 1) Summary ----------
    const extractPrompt = `Return ONLY valid JSON (single object).
Keys:
- "diagnosis"
- "severity" (one of "Low","Medium","High","Critical","Unknown")
- "treatment"
- "description" (2–4 sentences)
- "summary" (around 100 words)
- "rawTextPreview" (first 500 chars)
Rules: Use only the source text below. If unsure, set "Unknown". Translate values into "${userLang}".
Source:
"""${rawText.slice(0,8000)}"""`;

    const rawSummary = await generateFromParts([extractPrompt]);
    let parsedSummary = coerceObject(safeParse(rawSummary));

    const norm = (v) => (typeof v === 'string' ? v.trim() : '');
    const sev = norm(parsedSummary.severity);
    const ALLOWED = ['Low', 'Medium', 'High', 'Critical', 'Unknown'];

    // ---------- 2) Panels ----------
    const panelsPrompt = `Return ONLY valid JSON:
{
  "panels": {
    "cbc": {
      "haemoglobin_g_dl": number|null,
      "rbc_million_per_cumm": number|null,
      "wbc_per_cumm": number|null,
      "platelets_per_cumm": number|null,
      "haematocrit_pct": number|null,
      "mcv_fl": number|null,
      "mch_pg": number|null,
      "mchc_g_dl": number|null,
      "rdw_fl": number|null,
      "diff_wbc_pct": {
        "polymorphs": number|null,
        "eosinophils": number|null,
        "lymphocytes": number|null,
        "basophils": number|null,
        "monocytes": number|null
      }
    },
    "renal": {
      "serum_creatinine_mg_dl": number|null,
      "urea_mg_dl": number|null,
      "egfr_ml_min_1_73m2": number|null
    },
    "widal": {
      "s_typhi_o": "Positive"|"Negative"|null,
      "s_typhi_h": "Positive"|"Negative"|null
    }
  }
}
Rules:
- Parse ONLY what exists in source; unknown → null.
- Convert numbers; handle Platelets like "3.15000 Lakhs/cumm" → 315000.
- Do not include extra keys.
Source:
"""${rawText.slice(0,8000)}"""`;

    const rawPanels = await generateFromParts([panelsPrompt]);
    const parsedPanels = coerceObject(safeParse(rawPanels));
    const panels = parsedPanels.panels || {};

    // ---------- Save ----------
    const doc = await Report.create({
      filename,
      mimeType,
      rawText,
      diagnosis: norm(parsedSummary.diagnosis) || '',
      severity: ALLOWED.includes(sev) ? sev : 'Unknown',
      treatment: norm(parsedSummary.treatment) || '',
      description: norm(parsedSummary.description) || '',
      summary: norm(parsedSummary.summary) || '',
      panels
    });

    return res.json({ ok: true, report: doc });
  } catch (e) {
    console.error(e);
    return res.status(500).json({ error: 'Report processing failed', details: e.message });
  }
});




// -------- Download Route ----------
import PDFDocument from "pdfkit";

router.get("/download/:id", async (req, res) => {
  try {
    const reportId = req.params.id;
    const report = await Report.findById(reportId);

    if (!report) {
      return res.status(404).json({ error: "Report not found" });
    }

    // Set headers for file download
    res.setHeader("Content-Disposition", `attachment; filename=report_${reportId}.pdf`);
    res.setHeader("Content-Type", "application/pdf");

    // Create PDF
    const doc = new PDFDocument();
    doc.pipe(res);

    // Title
    doc.fontSize(20).text("🧾 Medical Report", { align: "center" });
    doc.moveDown();

    // Report Info
    if (report.filename) doc.fontSize(10).text(`File: ${report.filename}`);
    doc.fontSize(10).text(`Severity: ${report.severity}`);
    doc.moveDown();

    // Diagnosis
    doc.fontSize(14).text("Diagnosis", { underline: true });
    doc.fontSize(12).text(report.diagnosis || "N/A");
    doc.moveDown();

    // Treatment
    doc.fontSize(14).text("Treatment", { underline: true });
    doc.fontSize(12).text(report.treatment || "N/A");
    doc.moveDown();

    // Description
    doc.fontSize(14).text("Description", { underline: true });
    doc.fontSize(12).text(report.description || "N/A");
    doc.moveDown();

    // Summary
    doc.fontSize(14).text("Summary", { underline: true });
    doc.fontSize(12).text(report.summary || "N/A");
    doc.moveDown();

    // Raw Text Preview
    doc.fontSize(14).text("Extracted Text Preview", { underline: true });
    doc.fontSize(10).text(report.rawText.slice(0, 1000) + "...");
    doc.moveDown();

    doc.end();
  } catch (e) {
    console.error("PDF generation error:", e);
    res.status(500).json({ error: "Failed to generate PDF" });
  }
});

export default router;
