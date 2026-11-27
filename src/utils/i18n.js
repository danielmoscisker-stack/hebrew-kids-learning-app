// Shared tri-lingual helper: Hebrew ('he'), English ('en'), Spanish ('es')
export const tr = (lang, he, en, es) => (lang === 'he' ? he : lang === 'es' ? es : en);
export const isRtl = (lang) => lang === 'he';
