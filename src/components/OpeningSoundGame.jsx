import React, { useState, useEffect, useCallback } from 'react';
import { Volume2, Trophy, Sparkles, RefreshCw } from 'lucide-react';
import { LETTERS_DATA } from '../data/curriculumData';
import { playSound, playWordAudio, speakLetterName, playPhraseAudio } from '../utils/audio';
import { triggerConfetti, triggerStarBurst } from '../utils/confetti';
import { useDeviceType } from '../utils/useDeviceType';
import { tr } from '../utils/i18n';

// Curated clear-sound words for 4-year-olds from LETTERS_DATA
const SOUND_QUESTIONS = [
  { letterId: 'alef', letter: 'א', wordHe: 'אֲוִירוֹן', wordEn: 'Airplane', wordEs: 'Avión', emoji: '✈️' },
  { letterId: 'bet_dagesh', letter: 'בּ', wordHe: 'בַּלּוֹן', wordEn: 'Balloon', wordEs: 'Globo', emoji: '🎈' },
  { letterId: 'bet_dagesh', letter: 'בּ', wordHe: 'בַּנָנָה', wordEn: 'Banana', wordEs: 'Plátano', emoji: '🍌' },
  { letterId: 'gimel', letter: 'ג', wordHe: 'גְּלִידָה', wordEn: 'Ice Cream', wordEs: 'Helado', emoji: '🍦' },
  { letterId: 'dalet', letter: 'ד', wordHe: 'דָּג', wordEn: 'Fish', wordEs: 'Pez', emoji: '🐟' },
  { letterId: 'he', letter: 'ה', wordHe: 'הַר', wordEn: 'Mountain', wordEs: 'Montaña', emoji: '⛰️' },
  { letterId: 'kaf_dagesh', letter: 'כּ', wordHe: 'כֶּלֶב', wordEn: 'Dog', wordEs: 'Perro', emoji: '🐶' },
  { letterId: 'lamed', letter: 'ל', wordHe: 'לִימוֹן', wordEn: 'Lemon', wordEs: 'Limón', emoji: '🍋' },
  { letterId: 'mem', letter: 'מ', wordHe: 'מַיִם', wordEn: 'Water', wordEs: 'Agua', emoji: '💧' },
  { letterId: 'pe_dagesh', letter: 'פּ', wordHe: 'פִּיל', wordEn: 'Elephant', wordEs: 'Elefante', emoji: '🐘' },
  { letterId: 'shin', letter: 'שׁ', wordHe: 'שֶׁמֶשׁ', wordEn: 'Sun', wordEs: 'Sol', emoji: '☀️' },
  { letterId: 'tav', letter: 'ת', wordHe: 'תַּפּוּחַ', wordEn: 'Apple', wordEs: 'Manzana', emoji: '🍎' }
];

