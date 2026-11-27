import React, { useState, useEffect, useCallback, useRef } from 'react';
import {
  Star,
  Trophy,
  Lightbulb,
  HelpCircle,
  RefreshCw,
  Volume2,
  Sparkles,
  Flame,
  ArrowRight,
  BookOpen
} from 'lucide-react';
import { SKILL_ARENA_CONFIG, generateSkillQuestion } from '../data/schoolSkillData';
import { playSound, playPhraseAudio } from '../utils/audio';
import { triggerConfetti, triggerStarBurst } from '../utils/confetti';
import { tr } from '../utils/i18n';

const MISSION_LENGTH = 5;
const BONUS_STARS = 5;
const WRONG_PAUSE_THRESHOLD = 3;

function stopSpeech() {
  try {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
  } catch {
    // ignore
  }
}

function speakAloud(text, voiceLang = 'he-IL') {
  if (!text) return;
  try {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;
    window.speechSynthesis.cancel();
    const clean = String(text)
      .replace(/[\u{1F300}-\u{1FAFF}\u{2600}-\u{27BF}]/gu, ' ')
      .replace(/_/g, ' ')
      .replace(/\s+/g, ' ')
      .trim();
    if (!clean) return;
    const utt = new SpeechSynthesisUtterance(clean);
    utt.lang = voiceLang;
    utt.rate = 0.9;
    window.speechSynthesis.speak(utt);
  } catch {
    // ignore
  }
}

