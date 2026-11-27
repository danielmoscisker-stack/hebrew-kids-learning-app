import React, { useState, useEffect, useCallback, useRef } from 'react';
import {
  Star,
  Trophy,
  Lightbulb,
  Keyboard,
  LayoutGrid,
  RefreshCw,
  CheckCircle2,
  Delete,
  Sparkles,
  Flame,
  ArrowRight
} from 'lucide-react';
import { AGE_TOPICS, generateMathArenaProblem } from '../data/mathArenaGenerator';
import { playSound, playPhraseAudio } from '../utils/audio';
import { triggerConfetti, triggerStarBurst } from '../utils/confetti';
import { tr } from '../utils/i18n';

const MISSION_LENGTH = 5;
const BONUS_STARS = 5;

/** Check answer equivalence (also accepts equivalent fractions like 1/2 for 4/8 when typed on keypad) */
function isAnswerEquivalent(rawInput, expected, answerType) {
  const clean = String(rawInput).trim().replace(/\s+/g, '');
  if (!clean) return false;
  if (clean === expected) return true;
  if (answerType === 'fraction' && clean.includes('/') && expected.includes('/')) {
    const [n1, d1] = clean.split('/').map(Number);
    const [n2, d2] = expected.split('/').map(Number);
    if (Number.isFinite(n1) && Number.isFinite(d1) && d1 > 0 && Number.isFinite(n2) && Number.isFinite(d2) && d2 > 0) {
      return n1 * d2 === n2 * d1;
    }
  }
  if (answerType === 'number') {
    const n1 = Number(clean);
    const n2 = Number(expected);
    return Number.isFinite(n1) && Number.isFinite(n2) && n1 === n2;
  }
  return false;
}

/** Crisp vertical fraction display for choices */
function FractionChip({ value }) {
  if (!String(value).includes('/')) {
    return <span>{value}</span>;
  }
  const [num, den] = String(value).split('/');
  return (
    <span className="inline-flex flex-col items-center justify-center leading-none" dir="ltr">
      <span className="text-2xl sm:text-3xl font-black px-1">{num}</span>
      <span className="w-8 sm:w-10 h-1 bg-current rounded-full my-0.5" />
      <span className="text-2xl sm:text-3xl font-black px-1">{den}</span>
    </span>
  );
}

