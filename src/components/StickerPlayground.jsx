import React, { useState } from 'react';
import { Sparkles, Trophy, Star, Plus, RotateCcw, Trash2 } from 'lucide-react';
import { playSound, playPhraseAudio } from '../utils/audio';
import { triggerConfetti } from '../utils/confetti';

const ALL_STICKERS = [
  { id: 'st_balloon', emoji: '🎈', nameHe: 'בַּלּוֹן', starsNeeded: 0 },
  { id: 'st_teddy', emoji: '🧸', nameHe: 'בֻּבָּה / דֹּב', starsNeeded: 2 },
  { id: 'st_watermelon', emoji: '🍉', nameHe: 'אַבַטִּיחַ', starsNeeded: 5 },
  { id: 'st_lion', emoji: '🦁', nameHe: 'אַרְיֵה', starsNeeded: 8 },
  { id: 'st_plane', emoji: '✈️', nameHe: 'אֲוִירוֹן', starsNeeded: 12 },
  { id: 'st_icecream', emoji: '🍦', nameHe: 'גְּלִידָה', starsNeeded: 15 },
  { id: 'st_tractor', emoji: '🚜', nameHe: 'טְרַקְטוֹר', starsNeeded: 20 },
  { id: 'st_rainbow', emoji: '🌈', nameHe: 'קֶשֶׁת', starsNeeded: 25 },
  { id: 'st_crown', emoji: '👑', nameHe: 'כֶּתֶר מְלָכִים', starsNeeded: 30 },
];