export default function SchoolSkillArena({
  arenaId = 'hebrew_age7',
  lang,
  soundEnabled,
  gender = 'boy',
  onEarnStar,
  onSwitchActivity
}) {
  const isHe = lang === 'he';
  const cfg = SKILL_ARENA_CONFIG[arenaId] || SKILL_ARENA_CONFIG.hebrew_age7;
  const isEnglishArena = arenaId.startsWith('english_');

  const [topic, setTopic] = useState('mix');
  const [question, setQuestion] = useState(() => generateSkillQuestion(arenaId, 'mix'));
  const [wrongChoices, setWrongChoices] = useState([]);
  const [solved, setSolved] = useState(false);
  const [showHint, setShowHint] = useState(false);
  const [showExplain, setShowExplain] = useState(false);
  const [missionStep, setMissionStep] = useState(0);
  const [missionComplete, setMissionComplete] = useState(false);
  const [firstTryCount, setFirstTryCount] = useState(0);
  const [hadWrongThisQ, setHadWrongThisQ] = useState(false);
  const [consecutiveWrong, setConsecutiveWrong] = useState(0);
  const [learningPause, setLearningPause] = useState(false);
  const [streak, setStreak] = useState(0);
  const [sessionStars, setSessionStars] = useState(0);

  const timeoutsRef = useRef([]);

  const clearTimers = useCallback(() => {
    timeoutsRef.current.forEach((id) => clearTimeout(id));
    timeoutsRef.current = [];
    stopSpeech();
  }, []);

  const schedule = useCallback((fn, ms) => {
    const id = setTimeout(() => {
      timeoutsRef.current = timeoutsRef.current.filter((t) => t !== id);
      fn();
    }, ms);
    timeoutsRef.current.push(id);
    return id;
  }, []);

  useEffect(() => () => clearTimers(), [clearTimers]);

  const loadNext = useCallback(
    (nextTopic, resetMission = false, openHint = false) => {
      clearTimers();
      setQuestion(generateSkillQuestion(arenaId, nextTopic));
      setWrongChoices([]);
      setSolved(false);
      setShowHint(openHint);
      setShowExplain(false);
      setHadWrongThisQ(false);
      setLearningPause(false);
      if (resetMission) {
        setMissionStep(0);
        setMissionComplete(false);
        setFirstTryCount(0);
      }
    },
    [arenaId, clearTimers]
  );

  const handleTopicSwitch = (nextTopic) => {
    if (nextTopic === topic) return;
    playSound('pop');
    setTopic(nextTopic);
    setConsecutiveWrong(0);
    loadNext(nextTopic, true);
  };

  const handlePick = (choice) => {
    if (solved || learningPause || wrongChoices.includes(choice)) return;
    if (choice === question.answer) {
      setSolved(true);
      setConsecutiveWrong(0);
      setLearningPause(false);
      setStreak((s) => s + 1);
      const nextStep = missionStep + 1;
      setMissionStep(nextStep);
      if (!hadWrongThisQ) setFirstTryCount((c) => c + 1);

      onEarnStar(1);
      setSessionStars((s) => s + 1);

      if (nextStep >= MISSION_LENGTH) {
        playSound('win');
        triggerStarBurst({ x: 0.3, y: 0.5 });
        triggerStarBurst({ x: 0.7, y: 0.5 });
        triggerConfetti({ x: 0.5, y: 0.6 });
        onEarnStar(BONUS_STARS);
        setSessionStars((s) => s + BONUS_STARS);
        if (soundEnabled && isHe) {
          schedule(() => playPhraseAudio('crazy_correct', gender), 200);
        }
        schedule(() => setMissionComplete(true), 950);
      } else {
        playSound('star');
        triggerConfetti({ x: 0.5, y: 0.65 });
        if (soundEnabled && question.speak) {
          speakAloud(question.speak, cfg.speechLang);
        }
        schedule(() => loadNext(topic, false), 1300);
      }
    } else {
      playSound('whoosh');
      setStreak(0);
      setHadWrongThisQ(true);
      setWrongChoices((prev) => [...prev, choice]);
      const nextWrong = consecutiveWrong + 1;
      setConsecutiveWrong(nextWrong);
      if (nextWrong === 2) setShowHint(true);
      if (nextWrong >= WRONG_PAUSE_THRESHOLD) {
        setShowHint(true);
        setLearningPause(true);
        return;
      }
      if (soundEnabled && isHe) {
        playPhraseAudio('try_again', gender);
      }
    }
  };

  const promptText = tr(lang, question.promptHe, question.promptEn, question.promptEs);
  const hintText = tr(lang, question.hintHe, question.hintEn, question.hintEs);
  const uiVoiceLang = lang === 'he' ? 'he-IL' : lang === 'es' ? 'es-ES' : 'en-US';

  return (
    <div className="max-w-4xl mx-auto px-3 sm:px-4 py-4 sm:py-5 flex flex-col gap-4" dir={isHe ? 'rtl' : 'ltr'}>
      {/* Dedicated Age & Subject Header */}
      <div className={`rounded-3xl p-4 sm:p-5 text-white shadow-xl border-4 border-white bg-gradient-to-r ${cfg.gradient}`}>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h2 className="text-2xl sm:text-3xl font-black tracking-tight flex items-center gap-2">
              <span>{cfg.icon}</span>
              <span>{tr(lang, cfg.titleHe, cfg.titleEn, cfg.titleEs)}</span>
            </h2>
            <p className="text-white/90 text-xs sm:text-sm font-bold mt-0.5">
              {tr(lang, cfg.subHe, cfg.subEn, cfg.subEs)}
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
      </div>

      {/* Topic Selector Pills */}
      <div className="flex flex-wrap items-center justify-center gap-2">
        {cfg.topics.map((t) => {
          const active = topic === t.id;
          return (
            <button
              key={t.id}
              type="button"
              onClick={() => handleTopicSwitch(t.id)}
              className={`px-3.5 py-2 rounded-2xl border-2 font-black text-xs sm:text-sm flex items-center gap-1.5 transition btn-press-3d cursor-pointer ${
                active
                  ? 'bg-indigo-600 text-white border-indigo-800 shadow-md'
                  : 'bg-white text-slate-700 border-slate-200 hover:border-amber-400 hover:bg-amber-50'
              }`}
            >
              <span>{t.icon}</span>
              <span>{tr(lang, t.he, t.en, t.es)}</span>
            </button>
          );
        })}
      </div>

      {/* Main Arena Stage Card */}
      <div className={`bg-white rounded-3xl p-4 sm:p-6 md:p-7 border-4 ${cfg.border} shadow-xl flex flex-col gap-5`}>
        {/* 5-Star Mission Progress Bar */}
        <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b-2 border-slate-100">
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
                        ? 'bg-amber-300 border-amber-500 scale-105'
                        : current
                          ? 'bg-amber-50 border-amber-400 border-dashed'
                          : 'bg-slate-100 border-slate-200'
                    }`}
                  >
                    <Star className={`w-4 h-4 ${earned ? 'text-amber-700 fill-amber-500' : 'text-slate-300'}`} />
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
        </div>

        {missionComplete ? (
          <div className="py-6 sm:py-8 flex flex-col items-center text-center gap-4 animate-pop-in">
            <div className="w-24 h-24 rounded-full bg-gradient-to-tr from-amber-300 via-yellow-300 to-orange-400 border-4 border-white shadow-2xl flex items-center justify-center text-5xl animate-bounce-gentle">
              🏆
            </div>
            <h3 className="text-2xl sm:text-3xl font-black text-slate-900">
              {tr(
                lang,
                gender === 'girl' ? 'אַלּוּפָה! סִיַּמְתְּ אֶת הַמְּשִׂימָה! 🎉' : 'אַלּוּף! סִיַּמְתָּ אֶת הַמְּשִׂימָה! 🎉',
                'Mission Complete! Great Job! 🎉',
                '¡Misión cumplida! ¡Excelente! 🎉'
              )}
            </h3>
            <div className="flex flex-wrap items-center justify-center gap-3">
              <div className="px-5 py-2.5 bg-amber-200 border-2 border-amber-400 rounded-2xl font-black text-amber-950 text-base flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-amber-600" />
                <span>{tr(lang, `בּוֹנוּס: +${BONUS_STARS} כּוֹכָבִים! ⭐`, `Bonus: +${BONUS_STARS} Stars! ⭐`, `Bono: ¡+${BONUS_STARS} estrellas! ⭐`)}</span>
              </div>
              <div className="px-4 py-2.5 bg-emerald-100 border-2 border-emerald-300 rounded-2xl font-black text-emerald-900 text-sm flex items-center gap-1.5">
                <Trophy className="w-4 h-4 text-emerald-600" />
                <span>
                  {tr(lang, `מִנִּסָּיוֹן רִאשׁוֹן: ${firstTryCount}/${MISSION_LENGTH}`, `First-Try: ${firstTryCount}/${MISSION_LENGTH}`, `Primer intento: ${firstTryCount}/${MISSION_LENGTH}`)}
                </span>
              </div>
            </div>
            <button
              type="button"
              onClick={() => {
                playSound('pop');
                loadNext(topic, true);
              }}
              className="mt-2 px-8 py-4 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white font-black text-lg rounded-3xl shadow-xl border-4 border-emerald-200 flex items-center gap-2 btn-press-3d cursor-pointer"
            >
              <span>{tr(lang, 'מְשִׂימָה חֲדָשָׁה! 🚀', 'Start Next Mission! 🚀', '¡Nueva misión! 🚀')}</span>
              <ArrowRight className={`w-5 h-5 ${isHe ? 'rotate-180' : ''}`} />
            </button>
          </div>
        ) : learningPause ? (
          /* ---------------- LEARNING COACH PAUSE (AFTER 3 MISSES) ---------------- */
          <div className="py-3 sm:py-5 flex flex-col items-center text-center gap-4 animate-pop-in">
            <div className="w-20 h-20 rounded-full bg-amber-200 border-4 border-amber-400 shadow-lg flex items-center justify-center text-5xl">
              🦉
            </div>
            <div>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-amber-100 text-amber-900 rounded-full text-xs font-black border border-amber-300 mb-2">
                <BookOpen className="w-3.5 h-3.5" />
                <span>{tr(lang, 'עוֹצְרִים לְרֶגַע וְלוֹמְדִים יַחַד!', 'Quick Learning Break!', '¡Pausa para aprender!')}</span>
              </span>
              <h3 className="text-xl sm:text-2xl font-black text-slate-900">
                {tr(lang, 'בּוֹאוּ נִלְמַד אֶת הַתְּשׁוּבָה הַזֹּאת בְּיַחַד:', 'Let’s learn this one together:', 'Aprendamos esta juntos:')}
              </h3>
            </div>

            <div className="w-full max-w-xl bg-amber-50 border-3 border-amber-300 rounded-3xl p-4 sm:p-5 flex flex-col items-center gap-3">
              <div className="text-4xl">{question.emoji}</div>
              <div
                dir={isEnglishArena ? 'ltr' : 'rtl'}
                className="px-5 py-2 bg-white border-2 border-amber-300 rounded-2xl text-2xl sm:text-3xl font-black text-slate-900"
              >
                {question.display} → <span className="text-emerald-700">{question.answer}</span>
              </div>
              <p className="text-sm sm:text-base font-extrabold text-amber-950 leading-relaxed">
                💡 {hintText}
              </p>
              <button
                type="button"
                onClick={() => speakAloud(hintText, uiVoiceLang)}
                className="inline-flex items-center gap-1.5 px-4 py-1.5 bg-white hover:bg-amber-100 text-amber-900 border-2 border-amber-300 rounded-full font-black text-xs sm:text-sm cursor-pointer"
              >
                <Volume2 className="w-4 h-4" />
                <span>{tr(lang, '🔊 הַקְרֵא הֶסְבֵּר', '🔊 Read Explanation', '🔊 Leer explicación')}</span>
              </button>
            </div>

            <div className="w-full max-w-xl flex flex-col sm:flex-row flex-wrap items-stretch justify-center gap-2.5">
              <button
                type="button"
                onClick={() => {
                  playSound('pop');
                  setConsecutiveWrong(0);
                  loadNext(topic, false, true);
                }}
                className="flex-1 min-w-[200px] py-3.5 px-5 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white font-black text-sm sm:text-base rounded-2xl shadow-md btn-press-3d cursor-pointer"
              >
                ✨ {tr(lang, 'הֵבַנְתִּי! נַסֶּה שְׁאֵלָה חֲדָשָׁה עִם רֶמֶז', 'Got It! Try Another with Hint', '¡Entendido! Probar otra con pista')}
              </button>

              {onSwitchActivity && cfg.easierTab && (
                <button
                  type="button"
                  onClick={() => {
                    playSound('pop');
                    onSwitchActivity(cfg.easierTab);
                  }}
                  className="py-3.5 px-4 bg-amber-100 hover:bg-amber-200 text-amber-950 border-2 border-amber-400 font-black text-sm rounded-2xl btn-press-3d cursor-pointer"
                >
                  🌱 {tr(lang, 'נַסֶּה מִשְׂחָק קַל יוֹתֵר', 'Try Something Easier', 'Probar algo más fácil')}
                </button>
              )}
            </div>
          </div>
        ) : (
          /* ---------------- ACTIVE QUESTION STAGE ---------------- */
          <div className="flex flex-col items-center gap-5">
            {/* Prompt + Read Aloud */}
            <div className="flex flex-wrap items-center justify-center gap-2 text-center">
              <p className="text-sm sm:text-base font-extrabold text-slate-700">{promptText}</p>
              <button
                type="button"
                onClick={() => speakAloud(promptText, uiVoiceLang)}
                className="inline-flex items-center gap-1 px-3 py-1 bg-indigo-50 hover:bg-indigo-100 text-indigo-800 border border-indigo-200 rounded-full font-black text-xs cursor-pointer"
              >
                <Volume2 className="w-3.5 h-3.5" />
                <span>{tr(lang, 'הַקְרֵא שְׁאֵלָה', 'Read Question', 'Leer pregunta')}</span>
              </button>
            </div>

            {/* Big Display Card + Tap-to-Hear Word/Sentence */}
            <div
              dir={isEnglishArena ? 'ltr' : 'rtl'}
              className={`w-full max-w-xl rounded-3xl px-5 py-6 border-4 flex flex-col items-center gap-3 text-center shadow-inner ${
                solved ? 'bg-emerald-50 border-emerald-400' : 'bg-slate-50 border-indigo-200'
              }`}
            >
              <span className="text-5xl">{question.emoji}</span>
              <div className="text-3xl sm:text-4xl md:text-5xl font-black text-slate-900 tracking-wide leading-snug">
                {solved
                  ? question.display.replace(/_+/, question.answer).replace('?', question.answer)
                  : question.display}
              </div>
              {question.speak && (
                <button
                  type="button"
                  onClick={() => speakAloud(question.speak, cfg.speechLang)}
                  className="inline-flex items-center gap-1.5 px-4 py-1.5 bg-white hover:bg-amber-50 text-indigo-900 border-2 border-indigo-200 rounded-full font-black text-xs sm:text-sm shadow-2xs btn-press-3d cursor-pointer"
                >
                  <Volume2 className="w-4 h-4 text-indigo-600" />
                  <span>
                    {isEnglishArena
                      ? tr(lang, '🔊 שְׁמַע בְּאַנְגְּלִית', '🔊 Hear Word', '🔊 Escuchar en inglés')
                      : tr(lang, '🔊 שְׁמַע אֶת הַמִּלָּה', '🔊 Hear Hebrew', '🔊 Escuchar')}
                  </span>
                </button>
              )}
            </div>

            {/* Explain Step-by-Step + Hint + New Question Toolbar */}
            <div className="w-full max-w-xl flex flex-col items-center gap-2">
              <div className="flex flex-wrap items-center justify-center gap-2">
                <button
                  type="button"
                  onClick={() => {
                    playSound('pop');
                    setShowExplain((v) => !v);
                    setShowHint(false);
                  }}
                  className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-2xl border-2 font-black text-xs sm:text-sm transition btn-press-3d cursor-pointer ${
                    showExplain
                      ? 'bg-indigo-600 border-indigo-800 text-white'
                      : 'bg-indigo-50 hover:bg-indigo-100 border-indigo-300 text-indigo-900'
                  }`}
                >
                  <HelpCircle className="w-4 h-4" />
                  <span>
                    {showExplain
                      ? tr(lang, 'הַסְתֵּר הֶסְבֵּר', 'Hide Explanation', 'Ocultar')
                      : tr(lang, 'הַסְבֵּר לִי בְּפֵרוּט ❓', 'Explain Step-by-Step ❓', 'Explicar paso a paso ❓')}
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    playSound('pop');
                    setShowHint((v) => !v);
                    setShowExplain(false);
                  }}
                  className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-2xl border-2 font-black text-xs sm:text-sm transition btn-press-3d cursor-pointer ${
                    showHint
                      ? 'bg-amber-300 border-amber-500 text-amber-950'
                      : 'bg-amber-50 hover:bg-amber-100 border-amber-300 text-amber-900'
                  }`}
                >
                  <Lightbulb className="w-4 h-4 text-amber-600" />
                  <span>{tr(lang, 'רֶמֶז 💡', 'Hint 💡', 'Pista 💡')}</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    playSound('pop');
                    loadNext(topic, false);
                  }}
                  className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-600 font-bold text-xs sm:text-sm cursor-pointer"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  <span>{tr(lang, 'שְׁאֵלָה אַחֶרֶת', 'New Question', 'Otra pregunta')}</span>
                </button>
              </div>

              {showExplain && (
                <div className="w-full bg-indigo-50 border-2 border-indigo-300 rounded-2xl p-4 text-slate-800 flex flex-col gap-2.5 text-start animate-pop-in">
                  <div className="flex items-center justify-between gap-2 pb-1.5 border-b border-indigo-200">
                    <span className="font-black text-sm text-indigo-900">
                      🦉 {tr(lang, 'הֶסְבֵּר מְפֹרָט: מָה עוֹשִׂים כָּאן?', 'Detailed Guide: What to Do', 'Guía detallada')}
                    </span>
                    <button
                      type="button"
                      onClick={() => speakAloud(`${promptText}. ${hintText}`, uiVoiceLang)}
                      className="inline-flex items-center gap-1 px-3 py-1 bg-white text-indigo-800 border border-indigo-300 rounded-full font-black text-xs cursor-pointer"
                    >
                      <Volume2 className="w-3.5 h-3.5" />
                      <span>{tr(lang, '🔊 הַקְרֵא', '🔊 Read', '🔊 Leer')}</span>
                    </button>
                  </div>
                  <p className="text-xs sm:text-sm font-bold leading-relaxed">
                    <strong className="text-indigo-900">1. </strong>
                    {promptText}
                  </p>
                  <p className="text-xs sm:text-sm font-bold leading-relaxed">
                    <strong className="text-amber-900">2. </strong>
                    {hintText}
                  </p>
                  <p className="text-xs sm:text-sm font-bold leading-relaxed">
                    <strong className="text-emerald-900">3. </strong>
                    {tr(lang, 'בַּחֲרוּ אֶת הַתְּשׁוּבָה הַנְּכוֹנָה מִבֵּין 4 הַכַּפְתּוֹרִים לְמַטָּה!', 'Tap the right answer from the 4 buttons below!', '¡Elige la respuesta correcta abajo!')}
                  </p>
                </div>
              )}

              {showHint && (
                <div className="w-full bg-amber-50 border-2 border-amber-300 rounded-2xl p-3.5 text-amber-950 flex flex-col items-center text-center gap-2 animate-pop-in">
                  <p className="text-xs sm:text-sm font-extrabold leading-relaxed">💡 {hintText}</p>
                  <button
                    type="button"
                    onClick={() => speakAloud(hintText, uiVoiceLang)}
                    className="inline-flex items-center gap-1 px-3 py-1 bg-white text-amber-900 border border-amber-300 rounded-full font-black text-xs cursor-pointer"
                  >
                    <Volume2 className="w-3.5 h-3.5" />
                    <span>{tr(lang, '🔊 הַקְרֵא רֶמֶז', '🔊 Read Hint', '🔊 Leer pista')}</span>
                  </button>
                </div>
              )}
            </div>

            {/* 4 Big Answer Choices */}
            <div className="grid grid-cols-2 gap-3 sm:gap-4 w-full max-w-xl">
              {question.choices.map((choice) => {
                const isWrong = wrongChoices.includes(choice);
                const isRight = solved && choice === question.answer;
                return (
                  <button
                    key={choice}
                    type="button"
                    disabled={isWrong || solved}
                    onClick={() => handlePick(choice)}
                    className={`min-h-[80px] sm:min-h-[92px] px-4 py-3 rounded-3xl border-4 font-black text-2xl sm:text-3xl flex items-center justify-center btn-press-3d cursor-pointer transition-all ${
                      isRight
                        ? 'bg-emerald-300 border-emerald-500 text-emerald-950 scale-105 ring-4 ring-emerald-200 animate-jelly'
                        : isWrong
                          ? 'bg-slate-100 border-slate-200 text-slate-300 opacity-45 cursor-not-allowed'
                          : 'bg-indigo-50 hover:bg-indigo-100 border-indigo-300 text-indigo-950'
                    }`}
                  >
                    {choice}
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
