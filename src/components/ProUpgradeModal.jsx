import React, { useState, useEffect } from 'react';
import { X, Lock, Crown, CheckCircle2, Sparkles, KeyRound, ExternalLink } from 'lucide-react';
import { playSound, playAudioFile } from '../utils/audio';
import { redeemActivationCode } from '../utils/cloudSync';

/**
 * Parental-Gated Pro Upgrade Modal (Designed for Families compliant).
 * Keeps 4-year-olds safely away from purchase/checkout controls until a parent solves the gate.
 */
export default function ProUpgradeModal({
  open,
  onClose,
  lang,
  isPro,
  onUnlockPro,
  serverConfig,
  user
}) {
  const isHe = lang === 'he';
  const [unlockedGate, setUnlockedGate] = useState(false);
  const [challenge, setChallenge] = useState({ a: 4, b: 3, ans: 7, options: [5, 6, 7, 8] });
  const [wrong, setWrong] = useState(false);
  const [code, setCode] = useState('');
  const [codeMsg, setCodeMsg] = useState(null);
  const [busy, setBusy] = useState(false);

  const isNativeAndroid = Boolean(window.Capacitor?.isNativePlatform?.());

  useEffect(() => {
    if (open) {
      setUnlockedGate(false);
      setWrong(false);
      setCode('');
      setCodeMsg(null);
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

  useEffect(() => {
    if (!open) return;
    const onKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [open, onClose]);

  if (!open) return null;

  const handleRedeem = async (e) => {
    e.preventDefault();
    if (!code.trim() || busy) return;
    setBusy(true);
    setCodeMsg(null);
    try {
      await redeemActivationCode(code.trim());
      playSound('win');
      onUnlockPro();
      setCodeMsg({ ok: true, text: isHe ? '🎉 גִּישַׁת PRO נִפְתְּחָה בְּהַצְלָחָה!' : '🎉 Pro Access Unlocked!' });
    } catch (err) {
      playSound('whoosh');
      setCodeMsg({ ok: false, text: err.message || (isHe ? 'קוֹד לֹא תָּקֵף' : 'Invalid code') });
    } finally {
      setBusy(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 bg-black/55 backdrop-blur-sm flex items-center justify-center p-4"
      dir={isHe ? 'rtl' : 'ltr'}
    >
      <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border-4 border-amber-400 max-h-[90vh] overflow-y-auto animate-pop-in">
        <div className="flex items-center justify-between pb-3 border-b border-slate-200 mb-4">
          <div className="flex items-center gap-2">
            {unlockedGate ? <Crown className="w-6 h-6 text-amber-500" /> : <Lock className="w-6 h-6 text-indigo-600" />}
            <h3 className="text-xl font-black text-slate-800">
              {unlockedGate
                ? isHe ? 'מַסְלוּל מִשְׁפָּחָה PRO' : 'Family Pro Pass'
                : isHe ? 'אֵזוֹר הוֹרִים בִּלְבַד' : 'Parents Only'}
            </h3>
          </div>
          <button type="button" onClick={onClose} className="p-2 rounded-full hover:bg-slate-100 text-slate-500 cursor-pointer">
            <X className="w-6 h-6" />
          </button>
        </div>

        {!unlockedGate ? (
          <div className="text-center py-4 flex flex-col items-center gap-4">
            <p className="text-slate-600 font-bold text-base">
              {isHe
                ? 'מִשְׂחָק זֶה שַׁיָּךְ לְמַסְלוּל הַמָּלֵא. הוֹרִים — פִּתְרוּ כְּדֵי לְהַמְשִׁיךְ:'
                : 'This learning world is part of the full Family Pass. Parents — solve to continue:'}
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
                      setUnlockedGate(true);
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
            <div className="bg-gradient-to-br from-amber-50 to-orange-50 border-2 border-amber-300 rounded-2xl p-4 space-y-2">
              <div className="font-black text-amber-950 text-base flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-amber-500" />
                <span>{isHe ? 'מָה כָּלוּל בְּגִרְסַת הַ-PRO הַמְּלֵאָה?' : 'What’s unlocked in Family Pro:'}</span>
              </div>
              <ul className="space-y-1.5 text-xs md:text-sm font-bold text-slate-700">
                <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" /> {isHe ? 'עוֹלַם הַנִּקּוּד (פַּתַח, חִירִיק, חוֹלָם, שׁוּרוּק, סֶגוֹל)' : 'World of Vowels (Nikud & Mouth Cues)'}</li>
                <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" /> {isHe ? 'מִלִּים רִאשׁוֹנוֹת (הַרְכָּבַת מִלִּים מֵהֲבָרוֹת)' : 'First Words Blending Studio'}</li>
                <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" /> {isHe ? 'צִיּוּר וּכְתִיבָה מֻנְחָה שֶׁל כָּל הָאוֹתִיּוֹת וְהַמִּסְפָּרִים' : 'Guided Letter & Number Tracing'}</li>
                <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" /> {isHe ? 'הַקּוֹל הַפּוֹתֵחַ + חֶשְׁבּוֹן רִאשׁוֹן עִם פֵּרוֹת' : 'Opening Sound + First Fruit Math Games'}</li>
              </ul>
              <p className="text-[11px] text-amber-800 pt-1">
                {user
                  ? isHe ? `מְחֻבָּר כְּ-${user.email} — הַפְּתִיחָה תִּשָּׁמֵר בֶּעָנָן.` : `Signed in as ${user.email} — Pro syncs to your account.`
                  : isHe ? 'מוּמְלָץ לְהִתְחַבֵּר עִם Google בְּאֵזוֹר הַהוֹרִים כְּדֵי לִשְׁמֹר גִּישָׁה בְּכָל הַמַּכְשִׁירִים.' : 'Sign in with Google in Parent Zone to keep Pro synced across devices.'}
              </p>
            </div>

            {isPro ? (
              <div className="p-4 bg-emerald-100 border-2 border-emerald-400 rounded-2xl text-emerald-950 font-black text-center">
                {isHe ? '✅ גִּישַׁת PRO פְּעִילָה בַּחֶשְׁבּוֹן זֶה!' : '✅ Pro Access is Active!'}
              </div>
            ) : (
              <>
                {!isNativeAndroid && serverConfig?.stripePaymentLink && (
                  <a
                    href={serverConfig.stripePaymentLink}
                    target="_blank"
                    rel="noreferrer"
                    className="w-full py-3.5 px-5 bg-gradient-to-r from-amber-400 to-orange-500 hover:from-amber-500 hover:to-orange-600 text-slate-950 font-black text-base rounded-2xl shadow-lg flex items-center justify-center gap-2 btn-press-3d"
                  >
                    <Crown className="w-5 h-5" />
                    <span>
                      {isHe
                        ? `שִׁדְרוּג מָלֵא בְּ-${serverConfig.proPriceLabel || '$4.99'}`
                        : `Unlock Full Access (${serverConfig.proPriceLabel || '$4.99'})`}
                    </span>
                    <ExternalLink className="w-4 h-4" />
                  </a>
                )}

                {isNativeAndroid && (
                  <div className="p-3.5 bg-indigo-50 border border-indigo-200 rounded-2xl text-xs text-indigo-950 font-bold text-center">
                    {isHe
                      ? 'בְּאַפְּלִיקַצְיַת Google Play, הַשִּׁדְרוּג מִתְבַּצֵּעַ דֶּרֶךְ Google Play Billing אוֹ עִם קוֹד מִשְׁפָּחָה.'
                      : 'On Android, Pro unlocks via Google Play In-App Purchase or a Family Activation Code below.'}
                  </div>
                )}

                {/* Family / Teacher Activation Code Redemption */}
                <form onSubmit={handleRedeem} className="flex flex-col gap-2 pt-1">
                  <label className="text-xs font-extrabold text-slate-600 flex items-center gap-1.5">
                    <KeyRound className="w-4 h-4 text-indigo-600" />
                    <span>{isHe ? 'יֵשׁ לָכֶם קוֹד מִשְׁפָּחָה / מַתָּנָה?' : 'Have a Family / Gift Activation Code?'}</span>
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={code}
                      onChange={(e) => setCode(e.target.value)}
                      placeholder={isHe ? 'הַקְלִידוּ קוֹד...' : 'Enter code...'}
                      className="flex-1 px-4 py-2.5 rounded-2xl border-2 border-slate-200 focus:border-indigo-400 outline-none font-bold uppercase text-sm"
                      dir="ltr"
                    />
                    <button
                      type="submit"
                      disabled={busy}
                      className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-black rounded-2xl btn-press-3d cursor-pointer disabled:opacity-50"
                    >
                      {isHe ? 'הַפְעֵל' : 'Activate'}
                    </button>
                  </div>
                  {codeMsg && (
                    <p className={`text-xs font-bold ${codeMsg.ok ? 'text-emerald-700' : 'text-rose-600'}`}>
                      {codeMsg.text}
                    </p>
                  )}
                </form>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
