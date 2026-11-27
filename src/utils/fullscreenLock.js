// Per-profile Fullscreen Kid Lock: PIN hashing (SHA-256), WebAuthn Fingerprint/Face ID,
// browser Fullscreen API, and Keyboard Lock helpers.

const LOCKS_STORAGE_KEY = 'hk_kid_locks_v1';
const BIOMETRICS_STORAGE_KEY = 'hk_kid_biometrics_v1';

export function getLockKey(profileId) {
  return profileId || 'guest';
}

function bytesToBase64Url(bytes) {
  let binary = '';
  for (let i = 0; i < bytes.length; i += 1) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

function base64UrlToBytes(b64) {
  const padded = b64.replace(/-/g, '+').replace(/_/g, '/') + '==='.slice((b64.length + 3) % 4);
  const binary = atob(padded);
  const out = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i += 1) {
    out[i] = binary.charCodeAt(i);
  }
  return out;
}

export function generateSalt() {
  try {
    const arr = new Uint8Array(12);
    crypto.getRandomValues(arr);
    return bytesToBase64Url(arr);
  } catch {
    return `${Date.now()}_${Math.random().toString(36).slice(2, 10)}`;
  }
}

export async function hashPin(pin, salt) {
  const cleanPin = String(pin || '').trim();
  const payload = `hk_pin_v1:${salt}:${cleanPin}`;
  try {
    if (typeof crypto !== 'undefined' && crypto.subtle) {
      const data = new TextEncoder().encode(payload);
      const digest = await crypto.subtle.digest('SHA-256', data);
      return bytesToBase64Url(new Uint8Array(digest));
    }
  } catch {
    // fallback below for non-secure dev origins
  }
  let h = 2166136261;
  for (let i = 0; i < payload.length; i += 1) {
    h ^= payload.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return `fnv_${(h >>> 0).toString(16)}`;
}

export async function createPinRecord(pin) {
  const clean = String(pin || '').replace(/\D/g, '');
  if (clean.length < 4 || clean.length > 6) {
    throw new Error('PIN must be 4–6 digits');
  }
  const pinSalt = generateSalt();
  const pinHash = await hashPin(clean, pinSalt);
  return {
    pinHash,
    pinSalt,
    pinLength: clean.length,
    updatedAt: new Date().toISOString()
  };
}

export async function verifyPinRecord(pin, record) {
  if (!record?.pinHash || !record?.pinSalt) return false;
  const clean = String(pin || '').replace(/\D/g, '');
  if (!clean) return false;
  const candidate = await hashPin(clean, record.pinSalt);
  return candidate === record.pinHash;
}

export function sanitizeLocksMap(rawMap) {
  if (!rawMap || typeof rawMap !== 'object') return {};
  const out = {};
  for (const [k, v] of Object.entries(rawMap)) {
    if (!k || !v || typeof v !== 'object') continue;
    if (typeof v.pinHash === 'string' && typeof v.pinSalt === 'string' && v.pinHash && v.pinSalt) {
      out[k] = {
        pinHash: v.pinHash,
        pinSalt: v.pinSalt,
        pinLength: Math.min(6, Math.max(4, Number(v.pinLength) || 4)),
        updatedAt: v.updatedAt || ''
      };
    }
  }
  return out;
}

export function loadLocalLocks() {
  try {
    const raw = localStorage.getItem(LOCKS_STORAGE_KEY);
    if (!raw) return {};
    return sanitizeLocksMap(JSON.parse(raw));
  } catch {
    return {};
  }
}

export function saveLocalLocks(map) {
  try {
    localStorage.setItem(LOCKS_STORAGE_KEY, JSON.stringify(sanitizeLocksMap(map)));
  } catch {
    // ignore
  }
}

export function mergeLocksMaps(localMap, cloudMap) {
  const safeLocal = sanitizeLocksMap(localMap);
  const safeCloud = sanitizeLocksMap(cloudMap);
  const keys = new Set([...Object.keys(safeLocal), ...Object.keys(safeCloud)]);
  const merged = {};
  for (const key of keys) {
    const l = safeLocal[key];
    const c = safeCloud[key];
    if (l && !c) merged[key] = l;
    else if (c && !l) merged[key] = c;
    else {
      merged[key] = (c.updatedAt || '') >= (l.updatedAt || '') ? c : l;
    }
  }
  return merged;
}

export function loadLocalBiometrics() {
  try {
    const raw = localStorage.getItem(BIOMETRICS_STORAGE_KEY);
    if (!raw) return {};
    const parsed = JSON.parse(raw);
    return parsed && typeof parsed === 'object' ? parsed : {};
  } catch {
    return {};
  }
}

export function saveLocalBiometrics(map) {
  try {
    localStorage.setItem(BIOMETRICS_STORAGE_KEY, JSON.stringify(map || {}));
  } catch {
    // ignore
  }
}

/** Check if this device/browser supports Fingerprint, Face ID, Touch ID, or Windows Hello via WebAuthn. */
export async function isBiometricAvailable() {
  try {
    if (typeof window === 'undefined' || !window.PublicKeyCredential || !navigator.credentials) {
      return false;
    }
    if (typeof window.PublicKeyCredential.isUserVerifyingPlatformAuthenticatorAvailable !== 'function') {
      return false;
    }
    return await window.PublicKeyCredential.isUserVerifyingPlatformAuthenticatorAvailable();
  } catch {
    return false;
  }
}

/** Enroll device Fingerprint / Face ID for a specific kid profile (stored device-locally). */
export async function registerBiometricForKid(kidKey, displayName = 'Parent') {
  if (typeof window === 'undefined' || !window.PublicKeyCredential || !navigator.credentials) {
    throw new Error('Biometrics not supported on this browser');
  }
  const challenge = new Uint8Array(32);
  crypto.getRandomValues(challenge);
  const userIdBytes = new TextEncoder().encode(`parent_${kidKey}_${Date.now()}`.slice(0, 48));

  const publicKey = {
    challenge,
    rp: {
      name: 'Hebrew & Math Kids Learning',
      id: window.location.hostname
    },
    user: {
      id: userIdBytes,
      name: `parent-${kidKey}@kids.local`,
      displayName: `${displayName} (Parent Unlock)`
    },
    pubKeyCredParams: [
      { type: 'public-key', alg: -7 }, // ES256
      { type: 'public-key', alg: -257 } // RS256
    ],
    authenticatorSelection: {
      authenticatorAttachment: 'platform',
      userVerification: 'required',
      residentKey: 'preferred'
    },
    timeout: 60000,
    attestation: 'none'
  };

  const credential = await navigator.credentials.create({ publicKey });
  if (!credential || !credential.rawId) {
    throw new Error('Biometric registration cancelled');
  }

  return {
    credIdB64: bytesToBase64Url(new Uint8Array(credential.rawId)),
    enabledAt: new Date().toISOString()
  };
}

/** Trigger native Fingerprint / Face ID / Touch ID verification for exiting Kid Lock. */
export async function verifyBiometricForKid(credIdB64) {
  if (!credIdB64 || typeof window === 'undefined' || !window.PublicKeyCredential || !navigator.credentials) {
    return false;
  }
  const challenge = new Uint8Array(32);
  crypto.getRandomValues(challenge);
  const rawId = base64UrlToBytes(credIdB64);

  const assertion = await navigator.credentials.get({
    publicKey: {
      challenge,
      rpId: window.location.hostname,
      allowCredentials: [
        {
          id: rawId,
          type: 'public-key',
          transports: ['internal']
        }
      ],
      userVerification: 'required',
      timeout: 60000
    }
  });

  return Boolean(assertion && assertion.id);
}

/** Fullscreen API helpers (cross-browser including WebKit/iPad/Safari fallback) */
export function isCurrentlyFullscreen() {
  if (typeof document === 'undefined') return false;
  return Boolean(
    document.fullscreenElement ||
      document.webkitFullscreenElement ||
      document.mozFullScreenElement ||
      document.msFullscreenElement
  );
}

export async function enterBrowserFullscreen() {
  if (typeof document === 'undefined') return false;
  const el = document.documentElement;
  try {
    if (!isCurrentlyFullscreen()) {
      if (el.requestFullscreen) {
        await el.requestFullscreen({ navigationUI: 'hide' });
      } else if (el.webkitRequestFullscreen) {
        await el.webkitRequestFullscreen();
      } else if (el.msRequestFullscreen) {
        await el.msRequestFullscreen();
      }
    }
  } catch {
    // Some iOS Safari versions restrict Fullscreen API on iPhone; we still activate app-level Kid Lock.
  }

  // Lock Escape key in Chromium browsers when available so accidental Esc doesn't exit fullscreen
  try {
    if (navigator.keyboard && typeof navigator.keyboard.lock === 'function') {
      await navigator.keyboard.lock(['Escape']);
    }
  } catch {
    // ignore unsupported browsers
  }

  return isCurrentlyFullscreen();
}

export async function exitBrowserFullscreen() {
  try {
    if (navigator.keyboard && typeof navigator.keyboard.unlock === 'function') {
      navigator.keyboard.unlock();
    }
  } catch {
    // ignore
  }

  if (typeof document === 'undefined' || !isCurrentlyFullscreen()) return;
  try {
    if (document.exitFullscreen) {
      await document.exitFullscreen();
    } else if (document.webkitExitFullscreen) {
      await document.webkitExitFullscreen();
    } else if (document.msExitFullscreen) {
      await document.msExitFullscreen();
    }
  } catch {
    // ignore
  }
}
