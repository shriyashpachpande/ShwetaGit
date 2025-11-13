// import express from 'express';
// import Report from '../models/Report.js';
// import Policy from '../models/Policy.js';
// import Analysis from '../models/Analysis.js';
// import { generateFromParts } from '../services/gemini.js';

// const router = express.Router();

// router.post('/', async (req, res) => {
//   try {
//     const { reportId, policyId } = req.body;
//     const report = reportId
//       ? await Report.findById(reportId)
//       : await Report.findOne().sort({ createdAt: -1 });
//     const policy = policyId
//       ? await Policy.findById(policyId)
//       : await Policy.findOne().sort({ createdAt: -1 });

//     if (!report || !policy) return res.status(404).json({ error: 'Missing report or policy' });

//     const comparePrompt = `Return ONLY valid JSON with keys:
// {
//   "decision": "✅ Covered" | "❌ Not Covered",
//   "clauseRef": "string",               // best-matching clause id (or "")
//   "limit": "string",                   // monetary/quantity limit if any, else ""
//   "justification": "string",           // 2-4 sentences referencing clause/limit
//   "confidence": "70%-100%",
//   "reportSummary": "string",
//   "matchedClauseText": "string"
// }
// Rules:
// - Use the policy clauses JSON below. If an exclusion/waiting period applies, prefer Not Covered.
// - If coverage with limits applies, set decision Covered and include "limit" (e.g., "Up to ₹50,000 per year").
// - clauseRef should be the exact id from the clause list (e.g., "5.1") when applicable, else "".
// - justification must never be empty.

// Medical Report:
// - Diagnosis: ${report.diagnosis}
// - Severity: ${report.severity}
// - Treatment: ${report.treatment}
// - Description: ${report.description}

// Policy Clauses JSON:
// ${JSON.stringify(policy.clauses).slice(0, 14000)}

// Output JSON only. Do not include code fences or the word json.`;

//     const raw = await generateFromParts([ comparePrompt ]);

//     // Reuse cleaning from report route (light)
//     const clean = (s) => String(s || '')
//       .replace(/^\uFEFF/, '')
//       .replace(/^\s*```/, '')
//       .replace(/```+\s*$/i, '')
//       .replace(/^\s*json\s*/i, '')
//       .trim();

//     let text = clean(raw);
//     let parsed;
//     try {
//       parsed = JSON.parse(text);
//     } catch {
//       const start = text.indexOf('{'), end = text.lastIndexOf('}');
//       if (start !== -1 && end > start) {
//         const core = text.slice(start, end + 1);
//         try { parsed = JSON.parse(core); } catch {
//           return res.status(422).json({ error: 'Analyze failed: invalid JSON from model' });
//         }
//       } else {
//         return res.status(422).json({ error: 'Analyze failed: invalid JSON from model' });
//       }
//     }

//     // Sanitize with safe defaults
//     const norm = (v) => (typeof v === 'string' ? v.trim() : '');
//     const decision = ['✅ Covered', '❌ Not Covered'].includes(norm(parsed.decision)) ? norm(parsed.decision) : '❌ Not Covered';
//     const clauseRef = norm(parsed.clauseRef) || '';
//     const limit = norm(parsed.limit) || '';
//     const justification = norm(parsed.justification) || 'Based on the provided policy clauses and medical report, coverage could not be established with certainty.';
//     const confidence = norm(parsed.confidence) || '70%';

//     const saved = await Analysis.create({
//       reportId: report._id,
//       policyId: policy._id,
//       decision,
//       clauseRef,
//       justification,
//       confidence,
//       resultJson: { ...parsed, limit }
//     });

//     return res.json({ ok: true, analysis: saved });
//   } catch (e) {
//     console.error(e);
//     return res.status(500).json({ error: 'Analysis failed', details: e.message });
//   }
// });

// export default router;
































import express from 'express';
import Report from '../models/Report.js';
import Policy from '../models/Policy.js';
import Analysis from '../models/Analysis.js';
import { generateFromParts } from '../services/gemini.js';

const router = express.Router();

router.post('/', async (req, res) => {
  try {
    const { reportId, policyId, language } = req.body;
    const userLang = typeof language === 'string' ? language : 'en';

    const report = reportId
      ? await Report.findById(reportId)
      : await Report.findOne().sort({ createdAt: -1 });

    const policy = policyId
      ? await Policy.findById(policyId)
      : await Policy.findOne().sort({ createdAt: -1 });

    if (!report || !policy) return res.status(404).json({ error: 'Missing report or policy' });

    const comparePrompt = `Return ONLY valid JSON with keys:
{
  "decision": "✅ Covered" | "❌ Not Covered",
  "clauseRef": "string",
  "limit": "string",
  "justification": "string (translated in ${userLang})",
  "reportSummary": "string (translated in ${userLang})",
  "matchedClauseText": "string (translated in ${userLang})"
}
Rules:
- Use the policy clauses JSON below. If an exclusion/waiting period applies, prefer Not Covered.
- If coverage with limits applies, set decision Covered and include "limit" (e.g., "Up to ₹50,000 per year").
- clauseRef should be the exact id from the clause list (e.g., "5.1") when applicable, else "".
- justification and reportSummary must be in the selected language ("${userLang}").

Medical Report:
- Diagnosis: ${report.diagnosis}
- Severity: ${report.severity}
- Treatment: ${report.treatment}
- Description: ${report.description}

Policy Clauses JSON:
${JSON.stringify(policy.clauses).slice(0, 14000)}

Output JSON only. Do not include code fences or the word json.`;

    const raw = await generateFromParts([comparePrompt]);

    const clean = (s) => String(s || '')
      .replace(/^\uFEFF/, '')
      .replace(/^\s*```/, '')
      .replace(/```+\s*$/i, '')
      .replace(/^\s*json\s*/i, '')
      .trim();

    let text = clean(raw);
    let parsed;
    try {
      parsed = JSON.parse(text);
    } catch {
      const start = text.indexOf('{'), end = text.lastIndexOf('}');
      if (start !== -1 && end > start) {
        const core = text.slice(start, end + 1);
        try { parsed = JSON.parse(core); } catch {
          return res.status(422).json({ error: 'Analyze failed: invalid JSON from model' });
        }
      } else {
        return res.status(422).json({ error: 'Analyze failed: invalid JSON from model' });
      }
    }

    const norm = (v) => (typeof v === 'string' ? v.trim() : '');
    const decision = ['✅ Covered', '❌ Not Covered'].includes(norm(parsed.decision)) ? norm(parsed.decision) : '❌ Not Covered';
    const clauseRef = norm(parsed.clauseRef) || '';
    const limit = norm(parsed.limit) || '';
    const justification = norm(parsed.justification) || 'Based on policy clauses and report, no definitive conclusion could be drawn.';
    const confidence = norm(parsed.confidence) || '70%';

    const saved = await Analysis.create({
      reportId: report._id,
      policyId: policy._id,
      decision,
      clauseRef,
      justification,
      confidence,
      resultJson: { ...parsed, limit }
    });

    return res.json({ ok: true, analysis: saved });
  } catch (e) {
    console.error(e);
    return res.status(500).json({ error: 'Analysis failed', details: e.message });
  }
});


export default router;
