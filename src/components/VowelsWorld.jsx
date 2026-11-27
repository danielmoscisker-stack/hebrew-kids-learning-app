import React, { useState } from 'react';
import { Volume2, Sparkles, Smile, Star } from 'lucide-react';
import { VOWELS_DATA, VOWEL_CONTRASTS, VOWEL_TRAIN_ROWS } from '../data/curriculumData';
import { playSound, speakText, playPhraseAudio } from '../utils/audio';
import { triggerConfetti } from '../utils/confetti';
import { useDeviceType } from '../utils/useDeviceType';
import { tr } from '../utils/i18n';

export default function VowelsWorld({ lang, soundEnabled, gender = 'boy', onEarnStar }) {
  const [activeVowel, setActiveVowel] = useState(0);
  const [completedVowelTrain, setCompletedVowelTrain] = useState({});
  const { isTouch } = useDeviceType();

  const isHe = lang === 'he';

  const handleVowelTap = (idx, vowel) => {
    playSound('pop');
    setActiveVowel(idx);
    onEarnStar();
    if (soundEnabled) {
      if (isHe) {
        speakText(`${vowel.sound}. ${vowel.soundHintHe}`, 'he-IL');
      } else if (lang === 'es') {
        speakText(`${vowel.sound}. ${vowel.soundHintEs || vowel.soundHintEn}`, 'es-ES');
      } else {
        speakText(`${vowel.sound}. ${vowel.soundHintEn}`, 'en-US');
      }
    }
  };

  const handleContrastTap = (char, soundQuote) => {
    playSound('pop');
    onEarnStar();
    if (soundEnabled) {
      speakText(soundQuote, 'he-IL');
    }
  };

  const vowelTrainRows = VOWEL_TRAIN_ROWS;

  const handleTrainLetterClick = (rowIdx, char) => {
    playSound('train');
    if (soundEnabled) {
      speakText(char, 'he-IL');
    }
    const key = `vt-${rowIdx}`;
    if (!completedVowelTrain[key]) {
      setCompletedVowelTrain((prev) => ({ ...prev, [key]: true }));
      triggerConfetti();
      onEarnStar();
    }
  };

  return (
    <div
      className="max-w-4xl mx-auto px-4 py-6 flex flex-col gap-6"
      dir={isHe ? 'rtl' : 'ltr'}
    >
      {/* World of Vowels Banner */}
      <div className="bg-gradient-to-r from-purple-500 to-pink-500 rounded-3xl p-6 text-white text-center shadow-lg">
        <span className="text-4xl">🎵 😮 😁 😲</span>
        <h2 className="text-2xl md:text-3xl font-black mt-2">
          {tr(lang, 'עוֹלַם הַנְּקֻדּוֹת שֶׁל הָאוֹתִיּוֹת (לְגִיל 4)', 'World of Vowels & Mouth Sounds (Age 4)', 'El mundo de las vocales y sonidos (4 años)')}
        </h2>
        <p className="text-purple-100 text-sm md:text-base mt-1 font-medium">
          {tr(
            lang,
            'כָּל נְקֻדָּה נוֹתֶנֶת לָאוֹת קוֹל מְיֻחָד • עֲשׂוּ אֶת הַפַּרְצוּף וְתַשְׁמִיעוּ אֶת הַקּוֹל!',
            'Each vowel gives the letter a special sound • Make the face and make the sound!',
            '¡Cada vocal da a la letra un sonido especial • Haz la cara y haz el sonido!'
          )}
        </p>

        <button
          type="button"
          onClick={() => {
            playSound('pop');
            if (soundEnabled) {
              const instKey = isTouch ? 'inst_vowels_touch' : 'inst_vowels_mouse';
              playPhraseAudio(instKey, gender);
            }
          }}
          className="mx-auto mt-3 px-4 py-2 bg-white/20 hover:bg-white/30 rounded-2xl font-black text-xs md:text-sm transition-all btn-press-3d border border-white/40 flex items-center gap-1.5"
        >
          <Volume2 className="w-4 h-4 text-purple-200 animate-pulse" />
          <span>
            {isTouch
              ? tr(
                  lang,
                  gender === 'girl'
                    ? 'גְּעִי עִם הָאֶצְבַּע בַּצְּלִילִים (🔊 שִׁמְעִי הוֹרָאוֹת)'
                    : 'גַּע עִם הָאֶצְבַּע בַּצְּלִילִים (🔊 שְׁמַע הוֹרָאוֹת)',
                  'Tap sounds with finger! (🔊 Hear Instructions)',
                  '¡Toca los sonidos con el dedo! (🔊 Escuchar instrucciones)'
                )
              : tr(
                  lang,
                  gender === 'girl'
                    ? 'לַחֲצִי עַל הַצְּלִילִים! (🔊 שִׁמְעִי הוֹרָאוֹת)'
                    : 'לְחַץ עַל הַצְּלִילִים! (🔊 שְׁמַע הוֹרָאוֹת)',
                  'Click the sounds! (🔊 Hear Instructions)',
                  '¡Haz clic en los sonidos! (🔊 Escuchar instrucciones)'
                )}
          </span>
        </button>
      </div>

      {/* 5 Core Vowel Face Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
        {VOWELS_DATA.map((vowel, idx) => {
          const isSelected = activeVowel === idx;
          return (
            <button
              key={vowel.id}
              onClick={() => handleVowelTap(idx, vowel)}
              className={`p-4 rounded-3xl border-4 transition-all duration-200 btn-press-3d flex flex-col items-center text-center cursor-pointer ${
                isSelected
                  ? 'border-pink-500 bg-pink-50 shadow-xl scale-105 ring-4 ring-pink-300 animate-jelly'
                  : 'border-slate-200 bg-white hover:border-purple-400 hover:scale-105 hover:shadow-md'
              }`}
            >
              <span className={`text-5xl md:text-6xl mb-2 transition-transform duration-200 ${isSelected ? 'animate-wiggle scale-125' : 'animate-bounce-gentle'}`}>
                {vowel.faceEmoji}
              </span>
              <span className="text-3xl font-black text-slate-800">
                {vowel.symbolHe}
              </span>
              <span className="text-xl font-black text-pink-600 mt-1">
                "{vowel.sound}"
              </span>
              <span className="text-xs font-bold text-slate-600 mt-1">
                {tr(lang, vowel.nameHe, vowel.nameEn, vowel.nameEs || vowel.nameEn)}
              </span>
              <p className="text-[11px] text-slate-500 font-medium mt-2 leading-tight">
                {tr(lang, vowel.soundHintHe, vowel.soundHintEn, vowel.soundHintEs || vowel.soundHintEn)}
              </p>
            </button>
          );
        })}
      </div>

      {/* Contrast Practice: Boom vs Wind with Vowels (דף 14) */}
      <div className="bg-white rounded-3xl p-6 border-3 border-amber-300 shadow-md">
        <div className="flex items-center gap-2 mb-3">
          <Sparkles className="w-5 h-5 text-amber-500" />
          <h3 className="text-lg md:text-xl font-black text-slate-800">
            {tr(lang, 'שִׂימוּ לֵב: בּוּם (בּ) מוּל רוּחַ (ב) עִם נְקֻדּוֹת!', 'Notice: Boom (בּ) vs Wind (ב) with Vowels!', '¡Fíjate: Bum (בּ) vs Viento (ב) con vocales!')}
          </h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {VOWEL_CONTRASTS.map((item, idx) => (
            <div key={idx} className="bg-amber-50/70 border-2 border-amber-200 rounded-2xl p-3 flex flex-col items-center gap-2">
              <span className="text-xs font-bold text-slate-600">{tr(lang, item.desc, item.descEn || item.desc, item.descEs || item.desc)}</span>
              <div className="flex gap-4">
                <button
                  onClick={() => handleContrastTap(item.left, item.leftSound)}
                  className="w-14 h-14 rounded-2xl bg-blue-500 hover:bg-blue-600 active:scale-95 text-white font-black text-2xl flex flex-col items-center justify-center shadow btn-press-3d"
                >
                  <span>{item.left}</span>
                  <span className="text-[10px] font-bold">"{item.leftSound}"</span>
                </button>

                <button
                  onClick={() => handleContrastTap(item.right, item.rightSound)}
                  className="w-14 h-14 rounded-2xl bg-purple-500 hover:bg-purple-600 active:scale-95 text-white font-black text-2xl flex flex-col items-center justify-center shadow btn-press-3d"
                >
                  <span>{item.right}</span>
                  <span className="text-[10px] font-bold">"{item.rightSound}"</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Vowel Reading Train from Right to Left (דף 14) */}
      <div className="bg-white rounded-3xl p-6 border-3 border-teal-300 shadow-md">
        <h3 className="text-lg md:text-xl font-black text-slate-800 mb-1">
          {tr(lang, '🚂 רַכֶּבֶת קְרִיאָה עִם נְקֻדּוֹת: מ-א\' עַד ה\'', '🚂 Vowel Reading Train: Alef to He', '🚂 Tren de lectura con vocales: de Álef a He')}
        </h3>
        <p className="text-xs text-slate-500 mb-4 font-medium">
          {tr(lang, 'שִׂימוּ אֶצְבַּע מִיָּמִין לִשְׂמֹאל • קוֹרְאִים אֶת הָאוֹת עִם הַנְּקֻדָּה שֶׁלָּהּ!', 'Read right-to-left • Read the letter with its vowel!', 'Lee de derecha a izquierda • ¡Lee la letra con su vocal!')}
        </p>

        <div className="flex flex-col gap-3">
          {vowelTrainRows.map((row, rowIdx) => {
            const isCompleted = completedVowelTrain[`vt-${rowIdx}`];
            return (
              <div key={rowIdx} className="flex flex-col sm:flex-row items-center justify-between gap-2 p-3 bg-teal-50/60 border border-teal-200 rounded-2xl">
                <div className="flex items-center gap-2">
                  <span className="text-2xl">{row.emoji}</span>
                  <span className="font-extrabold text-slate-800 text-sm">
                    {tr(lang, row.titleHe, row.titleEn, row.titleEs || row.titleEn)}
                  </span>
                </div>

                <div className="flex items-center gap-2" dir="rtl">
                  {row.letters.map((char, charIdx) => (
                    <button
                      key={charIdx}
                      onClick={() => handleTrainLetterClick(rowIdx, char)}
                      className="w-11 h-12 rounded-xl bg-white hover:bg-teal-100 active:scale-95 border-2 border-teal-300 font-black text-2xl text-teal-900 flex items-center justify-center shadow-sm btn-press-3d"
                    >
                      {char}
                    </button>
                  ))}

                  <div className="w-10 h-10 rounded-xl bg-white border border-amber-300 flex items-center justify-center">
                    <Star className={`w-6 h-6 ${isCompleted ? 'fill-amber-400 text-amber-500 animate-bounce' : 'text-slate-300'}`} />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
