import React, { useRef } from 'react';
import { Volume2, Sparkles, Star, Crown, Flame, Cloud } from 'lucide-react';
import { playSound, playAudioFile, playPhraseAudio } from '../utils/audio';
import { useDeviceType } from '../utils/useDeviceType';

export const ACTIVITY_TILES = [
  {
    id: 'letters',
    icon: '🔤',
    badge: 'א בּ ג',
    titleHe: 'אוֹתִיּוֹת',
    titleEn: 'Letters',
    descHe: 'מַכִּירִים אֶת הָאָלֶף-בֵּית',
    descEn: 'Meet the Alef-Bet',
    gradient: 'from-amber-300 via-yellow-300 to-orange-300',
    border: 'border-amber-500',
    text: 'text-amber-950'
  },
  {
    id: 'quiz',
    icon: '🎯',
    badge: '?',
    titleHe: 'אֵיזוֹ אוֹת זֹאת?',
    titleEn: 'Letter Quiz',
    descHe: 'שׁוֹמְעִים וּמְגַלִּים',
    descEn: 'Listen & Find',
    gradient: 'from-orange-300 via-rose-300 to-pink-300',
    border: 'border-rose-500',
    text: 'text-rose-950'
  },
  {
    id: 'train',
    icon: '🚂',
    badge: 'א←ב',
    titleHe: 'רַכֶּבֶת הַקְּרִיאָה',
    titleEn: 'Reading Train',
    descHe: 'קוֹרְאִים מִיָּמִין לִשְׂמֹאל',
    descEn: 'Read Right-to-Left',
    gradient: 'from-sky-300 via-blue-300 to-indigo-300',
    border: 'border-blue-500',
    text: 'text-blue-950'
  },
  {
    id: 'detective',
    icon: '🕵️‍♂️',
    badge: 'בּ / ב',
    titleHe: 'בַּלָּשׁ הַפּוּפִּיק',
    titleEn: 'Pupik Detective',
    descHe: 'מְגַלִּים אֶת הַנְּקֻדָּה',
    descEn: 'Find the Belly Dot',
    gradient: 'from-red-300 via-pink-300 to-rose-300',
    border: 'border-red-500',
    text: 'text-red-950'
  },
  {
    id: 'numbers',
    icon: '🔢',
    badge: '123',
    titleHe: 'מִסְפָּרִים 1–10',
    titleEn: 'Numbers 1–10',
    descHe: 'סוֹפְרִים וּמְפוֹצְצִים',
    descEn: 'Count & Pop Balloons',
    gradient: 'from-amber-200 via-lime-300 to-emerald-300',
    border: 'border-lime-600',
    text: 'text-lime-950'
  },
  {
    id: 'memory',
    icon: '🃏',
    badge: '⭐',
    titleHe: 'מִשְׂחַק זִכָּרוֹן',
    titleEn: 'Memory Game',
    descHe: 'מוֹצְאִים זוּגוֹת',
    descEn: 'Match Pairs',
    gradient: 'from-pink-300 via-rose-200 to-amber-200',
    border: 'border-pink-500',
    text: 'text-pink-950'
  },
  {
    id: 'stickers',
    icon: '🎪',
    badge: '🏆',
    titleHe: 'הַמַּדְבֵּקוֹת שֶׁלִּי',
    titleEn: 'My Stickers',
    descHe: 'פְּרָסִים וּמַדְבֵּקוֹת',
    descEn: 'Rewards & Playboard',
    gradient: 'from-fuchsia-300 via-purple-300 to-indigo-300',
    border: 'border-fuchsia-500',
    text: 'text-fuchsia-950'
  },
  {
    id: 'vowels',
    icon: '🎵',
    badge: 'אָ אִ אוֹ',
    titleHe: 'עוֹלַם הַנִּקּוּד',
    titleEn: 'Vowel World',
    descHe: 'צְלִילִים וּפַרְצוּפִים',
    descEn: 'Sounds & Faces',
    gradient: 'from-purple-300 via-fuchsia-300 to-pink-300',
    border: 'border-purple-500',
    text: 'text-purple-950',
    isProFeature: true
  },
  {
    id: 'first_words',
    icon: '📖',
    badge: 'אַבָּא',
    titleHe: 'מִלִּים רִאשׁוֹנוֹת',
    titleEn: 'First Words',
    descHe: 'מְחַבְּרִים מִלִּים',
    descEn: 'Blend Real Words',
    gradient: 'from-emerald-300 via-teal-300 to-cyan-300',
    border: 'border-emerald-500',
    text: 'text-emerald-950',
    isProFeature: true
  },
  {
    id: 'tracing',
    icon: '🎨',
    badge: '✍️',
    titleHe: 'צִיּוּר וּכְתִיבָה',
    titleEn: 'Draw & Trace',
    descHe: 'צוֹבְעִים אוֹתִיּוֹת',
    descEn: 'Color & Write',
    gradient: 'from-teal-300 via-cyan-300 to-sky-300',
    border: 'border-teal-500',
    text: 'text-teal-950',
    isProFeature: true
  },
  {
    id: 'opening_sound',
    icon: '🔊',
    badge: 'א?',
    titleHe: 'הַקּוֹל הַפּוֹתֵחַ',
    titleEn: 'Opening Sound',
    descHe: 'בְּאֵיזוֹ אוֹת מַתְחִיל?',
    descEn: 'First Sound Match',
    gradient: 'from-violet-300 via-purple-300 to-fuchsia-300',
    border: 'border-violet-500',
    text: 'text-violet-950',
    isProFeature: true
  },
  {
    id: 'math_play',
    icon: '🍎',
    badge: '1+2',
    titleHe: 'חֶשְׁבּוֹן רִאשׁוֹן',
    titleEn: 'First Math',
    descHe: 'סוֹפְרִים פֵּרוֹת יַחַד',
    descEn: 'Fruit Addition',
    gradient: 'from-lime-300 via-emerald-300 to-teal-300',
    border: 'border-emerald-600',
    text: 'text-emerald-950',
    isProFeature: true
  }
];

