import React, { useState, useEffect, useRef } from 'react';
import { X, Lock, Languages, Sparkles, ShieldCheck, MousePointer2, RotateCcw, Crown, LogOut, Cloud, BarChart3 } from 'lucide-react';
import { playSound, playAudioFile } from '../utils/audio';
import { useDeviceType } from '../utils/useDeviceType';
import { loadGoogleIdentityScript, signInWithGoogleCredential, signOutSession } from '../utils/cloudSync';

/**
 * Parental Gate + Settings / Optional Google Sign-In / Pedagogy Guide Modal.
 */
export default function ParentModal({
  open,
  onClose,
  lang,
  setLang,
  kidCursorEnabled,
  setKidCursorEnabled,
  onResetStars,
  user,
  onAuthSuccess,
  onSignOut,
  isPro,
  onOpenPro,
  onOpenStats,
  serverConfig
}) {
  const isHe = lang === 'he';
  const { isTouch } = useDeviceType();
  const [unlocked, setUnlocked] = useState(false);
  const [challenge, setChallenge] = useState({ a: 4, b: 3, ans: 7, options: [6, 7, 8, 9] });
  const [wrong, setWrong] = useState(false);
  const [authStatus, setAuthStatus] = useState(null);
  const googleBtnRef = useRef(null);

  useEffect(() => {
    if (open) {
      setUnlocked(false);
      setWrong(false);
      setAuthStatus(null);
      const a = 3 + Math.floor(Math.random() * 5);
      const b = 2 + Math.floor(Math.random() * 4);
      const ans = a + b;
      const opts = new Set([ans]);
      while (opts.size < 4) {
        opts.add(ans + (Math.floor(Math.random() * 5) - 2) || ans + 3);
      }
      setChallenge({ a, b, ans, options: [...opts].sort(() => 0.5 - Math.random()) });
      playAudioFile('/audio/phrases/parents_only.mp3');
    }
  }, [open]);

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
            setAuthStatus(isHe ? 'מתחבר...' : 'Signing in...');
            const result = await signInWithGoogleCredential(response.credential);
            playSound('star');
            onAuthSuccess(result);
            setAuthStatus(null);
          } catch (err) {
            setAuthStatus(err.message || 'Sign-in failed');
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
  }, [open, unlocked, user, serverConfig, isHe, onAuthSuccess]);

  useEffect(() => {
    if (!open) return;
    const onKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [open, onClose]);

  if (!open) return null;

  const toggleLanguage = () => {
    playSound('pop');
    const newLang = isHe ? 'en' : 'he';
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
                ? isHe ? 'אֵזוֹר הוֹרִים וְגַנָּנוֹת' : 'Parents & Educators'
                : isHe ? 'אֵזוֹר הוֹרִים בִּלְבַד' : 'For Parents Only'}
            </h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-full hover:bg-slate-100 text-slate-500 cursor-pointer"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {!unlocked ? (
          <div className="text-center py-4 flex flex-col items-center gap-4">
            <p className="text-slate-600 font-bold text-base">
              {isHe
                ? 'כְּדֵי לְהִכָּנֵס לַהַגְדָּרוֹת, פִּתְרוּ אֶת הַתַּרְגִּיל:'
                : 'To access parent settings, solve this quick question:'}
            </p>
            <div className="text-4xl font-black text-indigo-700 bg-indigo-50 border-2 border-indigo-200 px-8 py-4 rounded-2xl" dir="ltr">
              {challenge.a} + {challenge.b} = ?
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
                    }
                  }}
                  className="py-3 rounded-2xl bg-amber-100 hover:bg-amber-200 border-2 border-amber-400 font-black text-xl text-slate-900 btn-press-3d cursor-pointer"
                >
                  {opt}
                </button>
              ))}
            </div>
            {wrong && <p className="text-sm font-bold text-rose-600">{isHe ? 'נַסּוּ שׁוּב :)' : 'Try again :)'}</p>}
          </div>
        ) : (
          <div className="space-y-4 text-sm text-slate-700">
            {/* Optional Google Cloud Sync Section */}
            <div className="p-4 bg-sky-50 border-2 border-sky-200 rounded-2xl flex flex-col gap-2.5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 font-black text-sky-950">
                  <Cloud className="w-5 h-5 text-sky-600" />
                  <span>{isHe ? 'שְׁמִירַת הִתְקַדְּמוּת בֶּעָנָן (אוֹפְּצְיוֹנָלִי)' : 'Cloud Progress Backup (Optional)'}</span>
                </div>
              </div>

              {user ? (
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
                    <span>{isHe ? 'הִתְנַתְּקוּת' : 'Sign Out'}</span>
                  </button>
                </div>
              ) : serverConfig?.googleClientId ? (
                <div className="flex flex-col items-center gap-2 pt-1">
                  <p className="text-xs text-sky-900 text-center">
                    {isHe
                      ? 'הַיְּלָדִים מְשַׂחֲקִים בְּלִי הִתְחַבְּרוּת. הוֹרִים יְכוֹלִים לְהִתְחַבֵּר עִם Google כְּדֵי לְסַנְכְּרֵן כּוֹכָבִים וְ-PRO בֵּין מַכְשִׁירִים:'
                      : 'Kids never need to log in. Parents can optionally sign in with Google to sync stars & Pro across devices:'}
                  </p>
                  <div ref={googleBtnRef} />
                  {authStatus && <span className="text-xs font-bold text-indigo-700">{authStatus}</span>}
                </div>
              ) : (
                <p className="text-xs text-sky-900">
                  {isHe
                    ? 'הִתְחַבְּרוּת Google מוּכָנָה בַּשָּׁרָת — הוֹסִיפוּ GOOGLE_CLIENT_ID בְּהַגְדָּרוֹת Cloudflare Pages כְּדֵי לְהַפְעִיל אֶת הַכַּפְתּוֹר.'
                    : 'Google Sign-In backend is ready — set GOOGLE_CLIENT_ID in Cloudflare Pages environment variables to enable the button.'}
                </p>
              )}
            </div>

            {/* Settings + Pro Row */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <button
                type="button"
                onClick={toggleLanguage}
                className="flex items-center justify-center gap-2 px-4 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-black rounded-2xl btn-press-3d cursor-pointer"
              >
                <Languages className="w-5 h-5" />
                <span>{isHe ? 'Switch to English 🇬🇧' : 'הַחֲלֵף לְעִבְרִית 🇮🇱'}</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  onClose();
                  onOpenPro();
                }}
                className={`flex items-center justify-center gap-2 px-4 py-3 font-black rounded-2xl border-2 btn-press-3d cursor-pointer ${
                  isPro
                    ? 'bg-emerald-100 border-emerald-400 text-emerald-950'
                    : 'bg-amber-300 hover:bg-amber-400 border-amber-500 text-amber-950'
                }`}
              >
                <Crown className="w-5 h-5" />
                <span>{isPro ? (isHe ? 'גִּרְסַת PRO פְּעִילָה ✓' : 'Pro Active ✓') : isHe ? 'שִׁדְרוּג לְגִרְסָה מְלֵאָה' : 'Upgrade to Pro'}</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  playSound('pop');
                  onClose();
                  onOpenStats();
                }}
                className="sm:col-span-2 flex items-center justify-center gap-2 px-4 py-3 bg-slate-800 hover:bg-slate-900 text-white font-black rounded-2xl btn-press-3d cursor-pointer"
              >
                <BarChart3 className="w-5 h-5 text-amber-300" />
                <span>{isHe ? '📊 סְטָטִיסְטִיקוֹת שִׁמּוּשׁ בָּאֲתָר' : '📊 View Usage & Site Stats'}</span>
              </button>

              {!isTouch && (
                <button
                  type="button"
                  onClick={() => {
                    playSound('pop');
                    setKidCursorEnabled(!kidCursorEnabled);
                  }}
                  className={`sm:col-span-2 flex items-center justify-center gap-2 px-4 py-3 font-black rounded-2xl border-2 btn-press-3d cursor-pointer ${
                    kidCursorEnabled
                      ? 'bg-amber-100 border-amber-400 text-amber-950'
                      : 'bg-slate-100 border-slate-300 text-slate-700'
                  }`}
                >
                  <MousePointer2 className="w-5 h-5" />
                  <span>
                    {isHe
                      ? `סַמָּן עַכְבָּר גָּדוֹל: ${kidCursorEnabled ? 'פָּעִיל ⭐' : 'כָּבוּי'}`
                      : `Big Kid Cursor: ${kidCursorEnabled ? 'ON ⭐' : 'OFF'}`}
                  </span>
                </button>
              )}
            </div>

            {/* Pedagogy & Privacy Summary */}
            <div className="p-3.5 bg-amber-50 rounded-2xl border border-amber-200 leading-relaxed">
              <h4 className="font-black text-amber-900 mb-1">
                {isHe
                  ? 'תְּאִימוּת לְתָכְנִית מִשְׂרַד הַחִנּוּךְ (גִּילָאֵי 4–5):'
                  : 'Curriculum & Play Psychology (Ages 4–5):'}
              </h4>
              <p className="text-xs md:text-sm">
                {isHe
                  ? 'מודעות פונולוגית, שיטת "הפופיק" לדגש קל (בּ/ב, כּ/כ, פּ/פ), תנועות יסוד והבעות פנים, קריאה מימין לשמאל ברכבת הקריאה, וספירה חד-חד-ערכית 1–10 עם משוב חיובי ללא ענישה.'
                  : 'Phonological awareness, Pupik somatic dagesh method, vowel mouth cues, right-to-left reading train, and 1-to-1 counting 1–10 with zero-punishment encouragement.'}
              </p>
            </div>

            <div className="p-3.5 bg-emerald-50 rounded-2xl border border-emerald-200 flex items-start gap-2.5">
              <ShieldCheck className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" />
              <p className="text-xs md:text-sm text-emerald-950 font-medium">
                {isHe
                  ? 'פְּרָטִיּוּת מְלֵאָה לִילָדִים: 100% אופליין, ללא פרסומות וללא מעקב. התחברות Google היא אופציונלית להורים בלבד.'
                  : '100% Kid-Safe: Runs offline with zero ads and zero tracking. Google Sign-In is optional for parents only.'}
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
                <span>{isHe ? 'אִפּוּס כּוֹכָבִים' : 'Reset Stars'}</span>
              </button>

              <button
                type="button"
                onClick={onClose}
                className="px-6 py-2.5 bg-amber-400 hover:bg-amber-500 font-black text-slate-900 rounded-2xl shadow btn-press-3d cursor-pointer"
              >
                {isHe ? 'סְגוֹר' : 'Close'}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
