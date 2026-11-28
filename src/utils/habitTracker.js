// Per-kid Daily Habits & Parent Prize Goals persistence + cloud merge.

import { DEFAULT_HABITS } from '../data/habitTrackerData.js';
import { localTodayStr } from './playLimits.js';

const HABITS_STORAGE_KEY = 'hk_habit_trackers_v1';

export function getHabitKey(profileId) {
  return profileId || 'guest';
}

export function createDefaultHabitEntry() {
  return {
    trackingMode: 'parent_approval', // 'parent_approval' | 'adult_only' | 'kid_self'
    requireParentApproval: true,
    habits: DEFAULT_HABITS.map((h) => ({ ...h })),
    // { [YYYY-MM-DD]: { approvedIds: string[], pendingIds: string[], bedtime: string } }
    logs: {},
    // Array of { id, title, icon, targetCount, currentCount, habitIds: string[] (empty = any habit), claimed: boolean, createdAt }
    goals: []
  };
}

function normalizeHabitItem(raw) {
  if (!raw || typeof raw !== 'object' || !raw.id) return null;
  return {
    id: String(raw.id),
    icon: String(raw.icon || '⭐'),
    stars: Math.min(10, Math.max(1, Math.round(Number(raw.stars) || 2))),
    titleHe: String(raw.titleHe || raw.title || ''),
    titleEn: String(raw.titleEn || raw.title || raw.titleHe || ''),
    titleEs: String(raw.titleEs || raw.title || raw.titleEn || raw.titleHe || '')
  };
}

function normalizeGoalItem(raw) {
  if (!raw || typeof raw !== 'object' || !raw.id) return null;
  return {
    id: String(raw.id),
    icon: String(raw.icon || '🎁'),
    title: String(raw.title || '').trim(),
    targetCount: Math.min(100, Math.max(1, Math.round(Number(raw.targetCount) || 10))),
    currentCount: Math.max(0, Math.round(Number(raw.currentCount) || 0)),
    habitIds: Array.isArray(raw.habitIds) ? raw.habitIds.filter((x) => typeof x === 'string') : [],
    claimed: Boolean(raw.claimed),
    createdAt: raw.createdAt || new Date().toISOString()
  };
}

export function normalizeHabitEntry(raw) {
  const base = createDefaultHabitEntry();
  if (!raw || typeof raw !== 'object') return base;

  const habits = Array.isArray(raw.habits) && raw.habits.length > 0
    ? raw.habits.map(normalizeHabitItem).filter(Boolean)
    : base.habits;

  const logs = {};
  if (raw.logs && typeof raw.logs === 'object') {
    for (const [dateStr, dayLog] of Object.entries(raw.logs)) {
      if (!/^\d{4}-\d{2}-\d{2}$/.test(dateStr) || !dayLog || typeof dayLog !== 'object') continue;
      logs[dateStr] = {
        approvedIds: Array.isArray(dayLog.approvedIds)
          ? [...new Set(dayLog.approvedIds.filter((x) => typeof x === 'string'))]
          : [],
        pendingIds: Array.isArray(dayLog.pendingIds)
          ? [...new Set(dayLog.pendingIds.filter((x) => typeof x === 'string'))]
          : [],
        bedtime: typeof dayLog.bedtime === 'string' ? dayLog.bedtime.slice(0, 10) : ''
      };
    }
  }

  // Keep only the last 30 days of logs to keep cloud payload compact
  const sortedDates = Object.keys(logs).sort();
  if (sortedDates.length > 30) {
    for (const oldDate of sortedDates.slice(0, sortedDates.length - 30)) {
      delete logs[oldDate];
    }
  }

  const goals = Array.isArray(raw.goals)
    ? raw.goals.map(normalizeGoalItem).filter((g) => g && g.title)
    : [];

  const validModes = ['parent_approval', 'adult_only', 'kid_self'];
  const trackingMode = validModes.includes(raw.trackingMode)
    ? raw.trackingMode
    : raw.requireParentApproval === false
      ? 'kid_self'
      : 'parent_approval';

  return {
    trackingMode,
    requireParentApproval: trackingMode !== 'kid_self',
    habits: habits.length > 0 ? habits : base.habits,
    logs,
    goals
  };
}

export function sanitizeHabitMap(rawMap) {
  if (!rawMap || typeof rawMap !== 'object') return {};
  const out = {};
  for (const [k, v] of Object.entries(rawMap)) {
    if (!k || !v || typeof v !== 'object') continue;
    out[k] = normalizeHabitEntry(v);
  }
  return out;
}

export function loadLocalHabitMap() {
  try {
    const raw = localStorage.getItem(HABITS_STORAGE_KEY);
    if (!raw) return {};
    return sanitizeHabitMap(JSON.parse(raw));
  } catch {
    return {};
  }
}

export function saveLocalHabitMap(map) {
  try {
    localStorage.setItem(HABITS_STORAGE_KEY, JSON.stringify(sanitizeHabitMap(map)));
  } catch {
    // ignore
  }
}

export function mergeHabitMaps(localMap, cloudMap) {
  const safeLocal = sanitizeHabitMap(localMap);
  const safeCloud = sanitizeHabitMap(cloudMap);
  const keys = new Set([...Object.keys(safeLocal), ...Object.keys(safeCloud)]);
  const merged = {};
  for (const key of keys) {
    const l = safeLocal[key];
    const c = safeCloud[key];
    if (l && !c) merged[key] = l;
    else if (c && !l) merged[key] = c;
    else {
      // Merge logs by date (union of approvedIds), prefer cloud habits/goals if present
      const allDates = new Set([...Object.keys(l.logs), ...Object.keys(c.logs)]);
      const mergedLogs = {};
      for (const d of allDates) {
        const ld = l.logs[d] || { approvedIds: [], pendingIds: [], bedtime: '' };
        const cd = c.logs[d] || { approvedIds: [], pendingIds: [], bedtime: '' };
        const approvedSet = new Set([...ld.approvedIds, ...cd.approvedIds]);
        const pendingSet = new Set([...ld.pendingIds, ...cd.pendingIds].filter((id) => !approvedSet.has(id)));
        mergedLogs[d] = {
          approvedIds: [...approvedSet],
          pendingIds: [...pendingSet],
          bedtime: cd.bedtime || ld.bedtime || ''
        };
      }
      merged[key] = normalizeHabitEntry({
        trackingMode: c.trackingMode || l.trackingMode,
        requireParentApproval: c.requireParentApproval,
        habits: c.habits.length > 0 ? c.habits : l.habits,
        logs: mergedLogs,
        goals: c.goals.length >= l.goals.length ? c.goals : l.goals
      });
    }
  }
  return merged;
}

export function getTodayHabitLog(entry, dateStr = localTodayStr()) {
  const log = entry?.logs?.[dateStr];
  return {
    approvedIds: log?.approvedIds || [],
    pendingIds: log?.pendingIds || [],
    bedtime: log?.bedtime || ''
  };
}
