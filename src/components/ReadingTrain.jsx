import React, { useState, useRef, useEffect } from 'react';
import { Star, Play, CheckCircle2, Trophy, Sparkles, Volume2 } from 'lucide-react';
import { READING_TRAIN_DATA, LETTER_NAMES_DICT } from '../data/curriculumData';
import { playSound, speakLetterName, playPhraseAudio } from '../utils/audio';
import { triggerConfetti, triggerStarBurst } from '../utils/confetti';
import { useDeviceType } from '../utils/useDeviceType';
import { tr } from '../utils/i18n';

export default function ReadingTrain({ lang, soundEnabled, gender = 'boy', onEarnStar }) {
  const [activeLevelIdx, setActiveLevelIdx] = useState(0);
  const [completedRows, setCompletedRows] = useState({});
  const [activeRowIdx, setActiveRowIdx] = useState(0);
  const [activeLetterIdx, setActiveLetterIdx] = useState(null);
  const lastHoverLetterTime = useRef(0);
  const rowIntervalRef = useRef(null);
  const { isTouch } = useDeviceType();

  const clearRowInterval = () => {
    if (rowIntervalRef.current) {
      clearInterval(rowIntervalRef.current);
      rowIntervalRef.current = null;
    }
  };

  useEffect(() => {
    return () => clearRowInterval();
  }, []);

  const isHe = lang === 'he';
  const currentLevel = READING_TRAIN_DATA[activeLevelIdx];

  const handleWagonHover = (char) => {
    if (isTouch || !soundEnabled) return;
    const now = Date.now();
    if (now - lastHoverLetterTime.current < 450) return;
    lastHoverLetterTime.current = now;
    speakLetterName(char);
  };

  const handleLevelChange = (idx) => {
    clearRowInterval();
    playSound('pop');
    setActiveLevelIdx(idx);
    setActiveRowIdx(0);
    setActiveLetterIdx(null);
  };

  const handleLetterClick = (rowIdx, letterIdx, letter) => {
    playSound('train');
    setActiveRowIdx(rowIdx);
    setActiveLetterIdx(letterIdx);

    // Speak letter name cleanly with natural Israeli woman's voice
    if (soundEnabled) {
      speakLetterName(letter);
    }

    // Check if row completed
    const rowKey = `${activeLevelIdx}-${rowIdx}`;
    const currentRowLetters = currentLevel.rows[rowIdx].letters;
    
    // If child taps the last letter in row, complete it!
    if (letterIdx === currentRowLetters.length - 1 && !completedRows[rowKey]) {
      setCompletedRows((prev) => ({ ...prev, [rowKey]: true }));
      playSound('star');
      triggerStarBurst();
      onEarnStar();
      if (soundEnabled) {
        setTimeout(() => {
          playPhraseAudio('train_star', gender);
        }, 500);
      }
    }
  };

  const playEntireRow = (rowIdx) => {
    clearRowInterval();
    playSound('train');
    setActiveRowIdx(rowIdx);
    const letters = currentLevel.rows[rowIdx].letters;
    let i = 0;

    rowIntervalRef.current = setInterval(() => {
      if (i < letters.length) {
        const char = letters[i];
        setActiveLetterIdx(i);
        if (soundEnabled) {
          speakLetterName(char);
        }
        playSound('pop');
        i++;
      } else {
        clearRowInterval();
        setActiveLetterIdx(null);
        const rowKey = `${activeLevelIdx}-${rowIdx}`;
        if (!completedRows[rowKey]) {
          setCompletedRows((prev) => ({ ...prev, [rowKey]: true }));
          playSound('win');
          triggerConfetti();
          onEarnStar();
          if (soundEnabled) {
            playPhraseAudio('great_job', gender);
          }
        }
      }
    }, 850);
  };

  return (
    <div
      className="max-w-4xl mx-auto px-4 py-6 flex flex-col gap-6"
      dir={isHe ? 'rtl' : 'ltr'}
    >
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-blue-500 to-indigo-600 rounded-3xl p-6 text-white text-center shadow-lg relative overflow-hidden">
        <div className="text-4xl mb-2 animate-bounce-gentle">🚂 💨</div>
        <h2 className="text-2xl md:text-3xl font-black">
          {tr(lang, currentLevel.titleHe, currentLevel.titleEn, currentLevel.titleEs || currentLevel.titleEn)}
        </h2>
        <p className="text-blue-100 text-sm md:text-base mt-2 font-medium">
          {tr(lang, currentLevel.subtitleHe, currentLevel.subtitleEn, currentLevel.subtitleEs || currentLevel.subtitleEn)}
        </p>

        {/* Level Selector Tabs & Hear Instructions */}
        <div className="flex flex-wrap justify-center items-center gap-2 mt-4">
          <button
            onClick={() => {
              playSound('pop');
              if (soundEnabled) {
                playPhraseAudio('inst_train', gender);
              }
            }}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-white/20 hover:bg-white/30 rounded-2xl font-bold text-xs text-white"
            title={tr(lang, gender === 'girl' ? 'הַשְׁמִיעִי הוֹרָאוֹת' : 'הַשְׁמַע הוֹרָאוֹת', 'Hear Instructions', 'Escuchar instrucciones')}
          >
            <Volume2 className="w-4 h-4 text-amber-300" />
            <span>{tr(lang, gender === 'girl' ? '🔊 שִׁמְעִי הוֹרָאוֹת' : '🔊 שְׁמַע הוֹרָאוֹת', '🔊 Hear Instructions', '🔊 Escuchar instrucciones')}</span>
          </button>

          {READING_TRAIN_DATA.map((lvl, idx) => (
            <button
              key={lvl.level}
              onClick={() => handleLevelChange(idx)}
              className={`px-4 py-2 rounded-2xl font-bold text-sm md:text-base transition-all btn-press-3d ${
                activeLevelIdx === idx
                  ? 'bg-amber-400 text-slate-900 border-2 border-amber-500 shadow-md scale-105'
                  : 'bg-white/20 text-white hover:bg-white/30'
              }`}
            >
              {tr(lang, `שָׁלָב ${lvl.level}`, `Stage ${lvl.level}`, `Etapa ${lvl.level}`)}
            </button>
          ))}
        </div>
      </div>

      {/* Train Track Rows */}
      <div className="flex flex-col gap-3">
        {currentLevel.rows.map((row, rowIdx) => {
          const rowKey = `${activeLevelIdx}-${rowIdx}`;
          const isCompleted = completedRows[rowKey];
          const isRowActive = activeRowIdx === rowIdx;

          return (
            <div
              key={rowIdx}
              className={`bg-white rounded-3xl p-4 border-2 transition-all duration-200 shadow-sm flex flex-col md:flex-row items-center justify-between gap-3 ${
                isRowActive
                  ? 'border-indigo-400 ring-2 ring-indigo-200'
                  : 'border-slate-200 hover:border-blue-300'
              }`}
            >
              {/* Row Label & Play Button */}
              <div className="flex items-center gap-3 w-full md:w-auto justify-between md:justify-start">
                <div className="flex items-center gap-2">
                  <span className="w-8 h-8 rounded-full bg-indigo-100 text-indigo-700 font-bold flex items-center justify-center text-sm">
                    {rowIdx + 1}
                  </span>
                  <span className="font-extrabold text-slate-800 text-sm md:text-base">
                    {tr(lang, row.labelHe, row.labelEn, row.labelEs || row.labelEn)}
                  </span>
                </div>

                <button
                  onClick={() => playEntireRow(rowIdx)}
                  className="flex items-center gap-1 px-3 py-1 bg-emerald-500 hover:bg-emerald-600 text-white font-bold rounded-xl text-xs shadow btn-press-3d"
                  title={tr(lang, 'השמע שורה', 'Play row', 'Reproducir fila')}
                >
                  <Play className="w-3.5 h-3.5 fill-white" />
                  <span>{tr(lang, 'הַשְׁמַע', 'Play', 'Escuchar')}</span>
                </button>
              </div>

              {/* Train Wagon Letters (Strict Right-to-Left order in Hebrew) */}
              <div
                className="flex items-center gap-2 py-3 overflow-visible no-scrollbar justify-center flex-wrap sm:flex-nowrap"
                dir="rtl"
              >
                {row.letters.map((char, charIdx) => {
                  const isCharActive = isRowActive && activeLetterIdx === charIdx;
                  return (
                    <button
                      key={charIdx}
                      onClick={() => handleLetterClick(rowIdx, charIdx, char)}
                      onMouseEnter={!isTouch ? () => handleWagonHover(char) : undefined}
                      className={`w-12 h-14 md:w-14 md:h-16 flex-shrink-0 rounded-2xl flex items-center justify-center font-black text-2xl md:text-3xl transition-transform duration-150 btn-press-3d border-2 relative cursor-pointer ${
                        isCharActive
                          ? 'bg-amber-400 text-slate-900 border-amber-600 scale-110 shadow-xl ring-4 ring-amber-300'
                          : 'bg-blue-50 text-blue-900 border-blue-200 hover:bg-blue-100 hover:scale-105 active:scale-95'
                      }`}
                    >
                      <span className={isCharActive ? 'animate-wiggle' : ''}>{char}</span>
                      {/* Little rotating wheels below each wagon */}
                      <span className="absolute -bottom-1.5 left-2 w-2.5 h-2.5 rounded-full bg-slate-700 border border-slate-300"></span>
                      <span className="absolute -bottom-1.5 right-2 w-2.5 h-2.5 rounded-full bg-slate-700 border border-slate-300"></span>
                    </button>
                  );
                })}

                {/* Animated locomotive engine leading the train with steam */}
                <div
                  className="relative text-3xl md:text-4xl select-none px-2 flex items-center flex-shrink-0"
                  title={tr(lang, 'קִרְאוּ מִיָּמִין לִשְׂמֹאל אֶל הָרַכֶּבֶת!', 'Read right-to-left towards the engine!', '¡Lee de derecha a izquierda hacia el tren!')}
                >
                  <span className="inline-block animate-train-chug">🚂</span>
                  <span className="absolute -top-3 left-1 text-xs select-none animate-steam pointer-events-none">💨</span>
                </div>
              </div>

              {/* Reward Star for the Row */}
              <div className="flex items-center">
                <button
                  onClick={() => playEntireRow(rowIdx)}
                  className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all ${
                    isCompleted
                      ? 'bg-amber-100 border-2 border-amber-400 text-amber-500 shadow-md animate-bounce-gentle'
                      : 'bg-slate-100 border-2 border-slate-200 text-slate-300'
                  }`}
                  title={
                    isCompleted
                      ? tr(lang, 'הושלם!', 'Completed!', '¡Completado!')
                      : tr(lang, 'לחצו כדי לקרוא', 'Tap to read', 'Toca para leer')
                  }
                >
                  <Star className={`w-7 h-7 ${isCompleted ? 'fill-amber-400 text-amber-500' : 'text-slate-300'}`} />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
