import React, { useState } from 'react';
import { ChevronRight, ChevronLeft, Volume2, Sparkles, Heart } from 'lucide-react';
import { LETTERS_DATA } from '../data/curriculumData';
import { playSound, speakLetterName, playWordAudio, playPhraseAudio } from '../utils/audio';
import { triggerConfetti } from '../utils/confetti';
import { useDeviceType } from '../utils/useDeviceType';
import { tr } from '../utils/i18n';

export default function AlphabetCards({ lang, soundEnabled, gender = 'boy', onEarnStar }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [activeExampleIndex, setActiveExampleIndex] = useState(null);
  const [pupikPopped, setPupikPopped] = useState(false);
  const [isLetterBouncing, setIsLetterBouncing] = useState(false);
  const { isTouch } = useDeviceType();

  const isHe = lang === 'he';
  const currentLetter = LETTERS_DATA[currentIndex];

  const handleNext = () => {
    playSound('whoosh');
    const nextIdx = (currentIndex + 1) % LETTERS_DATA.length;
    setCurrentIndex(nextIdx);
    setActiveExampleIndex(null);
    setPupikPopped(false);
    if (soundEnabled) {
      speakLetterName(LETTERS_DATA[nextIdx].id);
    }
  };

  const handlePrev = () => {
    playSound('whoosh');
    const prevIdx = (currentIndex - 1 + LETTERS_DATA.length) % LETTERS_DATA.length;
    setCurrentIndex(prevIdx);
    setActiveExampleIndex(null);
    setPupikPopped(false);
    if (soundEnabled) {
      speakLetterName(LETTERS_DATA[prevIdx].id);
    }
  };

  // Speaks the name of the letter, or explains the pedagogical rule for Bet and Vet
  const playLetterName = () => {
    playSound('pop');
    setIsLetterBouncing(true);
    setTimeout(() => setIsLetterBouncing(false), 650);
    if (soundEnabled) {
      if (currentLetter.id === 'bet_dagesh') {
        playPhraseAudio('explain_bet', gender);
      } else if (currentLetter.id === 'vet') {
        playPhraseAudio('explain_vet', gender);
      } else {
        speakLetterName(currentLetter.id);
      }
    }
  };

  const handlePupikTouch = () => {
    playSound('pupik');
    setPupikPopped(true);
    triggerConfetti();
    onEarnStar();
    if (soundEnabled) {
      playPhraseAudio('pupik_touch', gender);
    }
    setTimeout(() => setPupikPopped(false), 2000);
  };

  const handleExampleClick = (idx, example) => {
    playSound('pop');
    setActiveExampleIndex(idx);
    onEarnStar();
    if (soundEnabled) {
      playWordAudio(example.en);
    }
  };

  return (
    <div
      className="max-w-4xl mx-auto px-4 py-6 flex flex-col gap-6"
      dir={isHe ? 'rtl' : 'ltr'}
    >
      {/* Top Helper Banner with Audio Readout for Non-Reading 4yo */}
      <div 
        onClick={() => {
          playSound('pop');
          const instKey = isTouch ? 'inst_letters_touch' : 'inst_letters_mouse';
          playPhraseAudio(instKey, gender);
        }}
        className="bg-amber-100 hover:bg-amber-200 cursor-pointer border-2 border-amber-300 rounded-2xl p-3 text-center shadow-sm flex items-center justify-center gap-2 transition btn-press-3d"
        title={tr(lang, gender === 'girl' ? 'לַחְצִי לִשְׁמִיעַת הַהוֹרָאוֹת בְּקוֹל' : 'לְחַץ לִשְׁמִיעַת הַהוֹרָאוֹת בְּקוֹל', 'Tap to hear instructions', 'Toca para escuchar las instrucciones')}
      >
        <Volume2 className="w-5 h-5 text-amber-700 animate-pulse flex-shrink-0" />
        <span className="font-bold text-amber-900 text-sm md:text-base">
          {isTouch
            ? tr(
                lang,
                gender === 'girl'
                  ? 'גְּעִי עִם הָאֶצְבַּע בָּאוֹת כְּדֵי לִשְׁמוֹעַ אֶת הַשֵּׁם שֶׁלָּהּ!'
                  : 'גַּע עִם הָאֶצְבַּע בָּאוֹת כְּדֵי לִשְׁמוֹעַ אֶת הַשֵּׁם שֶׁלָּהּ!',
                'Tap the letter with your finger to hear its name!',
                '¡Toca la letra con tu dedo para escuchar su nombre!'
              )
            : tr(
                lang,
                gender === 'girl'
                  ? 'הַעֲבִירִי עַכְבָּר אוֹ לַחֲצִי עַל הָאוֹת כְּדֵי לִשְׁמוֹעַ אֶת הַשֵּׁם שֶׁלָּהּ!'
                  : 'הַעֲבֵר עַכְבָּר אוֹ לְחַץ עַל הָאוֹת כְּדֵי לִשְׁמוֹעַ אֶת הַשֵּׁם שֶׁלָּהּ!',
                'Move mouse or click the letter to hear its name!',
                '¡Mueve el ratón o haz clic en la letra para escuchar su nombre!'
              )}
        </span>
        <span className="text-xs bg-amber-200 text-amber-800 px-2 py-0.5 rounded-full font-bold">
          {tr(lang, gender === 'girl' ? '🔊 שִׁמְעִי הוֹרָאוֹת' : '🔊 שְׁמַע הוֹרָאוֹת', '🔊 Hear Instructions', '🔊 Escuchar instrucciones')}
        </span>
      </div>

      {/* Main Big Interactive Card */}
      <div className={`relative bg-white rounded-3xl border-4 ${currentLetter.borderColor} shadow-xl p-6 md:p-8 flex flex-col items-center text-center overflow-hidden`}>
        {/* Navigation Buttons for Small Hands (RTL Compliant) */}
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

        {/* Letter & Pupik Visual Centerpiece */}
        <div 
          className="mt-4 relative group cursor-pointer" 
          onClick={playLetterName} 
          onMouseEnter={() => {
            if (!isTouch && soundEnabled) playLetterName();
          }}
          title={tr(lang, 'לחצו לשמיעת שם האות', 'Click to hear the letter name', 'Haz clic para escuchar el nombre de la letra')}
        >
          <div className={`w-36 h-36 md:w-44 md:h-44 rounded-3xl bg-gradient-to-tr ${currentLetter.color} flex items-center justify-center shadow-2xl border-4 border-white transform transition-all duration-200 ${isLetterBouncing ? 'animate-jelly scale-110' : 'group-hover:scale-105 active:scale-95 animate-float'}`}>
            <span className={`text-8xl md:text-9xl font-black text-white drop-shadow-md select-none ${isLetterBouncing ? 'animate-wiggle' : ''}`}>
              {currentLetter.letter}
            </span>
          </div>

          {/* Sound wave icon badge */}
          <div className="absolute -bottom-2 -right-2 bg-white p-2.5 rounded-full shadow-lg border-2 border-slate-200 group-hover:scale-110 transition-transform">
            <Volume2 className="w-6 h-6 text-indigo-600 animate-pulse" />
          </div>

          {/* Interactive Pupik (Belly-Button Dot) for בּ, כּ, פּ and Shin/Sin */}
          {currentLetter.hasPupik && (
            <div
              onClick={(e) => {
                e.stopPropagation();
                handlePupikTouch();
              }}
              className="absolute -top-3 -left-3 bg-red-500 hover:bg-red-600 active:scale-125 cursor-pointer text-white px-3 py-1.5 rounded-full font-black text-xs md:text-sm flex items-center gap-1 shadow-lg animate-pupik border-2 border-white"
              title={tr(lang, gender === 'girl' ? 'גְּעִי בַּפּוּפִּיק!' : 'גַּע בַּפּוּפִּיק!', 'Touch Pupik!', '¡Toca el Pupik!')}
            >
              <span className="w-3 h-3 rounded-full bg-white animate-ping inline-block"></span>
              <span>{tr(lang, 'פּוּפִּיק!', 'Pupik!', '¡Pupik!')}</span>
            </div>
          )}
        </div>

        {/* Pupik Touch Celebration Banner */}
        {pupikPopped && (
          <div className="mt-3 py-1 px-4 bg-red-100 border border-red-300 text-red-700 font-extrabold rounded-full animate-bounce">
            {tr(
              lang,
              gender === 'girl'
                ? '🎉 בּוּם! נָגַעַתְּ בַּפּוּפִּיק! קוֹל בּוּם!'
                : '🎉 בּוּם! נָגַעְתָּ בַּפּוּפִּיק! קוֹל בּוּם!',
              '🎉 Boom! You touched the belly-button!',
              '🎉 ¡Bum! ¡Tocaste el ombliguito!'
            )}
          </div>
        )}

        {/* Letter Name with Hear Name Button */}
        <div className="mt-4 flex flex-col items-center">
          <div className="flex items-center gap-2">
            <h2 className="text-3xl md:text-4xl font-extrabold text-slate-800">
              {tr(lang, currentLetter.displayWithNikud, currentLetter.nameEn, currentLetter.nameEs || currentLetter.nameEn)}
            </h2>
            <button
              onClick={playLetterName}
              className="p-2 bg-amber-100 hover:bg-amber-200 active:scale-95 text-amber-800 rounded-full shadow-sm transition"
              title={tr(lang, 'השמע שם האות', 'Hear letter name', 'Escuchar el nombre de la letra')}
            >
              <Volume2 className="w-5 h-5 text-amber-700" />
            </button>
          </div>
          <p className="text-lg md:text-xl font-bold text-pink-600 mt-1">
            {tr(lang, currentLetter.soundQuoteHe, currentLetter.soundQuoteEn, currentLetter.soundQuoteEs || currentLetter.soundQuoteEn)}
          </p>
          <div className="inline-block mt-2 px-3 py-1 bg-slate-100 rounded-full text-slate-700 text-sm font-semibold">
            {tr(lang, currentLetter.shapeDescriptionHe, currentLetter.shapeDescriptionEn, currentLetter.shapeDescriptionEs || currentLetter.shapeDescriptionEn)}
          </div>

          {/* Pedagogical stress for Bet: Appears at beginning of words */}
          {currentLetter.id === 'bet_dagesh' && (
            <div
              onClick={playLetterName}
              className="mt-3 px-4 py-2 bg-blue-100 hover:bg-blue-200 border-2 border-blue-400 rounded-2xl text-blue-950 font-black text-xs md:text-sm shadow-sm cursor-pointer transition-all flex items-center gap-2 animate-bounce-gentle"
              title={tr(lang, 'לַחֲצוּ לִשְׁמוֹעַ אֶת הַכְּלָל: בֵּית בִּתְחִלַּת מִלָּה!', 'Tap to hear rule: Bet is at word start!', 'Toca para escuchar la regla: ¡Bet va al principio de la palabra!')}
            >
              <span>⭐</span>
              <span>{tr(lang, 'בֵּית מוֹפִיעָה בִּתְחִלַּת מִלָּה (בַּלּוֹן, בַּיִת, בַּנָנָה)!', 'Bet appears at the start of words (Balloon, House, Banana)!', '¡Bet aparece al principio de las palabras (Globo, Casa, Plátano)!')}</span>
              <span className="text-xs bg-blue-200 text-blue-900 px-2 py-0.5 rounded-full font-bold">{tr(lang, '🔊 שְׁמַע', '🔊 Hear', '🔊 Escuchar')}</span>
            </div>
          )}

          {/* Pedagogical stress for Vet: Appears in middle or end of words */}
          {currentLetter.id === 'vet' && (
            <div
              onClick={playLetterName}
              className="mt-3 px-4 py-2 bg-purple-100 hover:bg-purple-200 border-2 border-purple-400 rounded-2xl text-purple-950 font-black text-xs md:text-sm shadow-sm cursor-pointer transition-all flex items-center gap-2 animate-bounce-gentle"
              title={tr(lang, 'לַחֲצוּ לִשְׁמוֹעַ אֶת הַכְּלָל: וֵית בְּאֶמְצַע אוֹ בְּסוֹף מִלָּה!', 'Tap to hear rule: Vet is in middle or end!', 'Toca para escuchar la regla: ¡Vet va en medio o al final!')}
            >
              <span>⭐</span>
              <span>{tr(lang, 'וֵית מוֹפִיעָה בְּאֶמְצַע אוֹ בְּסוֹף מִלָּה (כּוֹכָב, לֵב, עֲנָבִים)!', 'Vet appears in the middle or end of words (Star, Heart, Grapes)!', '¡Vet aparece en medio o al final de las palabras (Estrella, Corazón, Uvas)!')}</span>
              <span className="text-xs bg-purple-200 text-purple-900 px-2 py-0.5 rounded-full font-bold">{tr(lang, '🔊 שְׁמַע', '🔊 Hear', '🔊 Escuchar')}</span>
            </div>
          )}
        </div>

        {/* 3 to 4 Concrete Picture Cards (Faithful to PDF Pages 1-7) */}
        <div className="w-full mt-6">
          <h3 className="text-sm font-bold text-slate-500 mb-3 uppercase tracking-wider">
            {tr(
              lang,
              `⭐ דֻּגְמָאוֹת לְאוֹת ${currentLetter.displayWithNikud}:`,
              `⭐ Examples for ${currentLetter.nameEn}:`,
              `⭐ Ejemplos para ${currentLetter.nameEs || currentLetter.nameEn}:`
            )}
          </h3>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
            {currentLetter.examples.map((ex, idx) => {
              const isSelected = activeExampleIndex === idx;
              return (
                <button
                  key={idx}
                  onClick={() => handleExampleClick(idx, ex)}
                  className={`flex flex-col items-center justify-center p-3 rounded-2xl border-2 transition-all duration-150 btn-press-3d ${
                    isSelected
                      ? 'bg-amber-100 border-amber-400 scale-105 shadow-md'
                      : 'bg-slate-50 border-slate-200 hover:bg-amber-50 hover:border-amber-300'
                  }`}
                >
                  <span className="text-4xl md:text-5xl mb-1 transform hover:scale-110 transition-transform">
                    {ex.emoji}
                  </span>
                  <span className="text-lg font-bold text-slate-800">
                    {ex.he}
                  </span>
                  <span className="text-xs font-medium text-slate-500">
                    {lang === 'es' ? (ex.es || ex.en) : ex.en}
                  </span>
                  <span className="text-[10px] text-pink-600 font-bold mt-0.5">
                    {ex.phonetic}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Letter Selector Grid at Bottom */}
      <div className="bg-white rounded-3xl p-4 border-2 border-slate-200 shadow-sm">
        <h4 className="text-xs font-bold text-slate-400 mb-2 text-center">
          {tr(lang, 'בְּחֲרוּ אוֹת שֶׁרוֹצִים לִלְמוֹד:', 'Pick any letter to learn:', 'Elige cualquier letra para aprender:')}
        </h4>
        <div className="flex flex-wrap justify-center gap-1.5 md:gap-2">
          {LETTERS_DATA.map((item, idx) => {
            const isSelected = idx === currentIndex;
            return (
              <button
                key={item.id}
                onClick={() => {
                  playSound('pop');
                  setCurrentIndex(idx);
                  setActiveExampleIndex(null);
                  setPupikPopped(false);
                  if (soundEnabled) {
                    speakLetterName(item.id);
                  }
                }}
                className={`w-10 h-10 md:w-12 md:h-12 rounded-xl font-black text-lg md:text-xl flex items-center justify-center transition-all duration-100 border-2 ${
                  isSelected
                    ? 'bg-amber-400 text-slate-900 border-amber-600 scale-110 shadow-md ring-2 ring-amber-300'
                    : 'bg-slate-100 text-slate-700 border-slate-200 hover:bg-amber-100'
                }`}
              >
                {item.letter}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
