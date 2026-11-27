import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  Volume2,
  Trophy,
  RefreshCw,
  CheckCircle2,
  Settings,
  Sliders,
  Zap,
  Lock,
  Unlock,
  Maximize2,
  X
} from 'lucide-react';
import { LETTERS_DATA } from '../data/curriculumData';
import { playSound, speakLetterName, playPhraseAudio } from '../utils/audio';
import confetti from 'canvas-confetti';
import { useDeviceType } from '../utils/useDeviceType';
import { tr } from '../utils/i18n';

const LONG_PRESS_EXIT_MS = 1200;
const IDLE_NUDGE_MS = 8500;
const DEFAULT_LETTER_IDS = ['alef', 'bet_dagesh', 'vet', 'gimel', 'dalet', 'he', 'yod'];

function createQuizRound(letterIds) {
  const activePool = LETTERS_DATA.filter((l) => letterIds.includes(l.id));
  const pool = activePool.length > 0 ? activePool : LETTERS_DATA;
  const targetLetter = pool[Math.floor(Math.random() * pool.length)];
  const otherLetters = LETTERS_DATA.filter((l) => l.id !== targetLetter.id)
    .sort(() => 0.5 - Math.random())
    .slice(0, 2);
  const options = [targetLetter, ...otherLetters].sort(() => 0.5 - Math.random());
  return { targetLetter, options };
}

