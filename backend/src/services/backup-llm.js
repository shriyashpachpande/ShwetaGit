import Groq from 'groq-sdk';

const API_KEY = process.env.GROQ_API_KEY || '';
const groq = new Groq({ apiKey: API_KEY });

// Strict, concise style + safety
const SYSTEM_MEDICAL = `You are a medical assistant chatbot.
Only answer medical, health, symptoms, treatment understanding, lifestyle, first-aid, tablets, or health insurance related questions.
If the user asks unrelated things (poems, coding, politics etc.), politely say:
"I can only answer medical or health-related questions."
Always add a disclaimer at the end:
"⚠️ Ye sirf jaankari ke liye hai; kripya doctor se salah lein." if Hindi,
or "⚠️ This is educational; always consult a doctor." if English.
Avoid prescribing specific drug doses. Encourage doctor consultation for serious issues.
Response format (MANDATORY):

Start with a short bold title (3–5 words).

Then 4–6 bullet points; each bullet 1–2 short lines; keep it crisp and clear.

Mirror the user's language (Hindi/English).

Do not include external links or citations.

End with the exact disclaimer line on a new line.`;

export function detectLang(text) {
    return /[\u0900-\u097F]/.test(text) ? 'hi' : 'en';
}

function disclaimer(lang) {
    return lang === 'hi'
        ? '⚠️ Ye sirf jaankari ke liye hai; kripya doctor se salah lein.'
        : '⚠️ This is educational; always consult a doctor.';
}

// Normalize for matching
function norm(s) {
    return String(s || '').toLowerCase().replace(/\s+/g, ' ').trim();
}

// Greeting detection
function isGreeting(text) {
    const t = norm(text);
    const exact = [
        'hi', 'hello', 'hey', 'hola', 'yo', 'sup', 'namaste', 'namaskar',
        'good morning', 'good afternoon', 'good evening', 'hii', 'heyy', 'helo', 'hllo'
    ];
    if (exact.includes(t)) return true;
    const pats = [
        /^hi[,!.\s]$/i,
        /^hello[,!.\s]$/i,
        /^hey[,!.\s]$/i,
        /^namaste[,!.\s]$/i,
        /^good (morning|afternoon|evening)[,!.\s]*$/i
    ];
    return pats.some(p => p.test(text));
}

