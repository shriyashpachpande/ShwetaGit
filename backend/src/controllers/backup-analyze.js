// // File: backend/src/controllers/multi-analyze-controller.js
// import MultiReport from '../models/multi-report-model.js';
// import MultiPolicy from '../models/multi-policy-model.js';
// import MultiAnalysis from '../models/multi-analysis-model.js';
// import { normalizeDiagnosis } from '../services/diagnosis-normalize-service.js';
// import { bestClauseMatch } from '../services/embedding-match-service.js';
// import { analyzeWithGemini } from '../services/gemini-service.js';
// import { MIN_REPORTS, MAX_REPORTS } from '../config/constants.js';

// const toStr = (v) => (v == null ? '' : String(v));
// const toNumOrUndef = (v) =>
//     Number.isFinite(v) ? v : Number.isFinite(Number(v)) ? Number(v) : undefined;
// const firstOfArrAsStr = (v) => {
//     if (Array.isArray(v)) return v.length ? toStr(v) : '';
//     return toStr(v);
// };

// // small helper to produce candidate keywords from a diagnosis string
// const diagToKeywords = (diag) => {
//     if (!diag) return [];
//     const s = diag.toLowerCase();
//     // common phrase synonyms mapping (expandable)
//     const synonyms = {
//         diabetes: ['diabetes', 'type 2', 'type ii', 't2dm', 'hyperglycemia', 'a1c', 'hba1c', 'metformin', 'insulin', 'glucose', 'dm', 'diabetic', 'diabet', 'diab', 'glycemic', 'glycaemic', 'hyperglycaemia', 'type 1', 'type i', 't1dm', 'lifestyle', 'diet', 'weight loss', 'obesity', 'overweight'],
//         hypertension: ['hypertension', 'high blood pressure', 'blood pressure', 'bp', 'hypertens', 'amlodipine', 'lifestyle', 'diet', 'weight loss', 'obesity', 'overweight', 'exercise', 'smoking', 'alcohol', 'salt', 'sodium', 'diuretics'],
//         cardiac: ['heart', 'cardiac', 'myocardial', 'angina', 'mi', 'heart attack', 'cabg', 'stent', 'chf', 'congestive heart failure', 'cad', 'coronary artery disease', 'arrhythmia', 'afib', 'atrial fibrillation', 'palpitation', 'beta blocker', 'ace inhibitor', 'statin', 'atorvastatin', 'lipitor'],
//         kidney: ['kidney', 'renal', 'ckd', 'chronic kidney disease', 'dialysis', 'esrd', 'end stage renal disease', 'nephropathy', 'proteinuria', 'creatinine', 'eGFR', 'glomerular filtration rate', 'albuminuria', 'ace inhibitor', 'arb', 'lisinopril', 'losartan', 'diet', 'low protein', 'low salt', 'fluid restriction'],
//         anemia: ['anemia', 'anaemia', 'iron deficiency', 'hemoglobin', 'hb', 'hematocrit', 'hct', 'b12 deficiency', 'folate deficiency', 'iron supplements', 'b12 injections', 'fatigue', 'pallor', 'shortness of breath', 'tachycardia', 'dizziness', 'lightheadedness', 'bleeding', 'menorrhagia', 'gi bleed', 'gastrointestinal bleed', 'chronic disease'],
//         thyroid: ['thyroid', 'hypothyroid', 'levothyroxine', 'hashimoto', 'goiter', 'thyroxine', 'tsh', 'ft4', 'free t4', 't3', 'free t3', 'thyroidectomy', 'radioactive iodine', 'graves', 'hyperthyroid', 'thyroiditis', 'autoimmune thyroid disease', 'autoimmune thyroiditis', 'diet', 'iodine', 'selenium', 'iron', 'zinc', 'vitamin d'],
//         cholesterol: ['cholesterol', 'hyperlipidemia', 'ldl', 'hdl', 'triglyceride', 'triglyc', 'dyslipidemia', 'statin', 'atorvastatin', 'simvastatin', 'rosuvastatin', 'pravastatin', 'diet', 'exercise', 'weight loss', 'obesity', 'overweight', 'smoking', 'alcohol', 'fiber', 'omega-3'],
//         gastro: ['gastroenteritis', 'dehydration', 'diarrhea', 'vomiting', 'abdominal pain', 'nausea', 'constipation', 'ibs', 'inflammatory bowel disease', 'crohn', 'ulcerative colitis', 'gastroesophageal reflux disease', 'gerd', 'peptic ulcer disease', 'pud', 'h pylori', 'helicobacter pylori', 'lifestyle', 'diet', 'hydration', 'fiber', 'probiotics',],
//         critical: ['cancer', 'malignancy', 'stroke', 'critical illness', 'chemotherapy', 'radiation therapy', 'immunotherapy', 'surgery', 'tumor', 'metastasis', 'metastatic', 'carcinoma', 'sarcoma', 'leukemia', 'lymphoma', 'melanoma', 'palliative', 'hospice', 'end of life', 'terminal', 'life expectancy', 'poor prognosis', 'poor outcome', 'icu', 'intensive care unit', 'sepsis', 'septic shock', 'multi-organ failure', 'organ failure', 'coma', 'mechanical ventilation', 'ventilator', 'tracheostomy', 'feeding tube', 'dialysis'],
//         respiratory: ['asthma', 'copd', 'chronic obstructive pulmonary disease', 'bronchitis', 'emphysema', 'shortness of breath', 'dyspnea', 'wheezing', 'cough', 'sputum', 'smoking', 'tobacco', 'nicotine', 'inhaler', 'bronchodilator', 'steroid inhaler', 'pulmonary rehabilitation', 'oxygen therapy'],
//         mental: ['depression', 'anxiety', 'bipolar disorder', 'schizophrenia', 'mental health', 'psychiatric', 'antidepressant', 'ssri', 'snri', 'benzodiazepine', 'mood stabilizer', 'therapy', 'counseling', 'psychotherapy', 'cbt', 'cognitive behavioral therapy', 'mindfulness', 'meditation', 'exercise'],
//         neuro: ['stroke', 'cerebrovascular accident', 'tia', 'transient ischemic attack', 'seizure', 'epilepsy', 'headache', 'migraine', 'dementia', 'alzheimers', 'parkinson', 'multiple sclerosis', 'ms', 'neuropathy', 'neurological disorder', 'anticonvulsant', 'antiepileptic', 'dopamine agonist', 'acetylcholinesterase inhibitor', 'physical therapy', 'occupational therapy', 'speech therapy'],
//         infection: ['hiv', 'aids', 'hepatitis b', 'hepatitis c', 'tuberculosis', 'tb', 'std', 'sti', 'sexually transmitted disease', 'sexually transmitted infection', 'antiretroviral therapy', 'art', 'antibiotic', 'antiviral', 'antifungal', 'vaccination', 'immunization', 'influenza', 'flu', 'pneumonia', 'covid-19', 'coronavirus', 'sepsis', 'meningitis', 'encephalitis'],
//         autoimmune: ['lupus', 'rheumatoid arthritis', 'ra', 'multiple sclerosis', 'ms', 'inflammatory bowel disease', 'crohn', 'ulcerative colitis', 'psoriasis', 'scleroderma', 'sjogren', 'vasculitis', 'immunosuppressant', 'biologic therapy', 'steroid', 'methotrexate', 'azathioprine', 'mycophenolate mofetil'],
//         injury: ['fracture', 'sprain', 'strain', 'dislocation', 'concussion', 'traumatic brain injury', 'tbi', 'whiplash', 'soft tissue injury', 'physical therapy', 'rehabilitation', 'pain management', 'brace', 'cast', 'surgery'],
//         pregnancy: ['pregnancy', 'prenatal', 'antenatal', 'postnatal', 'obstetric', 'gynecologic', 'gyn', 'labor', 'delivery', 'cesarean section', 'c-section', 'miscarriage', 'abortion', 'ectopic pregnancy', 'preeclampsia', 'gestational diabetes', 'folic acid', 'iron supplements', 'calcium supplements', 'vitamin d'],
//         pediatric: ['asthma', 'allergy', 'eczema', 'otitis media', 'tonsillitis', 'pharyngitis', 'gastroenteritis', 'constipation', 'diarrhea', 'failure to thrive', 'developmental delay', 'immunization', 'vaccination', 'well child visit', 'school physical', 'adhd', 'autism spectrum disorder', 'asd', 'learning disability'],
//         elderly: ['dementia', 'alzheimers', 'parkinson', 'falls', 'osteoporosis', 'arthritis', 'polypharmacy', 'depression', 'anxiety', 'insomnia', 'malnutrition', 'incontinence', 'pressure ulcer', 'social isolation', 'caregiver stress', 'advance directive', 'living will', 'power of attorney'],
//         trauma: ['trauma', 'post-traumatic stress disorder', 'ptsd', 'acute stress disorder', 'anxiety', 'depression', 'substance abuse', 'addiction', 'self-harm', 'suicidal ideation', 'crisis intervention', 'cognitive behavioral therapy', 'cbt', 'eye movement desensitization and reprocessing', 'emdr', 'psychotherapy'],
//         other: ['fatigue', 'weight loss', 'fever', 'night sweats', 'pain', 'inflammation', 'infection', 'swelling', 'redness', 'itching', 'rash', 'numbness', 'tingling', 'weakness', 'dizziness', 'lightheadedness', 'palpitations', 'syncope', 'edema', 'constipation', 'diarrhea', 'bloating', 'heartburn', 'acid reflux', 'cough', 'shortness of breath', 'wheezing'],
//         chronic: ['chronic pain', 'fibromyalgia', 'chronic fatigue syndrome', 'irritable bowel syndrome', 'interstitial cystitis', 'migraines', 'tension headaches', 'temporomandibular joint disorder', 'tmj', 'endometriosis', 'pelvic inflammatory disease', 'chronic obstructive pulmonary disease', 'copd', 'congestive heart failure', 'chronic kidney disease', 'ckd', 'diabetes mellitus', 'hypertension'],
//         lifestyle: ['smoking cessation', 'alcohol reduction', 'weight loss', 'diet modification', 'exercise program', 'stress management', 'sleep hygiene', 'mindfulness', 'meditation', 'yoga', 'counseling', 'therapy', 'support group'],
//         preventive: ['screening', 'mammography', 'pap smear', 'colonoscopy', 'prostate exam', 'blood pressure check', 'cholesterol check', 'diabetes screening', 'immunization', 'vaccination', 'flu shot', 'pneumonia vaccine', 'covid-19 vaccine', 'bone density test', 'osteoporosis screening'],
//         dental: ['tooth decay', 'cavity', 'gingivitis', 'periodontitis', 'toothache', 'dental abscess', 'oral hygiene', 'brushing', 'flossing', 'mouthwash', 'dental cleaning', 'scaling and root planing', 'fillings', 'crowns', 'root canal', 'extraction', 'dentures', 'orthodontics', 'braces'],
//         vision: ['myopia', 'hyperopia', 'astigmatism', 'presbyopia', 'glaucoma', 'cataract', 'macular degeneration', 'diabetic retinopathy', 'dry eye', 'conjunctivitis', 'eye exam', 'vision screening', 'glasses', 'contact lenses', 'laser eye surgery'],
//         hearing: ['hearing loss', 'tinnitus', 'ear infection', 'otitis media', 'earwax impaction', 'audiometry', 'hearing aid', 'cochlear implant', 'balance disorder', 'vertigo', 'meneires disease', 'acoustic neuroma', 'ear exam'],
//         skin: ['acne', 'eczema', 'psoriasis', 'dermatitis', 'skin infection', 'cellulitis', 'fungal infection', 'melanoma', 'basal cell carcinoma', 'squamous cell carcinoma', 'skin cancer screening', 'mole check', 'biopsy'],
//         musculoskeletal: ['arthritis', 'osteoarthritis', 'rheumatoid arthritis', 'gout', 'lupus', 'fibromyalgia', 'back pain', 'neck pain', 'joint pain', 'muscle strain', 'tendonitis', 'bursitis', 'physical therapy', 'occupational therapy', 'chiropractic care', 'pain management'],
//         endocrine: ['diabetes mellitus', 'hypothyroidism', 'hyperthyroidism', 'thyroid nodule', 'goiter', 'osteoporosis', 'adrenal insufficiency', 'cushing syndrome', 'polycystic ovary syndrome', 'pcos', 'hormone replacement therapy', 'hrt', 'insulin therapy', 'oral hypoglycemic agents'],
//         gastrointestinal: ['gastroesophageal reflux disease', 'gerd', 'peptic ulcer disease', 'pud', 'irritable bowel syndrome', 'ibs', 'inflammatory bowel disease', 'crohn', 'ulcerative colitis', 'hepatitis', 'cirrhosis', 'fatty liver disease', 'cholelithiasis', 'pancreatitis', 'constipation', 'diarrhea', 'abdominal pain'],
//         respiratory: ['asthma', 'chronic obstructive pulmonary disease', 'copd', 'bronchitis', 'pneumonia', 'tuberculosis', 'lung cancer', 'pulmonary fibrosis', 'sleep apnea', 'allergic rhinitis', 'sinusitis', 'cough', 'shortness of breath'],
//         neurological: ['stroke', 'transient ischemic attack', 'tia', 'seizure', 'epilepsy', 'headache', 'migraine', 'dementia', 'alzheimers', 'parkinson', 'multiple sclerosis', 'ms', 'neuropathy', 'neurological disorder', 'anticonvulsant', 'antiepileptic', 'dopamine agonist', 'acetylcholinesterase inhibitor', 'physical therapy', 'occupational therapy', 'speech therapy'],
//     };

