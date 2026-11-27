import React, { useState } from 'react';
import { Sparkles, Trophy, Star, ChevronLeft, ChevronRight, RefreshCw, Volume2 } from 'lucide-react';
import { NUMBERS_DATA } from '../data/curriculumData';
import { playSound, playNumberAudio, playPhraseAudio } from '../utils/audio';
import { triggerConfetti, triggerStarBurst } from '../utils/confetti';
import { useDeviceType } from '../utils/useDeviceType';
import { tr } from '../utils/i18n';

const NUMBERS_ES = {
  1: { name: 'Uno', itemLabel: 'Un globo' },
  2: { name: 'Dos', itemLabel: 'Dos manzanas' },
  3: { name: 'Tres', itemLabel: 'Tres plátanos' },
  4: { name: 'Cuatro', itemLabel: 'Cuatro coches' },
  5: { name: 'Cinco', itemLabel: 'Cinco estrellas' },
  6: { name: 'Seis', itemLabel: 'Seis gatos' },
  7: { name: 'Siete', itemLabel: 'Siete fresas' },
  8: { name: 'Ocho', itemLabel: 'Ocho perritos' },
  9: { name: 'Nueve', itemLabel: 'Nueve helados' },
  10: { name: 'Diez', itemLabel: 'Diez mariposas' },
};

