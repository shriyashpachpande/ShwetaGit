// // File: backend/src/services/policy-parse-service.js
// const toClauses = (raw) => {
//     if (!raw) return [];
//     const lines = raw.split('\n').map(l => l.trim()).filter(Boolean);
//     const chunks = [];
//     let acc = [];
//     for (const l of lines) {
//         // Split when a new numbered clause starts like "1) " or "2. "
//         if (/^\d+[).]/.test(l) && acc.length) {
//             chunks.push(acc.join(' '));
//             acc = [l];
//         } else {
//             acc.push(l);
//         }
//     }
//     if (acc.length) chunks.push(acc.join(' '));

//     return chunks.map((c, i) => {
//         const lower = c.toLowerCase();
//         let type = 'inclusion';
//         if (lower.includes('exclude') || lower.includes('not covered')) type = 'exclusion';
//         if (lower.includes('waiting') || (lower.includes('after') && lower.includes('month'))) type = 'waiting';
//         if (lower.includes('limit') || lower.includes('maximum') || lower.includes('sum insured')) type = 'limit';

//         // Pick only the first monetary amount as a representative limit
//         const amounts = c.match(/(?:₹|\bRs\.?)\s?[\d,]+(?:\.\d+)?/g);
//         const firstAmount = Array.isArray(amounts) ? amounts : (amounts || null);
//         const limit = firstAmount ? String(firstAmount).replace(/\s+/g, ' ').trim() : null;

//         return { id: `C${i + 1}`, text: c, type, limit };
//     });
// };

// export const parsePolicyClauses = (rawText) => toClauses(rawText);






//****************************************************************************************************** */
//****************************************************************************************************** */
//****************************************************************************************************** */

// // File: backend/src/services/policy-parse-service.js
// const extractAmounts = (text) => {
//     const m = text.match(/(?:₹|\bRs.?)\s?[\d,]+(?:.\d+)?/g);
//     return Array.isArray(m) ? m.map(s => String(s).trim()) : (m ? [String(m).trim()] : []);
// };

// const inferTypeFromTitle = (title = '') => {
//     const low = title.toLowerCase();
//     if (low.includes('exclusion')) return 'exclusion';
//     return 'inclusion';
// };

// const prettyLimit = (title = '', amounts = []) => {
//     const low = title.toLowerCase();
//     if (!amounts.length) return null;

//     // Diabetes: Annual + Lifetime if present
//     if (low.includes('diabetes')) {
//         const annual = amounts;
//         const lifetime = amounts;
//        if (annual && lifetime) return `${annual} / year (${lifetime})`;
// if (annual) return `${annual} / year`;

//     }

//     // Hypertension & Cardiac: Annual only
//     if (low.includes('hypertension') || low.includes('cardiac')) {
//         const annual = amounts;
//         if (annual) return `${ annual } / year`;
//     }

//     // Hospitalization may have per day + overall; keep all joined once
//     if (low.includes('hospitalization') || low.includes('room')) {
//         return amounts.join(', ');
//     }

//     // Dialysis: amounts uncommon; keep raw
//     if (low.includes('dialysis')) return amounts.join(', ');

//     // Generic: first amount
//     return amounts || null;
// };

// const parseCoverageSections = (raw = '') => {
//     const text = String(raw || '');

//     // Split by "Section N: Title" while keeping delimiters
//     const parts = text.split(/(?:^|\n)\sSection\s(\d+)\s*:\s*([^\n]+)\s*/i);

//     // If no sections found, fall back to simple numeric chunks
//     if (parts.length <= 1) return null;

//     const clauses = [];
//     // parts structure: [prefix, secNo, title, body, secNo, title, body, ...]
//     // First element may be preface; start from index 1
//     for (let i = 1; i < parts.length; i += 3) {
//         const secNo = parts[i];
//         const title = parts[i + 1] || '';
//         const body = parts[i + 2] || '';
//         const id = `Sec ${secNo}`;
//         const label = `Sec ${secNo} – ${title.trim()}`;
//         const textBlock = `${title.trim()} ${body.replace(/\s+/g, ' ').trim()}`.trim();

//         const type = inferTypeFromTitle(title);
//         const amts = extractAmounts(textBlock);
//         const limit = prettyLimit(title, amts);

//         clauses.push({ id, label, text: textBlock, type, limit });
//     }
//     return clauses;
// };