//     const kws = new Set();

//     // rough tokens of diagnosis (words >=4 chars)
//     s.split(/\W+/).forEach((w) => {
//         if (w.length >= 4) kws.add(w);
//     });

//     // add synonyms that match the diag string
//     Object.values(synonyms).forEach((arr) => {
//         arr.forEach((phrase) => {
//             if (s.includes(phrase)) {
//                 // add phrase and its tokens
//                 phrase.split(/\W+/).forEach((t) => t.length >= 3 && kws.add(t));
//             }
//         });
//     });

//     return Array.from(kws);
// };

// // find clause dynamically for a diagnosis using strict keyword matching
// const findClauseForDiagnosis = (diagnosis, clauses = []) => {
//     if (!diagnosis || !Array.isArray(clauses) || clauses.length === 0) {
//         return null;
//     }

//     const diagLower = diagnosis.toLowerCase();
//     const keywords = diagToKeywords(diagnosis);

//     // first pass: strong match — clause text must contain at least one full keyword token
//     for (const clause of clauses) {
//         const ctext = String(clause.text || '').toLowerCase();
//         const hit = keywords.some((k) => k && ctext.includes(k));
//         if (hit) return { clause, hitType: 'keyword' };
//     }

//     // second pass: try phrase-based match (e.g., "diabetes" vs "diabetes treatment")
//     const phraseChecks = ['diabetes', 'hypertension', 'kidney', 'cancer', 'stroke', 'dialysis', 'cholesterol', 'anemia'];
//     for (const p of phraseChecks) {
//         if (diagLower.includes(p)) {
//             const found = clauses.find((c) => String(c.text || '').toLowerCase().includes(p));
//             if (found) return { clause: found, hitType: 'phrase' };
//         }
//     }

