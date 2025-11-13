// // src/utils/speak.js
// export const speak = (text, lang = "en-US") => {
//     if ("speechSynthesis" in window) {
//         window.speechSynthesis.cancel(); // agar pehle se chal raha ho to stop karo
//         const utterance = new SpeechSynthesisUtterance(text);
//         utterance.lang = lang; // "hi-IN" karoge to Hindi bol lega
//         utterance.rate = 1;
//         utterance.pitch = 1;
//         window.speechSynthesis.speak(utterance);
//     } else {
//         console.warn("Text-to-Speech not supported in this browser.");
//     }
// };



// // src/utils/speak.js
// let isSpeaking = false; // global flag

// export const toggleSpeak = (text, lang = "en-US") => {
//   if (!("speechSynthesis" in window)) {
//     console.warn("Text-to-Speech not supported in this browser.");
//     return;
//   }

//   if (isSpeaking) {
//     // Agar already bol raha hai to band kar do
//     window.speechSynthesis.cancel();
//     isSpeaking = false;
//   } else {
//     // Naya bolna start karo
//     const utterance = new SpeechSynthesisUtterance(text);
//     utterance.lang = lang;
//     utterance.rate = 1;
//     utterance.pitch = 1;

//     // Jab khatam ho jaye to flag reset
//     utterance.onend = () => {
//       isSpeaking = false;
//     };

//     window.speechSynthesis.speak(utterance);
//     isSpeaking = true;
//   }
// };
















// src/utils/speak.js
// Multi-language Web Speech helpers with robust voice loading and selection

let cachedVoices = [];
let isSpeaking = false;

// Promise that resolves when voices are available (or after a timeout)
let voicesReadyResolve;
let voicesReadyReject;
let voicesReady = new Promise((res, rej) => {
  voicesReadyResolve = res;
  voicesReadyReject = rej;
});

/**
 * Load voices across browsers:
 * - Call getVoices() immediately (Firefox/Safari may return)
 * - Listen for voiceschanged (Chrome/Edge async)
 * - Retry briefly to cover late population cases
 */
function loadVoices() {
  if (!('speechSynthesis' in window)) {
    voicesReadyReject && voicesReadyReject(new Error('speechSynthesis not supported'));
    return;
  }
  const synth = window.speechSynthesis;

  const update = () => {
    const list = synth.getVoices();
    if (Array.isArray(list) && list.length) {
      // Normalize tags once here
      cachedVoices = list.map(v => ({
        ...v,
        lang: (v.lang || '').replace('_', '-'),
      }));
      voicesReadyResolve && voicesReadyResolve(true);
      // Prevent multiple resolves
      voicesReadyResolve = null;
      voicesReadyReject = null;
    }
  };

  // Attempt immediately
  update();

  // Event-based (Chrome/Edge)
  if (typeof synth.onvoiceschanged !== 'undefined') {
    synth.onvoiceschanged = update;
  } else {
    // For engines without onvoiceschanged, poll a bit
    let tries = 0;
    const id = setInterval(() => {
      tries += 1;
      if (cachedVoices.length || tries >= 20) clearInterval(id);
      update();
    }, 150);
  }

  // Safety timeout resolve (don’t hang forever)
  setTimeout(() => {
    if (!cachedVoices.length && voicesReadyResolve) {
      voicesReadyResolve(false);
      voicesReadyResolve = null;
      voicesReadyReject = null;
    }
  }, 3000);
}

// Initialize on import
if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
  loadVoices();
}

/**
 * Expose a manual refresher for edge cases (call after a user gesture).
 */
export function forceReloadVoices() {
  if (!('speechSynthesis' in window)) return;
  cachedVoices = [];
  // Recreate the readiness promise
  voicesReady = new Promise((res, rej) => {
    voicesReadyResolve = res;
    voicesReadyReject = rej;
  });
  loadVoices();
}

/**
 * Map UI locale to BCP-47 speech tag
 */
export const uiToSpeechLang = {
  en: 'en-US',
  hi: 'hi-IN',
  mr: 'mr-IN',
  ta: 'ta-IN',
  gu: 'gu-IN',
  te: 'te-IN',
  kn: 'kn-IN',
  bn: 'bn-IN',
};

