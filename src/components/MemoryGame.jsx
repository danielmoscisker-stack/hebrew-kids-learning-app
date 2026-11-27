import React, { useState, useEffect, useRef, useCallback } from 'react';
import { RefreshCw, Volume2 } from 'lucide-react';
import { playSound, speakLetterName, playWordAudio, playPhraseAudio } from '../utils/audio';
import { triggerConfetti, triggerStarBurst } from '../utils/confetti';
import { tr } from '../utils/i18n';

const AGE4_PAIRS = [
  { id: 'alef', left: 'א', right: '🍉', wordEn: 'Watermelon', wordHe: 'אַבַטִּיחַ', wordEs: 'Sandía', isLetter: true },
  { id: 'bet', left: 'בּ', right: '🎈', wordEn: 'Balloon', wordHe: 'בַּלּוֹן', wordEs: 'Globo', isLetter: true },
  { id: 'gimel', left: 'ג', right: '🍦', wordEn: 'Ice Cream', wordHe: 'גְּלִידָה', wordEs: 'Helado', isLetter: true },
  { id: 'dalet', left: 'ד', right: '🧸', wordEn: 'Bear', wordHe: 'דֹּב', wordEs: 'Oso', isLetter: true },
  { id: 'he', left: 'ה', right: '⛰️', wordEn: 'Mountain', wordHe: 'הַר', wordEs: 'Montaña', isLetter: true },
  { id: 'shin', left: 'שׁ', right: '☀️', wordEn: 'Sun', wordHe: 'שֶׁמֶשׁ', wordEs: 'Sol', isLetter: true },
  { id: 'tav', left: 'ת', right: '🍎', wordEn: 'Apple', wordHe: 'תַּפּוּחַ', wordEs: 'Manzana', isLetter: true }
];

const AGE7_MATH_PAIRS = [
  { id: 'm1', left: '7 + 6', right: '13', ltr: true },
  { id: 'm2', left: '3 × 4', right: '12', ltr: true },
  { id: 'm3', left: '15 − 8', right: '7', ltr: true },
  { id: 'm4', left: '5 × 5', right: '25', ltr: true },
  { id: 'm5', left: '20 − 9', right: '11', ltr: true },
  { id: 'm6', left: '8 + 9', right: '17', ltr: true },
  { id: 'm7', left: '4 × 5', right: '20', ltr: true },
  { id: 'm8', left: '30 + 14', right: '44', ltr: true }
];

const AGE7_WORD_PAIRS = [
  { id: 'w1', left: 'אַבַטִּיחַ', leftEn: 'Watermelon', leftEs: 'Sandía', right: '🍉' },
  { id: 'w2', left: 'בַּלּוֹן', leftEn: 'Balloon', leftEs: 'Globo', right: '🎈' },
  { id: 'w3', left: 'גְּלִידָה', leftEn: 'Ice Cream', leftEs: 'Helado', right: '🍦' },
  { id: 'w4', left: 'שֶׁמֶשׁ', leftEn: 'Sun', leftEs: 'Sol', right: '☀️' },
  { id: 'w5', left: 'תַּפּוּחַ', leftEn: 'Apple', leftEs: 'Manzana', right: '🍎' },
  { id: 'w6', left: 'כּוֹכָב', leftEn: 'Star', leftEs: 'Estrella', right: '⭐' },
  { id: 'w7', left: 'רַכֶּבֶת', leftEn: 'Train', leftEs: 'Tren', right: '🚂' }
];

const AGE9_MATH_PAIRS = [
  { id: 'p1', left: '7 × 8', right: '56', ltr: true },
  { id: 'p2', left: '9 × 6', right: '54', ltr: true },
  { id: 'p3', left: '64 ÷ 8', right: '8', ltr: true },
  { id: 'p4', left: '8 × 6', right: '48', ltr: true },
  { id: 'p5', left: '9 × 7', right: '63', ltr: true },
  { id: 'p6', left: '72 ÷ 9', right: '8', ltr: true },
  { id: 'p7', left: '7 × 7', right: '49', ltr: true },
  { id: 'p8', left: '9 × 8', right: '72', ltr: true },
  { id: 'p9', left: '45 ÷ 5', right: '9', ltr: true }
];