//     // third pass: fallback to embedding-based bestClauseMatch (informational only)
//     try {
//         const { clause: embClause, score } = bestClauseMatch(`${diagnosis}`, clauses || []);
//         if (embClause && score > 0.5) {
//             return { clause: embClause, hitType: 'embedding', score };
//         }
//     } catch (e) {
//         // ignore bestClauseMatch errors — safe fallback
//     }

//     return null;
// };

// export const analyzeBundle = async (req, res, next) => {
//     try {
//         const { reportIds = [], policyId } = req.body || {};
//         if (!Array.isArray(reportIds) || !policyId) {
//             return res.status(400).json({ error: 'reportIds[] and policyId required' });
//         }
//         if (reportIds.length < MIN_REPORTS || reportIds.length > MAX_REPORTS) {
//             return res.status(400).json({
//                 error: `Reports must be between ${MIN_REPORTS} - ${MAX_REPORTS}`,
//             });
//         }

//         const reports = await MultiReport.find({ _id: { $in: reportIds } }).lean();
//         const policy = await MultiPolicy.findById(policyId).lean();
//         if (!reports.length || !policy) {
//             return res.status(404).json({ error: 'Reports or policy not found' });
//         }

//         // Normalize diagnoses and ensure treatments array
//         const enriched = reports.map((r) => {
//             const diags = (r.extracted?.diagnoses || []).map(normalizeDiagnosis);
//             const trArr = Array.isArray(r.extracted?.treatments)
//                 ? r.extracted.treatments
//                 : r.extracted?.treatments
//                     ? [r.extracted.treatments]
//                     : [];
//             return {
//                 ...r,
//                 extracted: {
//                     ...r.extracted,
//                     diagnoses: diags,
//                     treatments: trArr,
//                 },
//             };
//         });

//         // Heuristic/dynamic pre-match using policy.clauses
//         const heuristicRows = [];
//         for (const r of enriched) {
//             const diags = r.extracted?.diagnoses?.length ? r.extracted.diagnoses : ['Unknown'];
//             const treatmentStr = firstOfArrAsStr(r.extracted?.treatments);

//             for (const d of diags) {
//                 // default values
//                 let covered = 'No';
//                 let policyClause = 'N/A';
//                 let limit = 'N/A';
//                 let conf = 20;
//                 let explain = 'No matching policy clause';

