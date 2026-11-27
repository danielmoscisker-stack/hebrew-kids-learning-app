// Deterministic file name for pre-generated (offline) speech clips.
// Shared by the runtime audio engine and scripts/generate-ui-audio.js
// so that every spoken text maps to a bundled MP3 – no network calls at runtime.

export const normalizeTtsText = (text) => text.replace(/[*#()]/g, '').trim();

export const ttsLang = (lang) => {
  if (lang === 'en-US' || lang === 'en') return 'en';
  if (lang === 'es-ES' || lang === 'es') return 'es';
  return 'iw';
};

export const ttsFileName = (text, lang = 'iw') => {
  const key = `${ttsLang(lang)}|${normalizeTtsText(text)}`;
  // FNV-1a 32-bit
  let h = 0x811c9dc5;
  for (let i = 0; i < key.length; i++) {
    h ^= key.charCodeAt(i);
    h = Math.imul(h, 0x01000193) >>> 0;
  }
  return `${ttsLang(lang)}_${h.toString(16).padStart(8, '0')}.mp3`;
};
