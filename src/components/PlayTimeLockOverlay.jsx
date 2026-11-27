import React, { useState } from 'react';
import { Lock, Clock, Star, Users, PlusCircle, RotateCcw, Settings, Volume2 } from 'lucide-react';
import { playSound } from '../utils/audio';
import { tr } from '../utils/i18n';
import {
  formatUsedMinutes,
  generateParentGateChallenge
} from '../utils/playLimits';

function speakNotice(text, lang) {
  try {
    if (typeof window === 'undefined' || !('speechSynthesis' in window) || !text) return;
    window.speechSynthesis.cancel();
    const utt = new SpeechSynthesisUtterance(text);
    utt.lang = lang === 'he' ? 'he-IL' : lang === 'es' ? 'es-ES' : 'en-US';
    utt.rate = 0.9;
    window.speechSynthesis.speak(utt);
  } catch {
    // ignore
  }
}

export default function PlayTimeLockOverlay({
  lang,
  gender = 'boy',
  activeProfile = null,
  profilesCount = 0,
  dailyStars = 0,
  limitEntry,
  limitState,
  onGrantBonusMinutes,
  onStartNewSession,
  onResetTodayUsage,
  onOpenProfilePicker,
  onOpenParentSettings
}) {
  const isHe = lang === 'he';
  const [gateOpen, setGateOpen] = useState(false);
  const [unlocked, setUnlocked] = useState(false);
  const [wrong, setWrong] = useState(false);
  const [challenge, setChallenge] = useState(() => generateParentGateChallenge(true));

  const isDailyLock = limitState?.lockReason === 'daily';
  const kidName = activeProfile?.name || '';
  const kidAvatar = activeProfile?.avatar || (gender === 'girl' ? '👧' : '👦');
  const usedTodayMin = formatUsedMinutes(limitEntry?.dailyUsedSec || 0);
  const dailyAllowanceMin = limitState?.dailyAllowanceSec ? Math.round(limitState.dailyAllowanceSec / 60) : null;
  const sessionAllowanceMin = limitState?.sessionAllowanceSec ? Math.round(limitState.sessionAllowanceSec / 60) : null;

  const title = isDailyLock
    ? tr(
        lang,
        kidName ? `כָּל הַכָּבוֹד ${kidName}! זְמַן הַמִּשְׂחָק לְהַיּוֹם הִסְתַּיֵּם` : 'כָּל הַכָּבוֹד! זְמַן הַמִּשְׂחָק לְהַיּוֹם הִסְתַּיֵּם',
        kidName ? `Great job, ${kidName}! Today's play time is up` : "Great job! Today's play time is up",
        kidName ? `¡Buen trabajo, ${kidName}! Se acabó el tiempo de hoy` : '¡Buen trabajo! Se acabó el tiempo de hoy'
      )
    : tr(
        lang,
        kidName ? `זְמַן הַפְסָקָה, ${kidName}! סִיַּמְתָּ אֶת הַסֵּשֶׁן` : 'זְמַן הַפְסָקָה! זְמַן הַמִּשְׂחָק הִסְתַּיֵּם',
        kidName ? `Break time, ${kidName}! Session time is up` : 'Break time! Session time is up',
        kidName ? `¡Hora de descansar, ${kidName}! Se acabó la sesión` : '¡Hora de descansar! Se acabó la sesión'
      );

  const subtitle = isDailyLock
    ? tr(
        lang,
        'הָאֲפְּלִיקַצְיָה נִסְגְּרָה לְהַיּוֹם כְּדֵי לָתֵת לָעֵינַיִם וְלַמּוֹחַ לָנוּחַ. נִפָּגֵשׁ מָחָר לְעוֹד הַרְפַּתְקָאוֹת!',
        'The app is now closed for today so your eyes and brain can rest. See you tomorrow for more adventures!',
        'La aplicación se cerró por hoy para que tus ojos y tu mente descansen. ¡Nos vemos mañana!'
      )
    : tr(
        lang,
        'שִׂחַקְתָּ נֶהְדָּר! הָאֲפְּלִיקַצְיָה סְגוּרָה עַכְשָׁו לְהַפְסָקָה קְצָרָה — שְׁתֵה מַיִם וְתִתְרַעֲנֵן, אוֹ בַּקֵּשׁ מֵהוֹרֶה לִפְתֹּחַ סֵשֶׁן חָדָשׁ.',
        'Awesome learning! The app is closed for a short break — stretch, drink water, or ask a parent to start a new session.',
        '¡Excelente trabajo! La aplicación está cerrada para un descanso — toma agua o pide a un adulto que abra otra sesión.'
      );

  const openGate = () => {
    playSound('pop');
    setChallenge(generateParentGateChallenge(true));
    setWrong(false);
    setUnlocked(false);
    setGateOpen(true);
  };

  return (
    <div
      className="fixed inset-0 z-[45] bg-gradient-to-b from-indigo-950/95 via-slate-900/95 to-purple-950/95 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto"
      dir={isHe ? 'rtl' : 'ltr'}
      role="dialog"
      aria-modal="true"
      aria-labelledby="play-limit-title"
    >
      <div className="w-full max-w-lg bg-white rounded-[2rem] border-4 border-amber-300 shadow-2xl p-6 sm:p-8 text-center animate-pop-in my-auto">
        {/* Cozy illustration */}
        <div className="flex items-center justify-center gap-3 mb-3">
          <div className="w-16 h-16 rounded-3xl bg-indigo-100 border-2 border-indigo-300 flex items-center justify-center text-4xl shadow-inner">
            {isDailyLock ? '🌙' : '⏰'}
          </div>
          {kidName && (
            <div className="w-14 h-14 rounded-3xl bg-amber-100 border-2 border-amber-300 flex items-center justify-center text-3xl">
              {kidAvatar}
            </div>
          )}
        </div>

        <h2 id="play-limit-title" className="text-2xl sm:text-3xl font-black text-slate-900 leading-tight mb-2">
          {title}
        </h2>

        <p className="text-sm sm:text-base font-bold text-slate-600 leading-relaxed mb-4">
          {subtitle}
        </p>

        {/* Read aloud button */}
        <button
          type="button"
          onClick={() => speakNotice(`${title}. ${subtitle}`, lang)}
          className="inline-flex items-center gap-2 px-4 py-2 mb-5 rounded-full bg-indigo-50 hover:bg-indigo-100 border-2 border-indigo-200 text-indigo-800 font-black text-xs sm:text-sm cursor-pointer"
        >
          <Volume2 className="w-4 h-4" />
          <span>{tr(lang, 'הַקְרֵא לִי', 'Read Out Loud', 'Leer en voz alta')}</span>
        </button>

        {/* Stats Strip */}
        <div className="grid grid-cols-2 gap-3 mb-5">
          <div className="p-3 rounded-2xl bg-amber-50 border-2 border-amber-200 flex flex-col items-center">
            <div className="flex items-center gap-1 text-amber-600 font-black text-xs mb-0.5">
              <Star className="w-4 h-4 fill-amber-400" />
              <span>{tr(lang, 'כּוֹכָבִים הַיּוֹם', 'Stars Today', 'Estrellas hoy')}</span>
            </div>
            <div className="text-2xl font-black text-amber-900">
              <bdi dir="ltr">{dailyStars}</bdi>
            </div>
          </div>

          <div className="p-3 rounded-2xl bg-sky-50 border-2 border-sky-200 flex flex-col items-center">
            <div className="flex items-center gap-1 text-sky-700 font-black text-xs mb-0.5">
              <Clock className="w-4 h-4" />
              <span>{tr(lang, 'זְמַן מִשְׂחָק הַיּוֹם', 'Played Today', 'Jugado hoy')}</span>
            </div>
            <div className="text-2xl font-black text-sky-950">
              <bdi dir="ltr">
                {usedTodayMin}m{dailyAllowanceMin ? ` / ${dailyAllowanceMin}m` : ''}
              </bdi>
            </div>
            {!isDailyLock && sessionAllowanceMin && (
              <div className="text-[11px] font-bold text-sky-700 mt-0.5">
                {tr(lang, `סֵשֶׁן: ${sessionAllowanceMin} דק׳`, `Session: ${sessionAllowanceMin}m`, `Sesión: ${sessionAllowanceMin}m`)}
              </div>
            )}
          </div>
        </div>

        {/* Actions or Parent Gate */}
        {!gateOpen ? (
          <div className="flex flex-col gap-2.5">
            {profilesCount > 1 && onOpenProfilePicker && (
              <button
                type="button"
                onClick={() => {
                  playSound('pop');
                  onOpenProfilePicker();
                }}
                className="w-full py-3 px-4 rounded-2xl bg-sky-100 hover:bg-sky-200 border-2 border-sky-300 text-sky-950 font-black text-sm sm:text-base flex items-center justify-center gap-2 btn-press-3d cursor-pointer"
              >
                <Users className="w-5 h-5" />
                <span>{tr(lang, 'הַחֲלֵף לְיֶלֶד אַחֵר', 'Switch to Another Kid', 'Cambiar a otro niño')}</span>
              </button>
            )}

            <button
              type="button"
              onClick={openGate}
              className="w-full py-3.5 px-4 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-black text-sm sm:text-base flex items-center justify-center gap-2 shadow-md btn-press-3d cursor-pointer"
            >
              <Lock className="w-5 h-5" />
              <span>{tr(lang, 'פְּתִיחָה לְהוֹרִים / הוֹסָפַת זְמַן', 'Parent Unlock / Add Time', 'Desbloqueo de Padres / Añadir tiempo')}</span>
            </button>
          </div>
        ) : !unlocked ? (
          <div className="p-4 rounded-2xl bg-slate-50 border-2 border-slate-200 flex flex-col items-center gap-3">
            <div className="flex items-center gap-1.5 text-sm font-black text-slate-800">
              <Lock className="w-4 h-4 text-indigo-600" />
              <span>{tr(lang, 'אִשּׁוּר הוֹרֶה — פִּתְרוּ אֶת הַתַּרְגִּיל:', 'Parent Check — Solve to Unlock:', 'Control Parental — Resuelve:')}</span>
            </div>
            <div className="text-3xl font-black text-indigo-700 bg-white border-2 border-indigo-200 px-6 py-2.5 rounded-2xl" dir="ltr">
              {challenge.text}
            </div>
            <div className="grid grid-cols-4 gap-2 w-full">
              {challenge.options.map((opt) => (
                <button
                  key={opt}
                  type="button"
                  onClick={() => {
                    if (opt === challenge.ans) {
                      playSound('star');
                      setUnlocked(true);
                      setWrong(false);
                    } else {
                      playSound('whoosh');
                      setWrong(true);
                      setChallenge(generateParentGateChallenge(true));
                    }
                  }}
                  className="py-2.5 rounded-xl bg-amber-100 hover:bg-amber-200 border-2 border-amber-400 font-black text-lg text-slate-900 btn-press-3d cursor-pointer"
                >
                  <bdi dir="ltr">{opt}</bdi>
                </button>
              ))}
            </div>
            {wrong && (
              <p className="text-xs font-bold text-rose-600">
                {tr(lang, 'לֹא מְדֻיָּק — נַסּוּ תַּרְגִּיל חָדָשׁ', 'Not quite — try the new question', 'Incorrecto — prueba de nuevo')}
              </p>
            )}
            <button
              type="button"
              onClick={() => setGateOpen(false)}
              className="text-xs font-bold text-slate-500 hover:text-slate-700 cursor-pointer"
            >
              {tr(lang, 'בִּטּוּל', 'Cancel', 'Cancelar')}
            </button>
          </div>
        ) : (
          <div className="p-4 rounded-2xl bg-emerald-50 border-2 border-emerald-300 flex flex-col gap-3">
            <div className="text-sm font-black text-emerald-950">
              {tr(lang, 'מַצַּב הוֹרֶה פָּתוּחַ ✓ — בַּחֲרוּ פְּעֻלָּה:', 'Parent Controls Unlocked ✓', 'Controles Parentales Abiertos ✓')}
            </div>

            <div className="grid grid-cols-3 gap-2">
              {[5, 10, 15].map((mins) => (
                <button
                  key={mins}
                  type="button"
                  onClick={() => {
                    playSound('star');
                    onGrantBonusMinutes(mins);
                  }}
                  className="py-2.5 px-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-black text-sm flex items-center justify-center gap-1 btn-press-3d cursor-pointer"
                >
                  <PlusCircle className="w-4 h-4" />
                  <bdi dir="ltr">+{mins}m</bdi>
                </button>
              ))}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {!isDailyLock && (
                <button
                  type="button"
                  onClick={() => {
                    playSound('star');
                    onStartNewSession();
                  }}
                  className="py-2.5 px-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-black text-xs sm:text-sm btn-press-3d cursor-pointer"
                >
                  {tr(lang, 'הַתְחֵל סֵשֶׁן חָדָשׁ', 'Start New Session', 'Iniciar nueva sesión')}
                </button>
              )}

              <button
                type="button"
                onClick={() => {
                  playSound('pop');
                  onResetTodayUsage();
                }}
                className="py-2.5 px-3 rounded-xl bg-white hover:bg-amber-50 border-2 border-amber-300 text-amber-950 font-black text-xs sm:text-sm flex items-center justify-center gap-1.5 btn-press-3d cursor-pointer"
              >
                <RotateCcw className="w-4 h-4" />
                <span>{tr(lang, 'אִפּוּס זְמַן לְהַיּוֹם', "Reset Today's Timer", 'Reiniciar tiempo de hoy')}</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  playSound('pop');
                  onOpenParentSettings();
                }}
                className="sm:col-span-2 py-2.5 px-3 rounded-xl bg-slate-800 hover:bg-slate-900 text-white font-black text-xs sm:text-sm flex items-center justify-center gap-1.5 btn-press-3d cursor-pointer"
              >
                <Settings className="w-4 h-4" />
                <span>{tr(lang, 'הַגְדָּרוֹת זְמַן מִשְׂחָק בְּאֵזוֹר הוֹרִים', 'Change Time Limits in Parent Settings', 'Cambiar límites en Ajustes Parentales')}</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