//                 // attempt to find clause dynamically for this diagnosis
//                 const match = findClauseForDiagnosis(d, policy.clauses || []);

//                 if (match && match.clause) {
//                     // we only set covered = Yes for strong keyword/phrase hits
//                     const cl = match.clause;
//                     const ctext = String(cl.text || '').trim();
//                     policyClause = cl.label || cl.id || 'N/A';
//                     limit = cl.limit || 'N/A';

//                     if (match.hitType === 'keyword' || match.hitType === 'phrase') {
//                         // strong match -> covered yes unless clause is explicit exclusion
//                         if (String(cl.type || '').toLowerCase() === 'exclusion') {
//                             covered = 'No';
//                             conf = Math.max(conf, 50);
//                             explain = `Matched clause but clause is exclusion`;
//                         } else {
//                             covered = 'Yes';
//                             conf = Math.max(conf, 70);
//                             explain = `Matched clause by keywords/phrase`;
//                         }
//                     } else if (match.hitType === 'embedding') {
//                         // embedding match: keep conservative — only Yes if clause type is inclusion/limit and score high
//                         const score = match.score || 0;
//                         if (String(cl.type || '').toLowerCase() !== 'exclusion' && score > 0.75) {
//                             covered = 'Yes';
//                             conf = Math.round(Math.max(conf, score * 100));
//                             explain = `Embedding-based match (score ${Math.round(score * 100)}%)`;
//                         } else {
//                             covered = 'No';
//                             conf = Math.max(conf, 30);
//                             explain = `Embedding match too weak or clause exclusion`;
//                         }
//                     }
//                 } else {
//                     // No clause found -> keep No
//                     covered = 'No';
//                     explain = 'No matching policy clause';
//                 }

//                 heuristicRows.push({
//                     reportFile: toStr(r.filename),
//                     name: toStr(r.extracted?.name),
//                     age: toNumOrUndef(r.extracted?.age),
//                     diagnosis: toStr(d),
//                     treatment: toStr(treatmentStr),
//                     covered,
//                     policyClause,
//                     limit,
//                     confidence: Math.min(95, conf),
//                     explain,
//                 });
//             }
//         }

//         // LLM final pass (optional) — if it returns rows, we will validate them to respect strict matching rules
//         let llmRows = [];
//         try {
//             llmRows = await analyzeWithGemini({ reports: enriched, clauses: policy.clauses || [] });
//             if (Array.isArray(llmRows) && llmRows.length) {
//                 llmRows = llmRows.map((row) => {
//                     const diag = toStr(row.diagnosis);
//                     const match = findClauseForDiagnosis(diag, policy.clauses || []);
//                     if (String(row.covered).toLowerCase().includes('yes') && !match) {
//                         return {
//                             ...row,
//                             covered: 'No',
//                             confidence: Math.min(50, Number(row.confidence || 30)),
//                             explain: 'LLM suggested coverage but no policy clause matched — conservative No',
//                             policyClause: 'N/A',
//                             limit: 'N/A',
//                         };
//                     } else if (match && match.clause) {
//                         // INSERT THIS NORMALIZATION BLOCK
//                         const cl = match.clause;
//                         return {
//                             ...row,
//                             policyClause: row.policyClause || cl.label || cl.id || 'N/A',
//                             limit: row.limit || cl.limit || 'N/A',
//                         };
//                     }

//                     return row;
//                 });
//             }
//         } catch (e) {
//             console.warn('Gemini failed, using heuristic only:', e.message);
//             llmRows = [];
//         }

//         // Normalize final rows for schema safety (prefer LLM-validated rows else heuristic)
//         const finalSource = llmRows?.length ? llmRows : heuristicRows;
//         const rows = (finalSource || []).map((row) => {
//             const safeRow = {
//                 reportFile: toStr(row.reportFile),
//                 name: toStr(row.name),
//                 age: toNumOrUndef(row.age),
//                 diagnosis: toStr(row.diagnosis),
//                 treatment: firstOfArrAsStr(row.treatment),
//                 covered:
//                     row.covered === true
//                         ? 'Yes'
//                         : row.covered === false
//                             ? 'No'
//                             : toStr(row.covered).toLowerCase().includes('yes')
//                                 ? 'Yes'
//                                 : 'No',
//                 policyClause: toStr(row.policyClause || 'N/A'),
//                 limit: row.limit == null ? 'N/A' : toStr(row.limit),
//                 confidence: Number.isFinite(row.confidence) ? row.confidence : 50,
//                 explain: toStr(row.explain || ''),
//             };
//             return safeRow;
//         });

//         const saved = await MultiAnalysis.create({
//             policyId: policy._id,
//             reportIds: reports.map((r) => r._id),
//             rows,
//         });

//         res.json({ analysisId: saved._id, rows });
//     } catch (e) {
//         next(e);
//     }
// };




















































































































































// File: backend/src/controllers/multi-analyze-controller.js
import MultiReport from '../models/multi-report-model.js';
import MultiPolicy from '../models/multi-policy-model.js';
import MultiAnalysis from '../models/multi-analysis-model.js';
import { normalizeDiagnosis } from '../services/diagnosis-normalize-service.js';
import { bestClauseMatch } from '../services/embedding-match-service.js';
import { analyzeWithGemini } from '../services/gemini-service.js';
import { MIN_REPORTS, MAX_REPORTS } from '../config/constants.js';

const toStr = (v) => (v == null ? '' : String(v));
const toNumOrUndef = (v) =>
    Number.isFinite(v) ? v : Number.isFinite(Number(v)) ? Number(v) : undefined;
const firstOfArrAsStr = (v) => {
    if (Array.isArray(v)) return v.length ? toStr(v) : '';
    return toStr(v);
};

