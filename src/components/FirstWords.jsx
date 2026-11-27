import React, { useState } from 'react';
import { Sparkles, Wand2, Star, Trophy, RefreshCw, Volume2 } from 'lucide-react';
import { FIRST_WORDS_DATA } from '../data/curriculumData';
import { playSound, playWordAudio, playPhraseAudio, speakText } from '../utils/audio';
import { triggerConfetti, triggerStarBurst } from '../utils/confetti';
import { useDeviceType } from '../utils/useDeviceType';
import { tr } from '../utils/i18n';

export default function FirstWords({ lang, soundEnabled, gender = 'boy', onEarnStar }) {
  const [activeWordIdx, setActiveWordIdx] = useState(0);
  const [blendedWords, setBlendedWords] = useState({});
  const [activeSyllable, setActiveSyllable] = useState(null);
  const { isTouch } = useDeviceType();

  const isHe = lang === 'he';
  const currentWord = FIRST_WORDS_DATA[activeWordIdx];
  const isBlended = blendedWords[currentWord.id];

  const handleSyllableClick = (idx, syl) => {
    playSound('pop');
    setActiveSyllable(idx);
    if (soundEnabled) {
      speakText(syl, 'he-IL');
    }
  };

  const WORD_AUDIO_MAP = {
    'word-abba': 'daddy',
    'word-buba': 'doll_teddy',
    'word-dag': 'fish',
    'word-gag': 'roof'
  };

  const handleBlendWord = () => {
    playSound('win');
    setBlendedWords((prev) => ({ ...prev, [currentWord.id]: true }));
    triggerStarBurst();
    onEarnStar();

    if (soundEnabled) {
      const audioKey = WORD_AUDIO_MAP[currentWord.id];
      if (audioKey) {
        playWordAudio(audioKey);
      }
    }
  };

  const handleNextWord = () => {
    playSound('whoosh');
    setActiveWordIdx((prev) => (prev + 1) % FIRST_WORDS_DATA.length);
    setActiveSyllable(null);
  };

  const handlePrevWord = () => {
    playSound('whoosh');
    setActiveWordIdx((prev) => (prev - 1 + FIRST_WORDS_DATA.length) % FIRST_WORDS_DATA.length);
    setActiveSyllable(null);
  };

  return (
    <div
      className="max-w-4xl mx-auto px-4 py-6 flex flex-col gap-6"
      dir={isHe ? 'rtl' : 'ltr'}
    >
      {/* Banner */}
      <div className="bg-gradient-to-r from-emerald-500 to-teal-600 rounded-3xl p-6 text-white text-center shadow-lg">
        <span className="text-4xl">🎉 📖 🏆</span>
        <h2 className="text-2xl md:text-3xl font-black mt-2">
          {tr(lang, 'יְלָדִים כְּבָר קוֹרְאִים מִלִּים אֲמִתִּיּוֹת!', 'Kids are Reading Real Words! (Page 15)', '¡Los niños ya leen palabras reales!')}
        </h2>
        <p className="text-emerald-100 text-sm md:text-base mt-1 font-medium">
          {tr(
            lang,
            'קִרְאוּ אֶת הַחֲלָקִים, חַבְּרוּ אוֹתָם יַחַד וְגַלּוּ אֶת הַמִּלָּה!',
            'Read the syllables, blend them together, and discover the word!',
            '¡Lee las sílabas, únelas y descubre la palabra!'
          )}
        </p>

        <button
          type="button"
          onClick={() => {
            playSound('pop');
            const instKey = isTouch ? 'inst_first_words_touch' : 'inst_first_words_mouse';
            playPhraseAudio(instKey, gender);
          }}
          className="mx-auto mt-3 px-4 py-2 bg-white/20 hover:bg-white/30 rounded-2xl font-black text-xs md:text-sm transition-all btn-press-3d border border-white/40 flex items-center gap-1.5"
        >
          <Volume2 className="w-4 h-4 text-emerald-200 animate-pulse" />
          <span>
            {isTouch
              ? tr(
                  lang,
                  gender === 'girl'
                    ? 'גְּעִי עִם הָאֶצְבַּע בַּמִּלִּים (🔊 שִׁמְעִי הוֹרָאוֹת)'
                    : 'גַּע עִם הָאֶצְבַּע בַּמִּלִּים (🔊 שְׁמַע הוֹרָאוֹת)',
                  'Tap words with finger! (🔊 Hear Instructions)',
                  '¡Toca las palabras con el dedo! (🔊 Escuchar instrucciones)'
                )
              : tr(
                  lang,
                  gender === 'girl'
                    ? 'הַעֲבִירִי עַכְבָּר עַל הַמִּלִּים (🔊 שִׁמְעִי הוֹרָאוֹת)'
                    : 'הַעֲבֵר עַכְבָּר עַל הַמִּלִּים (🔊 שְׁמַע הוֹרָאוֹת)',
                  'Move mouse over words! (🔊 Hear Instructions)',
                  '¡Pasa el ratón sobre las palabras! (🔊 Escuchar instrucciones)'
                )}
          </span>
        </button>
      </div>

      {/* Word Cards Tabs */}
      <div className="flex justify-center gap-2 overflow-x-auto pb-1">
        {FIRST_WORDS_DATA.map((w, idx) => {
          const isDone = blendedWords[w.id];
          return (
            <button
              key={w.id}
              onClick={() => {
                playSound('pop');
                setActiveWordIdx(idx);
                setActiveSyllable(null);
              }}
              className={`flex items-center gap-2 px-4 py-2 rounded-2xl font-black text-sm md:text-base transition-all btn-press-3d border-2 ${
                activeWordIdx === idx
                  ? 'bg-amber-400 text-slate-900 border-amber-500 scale-105 shadow-md'
                  : 'bg-white text-slate-700 border-slate-200 hover:bg-emerald-50'
              }`}
            >
              <span>{w.emoji}</span>
              <span>{w.wordHe}</span>
              {isDone && <Star className="w-4 h-4 fill-amber-500 text-amber-500" />}
            </button>
          );
        })}
      </div>

      {/* Main Interactive Blending Stage */}
      <div className="bg-white rounded-3xl p-8 border-4 border-emerald-400 shadow-xl flex flex-col items-center text-center relative overflow-hidden">
        {/* Syllable Blocks vs Blended Word */}
        {!isBlended ? (
          <div className="flex flex-col items-center gap-6 my-6 w-full">
            <div className="text-sm font-bold text-slate-500">
              {tr(lang, 'לִחְצוּ עַל כָּל חֵלֶק כְּדֵי לִשְׁמוֹעַ אוֹתוֹ:', 'Tap each syllable block to hear it:', 'Toca cada sílaba para escucharla:')}
            </div>

            {/* Syllable Blocks in Hebrew Right-to-Left order */}
            <div className="flex items-center justify-center gap-4" dir="rtl">
              {currentWord.syllables.map((syl, sIdx) => {
                const isActive = activeSyllable === sIdx;
                return (
                  <React.Fragment key={sIdx}>
                    <button
                      onClick={() => handleSyllableClick(sIdx, syl)}
                      className={`w-28 h-28 md:w-36 md:h-36 rounded-3xl border-4 font-black text-5xl md:text-6xl flex items-center justify-center transition-all duration-200 btn-press-3d cursor-pointer ${
                        isActive
                          ? 'bg-amber-300 text-indigo-900 border-amber-500 scale-110 shadow-xl ring-4 ring-amber-300 animate-jelly'
                          : 'bg-emerald-50 text-emerald-900 border-emerald-300 hover:bg-emerald-100 hover:scale-105'
                      }`}
                    >
                      <span className={isActive ? 'animate-wiggle' : ''}>{syl}</span>
                    </button>
                    {sIdx < currentWord.syllables.length - 1 && (
                      <span className="text-3xl font-black text-emerald-500 animate-pulse">
                        +
                      </span>
                    )}
                  </React.Fragment>
                );
              })}
            </div>

            {/* Magic Blend Button */}
            <button
              onClick={handleBlendWord}
              className="mt-4 flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-pink-500 to-amber-500 hover:from-pink-600 hover:to-amber-600 text-white font-black text-xl rounded-full shadow-lg btn-press-3d animate-pulse"
            >
              <Wand2 className="w-7 h-7" />
              <span>{tr(lang, 'חַבְּרוּ אֶת הַמִּלָּה! ✨', 'Blend Word Together! ✨', '¡Unir la palabra! ✨')}</span>
            </button>
          </div>
        ) : (
          /* Blended Result Card */
          <div className="flex flex-col items-center gap-4 my-4 animate-pop-in">
            <span className="text-8xl md:text-9xl transform hover:scale-110 transition-transform">
              {currentWord.emoji}
            </span>
            <div className="text-6xl md:text-7xl font-black text-emerald-800 tracking-wide">
              {currentWord.wordHe}!
            </div>
            <div className="text-xl font-bold text-slate-500">
              {lang === 'es' ? (currentWord.wordEs || currentWord.wordEn) : currentWord.wordEn}
            </div>
            <div className="px-5 py-2 bg-emerald-100 border border-emerald-300 text-emerald-900 font-extrabold rounded-full text-base">
              {tr(lang, currentWord.descriptionHe, currentWord.descriptionEn, currentWord.descriptionEs || currentWord.descriptionEn)}
            </div>

            <div className="flex gap-3 mt-4">
              <button
                onClick={() => {
                  playSound('whoosh');
                  setBlendedWords((prev) => ({ ...prev, [currentWord.id]: false }));
                }}
                className="flex items-center gap-1.5 px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl text-sm"
              >
                <RefreshCw className="w-4 h-4" />
                <span>{tr(lang, 'פָּרֵק שׁוּב', 'Unblend', 'Separar')}</span>
              </button>
              <button
                onClick={handleNextWord}
                className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-black rounded-xl text-base shadow btn-press-3d"
              >
                {tr(lang, 'מִלָּה הַבָּאָה! ⬅️', 'Next Word! ➡️', '¡Siguiente palabra! ➡️')}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
