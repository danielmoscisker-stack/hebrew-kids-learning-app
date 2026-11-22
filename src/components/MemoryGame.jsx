import React, { useState, useEffect } from 'react';
import { Sparkles, Trophy, RefreshCw, Star, Volume2 } from 'lucide-react';
import { playSound, speakLetterName, playWordAudio, playPhraseAudio } from '../utils/audio';
import { triggerConfetti, triggerStarBurst } from '../utils/confetti';

const ALL_PAIRS = [
  { id: 'alef', letter: 'א', emoji: '🍉', wordHe: 'אַבַטִּיחַ', wordEn: 'Watermelon' },
  { id: 'bet', letter: 'בּ', emoji: '🎈', wordHe: 'בַּלּוֹן', wordEn: 'Balloon' },
  { id: 'gimel', letter: 'ג', emoji: '🍦', wordHe: 'גְּלִידָה', wordEn: 'Ice Cream' },
  { id: 'dalet', letter: 'ד', emoji: '🧸', wordHe: 'דֹּב', wordEn: 'Bear' },
  { id: 'he', letter: 'ה', emoji: '⛰️', wordHe: 'הַר', wordEn: 'Mountain' },
  { id: 'shin', letter: 'שׁ', emoji: '☀️', wordHe: 'שֶׁמֶשׁ', wordEn: 'Sun' },
  { id: 'tav', letter: 'ת', emoji: '🍎', wordHe: 'תַּפּוּחַ', wordEn: 'Apple' },
];

