import React, { useEffect, useState } from 'react';
import { Fingerprint, Lock, ShieldAlert } from 'lucide-react';
import { playSound } from '../utils/audio';
import { tr } from '../utils/i18n';
import { generateParentGateChallenge } from '../utils/playLimits';
import { verifyBiometricForKid, verifyPinRecord } from '../utils/fullscreenLock';

const LOCKOUT_KEY = 'hebrew_kids_parent_gate_lockout_until';
const ATTEMPTS_KEY = 'hebrew_kids_parent_gate_attempts';
const MAX_ATTEMPTS = 3;
const LOCKOUT_MS = 30_000;

function readLockoutUntil() {
  try {
    const raw = Number(localStorage.getItem(LOCKOUT_KEY) || 0);
    return Number.isFinite(raw) ? raw : 0;
  } catch {
    return 0;
  }
}

function writeLockoutUntil(ts) {
  try {
    if (ts > 0) localStorage.setItem(LOCKOUT_KEY, String(ts));
    else localStorage.removeItem(LOCKOUT_KEY);
  } catch {
    // ignore storage errors
  }
}

function readAttempts() {
  try {
    const raw = Number(localStorage.getItem(ATTEMPTS_KEY) || 0);
    return Number.isFinite(raw) && raw >= 0 ? raw : 0;
  } catch {
    return 0;
  }
}

function writeAttempts(count) {
  try {
    if (count > 0) localStorage.setItem(ATTEMPTS_KEY, String(count));
    else localStorage.removeItem(ATTEMPTS_KEY);
  } catch {
    // ignore storage errors
  }
}

function calcRemainingSec(until) {
  if (!until) return 0;
  const diff = until - Date.now();
  return diff > 0 ? Math.ceil(diff / 1000) : 0;
}

/**
 * Kid-proof Parent Gate:
 * - Supports Biometric (Fingerprint / Face ID) when enrolled
 * - Supports Parent PIN when configured
 * - Falls back to a typed-answer math challenge (no clickable multiple choice guessing)
 * - Enforces a 30-second cooldown after 3 wrong attempts, persisted in localStorage
 */
