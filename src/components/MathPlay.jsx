import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Trophy, RefreshCw, Sparkles, Volume2 } from 'lucide-react';
import { playSound, playNumberAudio, playPhraseAudio } from '../utils/audio';
import { triggerConfetti, triggerStarBurst } from '../utils/confetti';
import { tr } from '../utils/i18n';

const FRUIT_THEMES = [
  { emoji: '🍎', nameHe: 'תַּפּוּחִים', nameEn: 'apples', nameEs: 'manzanas' },
  { emoji: '🍌', nameHe: 'בָּנָנוֹת', nameEn: 'bananas', nameEs: 'plátanos' },
  { emoji: '🎈', nameHe: 'בַּלּוֹנִים', nameEn: 'balloons', nameEs: 'globos' },
  { emoji: '⭐', nameHe: 'כּוֹכָבִים', nameEn: 'stars', nameEs: 'estrellas' },
  { emoji: '🍓', nameHe: 'תּוּתִים', nameEn: 'strawberries', nameEs: 'fresas' }
];

export default function MathPlay({ lang, soundEnabled, gender = 'boy', onEarnStar }) {
  const isHe = lang === 'he';
  const [puzzle, setPuzzle] = useState({ a: 2, b: 1, sum: 3, theme: FRUIT_THEMES[0], options: [2, 3, 4] });
  const [tappedItems, setTappedItems] = useState({});
  const [wrongOps, setWrongOps] = useState([]);
  const [solved, setSolved] = useState(false);
  const [score, setScore] = useState(0);
  const timeoutsRef = useRef([]);

  const clearTimeouts = useCallback(() => {
    timeoutsRef.current.forEach((id) => clearTimeout(id));
    timeoutsRef.current = [];
  }, []);

  const nextPuzzle = useCallback(() => {
    clearTimeouts();
    const a = 1 + Math.floor(Math.random() * 5); // 1..5
    const b = 1 + Math.floor(Math.random() * (10 - a)); // sum <= 10
    const sum = a + b;
    const theme = FRUIT_THEMES[Math.floor(Math.random() * FRUIT_THEMES.length)];
    const opts = new Set([sum]);
    while (opts.size < 3) {
      const candidate = Math.max(2, Math.min(10, sum + (Math.floor(Math.random() * 5) - 2)));
      opts.add(candidate);
    }
    setPuzzle({ a, b, sum, theme, options: [...opts].sort((x, y) => x - y) });
    setTappedItems({});
    setWrongOps([]);
    setSolved(false);
  }, [clearTimeouts]);

  useEffect(() => {
    nextPuzzle();
    return () => clearTimeouts();
  }, [nextPuzzle, clearTimeouts]);

  const tapFruit = (key) => {
    if (solved || tappedItems[key]) return;
    const nextNum = Object.keys(tappedItems).length + 1;
    setTappedItems((p) => ({ ...p, [key]: nextNum }));
    playSound('pop');
    if (soundEnabled && nextNum <= 10) playNumberAudio(nextNum);
  };

  const pickAnswer = (val) => {
    if (solved) return;
    if (val === puzzle.sum) {
      setSolved(true);
      setScore((s) => s + 1);
      playSound('win');
      triggerConfetti();
      triggerStarBurst();
      onEarnStar(2);
      if (soundEnabled) {
        playNumberAudio(val, () => {
          timeoutsRef.current.push(setTimeout(() => playPhraseAudio('great_job', gender), 200));
        });
      }
      timeoutsRef.current.push(setTimeout(() => nextPuzzle(), 2300));
    } else {
      playSound('whoosh');
      if (!wrongOps.includes(val)) setWrongOps((p) => [...p, val]);
      if (soundEnabled) playPhraseAudio('try_again', gender);
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-6 flex flex-col gap-5" dir={isHe ? 'rtl' : 'ltr'}>
      <div className="bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 rounded-3xl p-6 text-white text-center shadow-lg border-4 border-white">
        <span className="text-4xl">🍎 ➕ 🍌 🟰 🌟</span>
        <h2 className="text-2xl md:text-3xl font-black mt-2">
          {tr(lang, 'חֶשְׁבּוֹן רִאשׁוֹן עִם פֵּרוֹת', 'First Math with Fruits', 'Primeras Sumas con Frutas')}
        </h2>
        <p className="text-emerald-100 text-sm md:text-base font-bold mt-1">
          {tr(
            lang,
            'סִפְרוּ אֶת כָּל הַפְּרִיטִים יַחַד וּבַחֲרוּ אֶת הַמִּסְפָּר הַנָּכוֹן!',
            'Count all items together and pick the matching number!',
            '¡Cuenta todos los objetos juntos y elige el número correcto!'
          )}
        </p>
        <div className="mt-3 flex flex-wrap items-center justify-center gap-2">
          <button
            type="button"
            onClick={() => {
              playSound('pop');
              if (soundEnabled) playPhraseAudio('inst_math_play', gender);
            }}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white/20 hover:bg-white/30 rounded-full font-bold text-xs text-white shadow-sm cursor-pointer"
            title={tr(lang, gender === 'girl' ? 'הַשְׁמִיעִי הוֹרָאוֹת' : 'הַשְׁמַע הוֹרָאוֹת', 'Hear Instructions', 'Escuchar instrucciones')}
          >
            <Volume2 className="w-4 h-4 text-emerald-200" />
            <span>{tr(lang, gender === 'girl' ? '🔊 שִׁמְעִי הוֹרָאוֹת' : '🔊 שְׁמַע הוֹרָאוֹת', '🔊 Hear Instructions', '🔊 Escuchar instrucciones')}</span>
          </button>
          <div className="inline-flex items-center gap-2 bg-white/20 px-4 py-1 rounded-full font-black text-sm">
            <Trophy className="w-4 h-4 text-amber-300" />
            <bdi>{score}</bdi>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-3xl p-6 md:p-8 border-4 border-emerald-300 shadow-xl flex flex-col items-center gap-5">
        {/* Visual Addition Stage (LTR math equation with tactile clickable fruits) */}
        <div className="flex flex-wrap items-center justify-center gap-4 bg-emerald-50 border-2 border-emerald-200 rounded-3xl p-5 w-full" dir="ltr">
          <div className="flex flex-wrap justify-center gap-2 bg-white px-4 py-3 rounded-2xl border-2 border-emerald-200 shadow-sm">
            {Array.from({ length: puzzle.a }).map((_, i) => {
              const key = `a-${i}`;
              const count = tappedItems[key];
              return (
                <button
                  key={key}
                  type="button"
                  onClick={() => tapFruit(key)}
                  className={`relative w-12 h-12 rounded-2xl flex items-center justify-center text-3xl transition btn-press-3d cursor-pointer ${
                    count ? 'bg-amber-100 ring-2 ring-amber-400 scale-110' : 'hover:scale-110'
                  }`}
                >
                  <span>{puzzle.theme.emoji}</span>
                  {count && (
                    <span className="absolute -top-2 -right-2 w-6 h-6 bg-emerald-600 text-white rounded-full text-xs font-black flex items-center justify-center">
                      {count}
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          <span className="text-4xl font-black text-emerald-700">+</span>

          <div className="flex flex-wrap justify-center gap-2 bg-white px-4 py-3 rounded-2xl border-2 border-emerald-200 shadow-sm">
            {Array.from({ length: puzzle.b }).map((_, i) => {
              const key = `b-${i}`;
              const count = tappedItems[key];
              return (
                <button
                  key={key}
                  type="button"
                  onClick={() => tapFruit(key)}
                  className={`relative w-12 h-12 rounded-2xl flex items-center justify-center text-3xl transition btn-press-3d cursor-pointer ${
                    count ? 'bg-amber-100 ring-2 ring-amber-400 scale-110' : 'hover:scale-110'
                  }`}
                >
                  <span>{puzzle.theme.emoji}</span>
                  {count && (
                    <span className="absolute -top-2 -right-2 w-6 h-6 bg-emerald-600 text-white rounded-full text-xs font-black flex items-center justify-center">
                      {count}
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          <span className="text-4xl font-black text-emerald-700">=</span>
          <span className="w-16 h-16 rounded-2xl bg-amber-300 border-4 border-amber-500 text-3xl font-black text-slate-900 flex items-center justify-center shadow">
            {solved ? puzzle.sum : '?'}
          </span>
        </div>

        <div className="text-sm font-black text-slate-600 flex items-center gap-1.5">
          <Sparkles className="w-4 h-4 text-amber-500" />
          <span>{tr(lang, 'כַּמָּה יֵשׁ יַחַד? לִחְצוּ עַל הַתְּשׁוּבָה:', 'How many altogether? Tap the answer:', '¿Cuántos hay en total? Toca la respuesta:')}</span>
        </div>

        <div className="grid grid-cols-3 gap-4 w-full max-w-md" dir="ltr">
          {puzzle.options.map((opt) => {
            const isWrong = wrongOps.includes(opt);
            const isRight = solved && opt === puzzle.sum;
            return (
              <button
                key={opt}
                type="button"
                onClick={() => pickAnswer(opt)}
                disabled={isWrong || solved}
                className={`h-24 rounded-3xl border-4 font-black text-5xl flex items-center justify-center btn-press-3d cursor-pointer transition-all ${
                  isRight
                    ? 'bg-emerald-300 border-emerald-500 text-emerald-950 scale-110 animate-jelly'
                    : isWrong
                      ? 'bg-slate-100 border-slate-200 text-slate-300 opacity-50'
                      : 'bg-teal-50 hover:bg-teal-100 border-teal-400 text-teal-900'
                }`}
              >
                {opt}
              </button>
            );
          })}
        </div>

        <button
          type="button"
          onClick={nextPuzzle}
          className="inline-flex items-center gap-1.5 px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-2xl text-xs font-bold cursor-pointer"
        >
          <RefreshCw className="w-4 h-4" />
          <span>{tr(lang, 'תַּרְגִּיל אַחֵר', 'Another Question', 'Otro ejercicio')}</span>
        </button>
      </div>
    </div>
  );
}