// Very broad medical gate (Hindi + English + transliterations)
// Categories covered: symptoms, diseases, emergencies, body parts, tests, treatment words, lifestyle, insurance.
function isMedical(text) {
    const t = norm(text);

   const english = [
    // Symptoms
    'fever','temperature','chills','cold','runny nose','blocked nose','cough','dry cough','wet cough','sore throat','throat pain',
    'headache','migraine','dizziness','nausea','vomit','vomiting','loose motion','diarrhea','constipation',
    'stomach pain','abdominal pain','gas','bloating','chest pain','palpitations','shortness of breath','breathlessness',
    'fatigue','weakness','body ache','back pain','joint pain','knee pain','rash','itching','hives','allergy','swelling',
    'burning','burn','wound','bleeding','bruise','fainting','insomnia','sleep problem','anxiety','stress','depression',
    // Diseases/conditions
    'flu','pneumonia','asthma','copd','bronchitis','sinusitis','covid','corona','malaria','dengue','typhoid','tb','tuberculosis',
    'diabetes','sugar','cholesterol','thyroid','bp','blood pressure','hypertension','hypotension','pcos','pcod','uti','kidney stone',
    'kidney failure','liver disease','fatty liver','hepatitis','ulcer','appendicitis','pile','piles','fissure','fistula','stroke',
    'paralysis','heart attack','cardiac arrest','angina','arrhythmia','cancer','tumor','anaemia','anemia',
    // Reproductive/obgyn
    'period','menstruation','menstrual','pregnancy','pregnant','morning sickness','miscarriage',
    // Pediatrics/common
    'colic','teething','ear pain','eye infection','conjunctivitis','pink eye',
    // Infections
    'infection','viral','bacterial','fungal','sepsis',
    // Tests/metrics
    'cbc','blood test','sugar test','hba1c','ecg','echo','xray','x-ray','ct','mri','urine test','culture','swab',
    // Treatment words
    'first aid','home remedy','home remedies','diet','exercise','physiotherapy','rehab','rehabilitation','therapy',
    'medicine','medication','tablet','capsule','syrup','ointment','antibiotic','antacid','painkiller','analgesic',
    // Lifestyle/others
    'smoking','alcohol','sleep','hydration','nutrition','obesity','weight loss','weight gain','fitness',
    // Insurance/doctor
    'insurance','health insurance','opd','ipd','cashless','reimbursement','doctor','clinic','hospital','ambulance'
  ];

    const hindi = [
    // Symptoms
    'bukhar','taap','jalan','thand lagna','sardi','jukham','jukaam','naak band','naak behna',
    'khansi','khaansi','khasi','gale mein dard','gale ka dard','sir dard','chakkar','ghabrahat','bechaini',
    'matli','ulti','pet dard','peit dard','dast','kabz','gas','pet phulna','seene me jalan','seene me dard',
    'saans chadhna','saans phoolna','saans rukna','kamzori','thakaan','jodo me dard','pith dard','kamar dard',
    'sujan','soojan','jalna','jal gaya','zakhm','khoon bahna','behosh','neend nahi aana','neend ki dikkat',
    // Diseases/conditions
    'dil ka daura','hridaya ghat','seene ka dard','angina','dil ki dhadkan tez','arrhythmia','lakwa','stroke',
    'diabetes','sugar','thyroid','bp','rakt chaap','uchcha rakt chaap','neeya rakt chaap','cholesterol',
    'tv','kshayarog','yakrit rog','piliya','peeliya','pit ki pathri','gurdon ki pathri','gurdon ki samasya',
    'yakrit ki samasya','kark rog','cancer','gath',
    // Reproductive/obgyn
    'mahavari','period','maasik dharm','garbhavastha','garbhpaat','morning sickness',
    // Pediatrics/common
    'dant nikalna','kan dard','aankh ka infection','aankh sujan','aankh lal',
    // Tests/metrics
    'khoon ki jaanch','sugar ki jaanch','hba1c','ecg','echo','xray','x-ray','ct','mri','mutra ki jaanch','kalchar',
    // Treatment words
    'prathmik upchar','gharelu upay','gharelu nuskhe','khana','aahar','vyayam','kasrat','physiotherapy',
    'dawai','dawaiyan','goli','tablet','capsule','syrup','malham','antibiotic','painkiller',
    // Lifestyle/others
    'dhumrapan','sharab','neend','paani peena','poshan','motapa','vajan kam','vajan badhana',
    // Insurance/doctor
    'bima','health bima','cashless','daawa','doctor','chikitsak','aspatal','ambulance'
  ];

    // Body parts (helps queries like "jale haath ka kya karein", "ankle sprain")
    const body = [
        'head', 'brain', 'eye', 'ear', 'nose', 'throat', 'chest', 'heart', 'lung', 'stomach', 'abdomen', 'back', 'spine', 'waist',
        'arm', 'hand', 'elbow', 'wrist', 'finger', 'leg', 'knee', 'ankle', 'foot', 'toe', 'skin', 'kidney', 'liver',
        'sir', 'dimaag', 'aankh', 'kaan', 'naak', 'gala', 'seena', 'dil', 'fefde', 'pet', 'peit', 'kamar', 'haath', 'kohni', 'kalai',
        'ungli', 'pair', 'ghutna', 'tekna', 'takka', 'twacha', 'gurdha', 'yakrit'
    ];

    const arr = [...english, ...hindi, ...body];
    return arr.some(k => t.includes(k));
}

