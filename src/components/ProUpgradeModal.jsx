import React, { useState, useEffect } from 'react';
import { X, Lock, Crown, CheckCircle2, Sparkles, ExternalLink, RefreshCw, Smartphone } from 'lucide-react';
import { playSound, playAudioFile } from '../utils/audio';
import { tr } from '../utils/i18n';
import { fetchCurrentSession } from '../utils/cloudSync';
import { purchasePlaySubscription, restorePlaySubscription } from '../utils/playBilling';

/**
 * Parental-Gated Pro Upgrade Modal (Designed for Families compliant).
 * Google Play Store monthly subscription (₪20/month) is the sole payment method;
 * subscribers sign in with Google to sync Pro access to Desktop/Web as well.
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
  const [statusMsg, setStatusMsg] = useState(null);
  const [busy, setBusy] = useState(false);

  const isNativeAndroid = Boolean(window.Capacitor?.isNativePlatform?.());
  const priceLabel = serverConfig?.proPriceLabel || '₪20';
  const productId = serverConfig?.playProductId || 'pro_monthly_20ils';
  const playStoreUrl =
    serverConfig?.playStoreUrl ||
    'https://play.google.com/store/apps/details?id=com.learningapp.hebrewkids';

  useEffect(() => {
    if (open) {
      setUnlockedGate(false);
      setWrong(false);
      setStatusMsg(null);
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

  const handleSubscribeAndroid = async () => {
    if (busy) return;
    setBusy(true);
    setStatusMsg(null);
    try {
      await purchasePlaySubscription(productId);
      playSound('win');
      onUnlockPro();
      setStatusMsg({
        ok: true,
        text: tr(
          lang,
          '🎉 המנוי הופעל! התחברו עם Google כדי לפתוח גם במחשב.',
          '🎉 Subscription active! Sign in with Google to unlock on desktop too.',
          '🎉 ¡Suscripción activa! Inicia sesión con Google para desbloquear también en PC.'
        )
      });
    } catch (err) {
      playSound('whoosh');
      setStatusMsg({ ok: false, text: err.message || 'Purchase failed' });
    } finally {
      setBusy(false);
    }
  };

  const handleRestoreAndroid = async () => {
    if (busy) return;
    setBusy(true);
    setStatusMsg(null);
    try {
      await restorePlaySubscription(productId);
      playSound('win');
      onUnlockPro();
      setStatusMsg({
        ok: true,
        text: tr(lang, '✅ המנוי שוחזר בהצלחה!', '✅ Subscription restored!', '✅ ¡Suscripción restaurada!')
      });
    } catch (err) {
      playSound('whoosh');
      setStatusMsg({ ok: false, text: err.message || 'No active subscription found' });
    } finally {
      setBusy(false);
    }
  };

  const handleRefreshWebSync = async () => {
    if (busy) return;
    setBusy(true);
    setStatusMsg(null);
    try {
      const sess = await fetchCurrentSession();
      if (sess?.isPro) {
        playSound('win');
        onUnlockPro();
        setStatusMsg({
          ok: true,
          text: tr(lang, '✅ המנוי סונכרן בהצלחה!', '✅ Subscription synced!', '✅ ¡Suscripción sincronizada!')
        });
      } else {
        playSound('whoosh');
        setStatusMsg({
          ok: false,
          text: tr(
            lang,
            'לא נמצא מנוי פעיל בחשבון זה. הירשמו דרך אפליקציית Google Play והתחברו כאן עם אותו חשבון Google.',
            'No active subscription found on this account. Subscribe via the Google Play app and sign in here with the same Google account.',
            'No se encontró ninguna suscripción activa en esta cuenta. Suscríbete desde la app de Google Play e inicia sesión aquí con la misma cuenta de Google.'
          )
        });
      }
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
                ? tr(lang, 'מַנּוּי מִשְׁפָּחָה PRO', 'Family Pro Subscription', 'Suscripción Familiar Pro')
                : tr(lang, 'אֵזוֹר הוֹרִים בִּלְבַד', 'Parents Only', 'Solo para Padres')}
            </h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label={tr(lang, 'סְגוֹר', 'Close', 'Cerrar')}
            className="p-2 rounded-full hover:bg-slate-100 text-slate-500 cursor-pointer"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {!unlockedGate ? (
          <div className="text-center py-4 flex flex-col items-center gap-4">
            <p className="text-slate-600 font-bold text-base">
              {tr(
                lang,
                'מִשְׂחָק זֶה שַׁיָּךְ לְמַנּוּי הַמָּלֵא. הוֹרִים — פִּתְרוּ כְּדֵי לְהַמְשִׁיךְ:',
                'This learning world is part of the Family Pro subscription. Parents — solve to continue:',
                'Este mundo forma parte de la suscripción Familiar Pro. Padres — resolved para continuar:'
              )}
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
            {wrong && <p className="text-sm font-bold text-rose-600">{tr(lang, 'נַסּוּ שׁוּב :)', 'Try again :)', 'Inténtalo de nuevo :)')}</p>}
          </div>
        ) : (
          <div className="space-y-4 text-sm text-slate-700">
            <div className="bg-gradient-to-br from-amber-50 to-orange-50 border-2 border-amber-300 rounded-2xl p-4 space-y-2">
              <div className="font-black text-amber-950 text-base flex items-center justify-between gap-2">
                <span className="flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-amber-500" />
                  {tr(lang, 'מָה כָּלוּל בְּמַנּוּי PRO?', 'What’s included in Pro:', '¿Qué incluye Pro?')}
                </span>
                <span className="px-2.5 py-0.5 bg-amber-400 text-slate-950 rounded-full text-xs font-black">
                  {tr(lang, `${priceLabel} / חוֹדֶשׁ`, `${priceLabel} / month`, `${priceLabel} / mes`)}
                </span>
              </div>
              <ul className="space-y-1.5 text-xs md:text-sm font-bold text-slate-700">
                <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" /> {tr(lang, 'עוֹלַם הַנִּקּוּד (פַּתַח, חִירִיק, חוֹלָם, שׁוּרוּק, סֶגוֹל)', 'World of Vowels (Nikud & Mouth Cues)', 'Mundo de Vocales (Nikud y gestos)')}</li>
                <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" /> {tr(lang, 'מִלִּים רִאשׁוֹנוֹת (הַרְכָּבַת מִלִּים מֵהֲבָרוֹת)', 'First Words Blending Studio', 'Estudio de Primeras Palabras')}</li>
                <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" /> {tr(lang, 'צִיּוּר וּכְתִיבָה מֻנְחָה שֶׁל כָּל הָאוֹתִיּוֹת וְהַמִּסְפָּרִים', 'Guided Letter & Number Tracing', 'Trazado Guiado de Letras y Números')}</li>
                <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" /> {tr(lang, 'הַקּוֹל הַפּוֹתֵחַ + חֶשְׁבּוֹן רִאשׁוֹן עִם פֵּרוֹת', 'Opening Sound + First Fruit Math Games', 'Sonido Inicial + Primeras Sumas con Frutas')}</li>
              </ul>
              <p className="text-[11px] text-amber-800 pt-1">
                {user
                  ? tr(
                      lang,
                      `מְחֻבָּר כְּ-${user.email} — הַמָּנוּי מְסֻנְכְּרָן לְמַחְשֵׁב וּלְנַיָּד.`,
                      `Signed in as ${user.email} — subscription syncs across Android & Desktop.`,
                      `Conectado como ${user.email} — la suscripción se sincroniza entre Android y PC.`
                    )
                  : tr(
                      lang,
                      'הִתְחַבְּרוּ עִם Google בְּאֵזוֹר הַהוֹרִים כְּדֵי לְסַנְכְּרֵן אֶת הַמָּנוּי מֵהַנַּיָּד לַמַּחְשֵׁב.',
                      'Sign in with Google in Parent Zone to sync your Play Store subscription to Desktop.',
                      'Inicia sesión con Google en la Zona de Padres para sincronizar tu suscripción con PC.'
                    )}
              </p>
            </div>

            {isPro ? (
              <div className="p-4 bg-emerald-100 border-2 border-emerald-400 rounded-2xl text-emerald-950 font-black text-center">
                {tr(lang, '✅ מַנּוּי PRO פָּעִיל בַּחֶשְׁבּוֹן זֶה!', '✅ Pro Subscription is Active!', '✅ ¡La suscripción Pro está activa!')}
              </div>
            ) : isNativeAndroid ? (
              <div className="space-y-2.5">
                <button
                  type="button"
                  disabled={busy}
                  onClick={handleSubscribeAndroid}
                  className="w-full py-3.5 px-5 bg-gradient-to-r from-amber-400 to-orange-500 hover:from-amber-500 hover:to-orange-600 text-slate-950 font-black text-base rounded-2xl shadow-lg flex items-center justify-center gap-2 btn-press-3d cursor-pointer disabled:opacity-50"
                >
                  <Crown className="w-5 h-5" />
                  <span>
                    {tr(
                      lang,
                      `הַרְשָׁמָה בְּ-Google Play (${priceLabel} / חוֹדֶשׁ)`,
                      `Subscribe on Google Play (${priceLabel} / mo)`,
                      `Suscribirse en Google Play (${priceLabel} / mes)`
                    )}
                  </span>
                </button>
                <button
                  type="button"
                  disabled={busy}
                  onClick={handleRestoreAndroid}
                  className="w-full py-2.5 px-4 bg-indigo-50 hover:bg-indigo-100 text-indigo-800 font-bold text-xs rounded-2xl border border-indigo-200 flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  <span>{tr(lang, 'שַׁחְזֵר רְכִישָׁה קַיֶּמֶת', 'Restore Existing Purchase', 'Restaurar compra existente')}</span>
                </button>
              </div>
            ) : (
              <div className="space-y-3">
                <div className="p-3.5 bg-indigo-50 border border-indigo-200 rounded-2xl text-xs text-indigo-950 font-bold leading-relaxed flex items-start gap-2.5">
                  <Smartphone className="w-5 h-5 text-indigo-600 flex-shrink-0 mt-0.5" />
                  <span>
                    {tr(
                      lang,
                      `הַתַּשְׁלוּם מִתְבַּצֵּעַ אַךְ וְרַק דֶּרֶךְ חֲנוּת Google Play (${priceLabel} לְחוֹדֶשׁ). כְּדֵי לִפְתֹּחַ גַּם בַּמַּחְשֵׁב: הֵירָשְׁמוּ בָּאַפְּלִיקַצְיָה בְּ-Android וְהִתְחַבְּרוּ כָּאן עִם אוֹתוֹ חֶשְׁבּוֹן Google.`,
                      `Subscriptions are available exclusively through Google Play (${priceLabel}/month). To unlock on desktop: subscribe in the Android app and sign in here with the same Google account.`,
                      `Las suscripciones se realizan únicamente a través de Google Play (${priceLabel}/mes). Para desbloquear en PC: suscríbete en la app de Android e inicia sesión aquí con la misma cuenta de Google.`
                    )}
                  </span>
                </div>

                <a
                  href={playStoreUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="w-full py-3.5 px-5 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white font-black text-base rounded-2xl shadow-lg flex items-center justify-center gap-2 btn-press-3d"
                >
                  <Crown className="w-5 h-5" />
                  <span>
                    {tr(
                      lang,
                      `לַחֲנוּת Google Play (${priceLabel} / חוֹדֶשׁ)`,
                      `Subscribe via Google Play (${priceLabel} / mo)`,
                      `Suscribirse en Google Play (${priceLabel} / mes)`
                    )}
                  </span>
                  <ExternalLink className="w-4 h-4" />
                </a>

                <button
                  type="button"
                  disabled={busy}
                  onClick={handleRefreshWebSync}
                  className="w-full py-2.5 px-4 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs rounded-2xl border border-slate-300 flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  <span>{tr(lang, 'כְּבָר נִרְשַׁמְתִּי בְּ-Android — רַעֲנֵן גִּישָׁה', 'Already Subscribed on Android — Refresh Access', 'Ya estoy suscrito en Android — Actualizar acceso')}</span>
                </button>
              </div>
            )}

            <p className="text-[11px] text-slate-500 text-center leading-relaxed">
              {tr(
                lang,
                'מנוי חודשי מתחדש דרך Google Play. ניתן לבטל בכל עת בהגדרות Google Play. המחיר עשוי להתעדכן בעתיד בהודעה מראש.',
                'Monthly auto-renewing subscription via Google Play. Cancel anytime in Google Play settings. Price may change in the future with prior notice.',
                'Suscripción mensual renovable vía Google Play. Cancela cuando quieras en Google Play. El precio puede actualizarse en el futuro con aviso previo.'
              )}
            </p>

            {statusMsg && (
              <p className={`text-xs font-bold text-center ${statusMsg.ok ? 'text-emerald-700' : 'text-rose-600'}`}>
                {statusMsg.text}
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
