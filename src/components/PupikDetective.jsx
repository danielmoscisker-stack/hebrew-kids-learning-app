import React, { useState, useEffect, useRef } from 'react';
import { Search, Home, Star, Sparkles, RefreshCw, Trophy, Volume2 } from 'lucide-react';
import { SORTING_ITEMS } from '../data/curriculumData';
import { playSound, playPhraseAudio, playWordAudio } from '../utils/audio';
import { triggerConfetti, triggerStarBurst } from '../utils/confetti';
import { useDeviceType } from '../utils/useDeviceType';
import { tr } from '../utils/i18n';

export default function PupikDetective({ lang, soundEnabled, gender = 'boy', onEarnStar }) {
  const [activeGame, setActiveGame] = useState('detective'); // 'detective' or 'sorting'
  const { isTouch } = useDeviceType();
  const lastWordAudioTime = useRef(0);
  const lastHouseAudioTime = useRef({ pupik: 0, no_pupik: 0 });

  const explainHouse = (houseType, e = null) => {
    if (e && e.stopPropagation) e.stopPropagation();
    if (!soundEnabled) return;
    const now = Date.now();
    if (now - lastHouseAudioTime.current[houseType] < 800) return;
    lastHouseAudioTime.current[houseType] = now;
    playSound('pop');
    playPhraseAudio(houseType === 'pupik' ? 'explain_bet' : 'explain_vet', gender);
  };

  const switchToGame = (gameMode) => {
    playSound('pop');
    setActiveGame(gameMode);
    if (soundEnabled) {
      setTimeout(() => {
        if (gameMode === 'sorting') {
          const phraseId = isTouch ? 'inst_sorting_touch' : 'inst_sorting_mouse';
          playPhraseAudio(phraseId, gender);
        } else {
          playPhraseAudio('inst_detective', gender);
        }
      }, 250);
    }
  };

  // Detective Grid State (Page 2)
  const initialGrid = [
    { id: 1, char: 'בּ', hasPupik: true, found: false },
    { id: 2, char: 'ב', hasPupik: false, found: false },
    { id: 3, char: 'בּ', hasPupik: true, found: false },
    { id: 4, char: 'ב', hasPupik: false, found: false },
    { id: 5, char: 'ב', hasPupik: false, found: false },
    { id: 6, char: 'בּ', hasPupik: true, found: false },
    { id: 7, char: 'בּ', hasPupik: true, found: false },
    { id: 8, char: 'ב', hasPupik: false, found: false },
  ];
  const [gridItems, setGridItems] = useState(initialGrid);

  // Sorting Game State (Page 11)
  const [sortingItems, setSortingItems] = useState(SORTING_ITEMS);
  const [sortedItems, setSortedItems] = useState({ pupik: [], no_pupik: [] });
  const [currentSortingIdx, setCurrentSortingIdx] = useState(0);

  const isHe = lang === 'he';

  const resetDetective = () => {
    playSound('whoosh');
    setGridItems(initialGrid.map((it) => ({ ...it, found: false })));
  };

  const handleGridTap = (item) => {
    if (item.hasPupik) {
      if (!item.found) {
        playSound('pupik');
        setGridItems((prev) =>
          prev.map((it) => (it.id === item.id ? { ...it, found: true } : it))
        );
        onEarnStar();
        if (soundEnabled) {
          playPhraseAudio('pupik_touch', gender);
        }

        // Check if all pupiks found
        const remaining = gridItems.filter((it) => it.hasPupik && !it.found && it.id !== item.id);
        if (remaining.length === 0) {
          playSound('win');
          triggerStarBurst();
          if (soundEnabled) {
            setTimeout(() => {
              playPhraseAudio('great_job', gender);
            }, 600);
          }
        }
      }
    } else {
      playSound('pop');
      if (soundEnabled) {
        playPhraseAudio('try_again', gender);
      }
    }
  };

  const currentItem = sortingItems[currentSortingIdx];
  const allFoundDetective = gridItems.filter((i) => i.hasPupik && !i.found).length === 0;
  const allSorted = currentSortingIdx >= sortingItems.length;

  // Speak word helper (debounced against rapid touchstart/click event double-fires)
  const speakCurrentWord = (force = false) => {
    if (!currentItem || !soundEnabled || allSorted) return;
    const now = Date.now();
    if (!force && now - lastWordAudioTime.current < 450) return;
    lastWordAudioTime.current = now;
    playSound('pop');
    playWordAudio(currentItem.wordEn);
  };

  // Automatically announce the card's word when it appears
  useEffect(() => {
    if (activeGame === 'sorting' && currentItem && !allSorted && soundEnabled) {
      const timer = setTimeout(() => {
        speakCurrentWord(true);
      }, 350);
      return () => clearTimeout(timer);
    }
  }, [activeGame, currentSortingIdx, allSorted, soundEnabled]);

  const handleSortItem = (targetHouse) => {
    const item = sortingItems[currentSortingIdx];
    if (!item || allSorted) return;

    if (item.targetHouse === targetHouse) {
      playSound(targetHouse === 'pupik' ? 'pupik' : 'pop');
      setSortedItems((prev) => ({
        ...prev,
        [targetHouse]: [...prev[targetHouse], item]
      }));
      onEarnStar();

      if (currentSortingIdx + 1 < sortingItems.length) {
        setCurrentSortingIdx((prev) => prev + 1);
      } else {
        setCurrentSortingIdx((prev) => prev + 1);
        playSound('win');
        triggerConfetti();
        if (soundEnabled) {
          setTimeout(() => {
            playPhraseAudio('great_job', gender);
          }, 600);
        }
      }
    } else {
      playSound('whoosh');
      if (soundEnabled) {
        playPhraseAudio('try_again', gender);
      }
    }
  };

  const resetSorting = () => {
    playSound('whoosh');
    setSortedItems({ pupik: [], no_pupik: [] });
    setCurrentSortingIdx(0);
  };

  return (
    <div
      className="max-w-4xl mx-auto px-4 py-6 flex flex-col gap-6"
      dir={isHe ? 'rtl' : 'ltr'}
    >
      {/* Game Mode Switcher */}
      <div className="flex justify-center gap-3">
        <button
          onClick={() => switchToGame('detective')}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-2xl font-black text-sm md:text-base transition-all btn-press-3d border-2 ${
            activeGame === 'detective'
              ? 'bg-red-500 text-white border-red-600 shadow-md scale-105'
              : 'bg-white text-slate-700 border-slate-200 hover:bg-red-50'
          }`}
        >
          <Search className="w-5 h-5" />
          <span>{tr(lang, 'מִשְׂחַק בַּלָּשִׁים (דַּף 2)', 'Pupik Detective Grid', 'Detective de Pupiks')}</span>
        </button>

        <button
          onClick={() => switchToGame('sorting')}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-2xl font-black text-sm md:text-base transition-all btn-press-3d border-2 ${
            activeGame === 'sorting'
              ? 'bg-blue-600 text-white border-blue-700 shadow-md scale-105'
              : 'bg-white text-slate-700 border-slate-200 hover:bg-blue-50'
          }`}
        >
          <Home className="w-5 h-5" />
          <span>{tr(lang, 'לוּחַ מִיּוּן בָּתִּים (דַּף 11)', 'House Sorting Board', 'Tablero de casitas')}</span>
        </button>
      </div>

      {/* GAME 1: Detective Grid (Page 2) */}
      {activeGame === 'detective' && (
        <div className="bg-white rounded-3xl p-6 border-4 border-red-300 shadow-xl flex flex-col items-center text-center">
          <div 
            onClick={() => playPhraseAudio('inst_detective', gender)}
            className="inline-flex items-center gap-2 px-4 py-1.5 bg-red-100 hover:bg-red-200 cursor-pointer text-red-800 rounded-full font-extrabold text-sm mb-3 transition shadow-sm"
            title={tr(lang, gender === 'girl' ? 'לַחְצִי לִשְׁמִיעַת הַהוֹרָאוֹת' : 'לְחַץ לִשְׁמִיעַת הַהוֹרָאוֹת', 'Tap to hear instructions', 'Toca para escuchar las instrucciones')}
          >
            <Volume2 className="w-4 h-4 text-red-600 animate-pulse" />
            <span>
              {tr(
                lang,
                gender === 'girl'
                  ? 'מִשְׂחָק לְגִיל 4: מִי מוֹצֵאת אֶת כָּל הַנְּקֻדּוֹת? (🔊 שִׁמְעִי הוֹרָאוֹת)'
                  : 'מִשְׂחָק לְגִיל 4: מִי מוֹצֵא אֶת כָּל הַנְּקֻדּוֹת? (🔊 שְׁמַע הוֹרָאוֹת)',
                'Age 4: Who finds all the pupiks? (🔊 Hear Instructions)',
                'Edad 4: ¿Quién encuentra todos los pupiks? (🔊 Escuchar instrucciones)'
              )}
            </span>
          </div>

          <h3 className="text-2xl md:text-3xl font-black text-slate-800">
            {tr(lang, 'שִׂימוּ אֶצְבַּע עַל כָּל אוֹת שֶׁיֵּשׁ לָהּ פּוּפִּיק!', 'Tap every letter that has a Pupik!', '¡Toca cada letra que tenga un Pupik!')}
          </h3>
          <p className="text-slate-500 text-sm mt-1 mb-6">
            {tr(lang, 'כְּשֶׁרוֹאִים נְקֻדָּה נוֹגְעִים בַּבֶּטֶן וְצוֹעֲקִים: "בּוּהּ!"', 'When you see a dot, touch your belly and shout "Buh!"', '¡Cuando veas un puntito, tócate la barriguita y grita "Buh!"')}
          </p>

          {/* Grid of Cards */}
          <div className="grid grid-cols-4 gap-3 md:gap-5 w-full max-w-lg mb-6">
            {gridItems.map((item) => {
              return (
                <button
                  key={item.id}
                  onClick={() => handleGridTap(item)}
                  className={`h-24 md:h-28 rounded-2xl flex flex-col items-center justify-center font-black text-4xl md:text-5xl transition-all duration-200 btn-press-3d border-4 relative cursor-pointer ${
                    item.found
                      ? 'bg-amber-300 text-indigo-900 border-amber-500 scale-105 shadow-xl animate-jelly ring-4 ring-amber-300'
                      : 'bg-slate-50 text-slate-800 border-slate-200 hover:bg-red-50 hover:border-red-300 hover:scale-105'
                  }`}
                >
                  <span className={item.found ? 'animate-wiggle' : ''}>{item.char}</span>
                  {item.found && (
                    <span className="absolute -top-3 -right-3 bg-amber-400 border-2 border-white rounded-full p-1 text-sm shadow-lg animate-celebrate-spin">
                      ⭐
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          {/* Win / Reset Section */}
          {allFoundDetective ? (
            <div className="p-4 bg-emerald-100 border-2 border-emerald-400 rounded-2xl text-emerald-900 font-black text-lg flex items-center gap-2 animate-bounce">
              <Trophy className="w-7 h-7 text-emerald-600" />
              <span>{tr(lang, 'מְצָאתֶם אֶת כֻּלָּם? כָּל הַכָּבוֹד! 🏆', 'You found all of them! Awesome! 🏆', '¡Los encontraste todos! ¡Genial! 🏆')}</span>
              <button
                onClick={resetDetective}
                className="mr-3 px-3 py-1 bg-emerald-600 text-white rounded-xl text-sm font-bold shadow"
              >
                {tr(lang, 'שַׂחֵק שׁוּב', 'Play Again', 'Jugar otra vez')}
              </button>
            </div>
          ) : (
            <button
              onClick={resetDetective}
              className="flex items-center gap-1.5 px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl text-sm transition"
            >
              <RefreshCw className="w-4 h-4" />
              <span>{tr(lang, 'הַתְחֵל מֵחָדָשׁ', 'Restart', 'Reiniciar')}</span>
            </button>
          )}
        </div>
      )}

      {/* GAME 2: House Sorting (Page 11) */}
      {activeGame === 'sorting' && (
        <div className="bg-white rounded-3xl p-6 border-4 border-blue-300 shadow-xl flex flex-col items-center text-center">
          <button 
            type="button"
            onClick={() => {
              playSound('pop');
              const phraseId = isTouch ? 'inst_sorting_touch' : 'inst_sorting_mouse';
              playPhraseAudio(phraseId, gender);
            }}
            className="inline-flex items-center gap-2 px-4 py-2 bg-blue-100 hover:bg-blue-200 cursor-pointer text-blue-900 rounded-full font-black text-xs md:text-sm mb-3 transition shadow-sm btn-press-3d border border-blue-200"
            title={tr(lang, gender === 'girl' ? 'הַשְׁמִיעִי הוֹרָאוֹת' : 'הַשְׁמַע הוֹרָאוֹת', 'Hear Instructions', 'Escuchar instrucciones')}
          >
            <Volume2 className="w-4 h-4 text-blue-600 animate-pulse flex-shrink-0" />
            <span>
              {isTouch
                ? tr(
                    lang,
                    gender === 'girl'
                      ? 'לוּחַ מִיּוּן: הַעֲבִירִי עִם הָאֶצְבַּע וְהַנִּיחִי כָּל כַּרְטִיס בַּבַּיִת הַמַּתְאִים! (🔊 שִׁמְעִי הוֹרָאוֹת)'
                      : 'לוּחַ מִיּוּן: הַעֲבֵר עִם הָאֶצְבַּע וְהַנַּח כָּל כַּרְטִיס בַּבַּיִת הַמַּתְאִים! (🔊 שְׁמַע הוֹרָאוֹת)',
                    'Sorting Board: Put each card into the right house with your finger! (🔊 Hear Instructions)',
                    'Tablero de clasificación: ¡Pon cada tarjeta en la casita correcta con tu dedo! (🔊 Escuchar instrucciones)'
                  )
                : tr(
                    lang,
                    gender === 'girl'
                      ? 'לוּחַ מִיּוּן: הַעֲבִירִי עִם הָעַכְבָּר וְהַנִּיחִי כָּל כַּרְטִיס בַּבַּיִת הַמַּתְאִים! (🔊 שִׁמְעִי הוֹרָאוֹת)'
                      : 'לוּחַ מִיּוּן: הַעֲבֵר עַם הָעַכְבָּר וְהַנַּח כָּל כַּרְטִיס בַּבַּיִת הַמַּתְאִים! (🔊 שְׁמַע הוֹרָאוֹת)',
                    'Sorting Board: Put each card into the right house with the mouse! (🔊 Hear Instructions)',
                    'Tablero de clasificación: ¡Pon cada tarjeta en la casita correcta con el ratón! (🔊 Escuchar instrucciones)'
                  )}
            </span>
          </button>

          {/* Current Card to Sort: Spoken out loud & re-spoken on mouse hover or finger tap */}
          {!allSorted && currentItem && (
            <div
              role="button"
              tabIndex={0}
              onMouseEnter={() => speakCurrentWord()}
              onTouchStart={() => speakCurrentWord()}
              onClick={() => speakCurrentWord()}
              className="my-4 p-5 md:p-6 bg-gradient-to-tr from-amber-100 via-amber-50 to-yellow-100 border-4 border-amber-400 rounded-3xl shadow-xl flex flex-col items-center cursor-pointer transition-all duration-200 hover:scale-105 active:scale-95 hover:border-amber-500 hover:shadow-2xl relative group btn-press-3d select-none w-full max-w-xs"
              title={tr(lang, 'לַחֲצוּ כְּדֵי לִשְׁמוֹעַ שׁוּב', 'Tap to hear word again', 'Toca para escuchar la palabra de nuevo')}
            >
              {/* Speaker Badge */}
              <div className="absolute top-3 left-3 bg-white/90 border border-amber-300 rounded-full px-2.5 py-1 flex items-center gap-1 text-[11px] font-black text-amber-800 shadow-sm group-hover:bg-amber-200 group-hover:scale-110 transition-all">
                <Volume2 className="w-3.5 h-3.5 text-amber-600 animate-pulse" />
                <span>{tr(lang, 'הַשְׁמַע', 'Listen', 'Escuchar')}</span>
              </div>

              {/* Emoji illustration */}
              <span className="text-6xl md:text-7xl mb-2 transition-transform duration-200 group-hover:scale-110 group-hover:animate-wiggle">
                {currentItem.emoji}
              </span>

              {/* Hebrew word with Nikud */}
              <span className="text-3xl md:text-4xl font-black text-slate-800 tracking-wide">
                {currentItem.wordHe}
              </span>

              {/* English / Spanish word */}
              <span className="text-sm md:text-base font-bold text-slate-500 mt-0.5">
                {lang === 'es' ? (currentItem.wordEs || currentItem.wordEn) : currentItem.wordEn}
              </span>

              {/* Sub-banner: Tap or Hover to hear again */}
              <div className="mt-3 flex items-center gap-1.5 text-[11px] md:text-xs font-black text-amber-900 bg-amber-200/80 px-3 py-1 rounded-full shadow-inner">
                <span>🔊</span>
                <span>
                  {isTouch
                    ? tr(
                        lang,
                        gender === 'girl'
                          ? 'גְּעִי בָּאֶצְבַּע כְּדֵי לִשְׁמוֹעַ שׁוּב!'
                          : 'גַּע בָּאֶצְבַּע כְּדֵי לִשְׁמוֹעַ שׁוּב!',
                        'Tap with finger to hear again!',
                        '¡Toca con el dedo para escuchar de nuevo!'
                      )
                    : tr(
                        lang,
                        gender === 'girl'
                          ? 'הַעֲבִירִי עַכְבָּר אוֹ לַחֲצִי כְּדֵי לִשְׁמוֹעַ שׁוּב!'
                          : 'הַעֲבֵר עַכְבָּר אוֹ לְחַץ כְּדֵי לִשְׁמוֹעַ שׁוּב!',
                        'Move mouse or click to hear again!',
                        '¡Mueve el ratón o haz clic para escuchar de nuevo!'
                      )}
                </span>
              </div>

              {/* Question: Which house does it belong to? */}
              <span className="mt-2 text-xs md:text-sm font-extrabold text-indigo-700">
                {tr(lang, 'לְאֵיזֶה בַּיִת זֶה מַתְאִים?', 'Which house does it belong to?', '¿A qué casita pertenece?')}
              </span>
            </div>
          )}

          {allSorted && (
            <div className="my-6 p-5 bg-emerald-100 border-4 border-emerald-400 rounded-3xl text-emerald-900 font-black text-xl flex flex-col items-center gap-2 animate-bounce">
              <Trophy className="w-12 h-12 text-emerald-600" />
              <span>{tr(lang, 'כָּל הַכָּבוֹד! כָּל הַכַּרְטִיסִים מֻיְּנוּ בְּהַצְלָחָה!', 'Awesome! All cards sorted!', '¡Genial! ¡Todas las tarjetas ordenadas!')}</span>
              <button
                onClick={resetSorting}
                className="mt-2 px-5 py-2 bg-emerald-600 text-white rounded-2xl text-base font-black shadow"
              >
                {tr(lang, gender === 'girl' ? 'שַׂחֲקִי שׁוּב' : 'שַׂחֵק שׁוּב', 'Play Again', 'Jugar otra vez')}
              </button>
            </div>
          )}

          {/* The Two Houses (Page 11 Layout) */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full mt-4">
            {/* House with Pupik (בּ) */}
            <button
              onClick={() => handleSortItem('pupik')}
              onMouseEnter={() => explainHouse('pupik')}
              disabled={allSorted}
              className="bg-blue-50 border-4 border-blue-500 hover:bg-blue-100 rounded-3xl p-5 flex flex-col items-center transition-all duration-150 btn-press-3d text-center relative group cursor-pointer shadow-md hover:shadow-xl"
            >
              <div
                onClick={(e) => explainHouse('pupik', e)}
                className="w-16 h-16 rounded-2xl bg-blue-500 text-white font-black text-4xl flex items-center justify-center shadow mb-2 group-hover:scale-110 transition-transform cursor-pointer"
                title={tr(lang, 'לַחֲצוּ לִשְׁמוֹעַ: בֵּית בִּתְחִלַּת מִלָּה!', 'Tap to hear: Bet is at the start!', 'Toca para escuchar: ¡Bet va al principio!')}
              >
                בּ
              </div>
              <h4 className="text-xl font-black text-blue-900 flex items-center gap-1.5">
                <span>{tr(lang, 'בַּיִת עִם פּוּפִּיק! (בּוֹם!)', 'House of Pupik (Boom!)', '¡Casita con Pupik! (¡Bum!)')}</span>
                <span className="text-xs bg-blue-200 text-blue-900 px-2 py-0.5 rounded-full font-bold">🔊</span>
              </h4>
              <p className="text-xs text-blue-700 font-bold mt-1">
                {tr(lang, 'יֵשׁ נְקֻדָּה בָּאֶמְצַע • קוֹל בּוּם!', 'Dot in the middle • Boom sound!', 'Puntito en el medio • ¡Sonido bum!')}
              </p>

              {/* Pedagogical stress: Bet is at the start of the word */}
              <div 
                onClick={(e) => explainHouse('pupik', e)}
                className="mt-2.5 px-3 py-1.5 bg-blue-100 border border-blue-300 rounded-xl text-blue-950 font-black text-xs shadow-sm hover:bg-blue-200 transition-all flex items-center gap-1.5"
              >
                <span>⭐</span>
                <span>{tr(lang, 'בִּתְחִלַּת מִלָּה: בַּלּוֹן, בַּיִת, בַּנָנָה!', 'At word beginning: Balloon, House, Banana!', 'Al principio: ¡Globo, Casa, Plátano!')}</span>
              </div>

              {/* Sorted items inside this house */}
              <div className="flex flex-wrap justify-center gap-2 mt-4 min-h-12 w-full">
                {sortedItems.pupik.map((it, idx) => (
                  <span key={idx} className="text-3xl animate-wiggle" title={it.wordHe}>
                    {it.emoji}
                  </span>
                ))}
              </div>
            </button>

            {/* House without Pupik (ב) */}
            <button
              onClick={() => handleSortItem('no_pupik')}
              onMouseEnter={() => explainHouse('no_pupik')}
              disabled={allSorted}
              className="bg-purple-50 border-4 border-purple-500 hover:bg-purple-100 rounded-3xl p-5 flex flex-col items-center transition-all duration-150 btn-press-3d text-center relative group cursor-pointer shadow-md hover:shadow-xl"
            >
              <div
                onClick={(e) => explainHouse('no_pupik', e)}
                className="w-16 h-16 rounded-2xl bg-purple-500 text-white font-black text-4xl flex items-center justify-center shadow mb-2 group-hover:scale-110 transition-transform cursor-pointer"
                title={tr(lang, 'לַחֲצוּ לִשְׁמוֹעַ: וֵית בְּאֶמְצַע אוֹ בְּסוֹף מִלָּה!', 'Tap to hear: Vet is in middle or end!', 'Toca para escuchar: ¡Vet va en medio o al final!')}
              >
                ב
              </div>
              <h4 className="text-xl font-black text-purple-900 flex items-center gap-1.5">
                <span>{tr(lang, 'בַּיִת בְּלִי פּוּפִּיק! (וְוְו...)', 'House without Pupik (Vvv...)', '¡Casita sin Pupik! (Vvv...)')}</span>
                <span className="text-xs bg-purple-200 text-purple-900 px-2 py-0.5 rounded-full font-bold">🔊</span>
              </h4>
              <p className="text-xs text-purple-700 font-bold mt-1">
                {tr(lang, 'בֶּטֶן רֵיקָה לְגַמְרֵי • רוּחַ נְעִימָה!', 'Empty belly • Gentle wind!', 'Barriguita vacía • ¡Viento suave!')}
              </p>

              {/* Pedagogical stress: Vet is in the middle or end of the word */}
              <div 
                onClick={(e) => explainHouse('no_pupik', e)}
                className="mt-2.5 px-3 py-1.5 bg-purple-100 border border-purple-300 rounded-xl text-purple-950 font-black text-xs shadow-sm hover:bg-purple-200 transition-all flex items-center gap-1.5"
              >
                <span>⭐</span>
                <span>{tr(lang, 'בְּאֶמְצַע אוֹ בְּסוֹף מִלָּה: כּוֹכָב, לֵב, עֲנָבִים!', 'In middle or at end: Star, Heart, Grapes!', 'En medio o al final: ¡Estrella, Corazón, Uvas!')}</span>
              </div>

              {/* Sorted items inside this house */}
              <div className="flex flex-wrap justify-center gap-2 mt-4 min-h-12 w-full">
                {sortedItems.no_pupik.map((it, idx) => (
                  <span key={idx} className="text-3xl animate-wiggle" title={it.wordHe}>
                    {it.emoji}
                  </span>
                ))}
              </div>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
