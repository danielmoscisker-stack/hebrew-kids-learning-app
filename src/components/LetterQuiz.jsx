import React, { useState, useEffect } from 'react';
import { Volume2, Sparkles, Star, Trophy, RefreshCw, CheckCircle2, Heart, Settings, Sliders, Play, Award, Zap } from 'lucide-react';
import { LETTERS_DATA } from '../data/curriculumData';
import { playSound, speakLetterName, playPhraseAudio, playWhereIsLetterAudio } from '../utils/audio';
import { triggerConfetti, triggerStarBurst } from '../utils/confetti';
import confetti from 'canvas-confetti';
import { useDeviceType } from '../utils/useDeviceType';
import { tr } from '../utils/i18n';

export default function LetterQuiz({ lang, soundEnabled, gender = 'boy', onEarnStar }) {
  const isHe = lang === 'he';
  const { isTouch } = useDeviceType();

  // Game Modes: 'see_letter' (kid sees the letter and identifies its name) or 'hear_letter' (kid hears name and finds letter)
  const [gameMode, setGameMode] = useState('see_letter');

  // Custom Letter Selection: user can select EXACTLY which letters appear
  const [selectedLetterIds, setSelectedLetterIds] = useState([
    'alef', 'bet_dagesh', 'vet', 'gimel', 'dalet', 'he', 'yod'
  ]);
  const [showSettings, setShowSettings] = useState(false);

  // Active round state
  const [targetLetter, setTargetLetter] = useState(null);
  const [options, setOptions] = useState([]);
  const [selectedOptionId, setSelectedOptionId] = useState(null);
  const [isCorrect, setIsCorrect] = useState(null);
  const [isCrazyCelebrating, setIsCrazyCelebrating] = useState(false);
  const [helpHintActive, setHelpHintActive] = useState(false);
  const [wrongOptionIds, setWrongOptionIds] = useState([]);
  const [previewedOptionId, setPreviewedOptionId] = useState(null);
  const [streak, setStreak] = useState(0);
  const [score, setScore] = useState(0);

  // Preset letter selection helpers
  const setPreset = (type) => {
    playSound('pop');
    switch (type) {
      case 'first_five':
        setSelectedLetterIds(['alef', 'bet_dagesh', 'vet', 'gimel', 'dalet', 'he']);
        break;
      case 'hay_yud':
        setSelectedLetterIds(['he', 'yod', 'alef', 'bet_dagesh', 'dalet']);
        break;
      case 'pupik_dagesh':
        setSelectedLetterIds(['bet_dagesh', 'vet', 'kaf_dagesh', 'khaf', 'pe_dagesh', 'fe', 'shin', 'sin']);
        break;
      case 'all':
        setSelectedLetterIds(LETTERS_DATA.map((l) => l.id));
        break;
      default:
        break;
    }
    setShowSettings(false);
  };

  const toggleLetterSelection = (id) => {
    playSound('pop');
    if (selectedLetterIds.includes(id)) {
      if (selectedLetterIds.length <= 2) return; // keep at least 2 letters
      setSelectedLetterIds(selectedLetterIds.filter((item) => item !== id));
    } else {
      setSelectedLetterIds([...selectedLetterIds, id]);
    }
  };

  // Start a fresh round based on selected letters pool
  const startNewRound = () => {
    const activePool = LETTERS_DATA.filter((l) => selectedLetterIds.includes(l.id));
    if (activePool.length === 0) return;

    // Pick a target letter
    const target = activePool[Math.floor(Math.random() * activePool.length)];
    setTargetLetter(target);

    // Pick 2 distractors from active pool or all letters
    const otherLetters = LETTERS_DATA.filter((l) => l.id !== target.id)
      .sort(() => 0.5 - Math.random())
      .slice(0, 2);

    const roundOptions = [target, ...otherLetters].sort(() => 0.5 - Math.random());
    setOptions(roundOptions);

    setSelectedOptionId(null);
    setPreviewedOptionId(null);
    setIsCorrect(null);
    setIsCrazyCelebrating(false);
    setHelpHintActive(false);
    setWrongOptionIds([]);

    // Prompt question audio out loud for 4-year-olds who cannot read text
    if (soundEnabled) {
      setTimeout(() => {
        if (gameMode === 'see_letter') {
          const phraseId = isTouch ? 'inst_quiz_cards_touch' : 'inst_quiz_cards_mouse';
          playPhraseAudio(phraseId, gender);
        } else {
          speakLetterName(target.id);
        }
      }, 350);
    }
  };

  useEffect(() => {
    startNewRound();
  }, [selectedLetterIds, gameMode]);

  // GO CRAZY celebration function!
  const triggerGoCrazy = (letter) => {
    setIsCrazyCelebrating(true);
    playSound('win');

    // Massive screen-filling double confetti cannon
    try {
      confetti({
        particleCount: 120,
        spread: 90,
        origin: { x: 0.2, y: 0.6 },
        colors: ['#F59E0B', '#EF4444', '#10B981', '#3B82F6', '#EC4899']
      });
      confetti({
        particleCount: 120,
        spread: 90,
        origin: { x: 0.8, y: 0.6 },
        colors: ['#FBBF24', '#8B5CF6', '#06B6D4', '#F43F5E', '#10B981']
      });
    } catch (e) {
      console.log(e);
    }

    if (soundEnabled) {
      setTimeout(() => {
        playPhraseAudio('crazy_correct', gender);
      }, 300);
    }

    // Auto next round after crazy celebration
    setTimeout(() => {
      startNewRound();
    }, 2500);
  };

  const submitAnswer = (option) => {
    if (isCorrect === true) return; // already solved
    setSelectedOptionId(option.id);

    if (option.id === targetLetter.id) {
      // CORRECT! GO CRAZY!
      setIsCorrect(true);
      setScore((s) => s + 1);
      setStreak((st) => st + 1);
      onEarnStar(1);
      triggerGoCrazy(option);
    } else {
      // WRONG: Help them get it correct!
      setIsCorrect(false);
      playSound('whoosh');
      setStreak(0);
      setWrongOptionIds((prev) => [...prev, option.id]);
      setPreviewedOptionId(null);
      setHelpHintActive(true);

      // Speak the letter they clicked so they learn, then offer guidance
      if (soundEnabled) {
        speakLetterName(option.id);
        setTimeout(() => {
          playPhraseAudio('helper_hint', gender);
        }, 800);
      }
    }
  };

  const handleSeeModeCardClick = (option) => {
    if (isCorrect === true || wrongOptionIds.includes(option.id)) return;
    // First click on a card: hear it & show the big green "Choose!" button
    if (previewedOptionId !== option.id) {
      setPreviewedOptionId(option.id);
      playSound('pop');
      if (soundEnabled) {
        speakLetterName(option.id);
      }
      return;
    }
    // Second click on the same highlighted card (or clicking its green button): confirm answer
    submitAnswer(option);
  };

  const handleOptionClick = (option) => {
    submitAnswer(option);
  };

  const playCardsInstruction = () => {
    playSound('pop');
    if (soundEnabled) {
      const phraseId = isTouch ? 'inst_quiz_cards_touch' : 'inst_quiz_cards_mouse';
      playPhraseAudio(phraseId, gender);
    }
  };

  const repeatPrompt = () => {
    if (!targetLetter) return;
    playSound('pop');
    if (gameMode === 'see_letter') {
      playCardsInstruction();
    } else {
      speakLetterName(targetLetter.id);
    }
  };

  return (
    <div
      className="max-w-4xl mx-auto px-4 py-6 flex flex-col gap-6"
      dir={isHe ? 'rtl' : 'ltr'}
    >
      {/* Top Header Banner with Mode and Settings */}
      <div className="bg-gradient-to-r from-amber-400 via-orange-500 to-pink-500 rounded-3xl p-6 text-white text-center shadow-lg relative overflow-hidden">
        <span className="text-5xl animate-bounce-gentle">🎯 🔤 🌟</span>
        <h2 className="text-2xl md:text-3xl font-black mt-2">
          {tr(lang, 'מִשְׂחַק זִהוּי אוֹתִיּוֹת: אֵיזוֹ אוֹת זֹאת?', 'What Letter is This? Letter Mastery Game', '¿Qué letra es esta? Juego de letras')}
        </h2>
        <p className="text-amber-100 text-sm md:text-base mt-1 font-medium">
          {tr(
            lang,
            'רוֹאִים אֶת הָאוֹת, מְגַלִּים אֶת הַשֵּׁם שֶׁלָּהּ, וְחוֹגְגִים עִם הֲמוֹן קוֹנְפֶטִי!',
            'See the big letter, identify its name, and celebrate with crazy confetti!',
            '¡Mira la letra grande, descubre su nombre y celebra con mucho confeti!'
          )}
        </p>

        {/* Top Controls: Choose Letters & Switch Modes */}
        <div className="flex flex-wrap items-center justify-center gap-2 mt-4">
          <button
            onClick={() => playPhraseAudio('inst_quiz', gender)}
            className="flex items-center gap-1.5 px-4 py-2 bg-white/20 hover:bg-white/30 rounded-2xl font-bold text-xs md:text-sm transition-all btn-press-3d border border-white/40"
            title={tr(lang, gender === 'girl' ? 'הַשְׁמִיעִי הוֹרָאוֹת' : 'הַשְׁמַע הוֹרָאוֹת', 'Hear Instructions', 'Escuchar instrucciones')}
          >
            <Volume2 className="w-4 h-4 text-amber-200 animate-pulse" />
            <span>
              {tr(
                lang,
                gender === 'girl' ? '🔊 שִׁמְעִי הוֹרָאוֹת' : '🔊 שְׁמַע הוֹרָאוֹת',
                '🔊 Hear Instructions',
                '🔊 Escuchar instrucciones'
              )}
            </span>
          </button>

          <button
            onClick={() => {
              playSound('pop');
              setGameMode(gameMode === 'see_letter' ? 'hear_letter' : 'see_letter');
            }}
            className="flex items-center gap-1.5 px-4 py-2 bg-white/20 hover:bg-white/30 rounded-2xl font-bold text-xs md:text-sm transition-all btn-press-3d border border-white/40"
          >
            <Zap className="w-4 h-4 text-amber-200" />
            <span>
              {gameMode === 'see_letter'
                ? tr(
                    lang,
                    gender === 'girl' ? 'מַצָּב: רוֹאָה אוֹת וּמְזַהָה שֵׁם' : 'מַצָּב: רוֹאֶה אוֹת וּמְזַהֶה שֵׁם',
                    'Mode: See Letter & Guess Name',
                    'Modo: Ver letra y adivinar nombre'
                  )
                : tr(
                    lang,
                    gender === 'girl' ? 'מַצָּב: שׁוֹמַעַת שֵׁם וּמַצְבִּיעָה' : 'מַצָּב: שׁוֹמֵעַ שֵׁם וּמַצְבִּיעַ',
                    'Mode: Hear Name & Tap Letter',
                    'Modo: Escuchar nombre y tocar letra'
                  )}
            </span>
          </button>

          <button
            onClick={() => {
              playSound('pop');
              setShowSettings(!showSettings);
            }}
            className="flex items-center gap-1.5 px-4 py-2 bg-amber-200 text-slate-900 rounded-2xl font-extrabold text-xs md:text-sm shadow transition-all btn-press-3d"
          >
            <Sliders className="w-4 h-4 text-slate-900" />
            <span>
              {tr(
                lang,
                `בְּחִירַת אוֹתִיּוֹת (${selectedLetterIds.length})`,
                `Choose Letters (${selectedLetterIds.length})`,
                `Elegir letras (${selectedLetterIds.length})`
              )}
            </span>
          </button>
        </div>
      </div>

      {/* LETTER SELECTION DRAWER: Let parent/kid choose which letters appear */}
      {showSettings && (
        <div className="bg-white rounded-3xl p-6 border-4 border-amber-400 shadow-xl flex flex-col gap-4 animate-in fade-in duration-200">
          <div className="flex items-center justify-between">
            <h3 className="text-lg md:text-xl font-black text-slate-800 flex items-center gap-2">
              <Settings className="w-6 h-6 text-amber-500" />
              <span>{tr(lang, 'בַּחֲרוּ אֵלּוּ אוֹתִיּוֹת יִהְיוּ בַּמִּשְׂחָק:', 'Select Which Letters to Practice:', 'Elige qué letras practicar:')}</span>
            </h3>
            <button
              onClick={() => setShowSettings(false)}
              className="text-xs font-bold text-amber-700 bg-amber-100 hover:bg-amber-200 px-3 py-1.5 rounded-xl"
            >
              {tr(lang, 'סְגוֹר ✕', 'Close ✕', 'Cerrar ✕')}
            </button>
          </div>

          {/* Quick Presets */}
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setPreset('hay_yud')}
              className="px-3 py-1.5 bg-rose-100 hover:bg-rose-200 text-rose-800 rounded-xl font-bold text-xs"
            >
              ⭐ {tr(lang, 'הֵא וְיוּד (וְאוֹתִיּוֹת רִאשׁוֹנוֹת)', 'Practice Hay & Yud', 'Practicar He y Yod')}
            </button>
            <button
              onClick={() => setPreset('first_five')}
              className="px-3 py-1.5 bg-amber-100 hover:bg-amber-200 text-amber-800 rounded-xl font-bold text-xs"
            >
              {tr(lang, 'א, בּ, ב, ג, ד, ה', 'First 6 Letters', 'Primeras 6 letras')}
            </button>
            <button
              onClick={() => setPreset('pupik_dagesh')}
              className="px-3 py-1.5 bg-blue-100 hover:bg-blue-200 text-blue-800 rounded-xl font-bold text-xs"
            >
              {tr(lang, 'בּוּם וְרוּחַ (בּ/ב, כּ/כ, פּ/פ)', 'Letters with Pupik', 'Letras con Pupik')}
            </button>
            <button
              onClick={() => setPreset('all')}
              className="px-3 py-1.5 bg-emerald-100 hover:bg-emerald-200 text-emerald-800 rounded-xl font-bold text-xs"
            >
              👑 {tr(lang, 'בְּחַר אֶת כָּל הָאוֹתִיּוֹת', 'Select All 26', 'Elegir las 26')}
            </button>
          </div>

          {/* Individual Letter Pills */}
          <div className="flex flex-wrap gap-2 max-h-48 overflow-y-auto p-1">
            {LETTERS_DATA.map((item) => {
              const isSelected = selectedLetterIds.includes(item.id);
              return (
                <button
                  key={item.id}
                  onClick={() => toggleLetterSelection(item.id)}
                  className={`px-3 py-2 rounded-xl font-black text-base flex items-center gap-1.5 border-2 transition-all ${
                    isSelected
                      ? 'bg-amber-400 text-slate-900 border-amber-600 shadow-sm scale-105'
                      : 'bg-slate-100 text-slate-400 border-slate-200 opacity-60'
                  }`}
                >
                  <span className="text-xl">{item.letter}</span>
                  <span className="text-xs font-bold">{item.displayWithNikud}</span>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Main Game Stage */}
      <div className="bg-white rounded-3xl p-6 md:p-8 border-4 border-amber-300 shadow-xl flex flex-col items-center text-center relative overflow-hidden">
        {/* Score & Streak Header */}
        <div className="w-full flex items-center justify-between mb-4 px-2" dir={isHe ? 'rtl' : 'ltr'}>
          <div className="flex items-center gap-1.5 text-amber-700 font-extrabold text-sm md:text-base">
            <Trophy className="w-5 h-5 text-amber-500" />
            <span>{tr(lang, 'נְקֻדּוֹת:', 'Score:', 'Puntos:')}</span>
            <bdi className="font-black text-amber-900">{score}</bdi>
          </div>

          <div className="flex items-center gap-1.5 bg-pink-100 text-pink-700 px-3 py-1.5 rounded-full font-black text-xs md:text-sm">
            <span>🔥</span>
            <span>{tr(lang, 'רֶצֶף נִצְחוֹנוֹת:', 'Streak:', 'Racha:')}</span>
            <bdi className="font-black text-pink-900">{streak}</bdi>
          </div>
        </div>

        {/* ---------------- MODE 1: SEE THE BIG LETTER & GUESS NAME ---------------- */}
        {gameMode === 'see_letter' && targetLetter && (
          <div className="w-full flex flex-col items-center">
            {/* The Big Center Letter the child sees */}
            <div className="relative my-2">
              <div
                onClick={() => speakLetterName(targetLetter.id)}
                className={`w-40 h-40 md:w-52 md:h-52 rounded-3xl bg-gradient-to-tr ${targetLetter.color} flex items-center justify-center shadow-2xl border-4 border-white transform hover:scale-105 active:scale-95 transition-all cursor-pointer animate-float group`}
              >
                <span className="text-9xl md:text-[140px] font-black text-white drop-shadow-lg select-none group-hover:animate-wiggle">
                  {targetLetter.letter}
                </span>

                {/* Pupik Indicator if letter has pupik */}
                {targetLetter.hasPupik && (
                  <div className="absolute top-2 right-2 bg-red-500 text-white px-2 py-0.5 rounded-full text-xs font-black animate-pupik border border-white">
                    {tr(lang, 'פּוּפִּיק!', 'Pupik!', '¡Pupik!')}
                  </div>
                )}
              </div>
            </div>

            {/* Prompt Question */}
            <div className="flex items-center gap-2 mt-4 mb-6">
              <button
                onClick={repeatPrompt}
                className="flex items-center gap-2 px-5 py-2.5 bg-amber-100 hover:bg-amber-200 text-amber-900 rounded-full font-black text-lg md:text-xl shadow-sm transition btn-press-3d"
              >
                <Volume2 className="w-6 h-6 text-amber-700 animate-pulse" />
                <span>{tr(lang, 'אֵיזוֹ אוֹת זֹאת?', 'What letter is this?', '¿Qué letra es esta?')}</span>
              </button>
            </div>

            {/* Friendly 2-step guidance for 4-year-olds */}
            <button
              type="button"
              onClick={playCardsInstruction}
              className="bg-amber-100/90 hover:bg-amber-200/90 border-2 border-amber-300 text-amber-900 px-4 py-2.5 rounded-2xl mb-4 text-xs md:text-sm font-black flex items-center gap-2.5 shadow-sm btn-press-3d cursor-pointer transition-all"
              title={tr(lang, 'הַשְׁמַע הוֹרָאוֹת', 'Hear Instructions', 'Escuchar instrucciones')}
            >
              <Volume2 className="w-5 h-5 text-amber-700 animate-pulse flex-shrink-0" />
              <span>
                {tr(
                  lang,
                  '1. לַחֲצוּ עַל כַּרְטִיס כְּדֵי לִשְׁמֹעַ 🔊  •  2. לַחֲצוּ עַל הַכַּפְתּוֹר הַיָּרֹק ✓ כְּדֵי לִבְחֹר!',
                  '1. Tap a card to hear it 🔊  •  2. Tap the green ✓ button to choose!',
                  '1. Toca una tarjeta para escucharla 🔊  •  2. ¡Toca el botón verde ✓ para elegir!'
                )}
              </span>
            </button>

            {/* Answer Options (Step 1: Tap card to hear, Step 2: Tap green Choose button or tap card again) */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 md:gap-4 w-full max-w-xl mb-4">
              {options.map((opt) => {
                const isSelected = selectedOptionId === opt.id;
                const isTarget = opt.id === targetLetter.id;
                const wasWrong = wrongOptionIds.includes(opt.id);
                const isPreviewed = previewedOptionId === opt.id && isCorrect !== true;

                let cardStyle = 'bg-slate-50 border-slate-200 text-slate-800 hover:bg-amber-50 hover:border-amber-400';

                // Golden Glowing Aura if helping the child!
                if (helpHintActive && isTarget) {
                  cardStyle = 'bg-amber-200 border-amber-500 text-slate-900 scale-105 shadow-xl ring-4 ring-amber-400 animate-bounce-gentle';
                }

                if (isSelected && isCorrect === true) {
                  cardStyle = 'bg-emerald-300 border-emerald-500 text-emerald-950 scale-105 shadow-2xl ring-4 ring-emerald-300';
                } else if (wasWrong) {
                  cardStyle = 'bg-red-50 border-red-200 text-slate-400 opacity-50';
                } else if (isPreviewed) {
                  cardStyle = 'bg-sky-50 border-sky-500 text-slate-900 scale-105 shadow-xl ring-4 ring-sky-300';
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
                    className={`p-4 rounded-3xl border-4 flex flex-col items-center justify-between gap-2 transition-all duration-200 btn-press-3d relative cursor-pointer ${cardStyle}`}
                  >
                    <div className="flex items-center gap-1.5 text-xs font-extrabold text-indigo-600 bg-white/90 px-3 py-1 rounded-full border border-indigo-200 shadow-sm">
                      <Volume2 className={`w-4 h-4 ${isPreviewed ? 'animate-bounce text-sky-600' : ''}`} />
                      <span>{tr(lang, 'לַחֲצוּ לִשְׁמֹעַ', 'Tap to hear', 'Toca para oír')}</span>
                    </div>

                    <span className="text-3xl md:text-4xl font-black mt-1">
                      {tr(lang, opt.displayWithNikud, opt.nameEn, opt.nameEs || opt.nameEn)}
                    </span>
                    <span className="text-xs text-slate-500 font-bold">
                      {tr(lang, opt.soundQuoteHe, opt.soundQuoteHe, opt.soundQuoteEs || opt.soundQuoteHe)}
                    </span>

                    {/* Big obvious Green Confirm button once card has been heard */}
                    {isPreviewed ? (
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          submitAnswer(opt);
                        }}
                        className="mt-1 w-full py-2.5 px-3 bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700 text-white font-black text-sm md:text-base rounded-2xl shadow-md flex items-center justify-center gap-1.5 animate-pop-in cursor-pointer"
                      >
                        <CheckCircle2 className="w-5 h-5" />
                        <span>{tr(lang, 'בְּחַר זֹאת!', 'Choose this!', '¡Elegir esta!')}</span>
                      </button>
                    ) : (
                      helpHintActive &&
                      isTarget && (
                        <span className="mt-1 px-2.5 py-1 bg-amber-600 text-white rounded-full text-xs font-black animate-pulse">
                          {tr(
                            lang,
                            gender === 'girl' ? '👈 לַחְצִי כָּאן!' : '👈 לְחַץ כָּאן!',
                            '👈 Tap here!',
                            '👈 ¡Toca aquí!'
                          )}
                        </span>
                      )
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ---------------- MODE 2: HEAR NAME & TAP THE LETTER ---------------- */}
        {gameMode === 'hear_letter' && targetLetter && (
          <div className="w-full flex flex-col items-center">
            {/* Audio question button - speaks letter name directly */}
            <button
              onClick={repeatPrompt}
              className="flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-amber-400 to-orange-400 hover:from-amber-500 hover:to-orange-500 text-slate-900 font-black text-3xl md:text-4xl rounded-3xl shadow-lg border-4 border-amber-500 btn-press-3d my-4 animate-pulse"
            >
              <Volume2 className="w-8 h-8" />
              <span>
                {tr(
                  lang,
                  targetLetter.displayWithNikud,
                  targetLetter.nameEn,
                  targetLetter.nameEs || targetLetter.nameEn
                )}
              </span>
            </button>

            {/* 3 Big Letter Cards */}
            <div className="grid grid-cols-3 gap-4 md:gap-6 w-full max-w-lg mt-4 mb-4">
              {options.map((opt) => {
                const isSelected = selectedOptionId === opt.id;
                const isTarget = opt.id === targetLetter.id;
                const wasWrong = wrongOptionIds.includes(opt.id);

                let cardStyle = 'bg-slate-50 border-slate-200 text-slate-800 hover:bg-amber-50';

                if (helpHintActive && isTarget) {
                  cardStyle = 'bg-amber-300 border-amber-500 text-slate-900 scale-105 shadow-xl ring-4 ring-amber-400 animate-bounce-gentle';
                }

                if (isSelected && isCorrect === true) {
                  cardStyle = 'bg-emerald-300 border-emerald-500 text-emerald-950 scale-110 shadow-2xl ring-4 ring-emerald-300';
                } else if (wasWrong) {
                  cardStyle = 'bg-red-50 border-red-200 text-slate-400 opacity-50';
                }

                return (
                  <button
                    key={opt.id}
                    onClick={() => handleOptionClick(opt)}
                    className={`h-36 md:h-44 rounded-3xl border-4 font-black text-6xl md:text-7xl flex items-center justify-center transition-all duration-200 btn-press-3d relative ${cardStyle}`}
                  >
                    <span>{opt.letter}</span>
                    {helpHintActive && isTarget && (
                      <span className="absolute -top-2 -right-2 text-2xl animate-bounce">
                        ⭐
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* ---------------- CRAZY CELEBRATION OVERLAY ---------------- */}
        {isCrazyCelebrating && (
          <div className="mt-4 p-4 bg-gradient-to-r from-amber-300 via-yellow-200 to-amber-300 border-4 border-amber-500 text-slate-900 rounded-3xl font-black text-xl md:text-2xl flex flex-col items-center gap-1 shadow-2xl animate-bounce">
            <span className="text-4xl">🎉 🥳 👑 🎈</span>
            <span>
              {tr(
                lang,
                gender === 'girl'
                  ? `וָואוּ! כָּל הַכָּבוֹד! יָדַעַתְּ שֶׁזֹּאת הָאוֹת ${targetLetter?.displayWithNikud}!`
                  : `וָואוּ! כָּל הַכָּבוֹד! יָדַעְתָּ שֶׁזֹּאת הָאוֹת ${targetLetter?.displayWithNikud}!`,
                `WOW! AMAZING! You knew that this is ${targetLetter?.nameEn}!`,
                `¡GUAU! ¡INCREÍBLE! ¡Sabías que es ${targetLetter?.nameEs || targetLetter?.nameEn}!`
              )}
            </span>
            <span className="text-sm font-bold text-amber-800">
              {tr(
                lang,
                gender === 'girl'
                  ? 'אַתְּ אַלּוּפַת הָעוֹלָם! הִנֵּה עוֹד כּוֹכָב! ⭐'
                  : 'אַתָּה אַלּוּף הָעוֹלָם! הִנֵּה עוֹד כּוֹכָב! ⭐',
                'You are a champion! Here is another star! ⭐',
                '¡Eres una estrella campeona! ¡Aquí tienes otra estrella! ⭐'
              )}
            </span>
          </div>
        )}

        {/* Helper Guidance Message when wrong */}
        {helpHintActive && isCorrect === false && (
          <div className="mt-3 p-3 bg-amber-100 border-2 border-amber-400 rounded-2xl text-amber-900 font-extrabold text-sm flex items-center gap-2">
            <span>💡 {tr(
              lang,
              gender === 'girl'
                ? 'לֹא נוֹרָא! עָזַרְנוּ לָךְ: הָאוֹת הַנְּכוֹנָה זוֹהֶרֶת עַכְשָׁו בְּצָהֹב! נַסִּי לִלְחֹץ עָלֶיהָ!'
                : 'לֹא נוֹרָא! עָזַרְנוּ לְךָ: הָאוֹת הַנְּכוֹנָה זוֹהֶרֶת עַכְשָׁו בְּצָהֹב! נַסֵּה לִלְחֹץ עָלֶיהָ!',
              'No problem! Here is a hint: the right answer is glowing in yellow! Tap it!',
              '¡No pasa nada! Aquí tienes una pista: ¡la respuesta correcta brilla en amarillo! ¡Tócala!'
            )}</span>
          </div>
        )}

        {/* Next Question Skip button */}
        <button
          onClick={startNewRound}
          className="mt-6 flex items-center gap-1.5 px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-2xl text-xs transition"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>{tr(lang, 'שְׁאֵלָה הַבָּאָה ⬅️', 'Next Question ➡️', 'Siguiente pregunta ➡️')}</span>
        </button>
      </div>
    </div>
  );
}