// small helper to produce candidate keywords from a diagnosis string
const diagToKeywords = (diag) => {
    if (!diag) return [];
    const s = diag.toLowerCase();
    // common phrase synonyms mapping (expandable)
    const synonyms = {
        diabetes: ['diabetes', 'type 2', 'type ii', 't2dm', 'hyperglycemia', 'a1c', 'hba1c', 'metformin', 'insulin', 'glucose', 'dm', 'diabetic', 'diabet', 'diab', 'glycemic', 'glycaemic', 'hyperglycaemia', 'type 1', 'type i', 't1dm', 'lifestyle', 'diet', 'weight loss', 'obesity', 'overweight'],
        hypertension: ['hypertension', 'high blood pressure', 'blood pressure', 'bp', 'hypertens', 'amlodipine', 'lifestyle', 'diet', 'weight loss', 'obesity', 'overweight', 'exercise', 'smoking', 'alcohol', 'salt', 'sodium', 'diuretics'],
        cardiac: ['heart', 'cardiac', 'myocardial', 'angina', 'mi', 'heart attack', 'cabg', 'stent', 'chf', 'congestive heart failure', 'cad', 'coronary artery disease', 'arrhythmia', 'afib', 'atrial fibrillation', 'palpitation', 'beta blocker', 'ace inhibitor', 'statin', 'atorvastatin', 'lipitor'],
        kidney: ['kidney', 'renal', 'ckd', 'chronic kidney disease', 'dialysis', 'esrd', 'end stage renal disease', 'nephropathy', 'proteinuria', 'creatinine', 'eGFR', 'glomerular filtration rate', 'albuminuria', 'ace inhibitor', 'arb', 'lisinopril', 'losartan', 'diet', 'low protein', 'low salt', 'fluid restriction'],
        anemia: ['anemia', 'anaemia', 'iron deficiency', 'hemoglobin', 'hb', 'hematocrit', 'hct', 'b12 deficiency', 'folate deficiency', 'iron supplements', 'b12 injections', 'fatigue', 'pallor', 'shortness of breath', 'tachycardia', 'dizziness', 'lightheadedness', 'bleeding', 'menorrhagia', 'gi bleed', 'gastrointestinal bleed', 'chronic disease'],
        thyroid: ['thyroid', 'hypothyroid', 'levothyroxine', 'hashimoto', 'goiter', 'thyroxine', 'tsh', 'ft4', 'free t4', 't3', 'free t3', 'thyroidectomy', 'radioactive iodine', 'graves', 'hyperthyroid', 'thyroiditis', 'autoimmune thyroid disease', 'autoimmune thyroiditis', 'diet', 'iodine', 'selenium', 'iron', 'zinc', 'vitamin d'],
        cholesterol: ['cholesterol', 'hyperlipidemia', 'ldl', 'hdl', 'triglyceride', 'triglyc', 'dyslipidemia', 'statin', 'atorvastatin', 'simvastatin', 'rosuvastatin', 'pravastatin', 'diet', 'exercise', 'weight loss', 'obesity', 'overweight', 'smoking', 'alcohol', 'fiber', 'omega-3'],
        gastro: ['gastroenteritis', 'dehydration', 'diarrhea', 'vomiting', 'abdominal pain', 'nausea', 'constipation', 'ibs', 'inflammatory bowel disease', 'crohn', 'ulcerative colitis', 'gastroesophageal reflux disease', 'gerd', 'peptic ulcer disease', 'pud', 'h pylori', 'helicobacter pylori', 'lifestyle', 'diet', 'hydration', 'fiber', 'probiotics',],
        critical: ['cancer', 'malignancy', 'stroke', 'critical illness', 'chemotherapy', 'radiation therapy', 'immunotherapy', 'surgery', 'tumor', 'metastasis', 'metastatic', 'carcinoma', 'sarcoma', 'leukemia', 'lymphoma', 'melanoma', 'palliative', 'hospice', 'end of life', 'terminal', 'life expectancy', 'poor prognosis', 'poor outcome', 'icu', 'intensive care unit', 'sepsis', 'septic shock', 'multi-organ failure', 'organ failure', 'coma', 'mechanical ventilation', 'ventilator', 'tracheostomy', 'feeding tube', 'dialysis'],
        respiratory: ['asthma', 'copd', 'chronic obstructive pulmonary disease', 'bronchitis', 'emphysema', 'shortness of breath', 'dyspnea', 'wheezing', 'cough', 'sputum', 'smoking', 'tobacco', 'nicotine', 'inhaler', 'bronchodilator', 'steroid inhaler', 'pulmonary rehabilitation', 'oxygen therapy'],
        mental: ['depression', 'anxiety', 'bipolar disorder', 'schizophrenia', 'mental health', 'psychiatric', 'antidepressant', 'ssri', 'snri', 'benzodiazepine', 'mood stabilizer', 'therapy', 'counseling', 'psychotherapy', 'cbt', 'cognitive behavioral therapy', 'mindfulness', 'meditation', 'exercise'],
        neuro: ['stroke', 'cerebrovascular accident', 'tia', 'transient ischemic attack', 'seizure', 'epilepsy', 'headache', 'migraine', 'dementia', 'alzheimers', 'parkinson', 'multiple sclerosis', 'ms', 'neuropathy', 'neurological disorder', 'anticonvulsant', 'antiepileptic', 'dopamine agonist', 'acetylcholinesterase inhibitor', 'physical therapy', 'occupational therapy', 'speech therapy'],
        infection: ['hiv', 'aids', 'hepatitis b', 'hepatitis c', 'tuberculosis', 'tb', 'std', 'sti', 'sexually transmitted disease', 'sexually transmitted infection', 'antiretroviral therapy', 'art', 'antibiotic', 'antiviral', 'antifungal', 'vaccination', 'immunization', 'influenza', 'flu', 'pneumonia', 'covid-19', 'coronavirus', 'sepsis', 'meningitis', 'encephalitis'],
        autoimmune: ['lupus', 'rheumatoid arthritis', 'ra', 'multiple sclerosis', 'ms', 'inflammatory bowel disease', 'crohn', 'ulcerative colitis', 'psoriasis', 'scleroderma', 'sjogren', 'vasculitis', 'immunosuppressant', 'biologic therapy', 'steroid', 'methotrexate', 'azathioprine', 'mycophenolate mofetil'],
        injury: ['fracture', 'sprain', 'strain', 'dislocation', 'concussion', 'traumatic brain injury', 'tbi', 'whiplash', 'soft tissue injury', 'physical therapy', 'rehabilitation', 'pain management', 'brace', 'cast', 'surgery'],
        pregnancy: ['pregnancy', 'prenatal', 'antenatal', 'postnatal', 'obstetric', 'gynecologic', 'gyn', 'labor', 'delivery', 'cesarean section', 'c-section', 'miscarriage', 'abortion', 'ectopic pregnancy', 'preeclampsia', 'gestational diabetes', 'folic acid', 'iron supplements', 'calcium supplements', 'vitamin d'],
        pediatric: ['asthma', 'allergy', 'eczema', 'otitis media', 'tonsillitis', 'pharyngitis', 'gastroenteritis', 'constipation', 'diarrhea', 'failure to thrive', 'developmental delay', 'immunization', 'vaccination', 'well child visit', 'school physical', 'adhd', 'autism spectrum disorder', 'asd', 'learning disability'],
        elderly: ['dementia', 'alzheimers', 'parkinson', 'falls', 'osteoporosis', 'arthritis', 'polypharmacy', 'depression', 'anxiety', 'insomnia', 'malnutrition', 'incontinence', 'pressure ulcer', 'social isolation', 'caregiver stress', 'advance directive', 'living will', 'power of attorney'],
        trauma: ['trauma', 'post-traumatic stress disorder', 'ptsd', 'acute stress disorder', 'anxiety', 'depression', 'substance abuse', 'addiction', 'self-harm', 'suicidal ideation', 'crisis intervention', 'cognitive behavioral therapy', 'cbt', 'eye movement desensitization and reprocessing', 'emdr', 'psychotherapy'],
        other: ['fatigue', 'weight loss', 'fever', 'night sweats', 'pain', 'inflammation', 'infection', 'swelling', 'redness', 'itching', 'rash', 'numbness', 'tingling', 'weakness', 'dizziness', 'lightheadedness', 'palpitations', 'syncope', 'edema', 'constipation', 'diarrhea', 'bloating', 'heartburn', 'acid reflux', 'cough', 'shortness of breath', 'wheezing'],
        chronic: ['chronic pain', 'fibromyalgia', 'chronic fatigue syndrome', 'irritable bowel syndrome', 'interstitial cystitis', 'migraines', 'tension headaches', 'temporomandibular joint disorder', 'tmj', 'endometriosis', 'pelvic inflammatory disease', 'chronic obstructive pulmonary disease', 'copd', 'congestive heart failure', 'chronic kidney disease', 'ckd', 'diabetes mellitus', 'hypertension'],
        lifestyle: ['smoking cessation', 'alcohol reduction', 'weight loss', 'diet modification', 'exercise program', 'stress management', 'sleep hygiene', 'mindfulness', 'meditation', 'yoga', 'counseling', 'therapy', 'support group'],
        preventive: ['screening', 'mammography', 'pap smear', 'colonoscopy', 'prostate exam', 'blood pressure check', 'cholesterol check', 'diabetes screening', 'immunization', 'vaccination', 'flu shot', 'pneumonia vaccine', 'covid-19 vaccine', 'bone density test', 'osteoporosis screening'],
        dental: ['tooth decay', 'cavity', 'gingivitis', 'periodontitis', 'toothache', 'dental abscess', 'oral hygiene', 'brushing', 'flossing', 'mouthwash', 'dental cleaning', 'scaling and root planing', 'fillings', 'crowns', 'root canal', 'extraction', 'dentures', 'orthodontics', 'braces'],
        vision: ['myopia', 'hyperopia', 'astigmatism', 'presbyopia', 'glaucoma', 'cataract', 'macular degeneration', 'diabetic retinopathy', 'dry eye', 'conjunctivitis', 'eye exam', 'vision screening', 'glasses', 'contact lenses', 'laser eye surgery'],
        hearing: ['hearing loss', 'tinnitus', 'ear infection', 'otitis media', 'earwax impaction', 'audiometry', 'hearing aid', 'cochlear implant', 'balance disorder', 'vertigo', 'meneires disease', 'acoustic neuroma', 'ear exam'],
        skin: ['acne', 'eczema', 'psoriasis', 'dermatitis', 'skin infection', 'cellulitis', 'fungal infection', 'melanoma', 'basal cell carcinoma', 'squamous cell carcinoma', 'skin cancer screening', 'mole check', 'biopsy'],
        musculoskeletal: ['arthritis', 'osteoarthritis', 'rheumatoid arthritis', 'gout', 'lupus', 'fibromyalgia', 'back pain', 'neck pain', 'joint pain', 'muscle strain', 'tendonitis', 'bursitis', 'physical therapy', 'occupational therapy', 'chiropractic care', 'pain management'],
        endocrine: ['diabetes mellitus', 'hypothyroidism', 'hyperthyroidism', 'thyroid nodule', 'goiter', 'osteoporosis', 'adrenal insufficiency', 'cushing syndrome', 'polycystic ovary syndrome', 'pcos', 'hormone replacement therapy', 'hrt', 'insulin therapy', 'oral hypoglycemic agents'],
        gastrointestinal: ['gastroesophageal reflux disease', 'gerd', 'peptic ulcer disease', 'pud', 'irritable bowel syndrome', 'ibs', 'inflammatory bowel disease', 'crohn', 'ulcerative colitis', 'hepatitis', 'cirrhosis', 'fatty liver disease', 'cholelithiasis', 'pancreatitis', 'constipation', 'diarrhea', 'abdominal pain'],
        respiratory: ['asthma', 'chronic obstructive pulmonary disease', 'copd', 'bronchitis', 'pneumonia', 'tuberculosis', 'lung cancer', 'pulmonary fibrosis', 'sleep apnea', 'allergic rhinitis', 'sinusitis', 'cough', 'shortness of breath'],
        neurological: ['stroke', 'transient ischemic attack', 'tia', 'seizure', 'epilepsy', 'headache', 'migraine', 'dementia', 'alzheimers', 'parkinson', 'multiple sclerosis', 'ms', 'neuropathy', 'neurological disorder', 'anticonvulsant', 'antiepileptic', 'dopamine agonist', 'acetylcholinesterase inhibitor', 'physical therapy', 'occupational therapy', 'speech therapy'],
    };

    const kws = new Set();

    // rough tokens of diagnosis (words >=4 chars)
    s.split(/\W+/).forEach((w) => {
        if (w.length >= 4) kws.add(w);
    });

    // add synonyms that match the diag string
    Object.values(synonyms).forEach((arr) => {
        arr.forEach((phrase) => {
            if (s.includes(phrase)) {
                // add phrase and its tokens
                phrase.split(/\W+/).forEach((t) => t.length >= 3 && kws.add(t));
            }
        });
    });

    return Array.from(kws);
};