/**
 * Find best matching voice for a lang tag.
 * Match order:
 * 1) exact (case-insensitive)
 * 2) startsWith primary- (e.g., hi-)
 * 3) equals primary (e.g., hi)
 * 4) default or first
 */
export function bestVoiceFor(lang) {
  const list = cachedVoices.length
    ? cachedVoices
    : (('speechSynthesis' in window) ? window.speechSynthesis.getVoices().map(v => ({ ...v, lang: (v.lang || '').replace('_', '-') })) : []);

  if (!list || !list.length) return null;

  const want = (lang || '').toLowerCase().replace('_', '-');
  const primary = want.split('-')[0];

  let v = list.find(voice => (voice.lang || '').toLowerCase() === want);
  if (v) return v;

  v = list.find(voice => (voice.lang || '').toLowerCase().startsWith(primary + '-'));
  if (v) return v;

  v = list.find(voice => (voice.lang || '').toLowerCase() === primary);
  if (v) return v;

  v = list.find(voice => voice.default) || list[0];
  return v || null;
}

/**
 * Speak text in a given UI language code (en/hi/mr/ta/gu/te/kn/bn) or a full BCP-47 tag.
 * Options: { rate, pitch, volume, voiceName }
 * Returns: boolean indicating whether a matching voice was used (useful for UI warnings)
 */
export async function speak(text, langOrUi = 'en', options = {}) {
  if (!('speechSynthesis' in window)) {
    console.warn('Text-to-Speech not supported in this browser.');
    return false;
  }
  const synth = window.speechSynthesis;

  // Stop any ongoing speech
  synth.cancel();

  const lang = uiToSpeechLang[langOrUi] || langOrUi;

  // Wait for voices (or timeout quickly)
  await Promise.race([
    voicesReady,
    new Promise(res => setTimeout(res, 500)),
  ]);

  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = lang;

  const {
    rate = 1,
    pitch = 1,
    volume = 1,
    voiceName, // optional exact name from listVoices()
  } = options;

  utterance.rate = rate;
  utterance.pitch = pitch;
  utterance.volume = volume;

  const list = cachedVoices.length ? cachedVoices : synth.getVoices();
  let chosen = null;

  if (voiceName && list && list.length) {
    chosen = list.find(v => v.name === voiceName) || null;
  }
  if (!chosen) {
    chosen = bestVoiceFor(lang);
  }
  const matched =
    !!chosen &&
    (() => {
      const want = (lang || '').toLowerCase();
      const tag = (chosen.lang || '').toLowerCase();
      const primary = want.split('-')[0];
      return tag === want || tag.startsWith(primary + '-') || tag === primary;
    })();

  if (chosen) {
    utterance.voice = chosen;
    // Align lang with chosen voice to avoid engine mismatch
    utterance.lang = chosen.lang || lang;
    if (chosen.voiceURI) utterance.voiceURI = chosen.voiceURI;
  }

  utterance.onend = () => {
    isSpeaking = false;
  };
  utterance.onerror = () => {
    isSpeaking = false;
  };

  synth.speak(utterance);
  isSpeaking = true;
  return matched; // caller can detect if it fell back to default voice
}

/**
 * Toggle speaking state for given text/lang.
 */
export async function toggleSpeak(text, langOrUi = 'en', options = {}) {
  if (!('speechSynthesis' in window)) {
    console.warn('Text-to-Speech not supported in this browser.');
    return false;
  }
  const synth = window.speechSynthesis;

  if (isSpeaking) {
    synth.cancel();
    isSpeaking = false;
    return true;
  } else {
    return await speak(text, langOrUi, options);
  }
}

/**
 * List all available voices for building a UI picker.
 */
export function listVoices() {
  if (!('speechSynthesis' in window)) return [];
  const list = cachedVoices.length ? cachedVoices : window.speechSynthesis.getVoices();
  return list.map(v => ({
    name: v.name,
    lang: (v.lang || '').replace('_', '-'),
    default: !!v.default,
    localService: !!v.localService,
    voiceURI: v.voiceURI,
  }));
}