export default function ParentGate({
  lang = 'he',
  hardMode = true,
  pinRecord = null,
  biometricRecord = null,
  title = null,
  subtitle = null,
  onUnlock,
  onCancel = null,
  compact = false
}) {
  const [pinInput, setPinInput] = useState('');
  const [mathInput, setMathInput] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [challenge, setChallenge] = useState(() => generateParentGateChallenge(hardMode));
  const [attempts, setAttempts] = useState(() => readAttempts());
  const [lockoutUntil, setLockoutUntil] = useState(() => readLockoutUntil());
  const [remainingSec, setRemainingSec] = useState(() => calcRemainingSec(readLockoutUntil()));

  const isLockedOut = remainingSec > 0;

  useEffect(() => {
    if (!lockoutUntil) return;
    const id = window.setInterval(() => {
      const rem = calcRemainingSec(lockoutUntil);
      setRemainingSec(rem);
      if (rem <= 0) {
        writeLockoutUntil(0);
        setLockoutUntil(0);
        setErrorMsg('');
      }
    }, 500);
    return () => window.clearInterval(id);
  }, [lockoutUntil]);

  const clearLockoutState = () => {
    writeAttempts(0);
    writeLockoutUntil(0);
    setAttempts(0);
    setLockoutUntil(0);
    setRemainingSec(0);
    setErrorMsg('');
  };

  const recordWrongAttempt = (baseMsg) => {
    playSound('whoosh');
    const nextAttempts = attempts + 1;
    if (nextAttempts >= MAX_ATTEMPTS) {
      const until = Date.now() + LOCKOUT_MS;
      writeAttempts(0);
      writeLockoutUntil(until);
      setAttempts(0);
      setLockoutUntil(until);
      setRemainingSec(Math.ceil(LOCKOUT_MS / 1000));
      setErrorMsg('');
    } else {
      writeAttempts(nextAttempts);
      setAttempts(nextAttempts);
      const left = MAX_ATTEMPTS - nextAttempts;
      setErrorMsg(
        `${baseMsg} (${tr(
          lang,
          `נותרו ${left} ניסיונות`,
          `${left} ${left === 1 ? 'try' : 'tries'} left`,
          `${left} ${left === 1 ? 'intento' : 'intentos'}`
        )})`
      );
    }
  };

  const handleBiometric = async () => {
    if (!biometricRecord?.credIdB64) return;
    try {
      const ok = await verifyBiometricForKid(biometricRecord.credIdB64);
      if (ok) {
        playSound('star');
        clearLockoutState();
        onUnlock?.();
      } else {
        setErrorMsg(tr(lang, 'האימות לא הושלם', 'Verification cancelled', 'Verificación cancelada'));
      }
    } catch {
      setErrorMsg(tr(lang, 'האימות בוטל', 'Cancelled', 'Cancelado'));
    }
  };

  const handlePinSubmit = async (e) => {
    e.preventDefault();
    if (!pinRecord || isLockedOut || !pinInput.trim()) return;
    const ok = await verifyPinRecord(pinInput, pinRecord);
    if (ok) {
      playSound('star');
      clearLockoutState();
      setPinInput('');
      onUnlock?.();
    } else {
      setPinInput('');
      recordWrongAttempt(tr(lang, 'קוד PIN שגוי', 'Wrong PIN', 'PIN incorrecto'));
    }
  };

  const handleMathSubmit = (e) => {
    e.preventDefault();
    if (isLockedOut) return;
    const parsed = Number.parseInt(mathInput.trim(), 10);
    if (Number.isNaN(parsed)) return;

    if (parsed === challenge.ans) {
      playSound('star');
      clearLockoutState();
      setMathInput('');
      onUnlock?.();
    } else {
      setMathInput('');
      setChallenge(generateParentGateChallenge(hardMode));
      recordWrongAttempt(tr(lang, 'תְּשׁוּבָה לֹא נְכוֹנָה', 'Wrong answer', 'Respuesta incorrecta'));
    }
  };

  return (
    <div className={`flex flex-col items-center text-center ${compact ? 'gap-3' : 'gap-4 py-2'}`}>
      {title && (
        <div className="flex items-center gap-2 font-black text-indigo-950 text-base sm:text-lg">
          <Lock className="w-5 h-5 text-indigo-600 flex-shrink-0" />
          <span>{title}</span>
        </div>
      )}

      {subtitle && (
        <p className="text-slate-600 font-bold text-sm sm:text-base max-w-md">{subtitle}</p>
      )}

      {biometricRecord?.credIdB64 && (
        <button
          type="button"
          onClick={handleBiometric}
          className="px-5 py-2.5 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-black text-sm flex items-center gap-2 shadow-md btn-press-3d cursor-pointer"
        >
          <Fingerprint className="w-5 h-5" />
          <span>{tr(lang, 'אִמּוּת בִּטְבִיעַת אֶצְבַּע / פָּנִים', 'Unlock with Fingerprint / Face ID', 'Huella / Face ID')}</span>
        </button>
      )}

      {isLockedOut ? (
        <div className="w-full max-w-sm p-4 rounded-2xl bg-rose-50 border-2 border-rose-300 text-rose-800 flex flex-col items-center gap-1.5">
          <div className="flex items-center gap-2 font-black text-sm">
            <ShieldAlert className="w-5 h-5 text-rose-600 flex-shrink-0" />
            <span>
              {tr(
                lang,
                `יוֹתֵר מִדַּי נִסְיוֹנוֹת שְׁגוּיִים — נַסּוּ שׁוּב בְּעוֹד ${remainingSec} שְׁנִיּוֹת`,
                `Too many wrong tries — wait ${remainingSec}s`,
                `Demasiados intentos — espera ${remainingSec}s`
              )}
            </span>
          </div>
          <p className="text-xs font-bold text-rose-600">
            {tr(
              lang,
              'הַנְּעִילָה מוֹנַעַת נִסְיוֹנוֹת נִחוּשׁ',
              'Cooldown prevents random guessing',
              'La pausa evita intentos al azar'
            )}
          </p>
        </div>
      ) : pinRecord ? (
        <form onSubmit={handlePinSubmit} className="flex items-center justify-center gap-2">
          <input
            type="password"
            inputMode="numeric"
            maxLength={6}
            value={pinInput}
            onChange={(e) => {
              setPinInput(e.target.value.replace(/\D/g, '').slice(0, 6));
              setErrorMsg('');
            }}
            placeholder="PIN"
            aria-label={tr(lang, 'קוד PIN להורים', 'Parent PIN', 'PIN de padres')}
            className="w-32 px-3 py-2.5 rounded-xl border-2 border-indigo-300 text-center font-black text-lg tracking-widest focus:outline-none focus:border-indigo-500"
            dir="ltr"
          />
          <button
            type="submit"
            disabled={!pinInput.trim()}
            className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white font-black text-sm cursor-pointer btn-press-3d"
          >
            {tr(lang, 'פְּתַח', 'Unlock', 'Abrir')}
          </button>
        </form>
      ) : (
        <form onSubmit={handleMathSubmit} className="flex flex-col items-center gap-3 w-full max-w-xs">
          <div
            className={`${compact ? 'text-2xl px-5 py-2' : 'text-3xl sm:text-4xl px-7 py-3.5'} font-black text-indigo-700 bg-indigo-50 border-2 border-indigo-200 rounded-2xl`}
            dir="ltr"
          >
            {challenge.text}
          </div>
          <div className="flex items-center justify-center gap-2 w-full">
            <input
              type="text"
              inputMode="numeric"
              pattern="[0-9]*"
              maxLength={4}
              value={mathInput}
              onChange={(e) => {
                setMathInput(e.target.value.replace(/\D/g, '').slice(0, 4));
                setErrorMsg('');
              }}
              placeholder={tr(lang, 'תְּשׁוּבָה', 'Answer', 'Respuesta')}
              aria-label={tr(lang, 'הקלידו תשובה', 'Type answer', 'Escribe la respuesta')}
              className="w-32 px-3 py-2.5 rounded-xl border-2 border-amber-400 bg-amber-50/50 text-center font-black text-xl text-slate-900 focus:outline-none focus:border-indigo-500"
              dir="ltr"
              autoComplete="off"
            />
            <button
              type="submit"
              disabled={!mathInput.trim()}
              className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white font-black text-sm sm:text-base cursor-pointer btn-press-3d"
            >
              {tr(lang, 'פְּתַח', 'Unlock', 'Abrir')}
            </button>
          </div>
        </form>
      )}

      {errorMsg && !isLockedOut && (
        <div className="text-xs sm:text-sm font-black text-rose-600">{errorMsg}</div>
      )}

      {onCancel && (
        <button
          type="button"
          onClick={onCancel}
          className="text-xs font-bold text-slate-500 hover:text-slate-700 cursor-pointer"
        >
          {tr(lang, 'בִּטּוּל', 'Cancel', 'Cancelar')}
        </button>
      )}
    </div>
  );
}
