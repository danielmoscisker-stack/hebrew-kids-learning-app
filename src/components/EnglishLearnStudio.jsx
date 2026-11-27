import React, { useState, useEffect } from 'react';
import {
  Volume2,
  ChevronLeft,
  ChevronRight,
  Lightbulb,
  RefreshCw,
  Sparkles,
  CheckCircle2,
  ArrowRight,
  BookOpen,
  RotateCcw
} from 'lucide-react';
import {
  ENGLISH_ABC_CARDS,
  SPELLING_WORDS_AGE7,
  SPELLING_WORDS_AGE9,
  AGE9_FLASHCARD_DECKS,
  AGE9_SENTENCE_PUZZLES
} from '../data/englishStudioData';
import { playSound } from '../utils/audio';
import { triggerConfetti, triggerStarBurst } from '../utils/confetti';
import { tr } from '../utils/i18n';

function speakEnglish(text, rate = 0.88) {
  if (!text) return;
  try {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;
    window.speechSynthesis.cancel();
    const utt = new SpeechSynthesisUtterance(String(text));
    utt.lang = 'en-US';
    utt.rate = rate;
    window.speechSynthesis.speak(utt);
  } catch {
    // ignore
  }
}

function scrambleArray(items) {
  const arr = items.map((val, idx) => ({ id: `${idx}-${val}`, val }));
  if (arr.length <= 1) return arr;
  for (let attempt = 0; attempt < 6; attempt += 1) {
    const copy = [...arr];
    for (let i = copy.length - 1; i > 0; i -= 1) {
      const j = Math.floor(Math.random() * (i + 1));
      [copy[i], copy[j]] = [copy[j], copy[i]];
    }
    if (copy.some((x, i) => x.val !== items[i])) return copy;
  }
  return [...arr].reverse();
}