const AGE9_VOCAB_PAIRS = [
  { id: 'v1', left: 'Library', right: 'סִפְרִיָּה', rightEn: '📚', rightEs: 'Biblioteca', leftLtr: true },
  { id: 'v2', left: 'Weather', right: 'מֶזֶג אֲוִיר', rightEn: '🌤️', rightEs: 'Clima', leftLtr: true },
  { id: 'v3', left: 'Breakfast', right: 'אֲרוּחַת בֹּקֶר', rightEn: '🥞', rightEs: 'Desayuno', leftLtr: true },
  { id: 'v4', left: 'Yesterday', right: 'אֶתְמוֹל', rightEn: '📅', rightEs: 'Ayer', leftLtr: true },
  { id: 'v5', left: 'Question', right: 'שְׁאֵלָה', rightEn: '❓', rightEs: 'Pregunta', leftLtr: true },
  { id: 'v6', left: 'Mountain', right: 'הַר', rightEn: '⛰️', rightEs: 'Montaña', leftLtr: true },
  { id: 'v7', left: 'Friend', right: 'חָבֵר', rightEn: '🤝', rightEs: 'Amigo', leftLtr: true },
  { id: 'v8', left: 'Science', right: 'מַדָּע', rightEn: '🔬', rightEs: 'Ciencia', leftLtr: true }
];

function buildDeck(ageMode, deckKind) {
  let source = AGE4_PAIRS;
  let pairCount = 3;

  if (ageMode === 7) {
    source = deckKind === 'words' ? AGE7_WORD_PAIRS : AGE7_MATH_PAIRS;
    pairCount = 4;
  } else if (ageMode === 9) {
    source = deckKind === 'vocab' ? AGE9_VOCAB_PAIRS : AGE9_MATH_PAIRS;
    pairCount = 6;
  }

  // Avoid duplicate right-side values (e.g. two equations both equal 8)
  const shuffled = [...source].sort(() => 0.5 - Math.random());
  const chosen = [];
  const usedRights = new Set();
  for (const item of shuffled) {
    if (usedRights.has(item.right)) continue;
    usedRights.add(item.right);
    chosen.push(item);
    if (chosen.length === pairCount) break;
  }

  const deck = [];
  chosen.forEach((pair, idx) => {
    deck.push({
      uniqueId: `l-${idx}-${pair.id}`,
      pairId: pair.id,
      side: 'left',
      content: pair.left,
      contentEn: pair.leftEn,
      contentEs: pair.leftEs,
      ltr: Boolean(pair.ltr || pair.leftLtr),
      isLetter: Boolean(pair.isLetter)
    });
    deck.push({
      uniqueId: `r-${idx}-${pair.id}`,
      pairId: pair.id,
      side: 'right',
      content: pair.right,
      contentEn: pair.rightEn,
      contentEs: pair.rightEs,
      ltr: Boolean(pair.ltr),
      wordEn: pair.wordEn,
      wordHe: pair.wordHe,
      wordEs: pair.wordEs
    });
  });

  return {
    cards: deck.sort(() => 0.5 - Math.random()),
    pairCount: chosen.length
  };
}

