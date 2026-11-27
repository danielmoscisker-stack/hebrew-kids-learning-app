import React from 'react';
import { Star, Volume2, VolumeX, Home, Lock, Sparkles } from 'lucide-react';
import { playSound, playPhraseAudio } from '../utils/audio';
import { tr } from '../utils/i18n';
import { ACTIVITY_TILES } from './HomeHub';

export default function Navbar({
  currentTab,
  setCurrentTab,
  lang,
  stars,
  soundEnabled,
  setSoundEnabled,
  gender = 'boy',
  setGender,
  onOpenParentGate
}) {
  const isHe = lang === 'he';
  const activeTile = ACTIVITY_TILES.find((t) => t.id === currentTab);

  const goHome = () => {
    playSound('whoosh');
    setCurrentTab('home');
  };

  return (
    <header
      className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b-4 border-amber-300 shadow-sm pt-[env(safe-area-inset-top)]"
      dir={isHe ? 'rtl' : 'ltr'}
    >
      <div className="max-w-6xl mx-auto px-3 md:px-5 py-2.5 flex items-center justify-between gap-2">
        {/* Left / Start: Huge Home Button inside games OR Mascot Brand on Home */}
        {currentTab !== 'home' ? (
          <div className="flex items-center gap-2.5 min-w-0">
            <button
              type="button"
              onClick={goHome}
              className="flex items-center gap-2 px-4 py-2.5 min-h-[48px] bg-gradient-to-b from-amber-300 to-amber-400 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-black text-sm md:text-base rounded-2xl border-2 border-amber-500 btn-press-3d cursor-pointer flex-shrink-0"
              aria-label={tr(lang, 'חֲזָרָה לַבַּיִת', 'Back to Home', 'Volver al inicio')}
            >
              <Home className="w-5 h-5" />
              <span>{tr(lang, 'בַּיִת', 'Home', 'Inicio')}</span>
            </button>

            {activeTile && (
              <div className="hidden sm:flex items-center gap-2 bg-amber-50 border-2 border-amber-200 px-3.5 py-1.5 rounded-2xl truncate">
                <span className="text-2xl">{activeTile.icon}</span>
                <span className="font-black text-slate-800 text-base truncate">
                  {tr(lang, activeTile.titleHe, activeTile.titleEn, activeTile.titleEs)}
                </span>
              </div>
            )}
          </div>
        ) : (
          <div className="flex items-center gap-2.5">
            <div className="w-12 h-12 bg-gradient-to-tr from-amber-400 via-pink-500 to-indigo-600 rounded-2xl flex items-center justify-center shadow-md border-2 border-white">
              <span className="text-2xl font-black text-white">א</span>
            </div>
            <div>
              <h1 className="text-lg md:text-2xl font-black text-slate-800 tracking-tight leading-none">
                {tr(lang, 'אָלֶף-בֵּית וּמִסְפָּרִים', 'Kids Hebrew & Numbers', 'Hebreo y Números para Niños')}
              </h1>
              <span className="text-xs font-bold text-pink-600 flex items-center gap-1 mt-0.5">
                <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                {tr(lang, 'גִּיל 4 • הַכְנָסָה כֵּיפִית לַקְּרִיאָה', 'Age 4 • Fun Early Learning', 'Edad 4 • Aprendizaje Divertido')}
              </span>
            </div>
          </div>
        )}

        {/* Right / End Controls: Kid-friendly large 48px+ targets */}
        <div className="flex items-center gap-2">
          {/* Boy / Girl Toggle */}
          <button
            type="button"
            onClick={() => {
              const nextGender = gender === 'boy' ? 'girl' : 'boy';
              setGender(nextGender);
              playSound('pop');
              if (soundEnabled) {
                setTimeout(() => playPhraseAudio('great_job', nextGender), 150);
              }
            }}
            className={`flex items-center gap-1.5 px-3 min-h-[48px] rounded-2xl font-black text-xs md:text-sm border-2 btn-press-3d cursor-pointer ${
              gender === 'boy'
                ? 'bg-sky-100 hover:bg-sky-200 text-sky-950 border-sky-400'
                : 'bg-pink-100 hover:bg-pink-200 text-pink-950 border-pink-400'
            }`}
            title={tr(lang, 'הַחֲלֵף יֶלֶד / יַלְדָּה', 'Switch Boy / Girl', 'Cambiar Niño / Niña')}
          >
            <span className="text-xl">{gender === 'boy' ? '👦' : '👧'}</span>
            <span className="hidden xs:inline font-black">
              {gender === 'boy' ? tr(lang, 'יֶלֶד', 'Boy', 'Niño') : tr(lang, 'יַלְדָּה', 'Girl', 'Niña')}
            </span>
          </button>

          {/* Star Counter */}
          <button
            type="button"
            onClick={() => {
              playSound('star');
              setCurrentTab('stickers');
            }}
            className="flex items-center gap-1.5 bg-amber-100 hover:bg-amber-200 border-2 border-amber-400 px-3 min-h-[48px] rounded-2xl btn-press-3d cursor-pointer"
            title={tr(lang, 'הַמַּדְבֵּקוֹת שֶׁלִּי', 'My Stickers', 'Mis Pegatinas')}
          >
            <Star className="w-5 h-5 text-amber-500 fill-amber-400" />
            <bdi className="font-black text-amber-900 text-base">{stars}</bdi>
          </button>

          {/* Audio Mute / Unmute */}
          <button
            type="button"
            onClick={() => {
              const next = !soundEnabled;
              setSoundEnabled(next);
              if (next) playSound('pop');
            }}
            className={`w-12 h-12 rounded-2xl border-2 flex items-center justify-center btn-press-3d cursor-pointer ${
              soundEnabled
                ? 'bg-indigo-100 border-indigo-300 text-indigo-700 hover:bg-indigo-200'
                : 'bg-slate-200 border-slate-300 text-slate-500 hover:bg-slate-300'
            }`}
            aria-label={soundEnabled ? tr(lang, 'הַשְׁתֵּק קוֹל', 'Mute', 'Silenciar') : tr(lang, 'הַפְעֵל קוֹל', 'Unmute', 'Activar sonido')}
            title={soundEnabled ? tr(lang, 'הַשְׁתֵּק קוֹל', 'Mute', 'Silenciar') : tr(lang, 'הַפְעֵל קוֹל', 'Unmute', 'Activar sonido')}
          >
            {soundEnabled ? <Volume2 className="w-6 h-6" /> : <VolumeX className="w-6 h-6" />}
          </button>

          {/* Parent Zone Lock (keeps 4yo safely in kids mode) */}
          <button
            type="button"
            onClick={() => {
              playSound('pop');
              onOpenParentGate();
            }}
            className="w-12 h-12 rounded-2xl bg-slate-100 hover:bg-slate-200 border-2 border-slate-300 text-slate-600 flex items-center justify-center btn-press-3d cursor-pointer"
            aria-label={tr(lang, 'אֵזוֹר הוֹרִים', 'Parent Zone', 'Zona de Padres')}
            title={tr(lang, 'אֵזוֹר הוֹרִים וְהַגְדָּרוֹת', 'Parents & Settings', 'Padres y Ajustes')}
          >
            <Lock className="w-5 h-5" />
          </button>
        </div>
      </div>
    </header>
  );
}