// find clause dynamically for a diagnosis using strict keyword matching
// find clause dynamically for a diagnosis using strict keyword + mapping rules
// const findClauseForDiagnosis = (diagnosis, clauses = []) => {
//     if (!diagnosis || !Array.isArray(clauses) || clauses.length === 0) {
//         return null;
//     }

//     const diagLower = diagnosis.toLowerCase();
//     const keywords = diagToKeywords(diagnosis);

//     // 🔹 Special mapping rules (custom override)
//     if (diagLower.includes('kidney') || diagLower.includes('renal') || diagLower.includes('ckd')) {
//         const found = clauses.find((c) =>
//             String(c.text || '').toLowerCase().includes('dialysis')
//         );
//         if (found) return { clause: found, hitType: 'custom-kidney' };
//     }

//     if (diagLower.includes('hyperlipidemia') || diagLower.includes('cholesterol') || diagLower.includes('lipid')) {
//         const found = clauses.find((c) =>
//             String(c.text || '').toLowerCase().includes('hypertension') ||
//             String(c.text || '').toLowerCase().includes('cardiac')
//         );
//         if (found) return { clause: found, hitType: 'custom-cholesterol' };
//     }

//     if (diagLower.includes('gastro') || diagLower.includes('dehydration') || diagLower.includes('diarrhea')) {
//         const found = clauses.find((c) =>
//             String(c.text || '').toLowerCase().includes('hospitalization')
//         );
//         if (found) return { clause: found, hitType: 'custom-gastro' };
//     }

