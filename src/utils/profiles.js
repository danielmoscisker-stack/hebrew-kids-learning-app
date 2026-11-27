// Multi-kid profile helpers (persisted locally + synced per Google account via progress.data.profiles)

export const SUPPORTED_AGES = [4, 7, 9];
export const KID_AVATARS = ['👦', '👧', '🦁', '🦄', '🚀', '⚽', '🦋', '🦖'];

const PROFILES_KEY = 'hk_kid_profiles_v1';
const ACTIVE_PROFILE_KEY = 'hk_active_profile_id_v1';

export const todayStr = () => new Date().toISOString().slice(0, 10);

export function normalizeAge(val) {
  const n = Number(val);
  if (n === 7 || n === 9) return n;
  return 4;
}

export function createKidProfile({
  id,
  name = '',
  age = 4,
  gender = 'boy',
  avatar,
  stars = 5,
  dailyStars = 0,
  dailyDate = todayStr(),
  streakDays = 1,
  lastPlayed = todayStr()
} = {}) {
  const safeGender = gender === 'girl' ? 'girl' : 'boy';
  const safeAge = normalizeAge(age);
  const safeAvatar = avatar || (safeGender === 'girl' ? '👧' : '👦');
  return {
    id: id || `kid_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
    name: String(name || '').trim(),
    age: safeAge,
    gender: safeGender,
    avatar: safeAvatar,
    stars: Math.max(0, Number(stars) || 0),
    dailyStars: Math.max(0, Number(dailyStars) || 0),
    dailyDate: dailyDate || todayStr(),
    streakDays: Math.max(1, Number(streakDays) || 1),
    lastPlayed: lastPlayed || todayStr(),
    createdAt: new Date().toISOString()
  };
}

export function sanitizeProfilesList(rawList) {
  if (!Array.isArray(rawList)) return [];
  const seen = new Set();
  const out = [];
  for (const item of rawList) {
    if (!item || typeof item !== 'object') continue;
    const p = createKidProfile(item);
    if (seen.has(p.id)) continue;
    seen.add(p.id);
    out.push(p);
  }
  return out;
}

export function loadLocalProfiles() {
  try {
    const raw = localStorage.getItem(PROFILES_KEY);
    if (!raw) return [];
    return sanitizeProfilesList(JSON.parse(raw));
  } catch {
    return [];
  }
}

export function saveLocalProfiles(profiles) {
  try {
    localStorage.setItem(PROFILES_KEY, JSON.stringify(profiles));
  } catch {
    // ignore storage errors
  }
}

export function loadLocalActiveProfileId() {
  try {
    return localStorage.getItem(ACTIVE_PROFILE_KEY) || null;
  } catch {
    return null;
  }
}

export function saveLocalActiveProfileId(id) {
  try {
    if (id) localStorage.setItem(ACTIVE_PROFILE_KEY, id);
    else localStorage.removeItem(ACTIVE_PROFILE_KEY);
  } catch {
    // ignore
  }
}

/** Update a profile's streak/daily counters when activating it for today */
export function touchProfileForToday(profile) {
  const today = todayStr();
  let streakDays = profile.streakDays || 1;
  let dailyStars = profile.dailyStars || 0;

  if (profile.lastPlayed && profile.lastPlayed !== today) {
    const diffDays = Math.round((new Date(today) - new Date(profile.lastPlayed)) / 86400000);
    streakDays = diffDays === 1 ? streakDays + 1 : 1;
  }
  if (profile.dailyDate !== today) {
    dailyStars = 0;
  }

  return {
    ...profile,
    streakDays,
    dailyStars,
    dailyDate: today,
    lastPlayed: today
  };
}
