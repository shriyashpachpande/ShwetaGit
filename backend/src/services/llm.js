import Groq from 'groq-sdk';

const API_KEY = process.env.GROQ_API_KEY || '';
const groq = new Groq({ apiKey: API_KEY });

// Strict, concise style + safety
const SYSTEM_MEDICAL = `You are a medical assistant chatbot.
Your scope: medical/health topics only (symptoms, conditions, prevention, first-aid, lifestyle, tests, insurance).
If and only if the user asks about non-medical topics (coding, poetry, politics, sports, finance, entertainment, adult content, hacking), refuse politely.
Always add a disclaimer at the end:
"⚠️ Ye sirf jaankari ke liye hai; kripya doctor se salah lein." if Hindi,
or "⚠️ This is educational; always consult a doctor." if English.
Avoid drug dosages. Encourage doctor consultation for serious issues.
Response format (MANDATORY):

Start with a short bold title (3–5 words).

Then 4–6 bullet points; each bullet 1–2 short lines; keep it crisp and clear.

Mirror the user's language (Hindi/English).

No links or citations.

End with the exact disclaimer line on a new line.`;

export function detectLang(text) {
  return /[\u0900-\u097F]/.test(text) ? 'hi' : 'en';
}

function disclaimer(lang) {
  return lang === 'hi'
    ? '⚠️ Ye sirf jaankari ke liye hai; kripya doctor se salah lein.'
    : '⚠️ This is educational; always consult a doctor.';
}

// Normalize
function norm(s) {
  return String(s || '').toLowerCase().replace(/\s+/g, ' ').trim();
}

// Greetings
function isGreeting(text) {
  const t = norm(text);
  const exact = [
    'hi', 'hello', 'hey', 'hola', 'yo', 'sup', 'namaste', 'namaskar',
    'good morning', 'good afternoon', 'good evening', 'hii', 'heyy', 'helo', 'hllo'
  ];
  if (exact.includes(t)) return true;
  const pats = [
    /^hi[,!.\s]$/i, /^hello[,!.\s]$/i, /^hey[,!.\s]$/i,
    /^namaste[,!.\s]$/i, /^good (morning|afternoon|evening)[,!.\s]*$/i
  ];
  return pats.some(p => p.test(text));
}

// BLOCK LIST for clearly non‑medical intents
function isClearlyNonMedical(text) {
  const t = norm(text);
  const nonMed = [
    // tech/coding
    'code', 'coding', 'programming', 'javascript', 'python', 'java', 'react', 'bug', 'algorithm',
    'function', 'variable', 'class', 'object', 'array', 'string', 'number', 'boolean', 'null', 'undefined',
    'compile', 'run code', 'execute code', 'debug', 'error', 'exception', 'stack trace',
    // creative/writing
    'write a story', 'write a poem', 'poem', 'story', 'lyrics', 'song', 'joke', 'riddle', 'essay',
    'blog post', 'article', 'summary', 'caption', 'headline', 'slogan', 'quote',
    // academic/school
    'homework', 'assignment', 'project', 'thesis', 'dissertation', 'essay', 'report',
    'solve for x', 'math problem', 'history of', 'explain the theory of',
    // business/marketing
    'business plan', 'marketing strategy', 'advertisement copy',
    'sales pitch', 'customer persona', 'brand identity',
    // legal
    'legal advice', 'lawyer', 'attorney', 'court case',
    
    // sports
    'score of the game', 'football match', 'basketball game',
    // finance/investment
    'investment advice', 'stock market tips', 'cryptocurrency advice',
    'financial planning', 'tax advice', 'loan advice', 'mortgage advice',
    // entertainment/general
    'movie', 'film', 'song', 'lyrics', 'joke', 'poem', 'shayari', 'story', 'game', 'gaming',
    // politics/finance
    'politics', 'election', 'stock', 'crypto', 'bitcoin', 'trading', 'mutual fund',
    // adult/illegal/hacking
    'adult', 'nsfw', 'hacking', 'hack', 'crack', 'license key', 'serial key', 'keygen', 'torrent', 'pirate', 'piracy',
    // others
    'weather', 'temperature', 'news', 'sports', 'recipe', 'cooking', 'travel', 'tourism', 'tourist',
    'celebrity', 'famous', 'religion', 'god', 'philosophy', 'life advice', 'motivation', 'inspiration',
  ];
  return nonMed.some(k => t.includes(k));
}