/** Visual Multiplication Groups for Age 7 Starter Multiplication */
function MultiplicationGroupsVisual({ visual }) {
  const { groups, perGroup, emoji } = visual;
  const isTens = perGroup === 10;

  return (
    <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-2.5 w-full max-w-xl" dir="ltr">
      {Array.from({ length: groups }).map((_, gIdx) => (
        <div
          key={gIdx}
          className="bg-amber-50 border-2 border-amber-300 rounded-2xl px-2.5 py-2 flex flex-col items-center gap-1 shadow-2xs"
        >
          {isTens ? (
            <div className="flex items-center gap-1 px-1.5 py-0.5 bg-amber-300 text-amber-950 rounded-xl font-black text-base sm:text-lg border border-amber-500">
              <span>{emoji}</span>
              <span>10</span>
            </div>
          ) : (
            <div
              className="grid gap-0.5 place-items-center"
              style={{ gridTemplateColumns: `repeat(${Math.min(perGroup, 4)}, minmax(0, 1fr))` }}
            >
              {Array.from({ length: perGroup }).map((__, iIdx) => (
                <span key={iIdx} className="text-base sm:text-xl leading-none">
                  {emoji}
                </span>
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

/** Visual Fraction Bar for Age 9 Fractions */
function FractionBarVisual({ visual, showHint, lang }) {
  const { denom, coloredA = 0, coloredB = 0, crossed = 0, totalQty, partSize } = visual;

  return (
    <div className="w-full max-w-md flex flex-col items-center gap-2" dir="ltr">
      {totalQty && (
        <div className="text-xs sm:text-sm font-black text-indigo-800 bg-indigo-100 px-3 py-1 rounded-full">
          {tr(lang, `הַשָּׁלֵם = ${totalQty}`, `Whole = ${totalQty}`, `Total = ${totalQty}`)}
        </div>
      )}
      <div
        className="w-full h-12 sm:h-14 rounded-2xl border-4 border-indigo-500 overflow-hidden grid bg-white shadow-inner"
        style={{ gridTemplateColumns: `repeat(${denom}, minmax(0, 1fr))` }}
      >
        {Array.from({ length: denom }).map((_, idx) => {
          let bg = 'bg-slate-50 text-slate-400';
          let marker = null;

          if (idx < coloredA) {
            bg = 'bg-indigo-500 text-white';
          } else if (idx < coloredA + coloredB) {
            bg = 'bg-amber-400 text-amber-950';
          } else if (idx < coloredA + coloredB + crossed) {
            bg = 'bg-rose-100 text-rose-600';
            marker = '✕';
          }

          return (
            <div
              key={idx}
              className={`border-e-2 last:border-e-0 border-indigo-400/70 flex items-center justify-center font-black text-xs sm:text-sm transition-colors ${bg}`}
            >
              {marker || (showHint && partSize ? partSize : '')}
            </div>
          );
        })}
      </div>
      <div className="flex flex-wrap items-center justify-center gap-3 text-[11px] sm:text-xs font-bold text-slate-500">
        <span>
          {tr(lang, `${denom} חֲלָקִים שָׁוִים`, `${denom} equal parts`, `${denom} partes iguales`)}
        </span>
        {coloredB > 0 && (
          <span className="inline-flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-xs bg-indigo-500 inline-block" />
            <span>{coloredA}/{denom}</span>
            <span>+</span>
            <span className="w-3 h-3 rounded-xs bg-amber-400 inline-block" />
            <span>{coloredB}/{denom}</span>
          </span>
        )}
      </div>
    </div>
  );
}

/** Visual SVG Rectangle/Square Diagram for Age 9 Perimeter Problems */
function PerimeterVisual({ visual, lang }) {
  const { shape, width, height, unit } = visual;
  const u = tr(lang, unit.he, unit.en, unit.es);
  const isSquare = shape === 'square';
  const rectW = isSquare ? 124 : 184;
  const rectH = isSquare ? 124 : 100;
  const x = (260 - rectW) / 2;
  const y = (160 - rectH) / 2;

  return (
    <div className="w-full max-w-xs flex items-center justify-center" dir="ltr">
      <svg viewBox="0 0 260 160" className="w-full h-36 sm:h-40 overflow-visible" aria-hidden="true">
        <rect
          x={x}
          y={y}
          width={rectW}
          height={rectH}
          rx="10"
          className="fill-emerald-100 stroke-emerald-600"
          strokeWidth="4"
        />
        {/* Top label */}
        <text x="130" y={y - 8} textAnchor="middle" className="fill-emerald-900 font-black text-sm">
          {width} {u}
        </text>
        {/* Bottom label */}
        <text x="130" y={y + rectH + 18} textAnchor="middle" className="fill-emerald-900 font-black text-sm">
          {width} {u}
        </text>
        {/* Left label */}
        <text x={x - 10} y="84" textAnchor="end" className="fill-emerald-900 font-black text-sm">
          {height} {u}
        </text>
        {/* Right label */}
        <text x={x + rectW + 10} y="84" textAnchor="start" className="fill-emerald-900 font-black text-sm">
          {height} {u}
        </text>
      </svg>
    </div>
  );
}

function getInitialArenaAge(selectedAge) {
  if (Number(selectedAge) === 9) return '9';
  if (Number(selectedAge) === 7) return '7';
  try {
    const saved = localStorage.getItem('hk_math_arena_age');
    return saved === '9' ? '9' : '7';
  } catch {
    return '7';
  }
}

export default function IsraelMathArena({
  lang,
  soundEnabled,
  gender = 'boy',
  onEarnStar,
  selectedAge = null,
  onChangeAge
}) {
  const isHe = lang === 'he';

  const [age, setAge] = useState(() => getInitialArenaAge(selectedAge));
  const [topic, setTopic] = useState('mix');
  const [inputMode, setInputMode] = useState('choices'); // 'choices' | 'keypad'

  // Mission state (5 questions per star mission)
  const [missionStep, setMissionStep] = useState(0); // 0..4 completed count
  const [missionComplete, setMissionComplete] = useState(false);
  const [firstTryCount, setFirstTryCount] = useState(0);
  const [hadWrongThisQ, setHadWrongThisQ] = useState(false);

  // Current question state
  const [problem, setProblem] = useState(() => generateMathArenaProblem(getInitialArenaAge(selectedAge), 'mix'));
  const [wrongChoices, setWrongChoices] = useState([]);
  const [keypadValue, setKeypadValue] = useState('');
  const [keypadWrongFlash, setKeypadWrongFlash] = useState(false);
  const [solved, setSolved] = useState(false);
  const [showHint, setShowHint] = useState(false);
  const [streak, setStreak] = useState(0);
  const [sessionStars, setSessionStars] = useState(0);

  const timeoutsRef = useRef([]);

  const clearTimers = useCallback(() => {
    timeoutsRef.current.forEach((id) => clearTimeout(id));
    timeoutsRef.current = [];
  }, []);

  const schedule = useCallback((fn, ms) => {
    const id = setTimeout(() => {
      timeoutsRef.current = timeoutsRef.current.filter((t) => t !== id);
      fn();
    }, ms);
    timeoutsRef.current.push(id);
    return id;
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem('hk_math_arena_age', age);
    } catch {
      // ignore
    }
  }, [age]);

  useEffect(() => () => clearTimers(), [clearTimers]);

  const loadNextQuestion = useCallback(
    (nextAge, nextTopic, resetMission = false) => {
      clearTimers();
      setProblem(generateMathArenaProblem(nextAge, nextTopic));
      setWrongChoices([]);
      setKeypadValue('');
      setKeypadWrongFlash(false);
      setSolved(false);
      setShowHint(false);
      setHadWrongThisQ(false);
      if (resetMission) {
        setMissionStep(0);
        setMissionComplete(false);
        setFirstTryCount(0);
      }
    },
    [clearTimers]
  );

  const handleAgeSwitch = (nextAge) => {
    if (nextAge === age) return;
    playSound('pop');
    setAge(nextAge);
    setTopic('mix');
    loadNextQuestion(nextAge, 'mix', true);
    onChangeAge?.(Number(nextAge));
  };

  const handleTopicSwitch = (nextTopic) => {
    if (nextTopic === topic) return;
    playSound('pop');
    setTopic(nextTopic);
    loadNextQuestion(age, nextTopic, true);
  };

  const handleCorrectAnswer = useCallback(() => {
    setSolved(true);
    setStreak((s) => s + 1);
    const nextCompleted = missionStep + 1;
    setMissionStep(nextCompleted);
    if (!hadWrongThisQ) {
      setFirstTryCount((c) => c + 1);
    }

    onEarnStar(1);
    setSessionStars((s) => s + 1);

    if (nextCompleted >= MISSION_LENGTH) {
      // Mission complete! Double celebration + bonus stars!
      playSound('win');
      triggerStarBurst({ x: 0.3, y: 0.5 });
      triggerStarBurst({ x: 0.7, y: 0.5 });
      triggerConfetti({ x: 0.5, y: 0.6 });
      onEarnStar(BONUS_STARS);
      setSessionStars((s) => s + BONUS_STARS);
      if (soundEnabled && isHe) {
        schedule(() => playPhraseAudio('crazy_correct', gender), 220);
      }
      schedule(() => {
        setMissionComplete(true);
      }, 950);
    } else {
      playSound('star');
      triggerConfetti({ x: 0.5, y: 0.65 });
      if (soundEnabled && isHe && (nextCompleted === 2 || nextCompleted === 4)) {
        schedule(() => playPhraseAudio('great_job', gender), 180);
      }
      schedule(() => {
        loadNextQuestion(age, topic, false);
      }, 1250);
    }
  }, [missionStep, hadWrongThisQ, onEarnStar, soundEnabled, isHe, gender, schedule, loadNextQuestion, age, topic]);

  const handleWrongAnswer = useCallback(
    (choiceVal = null) => {
      playSound('whoosh');
      setStreak(0);
      setHadWrongThisQ(true);
      if (choiceVal !== null) {
        setWrongChoices((prev) => (prev.includes(choiceVal) ? prev : [...prev, choiceVal]));
      } else {
        setKeypadWrongFlash(true);
        schedule(() => setKeypadWrongFlash(false), 650);
      }
      if (soundEnabled && isHe) {
        playPhraseAudio('try_again', gender);
      }
    },
    [soundEnabled, isHe, gender, schedule]
  );

  const handleChoiceTap = (choice) => {
    if (solved || wrongChoices.includes(choice)) return;
    if (choice === problem.answer) {
      handleCorrectAnswer();
    } else {
      handleWrongAnswer(choice);
    }
  };

  const handleKeypadSubmit = useCallback(() => {
    if (solved || !keypadValue.trim()) return;
    if (isAnswerEquivalent(keypadValue, problem.answer, problem.answerType)) {
      handleCorrectAnswer();
    } else {
      handleWrongAnswer(null);
    }
  }, [solved, keypadValue, problem.answer, problem.answerType, handleCorrectAnswer, handleWrongAnswer]);

  const appendKeypadChar = useCallback(
    (ch) => {
      if (solved) return;
      playSound('pop');
      setKeypadValue((prev) => {
        if (prev.length >= 6) return prev;
        if (ch === '/' && (prev.includes('/') || prev.length === 0)) return prev;
        return prev + ch;
      });
    },
    [solved]
  );

  // Physical keyboard support when Keypad mode is active
  const useKeypad = inputMode === 'keypad' && problem.answerType !== 'compare';

  useEffect(() => {
    if (!useKeypad || missionComplete || solved) return;
    const onKeyDown = (e) => {
      if (e.key >= '0' && e.key <= '9') {
        e.preventDefault();
        appendKeypadChar(e.key);
      } else if (e.key === '/' && problem.answerType === 'fraction') {
        e.preventDefault();
        appendKeypadChar('/');
      } else if (e.key === 'Backspace') {
        e.preventDefault();
        setKeypadValue((p) => p.slice(0, -1));
      } else if (e.key === 'Enter') {
        e.preventDefault();
        handleKeypadSubmit();
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [useKeypad, missionComplete, solved, problem.answerType, appendKeypadChar, handleKeypadSubmit]);

  const topics = AGE_TOPICS[age] || AGE_TOPICS['7'];
  const activeTopicObj = topics.find((t) => t.id === topic) || topics[0];
  const isAge9 = age === '9';

  const compareLabel = (sym) => {
    if (sym === '<') return tr(lang, 'קָטָן מִ-', 'Smaller', 'Menor');
    if (sym === '=') return tr(lang, 'שָׁוֶה לְ-', 'Equal', 'Igual');
    return tr(lang, 'גָּדוֹל מִ-', 'Bigger', 'Mayor');
  };

  return (
    <div className="max-w-4xl mx-auto px-3 sm:px-4 py-4 sm:py-5 flex flex-col gap-4" dir={isHe ? 'rtl' : 'ltr'}>
      {/* Big Top Age 7 / Age 9 Switcher */}
      <div
        className={`rounded-3xl p-4 sm:p-5 text-white shadow-xl border-4 border-white transition-colors duration-300 ${
          isAge9
            ? 'bg-gradient-to-r from-indigo-600 via-violet-600 to-fuchsia-600'
            : 'bg-gradient-to-r from-cyan-500 via-sky-500 to-blue-600'
        }`}
      >
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3.5">
          <div>
            <h2 className="text-2xl sm:text-3xl font-black tracking-tight flex items-center gap-2">
              <span>🧮</span>
              <span>{tr(lang, 'חֶשְׁבּוֹן גִּיל 7 וְ-9', 'Israel Math Arena', 'Arena de Mates (7 y 9)')}</span>
            </h2>
            <p className="text-white/90 text-xs sm:text-sm font-bold mt-0.5">
              {tr(
                lang,
                'מֻתְאָם לְתָכְנִית הַלִּמּוּדִים בְּיִשְׂרָאֵל • מְשִׂימוֹת 5 כּוֹכָבִים עִם טְרִיקִים!',
                'Israeli school curriculum • 5-star math missions with smart school tricks!',
                'Currículo escolar israelí • ¡Misiones de 5 estrellas con trucos fáciles!'
              )}
            </p>
          </div>

          <div className="flex items-center gap-2 self-start sm:self-center">
            <div className="flex items-center gap-1 bg-white/20 px-3 py-1.5 rounded-full font-black text-xs sm:text-sm">
              <Flame className="w-4 h-4 text-amber-300 fill-amber-300" />
              <bdi>{streak}</bdi>
            </div>
            <div className="flex items-center gap-1 bg-white/20 px-3 py-1.5 rounded-full font-black text-xs sm:text-sm">
              <Star className="w-4 h-4 text-amber-300 fill-amber-300" />
              <bdi>+{sessionStars}</bdi>
            </div>
          </div>
        </div>

        {/* Giant 2-Button Age Switcher */}
        <div className="grid grid-cols-2 gap-2.5 sm:gap-3 bg-black/15 p-1.5 rounded-2xl">
          <button
            type="button"
            onClick={() => handleAgeSwitch('7')}
            className={`py-3 px-3 sm:px-4 rounded-xl font-black transition-all flex flex-col sm:flex-row items-center justify-center gap-1.5 cursor-pointer ${
              age === '7'
                ? 'bg-white text-sky-900 shadow-lg scale-[1.01]'
                : 'bg-white/10 text-white hover:bg-white/20'
            }`}
          >
            <span className="text-2xl">🧒</span>
            <div className="flex flex-col items-center sm:items-start leading-tight">
              <span className="text-base sm:text-lg font-black">
                {tr(lang, 'גִּיל 7', 'Age 7', 'Edad 7')}
              </span>
              <span className={`text-[11px] sm:text-xs font-bold ${age === '7' ? 'text-sky-600' : 'text-white/80'}`}>
                {tr(lang, 'כִּתָּה א׳–ב׳', 'Grades 1–2', 'Grados 1–2')}
              </span>
            </div>
          </button>

          <button
            type="button"
            onClick={() => handleAgeSwitch('9')}
            className={`py-3 px-3 sm:px-4 rounded-xl font-black transition-all flex flex-col sm:flex-row items-center justify-center gap-1.5 cursor-pointer ${
              age === '9'
                ? 'bg-white text-indigo-900 shadow-lg scale-[1.01]'
                : 'bg-white/10 text-white hover:bg-white/20'
            }`}
          >
            <span className="text-2xl">🚀</span>
            <div className="flex flex-col items-center sm:items-start leading-tight">
              <span className="text-base sm:text-lg font-black">
                {tr(lang, 'גִּיל 9', 'Age 9', 'Edad 9')}
              </span>
              <span className={`text-[11px] sm:text-xs font-bold ${age === '9' ? 'text-indigo-600' : 'text-white/80'}`}>
                {tr(lang, 'כִּתָּה ג׳–ד׳', 'Grades 3–4', 'Grados 3–4')}
              </span>
            </div>
          </button>
        </div>
      </div>

      {/* Topic Selector Pills */}
      <div className="flex flex-wrap items-center justify-center gap-2">
        {topics.map((t) => {
          const isActive = topic === t.id;
          return (
            <button
              key={t.id}
              type="button"
              onClick={() => handleTopicSwitch(t.id)}
              className={`px-3.5 py-2 rounded-2xl border-2 font-black text-xs sm:text-sm flex items-center gap-1.5 transition btn-press-3d cursor-pointer ${
                isActive
                  ? isAge9
                    ? 'bg-indigo-600 text-white border-indigo-800 shadow-md'
                    : 'bg-sky-600 text-white border-sky-800 shadow-md'
                  : 'bg-white text-slate-700 border-slate-200 hover:border-amber-400 hover:bg-amber-50'
              }`}
            >
              <span className="text-base">{t.icon}</span>
              <span>{tr(lang, t.labelHe, t.labelEn, t.labelEs)}</span>
            </button>
          );
        })}
      </div>

      {/* Main Arena Card */}
      <div
        className={`bg-white rounded-3xl p-4 sm:p-6 md:p-7 border-4 shadow-xl flex flex-col gap-5 ${
          isAge9 ? 'border-indigo-300' : 'border-sky-300'
        }`}
      >
        {/* Top Row: 5-Star Mission Track + Keypad/Choices Toggle */}
        <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b-2 border-slate-100">
          {/* 5-Question Star Mission Progress */}
          <div className="flex items-center gap-2">
            <span className="text-xs sm:text-sm font-black text-slate-600">
              {tr(lang, 'מְשִׂימַת כּוֹכָבִים:', 'Star Mission:', 'Misión:')}
            </span>
            <div className="flex items-center gap-1" dir="ltr">
              {Array.from({ length: MISSION_LENGTH }).map((_, idx) => {
                const earned = idx < missionStep;
                const current = idx === missionStep && !missionComplete;
                return (
                  <div
                    key={idx}
                    className={`w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center border-2 transition-all ${
                      earned
                        ? 'bg-amber-300 border-amber-500 scale-105 shadow-xs'
                        : current
                          ? 'bg-amber-50 border-amber-400 border-dashed'
                          : 'bg-slate-100 border-slate-200'
                    }`}
                  >
                    <Star
                      className={`w-4 h-4 ${
                        earned ? 'text-amber-700 fill-amber-500' : 'text-slate-300'
                      }`}
                    />
                  </div>
                );
              })}
            </div>
            <span className="text-xs font-black text-amber-700 bg-amber-100 px-2 py-0.5 rounded-full">
              <bdi dir="ltr">
                {Math.min(missionStep + (missionComplete ? 0 : 1), MISSION_LENGTH)}/{MISSION_LENGTH}
              </bdi>
            </span>
          </div>

          {/* Choices vs Keypad Toggle */}
          {!missionComplete && problem.answerType !== 'compare' && (
            <div className="inline-flex bg-slate-100 p-1 rounded-2xl border border-slate-200">
              <button
                type="button"
                onClick={() => {
                  playSound('pop');
                  setInputMode('choices');
                }}
                className={`px-3 py-1.5 rounded-xl font-black text-xs flex items-center gap-1.5 transition cursor-pointer ${
                  inputMode === 'choices'
                    ? 'bg-white text-indigo-800 shadow-xs'
                    : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                <LayoutGrid className="w-3.5 h-3.5" />
                <span>{tr(lang, '4 אֶפְשָׁרוּיּוֹת', '4 Choices', '4 Opciones')}</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  playSound('pop');
                  setInputMode('keypad');
                }}
                className={`px-3 py-1.5 rounded-xl font-black text-xs flex items-center gap-1.5 transition cursor-pointer ${
                  inputMode === 'keypad'
                    ? 'bg-white text-indigo-800 shadow-xs'
                    : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                <Keyboard className="w-3.5 h-3.5" />
                <span>{tr(lang, 'מִקְלֶדֶת', 'Keypad', 'Teclado')}</span>
              </button>
            </div>
          )}
        </div>

        {/* ---------------- MISSION COMPLETE CELEBRATION ---------------- */}
        {missionComplete ? (
          <div className="py-6 sm:py-8 flex flex-col items-center text-center gap-4 animate-pop-in">
            <div className="w-24 h-24 rounded-full bg-gradient-to-tr from-amber-300 via-yellow-300 to-orange-400 border-4 border-white shadow-2xl flex items-center justify-center text-5xl animate-bounce-gentle">
              🏆
            </div>

            <div>
              <h3 className="text-2xl sm:text-3xl font-black text-slate-900">
                {tr(
                  lang,
                  gender === 'girl' ? 'כָּל הַכָּבוֹד! סִיַּמְתְּ אֶת הַמְּשִׂימָה! 🎉' : 'כָּל הַכָּבוֹד! סִיַּמְתָּ אֶת הַמְּשִׂימָה! 🎉',
                  'Mission Complete! You crushed it! 🎉',
                  '¡Misión cumplida! ¡Lo lograste! 🎉'
                )}
              </h3>
              <p className="text-sm sm:text-base font-bold text-slate-600 mt-1">
                {tr(
                  lang,
                  `פָּתַרְתָּ ${MISSION_LENGTH} תַּרְגִּילִים בְּנוֹשֵׂא ${activeTopicObj.labelHe}`,
                  `You solved all ${MISSION_LENGTH} challenges in ${activeTopicObj.labelEn}`,
                  `Resolviste los ${MISSION_LENGTH} retos en ${activeTopicObj.labelEs}`
                )}
              </p>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-3">
              <div className="px-5 py-2.5 bg-gradient-to-r from-amber-200 to-yellow-200 border-2 border-amber-400 rounded-2xl font-black text-amber-950 text-base sm:text-lg flex items-center gap-2 shadow-sm">
                <Sparkles className="w-5 h-5 text-amber-600" />
                <span>
                  {tr(
                    lang,
                    `בּוֹנוּס מְשִׂימָה: +${BONUS_STARS} כּוֹכָבִים! ⭐`,
                    `Mission Bonus: +${BONUS_STARS} Stars! ⭐`,
                    `Bono de misión: ¡+${BONUS_STARS} estrellas! ⭐`
                  )}
                </span>
              </div>

              <div className="px-4 py-2.5 bg-emerald-100 border-2 border-emerald-300 rounded-2xl font-black text-emerald-900 text-sm flex items-center gap-1.5">
                <Trophy className="w-4 h-4 text-emerald-600" />
                <span>
                  {tr(
                    lang,
                    `מִנִּסָּיוֹן רִאשׁוֹן: ${firstTryCount}/${MISSION_LENGTH}`,
                    `First-Try Accuracy: ${firstTryCount}/${MISSION_LENGTH}`,
                    `Al primer intento: ${firstTryCount}/${MISSION_LENGTH}`
                  )}
                </span>
              </div>
            </div>

            <button
              type="button"
              onClick={() => {
                playSound('pop');
                loadNextQuestion(age, topic, true);
              }}
              className="mt-2 px-8 py-4 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white font-black text-lg sm:text-xl rounded-3xl shadow-xl border-4 border-emerald-200 flex items-center gap-2 btn-press-3d cursor-pointer"
            >
              <span>{tr(lang, 'מְשִׂימָה חֲדָשָׁה! 🚀', 'Start Next Mission! 🚀', '¡Nueva misión! 🚀')}</span>
              <ArrowRight className={`w-5 h-5 ${isHe ? 'rotate-180' : ''}`} />
            </button>
          </div>
        ) : (
          /* ---------------- ACTIVE QUESTION STAGE ---------------- */
          <div className="flex flex-col items-center gap-5">
            {/* Prompt or Word Problem Story */}
            {problem.story ? (
              <div className="w-full max-w-2xl bg-gradient-to-br from-amber-50 to-orange-50 border-2 border-amber-200 rounded-3xl p-4 sm:p-5 text-center shadow-2xs">
                <p className="text-lg sm:text-xl md:text-2xl font-black text-slate-800 leading-relaxed">
                  {tr(lang, problem.story.he, problem.story.en, problem.story.es)}
                </p>
              </div>
            ) : (
              problem.prompt && (
                <p className="text-sm sm:text-base font-extrabold text-slate-600 text-center">
                  {tr(lang, problem.prompt.he, problem.prompt.en, problem.prompt.es)}
                </p>
              )
            )}

            {/* Main LTR Math Equation Box (ALWAYS dir="ltr" so equations never flip in Hebrew RTL) */}
            {problem.equation && (
              <div
                dir="ltr"
                className={`w-full max-w-xl rounded-3xl px-5 py-5 sm:py-6 border-4 text-center shadow-inner transition-colors ${
                  solved
                    ? 'bg-emerald-50 border-emerald-400 text-emerald-950'
                    : isAge9
                      ? 'bg-indigo-50/70 border-indigo-200 text-slate-900'
                      : 'bg-sky-50/80 border-sky-200 text-slate-900'
                }`}
              >
                <span className="text-4xl sm:text-5xl md:text-6xl font-black tracking-wide select-none">
                  {solved
                    ? problem.equation.replace('?', problem.answer).replace('□', problem.answer).replace('◯', problem.answer)
                    : problem.equation}
                </span>
              </div>
            )}

            {/* Optional Curriculum Visuals */}
            {problem.visual?.type === 'groups' && <MultiplicationGroupsVisual visual={problem.visual} />}
            {problem.visual?.type === 'fraction_bar' && (
              <FractionBarVisual visual={problem.visual} showHint={showHint} lang={lang} />
            )}
            {problem.visual?.type === 'perimeter' && <PerimeterVisual visual={problem.visual} lang={lang} />}

            {/* Smart Hint Button & Expandable Israeli School Trick Card */}
            <div className="w-full max-w-xl flex flex-col items-center gap-2">
              <div className="flex items-center justify-center gap-2">
                <button
                  type="button"
                  onClick={() => {
                    playSound('pop');
                    setShowHint((v) => !v);
                  }}
                  className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-2xl border-2 font-black text-xs sm:text-sm transition btn-press-3d cursor-pointer ${
                    showHint
                      ? 'bg-amber-300 border-amber-500 text-amber-950'
                      : 'bg-amber-50 hover:bg-amber-100 border-amber-300 text-amber-900'
                  }`}
                >
                  <Lightbulb className="w-4 h-4 text-amber-600" />
                  <span>
                    {showHint
                      ? tr(lang, 'הַסְתֵּר טְרִיק', 'Hide Trick', 'Ocultar truco')
                      : tr(lang, 'טְרִיק בֵּית הַסֵּפֶר 💡', 'Smart Hint 💡', 'Truco escolar 💡')}
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    playSound('pop');
                    loadNextQuestion(age, topic, false);
                  }}
                  className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-600 font-bold text-xs sm:text-sm cursor-pointer"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  <span>{tr(lang, 'תַּרְגִּיל אַחֵר', 'New Question', 'Otro ejercicio')}</span>
                </button>
              </div>

              {showHint && (
                <div className="w-full bg-amber-50 border-2 border-amber-300 rounded-2xl p-3.5 sm:p-4 text-amber-950 flex flex-col items-center text-center gap-2 animate-pop-in">
                  <p className="text-xs sm:text-sm font-extrabold leading-relaxed">
                    💡 {tr(lang, problem.hint.he, problem.hint.en, problem.hint.es)}
                  </p>
                  {problem.hintMath && (
                    <div
                      dir="ltr"
                      className="px-4 py-1.5 bg-white border border-amber-300 rounded-xl font-black text-sm sm:text-base text-indigo-900 shadow-2xs"
                    >
                      {problem.hintMath}
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* ---------------- ANSWER CONTROLS ---------------- */}
            {problem.answerType === 'compare' ? (
              /* 3 Big Comparison Buttons (< , = , >) in LTR order */
              <div className="grid grid-cols-3 gap-3 sm:gap-4 w-full max-w-lg" dir="ltr">
                {problem.choices.map((sym) => {
                  const isWrong = wrongChoices.includes(sym);
                  const isRight = solved && sym === problem.answer;
                  return (
                    <button
                      key={sym}
                      type="button"
                      disabled={isWrong || solved}
                      onClick={() => handleChoiceTap(sym)}
                      className={`h-24 sm:h-28 rounded-3xl border-4 flex flex-col items-center justify-center gap-1 btn-press-3d cursor-pointer transition-all ${
                        isRight
                          ? 'bg-emerald-300 border-emerald-500 text-emerald-950 scale-105 ring-4 ring-emerald-200'
                          : isWrong
                            ? 'bg-slate-100 border-slate-200 text-slate-300 opacity-45 cursor-not-allowed'
                            : 'bg-sky-50 hover:bg-sky-100 border-sky-400 text-sky-950'
                      }`}
                    >
                      <span className="text-4xl sm:text-5xl font-black leading-none">{sym}</span>
                      <span className="text-xs font-extrabold opacity-80">{compareLabel(sym)}</span>
                    </button>
                  );
                })}
              </div>
            ) : useKeypad ? (
              /* Optional Keypad Input Mode */
              <div className="w-full max-w-sm flex flex-col items-center gap-3" dir="ltr">
                <div
                  className={`w-full h-16 rounded-2xl border-4 flex items-center justify-center gap-2 font-black text-3xl sm:text-4xl transition-colors ${
                    solved
                      ? 'bg-emerald-100 border-emerald-500 text-emerald-900'
                      : keypadWrongFlash
                        ? 'bg-rose-100 border-rose-400 text-rose-800'
                        : 'bg-slate-50 border-indigo-300 text-slate-900'
                  }`}
                >
                  <span>{keypadValue || (problem.answerType === 'fraction' ? '?/?' : '?')}</span>
                  {problem.unit && (
                    <span className="text-xl font-black text-slate-500">
                      {tr(lang, problem.unit.he, problem.unit.en, problem.unit.es)}
                    </span>
                  )}
                </div>

                <div className="grid grid-cols-3 gap-2 w-full">
                  {['1', '2', '3', '4', '5', '6', '7', '8', '9'].map((digit) => (
                    <button
                      key={digit}
                      type="button"
                      disabled={solved}
                      onClick={() => appendKeypadChar(digit)}
                      className="h-14 rounded-2xl bg-slate-50 hover:bg-indigo-50 border-2 border-slate-300 text-slate-900 font-black text-2xl btn-press-3d cursor-pointer"
                    >
                      {digit}
                    </button>
                  ))}

                  {problem.answerType === 'fraction' ? (
                    <button
                      type="button"
                      disabled={solved}
                      onClick={() => appendKeypadChar('/')}
                      className="h-14 rounded-2xl bg-amber-100 hover:bg-amber-200 border-2 border-amber-400 text-amber-950 font-black text-2xl btn-press-3d cursor-pointer"
                    >
                      /
                    </button>
                  ) : (
                    <button
                      type="button"
                      disabled={solved}
                      onClick={() => {
                        playSound('pop');
                        setKeypadValue('');
                      }}
                      className="h-14 rounded-2xl bg-slate-100 hover:bg-slate-200 border-2 border-slate-300 text-slate-700 font-black text-lg btn-press-3d cursor-pointer"
                    >
                      C
                    </button>
                  )}

                  <button
                    type="button"
                    disabled={solved}
                    onClick={() => appendKeypadChar('0')}
                    className="h-14 rounded-2xl bg-slate-50 hover:bg-indigo-50 border-2 border-slate-300 text-slate-900 font-black text-2xl btn-press-3d cursor-pointer"
                  >
                    0
                  </button>

                  <button
                    type="button"
                    disabled={solved}
                    onClick={() => {
                      playSound('pop');
                      setKeypadValue((p) => p.slice(0, -1));
                    }}
                    aria-label={tr(lang, 'מְחַק', 'Backspace', 'Borrar')}
                    className="h-14 rounded-2xl bg-rose-50 hover:bg-rose-100 border-2 border-rose-300 text-rose-700 font-black flex items-center justify-center btn-press-3d cursor-pointer"
                  >
                    <Delete className="w-6 h-6" />
                  </button>
                </div>

                <button
                  type="button"
                  disabled={solved || !keypadValue.trim()}
                  onClick={handleKeypadSubmit}
                  className="w-full h-14 rounded-2xl bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700 disabled:opacity-45 text-white font-black text-lg flex items-center justify-center gap-2 shadow-md btn-press-3d cursor-pointer"
                >
                  <CheckCircle2 className="w-6 h-6" />
                  <span>{tr(lang, 'בְּדֹק תְּשׁוּבָה', 'Check Answer', 'Comprobar')}</span>
                </button>
              </div>
            ) : (
              /* 4 Big Tap-to-Answer Buttons */
              <div className="grid grid-cols-2 gap-3 sm:gap-4 w-full max-w-xl" dir="ltr">
                {problem.choices.map((choice) => {
                  const isWrong = wrongChoices.includes(choice);
                  const isRight = solved && choice === problem.answer;
                  const unitText = problem.unit ? tr(lang, problem.unit.he, problem.unit.en, problem.unit.es) : '';

                  return (
                    <button
                      key={choice}
                      type="button"
                      disabled={isWrong || solved}
                      onClick={() => handleChoiceTap(choice)}
                      className={`min-h-[84px] sm:min-h-[96px] px-4 py-3 rounded-3xl border-4 font-black text-3xl sm:text-4xl flex items-center justify-center gap-2 btn-press-3d cursor-pointer transition-all ${
                        isRight
                          ? 'bg-emerald-300 border-emerald-500 text-emerald-950 scale-105 ring-4 ring-emerald-200 animate-jelly'
                          : isWrong
                            ? 'bg-slate-100 border-slate-200 text-slate-300 opacity-45 cursor-not-allowed'
                            : isAge9
                              ? 'bg-indigo-50 hover:bg-indigo-100 border-indigo-400 text-indigo-950'
                              : 'bg-sky-50 hover:bg-sky-100 border-sky-400 text-sky-950'
                      }`}
                    >
                      {problem.answerType === 'fraction' ? (
                        <FractionChip value={choice} />
                      ) : (
                        <span>
                          {choice}
                          {unitText ? ` ${unitText}` : ''}
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            )}

            {/* Positive feedback pill */}
            {solved && (
              <div className="px-5 py-2 bg-emerald-100 border-2 border-emerald-400 text-emerald-900 rounded-full font-black text-sm sm:text-base flex items-center gap-2 animate-pop-in">
                <span>🌟</span>
                <span>
                  {tr(
                    lang,
                    gender === 'girl' ? 'מְעוּלָּה! +1 כּוֹכָב!' : 'מְעוּלֶּה! +1 כּוֹכָב!',
                    'Awesome! +1 Star!',
                    '¡Genial! ¡+1 Estrella!'
                  )}
                </span>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
