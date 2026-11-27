import React, { useState, useEffect, useRef } from 'react';
import { X, Lock, Languages, Sparkles, ShieldCheck, MousePointer2, RotateCcw, Crown, LogOut, Cloud, Users, Clock, PlusCircle } from 'lucide-react';
import { playSound, playAudioFile } from '../utils/audio';
import { tr } from '../utils/i18n';
import { useDeviceType } from '../utils/useDeviceType';
import { loadGoogleIdentityScript, signInWithGoogleCredential, signOutSession } from '../utils/cloudSync';
import {
  DAILY_PRESETS,
  SESSION_PRESETS,
  formatMinutesSeconds,
  formatUsedMinutes,
  generateParentGateChallenge
} from '../utils/playLimits';

/**
 * Parental Gate + Settings / Screen Time Limits / Optional Google Sign-In / Pedagogy Guide Modal.
 */
export default function ParentModal({
  open,
  onClose,
  lang,
  setLang,
  kidAge = 4,
  activeProfile = null,
  kidCursorEnabled,
  setKidCursorEnabled,
  kidCursorSize = 'large',
  setKidCursorSize,
  onResetStars,
  user,
  onAuthSuccess,
  onSignOut,
  isPro,
  onOpenPro,
  profilesCount = 0,
  onOpenProfilePicker,
  serverConfig,
  limitEntry = null,
  limitState = null,
  onUpdatePlayLimits,
  onResetSessionTimer,
  onResetTodayUsage,
  onGrantBonusMinutes,
  initialUnlocked = false
}) {
  const isHe = lang === 'he';
  const { isTouch } = useDeviceType();
  const hardGate = kidAge >= 7 || Boolean(limitState?.hasLimit);
  const [unlocked, setUnlocked] = useState(Boolean(initialUnlocked));
  const [challenge, setChallenge] = useState(() => generateParentGateChallenge(hardGate));
  const [wrong, setWrong] = useState(false);
  const [authStatus, setAuthStatus] = useState(null);
  const [customDailyInput, setCustomDailyInput] = useState('');
  const [customSessionInput, setCustomSessionInput] = useState('');
  const googleBtnRef = useRef(null);

  useEffect(() => {
    if (open) {
      setUnlocked(Boolean(initialUnlocked));
      setWrong(false);
      setAuthStatus(null);
      setCustomDailyInput(limitEntry?.dailyLimitMin ? String(limitEntry.dailyLimitMin) : '');
      setCustomSessionInput(limitEntry?.sessionLimitMin ? String(limitEntry.sessionLimitMin) : '');
      if (!initialUnlocked) {
        setChallenge(generateParentGateChallenge(hardGate));
        playAudioFile('/audio/phrases/parents_only.mp3');
      }
    }
  }, [open, initialUnlocked, hardGate, limitEntry?.dailyLimitMin, limitEntry?.sessionLimitMin]);

  // Render Google Sign-In button inside unlocked Parent Zone when GOOGLE_CLIENT_ID is configured
  useEffect(() => {
    if (!open || !unlocked || user || !serverConfig?.googleClientId) return;
    let cancelled = false;
    loadGoogleIdentityScript().then((loaded) => {
      if (cancelled || !loaded || !googleBtnRef.current || !window.google?.accounts?.id) return;
      window.google.accounts.id.initialize({
        client_id: serverConfig.googleClientId,
        callback: async (response) => {
          try {
            setAuthStatus(tr(lang, 'מתחבר...', 'Signing in...', 'Iniciando sesión...'));
            const result = await signInWithGoogleCredential(response.credential);
            playSound('star');
            onAuthSuccess(result);
            setAuthStatus(null);
            onClose();
          } catch (err) {
            setAuthStatus(err.message || tr(lang, 'ההתחברות נכשלה', 'Sign-in failed', 'Error al iniciar sesión'));
          }
        }
      });
      googleBtnRef.current.innerHTML = '';
      window.google.accounts.id.renderButton(googleBtnRef.current, {
        theme: 'outline',
        size: 'large',
        shape: 'pill',
        text: 'signin_with',
        width: 260
      });
    });
    return () => {
      cancelled = true;
    };
  }, [open, unlocked, user, serverConfig, lang, onAuthSuccess, onClose]);

  useEffect(() => {
    if (!open) return;
    const onKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [open, onClose]);

  if (!open) return null;

  const selectLanguage = (newLang) => {
    if (newLang === lang) return;
    playSound('pop');
    setLang(newLang);
    document.documentElement.lang = newLang;
    document.documentElement.dir = newLang === 'he' ? 'rtl' : 'ltr';
  };

  return (
    <div
      className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4"
      dir={isHe ? 'rtl' : 'ltr'}
      onClick={onClose}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="parent-modal-title"
        onClick={(e) => e.stopPropagation()}
        className="bg-white rounded-3xl max-w-xl w-full p-6 md:p-7 shadow-2xl border-4 border-amber-300 max-h-[90vh] overflow-y-auto animate-pop-in"
      >
        <div className="flex items-center justify-between pb-3 border-b border-slate-200 mb-4">
          <div className="flex items-center gap-2">
            {unlocked ? <Sparkles className="w-6 h-6 text-pink-500" aria-hidden="true" /> : <Lock className="w-6 h-6 text-indigo-600" aria-hidden="true" />}
            <h3 id="parent-modal-title" className="text-xl font-black text-slate-800">
              {unlocked
                ? tr(lang, 'אֵזוֹר הוֹרִים וְגַנָּנוֹת', 'Parents & Educators', 'Padres y Educadores')
                : tr(lang, 'אֵזוֹר הוֹרִים בִּלְבַד', 'For Parents Only', 'Solo para Padres')}
            </h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label={tr(lang, 'סְגוֹר', 'Close', 'Cerrar')}
            className="p-2.5 rounded-full hover:bg-slate-100 text-slate-500 cursor-pointer"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {!unlocked ? (
          <div className="text-center py-4 flex flex-col items-center gap-4">
            <p className="text-slate-600 font-bold text-base">
              {tr(
                lang,
                'כְּדֵי לְהִכָּנֵס לַהַגְדָּרוֹת, פִּתְרוּ אֶת הַתַּרְגִּיל:',
                'To access parent settings, solve this quick question:',
                'Para acceder a los ajustes para padres, resuelve esta pregunta:'
              )}
            </p>
            <div className="text-4xl font-black text-indigo-700 bg-indigo-50 border-2 border-indigo-200 px-8 py-4 rounded-2xl" dir="ltr">
              {challenge.text}
            </div>
            <div className="grid grid-cols-4 gap-3 w-full max-w-xs">
              {challenge.options.map((opt) => (
                <button
                  key={opt}
                  type="button"
                  onClick={() => {
                    if (opt === challenge.ans) {
                      playSound('star');
                      setUnlocked(true);
                    } else {
                      playSound('whoosh');
                      setWrong(true);
                      setChallenge(generateParentGateChallenge(hardGate));
                    }
                  }}
                  className="py-3 rounded-2xl bg-amber-100 hover:bg-amber-200 border-2 border-amber-400 font-black text-xl text-slate-900 btn-press-3d cursor-pointer"
                >
                  <bdi dir="ltr">{opt}</bdi>
                </button>
              ))}
            </div>
            {wrong && <p className="text-sm font-bold text-rose-600">{tr(lang, 'נַסּוּ שׁוּב :)', 'Try again :)', 'Inténtalo de nuevo :)')}</p>}
          </div>
        ) : (
          <div className="space-y-4 text-sm text-slate-700">
            {/* Play Time Limits (Per Day & Per Session) */}
            {onUpdatePlayLimits && (
              <div className="p-4 bg-violet-50 border-2 border-violet-300 rounded-2xl flex flex-col gap-3">
                <div className="flex items-center justify-between gap-2 flex-wrap">
                  <div className="flex items-center gap-2 font-black text-violet-950 text-sm sm:text-base">
                    <Clock className="w-5 h-5 text-violet-600 flex-shrink-0" />
                    <span>
                      {tr(lang, 'הַגְבָּלַת זְמַן מִשְׂחָק (לְיוֹם / לְסֵשֶׁן)', 'Play Time Limits (Daily / Per Session)', 'Límites de Tiempo (Diario / Por Sesión)')}
                    </span>
                  </div>
                  <span className="px-2.5 py-0.5 rounded-full bg-white border border-violet-300 text-violet-900 text-xs font-black">
                    {activeProfile
                      ? `${activeProfile.avatar || '👦'} ${activeProfile.name} (${tr(lang, `גִּיל ${activeProfile.age}`, `Age ${activeProfile.age}`, `${activeProfile.age}a`)})`
                      : tr(lang, `גִּיל ${kidAge}`, `Age ${kidAge}`, `Edad ${kidAge}`)}
                  </span>
                </div>

                <p className="text-xs text-violet-900 font-semibold leading-snug">
                  {tr(
                    lang,
                    'כְּשֶׁהַזְּמַן נִגְמָר, הָאֲפְּלִיקַצְיָה נִסְגֶּרֶת לַיֶּלֶד עַד לְיּוֹם לְמָחֳרָת אוֹ עַד שֶׁהוֹרֶה יִפְתַּח אוֹתָהּ.',
                    'When time runs out, the app closes for the child until tomorrow or until an adult unlocks it.',
                    'Cuando se acaba el tiempo, la aplicación se cierra hasta mañana o hasta que un adulto la desbloquee.'
                  )}
                </p>

                {/* Live usage summary */}
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="bg-white rounded-xl border border-violet-200 px-3 py-2">
                    <div className="text-slate-500 font-bold">{tr(lang, 'שֻׂחַק הַיּוֹם:', 'Played today:', 'Jugado hoy:')}</div>
                    <div className="font-black text-slate-900 text-sm mt-0.5">
                      <bdi dir="ltr">
                        {formatUsedMinutes(limitEntry?.dailyUsedSec || 0)}m
                        {limitState?.dailyAllowanceSec ? ` / ${Math.round(limitState.dailyAllowanceSec / 60)}m` : ''}
                      </bdi>
                      {limitState?.dailyRemainingSec !== null && (
                        <span className="text-violet-700 font-bold ms-1.5 text-xs">
                          ({tr(lang, 'נִשְׁאַר', 'left', 'queda')} <bdi dir="ltr">{formatMinutesSeconds(limitState.dailyRemainingSec)}</bdi>)
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="bg-white rounded-xl border border-violet-200 px-3 py-2">
                    <div className="text-slate-500 font-bold">{tr(lang, 'בַּסֵּשֶׁן הַזֶּה:', 'This session:', 'Esta sesión:')}</div>
                    <div className="font-black text-slate-900 text-sm mt-0.5">
                      <bdi dir="ltr">
                        {formatUsedMinutes(limitEntry?.sessionUsedSec || 0)}m
                        {limitState?.sessionAllowanceSec ? ` / ${Math.round(limitState.sessionAllowanceSec / 60)}m` : ''}
                      </bdi>
                      {limitState?.sessionRemainingSec !== null && (
                        <span className="text-violet-700 font-bold ms-1.5 text-xs">
                          ({tr(lang, 'נִשְׁאַר', 'left', 'queda')} <bdi dir="ltr">{formatMinutesSeconds(limitState.sessionRemainingSec)}</bdi>)
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Daily Limit Presets + Custom */}
                <div className="flex flex-col gap-1.5">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-xs font-black text-violet-950">
                      {tr(lang, '📅 מִגְבָּלָה יוֹמִית (דַּקּוֹת בְּיוֹם):', '📅 Daily Limit (minutes/day):', '📅 Límite diario (min/día):')}
                    </span>
                    <div className="flex items-center gap-1">
                      <input
                        type="number"
                        min="1"
                        max="300"
                        inputMode="numeric"
                        value={customDailyInput}
                        onChange={(e) => setCustomDailyInput(e.target.value)}
                        onBlur={() => {
                          const val = customDailyInput.trim();
                          onUpdatePlayLimits({
                            dailyLimitMin: val ? Math.max(1, Math.min(300, parseInt(val, 10) || 1)) : null,
                            sessionLimitMin: limitEntry?.sessionLimitMin ?? null
                          });
                        }}
                        placeholder={tr(lang, 'מֻתְאָם', 'Custom', 'Otro')}
                        aria-label={tr(lang, 'דַּקּוֹת לְיוֹם', 'Minutes per day', 'Minutos por día')}
                        className="w-20 px-2 py-1 rounded-lg bg-white border border-violet-300 text-xs font-black text-slate-900 text-center"
                        dir="ltr"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-6 gap-1.5">
                    {DAILY_PRESETS.map((mins) => {
                      const active = (limitEntry?.dailyLimitMin ?? null) === mins;
                      return (
                        <button
                          key={String(mins)}
                          type="button"
                          onClick={() => {
                            playSound('pop');
                            setCustomDailyInput(mins ? String(mins) : '');
                            onUpdatePlayLimits({
                              dailyLimitMin: mins,
                              sessionLimitMin: limitEntry?.sessionLimitMin ?? null
                            });
                          }}
                          className={`py-1.5 px-1 rounded-xl font-black text-xs border-2 transition cursor-pointer ${
                            active
                              ? 'bg-violet-600 text-white border-violet-700 shadow-sm'
                              : 'bg-white text-slate-700 border-violet-200 hover:bg-violet-100'
                          }`}
                        >
                          {mins === null ? tr(lang, 'לְלֹא', 'Off', 'No') : <bdi dir="ltr">{mins}m</bdi>}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Session Limit Presets + Custom */}
                <div className="flex flex-col gap-1.5">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-xs font-black text-violet-950">
                      {tr(lang, '⏱️ מִגְבָּלָה לְסֵשֶׁן (דַּקּוֹת בְּרֶצֶף):', '⏱️ Per-Session Limit (minutes):', '⏱️ Límite por sesión (min):')}
                    </span>
                    <div className="flex items-center gap-1">
                      <input
                        type="number"
                        min="1"
                        max="180"
                        inputMode="numeric"
                        value={customSessionInput}
                        onChange={(e) => setCustomSessionInput(e.target.value)}
                        onBlur={() => {
                          const val = customSessionInput.trim();
                          onUpdatePlayLimits({
                            dailyLimitMin: limitEntry?.dailyLimitMin ?? null,
                            sessionLimitMin: val ? Math.max(1, Math.min(180, parseInt(val, 10) || 1)) : null
                          });
                        }}
                        placeholder={tr(lang, 'מֻתְאָם', 'Custom', 'Otro')}
                        aria-label={tr(lang, 'דַּקּוֹת לְסֵשֶׁן', 'Minutes per session', 'Minutos por sesión')}
                        className="w-20 px-2 py-1 rounded-lg bg-white border border-violet-300 text-xs font-black text-slate-900 text-center"
                        dir="ltr"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-5 gap-1.5">
                    {SESSION_PRESETS.map((mins) => {
                      const active = (limitEntry?.sessionLimitMin ?? null) === mins;
                      return (
                        <button
                          key={String(mins)}
                          type="button"
                          onClick={() => {
                            playSound('pop');
                            setCustomSessionInput(mins ? String(mins) : '');
                            onUpdatePlayLimits({
                              dailyLimitMin: limitEntry?.dailyLimitMin ?? null,
                              sessionLimitMin: mins
                            });
                          }}
                          className={`py-1.5 px-1 rounded-xl font-black text-xs border-2 transition cursor-pointer ${
                            active
                              ? 'bg-violet-600 text-white border-violet-700 shadow-sm'
                              : 'bg-white text-slate-700 border-violet-200 hover:bg-violet-100'
                          }`}
                        >
                          {mins === null ? tr(lang, 'לְלֹא', 'Off', 'No') : <bdi dir="ltr">{mins}m</bdi>}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Quick override buttons */}
                {limitState?.hasLimit && (
                  <div className="flex flex-wrap items-center gap-2 pt-1">
                    {onGrantBonusMinutes && (
                      <button
                        type="button"
                        onClick={() => {
                          playSound('star');
                          onGrantBonusMinutes(10);
                        }}
                        className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs btn-press-3d cursor-pointer"
                      >
                        <PlusCircle className="w-3.5 h-3.5" />
                        <span>{tr(lang, '+10 דַּקּוֹת בּוֹנוּס', '+10m Bonus', '+10m Extra')}</span>
                      </button>
                    )}
                    {onResetSessionTimer && (
                      <button
                        type="button"
                        onClick={() => {
                          playSound('pop');
                          onResetSessionTimer();
                        }}
                        className="px-3 py-1.5 rounded-xl bg-white hover:bg-violet-100 border border-violet-300 text-violet-900 font-black text-xs cursor-pointer"
                      >
                        {tr(lang, 'אִפּוּס סֵשֶׁן', 'Reset Session', 'Reiniciar sesión')}
                      </button>
                    )}
                    {onResetTodayUsage && (
                      <button
                        type="button"
                        onClick={() => {
                          playSound('pop');
                          onResetTodayUsage();
                        }}
                        className="px-3 py-1.5 rounded-xl bg-white hover:bg-rose-50 border border-rose-200 text-rose-700 font-black text-xs cursor-pointer"
                      >
                        {tr(lang, 'אִפּוּס הַיּוֹם', 'Reset Today', 'Reiniciar hoy')}
                      </button>
                    )}
                  </div>
                )}
              </div>
            )}

            {/* Optional Google Cloud Sync Section */}
            <div className="p-4 bg-sky-50 border-2 border-sky-200 rounded-2xl flex flex-col gap-2.5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 font-black text-sky-950">
                  <Cloud className="w-5 h-5 text-sky-600" />
                  <span>{tr(lang, 'שְׁמִירַת הִתְקַדְּמוּת בֶּעָנָן (אוֹפְּצְיוֹנָלִי)', 'Cloud Progress Backup (Optional)', 'Copia de seguridad en la nube (Opcional)')}</span>
                </div>
              </div>

              {user ? (
                <div className="flex flex-col gap-2">
                  <div className="flex items-center justify-between bg-white p-3 rounded-xl border border-sky-200">
                    <div className="flex items-center gap-2.5 min-w-0">
                      {user.picture && (
                        <img src={user.picture} alt="" className="w-9 h-9 rounded-full border border-sky-300" />
                      )}
                      <div className="truncate">
                        <div className="font-black text-slate-800 truncate">{user.name}</div>
                        <div className="text-xs text-slate-500 truncate">{user.email}</div>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={async () => {
                        await signOutSession();
                        onSignOut();
                      }}
                      className="flex items-center gap-1 px-3 py-1.5 bg-slate-100 hover:bg-rose-50 text-slate-600 hover:text-rose-700 rounded-xl font-bold text-xs cursor-pointer"
                    >
                      <LogOut className="w-4 h-4" />
                      <span>{tr(lang, 'הִתְנַתְּקוּת', 'Sign Out', 'Cerrar sesión')}</span>
                    </button>
                  </div>

                  {onOpenProfilePicker && (
                    <button
                      type="button"
                      onClick={() => {
                        playSound('pop');
                        onClose();
                        onOpenProfilePicker();
                      }}
                      className="w-full py-2.5 px-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-black text-xs sm:text-sm flex items-center justify-center gap-2 shadow-sm btn-press-3d cursor-pointer"
                    >
                      <Users className="w-4 h-4" />
                      <span>
                        {tr(
                          lang,
                          `פְּרוֹפִילֵי יְלָדִים (${profilesCount}) — בְּחִירָה וְהוֹסָפָה`,
                          `Kid Profiles (${profilesCount}) — Switch or Add`,
                          `Perfiles de niños (${profilesCount}) — Cambiar o añadir`
                        )}
                      </span>
                    </button>
                  )}
                </div>
              ) : serverConfig?.googleClientId ? (
                <div className="flex flex-col items-center gap-2 pt-1">
                  <p className="text-xs text-sky-900 text-center">
                    {tr(
                      lang,
                      'הַיְּלָדִים מְשַׂחֲקִים בְּלִי הִתְחַבְּרוּת. הוֹרִים יְכוֹלִים לְהִתְחַבֵּר עִם Google כְּדֵי לְסַנְכְּרֵן כּוֹכָבִים וְ-PRO בֵּין מַכְשִׁירִים:',
                      'Kids never need to log in. Parents can optionally sign in with Google to sync stars & Pro across devices:',
                      'Los niños nunca necesitan iniciar sesión. Los padres pueden iniciar sesión con Google opcionalmente para sincronizar estrellas y Pro entre dispositivos:'
                    )}
                  </p>
                  <div ref={googleBtnRef} />
                  {authStatus && <span className="text-xs font-bold text-indigo-700">{authStatus}</span>}
                </div>
              ) : (
                <p className="text-xs text-sky-900">
                  {tr(
                    lang,
                    'סִנְכְּרוּן הֶעָנָן אֵינוֹ זָמִין כָּרֶגַע — הַהִתְקַדְּמוּת שֶׁלָּכֶם שְׁמוּרָה בַּמַּכְשִׁיר הַזֶּה.',
                    'Cloud sync is currently offline — your progress is saved on this device.',
                    'La sincronización en la nube no está disponible en este momento — tu progreso está guardado en este dispositivo.'
                  )}
                </p>
              )}
            </div>

            {/* Settings + Pro Row */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {/* 3-Way Language Selector */}
              <div className="sm:col-span-2 p-2.5 bg-indigo-50 border-2 border-indigo-200 rounded-2xl flex flex-col gap-2">
                <div className="flex items-center gap-2 text-xs font-black text-indigo-950 px-1">
                  <Languages className="w-4 h-4 text-indigo-600" />
                  <span>{tr(lang, 'שְׂפַת הַמִּמְשָׁק', 'App Language', 'Idioma de la aplicación')}</span>
                </div>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { code: 'he', label: 'עִבְרִית 🇮🇱' },
                    { code: 'en', label: 'English 🇬🇧' },
                    { code: 'es', label: 'Español 🇪🇸' }
                  ].map((opt) => {
                    const active = lang === opt.code;
                    return (
                      <button
                        key={opt.code}
                        type="button"
                        aria-pressed={active}
                        onClick={() => selectLanguage(opt.code)}
                        className={`py-2.5 px-2 rounded-xl font-black text-xs sm:text-sm border-2 btn-press-3d cursor-pointer transition ${
                          active
                            ? 'bg-indigo-600 text-white border-indigo-700 shadow-sm'
                            : 'bg-white text-slate-700 border-indigo-200 hover:bg-indigo-100'
                        }`}
                      >
                        {opt.label}
                      </button>
                    );
                  })}
                </div>
              </div>

              <button
                type="button"
                onClick={() => {
                  onClose();
                  onOpenPro(true);
                }}
                className={`sm:col-span-2 flex items-center justify-center gap-2 px-4 py-3 font-black rounded-2xl border-2 btn-press-3d cursor-pointer ${
                  isPro
                    ? 'bg-emerald-100 border-emerald-400 text-emerald-950'
                    : 'bg-amber-300 hover:bg-amber-400 border-amber-500 text-amber-950'
                }`}
              >
                <Crown className="w-5 h-5" />
                <span>
                  {isPro
                    ? tr(lang, 'גִּרְסַת PRO פְּעִילָה ✓', 'Pro Active ✓', 'Pro Activo ✓')
                    : tr(lang, 'שִׁדְרוּג לְגִרְסָה מְלֵאָה', 'Upgrade to Pro', 'Mejorar a Pro')}
                </span>
              </button>

              {!isTouch && (
                <div className="sm:col-span-2 p-3.5 bg-amber-50 rounded-2xl border-2 border-amber-300 flex flex-col gap-2">
                  <div className="flex items-center gap-2 font-black text-amber-950 text-sm">
                    <MousePointer2 className="w-4 h-4" />
                    <span>
                      {tr(lang, 'גֹּדֶל סַמָּן עַכְבָּר לִילָדִים:', 'Kid Mouse Cursor Size:', 'Tamaño del Cursor Infantil:')}
                    </span>
                  </div>
                  <div className="grid grid-cols-4 gap-2">
                    {[
                      { id: 'off', he: 'כָּבוּי', en: 'Off', es: 'Apagado' },
                      { id: 'normal', he: 'רָגִיל', en: 'Normal', es: 'Normal' },
                      { id: 'large', he: 'גָּדוֹל ⭐', en: 'Big ⭐', es: 'Grande ⭐' },
                      { id: 'huge', he: 'עֲנָק 🌟', en: 'Huge 🌟', es: 'Enorme 🌟' }
                    ].map((opt) => {
                      const active = kidCursorSize === opt.id;
                      return (
                        <button
                          key={opt.id}
                          type="button"
                          onClick={() => {
                            playSound('pop');
                            if (setKidCursorSize) setKidCursorSize(opt.id);
                            else setKidCursorEnabled(opt.id !== 'off');
                          }}
                          aria-pressed={active}
                          className={`px-2 py-2 rounded-xl font-black text-xs md:text-sm border-2 transition cursor-pointer ${
                            active
                              ? 'bg-amber-400 border-amber-600 text-slate-950 shadow-sm'
                              : 'bg-white border-amber-200 text-slate-700 hover:bg-amber-100'
                          }`}
                        >
                          {tr(lang, opt.he, opt.en, opt.es)}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>

            {/* Pedagogy & Privacy Summary */}
            <div className="p-3.5 bg-amber-50 rounded-2xl border border-amber-200 leading-relaxed">
              <h4 className="font-black text-amber-900 mb-1">
                {tr(
                  lang,
                  'תְּאִימוּת לְתָכְנִית מִשְׂרַד הַחִנּוּךְ (גִּילָאֵי 4–5):',
                  'Curriculum & Play Psychology (Ages 4–5):',
                  'Currículo y Psicología del Juego (Edades 4–5):'
                )}
              </h4>
              <p className="text-xs md:text-sm">
                {tr(
                  lang,
                  'מודעות פונולוגית, שיטת "הפופיק" לדגש קל (בּ/ב, כּ/כ, פּ/פ), תנועות יסוד והבעות פנים, קריאה מימין לשמאל ברכבת הקריאה, וספירה חד-חד-ערכית 1–10 עם משוב חיובי ללא ענישה.',
                  'Phonological awareness, Pupik somatic dagesh method, vowel mouth cues, right-to-left reading train, and 1-to-1 counting 1–10 with zero-punishment encouragement.',
                  'Conciencia fonológica, método somático Pupik para el daguesh, pistas visuales de vocales, tren de lectura de derecha a izquierda y conteo 1-a-1 del 1 al 10 con refuerzo positivo sin castigos.'
                )}
              </p>
            </div>

            <div className="p-3.5 bg-emerald-50 rounded-2xl border border-emerald-200 flex items-start gap-2.5">
              <ShieldCheck className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" />
              <p className="text-xs md:text-sm text-emerald-950 font-medium">
                {tr(
                  lang,
                  'פְּרָטִיּוּת מְלֵאָה לִילָדִים: 100% אופליין, ללא פרסומות וללא מעקב. התחברות Google היא אופציונלית להורים בלבד.',
                  '100% Kid-Safe: Runs offline with zero ads and zero tracking. Google Sign-In is optional for parents only.',
                  '100% Seguro para Niños: Funciona sin conexión, sin anuncios y sin rastreo. El inicio de sesión con Google es opcional solo para padres.'
                )}
              </p>
            </div>

            <div className="flex items-center justify-between pt-2">
              <button
                type="button"
                onClick={() => {
                  onResetStars();
                  playSound('whoosh');
                }}
                className="flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-rose-600 px-3 py-2 rounded-xl cursor-pointer"
              >
                <RotateCcw className="w-4 h-4" />
                <span>{tr(lang, 'אִפּוּס כּוֹכָבִים', 'Reset Stars', 'Reiniciar Estrellas')}</span>
              </button>

              <button
                type="button"
                onClick={onClose}
                className="px-6 py-2.5 bg-amber-400 hover:bg-amber-500 font-black text-slate-900 rounded-2xl shadow btn-press-3d cursor-pointer"
              >
                {tr(lang, 'סְגוֹר', 'Close', 'Cerrar')}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
