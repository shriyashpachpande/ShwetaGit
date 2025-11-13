// import { SIMILARITY_THRESHOLD } from '../config/constants.js';

// const simpleEmbed = (text = '') => {
//   const tokens = text.toLowerCase().split(/\W+/).filter(Boolean);
//   const map = new Map();
//   tokens.forEach((t) => map.set(t, (map.get(t) || 0) + 1));
//   return map;
// };

// const cosine = (a, b) => {
//   let dot = 0,
//     na = 0,
//     nb = 0;
//   const keys = new Set([...a.keys(), ...b.keys()]);
//   keys.forEach((k) => {
//     const va = a.get(k) || 0;
//     const vb = b.get(k) || 0;
//     dot += va * vb;
//     na += va * va;
//     nb += vb * vb;
//   });
//   if (!na || !nb) return 0;
//   return dot / (Math.sqrt(na) + Math.sqrt(nb));
// };

// const extractKeywords = (text = '') => {
//   const toks = text.toLowerCase().split(/\W+/).filter(Boolean);
//   // Keep medically meaningful tokens length > 3
//   return new Set(toks.filter((t) => t.length >= 4));
// };

// export const bestClauseMatch = (diagnosisText = '', clauses = []) => {
//   const embDiag = simpleEmbed(diagnosisText);
//   const diagKeys = extractKeywords(diagnosisText);

//   let best = { score: 0, clause: null };
//   for (const c of clauses) {
//     const ctext = c.text || '';
//     const base = cosine(embDiag, simpleEmbed(ctext));

//     // keyword boost
//     let boost = 0;
//     const lower = ctext.toLowerCase();
//     for (const k of diagKeys) {
//       if (lower.includes(k)) {
//         boost += 0.3; // strong boost if keyword present
//         break;
//       }
//     }
//     if (c.type === 'exclusion' && boost > 0) {
//       boost += 0.15; // separable influence; decision handled by caller
//     }

//     const scoreAdj = Math.min(1, base + boost);
//     if (scoreAdj > best.score) best = { score: scoreAdj, clause: c };
//   }

//   // Always return best; caller decides coverage using clause.type and threshold
//   return best.score >= SIMILARITY_THRESHOLD
//     /? best
//     : { score: best.score, clause: best.clause };
// };




/********************************************************************************************* */
/********************************************************************************************* */
/********************************************************************************************* */


// // File: backend/src/services/embedding-match-service.js
// import { SIMILARITY_THRESHOLD } from '../config/constants.js';

// const simpleEmbed = (text = '') => {
//   const tokens = text.toLowerCase().split(/\W+/).filter(Boolean);
//   const map = new Map();
//   tokens.forEach((t) => map.set(t, (map.get(t) || 0) + 1));
//   return map;
// };

// const cosine = (a, b) => {
//   let dot = 0, na = 0, nb = 0;
//   const keys = new Set([...a.keys(), ...b.keys()]);
//   keys.forEach((k) => {
//     const va = a.get(k) || 0;
//     const vb = b.get(k) || 0;
//     dot += va * vb;
//     na += va * va;
//     nb += vb * vb;
//   });
//   if (!na || !nb) return 0;
//   return dot / (Math.sqrt(na) + Math.sqrt(nb));
// };

// const extractKeywords = (text = '') => {
//   const toks = text.toLowerCase().split(/\W+/).filter(Boolean);
//   return new Set(toks.filter((t) => t.length >= 4));
// };

// // Lightweight section keyword mapping: if diagnosis mentions diabetes etc., favor matching section titles
// const sectionHints = [
//   { key: /diabet/i, hint: /diabet/i },
//   { key: /hypertens|cardiac/i, hint: /hypertens|cardiac/i },
//   { key: /dialys/i, hint: /dialys/i },
//   { key: /ambul/i, hint: /ambul/i },
//   { key: /hospital|room/i, hint: /hospital|room|inpatient/i },
// ];

// export const bestClauseMatch = (diagnosisText = '', clauses = []) => {
//   const embDiag = simpleEmbed(diagnosisText);
//   const diagKeys = extractKeywords(diagnosisText);
//   let best = { score: 0, clause: null };

//   for (const c of clauses) {
//     const ctext = `${c.label || ''} ${c.text || ''}`;

//     const base = cosine(embDiag, simpleEmbed(ctext));

//     // token keyword boost
//     let boost = 0;
//     const lower = ctext.toLowerCase();
//     for (const k of diagKeys) {
//       if (lower.includes(k)) { boost += 0.3; break; }
//     }

//     // section hint boost
//     const diagLower = diagnosisText.toLowerCase();
//     for (const h of sectionHints) {
//       if (h.key.test(diagLower) && h.hint.test(lower)) { boost += 0.2; break; }
//     }

//     // exclusion slight add
//     if (c.type === 'exclusion' && boost > 0) boost += 0.1;

