// src/utils/voiceManager.js
let voicesCache = [];
let voicesReadyPromise = null;

const loadVoicesOnce = () => {
  if (voicesReadyPromise) return voicesReadyPromise;
  voicesReadyPromise = new Promise((resolve) => {
    const synth = window.speechSynthesis;
    const load = () => {
      const v = synth.getVoices();
      if (v && v.length) {
        voicesCache = v;
        resolve(v);
      }
    };
    load();
    // Fallback for async load
    synth.onvoiceschanged = () => {
      voicesCache = synth.getVoices();
      resolve(voicesCache);
    };
    // Safety timeout in rare cases where event doesn't fire
    setTimeout(load, 1000);
  });
  return voicesReadyPromise;
};

export const getVoices = async () => {
  await loadVoicesOnce();
  return voicesCache;
};

// Find best matching voice for given lang(s)
export const pickVoice = async (preferredLangs = ["hi-IN", "hi", "en-IN", "en-US"]) => {
  const voices = await getVoices();
  // 1) Exact match
  for (const tag of preferredLangs) {
    const exact = voices.find(v => v.lang?.toLowerCase() === tag.toLowerCase());
    if (exact) return exact;
  }
  // 2) Starts-with match (e.g., "hi" matches "hi-IN")
  for (const tag of preferredLangs) {
    const base = tag.split("-")[0].toLowerCase();
    const starts = voices.find(v => v.lang?.toLowerCase().startsWith(base));
    if (starts) return starts;
  }
  // 3) Default voice fallback
  const def = voices.find(v => v.default);
  return def || voices[0] || null;
};