export default function OpeningSoundGame({ lang, soundEnabled, gender = 'boy', onEarnStar }) {
  const isHe = lang === 'he';
  const { isTouch } = useDeviceType();
  const [question, setQuestion] = useState(null);
  const [options, setOptions] = useState([]);
  const [wrongIds, setWrongIds] = useState([]);
  const [solved, setSolved] = useState(false);
  const [score, setScore] = useState(0);

  const nextRound = useCallback(() => {
    const q = SOUND_QUESTIONS[Math.floor(Math.random() * SOUND_QUESTIONS.length)];
    const targetLetter = LETTERS_DATA.find((l) => l.id === q.letterId) || LETTERS_DATA[0];
    const distractors = LETTERS_DATA.filter((l) => l.id !== targetLetter.id)
      .sort(() => 0.5 - Math.random())
      .slice(0, 2);
    setQuestion(q);
    setOptions([targetLetter, ...distractors].sort(() => 0.5 - Math.random()));
    setWrongIds([]);
    setSolved(false);

    if (soundEnabled) {
      setTimeout(() => playWordAudio(q.wordEn), 300);
    }
  }, [soundEnabled]);

  useEffect(() => {
    nextRound();
  }, [nextRound]);

  const handlePick = (opt) => {
    if (!question || solved) return;
    if (opt.id === question.letterId) {
      setSolved(true);
      setScore((s) => s + 1);
      playSound('win');
      triggerConfetti();
      triggerStarBurst();
      onEarnStar(2);
      if (soundEnabled) {
        speakLetterName(opt.id);
        setTimeout(() => playPhraseAudio('great_job', gender), 650);
      }
      setTimeout(() => nextRound(), 2100);
    } else {
      playSound('whoosh');
      if (!wrongIds.includes(opt.id)) setWrongIds((p) => [...p, opt.id]);
      if (soundEnabled) playPhraseAudio('try_again', gender);
    }
  };

  if (!question) return null;

  return (
    <div className="max-w-3xl mx-auto px-4 py-6 flex flex-col gap-5" dir={isHe ? 'rtl' : 'ltr'}>
      <div className="bg-gradient-to-r from-violet-500 via-purple-500 to-fuchsia-500 rounded-3xl p-6 text-white text-center shadow-lg border-4 border-white">
        <span className="text-4xl">🔊 🎈 🎯</span>
        <h2 className="text-2xl md:text-3xl font-black mt-2">
          {tr(lang, 'הַקּוֹל הַפּוֹתֵחַ: בְּאֵיזוֹ אוֹת מַתְחִיל?', 'Opening Sound: Which Letter Starts It?', 'Sonido Inicial: ¿Con qué letra empieza?')}
        </h2>
        <p className="text-purple-100 text-sm md:text-base font-bold mt-1">
          {tr(
            lang,
            isTouch
              ? 'שִׁמְעוּ אֶת הַמִּלָּה וְלִחְצוּ עַל הָאוֹת שֶׁבָּהּ הִיא מַתְחִילָה!'
              : 'הַקְשִׁיבוּ לַמִּלָּה וּבַחֲרוּ עִם הָעַכְבָּר אֶת הָאוֹת הַפּוֹתַחַת!',
            'Hear the word and pick the starting letter!',
            '¡Escucha la palabra y elige la letra con la que empieza!'
          )}
        </p>
        <div className="mt-3 inline-flex items-center gap-2 bg-white/20 px-4 py-1 rounded-full font-black text-sm">
          <Trophy className="w-4 h-4 text-amber-300" />
          <bdi>{score}</bdi>
        </div>
      </div>

      {/* Picture + Word Card */}
      <div className="bg-white rounded-3xl p-6 md:p-8 border-4 border-violet-300 shadow-xl flex flex-col items-center text-center gap-4">
        <button
          type="button"
          onClick={() => {
            playSound('pop');
            if (soundEnabled) playWordAudio(question.wordEn);
          }}
          className="group p-6 rounded-3xl bg-gradient-to-b from-amber-50 to-yellow-100 border-4 border-amber-300 hover:scale-105 transition btn-press-3d cursor-pointer flex flex-col items-center gap-2 min-w-[200px]"
        >
          <span className="text-7xl md:text-8xl group-hover:animate-wiggle">{question.emoji}</span>
          <span className="text-3xl md:text-4xl font-black text-slate-800">{question.wordHe}</span>
          <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-amber-300 text-amber-950 rounded-full text-xs font-black">
            <Volume2 className="w-4 h-4 animate-pulse" />
            <span>{tr(lang, 'שְׁמַע מִלָּה', 'Hear Word', 'Escuchar palabra')}</span>
          </span>
        </button>

        <div className="text-base md:text-lg font-black text-violet-800 flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-amber-500" />
          <span>
            {tr(
              lang,
              `בְּאֵיזוֹ אוֹת מַתְחִילָה הַמִּלָּה "${question.wordHe}"?`,
              `Which letter starts "${question.wordEn}"?`,
              `¿Con qué letra empieza "${question.wordEs}"?`
            )}
          </span>
        </div>

        {/* 3 Big Letter Options */}
        <div className="grid grid-cols-3 gap-4 w-full max-w-lg mt-2">
          {options.map((opt) => {
            const isWrong = wrongIds.includes(opt.id);
            const isTarget = solved && opt.id === question.letterId;
            return (
              <button
                key={opt.id}
                type="button"
                onClick={() => handlePick(opt)}
                onMouseEnter={() => {
                  if (!isTouch && soundEnabled && !solved) speakLetterName(opt.id);
                }}
                disabled={isWrong || solved}
                className={`h-28 md:h-36 rounded-3xl border-4 font-black text-6xl md:text-7xl flex items-center justify-center btn-press-3d cursor-pointer transition-all ${
                  isTarget
                    ? 'bg-emerald-300 border-emerald-500 text-emerald-950 scale-110 ring-4 ring-emerald-200 animate-jelly'
                    : isWrong
                      ? 'bg-slate-100 border-slate-200 text-slate-300 opacity-50'
                      : 'bg-violet-50 hover:bg-violet-100 border-violet-300 text-violet-900'
                }`}
              >
                {opt.letter}
              </button>
            );
          })}
        </div>

        <button
          type="button"
          onClick={nextRound}
          className="mt-2 inline-flex items-center gap-1.5 px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-2xl text-xs font-bold cursor-pointer"
        >
          <RefreshCw className="w-4 h-4" />
          <span>{tr(lang, 'מִלָּה אַחֶרֶת', 'Skip Word', 'Otra palabra')}</span>
        </button>
      </div>
    </div>
  );
}