// ALLOW‑FIRST gate: default medical unless blocked
function shouldAnswerAsMedical(text) {
  // If obviously non‑medical, block; otherwise allow
  return !isClearlyNonMedical(text);
}

export async function replyMedical({ history, userText }) {
  const lang = detectLang(userText);
  const t = norm(userText);

  // API key sanity
  if (!API_KEY || API_KEY.length < 10) {
    console.error('[GROQ] Missing or invalid GROQ_API_KEY');
    const text = lang === 'hi'
      ? 'Server configuration issue: API key missing.'
      : 'Server configuration issue: API key missing.';
    return { text: `${text}\n\n${disclaimer(lang)}`, lang };
  }

  // Greetings → friendly welcome
  if (isGreeting(t)) {
    const greet = lang === 'hi'
      ? 'Namaste!\n\n- Health/insurance se jude sawal pooch sakte hain.\n- Symptoms, tests, diet, first‑aid par chhote bullets milenge.\n- Emergency me turant doctor/helpline.\n\n' + disclaimer('hi')
      : 'Hello!\n\n- Ask health/insurance questions.\n- Get brief bullets on symptoms, tests, diet, first‑aid.\n- For emergencies, contact a doctor/helpline.\n\n' + disclaimer('en');
    return { text: greet, lang };
  }

  // Medical scope decision (allow‑first)
  if (!shouldAnswerAsMedical(t)) {
    const text = lang === 'hi'
      ? 'Maaf kijiye, yeh medical/health se sambandhit prashn nahi lagta.'
      : 'Sorry, this does not appear to be a medical or health-related question.';
    return { text: text + '\n\n' + disclaimer(lang), lang };
  }

  // Style hint for concise bullets
  const styleHint = lang === 'hi'
    ? 'Format: ek chhota bold title, phir 4–6 bullets (1–2 lines), simple Hindi, prescriptions/dosage nahi.'
    : 'Format: short bold title, then 4–6 bullets (1–2 lines), simple English, no prescriptions/dosages.';

  const messages = [
    { role: 'system', content: SYSTEM_MEDICAL },
    ...history.map(m => ({ role: m.role, content: m.content })),
    { role: 'user', content: `${styleHint}\n\n${userText}` }
  ];

  try {
    const resp = await groq.chat.completions.create({
      model: 'llama-3.1-8b-instant', // fast, widely available
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
    if (e?.status === 429 || e?.response?.status === 429) {
      const text = lang === 'hi'
        ? 'Rate limit hit ho gaya. Thodi der baad dobara koshish karein.'
        : 'Rate limit hit. Please try again in a minute.';
      return { text: `${text}\n\n${disclaimer(lang)}`, lang };
    }

    if (e?.status === 400 && /decommissioned|model/i.test(e?.message || '')) {
      const text = lang === 'hi'
        ? 'Model availability badal gayi hai. Console ke Models page par current supported model ID check karke update karein.'
        : 'Model availability changed. Check the Models page in your console and update to a supported model ID.';
      return { text: `${text}\n\n${disclaimer(lang)}`, lang };
    }

    const text = lang === 'hi'
      ? 'Maaf kijiye, seva upalabdh nahi hai. Kripya kuch der baad koshish karein.'
      : 'Service is unavailable. Please try again later.';
    return { text: `${text}\n\n${disclaimer(lang)}`, lang };
  }
}