export default function HomeHub({
  lang,
  soundEnabled,
  gender = 'boy',
  stars,
  streakDays = 1,
  dailyStars = 0,
  isPro = false,
  user = null,
  onSelectActivity,
  onOpenPro,
  onOpenParentGate,
  needsGenderPick,
  onPickGender
}) {
  const isHe = lang === 'he';
  const { isTouch } = useDeviceType();
  const lastSpokenTileRef = useRef({ id: null, time: 0 });

  const speakTile = (tileId, e = null) => {
    if (e && e.stopPropagation) e.stopPropagation();
    if (!soundEnabled) return;
    const now = Date.now();
    if (lastSpokenTileRef.current.id === tileId && now - lastSpokenTileRef.current.time < 900) {
      return;
    }
    lastSpokenTileRef.current = { id: tileId, time: now };
    const prefix = isHe ? '' : 'en_';
    playAudioFile(`/audio/tiles/${prefix}${tileId}.mp3`);
  };

  const dailyGoal = 5;
  const dailyPct = Math.min(100, Math.round((dailyStars / dailyGoal) * 100));

  return (
    <div className="max-w-5xl mx-auto px-4 py-5 flex flex-col gap-5" dir={isHe ? 'rtl' : 'ltr'}>
      {/* Friendly First-Launch Who-Is-Playing Card */}
      {needsGenderPick && (
        <div className="bg-white/95 border-4 border-amber-400 rounded-3xl p-5 md:p-6 shadow-xl text-center animate-pop-in">
          <div className="flex items-center justify-center gap-2 mb-3">
            <button
              type="button"
              onClick={() => soundEnabled && playAudioFile('/audio/phrases/who_plays.mp3')}
              className="inline-flex items-center gap-2 px-4 py-1.5 bg-amber-100 hover:bg-amber-200 text-amber-900 rounded-full font-black text-sm btn-press-3d"
            >
              <Volume2 className="w-4 h-4 text-amber-700 animate-pulse" />
              <span>{isHe ? 'מִי מְשַׂחֵק הַיּוֹם?' : 'Who is playing today?'}</span>
            </button>
          </div>
          <div className="grid grid-cols-2 gap-4 max-w-md mx-auto">
            <button
              type="button"
              onClick={() => onPickGender('boy')}
              className="p-4 rounded-3xl bg-gradient-to-b from-sky-100 to-blue-200 border-4 border-blue-400 hover:scale-105 transition flex flex-col items-center gap-1 btn-press-3d cursor-pointer"
            >
              <span className="text-5xl md:text-6xl animate-bounce-gentle">👦</span>
              <span className="text-xl font-black text-blue-950">{isHe ? 'יֶלֶד' : 'Boy'}</span>
            </button>
            <button
              type="button"
              onClick={() => onPickGender('girl')}
              className="p-4 rounded-3xl bg-gradient-to-b from-pink-100 to-rose-200 border-4 border-pink-400 hover:scale-105 transition flex flex-col items-center gap-1 btn-press-3d cursor-pointer"
            >
              <span className="text-5xl md:text-6xl animate-bounce-gentle">👧</span>
              <span className="text-xl font-black text-pink-950">{isHe ? 'יַלְדָּה' : 'Girl'}</span>
            </button>
          </div>
        </div>
      )}

      {/* Playroom Welcome + Daily Progress Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 p-5 md:p-6 text-white shadow-xl border-4 border-white">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-4 text-center md:text-start">
            <div className="w-16 h-16 md:w-20 md:h-20 rounded-3xl bg-white/25 backdrop-blur-sm border-2 border-white/60 flex items-center justify-center text-4xl md:text-5xl shadow-inner animate-bounce-gentle flex-shrink-0">
              {gender === 'girl' ? '👧' : '👦'}
            </div>
            <div>
              <h2 className="text-2xl md:text-3xl font-black tracking-tight flex items-center justify-center md:justify-start gap-2">
                <span>{isHe ? 'שָׁלוֹם! מָה נִלְמַד הַיּוֹם?' : 'Hi! What shall we play?'}</span>
                <Sparkles className="w-6 h-6 text-amber-300 animate-pulse" />
              </h2>
              <p className="text-white/90 text-sm md:text-base font-bold mt-1">
                {isHe
                  ? isTouch
                    ? gender === 'girl'
                      ? 'גְּעִי בְּמִשְׂחָק כְּדֵי לְהַתְחִיל!'
                      : 'גַּע בְּמִשְׂחָק כְּדֵי לְהַתְחִיל!'
                    : gender === 'girl'
                      ? 'הַעֲבִירִי עַכְבָּר כְּדֵי לִשְׁמוֹעַ, וְלַחֲצִי כְּדֵי לְשַׂחֵק!'
                      : 'הַעֲבֵר עַכְבָּר כְּדֵי לִשְׁמוֹעַ, וּלְחַץ כְּדֵי לְשַׂחֵק!'
                  : isTouch
                    ? 'Tap any game to start playing!'
                    : 'Hover to hear the game name, click to play!'}
              </p>

              {/* Daily Goal Progress Bar */}
              <div className="mt-3 flex flex-wrap items-center justify-center md:justify-start gap-2">
                <div className="flex items-center gap-1.5 bg-white/20 px-3 py-1 rounded-full text-xs font-black">
                  <Flame className="w-4 h-4 text-amber-300 fill-amber-300" />
                  <span>{isHe ? `רֶצֶף: ${streakDays} יָמִים` : `${streakDays}-Day Streak`}</span>
                </div>
                <div className="flex items-center gap-2 bg-white/20 px-3 py-1 rounded-full text-xs font-black">
                  <span>{isHe ? `יַעַד יוֹמִי:` : 'Daily Goal:'}</span>
                  <div className="w-20 h-2.5 bg-white/30 rounded-full overflow-hidden">
                    <div className="h-full bg-amber-300 rounded-full transition-all duration-300" style={{ width: `${dailyPct}%` }} />
                  </div>
                  <bdi>{Math.min(dailyStars, dailyGoal)}/{dailyGoal} ⭐</bdi>
                </div>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-2">
            <button
              type="button"
              onClick={() => soundEnabled && playPhraseAudio('welcome_home', gender)}
              className="flex items-center gap-2 px-4 py-2.5 bg-white/25 hover:bg-white/35 rounded-2xl font-black text-sm border-2 border-white/50 btn-press-3d cursor-pointer"
            >
              <Volume2 className="w-5 h-5 text-amber-200 animate-pulse" />
              <span>{isHe ? '🔊 שְׁמַע' : '🔊 Listen'}</span>
            </button>

            {!isPro && (
              <button
                type="button"
                onClick={() => {
                  playSound('pop');
                  onOpenPro();
                }}
                className="flex items-center gap-1.5 px-4 py-2.5 bg-amber-300 hover:bg-amber-400 text-amber-950 rounded-2xl font-black text-sm border-2 border-white shadow btn-press-3d cursor-pointer"
              >
                <Crown className="w-4 h-4 text-amber-800" />
                <span>{isHe ? 'גִּרְסָה מְלֵאָה' : 'Unlock All'}</span>
              </button>
            )}

            <button
              type="button"
              onClick={() => {
                playSound('pop');
                onOpenParentGate();
              }}
              className="flex items-center gap-1.5 px-3.5 py-2.5 bg-white/20 hover:bg-white/30 text-white rounded-2xl font-bold text-xs border border-white/40 btn-press-3d cursor-pointer"
              title={isHe ? 'שְׁמִירַת הִתְקַדְּמוּת בֶּעָנָן' : 'Cloud Save'}
            >
              <Cloud className="w-4 h-4" />
              <span>{user ? '✓ Google' : isHe ? 'שְׁמִירָה' : 'Save'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Big Joyful Activity Tiles Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
        {ACTIVITY_TILES.map((tile) => {
          const locked = Boolean(tile.isProFeature && !isPro);
          return (
            <div
              key={tile.id}
              role="button"
              tabIndex={0}
              onClick={() => {
                playSound('pop');
                if (locked) {
                  onOpenPro();
                } else {
                  onSelectActivity(tile.id);
                }
              }}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  playSound('pop');
                  if (locked) onOpenPro();
                  else onSelectActivity(tile.id);
                }
              }}
              onMouseEnter={() => {
                if (!isTouch) speakTile(tile.id);
              }}
              className={`relative rounded-3xl bg-gradient-to-b ${tile.gradient} border-4 ${tile.border} p-4 md:p-5 flex flex-col items-center justify-between text-center min-h-[168px] cursor-pointer btn-press-3d group select-none shadow-md hover:shadow-xl`}
            >
              {/* Top row: badge / PRO crown + speaker button */}
              <div className="w-full flex items-center justify-between">
                {locked ? (
                  <span className="inline-flex items-center gap-1 text-[11px] font-black bg-amber-400 text-amber-950 px-2.5 py-0.5 rounded-full shadow-sm border border-white">
                    <Crown className="w-3 h-3" /> PRO
                  </span>
                ) : (
                  <span className="text-[11px] font-black bg-white/85 text-slate-800 px-2.5 py-0.5 rounded-full shadow-sm">
                    {tile.badge}
                  </span>
                )}
                <button
                  type="button"
                  onClick={(e) => speakTile(tile.id, e)}
                  aria-label={isHe ? tile.titleHe : tile.titleEn}
                  className="w-9 h-9 rounded-full bg-white/90 hover:bg-white flex items-center justify-center shadow-sm border border-white transition-transform group-hover:scale-110 cursor-pointer"
                >
                  <Volume2 className="w-4 h-4 text-indigo-600" />
                </button>
              </div>

              {/* Big joyful icon */}
              <div className="text-5xl md:text-6xl my-2 transition-transform duration-200 group-hover:scale-115 group-hover:animate-wiggle drop-shadow-sm">
                {tile.icon}
              </div>

              {/* Title & short subtitle */}
              <div>
                <div className={`text-lg md:text-xl font-black leading-tight ${tile.text}`}>
                  {isHe ? tile.titleHe : tile.titleEn}
                </div>
                <div className={`text-xs font-bold opacity-85 mt-0.5 ${tile.text}`}>
                  {isHe ? tile.descHe : tile.descEn}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
