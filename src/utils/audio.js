// High-Quality Studio Audio Engine for Hebrew Learning App
// Uses real Israeli female voice recordings with instant audio playback

import { ttsFileName, normalizeTtsText } from './ttsKey';

let currentAudio = null;
let muted = false;

/** Global mute switch (voice + sound effects) controlled from the top bar */
export const setMuted = (value) => {
  muted = Boolean(value);
  if (muted && currentAudio) {
    currentAudio.pause();
  }
};

export const playAudioFile = (url, onEnded = null) => {
  if (muted) {
    if (onEnded) setTimeout(onEnded, 300);
    return null;
  }
  try {
    if (currentAudio) {
      currentAudio.pause();
      currentAudio.currentTime = 0;
      currentAudio.onended = null;
    }
    const audio = new Audio(url);
    currentAudio = audio;

    if (onEnded) {
      audio.onended = () => {
        onEnded();
      };
    }

    const playPromise = audio.play();
    if (playPromise !== undefined) {
      playPromise.catch((err) => {
        if (err.name === 'AbortError') return;
        console.warn("Audio file playback blocked or not found:", url, err);
        if (onEnded) onEnded();
      });
    }
    return audio;
  } catch (e) {
    console.warn("Audio playback error:", e);
    if (onEnded) onEnded();
  }
};

const CHAR_TO_ID = {
  'א': 'alef',
  'בּ': 'bet_dagesh',
  'ב': 'vet',
  'ג': 'gimel',
  'ד': 'dalet',
  'ה': 'he',
  'ו': 'vav',
  'ז': 'zayin',
  'ח': 'chet',
  'ט': 'tet',
  'י': 'yod',
  'כּ': 'kaf_dagesh',
  'כ': 'khaf',
  'ל': 'lamed',
  'מ': 'mem',
  'נ': 'nun',
  'ס': 'samech',
  'ע': 'ayin',
  'פּ': 'pe_dagesh',
  'פ': 'fe',
  'צ': 'tsadi',
  'ק': 'kof',
  'ר': 'resh',
  'שׁ': 'shin',
  'שׂ': 'sin',
  'ת': 'tav'
};

/**
 * Plays the real, crystal-clear Israeli woman recording of the letter name
 * with optional pedagogical prefix (e.g. "הָאוֹת בֵּית!") for complete consistency
 */
export const speakLetterName = (letterIdentifier, withPrefix = false) => {
  // If letterIdentifier is a char like 'בּ' or an id like 'bet_dagesh'
  let id = CHAR_TO_ID[letterIdentifier] || letterIdentifier;

  // If it's a hebrew name like "אָלֶף"
  const nameMap = {
    'אָלֶף': 'alef',
    'בֵּית': 'bet_dagesh',
    'וֵית': 'vet',
    'גִּימֶל': 'gimel',
    'דָּלֶת': 'dalet',
    'הֵיי': 'he',
    'הֵי': 'he',
    'הֵא': 'he',
    'הֵא!': 'he',
    'הֵיי!': 'he',
    'וָו': 'vav',
    'זַיִן': 'zayin',
    'חֵית': 'chet',
    'טֵית': 'tet',
    'יוֹד': 'yod',
    'יוּד': 'yod',
    'יוּד!': 'yod',
    'יוֹד!': 'yod',
    'כַּף': 'kaf_dagesh',
    'כַף': 'khaf',
    'לָמֶד': 'lamed',
    'מֵם': 'mem',
    'נוּן': 'nun',
    'סָמֶךְ': 'samech',
    'עַיִן': 'ayin',
    'פֵּא': 'pe_dagesh',
    'פֶּי': 'pe_dagesh',
    'פֵּי': 'pe_dagesh',
    'פֵּיי': 'pe_dagesh',
    'פֵא': 'fe',
    'פֵיי': 'fe',
    'פֵי': 'fe',
    'צָדִי': 'tsadi',
    'סָאדִי': 'tsadi',
    'צָדֵי': 'tsadi',
    'צַדִּיק': 'tsadi',
    'קוּף': 'kof',
    'רֵישׁ': 'resh',
    'שִׁין': 'shin',
    'שִׂין': 'sin',
    'תָּיו': 'tav'
  };

  if (nameMap[letterIdentifier]) {
    id = nameMap[letterIdentifier];
  }

  // Play natural studio recording - direct letter name without "הָאוֹת" prefix
  const audioUrl = `/audio/letters/${id}.mp3`;
  playAudioFile(audioUrl);
};

/**
 * Plays the natural studio recording for example words
 */
export const playWordAudio = (englishName) => {
  const filename = englishName.toLowerCase().replace(/[^a-z0-9]/g, '_') + '.mp3';
  playAudioFile(`/audio/words/${filename}`);
};

/**
 * Plays natural studio recording for numbers 1-10
 */
export const playNumberAudio = (num, onEnded = null) => {
  return playAudioFile(`/audio/numbers/num_${num}.mp3`, onEnded);
};

const GENDERED_PHRASES = new Set([
  'crazy_correct',
  'great_job',
  'pupik_touch',
  'train_star',
  'try_again',
  'correct_answer',
  'helper_hint',
  'inst_letters',
  'inst_letters_mouse',
  'inst_letters_touch',
  'explain_bet',
  'explain_vet',
  'inst_quiz',
  'inst_quiz_cards_mouse',
  'inst_quiz_cards_touch',
  'inst_train',
  'inst_detective',
  'inst_sorting',
  'inst_sorting_mouse',
  'inst_sorting_touch',
  'inst_first_words',
  'inst_first_words_mouse',
  'inst_first_words_touch',
  'inst_vowels',
  'inst_vowels_mouse',
  'inst_vowels_touch',
  'inst_numbers',
  'inst_numbers_mouse',
  'inst_numbers_touch',
  'inst_tracing',
  'inst_tracing_mouse',
  'inst_tracing_touch',
  'tracing_keep_going',
  'tracing_inside',
  'tracing_success',
  'inst_memory',
  'inst_stickers',
  'inst_opening_sound',
  'inst_math_play',
  'welcome_home'
]);