export default function MemoryGame({ lang, soundEnabled, gender = 'boy', onEarnStar, ageMode = 4 }) {
  const isHe = lang === 'he';
  const [deckKind, setDeckKind] = useState(ageMode === 9 ? 'math' : ageMode === 7 ? 'math' : 'letters');
  const [board, setBoard] = useState(() => buildDeck(ageMode, ageMode >= 7 ? 'math' : 'letters'));
  const [flipped, setFlipped] = useState([]);
  const [matched, setMatched] = useState([]);
  const [isLocked, setIsLocked] = useState(false);
  const [moves, setMoves] = useState(0);
  const mismatchTimeoutRef = useRef(null);
  const praiseTimeoutRef = useRef(null);

  const clearPendingTimeouts = useCallback(() => {
    if (mismatchTimeoutRef.current) {
      clearTimeout(mismatchTimeoutRef.current);
      mismatchTimeoutRef.current = null;
    }
    if (praiseTimeoutRef.current) {
      clearTimeout(praiseTimeoutRef.current);
      praiseTimeoutRef.current = null;
    }
  }, []);

  useEffect(() => () => clearPendingTimeouts(), [clearPendingTimeouts]);

  const startFresh = (nextDeckKind = deckKind, playWhoosh = true) => {
    clearPendingTimeouts();
    if (playWhoosh) playSound('whoosh');
    setBoard(buildDeck(ageMode, nextDeckKind));
    setFlipped([]);
    setMatched([]);
    setIsLocked(false);
    setMoves(0);
  };

  const handleCardClick = (card, idx) => {
    if (isLocked || flipped.includes(idx) || matched.includes(card.pairId)) return;

    playSound('pop');
    if (soundEnabled && ageMode === 4) {
      if (card.isLetter) {
        speakLetterName(card.pairId);
      } else if (card.wordEn) {
        playWordAudio(card.wordEn);
      }
    }

    const newFlipped = [...flipped, idx];
    setFlipped(newFlipped);

    if (newFlipped.length === 2) {
      setIsLocked(true);
      setMoves((m) => m + 1);
      const firstCard = board.cards[newFlipped[0]];
      const secondCard = board.cards[newFlipped[1]];

      if (firstCard.pairId === secondCard.pairId) {
        const isLastMatch = matched.length + 1 === board.pairCount;
        if (isLastMatch) {
          playSound('win');
          triggerConfetti();
          if (soundEnabled && isHe) {
            praiseTimeoutRef.current = setTimeout(() => {
              playPhraseAudio('great_job', gender);
            }, 450);
          }
        } else {
          playSound('star');
        }
        triggerStarBurst();
        onEarnStar(isLastMatch && ageMode >= 7 ? 2 : 1);
        setMatched((prev) => [...prev, firstCard.pairId]);
        setFlipped([]);
        setIsLocked(false);
      } else {
        mismatchTimeoutRef.current = setTimeout(() => {
          mismatchTimeoutRef.current = null;
          playSound('whoosh');
          setFlipped([]);
          setIsLocked(false);
        }, 950);
      }
    }
  };

  const isGameComplete = matched.length === board.pairCount;

  const headerTitle =
    ageMode === 9
      ? tr(lang, 'זִכָּרוֹן כֶּפֶל וְאַנְגְּלִית • גִּיל 9', 'Pro Memory Challenge • Age 9', 'Memoria Pro • Edad 9')
      : ageMode === 7
        ? tr(lang, 'זִכָּרוֹן חֶשְׁבּוֹן וּמִלִּים • גִּיל 7', 'Math & Word Memory • Age 7', 'Memoria Mates y Palabras • Edad 7')
        : tr(lang, 'מִשְׂחַק זִכָּרוֹן וְהַתְאָמָה', 'Memory & Matching Game', 'Juego de Memoria y Parejas');

  const headerDesc =
    ageMode === 9
      ? deckKind === 'vocab'
        ? tr(lang, 'הַתְאִימוּ כָּל מִלָּה בְּאַנְגְּלִית לַתַּרְגּוּם שֶׁלָּהּ בְּעִבְרִית! (12 כַּרְטִיסִים)', 'Match each English word with its Hebrew meaning! (12 cards)', 'Empareja cada palabra en inglés con su significado (12 cartas).')
        : tr(lang, 'הַתְאִימוּ כָּל תַּרְגִּיל כֶּפֶל אוֹ חִלּוּק לַתְּשׁוּבָה שֶׁלּוֹ! (12 כַּרְטִיסִים)', 'Match each multiplication or division card to its answer! (12 cards)', 'Empareja cada operación con su resultado (12 cartas).')
      : ageMode === 7
        ? deckKind === 'words'
          ? tr(lang, 'הַתְאִימוּ כָּל מִלָּה בְּעִבְרִית לַתְּמוּנָה שֶׁלָּהּ! (8 כַּרְטִיסִים)', 'Match each Hebrew word with its picture! (8 cards)', 'Empareja cada palabra hebrea con su imagen (8 cartas).')
          : tr(lang, 'הַתְאִימוּ כָּל תַּרְגִּיל חֶשְׁבּוֹן לַתְּשׁוּבָה שֶׁלּוֹ! (8 כַּרְטִיסִים)', 'Match each math problem to its answer! (8 cards)', 'Empareja cada suma o multiplicación con su resultado (8 cartas).')
        : tr(lang, 'הַתְאִימוּ בֵּין הָאוֹת לַתְּמוּנָה שֶׁמַּתְחִילָה בָּהּ!', 'Match the Hebrew letter with its starting picture!', '¡Empareja la letra hebrea con su imagen inicial!');

  return (
    <div className="max-w-4xl mx-auto px-4 py-5 flex flex-col gap-5" dir={isHe ? 'rtl' : 'ltr'}>
      {/* Header Banner */}
      <div
        className={`rounded-3xl p-5 sm:p-6 text-white text-center shadow-lg border-4 border-white ${
          ageMode === 9
            ? 'bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600'
            : ageMode === 7
              ? 'bg-gradient-to-r from-teal-500 via-cyan-500 to-sky-600'
              : 'bg-gradient-to-r from-pink-500 to-rose-500'
        }`}
      >
        <span className="text-4xl">🃏 🧠 ⭐</span>
        <h2 className="text-2xl md:text-3xl font-black mt-2">{headerTitle}</h2>
        <p className="text-white/90 text-sm md:text-base mt-1 font-bold">{headerDesc}</p>

        {/* Deck Mode Toggle for Age 7 and Age 9 */}
        {ageMode === 7 && (
          <div className="mt-4 inline-flex bg-black/15 p-1 rounded-2xl gap-1">
            <button
              type="button"
              onClick={() => {
                playSound('pop');
                setDeckKind('math');
                startFresh('math', false);
              }}
              className={`px-4 py-2 rounded-xl font-black text-xs sm:text-sm cursor-pointer ${
                deckKind === 'math' ? 'bg-white text-sky-900 shadow' : 'text-white hover:bg-white/20'
              }`}
            >
              🧮 {tr(lang, 'תַּרְגִּילֵי חֶשְׁבּוֹן', 'Math Pairs', 'Parejas de Mates')}
            </button>
            <button
              type="button"
              onClick={() => {
                playSound('pop');
                setDeckKind('words');
                startFresh('words', false);
              }}
              className={`px-4 py-2 rounded-xl font-black text-xs sm:text-sm cursor-pointer ${
                deckKind === 'words' ? 'bg-white text-sky-900 shadow' : 'text-white hover:bg-white/20'
              }`}
            >
              📖 {tr(lang, 'קְרִיאַת מִלִּים', 'Words & Pictures', 'Palabras y Dibujos')}
            </button>
          </div>
        )}

        {ageMode === 9 && (
          <div className="mt-4 inline-flex bg-black/15 p-1 rounded-2xl gap-1">
            <button
              type="button"
              onClick={() => {
                playSound('pop');
                setDeckKind('math');
                startFresh('math', false);
              }}
              className={`px-4 py-2 rounded-xl font-black text-xs sm:text-sm cursor-pointer ${
                deckKind === 'math' ? 'bg-white text-indigo-900 shadow' : 'text-white hover:bg-white/20'
              }`}
            >
              ⚡ {tr(lang, 'כֶּפֶל וְחִלּוּק', 'Times & Division', 'Tablas y División')}
            </button>
            <button
              type="button"
              onClick={() => {
                playSound('pop');
                setDeckKind('vocab');
                startFresh('vocab', false);
              }}
              className={`px-4 py-2 rounded-xl font-black text-xs sm:text-sm cursor-pointer ${
                deckKind === 'vocab' ? 'bg-white text-indigo-900 shadow' : 'text-white hover:bg-white/20'
              }`}
            >
              🌍 {tr(lang, 'אַנְגְּלִית ⇄ עִבְרִית', 'English Vocabulary', 'Inglés ⇄ Español')}
            </button>
          </div>
        )}

        {ageMode === 4 && (
          <button
            type="button"
            onClick={() => {
              if (soundEnabled) playPhraseAudio('inst_memory', gender);
            }}
            className="mt-3 inline-flex items-center gap-1.5 px-3 py-1.5 bg-white/20 hover:bg-white/30 rounded-full font-bold text-xs text-white shadow-sm cursor-pointer"
          >
            <Volume2 className="w-4 h-4 text-pink-200" />
            <span>{tr(lang, gender === 'girl' ? '🔊 שִׁמְעִי הוֹרָאוֹת' : '🔊 שְׁמַע הוֹרָאוֹת', '🔊 Hear Instructions', '🔊 Escuchar instrucciones')}</span>
          </button>
        )}
      </div>

      {/* Memory Board */}
      <div className="bg-white rounded-3xl p-5 md:p-7 border-4 border-pink-300 shadow-xl flex flex-col items-center">
        {ageMode >= 7 && (
          <div className="mb-4 flex items-center gap-3 text-xs sm:text-sm font-black text-slate-600">
            <span className="bg-emerald-100 text-emerald-800 px-3 py-1 rounded-full">
              {tr(lang, `זוּגוֹת: ${matched.length}/${board.pairCount}`, `Pairs: ${matched.length}/${board.pairCount}`, `Parejas: ${matched.length}/${board.pairCount}`)}
            </span>
            <span className="bg-indigo-100 text-indigo-800 px-3 py-1 rounded-full">
              {tr(lang, `מַהֲלָכִים: ${moves}`, `Moves: ${moves}`, `Turnos: ${moves}`)}
            </span>
          </div>
        )}

        <div
          className={`grid gap-3 sm:gap-4 w-full mb-6 ${
            ageMode === 9
              ? 'grid-cols-3 sm:grid-cols-4 max-w-2xl'
              : ageMode === 7
                ? 'grid-cols-2 sm:grid-cols-4 max-w-2xl'
                : 'grid-cols-2 sm:grid-cols-3 max-w-md'
          }`}
        >
          {board.cards.map((card, idx) => {
            const isFlipped = flipped.includes(idx) || matched.includes(card.pairId);
            const isPairMatched = matched.includes(card.pairId);

            return (
              <button
                key={card.uniqueId}
                type="button"
                onClick={() => handleCardClick(card, idx)}
                className={`${
                  ageMode === 9 ? 'h-24 sm:h-28' : 'h-28 sm:h-34'
                } rounded-3xl border-4 flex flex-col items-center justify-center p-2 transition-all duration-300 btn-press-3d cursor-pointer ${
                  isFlipped
                    ? isPairMatched
                      ? 'bg-emerald-100 border-emerald-400 scale-105 shadow-inner'
                      : 'bg-amber-100 border-amber-400 scale-105 shadow-md'
                    : 'bg-gradient-to-br from-indigo-500 to-purple-600 border-indigo-700 hover:scale-105'
                }`}
              >
                {isFlipped ? (
                  (() => {
                    const displayContent = tr(
                      lang,
                      card.content,
                      card.contentEn || card.content,
                      card.contentEs || card.contentEn || card.content
                    );
                    return (
                      <>
                        <span
                          dir={card.ltr || (!isHe && (card.contentEn || card.contentEs)) ? 'ltr' : undefined}
                          className={`font-black leading-tight text-center ${
                            ageMode === 4
                              ? 'text-5xl md:text-6xl mb-1'
                              : String(displayContent).length > 6
                                ? 'text-lg sm:text-xl text-slate-900'
                                : 'text-2xl sm:text-3xl text-slate-900'
                          }`}
                        >
                          {displayContent}
                        </span>
                        {ageMode === 4 && card.wordHe && (
                          <span className="text-xs font-black text-slate-700">
                            {tr(lang, card.wordHe, card.wordEn, card.wordEs || card.wordEn)}
                          </span>
                        )}
                      </>
                    );
                  })()
                ) : (
                  <span className="text-4xl text-white/90 font-black">?</span>
                )}
              </button>
            );
          })}
        </div>

        {isGameComplete && (
          <div className="mb-4 px-5 py-3 bg-emerald-100 border-2 border-emerald-400 rounded-2xl font-black text-emerald-900 text-center animate-pop-in">
            🎉 {tr(lang, 'כָּל הַכָּבוֹד! מָצָאתָ אֶת כָּל הַזּוּגוֹת!', 'Amazing! You matched every pair!', '¡Increíble! ¡Encontraste todas las parejas!')}
          </div>
        )}

        <button
          type="button"
          onClick={() => startFresh(deckKind, true)}
          className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-amber-400 to-orange-400 hover:from-amber-500 hover:to-orange-500 text-slate-950 font-black rounded-2xl shadow-md btn-press-3d cursor-pointer"
        >
          <RefreshCw className="w-5 h-5" />
          <span>{tr(lang, 'מִשְׂחָק חָדָשׁ', 'New Game', 'Juego nuevo')}</span>
        </button>
      </div>
    </div>
  );
}