export default function StickerPlayground({ lang, soundEnabled, gender = 'boy', stars }) {
  const isHe = lang === 'he';
  const [placedStickers, setPlacedStickers] = useState(() => {
    try {
      const saved = localStorage.getItem('kids_placed_stickers');
      if (saved) return JSON.parse(saved);
    } catch {
      // ignore
    }
    return [
      { id: 1, emoji: '🎈', x: 20, y: 30, scale: 1 },
      { id: 2, emoji: '🧸', x: 60, y: 40, scale: 1 }
    ];
  });

  React.useEffect(() => {
    try {
      localStorage.setItem('kids_placed_stickers', JSON.stringify(placedStickers));
    } catch {
      // ignore
    }
  }, [placedStickers]);

  const handleAddSticker = (sticker) => {
    if (stars < sticker.starsNeeded) {
      playSound('whoosh');
      return;
    }
    playSound('pop');
    triggerConfetti();
    const newSticker = {
      id: Date.now(),
      emoji: sticker.emoji,
      x: Math.floor(Math.random() * 60) + 15,
      y: Math.floor(Math.random() * 50) + 20,
      scale: 1
    };
    setPlacedStickers((prev) => [...prev, newSticker]);
  };

  const handleStickerTap = (id) => {
    playSound('pupik');
    setPlacedStickers((prev) =>
      prev.map((s) => (s.id === id ? { ...s, scale: s.scale === 1 ? 1.4 : 1 } : s))
    );
  };

  const clearStickers = () => {
    playSound('whoosh');
    setPlacedStickers([]);
  };

  return (
    <div
      className="max-w-4xl mx-auto px-4 py-6 flex flex-col gap-6"
      dir={isHe ? 'rtl' : 'ltr'}
    >
      {/* Banner */}
      <div className="bg-gradient-to-r from-fuchsia-500 to-pink-500 rounded-3xl p-6 text-white text-center shadow-lg">
        <span className="text-4xl">🎪 🧸 🎨</span>
        <h2 className="text-2xl md:text-3xl font-black mt-2">
          {isHe ? 'חֲדַר הַמַּדְבֵּקוֹת וְהַפְּרָסִים' : 'Kids Sticker & Trophy Playground'}
        </h2>
        <p className="text-fuchsia-100 text-sm md:text-base mt-1 font-medium">
          {isHe
            ? 'כָּל כּוֹכָב שֶׁמַּרְוִיחִים פּוֹתֵחַ מַדְבֵּקוֹת חֲדָשׁוֹת לְשַׂחֵק אִתָּן!'
            : 'Every star you earn unlocks new fun stickers to play with!'}
        </p>

        <button
          onClick={() => playPhraseAudio('inst_stickers', gender)}
          className="mt-3 inline-flex items-center gap-1.5 px-3 py-1.5 bg-white/20 hover:bg-white/30 rounded-full font-bold text-xs text-white shadow-sm"
          title={isHe ? (gender === 'girl' ? 'הַשְׁמִיעִי הוֹרָאוֹת' : 'הַשְׁמַע הוֹרָאוֹת') : 'Hear Instructions'}
        >
          <Sparkles className="w-4 h-4 text-amber-200" />
          <span>{isHe ? (gender === 'girl' ? '🔊 שִׁמְעִי הוֹרָאוֹת' : '🔊 שְׁמַע הוֹרָאוֹת') : '🔊 Hear Instructions'}</span>
        </button>
      </div>

      {/* Available Sticker Bar */}
      <div className="bg-white rounded-3xl p-4 border-2 border-pink-200 shadow-sm">
        <div className="flex items-center justify-between mb-3 px-2">
          <span className="font-bold text-slate-700 text-sm">
            {isHe ? 'לִחְצוּ עַל מַדְבֵּקָה כְּדֵי לְהוֹסִיף אוֹתָהּ לַלּוּחַ:' : 'Tap a sticker to add it to your playground:'}
          </span>
          <div className="flex items-center gap-1 text-amber-600 font-extrabold text-sm">
            <Star className="w-4 h-4 fill-amber-400" />
            <span>{stars} {isHe ? 'כּוֹכָבִים' : 'Stars'}</span>
          </div>
        </div>

        <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-none">
          {ALL_STICKERS.map((st) => {
            const isUnlocked = stars >= st.starsNeeded;
            return (
              <button
                key={st.id}
                onClick={() => handleAddSticker(st)}
                disabled={!isUnlocked}
                className={`flex flex-col items-center justify-center p-3 rounded-2xl border-2 min-w-20 transition-all ${
                  isUnlocked
                    ? 'bg-amber-50 border-amber-300 hover:scale-105 active:scale-95 shadow-sm'
                    : 'bg-slate-100 border-slate-200 opacity-50 cursor-not-allowed'
                }`}
              >
                <span className="text-4xl">{st.emoji}</span>
                <span className="text-xs font-bold text-slate-700 mt-1">
                  {st.nameHe}
                </span>
                {!isUnlocked && (
                  <span className="text-[10px] text-amber-700 font-extrabold flex items-center gap-0.5 mt-0.5">
                    <Star className="w-3 h-3 fill-amber-400" /> {st.starsNeeded}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Interactive Sticker Canvas */}
      <div className="relative bg-gradient-to-b from-sky-100 via-amber-50 to-emerald-100 rounded-3xl border-4 border-pink-300 h-96 shadow-xl overflow-hidden">
        {/* Sky / Meadow elements */}
        <div className="absolute top-4 left-6 text-4xl opacity-70 pointer-events-none">☁️</div>
        <div className="absolute top-6 right-10 text-5xl opacity-80 pointer-events-none">☀️</div>
        <div className="absolute bottom-2 left-4 text-3xl pointer-events-none">🌸 🌼 🌷</div>
        <div className="absolute bottom-2 right-4 text-3xl pointer-events-none">🌳 🌾 🍄</div>

        {/* Clear Playground button */}
        <div className="absolute top-4 left-4 z-20">
          <button
            onClick={clearStickers}
            className="p-2 bg-white/80 hover:bg-white text-slate-600 rounded-full shadow border border-slate-200"
            title="נקה מדבקות / Clear stickers"
          >
            <Trash2 className="w-5 h-5 text-red-500" />
          </button>
        </div>

        {/* Placed Stickers */}
        {placedStickers.map((s) => (
          <div
            key={s.id}
            onClick={() => handleStickerTap(s.id)}
            style={{
              top: `${s.y}%`,
              left: `${s.x}%`,
              transform: `scale(${s.scale})`,
              transition: 'transform 0.2s cubic-bezier(0.34, 1.56, 0.64, 1)'
            }}
            className="absolute text-6xl md:text-7xl cursor-pointer select-none active:scale-125 hover:drop-shadow-lg"
          >
            {s.emoji}
          </div>
        ))}

        {placedStickers.length === 0 && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none text-slate-400 font-bold text-base">
            {isHe ? 'לִחְצוּ עַל מַדְבֵּקוֹת לְמַעְלָה כְּדֵי לְמַלֵּא אֶת הַלּוּחַ! 🎈' : 'Tap stickers above to decorate your playground! 🎈'}
          </div>
        )}
      </div>
    </div>
  );
}