export async function replyMedical({ history, userText }) {
    const lang = detectLang(userText);
    const t = norm(userText);

    // 0) API key sanity
    if (!API_KEY || API_KEY.length < 10) {
        console.error('[GROQ] Missing or invalid GROQ_API_KEY');
        const text = lang === 'hi'
            ? 'Server configuration issue: API key missing.'
            : 'Server configuration issue: API key missing.';
    return { text: `${text}\n\n${disclaimer(lang)}`, lang };
}

// 1) Greetings → friendly welcome
if (isGreeting(t)) {
    const greet = lang === 'hi'
        ? 'Namaste!\n\n- Health/insurance se jude sawal pooch sakte hain.\n- Symptoms, tests, diet, first‑aid par chhote bullets me guide milegi.\n- Emergency me turant doctor/helpline.\n\n' + disclaimer('hi')
        : 'Hello!\n\n- Ask health/insurance questions.\n- Get brief bullets on symptoms, tests, diet, first‑aid.\n- For emergencies, contact a doctor/helpline.\n\n' + disclaimer('en');
    return { text: greet, lang };
}

// 2) Medical-only gate
if (!isMedical(t)) {
    const text = lang === 'hi'
        ? 'Maaf kijiye, main sirf medical ya health-related sawalon ka jawab de sakta/sakti hoon.'
        : 'Sorry, I can only answer medical or health-related questions.';
return { text: `${text}\n\n${disclaimer(lang)}`, lang };
}

// 3) Style hint to enforce bullets + brevity
const styleHint = lang === 'hi'
    ? 'Format: ek chhota bold title, phir 4–6 bullets (1–2 lines), simple Hindi, prescriptions/dosage nahi.'
    : 'Format: short bold title, then 4–6 bullets (1–2 lines), simple English, no prescriptions/dosages.';

const messages = [
    { role: 'system', content: SYSTEM_MEDICAL },
    ...history.map(m => ({ role: m.role, content: m.content })),
    { role: 'user', content: `${styleHint}\n\n${userText}` }
];

// 4) Groq call (stable, fast model)
try {
    const resp = await groq.chat.completions.create({
        model: 'llama-3.1-8b-instant',
        messages,
        temperature: 0.5,
        max_tokens: 220
    });
    const out = resp?.choices?.[0]?.message?.content?.trim();
    const safe = out && out.length > 0
        ? out
        : (lang === 'hi'
            ? 'Maaf kijiye, abhi jawaab tayar nahi ho paya.'
            : 'Sorry, I could not generate a response right now.');

    return { text: `${safe}\n\n${disclaimer(lang)}`, lang };
} catch (e) {
    console.error('[GROQ ERROR]', {
        name: e?.name,
        message: e?.message,
        status: e?.status || e?.response?.status,
        data: e?.response?.data
    });
    // Rate limit: friendly guidance
    if (e?.status === 429 || e?.response?.status === 429) {
        const text = lang === 'hi'
            ? 'Rate limit hit ho gaya. Thodi der baad dobara koshish karein.'
            : 'Rate limit hit. Please try again in a minute.';
        return { text: `${text}\n\n${disclaimer(lang)}`, lang };
    }

    // Model deprecation notice
    if (e?.status === 400 && /decommissioned|model/i.test(e?.message || '')) {
        const text = lang === 'hi'
            ? 'Model availability badal gaya hai. Groq console ke Models page par current supported model ID check karke update karein.'
            : 'Model availability changed. Check the Models page in the Groq console and update to a supported model ID.';
        return { text: `${text}\n\n${disclaimer(lang)}`, lang };
    }

    const text = lang === 'hi'
        ? 'Maaf kijiye, seva upalabdh nahi hai. Kripya kuch der baad koshish karein.'
        : 'Service is unavailable. Please try again later.';
    return { text: `${text}\n\n${disclaimer(lang)}`, lang };
}
}