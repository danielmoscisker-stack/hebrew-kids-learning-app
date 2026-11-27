// Generates every UI voice clip that is NOT a letter/number/word recording:
//  - activity tile names (home screen)       -> public/audio/tiles/
//  - home greeting / onboarding phrases      -> public/audio/phrases/
//  - all dynamic texts spoken via speakText()-> public/audio/tts/ (hashed names)
//  - pronunciation fixes for Chaf (כ) and Hay (ה)
// Run: node scripts/generate-ui-audio.js   (add --force to regenerate existing files)
import * as googleTTS from 'google-tts-api';
import fs from 'fs';
import path from 'path';
import { VOWELS_DATA, VOWEL_CONTRASTS, VOWEL_TRAIN_ROWS, FIRST_WORDS_DATA } from '../src/data/curriculumData.js';
import { ttsFileName, normalizeTtsText, ttsLang } from '../src/utils/ttsKey.js';

const FORCE = process.argv.includes('--force');
const root = path.join(process.cwd(), 'public', 'audio');
const dirs = ['tiles', 'phrases', 'tts', 'letters', 'questions'];
dirs.forEach((d) => fs.mkdirSync(path.join(root, d), { recursive: true }));

export const TILES = [
  { id: 'letters', he: 'אוֹתִיּוֹת', en: 'Letters' },
  { id: 'quiz', he: 'אֵיזוֹ אוֹת זֹאת?', en: 'Which letter is it?' },
  { id: 'train', he: 'רַכֶּבֶת הַקְּרִיאָה', en: 'Reading train' },
  { id: 'detective', he: 'בַּלָּשׁ הַפּוּפִּיק', en: 'Pupik detective' },
  { id: 'vowels', he: 'עוֹלַם הַנִּקּוּד', en: 'Vowel world' },
  { id: 'first_words', he: 'מִלִּים רִאשׁוֹנוֹת', en: 'First words' },
  { id: 'numbers', he: 'מִסְפָּרִים', en: 'Numbers' },
  { id: 'tracing', he: 'צִיּוּר וּכְתִיבָה', en: 'Drawing and writing' },
  { id: 'memory', he: 'מִשְׂחַק זִכָּרוֹן', en: 'Memory game' },
  { id: 'stickers', he: 'הַמַּדְבֵּקוֹת שֶׁלִּי', en: 'My stickers' },
  { id: 'opening_sound', he: 'הַקּוֹל הַפּוֹתֵחַ', en: 'Opening sound' },
  { id: 'math_play', he: 'חֶשְׁבּוֹן רִאשׁוֹן', en: 'First math' }
];

const jobs = [];
const add = (dir, file, text, lang = 'iw', force = FORCE) => jobs.push({ dir, file, text, lang, force });

// --- Tiles
TILES.forEach((t) => {
  add('tiles', `${t.id}.mp3`, t.he);
  add('tiles', `en_${t.id}.mp3`, t.en, 'en');
});

// --- Home / onboarding phrases (gendered)
add('phrases', 'welcome_home_boy.mp3', 'שָׁלוֹם! בּוֹא נְשַׂחֵק וְנִלְמַד. בְּחַר מִשְׂחָק!');
add('phrases', 'welcome_home_girl.mp3', 'שָׁלוֹם! בּוֹאִי נְשַׂחֵק וְנִלְמַד. בַּחֲרִי מִשְׂחָק!');
add('phrases', 'who_plays.mp3', 'מִי מְשַׂחֵק הַיּוֹם? יֶלֶד אוֹ יַלְדָּה?');
add('phrases', 'parents_only.mp3', 'הָאֵזוֹר הַזֶּה מִיּוֹעָד לַהוֹרִים');
add('phrases', 'inst_opening_sound_boy.mp3', 'הַקְשֵׁב לַמִּלָּה וּבְחַר בְּאֵיזוֹ אוֹת הִיא מַתְחִילָה');
add('phrases', 'inst_opening_sound_girl.mp3', 'הַקְשִׁיבִי לַמִּלָּה וּבַחֲרִי בְּאֵיזוֹ אוֹת הִיא מַתְחִילָה');
add('phrases', 'inst_math_play_boy.mp3', 'סְפֹר אֶת כָּל הַפֵּרוֹת יַחַד וּבְחַר אֶת הַמִּסְפָּר הַנָּכוֹן');
add('phrases', 'inst_math_play_girl.mp3', 'סִפְרִי אֶת כָּל הַפֵּרוֹת יַחַד וּבַחֲרִי אֶת הַמִּסְפָּר הַנָּכוֹן');

// --- Pronunciation fixes (always regenerated)
// Chaf: spelled phonetically so the voice says "CHAF" (not "KAF")
['khaf', 'chaf'].forEach((id) => {
  add('letters', `${id}.mp3`, 'חַף', 'iw', true);
  add('letters', `haot_${id}.mp3`, 'הָאוֹת חַף', 'iw', true);
  add('questions', `where_${id}.mp3`, 'חַף', 'iw', true);
});
// Hay: "הֵי" reads as a clean single-syllable "HAY"
['he', 'hay'].forEach((id) => {
  add('letters', `${id}.mp3`, 'הֵי', 'iw', true);
  add('letters', `haot_${id}.mp3`, 'הָאוֹת הֵי', 'iw', true);
  add('questions', `where_${id}.mp3`, 'הֵי', 'iw', true);
});

// --- Dynamic speakText() clips
const tts = new Map();
const addTts = (text, lang) => {
  if (!normalizeTtsText(text)) return;
  tts.set(ttsFileName(text, lang), { text: normalizeTtsText(text), lang: ttsLang(lang) });
};
VOWELS_DATA.forEach((v) => {
  addTts(`${v.sound}. ${v.soundHintHe}`, 'he-IL');
  addTts(`${v.sound}. ${v.soundHintEn}`, 'en-US');
});
VOWEL_CONTRASTS.forEach((c) => {
  addTts(c.leftSound, 'he-IL');
  addTts(c.rightSound, 'he-IL');
});
VOWEL_TRAIN_ROWS.forEach((r) => r.letters.forEach((l) => addTts(l, 'he-IL')));
FIRST_WORDS_DATA.forEach((w) => w.syllables.forEach((s) => addTts(s, 'he-IL')));
tts.forEach((v, file) => add('tts', file, v.text, v.lang));

async function run() {
  let made = 0;
  for (const j of jobs) {
    const out = path.join(root, j.dir, j.file);
    if (!j.force && fs.existsSync(out)) continue;
    const b64 = await googleTTS.getAudioBase64(j.text, {
      lang: j.lang === 'en' ? 'en' : 'iw',
      slow: false,
      host: 'https://translate.google.com',
      timeout: 10000
    });
    fs.writeFileSync(out, Buffer.from(b64, 'base64'));
    made++;
    await new Promise((r) => setTimeout(r, 120));
  }
  console.log(`UI audio ready: ${made} generated, ${jobs.length} total (${tts.size} tts clips).`);
}

run().catch((e) => {
  console.error(e);
  process.exit(1);
});