// const parseExclusions = (raw = '') => {
//     const text = String(raw || '');
//     const exIndex = text.toLowerCase().indexOf('exclusions');
//     if (exIndex < 0) return [];

//     // Capture everything after "Exclusions:"
//     const tail = text.slice(exIndex);
//     const lines = tail.split('\n').map(s => s.trim()).filter(Boolean);

//     // Skip the header line, take following bullet-like lines as separate exclusion clauses
//     const out = [];
//     for (let i = 1; i < lines.length; i++) {
//         const l = lines[i];
//         // Stop if a new major header starts
//         if (/^section\s*\d+\s*:/i.test(l)) break;
//         // Consider each non-empty line as a potential exclusion item
//         if (l.length >= 3) {
//             out.push({
//                 id: `EXC${out.length + 1}`,
//                 label: 'Exclusions',
//                 text: l,
//                 type: 'exclusion',
//                 limit: null,
//             });
//         }
//     }
//     return out;
// };

// export const parsePolicyClauses = (rawText = '') => {
//     // Try structured "Section N" parsing first
//     const sections = parseCoverageSections(rawText);
//     const exclusions = parseExclusions(rawText);

//     if (sections && sections.length) {
//         // Merge exclusions at end
//         return [...sections, ...exclusions];
//     }

//     // Fallback: simple numbered chunks (legacy)
//     const lines = String(rawText || '').split('\n').map(l => l.trim()).filter(Boolean);
//     const chunks = [];
//     let acc = [];
//     for (const l of lines) {
//         if (/^\d+[).]/.test(l) && acc.length) {
//             chunks.push(acc.join(' '));
//             acc = [l];
//         } else {
//             acc.push(l);
//         }
//     }
//     if (acc.length) chunks.push(acc.join(' '));

//     return chunks.map((c, i) => {
//         const lower = c.toLowerCase();
//         let type = 'inclusion';
//         if (lower.includes('exclude') || lower.includes('not covered')) type = 'exclusion';
//         if (lower.includes('waiting') || (lower.includes('after') && lower.includes('month'))) type = 'waiting';
//         if (lower.includes('limit') || lower.includes('maximum') || lower.includes('sum insured')) type = 'limit';
//         const amounts = extractAmounts(c);
//         const limit = prettyLimit('', amounts);

//         const id = `C${i + 1}`;
//         return { id, label: id, text: c, type, limit };
//     });
// };























// File: backend/src/services/policy-parse-service.js
// File: backend/src/services/policy-parse-service.js

// // Extract all ₹ or Rs. amounts from a string dynamically
// const extractAmounts = (text) => {
//   const m = text.match(/(?:₹|\bRs\.?)\s?[\d,]+(?:\.\d+)?/g);
//   return Array.isArray(m) ? m.map(s => s.trim()) : [];
// };

// // Infer clause type from title
// const inferTypeFromTitle = (title = '') => {
//   const low = title.toLowerCase();
//   if (low.includes('exclusion')) return 'exclusion';
//   if (low.includes('waiting')) return 'waiting';
//   return 'inclusion';
// };

// // Generate readable limit dynamically
// const prettyLimit = (title = '', amounts = []) => {
//   if (!amounts.length) return null;
//   return amounts.join(', ');
// };

// // Parse structured coverage sections dynamically
// const parseCoverageSections = (raw = '') => {
//   const text = String(raw || '');
//   const parts = text.split(/(?:^|\n)\s*Section\s+(\d+)\s*:\s*([^\n]+)\s*/i);
//   if (parts.length <= 1) return [];

//   const clauses = [];
//   for (let i = 1; i < parts.length; i += 3) {
//     const secNo = parts[i];
//     const title = parts[i + 1] || '';
//     const body = parts[i + 2] || '';
//     const id = `Sec${secNo}`;
//     const label = `Sec ${secNo} – ${title.trim()}`;
//     const textBlock = `${title.trim()} ${body.replace(/\s+/g, ' ').trim()}`.trim();

//     const type = inferTypeFromTitle(title);
//     const amounts = extractAmounts(textBlock);
//     const limit = prettyLimit(title, amounts);

//     clauses.push({ id, label, text: textBlock, type, limit });
//   }
//   return clauses;
// };

// // Parse exclusions dynamically
// const parseExclusions = (raw = '') => {
//   const text = String(raw || '');
//   const exIndex = text.toLowerCase().indexOf('exclusions');
//   if (exIndex < 0) return [];

