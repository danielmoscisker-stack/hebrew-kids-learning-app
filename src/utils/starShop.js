// Per-kid Star Shop inventory, equipped items, and Dream Goal wishlist persistence + cloud merge.

const SHOP_STORAGE_KEY = 'hk_star_shop_v1';

export function getShopKey(profileId) {
  return profileId || 'guest';
}

export function createDefaultShopEntry() {
  return {
    ownedIds: ['theme_classic'],
    equippedAvatar: null,
    equippedTheme: 'theme_classic',
    equippedPet: null,
    equippedBadge: null,
    wishlistId: null
  };
}

export function normalizeShopEntry(raw) {
  const base = createDefaultShopEntry();
  if (!raw || typeof raw !== 'object') return base;
  const ownedSet = new Set(Array.isArray(raw.ownedIds) ? raw.ownedIds.filter((x) => typeof x === 'string') : []);
  ownedSet.add('theme_classic');
  return {
    ownedIds: [...ownedSet],
    equippedAvatar: typeof raw.equippedAvatar === 'string' ? raw.equippedAvatar : null,
    equippedTheme: typeof raw.equippedTheme === 'string' && ownedSet.has(raw.equippedTheme) ? raw.equippedTheme : 'theme_classic',
    equippedPet: typeof raw.equippedPet === 'string' && ownedSet.has(raw.equippedPet) ? raw.equippedPet : null,
    equippedBadge: typeof raw.equippedBadge === 'string' && ownedSet.has(raw.equippedBadge) ? raw.equippedBadge : null,
    wishlistId: typeof raw.wishlistId === 'string' && !ownedSet.has(raw.wishlistId) ? raw.wishlistId : null
  };
}

export function sanitizeShopMap(rawMap) {
  if (!rawMap || typeof rawMap !== 'object') return {};
  const out = {};
  for (const [k, v] of Object.entries(rawMap)) {
    if (!k || !v || typeof v !== 'object') continue;
    out[k] = normalizeShopEntry(v);
  }
  return out;
}

export function loadLocalShopMap() {
  try {
    const raw = localStorage.getItem(SHOP_STORAGE_KEY);
    if (!raw) return {};
    return sanitizeShopMap(JSON.parse(raw));
  } catch {
    return {};
  }
}

export function saveLocalShopMap(map) {
  try {
    localStorage.setItem(SHOP_STORAGE_KEY, JSON.stringify(sanitizeShopMap(map)));
  } catch {
    // ignore
  }
}

/** Merge local and cloud shop inventories, taking union of owned items so purchases are never lost. */
export function mergeShopMaps(localMap, cloudMap) {
  const safeLocal = sanitizeShopMap(localMap);
  const safeCloud = sanitizeShopMap(cloudMap);
  const keys = new Set([...Object.keys(safeLocal), ...Object.keys(safeCloud)]);
  const merged = {};
  for (const key of keys) {
    const l = safeLocal[key];
    const c = safeCloud[key];
    if (l && !c) {
      merged[key] = l;
    } else if (c && !l) {
      merged[key] = c;
    } else {
      const unionOwned = new Set([...l.ownedIds, ...c.ownedIds]);
      merged[key] = normalizeShopEntry({
        ownedIds: [...unionOwned],
        equippedTheme: c.equippedTheme || l.equippedTheme,
        equippedPet: c.equippedPet || l.equippedPet,
        equippedBadge: c.equippedBadge || l.equippedBadge,
        wishlistId: c.wishlistId || l.wishlistId
      });
    }
  }
  return merged;
}
