// Per-kid daily & per-session play time limits + usage tracking.
// Persisted in localStorage and backed up per Google account via progress.data.playLimits.

const LIMITS_STORAGE_KEY = 'hk_play_limits_v1';

// Taking a genuine 15-minute break away from the app starts a fresh session.
// Closing and immediately reopening the tab will NOT reset a finished session.
export const SESSION_BREAK_RESET_MS = 15 * 60 * 1000;

export const DAILY_PRESETS = [null, 15, 20, 30, 45, 60];
export const SESSION_PRESETS = [null, 10, 15, 20, 30];

export function localTodayStr() {
  try {
    const d = new Date();
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${y}-${m}-${day}`;
  } catch {
    return new Date().toISOString().slice(0, 10);
  }
}

export function getKidLimitKey(profileId) {
  return profileId || 'guest';
}

function clampMinutes(val, max = 300) {
  if (val === null || val === undefined || val === '' || val === 0 || val === '0') return null;
  const n = Math.round(Number(val));
  if (!Number.isFinite(n) || n <= 0) return null;
  return Math.min(max, Math.max(1, n));
}

export function createDefaultKidLimitEntry() {
  return {
    dailyLimitMin: null,
    sessionLimitMin: null,
    dailyDate: localTodayStr(),
    dailyUsedSec: 0,
    sessionUsedSec: 0,
    bonusDailySec: 0,
    bonusSessionSec: 0,
    lastActiveAt: 0
  };
}

export function normalizeKidLimitEntry(raw, nowMs = Date.now()) {
  const today = localTodayStr();
  const base = createDefaultKidLimitEntry();
  if (!raw || typeof raw !== 'object') return base;

  const sameDay = raw.dailyDate === today;
  const lastActiveAt = Number(raw.lastActiveAt) || 0;
  const hadLongBreak = lastActiveAt > 0 && nowMs - lastActiveAt >= SESSION_BREAK_RESET_MS;

  return {
    dailyLimitMin: clampMinutes(raw.dailyLimitMin, 300),
    sessionLimitMin: clampMinutes(raw.sessionLimitMin, 180),
    dailyDate: today,
    dailyUsedSec: sameDay ? Math.max(0, Math.floor(Number(raw.dailyUsedSec) || 0)) : 0,
    bonusDailySec: sameDay ? Math.max(0, Math.floor(Number(raw.bonusDailySec) || 0)) : 0,
    sessionUsedSec: sameDay && !hadLongBreak ? Math.max(0, Math.floor(Number(raw.sessionUsedSec) || 0)) : 0,
    bonusSessionSec: sameDay && !hadLongBreak ? Math.max(0, Math.floor(Number(raw.bonusSessionSec) || 0)) : 0,
    lastActiveAt: sameDay ? lastActiveAt : 0
  };
}

export function sanitizePlayLimitsMap(rawMap, nowMs = Date.now()) {
  if (!rawMap || typeof rawMap !== 'object') return {};
  const out = {};
  for (const [k, v] of Object.entries(rawMap)) {
    if (!k || typeof v !== 'object') continue;
    out[k] = normalizeKidLimitEntry(v, nowMs);
  }
  return out;
}

export function loadLocalPlayLimits() {
  try {
    const raw = localStorage.getItem(LIMITS_STORAGE_KEY);
    if (!raw) return {};
    return sanitizePlayLimitsMap(JSON.parse(raw));
  } catch {
    return {};
  }
}

export function saveLocalPlayLimits(map) {
  try {
    localStorage.setItem(LIMITS_STORAGE_KEY, JSON.stringify(map));
  } catch {
    // ignore storage errors
  }
}

/** Merge local and cloud play limits maps, keeping the higher daily usage for today so switching devices cannot bypass limits. */
export function mergePlayLimitsMaps(localMap, cloudMap) {
  const safeLocal = sanitizePlayLimitsMap(localMap);
  const safeCloud = sanitizePlayLimitsMap(cloudMap);
  const keys = new Set([...Object.keys(safeLocal), ...Object.keys(safeCloud)]);
  const merged = {};
  const today = localTodayStr();

  for (const key of keys) {
    const l = safeLocal[key];
    const c = safeCloud[key];
    if (l && !c) {
      merged[key] = l;
    } else if (c && !l) {
      merged[key] = c;
    } else {
      const sameToday = l.dailyDate === today && c.dailyDate === today;
      merged[key] = {
        dailyLimitMin: c.dailyLimitMin !== null ? c.dailyLimitMin : l.dailyLimitMin,
        sessionLimitMin: c.sessionLimitMin !== null ? c.sessionLimitMin : l.sessionLimitMin,
        dailyDate: today,
        dailyUsedSec: sameToday ? Math.max(l.dailyUsedSec, c.dailyUsedSec) : l.dailyUsedSec,
        bonusDailySec: sameToday ? Math.max(l.bonusDailySec, c.bonusDailySec) : l.bonusDailySec,
        sessionUsedSec: sameToday ? Math.max(l.sessionUsedSec, c.sessionUsedSec) : l.sessionUsedSec,
        bonusSessionSec: sameToday ? Math.max(l.bonusSessionSec, c.bonusSessionSec) : l.bonusSessionSec,
        lastActiveAt: Math.max(l.lastActiveAt || 0, c.lastActiveAt || 0)
      };
    }
  }
  return merged;
}

/** Compute remaining seconds and lock status for a kid's limit entry. */
export function evaluatePlayLimit(entry) {
  const raw = entry || createDefaultKidLimitEntry();
  const isNewDay = Boolean(raw.dailyDate && raw.dailyDate !== localTodayStr());
  const dailyUsedSec = isNewDay ? 0 : raw.dailyUsedSec || 0;
  const sessionUsedSec = isNewDay ? 0 : raw.sessionUsedSec || 0;
  const bonusDailySec = isNewDay ? 0 : raw.bonusDailySec || 0;
  const bonusSessionSec = isNewDay ? 0 : raw.bonusSessionSec || 0;

  const dailyAllowanceSec = raw.dailyLimitMin ? raw.dailyLimitMin * 60 + bonusDailySec : null;
  const sessionAllowanceSec = raw.sessionLimitMin ? raw.sessionLimitMin * 60 + bonusSessionSec : null;

  const dailyRemainingSec =
    dailyAllowanceSec !== null ? Math.max(0, dailyAllowanceSec - dailyUsedSec) : null;
  const sessionRemainingSec =
    sessionAllowanceSec !== null ? Math.max(0, sessionAllowanceSec - sessionUsedSec) : null;

  const dailyLocked = dailyAllowanceSec !== null && dailyRemainingSec <= 0;
  const sessionLocked = !dailyLocked && sessionAllowanceSec !== null && sessionRemainingSec <= 0;

  let activeRemainingSec = null;
  if (dailyRemainingSec !== null && sessionRemainingSec !== null) {
    activeRemainingSec = Math.min(dailyRemainingSec, sessionRemainingSec);
  } else if (dailyRemainingSec !== null) {
    activeRemainingSec = dailyRemainingSec;
  } else if (sessionRemainingSec !== null) {
    activeRemainingSec = sessionRemainingSec;
  }

  return {
    hasLimit: dailyAllowanceSec !== null || sessionAllowanceSec !== null,
    dailyAllowanceSec,
    sessionAllowanceSec,
    dailyRemainingSec,
    sessionRemainingSec,
    activeRemainingSec,
    isLocked: dailyLocked || sessionLocked,
    lockReason: dailyLocked ? 'daily' : sessionLocked ? 'session' : null
  };
}

export function formatMinutesSeconds(totalSec) {
  const safe = Math.max(0, Math.ceil(Number(totalSec) || 0));
  const mins = Math.floor(safe / 60);
  const secs = safe % 60;
  return `${mins}:${String(secs).padStart(2, '0')}`;
}

export function formatUsedMinutes(totalSec) {
  const safe = Math.max(0, Math.floor(Number(totalSec) || 0));
  return Math.floor(safe / 60);
}

/**
 * Generates an adult math gate challenge.
 * Uses tougher 2-digit × 1-digit multiplication when hardMode is true (for Ages 7/9 or time-lock unlock)
 * so school-age kids can't unlock parent time limits themselves.
 */
export function generateParentGateChallenge(hardMode = false) {
  if (hardMode) {
    const a = 13 + Math.floor(Math.random() * 11); // 13..23
    const b = 6 + Math.floor(Math.random() * 4); // 6..9
    const ans = a * b;
    const opts = new Set([ans]);
    const offsets = [-12, -8, -6, -4, 4, 6, 8, 10, 12];
    let guard = 0;
    while (opts.size < 4 && guard < 30) {
      guard += 1;
      const delta = offsets[Math.floor(Math.random() * offsets.length)];
      const cand = ans + delta;
      if (cand > 20) opts.add(cand);
    }
    return {
      text: `${a} × ${b} = ?`,
      ans,
      options: [...opts].sort(() => 0.5 - Math.random())
    };
  }

  const a = 14 + Math.floor(Math.random() * 15); // 14..28
  const b = 15 + Math.floor(Math.random() * 15); // 15..29
  const ans = a + b;
  const opts = new Set([ans]);
  let guard = 0;
  while (opts.size < 4 && guard < 30) {
    guard += 1;
    const cand = ans + (Math.floor(Math.random() * 11) - 5);
    if (cand > 10) opts.add(cand);
  }
  return {
    text: `${a} + ${b} = ?`,
    ans,
    options: [...opts].sort(() => 0.5 - Math.random())
  };
}