//   const tail = text.slice(exIndex);
//   const lines = tail.split('\n').map(s => s.trim()).filter(Boolean);

//   const out = [];
//   for (let i = 1; i < lines.length; i++) {
//     const l = lines[i];
//     if (/^section\s*\d+\s*:/i.test(l)) break;
//     if (l.length >= 3) {
//       out.push({
//         id: `EXC${out.length + 1}`,
//         label: 'Exclusion',
//         text: l,
//         type: 'exclusion',
//         limit: null,
//       });
//     }
//   }
//   return out;
// };

// // Main entry: parse policy dynamically
// export const parsePolicyClauses = (rawText = '') => {
//   const sections = parseCoverageSections(rawText);
//   const exclusions = parseExclusions(rawText);
//   return [...sections, ...exclusions];
// };















// File: backend/src/services/policy-parse-service.js

// // Extract ₹ or Rs. amounts
// const extractAmounts = (text) => {
//   const m = text.match(/(?:₹|\bRs\.?)\s?[\d,]+(?:\.\d+)?/g);
//   return Array.isArray(m) ? m.map(s => s.trim()) : (m ? [m.trim()] : []);
// };

// // Infer clause type
// const inferTypeFromTitle = (title = '') => {
//   const low = title.toLowerCase();
//   if (low.includes('exclusion')) return 'exclusion';
//   if (low.includes('waiting')) return 'waiting';
//   return 'inclusion';
// };

// // Pretty print limit
// const prettyLimit = (title = '', amounts = []) => {
//   if (!amounts.length) return null;
//   return amounts.join(', ');
// };

// // Parse sections like "Section N: Title"
// const parseCoverageSections = (raw = '') => {
//   const parts = raw.split(/(?:^|\n)\s*Section\s+(\d+)\s*:\s*([^\n]+)/i);
//   if (parts.length <= 1) return [];

//   const clauses = [];
//   for (let i = 1; i < parts.length; i += 3) {
//     const secNo = parts[i];
//     const title = parts[i + 1] || '';
//     const body = parts[i + 2] || '';
//     const id = `Sec${secNo}`;
//     const label = `Sec ${secNo} – ${title.trim()}`;
//     const textBlock = `${title.trim()} ${body.replace(/\s+/g, ' ').trim()}`;
//     const type = inferTypeFromTitle(title);
//     const amts = extractAmounts(textBlock);
//     const limit = prettyLimit(title, amts);
//     clauses.push({ id, label, text: textBlock, type, limit });
//   }
//   return clauses;
// };

// // Parse exclusions
// const parseExclusions = (raw = '') => {
//   const text = String(raw || '');
//   const exIndex = text.toLowerCase().indexOf('exclusions');
//   if (exIndex < 0) return [];
//   const tail = text.slice(exIndex);
//   const lines = tail.split('\n').map(s => s.trim()).filter(Boolean);

//   const out = [];
//   for (let i = 1; i < lines.length; i++) {
//     const l = lines[i];
//     if (/^section\s*\d+\s*:/i.test(l)) break;
//     if (l.length >= 3) {
//       out.push({
//         id: `EXC${out.length + 1}`,
//         label: 'Exclusion',
//         text: l,
//         type: 'exclusion',
//         limit: null,
//       });
//     }
//   }
//   return out;
// };

// // Main entry: parse policy into structured clauses
// export const parsePolicyClauses = (rawText = '') => {
//   const sections = parseCoverageSections(rawText);
//   const exclusions = parseExclusions(rawText);
//   return [...sections, ...exclusions];
// };






























































// File: backend/src/services/policy-parse-service.js

// --- Utility: extract ₹/Rs. amounts and numeric counts (sessions, times)
const extractAmountsAndCounts = (text) => {
  const amounts = [];
  const numbers = [];

  // ₹ or Rs. amounts
  const m1 = text.match(/(?:₹|\bRs\.?)\s?[\d,]+(?:\.\d+)?/g);
  if (Array.isArray(m1)) amounts.push(...m1.map(s => s.trim()));

  // Numbers with 'sessions', 'times', 'per year', 'lifetime', etc.
  const m2 = text.match(/(\d+\s*(?:sessions|times|per year|lifetime|annual))/gi);
  if (Array.isArray(m2)) numbers.push(...m2.map(s => s.trim()));

  // Combine all
  return [...amounts, ...numbers];
};