export default function MemoryGame({ lang, soundEnabled, gender = 'boy', onEarnStar }) {
  const isHe = lang === 'he';
  const [cards, setCards] = useState([]);
  const [flipped, setFlipped] = useState([]);
  const [matched, setMatched] = useState([]);
  const [isLocked, setIsLocked] = useState(false);

  const initGame = () => {
    playSound('whoosh');
    // Pick 3 random pairs for age 4 (6 cards total)
    const shuffledPairs = [...ALL_PAIRS].sort(() => 0.5 - Math.random()).slice(0, 3);
    const deck = [];

    shuffledPairs.forEach((pair, idx) => {
      deck.push({
        uniqueId: `letter-${idx}`,
        pairId: pair.id,
        type: 'letter',
        content: pair.letter,
        speakText: pair.letter,
        subtext: isHe ? 'אוֹת' : 'Letter'
      });
      deck.push({
        uniqueId: `pic-${idx}`,
        pairId: pair.id,
        wordEn: pair.wordEn,
        wordHe: pair.wordHe,
        type: 'picture',
        content: pair.emoji,
        subtext: isHe ? pair.wordHe : pair.wordEn
      });
    });

    setCards(deck.sort(() => 0.5 - Math.random()));
    setFlipped([]);
    setMatched([]);
    setIsLocked(false);
  };

  useEffect(() => {
    initGame();
  }, [lang]);

  const handleCardClick = (card, idx) => {
    if (isLocked || flipped.includes(idx) || matched.includes(card.pairId)) return;

    playSound('pop');
    if (soundEnabled) {
      if (card.type === 'letter') {
        speakLetterName(card.pairId);
      } else {
        playWordAudio(card.wordEn || card.pairId);
      }
    }

    const newFlipped = [...flipped, idx];
    setFlipped(newFlipped);

    if (newFlipped.length === 2) {
      setIsLocked(true);
      const firstCard = cards[newFlipped[0]];
      const secondCard = cards[newFlipped[1]];

      if (firstCard.pairId === secondCard.pairId) {
        // Matched!
        playSound('star');
        triggerStarBurst();
        onEarnStar();
        setMatched((prev) => [...prev, firstCard.pairId]);
        setFlipped([]);
        setIsLocked(false);

        if (matched.length + 1 === 3) {
          playSound('win');
          triggerConfetti();
          if (soundEnabled) {
            setTimeout(() => {
              playPhraseAudio('great_job', gender);
            }, 500);
          }
        }
      } else {
        // No match, flip back after brief moment
        setTimeout(() => {
          playSound('whoosh');
          setFlipped([]);
          setIsLocked(false);
        }, 1100);
      }
    }
  };

  const isGameComplete = matched.length === 3;

  return (
    <div
      className="max-w-4xl mx-auto px-4 py-6 flex flex-col gap-6"
      dir={isHe ? 'rtl' : 'ltr'}
    >
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-pink-500 to-rose-500 rounded-3xl p-6 text-white text-center shadow-lg">
        <span className="text-4xl">🃏 🧠 ⭐</span>
        <h2 className="text-2xl md:text-3xl font-black mt-2">
          {isHe ? 'מִשְׂחַק זִכָּרוֹן וְהַתְאָמָה (דַּפִּים 12-13)' : 'Memory & Matching Game (Pages 12-13)'}
        </h2>
        <p className="text-pink-100 text-sm md:text-base mt-1 font-medium">
          {isHe
            ? 'הַתְאִימוּ בֵּין הָאוֹת לַתְּמוּנָה שֶׁמַּתְחִילָה בָּהּ!'
            : 'Match the Hebrew letter with its starting picture!'}
        </p>

        <button
          onClick={() => playPhraseAudio('inst_memory', gender)}
          className="mt-3 inline-flex items-center gap-1.5 px-3 py-1.5 bg-white/20 hover:bg-white/30 rounded-full font-bold text-xs text-white shadow-sm"
          title={isHe ? (gender === 'girl' ? 'הַשְׁמִיעִי הוֹרָאוֹת' : 'הַשְׁמַע הוֹרָאוֹת') : 'Hear Instructions'}
        >
          <Volume2 className="w-4 h-4 text-pink-200" />
          <span>{isHe ? (gender === 'girl' ? '🔊 שִׁמְעִי הוֹרָאוֹת' : '🔊 שְׁמַע הוֹרָאוֹת') : '🔊 Hear Instructions'}</span>
        </button>
      </div>

      {/* Memory Board */}
      <div className="bg-white rounded-3xl p-6 md:p-8 border-4 border-pink-300 shadow-xl flex flex-col items-center">
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 w-full max-w-md mb-6">
          {cards.map((card, idx) => {
            const isFlipped = flipped.includes(idx) || matched.includes(card.pairId);
            const isPairMatched = matched.includes(card.pairId);

            return (
              <button
                key={card.uniqueId}
                onClick={() => handleCardClick(card, idx)}
                className={`h-32 md:h-36 rounded-3xl border-4 flex flex-col items-center justify-center p-2 transition-all duration-300 btn-press-3d ${
                  isFlipped
                    ? isPairMatched
                      ? 'bg-emerald-100 border-emerald-400 scale-105 shadow-inner'
                      : 'bg-amber-100 border-amber-400 scale-105 shadow-md'
                    : 'bg-gradient-to-br from-indigo-500 to-purple-600 border-indigo-700 hover:scale-105'
                }`}
              >
                {isFlipped ? (
                  <>
                    <span className="text-5xl md:text-6xl mb-1">
                      {card.content}
                    </span>
                    <span className="text-xs font-bold text-slate-700">
                      {card.subtext}
                    </span>
                  </>
                ) : (
                  <span className="text-4xl text-white font-black animate-pulse">
                    ❓
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Win / Reset Buttons */}
        {isGameComplete ? (
          <div className="p-4 bg-emerald-100 border-2 border-emerald-400 rounded-2xl text-emerald-900 font-black text-lg flex items-center gap-2 animate-bounce">
            <Trophy className="w-7 h-7 text-emerald-600" />
            <span>{isHe ? 'כָּל הַכָּבוֹד! מָצָאתָ אֶת כָּל הַזּוּגוֹת! 🏆' : 'You found all pairs! Awesome! 🏆'}</span>
            <button
              onClick={initGame}
              className="mr-3 px-3 py-1 bg-emerald-600 text-white rounded-xl text-sm font-bold shadow"
            >
              {isHe ? 'סִבּוּב חָדָשׁ' : 'New Round'}
            </button>
          </div>
        ) : (
          <button
            onClick={initGame}
            className="flex items-center gap-2 px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-2xl text-sm transition"
          >
            <RefreshCw className="w-4 h-4" />
            <span>{isHe ? 'סִבּוּב חָדָשׁ עִם אוֹתִיּוֹת אֲחֵרוֹת' : 'New Round with Other Letters'}</span>
          </button>
        )}
      </div>
    </div>
  );
}
