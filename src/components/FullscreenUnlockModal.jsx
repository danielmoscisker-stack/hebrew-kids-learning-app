import React, { useState, useEffect, useCallback } from 'react';
import { Lock, Maximize2, Fingerprint, Delete, X, ShieldCheck } from 'lucide-react';
import { playSound } from '../utils/audio';
import { tr } from '../utils/i18n';
import { verifyPinRecord, verifyBiometricForKid } from '../utils/fullscreenLock';

export default function FullscreenUnlockModal({
  mode = 'unlock', // 'unlock' | 'escaped'
  lang,
  activeProfile = null,
  pinRecord = null,
  biometricRecord = null,
  onUnlocked,
  onReturnToFullscreen,
  onCancel
}) {
  const isHe = lang === 'he';
  const isEscaped = mode === 'escaped';
  const expectedLen = pinRecord?.pinLength || 4;
  const hasBiometric = Boolean(biometricRecord?.credIdB64);

  const [pinInput, setPinInput] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [checking, setChecking] = useState(false);
  const [bioChecking, setBioChecking] = useState(false);

  const submitPin = useCallback(
    async (candidate) => {
      if (!pinRecord) {
        onUnlocked?.();
        return;
      }
      setChecking(true);
      try {
        const ok = await verifyPinRecord(candidate, pinRecord);
        if (ok) {
          playSound('star');
          onUnlocked?.();
        } else {
          playSound('whoosh');
          setErrorMsg(tr(lang, 'קוד PIN שגוי — נסו שוב', 'Wrong PIN — try again', 'PIN incorrecto — intenta de nuevo'));
          setPinInput('');
        }
      } finally {
        setChecking(false);
      }
    },
    [pinRecord, lang, onUnlocked]
  );

  const handleDigit = useCallback(
    (d) => {
      if (checking || bioChecking) return;
      playSound('pop');
      setErrorMsg('');
      setPinInput((prev) => {
        if (prev.length >= 6) return prev;
        const next = prev + d;
        if (next.length === expectedLen) {
          // Verify automatically when reaching the saved PIN length
          setTimeout(() => submitPin(next), 60);
        }
        return next;
      });
    },
    [checking, bioChecking, expectedLen, submitPin]
  );

  const handleBackspace = useCallback(() => {
    if (checking || bioChecking) return;
    playSound('pop');
    setErrorMsg('');
    setPinInput((prev) => prev.slice(0, -1));
  }, [checking, bioChecking]);

  const handleBiometricUnlock = async () => {
    if (!hasBiometric || bioChecking) return;
    setBioChecking(true);
    setErrorMsg('');
    try {
      const ok = await verifyBiometricForKid(biometricRecord.credIdB64);
      if (ok) {
        playSound('star');
        onUnlocked?.();
      } else {
        playSound('whoosh');
        setErrorMsg(tr(lang, 'האימות הביומטרי לא הושלם — ניתן להזין PIN', 'Biometric verification not completed — use PIN', 'Verificación biométrica cancelada — usa PIN'));
      }
    } catch {
      playSound('whoosh');
      setErrorMsg(tr(lang, 'האימות הביומטרי בוטל — ניתן להזין קוד PIN', 'Biometric unlock cancelled — enter PIN instead', 'Biometría cancelada — introduce el PIN'));
    } finally {
      setBioChecking(false);
    }
  };

  // Support physical keyboard digits while modal is visible
  useEffect(() => {
    const onKeyDown = (e) => {
      if (e.key >= '0' && e.key <= '9') {
        e.preventDefault();
        handleDigit(e.key);
      } else if (e.key === 'Backspace') {
        e.preventDefault();
        handleBackspace();
      } else if (e.key === 'Enter' && pinInput.length >= 4) {
        e.preventDefault();
        submitPin(pinInput);
      } else if (e.key === 'Escape' && !isEscaped && onCancel) {
        e.preventDefault();
        onCancel();
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [handleDigit, handleBackspace, submitPin, pinInput, isEscaped, onCancel]);

  const kidLabel = activeProfile?.name
    ? `${activeProfile.avatar || '👦'} ${activeProfile.name}`
    : tr(lang, 'פְּרוֹפִיל פָּעִיל', 'Active Profile', 'Perfil activo');

  return (
    <div
      className="fixed inset-0 z-[60] bg-slate-950/90 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto"
      dir={isHe ? 'rtl' : 'ltr'}
      role="dialog"
      aria-modal="true"
      aria-labelledby="fs-unlock-title"
      onClick={!isEscaped && onCancel ? onCancel : undefined}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-md bg-white rounded-[2rem] border-4 border-indigo-400 shadow-2xl p-5 sm:p-6 text-center animate-pop-in my-auto"
      >
        <div className="flex items-center justify-between mb-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-50 border border-indigo-200 text-indigo-900 font-black text-xs">
            <Lock className="w-3.5 h-3.5 text-indigo-600" />
            <span>{kidLabel}</span>
          </div>
          {!isEscaped && onCancel && (
            <button
              type="button"
              onClick={onCancel}
              aria-label={tr(lang, 'סְגוֹר', 'Close', 'Cerrar')}
              className="p-2 rounded-full hover:bg-slate-100 text-slate-500 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>

        <h2 id="fs-unlock-title" className="text-xl sm:text-2xl font-black text-slate-900 leading-tight mb-1">
          {isEscaped
            ? tr(lang, 'מַצַּב מָסָךְ מָלֵא נָעוּל 🔒', 'Fullscreen Kid Lock Active 🔒', 'Pantalla Completa Bloqueada 🔒')
            : tr(lang, 'יְצִיאָה מִמָּסָךְ מָלֵא (הוֹרִים) 🔒', 'Exit Fullscreen Lock (Parents) 🔒', 'Salir de Pantalla Completa 🔒')}
        </h2>

        <p className="text-xs sm:text-sm font-bold text-slate-600 mb-4">
          {isEscaped
            ? tr(
                lang,
                'כְּדֵי לְהַמְשִׁיךְ לְשַׂחֵק חִזְרוּ לְמָסָךְ מָלֵא, אוֹ שֶׁהוֹרֶה יְשַׁחְרֵר עִם PIN / טְבִיעַת אֶצְבַּע / זִהוּי פָּנִים.',
                'Tap below to return to fullscreen play, or have a parent unlock with PIN or Fingerprint / Face ID.',
                'Vuelve a pantalla completa para jugar, o pide a un adulto que desbloquee con PIN o biometría.'
              )
            : tr(
                lang,
                'הַזִּינוּ אֶת קוֹד הַ-PIN שֶׁל הַהוֹרִים אוֹ הִשְׁתַּמְּשׁוּ בִּטְבִיעַת אֶצְבַּע / זִהוּי פָּנִים:',
                'Enter the parent PIN for this profile or unlock with Fingerprint / Face ID:',
                'Introduce el PIN de padres o usa Huella / Face ID:'
              )}
        </p>

        {/* Primary button for kid to return right back into fullscreen when Esc/swipe was pressed */}
        {isEscaped && onReturnToFullscreen && (
          <button
            type="button"
            onClick={() => {
              playSound('pop');
              onReturnToFullscreen();
            }}
            className="w-full py-3.5 px-4 mb-4 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white font-black text-base flex items-center justify-center gap-2 shadow-lg btn-press-3d cursor-pointer"
          >
            <Maximize2 className="w-5 h-5" />
            <span>{tr(lang, 'חֲזָרָה לְמָסָךְ מָלֵא וְהַמְשֵׁךְ לְשַׂחֵק', 'Return to Fullscreen & Keep Playing', 'Volver a Pantalla Completa')}</span>
          </button>
        )}

        {/* Biometric Unlock Button (Fingerprint / Face ID / Touch ID) */}
        {hasBiometric && (
          <button
            type="button"
            disabled={bioChecking}
            onClick={handleBiometricUnlock}
            className="w-full py-3.5 px-4 mb-4 rounded-2xl bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700 text-white font-black text-sm sm:text-base flex items-center justify-center gap-2 shadow-md btn-press-3d cursor-pointer disabled:opacity-60"
          >
            <Fingerprint className="w-6 h-6" />
            <span>
              {bioChecking
                ? tr(lang, 'מַמְתִּין לְאִמּוּת בִּיּוֹמֶטְרִי...', 'Waiting for Fingerprint / Face ID...', 'Esperando biometría...')
                : tr(lang, 'שִׁחְרוּר עִם טְבִיעַת אֶצְבַּע / זִהוּי פָּנִים', 'Unlock with Fingerprint / Face ID', 'Desbloquear con Huella / Face ID')}
            </span>
          </button>
        )}

        {/* PIN Dots Indicator */}
        {pinRecord && (
          <div className="flex flex-col items-center gap-3">
            <div className="flex items-center justify-center gap-3 py-2" dir="ltr">
              {Array.from({ length: expectedLen }).map((_, i) => {
                const filled = i < pinInput.length;
                return (
                  <div
                    key={i}
                    className={`w-11 h-12 rounded-2xl border-3 flex items-center justify-center text-2xl font-black transition ${
                      filled
                        ? 'bg-indigo-600 border-indigo-700 text-white scale-105'
                        : 'bg-slate-50 border-slate-300 text-slate-300'
                    }`}
                  >
                    {filled ? '●' : ''}
                  </div>
                );
              })}
            </div>

            {errorMsg && (
              <div className="text-xs sm:text-sm font-black text-rose-600 animate-pop-in">
                {errorMsg}
              </div>
            )}

            {/* Touch-friendly Numeric Keypad */}
            <div className="grid grid-cols-3 gap-2.5 w-full max-w-[270px]" dir="ltr">
              {['1', '2', '3', '4', '5', '6', '7', '8', '9'].map((digit) => (
                <button
                  key={digit}
                  type="button"
                  disabled={checking}
                  onClick={() => handleDigit(digit)}
                  className="h-14 rounded-2xl bg-slate-100 hover:bg-indigo-100 active:bg-indigo-200 border-2 border-slate-200 hover:border-indigo-300 font-black text-2xl text-slate-900 btn-press-3d cursor-pointer"
                >
                  {digit}
                </button>
              ))}
              <button
                type="button"
                disabled={checking}
                onClick={() => {
                  playSound('pop');
                  setPinInput('');
                  setErrorMsg('');
                }}
                className="h-14 rounded-2xl bg-rose-50 hover:bg-rose-100 border-2 border-rose-200 font-black text-xs text-rose-700 btn-press-3d cursor-pointer"
              >
                {tr(lang, 'נַקֵּה', 'Clear', 'Borrar')}
              </button>
              <button
                type="button"
                disabled={checking}
                onClick={() => handleDigit('0')}
                className="h-14 rounded-2xl bg-slate-100 hover:bg-indigo-100 active:bg-indigo-200 border-2 border-slate-200 hover:border-indigo-300 font-black text-2xl text-slate-900 btn-press-3d cursor-pointer"
              >
                0
              </button>
              <button
                type="button"
                disabled={checking}
                onClick={handleBackspace}
                aria-label={tr(lang, 'מְחַק סִפְרָה', 'Backspace', 'Retroceso')}
                className="h-14 rounded-2xl bg-slate-100 hover:bg-slate-200 border-2 border-slate-200 flex items-center justify-center text-slate-700 btn-press-3d cursor-pointer"
              >
                <Delete className="w-6 h-6" />
              </button>
            </div>
          </div>
        )}

        {!pinRecord && !hasBiometric && (
          <button
            type="button"
            onClick={onUnlocked}
            className="w-full py-3 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-black flex items-center justify-center gap-2 cursor-pointer"
          >
            <ShieldCheck className="w-5 h-5" />
            <span>{tr(lang, 'שִׁחְרוּר מָסָךְ מָלֵא', 'Exit Fullscreen', 'Salir')}</span>
          </button>
        )}
      </div>
    </div>
  );
}