/**
 * Plays phrase recordings (pupik touch, celebrations, instructions)
 * Adapts to boy or girl user for accurate Hebrew gender conjugation
 */
export const playPhraseAudio = (phraseId, gender = 'boy') => {
  if (GENDERED_PHRASES.has(phraseId)) {
    const g = gender === 'girl' ? 'girl' : 'boy';
    playAudioFile(`/audio/phrases/${phraseId}_${g}.mp3`);
  } else {
    playAudioFile(`/audio/phrases/${phraseId}.mp3`);
  }
};

/**
 * Speaks the letter name directly without "הָאוֹת" or "אֵיפֹה הָאוֹת"
 */
export const playWhereIsLetterAudio = (letterIdentifier) => {
  speakLetterName(letterIdentifier);
};

// Web Audio API Synthesizer for instant micro-sound effects
let audioCtx = null;
function getAudioContext() {
  if (!audioCtx) {
    const AudioContextClass = window.AudioContext || window.webkitAudioContext;
    if (AudioContextClass) {
      audioCtx = new AudioContextClass();
    }
  }
  if (audioCtx && audioCtx.state === 'suspended') {
    audioCtx.resume();
  }
  return audioCtx;
}

export const playSound = (type) => {
  if (muted) return;
  try {
    const ctx = getAudioContext();
    if (!ctx) return;

    const now = ctx.currentTime;

    switch (type) {
      case 'pop': {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(450, now);
        osc.frequency.exponentialRampToValueAtTime(850, now + 0.08);
        gain.gain.setValueAtTime(0.35, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.08);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now);
        osc.stop(now + 0.08);
        break;
      }

      case 'pupik': {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(220, now);
        osc.frequency.exponentialRampToValueAtTime(660, now + 0.15);
        osc.frequency.exponentialRampToValueAtTime(330, now + 0.3);
        gain.gain.setValueAtTime(0.45, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.35);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now);
        osc.stop(now + 0.35);
        break;
      }

      case 'star': {
        [523.25, 659.25, 783.99, 1046.5].forEach((freq, idx) => {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = 'sine';
          osc.frequency.setValueAtTime(freq, now + idx * 0.06);
          gain.gain.setValueAtTime(0.25, now + idx * 0.06);
          gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.06 + 0.3);
          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.start(now + idx * 0.06);
          osc.stop(now + idx * 0.06 + 0.3);
        });
        break;
      }

      case 'train': {
        const osc1 = ctx.createOscillator();
        const osc2 = ctx.createOscillator();
        const gain = ctx.createGain();
        osc1.type = 'sawtooth';
        osc2.type = 'sine';
        osc1.frequency.setValueAtTime(440, now);
        osc2.frequency.setValueAtTime(554.37, now);
        osc1.frequency.linearRampToValueAtTime(460, now + 0.25);
        osc2.frequency.linearRampToValueAtTime(580, now + 0.25);
        gain.gain.setValueAtTime(0.18, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.4);
        osc1.connect(gain);
        osc2.connect(gain);
        gain.connect(ctx.destination);
        osc1.start(now);
        osc2.start(now);
        osc1.stop(now + 0.4);
        osc2.stop(now + 0.4);
        break;
      }

      case 'win': {
        const notes = [440, 554.37, 659.25, 880];
        notes.forEach((freq, idx) => {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = 'triangle';
          osc.frequency.setValueAtTime(freq, now + idx * 0.08);
          gain.gain.setValueAtTime(0.3, now + idx * 0.08);
          gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.08 + 0.5);
          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.start(now + idx * 0.08);
          osc.stop(now + idx * 0.08 + 0.5);
        });
        break;
      }

      case 'whoosh': {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(600, now);
        osc.frequency.exponentialRampToValueAtTime(200, now + 0.2);
        gain.gain.setValueAtTime(0.25, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.2);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now);
        osc.stop(now + 0.2);
        break;
      }

      default:
        break;
    }
  } catch (err) {
    console.warn('Audio playback error', err);
  }
};

/**
 * High quality spoken text engine
 * Uses the authentic Israeli woman neural TTS for 100% voice consistency across all screens
 */
export const speakText = (text, lang = 'iw') => {
  try {
    const clean = normalizeTtsText(text);
    if (!clean) return;
    if (ttsLang(lang) === 'es') {
      if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
        window.speechSynthesis.cancel();
        const utt = new SpeechSynthesisUtterance(clean);
        utt.lang = 'es-ES';
        utt.rate = 0.92;
        window.speechSynthesis.speak(utt);
      }
      return;
    }
    // Bundled, pre-generated clip (see scripts/generate-ui-audio.js) – works fully offline
    playAudioFile(`/audio/tts/${ttsFileName(text, lang)}`);
  } catch (e) {
    console.warn('Speech error', e);
  }
};

/** Speaks the name of an activity tile on the home screen (for pre-readers) */
export const playTileName = (tileId) => {
  playAudioFile(`/audio/tiles/${tileId}.mp3`);
};