// --- Infer clause type from heading/title
const inferTypeFromTitle = (title = '') => {
  const low = title.toLowerCase();
  if (low.includes('exclusion')) return 'exclusion';
  if (low.includes('waiting')) return 'waiting';
  return 'inclusion';
};

// --- Make clean human-readable "limit" string
const prettyLimit = (title = '', extracted = []) => {
  if (!extracted.length) return null;

  const low = title.toLowerCase();

  // Diabetes: Annual + Lifetime
  if (low.includes('diabetes') && extracted.length >= 2) {
    return extracted.join(', ');
  }

  // Hypertension / Cardiac
  if (low.includes('hypertension') || low.includes('cardiac')) {
    return extracted.join(', ');
  }

  // Hospitalization / Room Rent
  if (low.includes('hospitalization') || low.includes('room')) {
    return extracted.join(', ');
  }

  // Dialysis or sessions → just return all extracted
  if (low.includes('dialys') || extracted.some(s => /sessions/i.test(s))) {
    return extracted.join(', ');
  }

  // Critical Illness → may have big limit
  if (low.includes('critical')) return extracted.join(', ');

  // Ambulance etc.
  if (low.includes('ambulance')) return extracted.join(', ');

  // Fallback → join everything
  return extracted.join(', ');
};

// --- Parse "Section N: Title" style structured policies
const parseCoverageSections = (raw = '') => {
  const text = String(raw || '');
  const parts = text.split(/(?:^|\n)\s*Section\s+(\d+)\s*:\s*([^\n]+)\s*/i);

  if (parts.length <= 1) return null;

  const clauses = [];
  for (let i = 1; i < parts.length; i += 3) {
    const secNo = parts[i];
    const title = parts[i + 1] || '';
    const body = parts[i + 2] || '';
    const id = `Sec${secNo}`;
    const label = `Sec ${secNo} – ${title.trim()}`;
    const textBlock = `${title.trim()} ${body.replace(/\s+/g, ' ').trim()}`.trim();

    const type = inferTypeFromTitle(title);
    const extracted = extractAmountsAndCounts(textBlock);
    const limit = prettyLimit(title, extracted);

    clauses.push({ id, label, text: textBlock, type, limit });
  }
  return clauses;
};

// --- Parse Exclusions
const parseExclusions = (raw = '') => {
  const text = String(raw || '');
  const exIndex = text.toLowerCase().indexOf('exclusions');
  if (exIndex < 0) return [];

  const tail = text.slice(exIndex);
  const lines = tail.split('\n').map(s => s.trim()).filter(Boolean);

  const out = [];
  for (let i = 1; i < lines.length; i++) {
    const l = lines[i];
    if (/^section\s*\d+\s*:/i.test(l)) break;
    if (l.length >= 3) {
      out.push({
        id: `EXC${out.length + 1}`,
        label: 'Exclusion',
        text: l,
        type: 'exclusion',
        limit: null,
      });
    }
  }
  return out;
};

// --- Main entry: parse policy into structured clauses
export const parsePolicyClauses = (rawText = '') => {
  const sections = parseCoverageSections(rawText);
  const exclusions = parseExclusions(rawText);

  if (sections && sections.length) {
    return [...sections, ...exclusions];
  }

  // Fallback: plain numbered list
  const lines = String(rawText || '').split('\n').map(l => l.trim()).filter(Boolean);
  const chunks = [];
  let acc = [];
  for (const l of lines) {
    if (/^\d+[).]/.test(l) && acc.length) {
      chunks.push(acc.join(' '));
      acc = [l];
    } else {
      acc.push(l);
    }
  }
  if (acc.length) chunks.push(acc.join(' '));

  return chunks.map((c, i) => {
    const lower = c.toLowerCase();
    let type = 'inclusion';
    if (lower.includes('exclude') || lower.includes('not covered')) type = 'exclusion';
    if (lower.includes('waiting') || (lower.includes('after') && lower.includes('month'))) type = 'waiting';
    if (lower.includes('limit') || lower.includes('maximum') || lower.includes('sum insured')) type = 'limit';

    const extracted = extractAmountsAndCounts(c);
    const limit = prettyLimit('', extracted);

    const id = `C${i + 1}`;
    return { id, label: id, text: c, type, limit };
  });
};