export default function NumbersWorld({ lang, soundEnabled, gender = 'boy', onEarnStar }) {
  const [currentNumIdx, setCurrentNumIdx] = useState(0);
  const [countedItems, setCountedItems] = useState({});
  const [balloonMode, setBalloonMode] = useState(false);
  const [poppedBalloons, setPoppedBalloons] = useState({});
  const { isTouch, withDeviceHe, withDeviceEn } = useDeviceType();

  const isHe = lang === 'he';
  const numberObj = NUMBERS_DATA[currentNumIdx];

  const handleNext = () => {
    playSound('whoosh');
    setCurrentNumIdx((prev) => (prev + 1) % NUMBERS_DATA.length);
    setCountedItems({});
    setPoppedBalloons({});
  };

  const handlePrev = () => {
    playSound('whoosh');
    setCurrentNumIdx((prev) => (prev - 1 + NUMBERS_DATA.length) % NUMBERS_DATA.length);
    setCountedItems({});
    setPoppedBalloons({});
  };

  const handleItemClick = (idx) => {
    if (countedItems[idx]) return;
    playSound('pop');
    const currentCount = Object.keys(countedItems).length + 1;
    const newCounted = { ...countedItems, [idx]: currentCount };
    setCountedItems(newCounted);

    if (currentCount === numberObj.itemsCount) {
      triggerStarBurst();
      onEarnStar();
      if (soundEnabled) {
        // Allow the woman to finish speaking the number completely before praise!
        playNumberAudio(currentCount, () => {
          playSound('win');
          setTimeout(() => {
            playPhraseAudio('great_job', gender);
          }, 250);
        });
      }
    } else {
      if (soundEnabled) {
        playNumberAudio(currentCount);
      }
    }
  };

  const handleBalloonPop = (idx) => {
    if (poppedBalloons[idx]) return;
    playSound('pop');
    const currentCount = Object.keys(poppedBalloons).length + 1;
    const newPopped = { ...poppedBalloons, [idx]: currentCount };
    setPoppedBalloons(newPopped);

    onEarnStar();

    if (currentCount === numberObj.number) {
      triggerConfetti();
      if (soundEnabled) {
        // Allow the woman to finish speaking the number completely before praise!
        playNumberAudio(currentCount, () => {
          playSound('win');
          setTimeout(() => {
            playPhraseAudio('great_job', gender);
          }, 250);
        });
      }
    } else {
      if (soundEnabled) {
        playNumberAudio(currentCount);
      }
    }
  };

  const resetCount = () => {
    playSound('whoosh');
    setCountedItems({});
    setPoppedBalloons({});
  };

  const isAllCounted = Object.keys(countedItems).length === numberObj.itemsCount;
  const isAllPopped = Object.keys(poppedBalloons).length === numberObj.number;

  return (
    <div
      className="max-w-4xl mx-auto px-4 py-6 flex flex-col gap-6"
      dir={isHe ? 'rtl' : 'ltr'}
    >
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-orange-400 to-amber-500 rounded-3xl p-6 text-white text-center shadow-lg relative">
        <span className="text-4xl">🔢 🎈 ⭐</span>
        <h2 className="text-2xl md:text-3xl font-black mt-2">
          {tr(lang, 'עוֹלַם הַמִּסְפָּרִים מִ-1 עַד 10 (לְגִיל 4)', 'World of Numbers: 1 to 10 (Age 4)', 'El Mundo de los Números: del 1 al 10 (4 años)')}
        </h2>
        <p className="text-amber-100 text-sm md:text-base mt-1 font-medium">
          {tr(
            lang,
            `סוֹפְרִים פְרִיטִים ${withDeviceHe}, לוֹמְדִים אֶת הַכַּמּוּת וּמְפַצְּצִים בַּלּוֹנִים!`,
            `Count items ${withDeviceEn}, understand quantity, and pop balloons!`,
            `¡Cuenta objetos ${isTouch ? 'con el dedo' : 'con el ratón'}, aprende la cantidad y explota globos!`
          )}
        </p>

        <button
          onClick={() => playPhraseAudio(isTouch ? 'inst_numbers_touch' : 'inst_numbers_mouse', gender)}
          className="mt-3 inline-flex items-center gap-1.5 px-3 py-1.5 bg-white/20 hover:bg-white/30 rounded-full font-bold text-xs text-white shadow-sm"
          title={tr(lang, 'השמע הוראות לילד', 'Hear instructions', 'Escuchar instrucciones')}
        >
          <Volume2 className="w-4 h-4 text-amber-200" />
          <span>{tr(lang, '🔊 שְׁמַע הוֹרָאוֹת', '🔊 Hear Instructions', '🔊 Escuchar instrucciones')}</span>
        </button>
      </div>

      {/* Mode Switcher: Counting Explorer vs Balloon Popper */}
      <div className="flex justify-center gap-3">
        <button
          onClick={() => {
            playSound('pop');
            setBalloonMode(false);
          }}
          className={`px-5 py-2 rounded-2xl font-black text-sm md:text-base transition-all btn-press-3d border-2 ${
            !balloonMode
              ? 'bg-amber-400 text-slate-900 border-amber-500 shadow-md scale-105'
              : 'bg-white text-slate-700 border-slate-200'
          }`}
        >
          {tr(lang, '🖐️ לוֹמְדִים וְסוֹפְרִים', '🖐️ Learn & Count', '🖐️ Aprender y Contar')}
        </button>

        <button
          onClick={() => {
            playSound('pop');
            setBalloonMode(true);
          }}
          className={`px-5 py-2 rounded-2xl font-black text-sm md:text-base transition-all btn-press-3d border-2 ${
            balloonMode
              ? 'bg-pink-500 text-white border-pink-600 shadow-md scale-105'
              : 'bg-white text-slate-700 border-slate-200'
          }`}
        >
          {tr(lang, '🎈 מִשְׂחַק פִּיצוּץ בַּלּוֹנִים', '🎈 Balloon Popper Game', '🎈 Juego de Explotar Globos')}
        </button>
      </div>

      {/* Main Interactive Number Stage */}
      <div className="bg-white rounded-3xl p-6 md:p-8 border-4 border-amber-300 shadow-xl flex flex-col items-center text-center relative">
        {/* Navigation Arrows for Small Hands (RTL Compliant) */}
        <div className="absolute top-4 left-4 right-4 flex justify-between pointer-events-none">
          <button
            onClick={handlePrev}
            className="pointer-events-auto p-3 bg-amber-200 hover:bg-amber-300 active:scale-95 text-slate-800 rounded-full shadow-md btn-press-3d transition"
            title={tr(lang, 'הַקּוֹדֵם', 'Previous', 'Anterior')}
          >
            {isHe ? <ChevronRight className="w-8 h-8" /> : <ChevronLeft className="w-8 h-8" />}
          </button>
          <button
            onClick={handleNext}
            className="pointer-events-auto p-3 bg-amber-200 hover:bg-amber-300 active:scale-95 text-slate-800 rounded-full shadow-md btn-press-3d transition"
            title={tr(lang, 'הַבָּא', 'Next', 'Siguiente')}
          >
            {isHe ? <ChevronLeft className="w-8 h-8" /> : <ChevronRight className="w-8 h-8" />}
          </button>
        </div>

        {/* Big Digit Badge */}
        <div
          onClick={() => {
            playSound('pop');
            playNumberAudio(numberObj.number);
          }}
          className={`w-32 h-32 md:w-40 md:h-40 rounded-3xl bg-gradient-to-tr ${numberObj.color} flex items-center justify-center shadow-lg text-white font-black text-7xl md:text-8xl mt-4 cursor-pointer transform hover:scale-105 active:scale-95 transition-all`}
        >
          {numberObj.number}
        </div>

        {/* Number Names */}
        <div className="mt-4">
          <h3 className="text-3xl md:text-4xl font-black text-slate-800">
            {tr(lang, numberObj.nameHe, numberObj.nameEn, NUMBERS_ES[numberObj.number]?.name || numberObj.nameEn)}
          </h3>
          <p className="text-lg font-bold text-amber-600 mt-1">
            {tr(lang, numberObj.itemLabelHe, numberObj.itemLabelEn, NUMBERS_ES[numberObj.number]?.itemLabel || numberObj.itemLabelEn)}
          </p>
        </div>

        {/* MODE 1: Interactive Count Items */}
        {!balloonMode && (
          <div className="w-full mt-6 flex flex-col items-center">
            <p className="text-sm font-bold text-slate-500 mb-4">
              {tr(lang, 'לִחְצוּ עַל כָּל פְּרִיט כְּדֵי לִסְפּוֹר אוֹתוֹ:', 'Tap each item to count it:', 'Toca cada objeto para contarlo:')}
            </p>

            <div className="flex flex-wrap justify-center gap-3 md:gap-4 max-w-lg">
              {Array.from({ length: numberObj.itemsCount }).map((_, idx) => {
                const isCounted = countedItems[idx];
                return (
                  <button
                    key={idx}
                    onClick={() => handleItemClick(idx)}
                    className={`w-16 h-16 md:w-20 md:h-20 rounded-2xl flex flex-col items-center justify-center text-4xl md:text-5xl border-3 transition-all duration-150 btn-press-3d ${
                      isCounted
                        ? 'bg-amber-100 border-amber-400 scale-110 shadow-md ring-2 ring-amber-300'
                        : 'bg-slate-50 border-slate-200 hover:bg-amber-50 hover:border-amber-300'
                    }`}
                  >
                    <span>{numberObj.emoji}</span>
                    {isCounted && (
                      <span className="text-xs font-black text-amber-800 -mt-1">
                        {countedItems[idx]}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>

            {isAllCounted ? (
              <div className="mt-6 p-4 bg-emerald-100 border-2 border-emerald-400 rounded-2xl text-emerald-900 font-black text-lg flex items-center gap-2 animate-bounce">
                <Trophy className="w-6 h-6 text-emerald-600" />
                <span>{tr(lang, `מְעֻלֶּה! יֵשׁ כָּאן ${numberObj.number}! 🏆`, `Great! There are ${numberObj.number}! 🏆`, `¡Genial! ¡Hay ${numberObj.number}! 🏆`)}</span>
                <button
                  onClick={resetCount}
                  className="mr-3 px-3 py-1 bg-emerald-600 text-white rounded-xl text-sm font-bold shadow"
                >
                  {tr(lang, 'סְפוֹר שׁוּב', 'Count Again', 'Contar de nuevo')}
                </button>
              </div>
            ) : (
              <button
                onClick={resetCount}
                className="mt-6 flex items-center gap-1.5 px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl text-xs"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>{tr(lang, 'אִפּוּס סְפִירָה', 'Reset', 'Reiniciar')}</span>
              </button>
            )}
          </div>
        )}

        {/* MODE 2: Balloon Popping Game */}
        {balloonMode && (
          <div className="w-full mt-6 flex flex-col items-center">
            <p className="text-sm font-bold text-pink-600 mb-4 animate-pulse">
              {tr(lang, `פּוֹצְצוּ ${numberObj.number} בַּלּוֹנִים!`, `Pop ${numberObj.number} balloons!`, numberObj.number === 1 ? '¡Explota 1 globo!' : `¡Explota ${numberObj.number} globos!`)}
            </p>

            <div className="flex flex-wrap justify-center gap-4 max-w-lg min-h-36 items-center">
              {Array.from({ length: numberObj.number }).map((_, idx) => {
                const isPopped = poppedBalloons[idx];
                return (
                  <button
                    key={idx}
                    onClick={() => !isPopped && handleBalloonPop(idx)}
                    disabled={isPopped}
                    className={`w-16 h-20 md:w-20 md:h-24 rounded-full flex flex-col items-center justify-center text-4xl md:text-5xl transition-all duration-150 relative ${
                      isPopped
                        ? 'opacity-20 scale-75'
                        : 'bg-gradient-to-t from-pink-400 to-rose-400 text-white shadow-lg animate-bounce-gentle hover:scale-110 active:scale-95'
                    }`}
                  >
                    {!isPopped ? (
                      <>
                        <span>🎈</span>
                        <span className="text-xs font-black text-white -mt-2 drop-shadow">
                          {idx + 1}
                        </span>
                      </>
                    ) : (
                      <span className="text-2xl">💥</span>
                    )}
                  </button>
                );
              })}
            </div>

            {isAllPopped ? (
              <div className="mt-6 p-4 bg-pink-100 border-2 border-pink-400 rounded-2xl text-pink-900 font-black text-lg flex items-center gap-2 animate-bounce">
                <Trophy className="w-6 h-6 text-pink-600" />
                <span>{tr(lang, 'כָּל הַבַּלּוֹנִים הִתְפּוֹצְצוּ! כָּל הַכָּבוֹד! 🎉', 'All balloons popped! Awesome! 🎉', '¡Todos los globos explotaron! ¡Genial! 🎉')}</span>
                <button
                  onClick={resetCount}
                  className="mr-3 px-3 py-1 bg-pink-600 text-white rounded-xl text-sm font-bold shadow"
                >
                  {tr(lang, 'שַׂחֵק שׁוּב', 'Play Again', 'Jugar de nuevo')}
                </button>
              </div>
            ) : (
              <button
                onClick={resetCount}
                className="mt-6 flex items-center gap-1.5 px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl text-xs"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>{tr(lang, 'בַּלּוֹנִים חֲדָשִׁים', 'New Balloons', 'Nuevos globos')}</span>
              </button>
            )}
          </div>
        )}
      </div>

      {/* Number Selector Bar at Bottom */}
      <div className="bg-white rounded-3xl p-4 border-2 border-slate-200 shadow-sm flex flex-wrap justify-center gap-2">
        {NUMBERS_DATA.map((item, idx) => {
          const isSelected = idx === currentNumIdx;
          return (
            <button
              key={item.number}
              onClick={() => {
                playSound('pop');
                setCurrentNumIdx(idx);
                setCountedItems({});
                setPoppedBalloons({});
              }}
              className={`w-11 h-11 md:w-13 md:h-13 rounded-2xl font-black text-xl md:text-2xl flex items-center justify-center transition-all duration-100 border-2 ${
                isSelected
                  ? 'bg-amber-400 text-slate-900 border-amber-600 scale-110 shadow-md ring-2 ring-amber-300'
                  : 'bg-slate-100 text-slate-700 border-slate-200 hover:bg-amber-100'
              }`}
            >
              {item.number}
            </button>
          );
        })}
      </div>
    </div>
  );
}