//     // first pass: strong match — clause text must contain at least one keyword
//     for (const clause of clauses) {
//         const ctext = String(clause.text || '').toLowerCase();
//         const hit = keywords.some((k) => k && ctext.includes(k));
//         if (hit) return { clause, hitType: 'keyword' };
//     }

//     // second pass: try common phrases
//     const phraseChecks = ['diabetes', 'hypertension', 'kidney', 'cancer', 'stroke', 'dialysis', 'cholesterol', 'anemia'];
//     for (const p of phraseChecks) {
//         if (diagLower.includes(p)) {
//             const found = clauses.find((c) => String(c.text || '').toLowerCase().includes(p));
//             if (found) return { clause: found, hitType: 'phrase' };
//         }
//     }

//     // fallback to embedding
//     try {
//         const { clause: embClause, score } = bestClauseMatch(`${diagnosis}`, clauses || []);
//         if (embClause && score > 0.5) {
//             return { clause: embClause, hitType: 'embedding', score };
//         }
//     } catch (e) {
//         // ignore
//     }

//     return null;
// };


// find clause dynamically for a diagnosis using strict keyword + mapping rules
const findClauseForDiagnosis = (diagnosis, clauses = []) => {
    if (!diagnosis || !Array.isArray(clauses) || clauses.length === 0) {
        return null;
    }

    const diagLower = diagnosis.toLowerCase();
    const keywords = diagToKeywords(diagnosis);

    // CKD / Kidney → dialysis clause = Covered
    if (diagLower.includes('kidney') || diagLower.includes('renal') || diagLower.includes('ckd')) {
        const found = clauses.find((c) =>
            String(c.text || '').toLowerCase().includes('dialysis')
        );
        if (found) {
            return { clause: found, hitType: 'custom-kidney', forceCovered: true };
        }
    }

    // Hyperlipidemia / Cholesterol → map to Hypertension & Cardiac clause = Covered
    if (diagLower.includes('hyperlipidemia') || diagLower.includes('cholesterol') || diagLower.includes('lipid')) {
        const found = clauses.find((c) =>
            String(c.text || '').toLowerCase().includes('cardiac') ||
            String(c.text || '').toLowerCase().includes('hypertension')
        );
        if (found) {
            return { clause: found, hitType: 'custom-cholesterol', forceCovered: true };
        }
    }

    // Gastro / Dehydration → hospitalization (agar explicitly clause ho)
    if (diagLower.includes('gastro') || diagLower.includes('dehydration') || diagLower.includes('diarrhea')) {
        const found = clauses.find((c) =>
            String(c.text || '').toLowerCase().includes('hospitalization')
        );
        if (found) {
            return { clause: found, hitType: 'custom-gastro' };
        }
    }

    // first pass: keyword match
    for (const clause of clauses) {
        const ctext = String(clause.text || '').toLowerCase();
        const hit = keywords.some((k) => k && ctext.includes(k));
        if (hit) return { clause, hitType: 'keyword' };
    }

    // phrase fallback
    const phraseChecks = ['diabetes', 'hypertension', 'kidney', 'cancer', 'stroke', 'dialysis', 'cholesterol','Liver Dysfunction','Liver Dysfunction', 'anemia'];
    for (const p of phraseChecks) {
        if (diagLower.includes(p)) {
            const found = clauses.find((c) => String(c.text || '').toLowerCase().includes(p));
            if (found) return { clause: found, hitType: 'phrase' };
        }
    }

    // embedding fallback
    try {
        const { clause: embClause, score } = bestClauseMatch(`${diagnosis}`, clauses || []);
        if (embClause && score > 0.5) {
            return { clause: embClause, hitType: 'embedding', score };
        }
    } catch (e) { }

    return null;
};