export default function EnglishLearnStudio({
  ageMode = 7,
  lang,
  soundEnabled,
  onEarnStar,
  onSwitchActivity
}) {
  const isHe = lang === 'he';
  const isAge9 = ageMode === 9;

  const [mode, setMode] = useState(isAge9 ? 'cards' : 'abc');

  // --- Age 7 A-Z Phonics state ---
  const [abcIndex, setAbcIndex] = useState(0);

  // --- Age 9 Flashcards state ---
  const [deckIdx, setDeckIdx] = useState(0);
  const [cardIdx, setCardIdx] = useState(0);
  const [cardFlipped, setCardFlipped] = useState(false);

  // --- Spelling state (both Age 7 & Age 9) ---
  const spellBank = isAge9 ? SPELLING_WORDS_AGE9 : SPELLING_WORDS_AGE7;
  const [spellIdx, setSpellIdx] = useState(0);
  const [spellPool, setSpellPool] = useState(() => scrambleArray(spellBank[0].word.split('')));
  const [spellPicked, setSpellPicked] = useState([]);
  const [spellStatus, setSpellStatus] = useState(null); // null | 'correct' | 'wrong'
  const [showSpellHint, setShowSpellHint] = useState(false);

  // --- Age 9 Sentence Builder state ---
  const [sentIdx, setSentIdx] = useState(0);
  const [sentPool, setSentPool] = useState(() => scrambleArray(AGE9_SENTENCE_PUZZLES[0].words));
  const [sentPicked, setSentPicked] = useState([]);
  const [sentStatus, setSentStatus] = useState(null);
  const [showSentHint, setShowSentHint] = useState(false);

  useEffect(() => {
    return () => {
      try {
        if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
          window.speechSynthesis.cancel();
        }
      } catch {
        // ignore
      }
    };
  }, []);

  const loadSpellWord = (nextIndex) => {
    const wrapped = (nextIndex + spellBank.length) % spellBank.length;
    setSpellIdx(wrapped);
    setSpellPool(scrambleArray(spellBank[wrapped].word.split('')));
    setSpellPicked([]);
    setSpellStatus(null);
    setShowSpellHint(false);
    if (soundEnabled) {
      speakEnglish(spellBank[wrapped].word, 0.85);
    }
  };

  const loadSentence = (nextIndex) => {
    const wrapped = (nextIndex + AGE9_SENTENCE_PUZZLES.length) % AGE9_SENTENCE_PUZZLES.length;
    setSentIdx(wrapped);
    setSentPool(scrambleArray(AGE9_SENTENCE_PUZZLES[wrapped].words));
    setSentPicked([]);
    setSentStatus(null);
    setShowSentHint(false);
  };

  const handlePickLetter = (tile, e) => {
    if (spellStatus === 'correct') return;
    if (spellPicked.some((t) => t.id === tile.id)) return;
    playSound('pop');
    const nextPicked = [...spellPicked, tile];
    setSpellPicked(nextPicked);
    setSpellStatus(null);

    const target = spellBank[spellIdx].word;
    if (nextPicked.length === target.length) {
      const built = nextPicked.map((t) => t.val).join('');
      if (built === target) {
        setSpellStatus('correct');
        playSound('success');
        onEarnStar?.(1);
        if (e?.currentTarget) {
          const r = e.currentTarget.getBoundingClientRect();
          triggerStarBurst(r.left + r.width / 2, r.top + r.height / 2);
        } else {
          triggerConfetti();
        }
        if (soundEnabled) speakEnglish(target, 0.9);
      } else {
        setSpellStatus('wrong');
        playSound('whoosh');
      }
    }
  };

  const handleRemoveLetter = (tileId) => {
    if (spellStatus === 'correct') return;
    playSound('pop');
    setSpellPicked((prev) => prev.filter((t) => t.id !== tileId));
    setSpellStatus(null);
  };

  const handlePickWord = (tile, e) => {
    if (sentStatus === 'correct') return;
    if (sentPicked.some((t) => t.id === tile.id)) return;
    playSound('pop');
    const nextPicked = [...sentPicked, tile];
    setSentPicked(nextPicked);
    setSentStatus(null);

    const targetWords = AGE9_SENTENCE_PUZZLES[sentIdx].words;
    if (nextPicked.length === targetWords.length) {
      const built = nextPicked.map((t) => t.val).join(' ');
      const expected = targetWords.join(' ');
      if (built === expected) {
        setSentStatus('correct');
        playSound('success');
        onEarnStar?.(2);
        if (e?.currentTarget) {
          const r = e.currentTarget.getBoundingClientRect();
          triggerStarBurst(r.left + r.width / 2, r.top + r.height / 2);
        } else {
          triggerConfetti();
        }
        if (soundEnabled) speakEnglish(expected, 0.9);
      } else {
        setSentStatus('wrong');
        playSound('whoosh');
      }
    }
  };

  const handleRemoveWord = (tileId) => {
    if (sentStatus === 'correct') return;
    playSound('pop');
    setSentPicked((prev) => prev.filter((t) => t.id !== tileId));
    setSentStatus(null);
  };

  const currentAbc = ENGLISH_ABC_CARDS[abcIndex];
  const currentDeck = AGE9_FLASHCARD_DECKS[deckIdx];
  const currentFlashcard = currentDeck.cards[cardIdx];
  const currentSpell = spellBank[spellIdx];
  const currentSent = AGE9_SENTENCE_PUZZLES[sentIdx];

  const modeTabs = isAge9
    ? [
        { id: 'cards', icon: '🗂️', he: 'כַּרְטִיסִיּוֹת וּמִשְׁפָּטִים', en: 'Flashcards', es: 'Tarjetas' },
        { id: 'spell', icon: '✍️', he: 'אִיּוּת וּשְׁמִיעָה', en: 'Listen & Spell', es: 'Ortografía' },
        { id: 'sentences', icon: '🧩', he: 'בְּנִיַּת מִשְׁפָּטִים', en: 'Sentence Builder', es: 'Construir Frases' }
      ]
    : [
        { id: 'abc', icon: '🔤', he: 'אוֹתִיּוֹת A–Z וּצְלִילִים', en: 'A–Z Phonics', es: 'Abecedario A–Z' },
        { id: 'spell', icon: '✍️', he: 'הַקְשֵׁב וְאִיֵּת', en: 'Listen & Spell', es: 'Escucha y Deletrea' }
      ];

  return (
    <div className="max-w-4xl mx-auto px-3 sm:px-5 pt-4 pb-10" dir={isHe ? 'rtl' : 'ltr'}>
      {/* Hero Banner */}
      <div
        className={`rounded-3xl p-4 sm:p-5 text-white shadow-lg border-4 mb-4 ${
          isAge9
            ? 'bg-gradient-to-r from-indigo-600 via-blue-600 to-cyan-600 border-indigo-300'
            : 'bg-gradient-to-r from-sky-500 via-blue-500 to-indigo-600 border-sky-300'
        }`}
      >
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-13 h-13 sm:w-14 sm:h-14 rounded-2xl bg-white/20 backdrop-blur-sm border-2 border-white/40 flex items-center justify-center text-3xl flex-shrink-0">
              {isAge9 ? '🇬🇧' : '🔤'}
            </div>
            <div>
              <h2 className="text-xl sm:text-2xl font-black leading-tight">
                {isAge9
                  ? tr(lang, 'סְטוּדְיוֹ אַנְגְּלִית • גִּיל 9', 'English Learning Studio • Age 9', 'Estudio de Inglés • Edad 9')
                  : tr(lang, 'לִמּוּד אַנְגְּלִית A–Z וְאִיּוּת • גִּיל 7', 'Learn English A–Z & Spelling • Age 7', 'Aprende Inglés A–Z • Edad 7')}
              </h2>
              <p className="text-xs sm:text-sm font-bold text-white/90 mt-0.5">
                {isAge9
                  ? tr(
                      lang,
                      'כִּתָּה ג׳–ד׳ • כַּרְטִיסִיּוֹת קוֹלִיּוֹת, אִיּוּת מִלִּים וּבְנִיַּת מִשְׁפָּטִים בְּאַנְגְּלִית!',
                      'Grades 3–4 • Audio Flashcards, Spelling & English Sentence Builder!',
                      'Grados 3–4 • Tarjetas con audio, ortografía y frases en inglés.'
                    )
                  : tr(
                      lang,
                      'כִּתָּה א׳–ב׳ • אוֹתִיּוֹת A–Z עִם הֲגִיָּה וּמִשְׂחַק אִיּוּת מִלִּים רִאשׁוֹנוֹת!',
                      'Grades 1–2 • Interactive A–Z Phonics Cards & First Word Spelling!',
                      'Grados 1–2 • Letras A–Z con audio y ortografía básica.'
                    )}
              </p>
            </div>
          </div>

          {onSwitchActivity && (
            <button
              type="button"
              onClick={() => {
                playSound('pop');
                onSwitchActivity(isAge9 ? 'english_age9' : 'english_age7');
              }}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-2xl bg-white/20 hover:bg-white/30 border-2 border-white/50 text-white font-black text-xs sm:text-sm btn-press-3d cursor-pointer"
            >
              <Sparkles className="w-4 h-4" />
              <span>{tr(lang, 'לְחִידוֹן הָאַנְגְּלִית', 'Play English Quiz', 'Ir al Quiz de Inglés')}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Mode Switcher Tabs */}
        <div className="flex flex-wrap gap-2 mt-4">
          {modeTabs.map((t) => {
            const active = mode === t.id;
            return (
              <button
                key={t.id}
                type="button"
                onClick={() => {
                  playSound('pop');
                  setMode(t.id);
                }}
                className={`flex items-center gap-1.5 px-4 py-2 rounded-2xl font-black text-xs sm:text-sm border-2 transition cursor-pointer ${
                  active
                    ? 'bg-white text-indigo-900 border-white shadow-md'
                    : 'bg-white/15 text-white border-white/30 hover:bg-white/25'
                }`}
              >
                <span>{t.icon}</span>
                <span>{tr(lang, t.he, t.en, t.es)}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* ===================== MODE 1 (AGE 7): A-Z PHONICS CARDS ===================== */}
      {!isAge9 && mode === 'abc' && (
        <div className="bg-white rounded-3xl border-4 border-sky-200 shadow-xl p-4 sm:p-6 flex flex-col gap-5">
          {/* Quick A-Z Letter Strip */}
          <div className="flex flex-wrap justify-center gap-1.5" dir="ltr">
            {ENGLISH_ABC_CARDS.map((item, idx) => {
              const active = idx === abcIndex;
              return (
                <button
                  key={item.upper}
                  type="button"
                  onClick={() => {
                    playSound('pop');
                    setAbcIndex(idx);
                    if (soundEnabled) speakEnglish(`${item.upper}. ${item.word}`, 0.85);
                  }}
                  className={`w-9 h-9 sm:w-10 sm:h-10 rounded-xl font-black text-sm sm:text-base border-2 transition cursor-pointer ${
                    active
                      ? 'bg-indigo-600 text-white border-indigo-700 scale-110 shadow-md'
                      : 'bg-sky-50 text-indigo-900 border-sky-200 hover:bg-sky-100'
                  }`}
                >
                  {item.upper}
                </button>
              );
            })}
          </div>

          {/* Big Interactive Phonics Card */}
          <div className="bg-gradient-to-b from-sky-50 to-indigo-50 rounded-3xl border-3 border-sky-300 p-5 sm:p-7 flex flex-col items-center text-center gap-4">
            <div className="flex items-center justify-center gap-6 flex-wrap" dir="ltr">
              <button
                type="button"
                onClick={() => speakEnglish(currentAbc.upper, 0.8)}
                className="px-7 py-4 rounded-3xl bg-white border-4 border-indigo-300 shadow-md hover:scale-105 transition cursor-pointer"
                title={tr(lang, 'שְׁמַע אֶת הָאוֹת', 'Hear Letter', 'Escuchar letra')}
              >
                <span className="text-6xl sm:text-7xl font-black text-indigo-700 tracking-wide">
                  {currentAbc.upper} {currentAbc.lower}
                </span>
              </button>

              <button
                type="button"
                onClick={() => speakEnglish(currentAbc.word, 0.85)}
                className="flex flex-col items-center px-6 py-4 rounded-3xl bg-white border-4 border-amber-300 shadow-md hover:scale-105 transition cursor-pointer"
              >
                <span className="text-5xl sm:text-6xl mb-1">{currentAbc.emoji}</span>
                <span className="text-2xl sm:text-3xl font-black text-slate-900">{currentAbc.word}</span>
              </button>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-2 text-sm sm:text-base font-black">
              <span className="px-3.5 py-1.5 rounded-full bg-amber-100 border border-amber-300 text-amber-950">
                {tr(lang, `צְלִיל בְּעִבְרִית: "${currentAbc.soundHe}"`, `Hebrew sound cue: ${currentAbc.soundHe}`, `Sonido: ${currentAbc.soundHe}`)}
              </span>
              <span className="px-3.5 py-1.5 rounded-full bg-emerald-100 border border-emerald-300 text-emerald-950">
                {currentAbc.he}
              </span>
            </div>

            {/* Example sentence */}
            <div className="w-full max-w-md bg-white rounded-2xl border-2 border-indigo-200 px-4 py-3 flex items-center justify-between gap-2" dir="ltr">
              <span className="font-extrabold text-slate-800 text-base sm:text-lg text-left">
                {currentAbc.sentence}
              </span>
              <button
                type="button"
                onClick={() => speakEnglish(currentAbc.sentence, 0.85)}
                className="p-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white btn-press-3d cursor-pointer flex-shrink-0"
                aria-label="Read sentence aloud"
              >
                <Volume2 className="w-5 h-5" />
              </button>
            </div>

            {/* Action Controls */}
            <div className="flex flex-wrap items-center justify-center gap-3 pt-1">
              <button
                type="button"
                onClick={() => {
                  playSound('pop');
                  const next = (abcIndex - 1 + ENGLISH_ABC_CARDS.length) % ENGLISH_ABC_CARDS.length;
                  setAbcIndex(next);
                  if (soundEnabled) speakEnglish(`${ENGLISH_ABC_CARDS[next].upper}. ${ENGLISH_ABC_CARDS[next].word}`, 0.85);
                }}
                className="flex items-center gap-1.5 px-4 py-2.5 rounded-2xl bg-white hover:bg-slate-100 border-2 border-slate-300 font-black text-slate-800 btn-press-3d cursor-pointer"
              >
                {isHe ? <ChevronRight className="w-5 h-5" /> : <ChevronLeft className="w-5 h-5" />}
                <span>{tr(lang, 'הַקּוֹדֶמֶת', 'Previous', 'Anterior')}</span>
              </button>

              <button
                type="button"
                onClick={() => speakEnglish(`${currentAbc.upper} is for ${currentAbc.word}. ${currentAbc.sentence}`, 0.85)}
                className="flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-black shadow-md btn-press-3d cursor-pointer"
              >
                <Volume2 className="w-5 h-5" />
                <span>{tr(lang, 'הַקְרֵא הַכֹּל בְּאַנְגְּלִית', 'Read Aloud', 'Leer en inglés')}</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  playSound('pop');
                  const next = (abcIndex + 1) % ENGLISH_ABC_CARDS.length;
                  setAbcIndex(next);
                  if (soundEnabled) speakEnglish(`${ENGLISH_ABC_CARDS[next].upper}. ${ENGLISH_ABC_CARDS[next].word}`, 0.85);
                }}
                className="flex items-center gap-1.5 px-4 py-2.5 rounded-2xl bg-amber-300 hover:bg-amber-400 border-2 border-amber-500 font-black text-slate-950 btn-press-3d cursor-pointer"
              >
                <span>{tr(lang, 'הָאוֹת הַבָּאָה', 'Next Letter', 'Siguiente')}</span>
                {isHe ? <ChevronLeft className="w-5 h-5" /> : <ChevronRight className="w-5 h-5" />}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ===================== MODE 1 (AGE 9): THEMATIC FLASHCARDS ===================== */}
      {isAge9 && mode === 'cards' && (
        <div className="bg-white rounded-3xl border-4 border-indigo-200 shadow-xl p-4 sm:p-6 flex flex-col gap-4">
          {/* Deck Selector */}
          <div className="flex flex-wrap justify-center gap-2">
            {AGE9_FLASHCARD_DECKS.map((deck, idx) => {
              const active = idx === deckIdx;
              return (
                <button
                  key={deck.id}
                  type="button"
                  onClick={() => {
                    playSound('pop');
                    setDeckIdx(idx);
                    setCardIdx(0);
                    setCardFlipped(false);
                  }}
                  className={`flex items-center gap-1.5 px-4 py-2 rounded-2xl font-black text-xs sm:text-sm border-2 transition cursor-pointer ${
                    active
                      ? 'bg-indigo-600 text-white border-indigo-700 shadow-sm'
                      : 'bg-indigo-50 text-indigo-900 border-indigo-200 hover:bg-indigo-100'
                  }`}
                >
                  <span>{deck.icon}</span>
                  <span>{tr(lang, deck.titleHe, deck.titleEn, deck.titleEs)}</span>
                </button>
              );
            })}
          </div>

          {/* Flip Card */}
          <div className="flex flex-col items-center gap-4">
            <div className="text-xs font-black text-slate-500">
              {tr(lang, `כַּרְטִיסִיָּה ${cardIdx + 1} מִתּוֹךְ ${currentDeck.cards.length}`, `Card ${cardIdx + 1} of ${currentDeck.cards.length}`, `Tarjeta ${cardIdx + 1} de ${currentDeck.cards.length}`)}
            </div>

            <div
              role="button"
              tabIndex={0}
              onClick={() => {
                playSound('pop');
                setCardFlipped((f) => !f);
              }}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  playSound('pop');
                  setCardFlipped((f) => !f);
                }
              }}
              className={`w-full max-w-lg min-h-[240px] rounded-3xl border-4 p-6 flex flex-col items-center justify-center text-center gap-3 shadow-lg transition cursor-pointer ${
                cardFlipped
                  ? 'bg-gradient-to-br from-emerald-50 to-teal-100 border-emerald-400'
                  : 'bg-gradient-to-br from-indigo-50 to-sky-100 border-indigo-300'
              }`}
            >
              <span className="text-5xl">{currentFlashcard.emoji}</span>
              <div className="text-3xl sm:text-4xl font-black text-slate-900" dir="ltr">
                {currentFlashcard.en}
              </div>

              {cardFlipped ? (
                <div className="flex flex-col items-center gap-2.5 mt-1 animate-pop-in">
                  <span className="px-4 py-1.5 rounded-full bg-white border-2 border-emerald-400 text-emerald-950 font-black text-lg sm:text-xl">
                    {currentFlashcard.he}
                  </span>
                  <div className="bg-white/90 rounded-2xl border border-emerald-200 px-4 py-2.5 text-sm sm:text-base font-bold text-slate-800" dir="ltr">
                    “{currentFlashcard.example}”
                  </div>
                </div>
              ) : (
                <span className="text-xs sm:text-sm font-black text-indigo-700 bg-white/80 px-3.5 py-1 rounded-full border border-indigo-200">
                  {tr(lang, 'לַחֲצוּ עַל הַכַּרְטִיס לְגַלּוֹת תַּרְגּוּם וְדֻגְמָה 👆', 'Tap card to reveal Hebrew & example 👆', 'Toca para ver traducción y ejemplo 👆')}
                </span>
              )}
            </div>

            <div className="flex flex-wrap items-center justify-center gap-2.5">
              <button
                type="button"
                onClick={() => {
                  playSound('pop');
                  setCardIdx((i) => (i - 1 + currentDeck.cards.length) % currentDeck.cards.length);
                  setCardFlipped(false);
                }}
                className="flex items-center gap-1 px-4 py-2.5 rounded-2xl bg-slate-100 hover:bg-slate-200 border-2 border-slate-300 font-black text-slate-800 btn-press-3d cursor-pointer"
              >
                {isHe ? <ChevronRight className="w-5 h-5" /> : <ChevronLeft className="w-5 h-5" />}
                <span>{tr(lang, 'הַקּוֹדֶמֶת', 'Prev', 'Anterior')}</span>
              </button>

              <button
                type="button"
                onClick={() => speakEnglish(`${currentFlashcard.en}. ${currentFlashcard.example}`, 0.88)}
                className="flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-black shadow-md btn-press-3d cursor-pointer"
              >
                <Volume2 className="w-5 h-5" />
                <span>{tr(lang, 'הַקְרֵא מִלָּה וּמִשְׁפָּט', 'Hear Word & Sentence', 'Escuchar')}</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  playSound('pop');
                  setCardIdx((i) => (i + 1) % currentDeck.cards.length);
                  setCardFlipped(false);
                }}
                className="flex items-center gap-1 px-4 py-2.5 rounded-2xl bg-amber-300 hover:bg-amber-400 border-2 border-amber-500 font-black text-slate-950 btn-press-3d cursor-pointer"
              >
                <span>{tr(lang, 'הַכַּרְטִיס הַבָּא', 'Next Card', 'Siguiente')}</span>
                {isHe ? <ChevronLeft className="w-5 h-5" /> : <ChevronRight className="w-5 h-5" />}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ===================== MODE 2 (BOTH AGES): LISTEN & SPELL ===================== */}
      {mode === 'spell' && (
        <div className="bg-white rounded-3xl border-4 border-sky-200 shadow-xl p-5 sm:p-7 flex flex-col items-center text-center gap-5">
          <div className="flex items-center justify-between w-full max-w-lg text-xs font-black text-slate-500">
            <span>
              {tr(lang, `מִלָּה ${spellIdx + 1} / ${spellBank.length}`, `Word ${spellIdx + 1} / ${spellBank.length}`, `Palabra ${spellIdx + 1} / ${spellBank.length}`)}
            </span>
            <button
              type="button"
              onClick={() => setShowSpellHint((h) => !h)}
              className="flex items-center gap-1 px-3 py-1.5 rounded-full bg-amber-100 hover:bg-amber-200 border border-amber-300 text-amber-950 cursor-pointer"
            >
              <Lightbulb className="w-3.5 h-3.5" />
              <span>{tr(lang, 'רֶמֶז', 'Hint', 'Pista')}</span>
            </button>
          </div>

          <div className="flex flex-col items-center gap-2">
            <span className="text-6xl">{currentSpell.emoji}</span>
            <div className="text-xl sm:text-2xl font-black text-slate-800">{currentSpell.he}</div>
            <button
              type="button"
              onClick={() => speakEnglish(currentSpell.word, 0.82)}
              className="flex items-center gap-2 px-5 py-2.5 mt-1 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-black text-sm sm:text-base shadow-md btn-press-3d cursor-pointer"
            >
              <Volume2 className="w-5 h-5" />
              <span>{tr(lang, 'הַקְשֵׁב לַמִּלָּה בְּאַנְגְּלִית', 'Hear English Word', 'Escuchar palabra')}</span>
            </button>
          </div>

          {showSpellHint && (
            <div className="px-4 py-2 rounded-2xl bg-amber-50 border-2 border-amber-300 text-amber-950 font-bold text-sm">
              💡 {currentSpell.hintHe}
            </div>
          )}

          {/* Answer Slots (LTR) */}
          <div className="flex flex-wrap items-center justify-center gap-2" dir="ltr">
            {currentSpell.word.split('').map((_, idx) => {
              const tile = spellPicked[idx];
              return (
                <button
                  key={idx}
                  type="button"
                  disabled={!tile || spellStatus === 'correct'}
                  onClick={() => tile && handleRemoveLetter(tile.id)}
                  className={`w-12 h-14 sm:w-14 sm:h-16 rounded-2xl border-3 font-black text-2xl sm:text-3xl flex items-center justify-center transition ${
                    spellStatus === 'correct'
                      ? 'bg-emerald-100 border-emerald-500 text-emerald-900'
                      : spellStatus === 'wrong'
                        ? 'bg-rose-100 border-rose-400 text-rose-900'
                        : tile
                          ? 'bg-indigo-100 border-indigo-500 text-indigo-950 cursor-pointer hover:bg-indigo-200'
                          : 'bg-slate-50 border-dashed border-slate-300 text-slate-300'
                  }`}
                >
                  {tile ? tile.val : '_'}
                </button>
              );
            })}
          </div>

          {/* Scrambled Letter Pool (LTR) */}
          <div className="flex flex-wrap items-center justify-center gap-2.5 max-w-md" dir="ltr">
            {spellPool.map((tile) => {
              const used = spellPicked.some((t) => t.id === tile.id);
              return (
                <button
                  key={tile.id}
                  type="button"
                  disabled={used || spellStatus === 'correct'}
                  onClick={(e) => handlePickLetter(tile, e)}
                  className={`w-12 h-12 sm:w-14 sm:h-14 rounded-2xl border-2 font-black text-xl sm:text-2xl transition ${
                    used
                      ? 'bg-slate-100 border-slate-200 text-slate-300 opacity-40 cursor-default'
                      : 'bg-amber-200 hover:bg-amber-300 border-amber-500 text-slate-950 btn-press-3d cursor-pointer shadow-sm'
                  }`}
                >
                  {tile.val}
                </button>
              );
            })}
          </div>

          {spellStatus === 'wrong' && (
            <div className="flex items-center gap-3">
              <span className="text-sm font-black text-rose-600">
                {tr(lang, 'כִּמְעַט! נַסּוּ סֵדֶר אַחֵר', 'Almost! Try another order', '¡Casi! Prueba otro orden')}
              </span>
              <button
                type="button"
                onClick={() => {
                  setSpellPicked([]);
                  setSpellStatus(null);
                }}
                className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-rose-100 hover:bg-rose-200 text-rose-900 font-black text-xs cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>{tr(lang, 'נַקֵּה', 'Clear', 'Limpiar')}</span>
              </button>
            </div>
          )}

          {spellStatus === 'correct' && (
            <div className="flex flex-col items-center gap-3 animate-pop-in">
              <div className="flex items-center gap-2 text-emerald-700 font-black text-lg">
                <CheckCircle2 className="w-6 h-6" />
                <span>
                  {tr(lang, `מְעוּלֶּה! ${currentSpell.word} ⭐`, `Awesome! ${currentSpell.word} ⭐`, `¡Genial! ${currentSpell.word} ⭐`)}
                </span>
              </div>
              <button
                type="button"
                onClick={() => loadSpellWord(spellIdx + 1)}
                className="flex items-center gap-2 px-6 py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-black text-base shadow-md btn-press-3d cursor-pointer"
              >
                <span>{tr(lang, 'הַמִּלָּה הַבָּאָה', 'Next Word', 'Siguiente palabra')}</span>
                <RefreshCw className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      )}

      {/* ===================== MODE 3 (AGE 9): SENTENCE BUILDER ===================== */}
      {isAge9 && mode === 'sentences' && (
        <div className="bg-white rounded-3xl border-4 border-indigo-200 shadow-xl p-5 sm:p-7 flex flex-col items-center text-center gap-5">
          <div className="flex items-center justify-between w-full max-w-lg text-xs font-black text-slate-500">
            <span>
              {tr(lang, `מִשְׁפָּט ${sentIdx + 1} / ${AGE9_SENTENCE_PUZZLES.length}`, `Sentence ${sentIdx + 1} / ${AGE9_SENTENCE_PUZZLES.length}`, `Frase ${sentIdx + 1} / ${AGE9_SENTENCE_PUZZLES.length}`)}
            </span>
            <button
              type="button"
              onClick={() => setShowSentHint((h) => !h)}
              className="flex items-center gap-1 px-3 py-1.5 rounded-full bg-amber-100 hover:bg-amber-200 border border-amber-300 text-amber-950 cursor-pointer"
            >
              <Lightbulb className="w-3.5 h-3.5" />
              <span>{tr(lang, 'רֶמֶז', 'Hint', 'Pista')}</span>
            </button>
          </div>

          <div className="flex flex-col items-center gap-2">
            <span className="text-5xl">{currentSent.emoji}</span>
            <p className="text-lg sm:text-xl font-black text-slate-900">{currentSent.he}</p>
            <p className="text-xs sm:text-sm font-bold text-slate-500">
              {tr(lang, 'סַדְּרוּ אֶת הַמִּלִּים לְמִשְׁפָּט נָכוֹן בְּאַנְגְּלִית:', 'Tap the words in order to build the English sentence:', 'Ordena las palabras en inglés:')}
            </p>
            <button
              type="button"
              onClick={() => speakEnglish(currentSent.words.join(' '), 0.82)}
              className="flex items-center gap-1.5 px-4 py-2 rounded-full bg-indigo-50 hover:bg-indigo-100 border-2 border-indigo-200 text-indigo-800 font-black text-xs sm:text-sm cursor-pointer"
            >
              <Volume2 className="w-4 h-4" />
              <span>{tr(lang, 'שְׁמַע אֶת הַמִּשְׁפָּט בְּאַנְגְּלִית', 'Hear Target Sentence', 'Escuchar frase')}</span>
            </button>
          </div>

          {showSentHint && (
            <div className="px-4 py-2 rounded-2xl bg-amber-50 border-2 border-amber-300 text-amber-950 font-bold text-sm">
              💡 {currentSent.hintHe}
            </div>
          )}

          {/* Built Sentence Box (LTR) */}
          <div
            className={`w-full max-w-xl min-h-[76px] p-3 rounded-2xl border-3 flex flex-wrap items-center justify-center gap-2 ${
              sentStatus === 'correct'
                ? 'bg-emerald-50 border-emerald-400'
                : sentStatus === 'wrong'
                  ? 'bg-rose-50 border-rose-400'
                  : 'bg-slate-50 border-dashed border-indigo-300'
            }`}
            dir="ltr"
          >
            {sentPicked.length === 0 ? (
              <span className="text-sm font-bold text-slate-400">
                {tr(lang, 'לַחֲצוּ עַל הַמִּלִּים לְמַטָּה...', 'Tap words below...', 'Toca las palabras abajo...')}
              </span>
            ) : (
              sentPicked.map((tile) => (
                <button
                  key={tile.id}
                  type="button"
                  disabled={sentStatus === 'correct'}
                  onClick={() => handleRemoveWord(tile.id)}
                  className="px-3.5 py-2 rounded-xl bg-indigo-600 text-white font-black text-base sm:text-lg shadow-sm cursor-pointer hover:bg-indigo-700"
                >
                  {tile.val}
                </button>
              ))
            )}
          </div>

          {/* Scrambled Word Bank (LTR) */}
          <div className="flex flex-wrap items-center justify-center gap-2.5 max-w-xl" dir="ltr">
            {sentPool.map((tile) => {
              const used = sentPicked.some((t) => t.id === tile.id);
              return (
                <button
                  key={tile.id}
                  type="button"
                  disabled={used || sentStatus === 'correct'}
                  onClick={(e) => handlePickWord(tile, e)}
                  className={`px-4 py-2.5 rounded-2xl border-2 font-black text-base sm:text-lg transition ${
                    used
                      ? 'bg-slate-100 border-slate-200 text-slate-300 opacity-40 cursor-default'
                      : 'bg-amber-200 hover:bg-amber-300 border-amber-500 text-slate-950 btn-press-3d cursor-pointer shadow-sm'
                  }`}
                >
                  {tile.val}
                </button>
              );
            })}
          </div>

          {sentStatus === 'wrong' && (
            <div className="flex items-center gap-3">
              <span className="text-sm font-black text-rose-600">
                {tr(lang, 'נַסּוּ סֵדֶר קְצָת שׁוֹנֶה!', 'Try a different word order!', '¡Prueba otro orden!')}
              </span>
              <button
                type="button"
                onClick={() => {
                  setSentPicked([]);
                  setSentStatus(null);
                }}
                className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-rose-100 hover:bg-rose-200 text-rose-900 font-black text-xs cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>{tr(lang, 'נַקֵּה', 'Clear', 'Limpiar')}</span>
              </button>
            </div>
          )}

          {sentStatus === 'correct' && (
            <div className="flex flex-col items-center gap-3 animate-pop-in">
              <div className="flex items-center gap-2 text-emerald-700 font-black text-lg">
                <BookOpen className="w-6 h-6" />
                <span>{tr(lang, 'מִשְׁפָּט מֻשְׁלָם! +2 כּוֹכָבִים ⭐', 'Perfect Sentence! +2 Stars ⭐', '¡Frase perfecta! +2 Estrellas ⭐')}</span>
              </div>
              <button
                type="button"
                onClick={() => loadSentence(sentIdx + 1)}
                className="flex items-center gap-2 px-6 py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-black text-base shadow-md btn-press-3d cursor-pointer"
              >
                <span>{tr(lang, 'הַמִּשְׁפָּט הַבָּא', 'Next Sentence', 'Siguiente frase')}</span>
                <RefreshCw className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