//     const scoreAdj = Math.min(1, base + boost);
//     if (scoreAdj > best.score) best = { score: scoreAdj, clause: c };
//   }

//   // ✅ return **function ke andar**
//   return best.score >= SIMILARITY_THRESHOLD
//   /  ? best
//     : { score: best.score, clause: best.clause };
// };



























// // File: backend/src/services/embedding-match-service.js
// // File: backend/src/services/embedding-match-service.js
// import { SIMILARITY_THRESHOLD } from '../config/constants.js';

// // Simple bag-of-words embedding
// const simpleEmbed = (text = '') => {
//   const tokens = text.toLowerCase().split(/\W+/).filter(Boolean);
//   const map = new Map();
//   tokens.forEach(t => map.set(t, (map.get(t) || 0) + 1));
//   return map;
// };

// // Cosine similarity
// const cosine = (a, b) => {
//   let dot = 0, na = 0, nb = 0;
//   const keys = new Set([...a.keys(), ...b.keys()]);
//   keys.forEach(k => {
//     const va = a.get(k) || 0;
//     const vb = b.get(k) || 0;
//     dot += va * vb;
//     na += va * va;
//     nb += vb * vb;
//   });
//   if (!na || !nb) return 0;
//   return dot / (Math.sqrt(na) + Math.sqrt(nb));
// };

// // Extract keywords (length >=4)
// const extractKeywords = (text = '') => {
//   const toks = text.toLowerCase().split(/\W+/).filter(Boolean);
//   return new Set(toks.filter(t => t.length >= 4));
// };

// // Section hint keywords (dynamic, add more if needed)
// const sectionHints = [
//   { key: /diabet/i, hint: /diabet/i },
//   { key: /hyperlipid/i, hint: /cardiac|cholesterol/i },
//   { key: /heart|myocardial|infarction|attack/i, hint: /critical|cardiac/i },
//   { key: /dialys/i, hint: /dialys/i },
//   { key: /ambul/i, hint: /ambul/i },
//   { key: /hospital|room|inpatient/i, hint: /hospital|room|inpatient/i },
// ];

// // Main dynamic match function
// export const bestClauseMatch = (diagnosisText = '', clauses = []) => {
//   const embDiag = simpleEmbed(diagnosisText);
//   const diagKeys = extractKeywords(diagnosisText);
//   let best = { score: 0, clause: null };

//   for (const c of clauses) {
//     const ctext = `${c.label || ''} ${c.text || ''}`;
//     const base = cosine(embDiag, simpleEmbed(ctext));

//     // Keyword boost
//     let boost = 0;
//     const lower = ctext.toLowerCase();
//     for (const k of diagKeys) {
//       if (lower.includes(k)) { boost += 0.3; break; }
//     }

//     // Section hint boost
//     const diagLower = diagnosisText.toLowerCase();
//     for (const h of sectionHints) {
//       if (h.key.test(diagLower) && h.hint.test(lower)) { boost += 0.2; break; }
//     }

//     // Slight boost for exclusions
//     if (c.type === 'exclusion' && boost > 0) boost += 0.1;

//     const scoreAdj = Math.min(1, base + boost);
//     if (scoreAdj > best.score) best = { score: scoreAdj, clause: c };
//   }

//   return best.score >= SIMILARITY_THRESHOLD
//  /   ? best
//     : { score: best.score, clause: best.clause };
// };



















































// // File: backend/src/services/embedding-match-service.js
// import { SIMILARITY_THRESHOLD } from '../config/constants.js';

// const simpleEmbed = (text = '') => {
//   const tokens = text.toLowerCase().split(/\W+/).filter(Boolean);
//   const map = new Map();
//   tokens.forEach(t => map.set(t, (map.get(t) || 0) + 1));
//   return map;
// };

// const cosine = (a, b) => {
//   let dot = 0, na = 0, nb = 0;
//   const keys = new Set([...a.keys(), ...b.keys()]);
//   keys.forEach(k => {
//     const va = a.get(k) || 0;
//     const vb = b.get(k) || 0;
//     dot += va * vb;
//     na += va * va;
//     nb += vb * vb;
//   });
//   if (!na || !nb) return 0;
//   return dot / (Math.sqrt(na) * Math.sqrt(nb));
// };

// const extractKeywords = (text = '') => {
//   const toks = text.toLowerCase().split(/\W+/).filter(Boolean);
//   return new Set(toks.filter(t => t.length >= 4));
// };

// // Optional hints for common sections
// const sectionHints = [
//   { key: /diabet/i, hint: /diabet/i },
//   { key: /hypertens|cardiac/i, hint: /hypertens|cardiac/i },
//   { key: /dialys/i, hint: /dialys/i },
//   { key: /ambul/i, hint: /ambul/i },
//   { key: /hospital|room/i, hint: /hospital|room|inpatient/i },
//   { key: /heart attack|myocardial/i, hint: /critical/i },
// ];

