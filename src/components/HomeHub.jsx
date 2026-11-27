import React, { useRef } from 'react';
import { Volume2, Sparkles, Crown, Flame, Cloud, Lock, Users } from 'lucide-react';
import { playSound, playAudioFile, playPhraseAudio, speakText } from '../utils/audio';
import { tr } from '../utils/i18n';
import { useDeviceType } from '../utils/useDeviceType';

export const ACTIVITY_TILES = [
  /* ===================== AGE 4 (PRESCHOOL) ===================== */
  {
    id: 'letters',
    ages: [4],
    icon: '🔤',
    badge: 'א בּ ג',
    titleHe: 'אוֹתִיּוֹת',
    titleEn: 'Letters',
    titleEs: 'Letras',
    descHe: 'מַכִּירִים אֶת הָאָלֶף-בֵּית',
    descEn: 'Meet the Alef-Bet',
    descEs: 'Conoce el Alef-Bet',
    gradient: 'from-amber-300 via-yellow-300 to-orange-300',
    border: 'border-amber-500',
    text: 'text-amber-950'
  },
  {
    id: 'quiz',
    ages: [4],
    icon: '🎯',
    badge: '?',
    titleHe: 'אֵיזוֹ אוֹת זֹאת?',
    titleEn: 'Letter Quiz',
    titleEs: '¿Qué letra es?',
    descHe: 'שׁוֹמְעִים וּמְגַלִּים',
    descEn: 'Listen & Find',
    descEs: 'Escucha y encuentra',
    gradient: 'from-orange-300 via-rose-300 to-pink-300',
    border: 'border-rose-500',
    text: 'text-rose-950'
  },
  {
    id: 'train',
    ages: [4],
    icon: '🚂',
    badge: 'א←ב',
    titleHe: 'רַכֶּבֶת הַקְּרִיאָה',
    titleEn: 'Reading Train',
    titleEs: 'Tren de Lectura',
    descHe: 'קוֹרְאִים מִיָּמִין לִשְׂמֹאל',
    descEn: 'Read Right-to-Left',
    descEs: 'Lee de derecha a izquierda',
    gradient: 'from-sky-300 via-blue-300 to-indigo-300',
    border: 'border-blue-500',
    text: 'text-blue-950'
  },
  {
    id: 'detective',
    ages: [4],
    icon: '🕵️‍♂️',
    badge: 'בּ / ב',
    titleHe: 'בַּלָּשׁ הַפּוּפִּיק',
    titleEn: 'Pupik Detective',
    titleEs: 'Detective Pupik',
    descHe: 'מְגַלִּים אֶת הַנְּקֻדָּה',
    descEn: 'Find the Belly Dot',
    descEs: 'Encuentra el puntito',
    gradient: 'from-red-300 via-pink-300 to-rose-300',
    border: 'border-red-500',
    text: 'text-red-950'
  },
  {
    id: 'numbers',
    ages: [4],
    icon: '🔢',
    badge: '123',
    titleHe: 'מִסְפָּרִים 1–10',
    titleEn: 'Numbers 1–10',
    titleEs: 'Números 1–10',
    descHe: 'סוֹפְרִים וּמְפוֹצְצִים',
    descEn: 'Count & Pop Balloons',
    descEs: 'Cuenta y explota globos',
    gradient: 'from-amber-200 via-lime-300 to-emerald-300',
    border: 'border-lime-600',
    text: 'text-lime-950'
  },
  {
    id: 'memory',
    ages: [4],
    icon: '🃏',
    badge: '⭐',
    titleHe: 'מִשְׂחַק זִכָּרוֹן',
    titleEn: 'Memory Game',
    titleEs: 'Juego de Memoria',
    descHe: 'מוֹצְאִים זוּגוֹת',
    descEn: 'Match Pairs',
    descEs: 'Encuentra las parejas',
    gradient: 'from-pink-300 via-rose-200 to-amber-200',
    border: 'border-pink-500',
    text: 'text-pink-950'
  },

  /* ===================== AGE 7 (GRADES 1–2 / כִּתָּה א׳–ב׳) ===================== */
  {
    id: 'math_age7',
    ages: [7],
    icon: '🧮',
    badge: 'גִּיל 7',
    titleHe: 'חֶשְׁבּוֹן גִּיל 7',
    titleEn: 'Math • Age 7',
    titleEs: 'Mates • Edad 7',
    descHe: 'כִּתָּה א׳–ב׳ • חִבּוּר, כֶּפֶל וְ-₪',
    descEn: 'Grades 1–2 • Add, × & ₪',
    descEs: 'Grados 1–2 • Sumas, × y ₪',
    gradient: 'from-cyan-300 via-sky-300 to-blue-300',
    border: 'border-sky-500',
    text: 'text-sky-950',
    useSpeechFallback: true
  },
  {
    id: 'hebrew_age7',
    ages: [7],
    icon: '📖',
    badge: 'מנצפ״ך',
    titleHe: 'עִבְרִית וּכְתִיב',
    titleEn: 'Hebrew & Spelling',
    titleEs: 'Hebreo y Ortografía',
    descHe: 'סוֹפִיּוֹת, אוֹת חֲסֵרָה וּמִשְׁפָּטִים',
    descEn: 'Final Letters & Sentences',
    descEs: 'Letras finales y frases',
    gradient: 'from-emerald-300 via-teal-300 to-cyan-300',
    border: 'border-emerald-500',
    text: 'text-emerald-950',
    useSpeechFallback: true
  },
  {
    id: 'english_abc_age7',
    ages: [7],
    icon: '🔤',
    badge: 'A–Z',
    titleHe: 'לִמּוּד אַנְגְּלִית A–Z',
    titleEn: 'Learn English A–Z',
    titleEs: 'Inglés A–Z',
    descHe: 'אוֹתִיּוֹת עִם קוֹל וְאִיּוּת מִלִּים',
    descEn: 'A–Z Phonics & Word Spelling',
    descEs: 'Fonética A–Z y ortografía',
    gradient: 'from-blue-300 via-sky-200 to-cyan-300',
    border: 'border-blue-500',
    text: 'text-blue-950',
    useSpeechFallback: true
  },
  {
    id: 'english_age7',
    ages: [7],
    icon: '🇬🇧',
    badge: 'QUIZ',
    titleHe: 'חִידוֹן אַנְגְּלִית גִּיל 7',
    titleEn: 'English Quiz • Age 7',
    titleEs: 'Quiz de Inglés',
    descHe: 'חַיּוֹת, צְבָעִים, בְּרָכוֹת וּמִלִּים',
    descEn: 'Phonics, Words & Phrases',
    descEs: 'Palabras, colores y frases',
    gradient: 'from-sky-300 via-indigo-200 to-blue-300',
    border: 'border-indigo-500',
    text: 'text-indigo-950',
    useSpeechFallback: true
  },
  {
    id: 'memory_age7',
    ages: [7],
    icon: '🃏',
    badge: '8 כרטיסים',
    titleHe: 'זִכָּרוֹן חֶשְׁבּוֹן וּמִלִּים',
    titleEn: 'Math & Word Memory',
    titleEs: 'Memoria Mates',
    descHe: 'הַתְאָמַת תַּרְגִּילִים וּמִלִּים',
    descEn: 'Match Equations & Words',
    descEs: 'Empareja sumas y palabras',
    gradient: 'from-amber-200 via-orange-200 to-rose-200',
    border: 'border-orange-500',
    text: 'text-orange-950',
    useSpeechFallback: true
  },

  /* ===================== AGE 9 (GRADES 3–4 / כִּתָּה ג׳–ד׳) ===================== */
  {
    id: 'math_age9',
    ages: [9],
    icon: '🚀',
    badge: 'גִּיל 9',
    titleHe: 'חֶשְׁבּוֹן גִּיל 9',
    titleEn: 'Math • Age 9',
    titleEs: 'Mates • Edad 9',
    descHe: 'כִּתָּה ג׳–ד׳ • כֶּפֶל, שְׁבָרִים וְהֶקֵּף',
    descEn: 'Grades 3–4 • ×/÷, Fractions & ₪',
    descEs: 'Grados 3–4 • Tablas y Fracciones',
    gradient: 'from-indigo-300 via-violet-300 to-fuchsia-300',
    border: 'border-indigo-500',
    text: 'text-indigo-950',
    useSpeechFallback: true
  },
  {
    id: 'hebrew_age9',
    ages: [9],
    icon: '📚',
    badge: 'שָׁרָשִׁים',
    titleHe: 'עִבְרִית וְלָשׁוֹן',
    titleEn: 'Hebrew Grammar',
    titleEs: 'Gramática Hebrea',
    descHe: 'שָׁרָשִׁים, הֲפָכִים, כְּתִיב וּזְמַנִּים',
    descEn: 'Roots, Synonyms & Tenses',
    descEs: 'Raíces, sinónimos y tiempos',
    gradient: 'from-purple-300 via-fuchsia-300 to-pink-300',
    border: 'border-purple-500',
    text: 'text-purple-950',
    useSpeechFallback: true
  },
  {
    id: 'english_studio_age9',
    ages: [9],
    icon: '🇬🇧',
    badge: 'STUDIO',
    titleHe: 'לִמּוּד אַנְגְּלִית גִּיל 9',
    titleEn: 'English Studio • Age 9',
    titleEs: 'Estudio Inglés • 9',
    descHe: 'כַּרְטִיסִיּוֹת קוֹל, אִיּוּת וּבְנִיַּת מִשְׁפָּטִים',
    descEn: 'Flashcards, Spelling & Sentences',
    descEs: 'Tarjetas, ortografía y frases',
    gradient: 'from-sky-300 via-blue-300 to-indigo-300',
    border: 'border-blue-500',
    text: 'text-blue-950',
    useSpeechFallback: true
  },
  {
    id: 'english_age9',
    ages: [9],
    icon: '🌍',
    badge: 'is / WH',
    titleHe: 'חִידוֹן אַנְגְּלִית כִּתָּה ג׳–ד׳',
    titleEn: 'English Quiz • Age 9',
    titleEs: 'Quiz Inglés • Edad 9',
    descHe: 'דִּקְדּוּק, הֲבָנַת הַנִּקְרָא, מִלִּים וְרַבִּים',
    descEn: 'Grammar, Reading & Plurals',
    descEs: 'Gramática, lectura y plurales',
    gradient: 'from-rose-300 via-pink-300 to-indigo-300',
    border: 'border-rose-500',
    text: 'text-rose-950',
    useSpeechFallback: true
  },
  {
    id: 'memory_age9',
    ages: [9],
    icon: '🃏',
    badge: '12 כרטיסים',
    titleHe: 'זִכָּרוֹן כֶּפֶל וְאַנְגְּלִית',
    titleEn: 'Pro Memory Match',
    titleEs: 'Memoria Pro',
    descHe: 'לוּחַ הַכֶּפֶל וְאוֹצַר מִלִּים',
    descEn: 'Times Tables & Vocab Pairs',
    descEs: 'Tablas y vocabulario',
    gradient: 'from-teal-300 via-cyan-300 to-sky-300',
    border: 'border-teal-500',
    text: 'text-teal-950',
    useSpeechFallback: true
  },

  /* ===================== ALL AGES REWARDS ===================== */
  {
    id: 'stickers',
    ages: [4, 7, 9],
    icon: '🎪',
    badge: '🏆',
    titleHe: 'הַמַּדְבֵּקוֹת שֶׁלִּי',
    titleEn: 'My Stickers',
    titleEs: 'Mis Pegatinas',
    descHe: 'פְּרָסִים וּמַדְבֵּקוֹת',
    descEn: 'Rewards & Playboard',
    descEs: 'Premios y tablero',
    gradient: 'from-fuchsia-300 via-purple-300 to-indigo-300',
    border: 'border-fuchsia-500',
    text: 'text-fuchsia-950'
  },

  /* ===================== AGE 4 PRO PRESCHOOL GAMES ===================== */
  {
    id: 'vowels',
    ages: [4],
    icon: '🎵',
    badge: 'אָ אִ אוֹ',
    titleHe: 'עוֹלַם הַנִּקּוּד',
    titleEn: 'Vowel World',
    titleEs: 'Mundo de Vocales',
    descHe: 'צְלִילִים וּפַרְצוּפִים',
    descEn: 'Sounds & Faces',
    descEs: 'Sonidos y caritas',
    gradient: 'from-purple-300 via-fuchsia-300 to-pink-300',
    border: 'border-purple-500',
    text: 'text-purple-950',
    isProFeature: true
  },
  {
    id: 'first_words',
    ages: [4],
    icon: '📖',
    badge: 'אַבָּא',
    titleHe: 'מִלִּים רִאשׁוֹנוֹת',
    titleEn: 'First Words',
    titleEs: 'Primeras Palabras',
    descHe: 'מְחַבְּרִים מִלִּים',
    descEn: 'Blend Real Words',
    descEs: 'Forma palabras reales',
    gradient: 'from-emerald-300 via-teal-300 to-cyan-300',
    border: 'border-emerald-500',
    text: 'text-emerald-950',
    isProFeature: true
  },
  {
    id: 'tracing',
    ages: [4],
    icon: '🎨',
    badge: '✍️',
    titleHe: 'צִיּוּר וּכְתִיבָה',
    titleEn: 'Draw & Trace',
    titleEs: 'Dibuja y Traza',
    descHe: 'צוֹבְעִים אוֹתִיּוֹת',
    descEn: 'Color & Write',
    descEs: 'Colorea y escribe',
    gradient: 'from-teal-300 via-cyan-300 to-sky-300',
    border: 'border-teal-500',
    text: 'text-teal-950',
    isProFeature: true
  },
  {
    id: 'opening_sound',
    ages: [4],
    icon: '🔊',
    badge: 'א?',
    titleHe: 'הַקּוֹל הַפּוֹתֵחַ',
    titleEn: 'Opening Sound',
    titleEs: 'Sonido Inicial',
    descHe: 'בְּאֵיזוֹ אוֹת מַתְחִיל?',
    descEn: 'First Sound Match',
    descEs: '¿Con qué letra empieza?',
    gradient: 'from-violet-300 via-purple-300 to-fuchsia-300',
    border: 'border-violet-500',
    text: 'text-violet-950',
    isProFeature: true
  },
  {
    id: 'math_play',
    ages: [4],
    icon: '🍎',
    badge: '1+2',
    titleHe: 'חֶשְׁבּוֹן רִאשׁוֹן',
    titleEn: 'First Math',
    titleEs: 'Primeras Sumas',
    descHe: 'סוֹפְרִים פֵּרוֹת יַחַד',
    descEn: 'Fruit Addition',
    descEs: 'Suma con frutas',
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
  kidAge = 4,
  onChangeAge,
  activeProfile = null,
  profilesCount = 0,
  onOpenProfilePicker,
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
    const tile = ACTIVITY_TILES.find((t) => t.id === tileId);
    if (lang === 'es') {
      if (tile) speakText(tile.titleEs, 'es');
      return;
    }
    if (tile?.useSpeechFallback) {
      if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
        try {
          window.speechSynthesis.cancel();
          const utt = new SpeechSynthesisUtterance(isHe ? tile.titleHe : tile.titleEn);
          utt.lang = isHe ? 'he-IL' : 'en-US';
          utt.rate = 0.95;
          window.speechSynthesis.speak(utt);
        } catch {
          // ignore speech errors
        }
      }
      return;
    }
    const prefix = isHe ? '' : 'en_';
    playAudioFile(`/audio/tiles/${prefix}${tileId}.mp3`);
  };

  const dailyGoal = 5;
  const dailyPct = Math.min(100, Math.round((dailyStars / dailyGoal) * 100));

  // Show ONLY games crafted for the selected age (4, 7, or 9)
  const visibleTiles = ACTIVITY_TILES.filter((t) => !t.ages || t.ages.includes(kidAge));

  const greetingText = activeProfile?.name
    ? tr(
        lang,
        `שָׁלוֹם ${activeProfile.name}! מָה נִלְמַד הַיּוֹם?`,
        `Hi ${activeProfile.name}! What shall we play?`,
        `¡Hola ${activeProfile.name}! ¿A qué jugamos?`
      )
    : tr(lang, 'שָׁלוֹם! מָה נִלְמַד הַיּוֹם?', 'Hi! What shall we play?', '¡Hola! ¿A qué jugamos hoy?');

  return (
    <div className="max-w-5xl mx-auto px-4 py-5 flex flex-col gap-5" dir={isHe ? 'rtl' : 'ltr'}>
      {/* Friendly First-Launch Who-Is-Playing Card */}
      {needsGenderPick && !activeProfile && (
        <div className="bg-white/95 border-4 border-amber-400 rounded-3xl p-5 md:p-6 shadow-xl text-center animate-pop-in">
          <div className="flex items-center justify-center gap-2 mb-3">
            <button
              type="button"
              onClick={() => soundEnabled && isHe && playAudioFile('/audio/phrases/who_plays.mp3')}
              className="inline-flex items-center gap-2 px-4 py-1.5 bg-amber-100 hover:bg-amber-200 text-amber-900 rounded-full font-black text-sm btn-press-3d"
            >
              <Volume2 className="w-4 h-4 text-amber-700 animate-pulse" />
              <span>{tr(lang, 'מִי מְשַׂחֵק הַיּוֹם?', 'Who is playing today?', '¿Quién juega hoy?')}</span>
            </button>
          </div>
          <div className="grid grid-cols-2 gap-4 max-w-md mx-auto">
            <button
              type="button"
              onClick={() => onPickGender('boy')}
              className="p-4 rounded-3xl bg-gradient-to-b from-sky-100 to-blue-200 border-4 border-blue-400 hover:scale-105 transition flex flex-col items-center gap-1 btn-press-3d cursor-pointer"
            >
              <span className="text-5xl md:text-6xl animate-bounce-gentle">👦</span>
              <span className="text-xl font-black text-blue-950">{tr(lang, 'יֶלֶד', 'Boy', 'Niño')}</span>
            </button>
            <button
              type="button"
              onClick={() => onPickGender('girl')}
              className="p-4 rounded-3xl bg-gradient-to-b from-pink-100 to-rose-200 border-4 border-pink-400 hover:scale-105 transition flex flex-col items-center gap-1 btn-press-3d cursor-pointer"
            >
              <span className="text-5xl md:text-6xl animate-bounce-gentle">👧</span>
              <span className="text-xl font-black text-pink-950">{tr(lang, 'יַלְדָּה', 'Girl', 'Niña')}</span>
            </button>
          </div>
        </div>
      )}

      {/* Playroom Welcome + Age Switcher + Daily Progress Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 p-5 md:p-6 text-white shadow-xl border-4 border-white flex flex-col gap-4">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-4 text-center md:text-start">
            <button
              type="button"
              onClick={() => {
                playSound('pop');
                onOpenProfilePicker?.();
              }}
              title={tr(lang, 'הַחֲלֵף יֶלֶד / פְּרוֹפִיל', 'Switch Kid Profile', 'Cambiar perfil')}
              className="w-16 h-16 md:w-20 md:h-20 rounded-3xl bg-white/25 hover:bg-white/35 backdrop-blur-sm border-2 border-white/60 flex items-center justify-center text-4xl md:text-5xl shadow-inner animate-bounce-gentle flex-shrink-0 cursor-pointer"
            >
              {activeProfile?.avatar || (gender === 'girl' ? '👧' : '👦')}
            </button>
            <div>
              <h2 className="text-2xl md:text-3xl font-black tracking-tight flex items-center justify-center md:justify-start gap-2">
                <span>{greetingText}</span>
                <Sparkles className="w-6 h-6 text-amber-300 animate-pulse flex-shrink-0" />
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
                  : lang === 'es'
                    ? isTouch
                      ? '¡Toca cualquier juego para empezar!'
                      : '¡Pasa el ratón para escuchar y haz clic para jugar!'
                    : isTouch
                      ? 'Tap any game to start playing!'
                      : 'Hover to hear the game name, click to play!'}
              </p>

              {/* Daily Goal Progress Bar */}
              <div className="mt-3 flex flex-wrap items-center justify-center md:justify-start gap-2">
                <div className="flex items-center gap-1.5 bg-white/20 px-3 py-1 rounded-full text-xs font-black">
                  <Flame className="w-4 h-4 text-amber-300 fill-amber-300" />
                  <span>{tr(lang, `רֶצֶף: ${streakDays} יָמִים`, `${streakDays}-Day Streak`, `Racha de ${streakDays} días`)}</span>
                </div>
                <div className="flex items-center gap-2 bg-white/20 px-3 py-1 rounded-full text-xs font-black">
                  <span>{tr(lang, 'יַעַד יוֹמִי:', 'Daily Goal:', 'Meta diaria:')}</span>
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
              onClick={() => {
                playSound('pop');
                onOpenProfilePicker?.();
              }}
              className="flex items-center gap-1.5 px-4 py-2.5 bg-white text-indigo-900 hover:bg-amber-50 rounded-2xl font-black text-sm border-2 border-white shadow btn-press-3d cursor-pointer"
            >
              <Users className="w-4 h-4 text-indigo-600" />
              <span>
                {profilesCount > 0
                  ? tr(lang, `הַחֲלֵף יֶלֶד/ה (${profilesCount})`, `Switch Kid (${profilesCount})`, `Cambiar niño (${profilesCount})`)
                  : tr(lang, 'הוֹסֵף שֵׁם יֶלֶד/ה', 'Add Kid Profile', 'Añadir perfil')}
              </span>
            </button>

            <button
              type="button"
              onClick={() => soundEnabled && isHe && playPhraseAudio('welcome_home', gender)}
              className="flex items-center gap-2 px-3.5 py-2.5 bg-white/25 hover:bg-white/35 rounded-2xl font-black text-sm border-2 border-white/50 btn-press-3d cursor-pointer"
            >
              <Volume2 className="w-5 h-5 text-amber-200 animate-pulse" />
              <span>{tr(lang, '🔊 שְׁמַע', '🔊 Listen', '🔊 Escuchar')}</span>
            </button>

            {!isPro && kidAge === 4 && (
              <button
                type="button"
                onClick={() => {
                  playSound('pop');
                  onOpenPro();
                }}
                className="flex items-center gap-1.5 px-3.5 py-2.5 bg-amber-300 hover:bg-amber-400 text-amber-950 rounded-2xl font-black text-sm border-2 border-white shadow btn-press-3d cursor-pointer"
              >
                <Crown className="w-4 h-4 text-amber-800" />
                <span>{tr(lang, 'גִּרְסָה מְלֵאָה', 'Unlock All', 'Desbloquear Todo')}</span>
              </button>
            )}

            <button
              type="button"
              onClick={() => {
                playSound('pop');
                onOpenParentGate();
              }}
              className="flex items-center gap-1.5 px-3.5 py-2.5 bg-white/20 hover:bg-white/30 text-white rounded-2xl font-bold text-xs border border-white/40 btn-press-3d cursor-pointer"
              title={tr(lang, 'שְׁמִירַת הִתְקַדְּמוּת בֶּעָנָן', 'Cloud Save', 'Guardar en la nube')}
            >
              <Cloud className="w-4 h-4" />
              <span>{user ? '✓ Google' : tr(lang, 'שְׁמִירָה', 'Save', 'Guardar')}</span>
            </button>
          </div>
        </div>

        {/* Prominent 3-Way Age Switcher (Age 4 / Age 7 / Age 9) */}
        <div className="bg-black/15 p-1.5 rounded-2xl grid grid-cols-3 gap-2">
          {[
            { age: 4, icon: '🧸', titleHe: 'גִּיל 4', subHe: 'גַּן • אָלֶף-בֵּית', titleEn: 'Age 4', subEn: 'Preschool', titleEs: 'Edad 4', subEs: 'Preescolar' },
            { age: 7, icon: '🧒', titleHe: 'גִּיל 7', subHe: 'כִּתָּה א׳–ב׳', titleEn: 'Age 7', subEn: 'Grades 1–2', titleEs: 'Edad 7', subEs: 'Grados 1–2' },
            { age: 9, icon: '🚀', titleHe: 'גִּיל 9', subHe: 'כִּתָּה ג׳–ד׳', titleEn: 'Age 9', subEn: 'Grades 3–4', titleEs: 'Edad 9', subEs: 'Grados 3–4' }
          ].map((opt) => {
            const active = kidAge === opt.age;
            return (
              <button
                key={opt.age}
                type="button"
                aria-pressed={active}
                onClick={() => {
                  playSound('pop');
                  onChangeAge?.(opt.age);
                }}
                className={`py-2.5 px-2 sm:px-4 rounded-xl font-black transition-all flex flex-col sm:flex-row items-center justify-center gap-1 sm:gap-2 cursor-pointer ${
                  active
                    ? 'bg-white text-indigo-950 shadow-lg scale-[1.01]'
                    : 'bg-white/10 text-white hover:bg-white/25'
                }`}
              >
                <span className="text-xl sm:text-2xl">{opt.icon}</span>
                <div className="flex flex-col items-center sm:items-start leading-tight">
                  <span className="text-sm sm:text-base font-black">
                    {tr(lang, opt.titleHe, opt.titleEn, opt.titleEs)}
                  </span>
                  <span className={`text-[10px] sm:text-xs font-bold ${active ? 'text-indigo-600' : 'text-white/80'}`}>
                    {tr(lang, opt.subHe, opt.subEn, opt.subEs)}
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Big Joyful Age-Specific Activity Tiles Grid */}
      <div className={`grid gap-4 ${kidAge >= 7 ? 'grid-cols-2 sm:grid-cols-3' : 'grid-cols-2 sm:grid-cols-3 lg:grid-cols-4'}`}>
        {visibleTiles.map((tile) => {
          const locked = Boolean(tile.isProFeature && !isPro);
          const titleText = tr(lang, tile.titleHe, tile.titleEn, tile.titleEs);
          const descText = tr(lang, tile.descHe, tile.descEn, tile.descEs);
          const lockedStatus = locked
            ? tr(lang, 'נָעוּל — דּוֹרֵשׁ מַנּוּי PRO', 'Locked — Pro subscription required', 'Bloqueado — requiere suscripción Pro')
            : '';
          const primaryAriaLabel = locked
            ? `${titleText} — ${descText} (${lockedStatus})`
            : `${titleText} — ${descText}`;

          return (
            <div
              key={tile.id}
              onMouseEnter={() => {
                if (!isTouch) speakTile(tile.id);
              }}
              className={`relative rounded-3xl bg-gradient-to-b ${tile.gradient} border-4 ${tile.border} min-h-[168px] btn-press-3d group select-none shadow-md hover:shadow-xl flex flex-col`}
            >
              <button
                type="button"
                onClick={() => {
                  playSound('pop');
                  if (locked) {
                    onOpenPro();
                  } else {
                    onSelectActivity(tile.id);
                  }
                }}
                aria-label={primaryAriaLabel}
                className="w-full flex-1 p-4 md:p-5 flex flex-col items-center justify-between text-center cursor-pointer rounded-3xl"
              >
                {/* Top row: badge / PRO crown (leaves space for sibling speaker button) */}
                <div className="w-full flex items-center justify-start min-h-[44px] pe-12">
                  {locked ? (
                    <span className="inline-flex items-center gap-1 text-[11px] font-black bg-amber-400 text-amber-950 px-2.5 py-0.5 rounded-full shadow-sm border border-white">
                      <Lock className="w-3.5 h-3.5" aria-hidden="true" />
                      <Crown className="w-3 h-3" aria-hidden="true" />
                      <span>PRO</span>
                    </span>
                  ) : (
                    <span className="text-[11px] font-black bg-white/85 text-slate-800 px-2.5 py-0.5 rounded-full shadow-sm">
                      {tile.badge}
                    </span>
                  )}
                </div>

                {/* Big joyful icon */}
                <div className="text-5xl md:text-6xl my-2 transition-transform duration-200 group-hover:scale-115 group-hover:animate-wiggle drop-shadow-sm">
                  {tile.icon}
                </div>

                {/* Title & short subtitle */}
                <div>
                  <div className={`text-lg md:text-xl font-black leading-tight ${tile.text}`}>
                    {titleText}
                  </div>
                  <div className={`text-xs font-bold opacity-85 mt-0.5 ${tile.text}`}>
                    {descText}
                  </div>
                </div>
              </button>

              {/* Sibling speaker button (44x44px touch target) */}
              <button
                type="button"
                onClick={(e) => speakTile(tile.id, e)}
                aria-label={tr(lang, `הַשְׁמַע: ${tile.titleHe}`, `Listen: ${tile.titleEn}`, `Escuchar: ${tile.titleEs}`)}
                className="absolute top-3.5 end-3.5 z-10 w-11 h-11 rounded-full bg-white/90 hover:bg-white flex items-center justify-center shadow-sm border border-white transition-transform group-hover:scale-110 cursor-pointer"
              >
                <Volume2 className="w-5 h-5 text-indigo-600" aria-hidden="true" />
              </button>
            </div>
          );
        })}
      </div>

      {/* Crawl-friendly Semantic Summary for Web Search & Parents (below the fold) */}
      <footer className="mt-4 bg-white/75 border-2 border-amber-200 rounded-3xl p-5 text-slate-600 text-xs leading-relaxed flex flex-col gap-2">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <h3 className="font-black text-slate-800 text-sm">
            {tr(
              lang,
              'לִמּוּד אוֹתִיּוֹת א-ב, נִקּוּד וּמִסְפָּרִים לְגִיל 4 — בָּאֲתָר וּבְאַפְּלִיקַצְיָה',
              'Hebrew Alphabet, Vowels & Early Math for Ages 3–5 — Free Online & Android',
              'Alfabeto hebreo, vocales y matemáticas tempranas para edades 3–5 — Gratis en línea y Android'
            )}
          </h3>
          <div className="flex items-center gap-3">
            <a href="/accessibility.html" className="text-indigo-700 hover:underline font-bold">
              {tr(lang, 'הַצְהָרַת נְגִישׁוּת', 'Accessibility', 'Accesibilidad')}
            </a>
            <span aria-hidden="true">•</span>
            <a href="/privacy.html" className="text-indigo-700 hover:underline font-bold">
              {tr(lang, 'מְדִינִיּוּת פְּרָטִיּוּת', 'Privacy Policy', 'Política de Privacidad')}
            </a>
          </div>
        </div>
        <p>
          {tr(
            lang,
            'משחקי אלף-בית מדובבים בעברית לגיל הרך: הכרת כל האותיות, זיהוי אותיות, רכבת קריאה מימין לשמאל, בלש הפופיק להבחנה בין דגש קל לרפה (בּ/ב, כּ/כ, פּ/פ), עולם הניקוד, קריאת מילים ראשונות, ספירה 1–10, צביעה וכתיבה במחשב (עכבר) ובטאבלט/טלפון (אצבע).',
            'Interactive voice-guided Hebrew preschool learning games: Alef-Bet cards, letter quiz, right-to-left reading train, dagesh pupik detective, vowels (nikud), first word blending, numbers 1–10, guided tracing, phonological awareness, and fruit math.',
            'Juegos educativos interactivos guiados por voz para preescolar en hebreo: tarjetas del Alef-Bet, juego de letras, tren de lectura de derecha a izquierda, detective Pupik del daguesh, vocales (nikud), formación de primeras palabras, números 1–10, trazado guiado, conciencia fonológica y sumas con frutas.'
          )}
        </p>
      </footer>
    </div>
  );
}