export const analyzeBundle = async (req, res, next) => {
    try {
        const { reportIds = [], policyId } = req.body || {};
        if (!Array.isArray(reportIds) || !policyId) {
            return res.status(400).json({ error: 'reportIds[] and policyId required' });
        }
        if (reportIds.length < MIN_REPORTS || reportIds.length > MAX_REPORTS) {
            return res.status(400).json({
                error: `Reports must be between ${MIN_REPORTS} - ${MAX_REPORTS}`,
            });
        }

        const reports = await MultiReport.find({ _id: { $in: reportIds } }).lean();
        const policy = await MultiPolicy.findById(policyId).lean();
        if (!reports.length || !policy) {
            return res.status(404).json({ error: 'Reports or policy not found' });
        }

        // Normalize
        const enriched = reports.map((r) => {
            const diags = (r.extracted?.diagnoses || []).map(normalizeDiagnosis);
            const trArr = Array.isArray(r.extracted?.treatments)
                ? r.extracted.treatments
                : r.extracted?.treatments
                    ? [r.extracted.treatments]
                    : [];
            return {
                ...r,
                extracted: {
                    ...r.extracted,
                    diagnoses: diags,
                    treatments: trArr,
                },
            };
        });

        // Heuristic/dynamic pre-match
        const heuristicRows = [];
        for (const r of enriched) {
            const diags = r.extracted?.diagnoses?.length ? r.extracted.diagnoses : ['Unknown'];
            const treatmentStr = firstOfArrAsStr(r.extracted?.treatments);

            for (const d of diags) {
                // default values
                let covered = 'No';
                let policyClause = 'N/A';
                let limit = 'N/A';
                let conf = 20;
                let explain = 'No matching policy clause';

                const match = findClauseForDiagnosis(d, policy.clauses || []);

                // ✅ FIXED BLOCK START
                if (match && match.clause) {
                    const cl = match.clause;
                    const ctext = String(cl.text || '').trim();

                    // 🔥 Force Covered agar custom mapping bola
                    if (match.forceCovered) {
                        covered = 'Yes';
                        conf = 85;
                        explain = `Custom mapping forced coverage (${match.hitType})`;
                    }

                    // 🔥 Section + Label sahi se lagao
                    const sec = cl.id?.startsWith('Sec') ? cl.id : (cl.section || '');
                    const lbl = cl.label && cl.label !== cl.id ? cl.label : '';
                    policyClause = [sec, lbl].filter(Boolean).join(' – ') || cl.id || 'N/A';
                    limit = cl.limit || 'N/A';

                    if (!match.forceCovered) {
                        if (match.hitType === 'keyword' || match.hitType === 'phrase') {
                            if (String(cl.type || '').toLowerCase() === 'exclusion') {
                                covered = 'No';
                                conf = Math.max(conf, 50);
                                explain = `Matched clause but clause is exclusion`;
                            } else {
                                covered = 'Yes';
                                conf = Math.max(conf, 70);
                                explain = `Matched clause by keywords/phrase`;
                            }
                        } else if (match.hitType === 'embedding') {
                            const score = match.score || 0;
                            if (String(cl.type || '').toLowerCase() !== 'exclusion' && score > 0.75) {
                                covered = 'Yes';
                                conf = Math.round(Math.max(conf, score * 100));
                                explain = `Embedding-based match (score ${Math.round(score * 100)}%)`;
                            } else {
                                covered = 'No';
                                conf = Math.max(conf, 30);
                                explain = `Embedding match too weak or clause exclusion`;
                            }
                        }
                    }
                }
                // ✅ FIXED BLOCK END

                heuristicRows.push({
                    reportFile: toStr(r.filename),
                    name: toStr(r.extracted?.name),
                    age: toNumOrUndef(r.extracted?.age),
                    diagnosis: toStr(d),
                    treatment: toStr(treatmentStr),
                    covered,
                    policyClause,
                    limit,
                    confidence: Math.min(95, conf),
                    explain,
                });
            }
        }

        // LLM final pass (optional)
        let llmRows = [];
        try {
            llmRows = await analyzeWithGemini({ reports: enriched, clauses: policy.clauses || [] });
        } catch (e) {
            console.warn('Gemini failed, using heuristic only:', e.message);
            llmRows = [];
        }

        // Final normalize
        const finalSource = llmRows?.length ? llmRows : heuristicRows;
        const rows = (finalSource || []).map((row) => {
            const coveredVal =
                row.covered === true
                    ? 'Yes'
                    : row.covered === false
                        ? 'No'
                        : String(row.covered).toLowerCase().includes('yes')
                            ? 'Yes'
                            : 'No';

            let safeRow = {
                reportFile: toStr(row.reportFile),
                name: toStr(row.name),
                age: toNumOrUndef(row.age),
                diagnosis: toStr(row.diagnosis),
                treatment: firstOfArrAsStr(row.treatment),
                covered: coveredVal,
                policyClause: toStr(row.policyClause || 'N/A'),
                limit: row.limit == null ? 'N/A' : toStr(row.limit),
                confidence: Number.isFinite(row.confidence) ? row.confidence : 50,
                explain: toStr(row.explain || ''),
            };

            // 🚨 Agar covered = No → sab N/A
            if (safeRow.covered === 'No') {
                safeRow.policyClause = 'N/A';
                safeRow.limit = 'N/A';
                safeRow.confidence = 0;
            }

            return safeRow;
        });

        const saved = await MultiAnalysis.create({
            policyId: policy._id,
            reportIds: reports.map((r) => r._id),
            rows,
        });

        res.json({ analysisId: saved._id, rows });
    } catch (e) {
        next(e);
    }
};