// export const bestClauseMatch = (diagnosisText = '', clauses = []) => {
//   const embDiag = simpleEmbed(diagnosisText);
//   const diagKeys = extractKeywords(diagnosisText);
//   let best = { score: 0, clause: null };

//   for (const c of clauses) {
//     const ctext = `${c.label || ''} ${c.text || ''}`;
//     const base = cosine(embDiag, simpleEmbed(ctext));

//     // token keyword boost
//     let boost = 0;
//     const lower = ctext.toLowerCase();
//     for (const k of diagKeys) {
//       if (lower.includes(k)) { boost += 0.3; break; }
//     }

//     // section hint boost
//     const diagLower = diagnosisText.toLowerCase();
//     for (const h of sectionHints) {
//       if (h.key.test(diagLower) && h.hint.test(lower)) { boost += 0.2; break; }
//     }

//     const scoreAdj = Math.min(1, base + boost);
//     if (scoreAdj > best.score) best = { score: scoreAdj, clause: c };
//   }

//   return best.score >= SIMILARITY_THRESHOLD
//  /   ? best
//     : { score: best.score, clause: best.clause };
// };










































// File: backend/src/services/embedding-match-service.js
import { SIMILARITY_THRESHOLD } from '../config/constants.js';

// --- Simple bag-of-words embedding
const simpleEmbed = (text = '') => {
  const tokens = text.toLowerCase().split(/\W+/).filter(Boolean);
  const map = new Map();
  tokens.forEach((t) => map.set(t, (map.get(t) || 0) + 1));
  return map;
};

// --- Cosine similarity
const cosine = (a, b) => {
  let dot = 0, na = 0, nb = 0;
  const keys = new Set([...a.keys(), ...b.keys()]);
  keys.forEach((k) => {
    const va = a.get(k) || 0;
    const vb = b.get(k) || 0;
    dot += va * vb;
    na += va * va;
    nb += vb * vb;
  });
  if (!na || !nb) return 0;
  return dot / (Math.sqrt(na) + Math.sqrt(nb));
};

// --- Keywords from report
const extractKeywords = (text = '') => {
  const toks = text.toLowerCase().split(/\W+/).filter(Boolean);
  return new Set(toks.filter((t) => t.length >= 3)); // 3+ chars
};

// --- Medical synonyms dictionary
const synonymsMap = {
  "heart attack": ["heart attack", "myocardial infarction", "MI", "acute MI"],
  "diabetes": ["type 2 diabetes", "t2dm", "diabetes mellitus", "diabetes"],
  "kidney": ["chronic kidney disease", "CKD", "kidney failure"],
  "hypertension": ["hypertension", "high blood pressure", "cardiac"],
  "dialysis": ["dialysis"],
  "ambulance": ["ambulance", "emergency transport"],
  "gastroenteritis": ["gastroenteritis", "stomach infection", "dehydration"]
};

// --- Expand keywords with synonyms
const expandWithSynonyms = (keywords) => {
  const expanded = new Set();
  for (const k of keywords) {
    expanded.add(k);
    for (const key in synonymsMap) {
      if (synonymsMap[key].includes(k)) {
        synonymsMap[key].forEach((s) => expanded.add(s));
      }
    }
  }
  return expanded;
};

// --- Best clause match
export const bestClauseMatch = (diagnosisText = '', clauses = []) => {
  const embDiag = simpleEmbed(diagnosisText);
  const diagKeys = expandWithSynonyms(Array.from(extractKeywords(diagnosisText)));
  
  let best = { score: 0, clause: null };

  for (const c of clauses) {
    const ctext = `${c.label || ''} ${c.text || ''}`.toLowerCase();
    const base = cosine(embDiag, simpleEmbed(ctext));

    // Exact keyword/synonym boost
    let boost = 0;
    for (const k of diagKeys) {
      if (ctext.includes(k)) {
        boost += 0.4; // strong boost for exact/synonym match
      }
    }

    // Section hint boost
    const sectionHints = [
      { key: /diabet/i, hint: /diabet/i },
      { key: /hypertens|cardiac/i, hint: /hypertens|cardiac/i },
      { key: /dialys/i, hint: /dialys/i },
      { key: /ambul/i, hint: /ambul/i },
      { key: /hospital|room/i, hint: /hospital|room|inpatient/i },
      { key: /gastroenteritis/i, hint: /gastroenteritis/i }
    ];
    for (const h of sectionHints) {
      if (h.key.test(diagnosisText.toLowerCase()) && h.hint.test(ctext)) {
        boost += 0.2;
      }
    }

    // Exclusion slight add
    if (c.type === 'exclusion' && boost > 0) boost += 0.1;

    const scoreAdj = Math.min(1, base + boost);
    if (scoreAdj > best.score) best = { score: scoreAdj, clause: c };
  }

  return best.score >= SIMILARITY_THRESHOLD
    ? best
    : { score: best.score, clause: best.clause };
};