export default function LetterQuiz({
  lang,
  soundEnabled,
  gender = 'boy',
  onEarnStar,
  isFocusLocked = false,
  onFocusLockChange
}) {
  const isHe = lang === 'he';
  const { isTouch } = useDeviceType();

  // Game Modes: 'see_letter' (kid sees the letter and identifies its name) or 'hear_letter' (kid hears name and finds letter)
  const [gameMode, setGameMode] = useState('see_letter');

  // Custom Letter Selection: user can select EXACTLY which letters appear
  const [selectedLetterIds, setSelectedLetterIds] = useState(DEFAULT_LETTER_IDS);
  const [showSettings, setShowSettings] = useState(false);

  // Active round state
  const [round, setRound] = useState(() => createQuizRound(DEFAULT_LETTER_IDS));
  const { targetLetter, options } = round;
  const [selectedOptionId, setSelectedOptionId] = useState(null);
  const [isCorrect, setIsCorrect] = useState(null);
  const [isCrazyCelebrating, setIsCrazyCelebrating] = useState(false);
  const [helpHintActive, setHelpHintActive] = useState(false);
  const [wrongOptionIds, setWrongOptionIds] = useState([]);
  const [previewedOptionId, setPreviewedOptionId] = useState(null);
  const [streak, setStreak] = useState(0);
  const [score, setScore] = useState(0);

  // Focus Lock long-press exit progress (0..1) and gentle tap hint
  const [holdProgress, setHoldProgress] = useState(0);
  const [showHoldTip, setShowHoldTip] = useState(false);

  // Gentle ~8.5s idle attention nudge
  const [idleNudge, setIdleNudge] = useState(false);
  const [lastInteractionTick, setLastInteractionTick] = useState(0);

  const timeoutsRef = useRef([]);
  const holdRafRef = useRef(null);
  const holdStartRef = useRef(null);
  const enteredNativeFsRef = useRef(false);
  const tipTimeoutRef = useRef(null);

  const clearRoundTimeouts = useCallback(() => {
    timeoutsRef.current.forEach((id) => clearTimeout(id));
    timeoutsRef.current = [];
  }, []);

  const scheduleTimeout = useCallback((fn, ms) => {
    const id = setTimeout(() => {
      timeoutsRef.current = timeoutsRef.current.filter((t) => t !== id);
      fn();
    }, ms);
    timeoutsRef.current.push(id);
    return id;
  }, []);

  const markInteraction = useCallback(() => {
    setIdleNudge(false);
    setLastInteractionTick((t) => t + 1);
  }, []);

  // Lock viewport completely to 100dvh with zero scrolling / overscroll bounce
  useEffect(() => {
    const html = document.documentElement;
    html.classList.add('quiz-viewport-lock');
    window.scrollTo(0, 0);

    const preventStrayScroll = (e) => {
      if (e.target && e.target.closest && e.target.closest('[data-allow-scroll]')) {
        return;
      }
      if (e.cancelable) {
        e.preventDefault();
      }
    };

    window.addEventListener('touchmove', preventStrayScroll, { passive: false });

    return () => {
      html.classList.remove('quiz-viewport-lock');
      window.removeEventListener('touchmove', preventStrayScroll);
      clearRoundTimeouts();
      if (holdRafRef.current) cancelAnimationFrame(holdRafRef.current);
      if (tipTimeoutRef.current) clearTimeout(tipTimeoutRef.current);
      if (enteredNativeFsRef.current && document.fullscreenElement) {
        document.exitFullscreen?.().catch(() => {});
      }
      onFocusLockChange?.(false);
    };
  }, [clearRoundTimeouts, onFocusLockChange]);

  const enterFocusLock = useCallback(() => {
    playSound('pop');
    setShowSettings(false);
    markInteraction();
    onFocusLockChange?.(true);
    try {
      const el = document.documentElement;
      if (el.requestFullscreen && !document.fullscreenElement) {
        el.requestFullscreen()
          .then(() => {
            enteredNativeFsRef.current = true;
          })
          .catch(() => {
            enteredNativeFsRef.current = false;
          });
      }
    } catch {
      enteredNativeFsRef.current = false;
    }
  }, [markInteraction, onFocusLockChange]);

  const exitFocusLock = useCallback(() => {
    if (holdRafRef.current) {
      cancelAnimationFrame(holdRafRef.current);
      holdRafRef.current = null;
    }
    holdStartRef.current = null;
    setHoldProgress(0);
    setShowHoldTip(false);
    playSound('pop');
    onFocusLockChange?.(false);
    if (enteredNativeFsRef.current && document.fullscreenElement) {
      enteredNativeFsRef.current = false;
      document.exitFullscreen?.().catch(() => {});
    }
  }, [onFocusLockChange]);

  // Esc key exits Settings modal first, otherwise exits Focus Lock; also sync native fullscreen Esc
  useEffect(() => {
    const onKeyDown = (e) => {
      if (e.key === 'Escape') {
        if (showSettings) {
          setShowSettings(false);
        } else if (isFocusLocked) {
          exitFocusLock();
        }
      }
    };
    const onFullscreenChange = () => {
      if (enteredNativeFsRef.current && !document.fullscreenElement && isFocusLocked) {
        enteredNativeFsRef.current = false;
        onFocusLockChange?.(false);
      }
    };
    window.addEventListener('keydown', onKeyDown);
    document.addEventListener('fullscreenchange', onFullscreenChange);
    return () => {
      window.removeEventListener('keydown', onKeyDown);
      document.removeEventListener('fullscreenchange', onFullscreenChange);
    };
  }, [showSettings, isFocusLocked, exitFocusLock, onFocusLockChange]);

  // Long-press (1.2s) handlers to exit Focus Lock safely
  const cancelHoldExit = useCallback((wasShortTap = false) => {
    if (holdRafRef.current) {
      cancelAnimationFrame(holdRafRef.current);
      holdRafRef.current = null;
    }
    const elapsed = holdStartRef.current ? performance.now() - holdStartRef.current : 0;
    holdStartRef.current = null;
    setHoldProgress(0);

    if (wasShortTap && elapsed > 0 && elapsed < LONG_PRESS_EXIT_MS) {
      setShowHoldTip(true);
      if (tipTimeoutRef.current) clearTimeout(tipTimeoutRef.current);
      tipTimeoutRef.current = setTimeout(() => setShowHoldTip(false), 1800);
    }
  }, []);

  const startHoldExit = useCallback(
    (e) => {
      e.preventDefault();
      if (holdRafRef.current) cancelAnimationFrame(holdRafRef.current);
      holdStartRef.current = performance.now();
      setShowHoldTip(false);

      const tick = (now) => {
        if (!holdStartRef.current) return;
        const elapsed = now - holdStartRef.current;
        const pct = Math.min(1, elapsed / LONG_PRESS_EXIT_MS);
        setHoldProgress(pct);
        if (pct >= 1) {
          holdRafRef.current = null;
          holdStartRef.current = null;
          exitFocusLock();
          return;
        }
        holdRafRef.current = requestAnimationFrame(tick);
      };

      holdRafRef.current = requestAnimationFrame(tick);
    },
    [exitFocusLock]
  );

  // Gentle ~8.5s idle attention nudge when child pauses
  const showIdleNudge = idleNudge && isCorrect !== true && !isCrazyCelebrating && !showSettings && Boolean(targetLetter);

  useEffect(() => {
    if (isCorrect === true || isCrazyCelebrating || showSettings || !targetLetter) {
      return;
    }
    const timer = setTimeout(() => {
      setIdleNudge(true);
    }, IDLE_NUDGE_MS);
    return () => clearTimeout(timer);
  }, [lastInteractionTick, targetLetter, isCorrect, isCrazyCelebrating, showSettings]);

  // Start a fresh round based on selected letters pool
  const startNewRound = useCallback(
    (overrideIds = null, overrideMode = null) => {
      clearRoundTimeouts();
      const idsToUse = overrideIds || selectedLetterIds;
      const modeToUse = overrideMode || gameMode;
      const nextRound = createQuizRound(idsToUse);
      setRound(nextRound);

      setSelectedOptionId(null);
      setPreviewedOptionId(null);
      setIsCorrect(null);
      setIsCrazyCelebrating(false);
      setHelpHintActive(false);
      setWrongOptionIds([]);
      setIdleNudge(false);
      setLastInteractionTick((t) => t + 1);

      if (soundEnabled) {
        scheduleTimeout(() => {
          if (modeToUse === 'see_letter') {
            const phraseId = isTouch ? 'inst_quiz_cards_touch' : 'inst_quiz_cards_mouse';
            playPhraseAudio(phraseId, gender);
          } else {
            speakLetterName(nextRound.targetLetter.id);
          }
        }, 350);
      }
    },
    [clearRoundTimeouts, selectedLetterIds, gameMode, soundEnabled, scheduleTimeout, isTouch, gender]
  );

  // Preset letter selection helpers
  const setPreset = (type) => {
    playSound('pop');
    markInteraction();
    let nextIds = selectedLetterIds;
    switch (type) {
      case 'first_five':
        nextIds = ['alef', 'bet_dagesh', 'vet', 'gimel', 'dalet', 'he'];
        break;
      case 'hay_yud':
        nextIds = ['he', 'yod', 'alef', 'bet_dagesh', 'dalet'];
        break;
      case 'pupik_dagesh':
        nextIds = ['bet_dagesh', 'vet', 'kaf_dagesh', 'khaf', 'pe_dagesh', 'fe', 'shin', 'sin'];
        break;
      case 'all':
        nextIds = LETTERS_DATA.map((l) => l.id);
        break;
      default:
        break;
    }
    setSelectedLetterIds(nextIds);
    setShowSettings(false);
    startNewRound(nextIds, gameMode);
  };

  const toggleLetterSelection = (id) => {
    playSound('pop');
    markInteraction();
    let nextIds;
    if (selectedLetterIds.includes(id)) {
      if (selectedLetterIds.length <= 2) return; // keep at least 2 letters
      nextIds = selectedLetterIds.filter((item) => item !== id);
    } else {
      nextIds = [...selectedLetterIds, id];
    }
    setSelectedLetterIds(nextIds);
    startNewRound(nextIds, gameMode);
  };

  const switchGameMode = (nextMode) => {
    playSound('pop');
    markInteraction();
    if (nextMode === gameMode) return;
    setGameMode(nextMode);
    startNewRound(selectedLetterIds, nextMode);
  };

  // GO CRAZY celebration function!
  const triggerGoCrazy = () => {
    setIsCrazyCelebrating(true);
    playSound('win');

    try {
      confetti({
        particleCount: 110,
        spread: 85,
        origin: { x: 0.2, y: 0.6 },
        colors: ['#F59E0B', '#EF4444', '#10B981', '#3B82F6', '#EC4899']
      });
      confetti({
        particleCount: 110,
        spread: 85,
        origin: { x: 0.8, y: 0.6 },
        colors: ['#FBBF24', '#8B5CF6', '#06B6D4', '#F43F5E', '#10B981']
      });
    } catch {
      // ignore
    }

    if (soundEnabled) {
      scheduleTimeout(() => {
        playPhraseAudio('crazy_correct', gender);
      }, 300);
    }

    scheduleTimeout(() => {
      startNewRound();
    }, 2400);
  };

  const submitAnswer = (option) => {
    if (isCorrect === true || !targetLetter) return;
    markInteraction();
    setSelectedOptionId(option.id);

    if (option.id === targetLetter.id) {
      setIsCorrect(true);
      setScore((s) => s + 1);
      setStreak((st) => st + 1);
      onEarnStar(1);
      triggerGoCrazy();
    } else {
      setIsCorrect(false);
      playSound('whoosh');
      setStreak(0);
      setWrongOptionIds((prev) => (prev.includes(option.id) ? prev : [...prev, option.id]));
      setPreviewedOptionId(null);
      setHelpHintActive(true);

      if (soundEnabled) {
        speakLetterName(option.id);
        scheduleTimeout(() => {
          playPhraseAudio('helper_hint', gender);
        }, 800);
      }
    }
  };

  const handleSeeModeCardClick = (option) => {
    if (isCorrect === true || wrongOptionIds.includes(option.id)) return;
    markInteraction();
    // Step 1: Tap a card to hear it & reveal the green Confirm button inside the reserved footer slot
    if (previewedOptionId !== option.id) {
      setPreviewedOptionId(option.id);
      playSound('pop');
      if (soundEnabled) {
        speakLetterName(option.id);
      }
      return;
    }
    // Step 2: Second tap confirms
    submitAnswer(option);
  };

  const handleOptionClick = (option) => {
    submitAnswer(option);
  };

  const playCardsInstruction = () => {
    markInteraction();
    playSound('pop');
    if (soundEnabled) {
      const phraseId = isTouch ? 'inst_quiz_cards_touch' : 'inst_quiz_cards_mouse';
      playPhraseAudio(phraseId, gender);
    }
  };

  const repeatPrompt = () => {
    if (!targetLetter) return;
    markInteraction();
    playSound('pop');
    if (gameMode === 'see_letter') {
      playCardsInstruction();
    } else {
      speakLetterName(targetLetter.id);
    }
  };

  return (
    <div
      className={
        isFocusLocked
          ? 'fixed inset-0 z-50 h-[100dvh] w-screen bg-[#FFFBEB] overflow-hidden overscroll-none flex flex-col select-none touch-none pt-[env(safe-area-inset-top)] pb-[env(safe-area-inset-bottom)]'
          : 'h-full w-full overflow-hidden overscroll-none flex flex-col select-none touch-none'
      }
      dir={isHe ? 'rtl' : 'ltr'}
    >
      <div className="flex-1 min-h-0 w-full max-w-4xl mx-auto px-2.5 sm:px-4 py-2 sm:py-3 flex flex-col gap-2 overflow-hidden">
        {/* Compact Single-Row Utility Bar (replaces tall rainbow banner so entire quiz fits 100dvh) */}
        <div className="flex-shrink-0 h-11 sm:h-12 flex items-center justify-between gap-2 px-1">
          {/* Score & Streak */}
          <div className="flex items-center gap-1.5 sm:gap-2 min-w-0">
            <div className="flex items-center gap-1 bg-amber-100 border-2 border-amber-300 text-amber-900 px-2.5 sm:px-3 py-1 rounded-full font-black text-xs sm:text-sm shadow-xs">
              <Trophy className="w-4 h-4 text-amber-600 flex-shrink-0" />
              <bdi>{score}</bdi>
            </div>

            <div className="flex items-center gap-1 bg-pink-100 border-2 border-pink-300 text-pink-800 px-2.5 sm:px-3 py-1 rounded-full font-black text-xs sm:text-sm shadow-xs">
              <span>🔥</span>
              <bdi>{streak}</bdi>
            </div>
          </div>

          {/* Right controls: Focus Lock OR Hold-to-Exit + Settings + Next */}
          <div className="flex items-center gap-1.5 sm:gap-2 relative">
            {isFocusLocked ? (
              <div className="relative">
                <button
                  type="button"
                  onPointerDown={startHoldExit}
                  onPointerUp={() => cancelHoldExit(true)}
                  onPointerLeave={() => cancelHoldExit(false)}
                  onPointerCancel={() => cancelHoldExit(false)}
                  onContextMenu={(e) => e.preventDefault()}
                  aria-label={tr(
                    lang,
                    'הַחֲזִיקוּ 1.2 שְׁנִיּוֹת לִיצִיאָה מִמַּצָּב רִכּוּז',
                    'Hold 1.2s to exit Focus Lock',
                    'Mantén 1.2s para salir del enfoque'
                  )}
                  className="relative overflow-hidden flex items-center gap-1.5 px-3.5 sm:px-4 py-2 bg-slate-800 text-white rounded-2xl font-black text-xs sm:text-sm border-2 border-slate-600 shadow-md cursor-pointer select-none touch-none"
                >
                  {/* Animated fill bar while holding */}
                  <span
                    aria-hidden="true"
                    className="absolute inset-y-0 start-0 bg-emerald-500/80 transition-none pointer-events-none"
                    style={{ width: `${Math.round(holdProgress * 100)}%` }}
                  />
                  <span className="relative z-10 flex items-center gap-1.5">
                    {holdProgress > 0.05 ? (
                      <Unlock className="w-4 h-4 text-emerald-200" />
                    ) : (
                      <Lock className="w-4 h-4 text-amber-300" />
                    )}
                    <span>
                      {tr(
                        lang,
                        'הַחְזֵק 1.2 ש׳ לִיצִיאָה',
                        'Hold 1.2s to Exit',
                        'Mantén 1.2s para salir'
                      )}
                    </span>
                  </span>
                </button>

                {showHoldTip && (
                  <div className="absolute top-full mt-1.5 end-0 whitespace-nowrap bg-slate-900 text-amber-200 text-[11px] font-bold px-2.5 py-1 rounded-xl shadow-lg z-40 pointer-events-none">
                    {tr(
                      lang,
                      'לְחִיצָה אֲרֻכָּה (אוֹ Esc) לִיצִיאָה',
                      'Press & hold (or Esc) to exit',
                      'Mantén presionado (o Esc) para salir'
                    )}
                  </div>
                )}
              </div>
            ) : (
              <>
                <button
                  type="button"
                  onClick={enterFocusLock}
                  className="flex items-center gap-1.5 px-3 sm:px-3.5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-2xl font-black text-xs sm:text-sm border-2 border-indigo-400 shadow-sm btn-press-3d cursor-pointer"
                  title={tr(lang, 'מַצָּב רִכּוּז (מָסָךְ מָלֵא לְלֹא הַסָּחוֹת)', 'Focus Lock (Fullscreen)', 'Modo Enfoque (Pantalla completa)')}
                >
                  <Maximize2 className="w-4 h-4 flex-shrink-0" />
                  <span>{tr(lang, 'מַצָּב רִכּוּז', 'Focus Lock', 'Enfoque')}</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    playSound('pop');
                    markInteraction();
                    setShowSettings(true);
                  }}
                  className="flex items-center gap-1.5 px-3 py-2 bg-amber-200 hover:bg-amber-300 text-slate-900 rounded-2xl font-black text-xs sm:text-sm border-2 border-amber-400 shadow-sm btn-press-3d cursor-pointer"
                  aria-label={tr(lang, 'הַגְדָּרוֹת וּבְחִירַת אוֹתִיּוֹת', 'Quiz Settings & Letters', 'Ajustes y letras')}
                >
                  <Sliders className="w-4 h-4 flex-shrink-0" />
                  <span className="hidden sm:inline">{tr(lang, 'הַגְדָּרוֹת', 'Settings', 'Ajustes')}</span>
                  <span className="bg-white/80 text-amber-950 px-1.5 py-0.2 rounded-full text-[11px] font-black">
                    {selectedLetterIds.length}
                  </span>
                </button>
              </>
            )}

            <button
              type="button"
              onClick={() => {
                playSound('pop');
                startNewRound();
              }}
              aria-label={tr(lang, 'שְׁאֵלָה הַבָּאָה', 'Next Question', 'Siguiente pregunta')}
              title={tr(lang, 'שְׁאֵלָה הַבָּאָה', 'Next Question', 'Siguiente pregunta')}
              className="w-10 h-10 flex items-center justify-center bg-white hover:bg-slate-100 text-slate-700 rounded-2xl border-2 border-slate-200 shadow-xs btn-press-3d cursor-pointer flex-shrink-0"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Main Single-Screen Quiz Stage — zero scrolling, zero layout shift */}
        <div className="relative flex-1 min-h-0 bg-white rounded-3xl px-2.5 sm:px-6 py-2.5 sm:py-4 border-4 border-amber-300 shadow-xl flex flex-col items-center justify-between overflow-hidden">
          {/* ---------------- MODE 1: SEE THE BIG LETTER & GUESS NAME ---------------- */}
          {gameMode === 'see_letter' && targetLetter && (
            <>
              {/* Big Centered Focal Letter */}
              <div className="flex-1 min-h-0 w-full flex flex-col items-center justify-center gap-2 sm:gap-3">
                <button
                  type="button"
                  onClick={() => {
                    markInteraction();
                    speakLetterName(targetLetter.id);
                  }}
                  aria-label={tr(lang, 'הַשְׁמַע אֶת שֵׁם הָאוֹת', 'Hear letter name', 'Escuchar nombre de la letra')}
                  className={`relative w-[clamp(7.5rem,24dvh,12.5rem)] h-[clamp(7.5rem,24dvh,12.5rem)] rounded-3xl bg-gradient-to-tr ${targetLetter.color} flex items-center justify-center shadow-2xl border-4 border-white active:scale-95 transition-transform cursor-pointer group ${
                    showIdleNudge && !previewedOptionId ? 'animate-idle-spotlight' : ''
                  }`}
                >
                  <span className="text-[clamp(4.5rem,16dvh,8.5rem)] leading-none font-black text-white drop-shadow-lg select-none">
                    {targetLetter.letter}
                  </span>

                  {targetLetter.hasPupik && (
                    <span className="absolute top-2 end-2 bg-red-500 text-white px-2 py-0.5 rounded-full text-[11px] font-black animate-pupik border border-white">
                      {tr(lang, 'פּוּפִּיק!', 'Pupik!', '¡Pupik!')}
                    </span>
                  )}
                </button>

                {/* Compact Tap-to-Hear Prompt Pill */}
                <button
                  type="button"
                  onClick={repeatPrompt}
                  className="flex items-center gap-2 px-4 sm:px-5 py-1.5 sm:py-2 bg-amber-100 hover:bg-amber-200 text-amber-950 rounded-full font-black text-base sm:text-lg shadow-xs border-2 border-amber-300 transition btn-press-3d cursor-pointer"
                >
                  <Volume2 className="w-5 h-5 text-amber-700 flex-shrink-0" />
                  <span>{tr(lang, 'אֵיזוֹ אוֹת זֹאת?', 'What letter is this?', '¿Qué letra es esta?')}</span>
                </button>
              </div>

              {/* Reserved Fixed-Height Status / Hint Strip (prevents any layout shift) */}
              <div className="flex-shrink-0 h-8 sm:h-9 w-full flex items-center justify-center px-2">
                {helpHintActive && isCorrect === false ? (
                  <div className="px-3 py-1 bg-amber-100 border border-amber-400 rounded-full text-amber-950 font-extrabold text-xs sm:text-sm truncate max-w-full">
                    💡{' '}
                    {tr(
                      lang,
                      gender === 'girl'
                        ? 'הָאוֹת הַנְּכוֹנָה זוֹהֶרֶת בְּצָהֹב! לַחֲצִי עָלֶיהָ!'
                        : 'הָאוֹת הַנְּכוֹנָה זוֹהֶרֶת בְּצָהֹב! לְחַץ עָלֶיהָ!',
                      'The right answer is glowing in yellow — tap it!',
                      '¡La respuesta correcta brilla en amarillo — tócala!'
                    )}
                  </div>
                ) : showIdleNudge ? (
                  <div className="px-3 py-1 bg-amber-50 border border-amber-300 rounded-full text-amber-800 font-extrabold text-xs sm:text-sm truncate max-w-full">
                    ✨{' '}
                    {previewedOptionId
                      ? tr(lang, 'לַחֲצוּ עַל הַכַּפְתּוֹר הַיָּרֹק ✓ כְּדֵי לִבְחֹר!', 'Tap the green ✓ button to choose!', '¡Toca el botón verde ✓ para elegir!')
                      : tr(lang, 'לַחֲצוּ עַל כַּרְטִיס כְּדֵי לִשְׁמֹעַ 🔊', 'Tap any card below to listen 🔊', 'Toca una tarjeta para escuchar 🔊')}
                  </div>
                ) : (
                  <p className="text-[11px] sm:text-xs font-bold text-slate-400 truncate max-w-full">
                    {tr(
                      lang,
                      '1. לַחֲצוּ לִשְׁמֹעַ 🔊  •  2. לַחֲצוּ בְּחַר זֹאת ✓',
                      '1. Tap to hear 🔊  •  2. Tap Choose ✓',
                      '1. Toca para oír 🔊  •  2. Toca Elegir ✓'
                    )}
                  </p>
                )}
              </div>

              {/* 3 Answer Cards ALWAYS Side-by-Side (grid-cols-3) with Fixed Height */}
              <div className="grid grid-cols-3 gap-2 sm:gap-4 w-full max-w-2xl flex-shrink-0 pt-1">
                {options.map((opt) => {
                  const isSelected = selectedOptionId === opt.id;
                  const isTarget = opt.id === targetLetter.id;
                  const wasWrong = wrongOptionIds.includes(opt.id);
                  const isPreviewed = previewedOptionId === opt.id && isCorrect !== true;

                  let cardStyle = 'bg-slate-50 border-slate-200 text-slate-800 hover:bg-amber-50 hover:border-amber-400';

                  if (helpHintActive && isTarget) {
                    cardStyle = 'bg-amber-200 border-amber-500 text-slate-900 shadow-lg ring-4 ring-amber-400';
                  }

                  if (isSelected && isCorrect === true) {
                    cardStyle = 'bg-emerald-300 border-emerald-500 text-emerald-950 shadow-xl ring-4 ring-emerald-300';
                  } else if (wasWrong) {
                    cardStyle = 'bg-red-50 border-red-200 text-slate-400 opacity-45';
                  } else if (isPreviewed) {
                    cardStyle = 'bg-sky-50 border-sky-500 text-slate-900 shadow-lg ring-4 ring-sky-300';
                  }

                  return (
                    <div
                      key={opt.id}
                      data-option-id={opt.id}
                      role="button"
                      tabIndex={0}
                      onClick={() => handleSeeModeCardClick(opt)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' || e.key === ' ') {
                          e.preventDefault();
                          handleSeeModeCardClick(opt);
                        }
                      }}
                      className={`h-36 sm:h-44 md:h-48 p-2 sm:p-3.5 rounded-2xl sm:rounded-3xl border-4 flex flex-col items-center justify-between transition-colors duration-200 btn-press-3d relative cursor-pointer overflow-hidden ${cardStyle}`}
                    >
                      {/* Top Audio Pill */}
                      <div className="flex items-center gap-1 text-[10px] sm:text-xs font-extrabold text-indigo-600 bg-white/90 px-2 sm:px-2.5 py-0.5 rounded-full border border-indigo-200 shadow-2xs flex-shrink-0">
                        <Volume2 className={`w-3.5 h-3.5 flex-shrink-0 ${isPreviewed ? 'text-sky-600' : ''}`} />
                        <span className="hidden sm:inline">
                          {tr(lang, 'לִשְׁמֹעַ', 'Hear', 'Oír')}
                        </span>
                      </div>

                      {/* Center Letter Name & Sound */}
                      <div className="flex flex-col items-center justify-center min-h-0 text-center px-0.5">
                        <span className="text-xl sm:text-3xl md:text-4xl font-black leading-tight truncate max-w-full">
                          {tr(lang, opt.displayWithNikud, opt.nameEn, opt.nameEs || opt.nameEn)}
                        </span>
                        <span className="text-[10px] sm:text-xs text-slate-500 font-bold truncate max-w-full mt-0.5">
                          {tr(lang, opt.soundQuoteHe, opt.soundQuoteHe, opt.soundQuoteEs || opt.soundQuoteHe)}
                        </span>
                      </div>

                      {/* Reserved Fixed-Height Action Slot (zero vertical shift) */}
                      <div className="h-9 sm:h-10 w-full flex items-center justify-center flex-shrink-0">
                        {isPreviewed ? (
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              submitAnswer(opt);
                            }}
                            className={`w-full h-full px-1.5 sm:px-2.5 bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700 text-white font-black text-xs sm:text-sm rounded-xl sm:rounded-2xl shadow-md flex items-center justify-center gap-1 cursor-pointer ${
                              showIdleNudge ? 'animate-idle-spotlight' : ''
                            }`}
                          >
                            <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
                            <span className="truncate">{tr(lang, 'בְּחַר!', 'Choose!', '¡Elegir!')}</span>
                          </button>
                        ) : helpHintActive && isTarget ? (
                          <span className="w-full py-1 px-1.5 bg-amber-600 text-white rounded-xl text-[11px] sm:text-xs font-black text-center truncate animate-pulse">
                            {tr(lang, gender === 'girl' ? '👈 לַחֲצִי!' : '👈 לְחַץ!', '👈 Tap!', '👈 ¡Toca!')}
                          </span>
                        ) : (
                          <span className="text-[10px] sm:text-xs font-bold text-slate-400">
                            {wasWrong ? '✕' : '🔊'}
                          </span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </>
          )}

          {/* ---------------- MODE 2: HEAR NAME & TAP THE LETTER ---------------- */}
          {gameMode === 'hear_letter' && targetLetter && (
            <>
              <div className="flex-1 min-h-0 w-full flex flex-col items-center justify-center gap-3">
                <button
                  type="button"
                  onClick={repeatPrompt}
                  className={`flex items-center gap-3 px-7 sm:px-10 py-4 sm:py-6 bg-gradient-to-r from-amber-400 to-orange-400 hover:from-amber-500 hover:to-orange-500 text-slate-950 font-black text-3xl sm:text-5xl rounded-3xl shadow-xl border-4 border-amber-500 btn-press-3d cursor-pointer ${
                    showIdleNudge ? 'animate-idle-spotlight' : ''
                  }`}
                >
                  <Volume2 className="w-8 h-8 sm:w-10 sm:h-10 flex-shrink-0" />
                  <span>
                    {tr(
                      lang,
                      targetLetter.displayWithNikud,
                      targetLetter.nameEn,
                      targetLetter.nameEs || targetLetter.nameEn
                    )}
                  </span>
                </button>
              </div>

              {/* Reserved Fixed-Height Status / Hint Strip */}
              <div className="flex-shrink-0 h-8 sm:h-9 w-full flex items-center justify-center px-2">
                {helpHintActive && isCorrect === false ? (
                  <div className="px-3 py-1 bg-amber-100 border border-amber-400 rounded-full text-amber-950 font-extrabold text-xs sm:text-sm truncate max-w-full">
                    💡{' '}
                    {tr(
                      lang,
                      gender === 'girl'
                        ? 'הָאוֹת הַנְּכוֹנָה זוֹהֶרֶת בְּצָהֹב! לַחֲצִי עָלֶיהָ!'
                        : 'הָאוֹת הַנְּכוֹנָה זוֹהֶרֶת בְּצָהֹב! לְחַץ עָלֶיהָ!',
                      'The right letter is glowing in yellow — tap it!',
                      '¡La letra correcta brilla en amarillo — tócala!'
                    )}
                  </div>
                ) : (
                  <p className="text-xs font-bold text-slate-400 truncate max-w-full">
                    {tr(lang, 'הַקְשִׁיבוּ לַשֵּׁם וּבַחֲרוּ אֶת הָאוֹת הַנְּכוֹנָה!', 'Listen and tap the matching letter!', '¡Escucha y toca la letra correcta!')}
                  </p>
                )}
              </div>

              {/* 3 Big Letter Cards ALWAYS Side-by-Side with Fixed Height */}
              <div className="grid grid-cols-3 gap-2.5 sm:gap-5 w-full max-w-xl flex-shrink-0 pt-1">
                {options.map((opt) => {
                  const isSelected = selectedOptionId === opt.id;
                  const isTarget = opt.id === targetLetter.id;
                  const wasWrong = wrongOptionIds.includes(opt.id);

                  let cardStyle = 'bg-slate-50 border-slate-200 text-slate-800 hover:bg-amber-50 hover:border-amber-400';

                  if (helpHintActive && isTarget) {
                    cardStyle = 'bg-amber-300 border-amber-500 text-slate-900 shadow-lg ring-4 ring-amber-400';
                  }

                  if (isSelected && isCorrect === true) {
                    cardStyle = 'bg-emerald-300 border-emerald-500 text-emerald-950 shadow-xl ring-4 ring-emerald-300';
                  } else if (wasWrong) {
                    cardStyle = 'bg-red-50 border-red-200 text-slate-400 opacity-45';
                  }

                  return (
                    <button
                      key={opt.id}
                      type="button"
                      onClick={() => handleOptionClick(opt)}
                      className={`h-32 sm:h-40 md:h-44 rounded-2xl sm:rounded-3xl border-4 font-black text-6xl sm:text-7xl flex items-center justify-center transition-colors duration-200 btn-press-3d relative cursor-pointer ${cardStyle}`}
                    >
                      <span>{opt.letter}</span>
                      {helpHintActive && isTarget && (
                        <span className="absolute top-1.5 end-1.5 text-xl sm:text-2xl animate-bounce">
                          ⭐
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            </>
          )}

          {/* ---------------- FLOATING CELEBRATION OVERLAY (ZERO LAYOUT SHIFT) ---------------- */}
          {isCrazyCelebrating && (
            <div
              role="status"
              aria-live="polite"
              className="absolute inset-0 z-30 flex items-center justify-center p-4 bg-amber-900/10 backdrop-blur-[2px] pointer-events-none"
            >
              <div className="p-5 sm:p-6 bg-gradient-to-r from-amber-300 via-yellow-200 to-amber-300 border-4 border-amber-500 text-slate-900 rounded-3xl font-black text-lg sm:text-2xl flex flex-col items-center text-center gap-1.5 shadow-2xl max-w-md animate-pop-in">
                <span className="text-4xl sm:text-5xl">🎉 🥳 👑 🎈</span>
                <span>
                  {tr(
                    lang,
                    gender === 'girl'
                      ? `וָואוּ! יָדַעַתְּ שֶׁזֹּאת הָאוֹת ${targetLetter?.displayWithNikud}!`
                      : `וָואוּ! יָדַעְתָּ שֶׁזֹּאת הָאוֹת ${targetLetter?.displayWithNikud}!`,
                    `WOW! You knew it's ${targetLetter?.nameEn}!`,
                    `¡GUAU! ¡Sabías que es ${targetLetter?.nameEs || targetLetter?.nameEn}!`
                  )}
                </span>
                <span className="text-xs sm:text-sm font-bold text-amber-900">
                  {tr(
                    lang,
                    gender === 'girl'
                      ? 'אַתְּ אַלּוּפָה! הִנֵּה עוֹד כּוֹכָב! ⭐'
                      : 'אַתָּה אַלּוּף! הִנֵּה עוֹד כּוֹכָב! ⭐',
                    'You are a champion! +1 Star! ⭐',
                    '¡Eres genial! ¡+1 Estrella! ⭐'
                  )}
                </span>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* ---------------- COMPACT SETTINGS MODAL (Mode Switch, Instructions, Choose Letters) ---------------- */}
      {showSettings && (
        <div
          className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-3"
          onClick={() => setShowSettings(false)}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="quiz-settings-title"
            dir={isHe ? 'rtl' : 'ltr'}
            onClick={(e) => e.stopPropagation()}
            className="bg-white rounded-3xl border-4 border-amber-400 shadow-2xl w-full max-w-lg max-h-[86dvh] flex flex-col overflow-hidden animate-pop-in"
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between px-4 py-3 border-b-2 border-amber-100 bg-amber-50/70 flex-shrink-0">
              <h3 id="quiz-settings-title" className="text-base sm:text-lg font-black text-slate-800 flex items-center gap-2">
                <Settings className="w-5 h-5 text-amber-600" />
                <span>{tr(lang, 'הַגְדָּרוֹת מִשְׂחַק הָאוֹתִיּוֹת', 'Letter Quiz Settings', 'Ajustes del Juego de Letras')}</span>
              </h3>
              <button
                type="button"
                onClick={() => setShowSettings(false)}
                aria-label={tr(lang, 'סְגוֹר', 'Close', 'Cerrar')}
                className="w-9 h-9 rounded-xl bg-amber-200 hover:bg-amber-300 text-amber-950 flex items-center justify-center font-black cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Scrollable Body */}
            <div data-allow-scroll="true" className="p-4 flex flex-col gap-4 overflow-y-auto overscroll-contain touch-pan-y">
              {/* 1. Mode Switch */}
              <div className="flex flex-col gap-1.5">
                <span className="text-xs font-black text-slate-500 flex items-center gap-1.5">
                  <Zap className="w-4 h-4 text-amber-500" />
                  <span>{tr(lang, 'מַצָּב מִשְׂחָק:', 'Game Mode:', 'Modo de juego:')}</span>
                </span>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => switchGameMode('see_letter')}
                    className={`p-2.5 rounded-2xl border-2 font-black text-xs sm:text-sm transition cursor-pointer ${
                      gameMode === 'see_letter'
                        ? 'bg-amber-400 border-amber-600 text-slate-950 shadow-sm'
                        : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-amber-50'
                    }`}
                  >
                    {tr(
                      lang,
                      gender === 'girl' ? '👀 רוֹאָה אוֹת ← מְזַהָה שֵׁם' : '👀 רוֹאֶה אוֹת ← מְזַהֶה שֵׁם',
                      '👀 See Letter → Name',
                      '👀 Ver letra → Nombre'
                    )}
                  </button>
                  <button
                    type="button"
                    onClick={() => switchGameMode('hear_letter')}
                    className={`p-2.5 rounded-2xl border-2 font-black text-xs sm:text-sm transition cursor-pointer ${
                      gameMode === 'hear_letter'
                        ? 'bg-amber-400 border-amber-600 text-slate-950 shadow-sm'
                        : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-amber-50'
                    }`}
                  >
                    {tr(
                      lang,
                      gender === 'girl' ? '🔊 שׁוֹמַעַת שֵׁם ← בּוֹחֶרֶת אוֹת' : '🔊 שׁוֹמֵעַ שֵׁם ← בּוֹחֵר אוֹת',
                      '🔊 Hear Name → Letter',
                      '🔊 Oír nombre → Letra'
                    )}
                  </button>
                </div>
              </div>

              {/* 2. Hear Instructions */}
              <button
                type="button"
                onClick={() => {
                  playSound('pop');
                  if (soundEnabled) playPhraseAudio('inst_quiz', gender);
                }}
                className="w-full py-2.5 px-4 bg-indigo-100 hover:bg-indigo-200 text-indigo-900 border-2 border-indigo-300 rounded-2xl font-black text-xs sm:text-sm flex items-center justify-center gap-2 cursor-pointer"
              >
                <Volume2 className="w-4 h-4 text-indigo-700" />
                <span>
                  {tr(
                    lang,
                    gender === 'girl' ? '🔊 שִׁמְעִי הוֹרָאוֹת הַמִּשְׂחָק' : '🔊 שְׁמַע הוֹרָאוֹת הַמִּשְׂחָק',
                    '🔊 Hear Game Instructions',
                    '🔊 Escuchar instrucciones'
                  )}
                </span>
              </button>

              {/* 3. Choose Letters + Quick Presets */}
              <div className="flex flex-col gap-2">
                <span className="text-xs font-black text-slate-500">
                  {tr(
                    lang,
                    `בְּחִירַת אוֹתִיּוֹת לְתִרְגּוּל (${selectedLetterIds.length} נִבְחֲרוּ):`,
                    `Choose Letters to Practice (${selectedLetterIds.length} selected):`,
                    `Elige letras para practicar (${selectedLetterIds.length} elegidas):`
                  )}
                </span>

                <div className="flex flex-wrap gap-1.5">
                  <button
                    type="button"
                    onClick={() => setPreset('hay_yud')}
                    className="px-2.5 py-1.5 bg-rose-100 hover:bg-rose-200 text-rose-800 rounded-xl font-bold text-xs cursor-pointer"
                  >
                    ⭐ {tr(lang, 'הֵא וְיוּד', 'Hay & Yud', 'He y Yod')}
                  </button>
                  <button
                    type="button"
                    onClick={() => setPreset('first_five')}
                    className="px-2.5 py-1.5 bg-amber-100 hover:bg-amber-200 text-amber-800 rounded-xl font-bold text-xs cursor-pointer"
                  >
                    {tr(lang, 'א, בּ, ב, ג, ד, ה', 'First 6', 'Primeras 6')}
                  </button>
                  <button
                    type="button"
                    onClick={() => setPreset('pupik_dagesh')}
                    className="px-2.5 py-1.5 bg-blue-100 hover:bg-blue-200 text-blue-800 rounded-xl font-bold text-xs cursor-pointer"
                  >
                    {tr(lang, 'בּוּם וְרוּחַ', 'Pupik Letters', 'Letras Pupik')}
                  </button>
                  <button
                    type="button"
                    onClick={() => setPreset('all')}
                    className="px-2.5 py-1.5 bg-emerald-100 hover:bg-emerald-200 text-emerald-800 rounded-xl font-bold text-xs cursor-pointer"
                  >
                    👑 {tr(lang, 'כָּל הָאוֹתִיּוֹת', 'All 26', 'Las 26')}
                  </button>
                </div>

                <div className="flex flex-wrap gap-1.5 pt-1">
                  {LETTERS_DATA.map((item) => {
                    const isSelected = selectedLetterIds.includes(item.id);
                    return (
                      <button
                        key={item.id}
                        type="button"
                        onClick={() => toggleLetterSelection(item.id)}
                        className={`px-2.5 py-1.5 rounded-xl font-black text-sm flex items-center gap-1 border-2 transition cursor-pointer ${
                          isSelected
                            ? 'bg-amber-400 text-slate-900 border-amber-600 shadow-2xs'
                            : 'bg-slate-100 text-slate-400 border-slate-200 opacity-65'
                        }`}
                      >
                        <span className="text-lg">{item.letter}</span>
                        <span className="text-[11px] font-bold">{item.displayWithNikud}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="px-4 py-3 border-t-2 border-amber-100 bg-slate-50 flex-shrink-0">
              <button
                type="button"
                onClick={() => setShowSettings(false)}
                className="w-full py-2.5 bg-emerald-500 hover:bg-emerald-600 text-white font-black text-sm rounded-2xl shadow btn-press-3d cursor-pointer"
              >
                {tr(lang, 'חֲזָרָה לַמִּשְׂחָק ✓', 'Back to Quiz ✓', 'Volver al juego ✓')}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
