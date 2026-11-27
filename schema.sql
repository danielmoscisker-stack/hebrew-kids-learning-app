-- Cloudflare D1 Schema for Hebrew Kids Learning App (kids.moscisker.info)
CREATE TABLE IF NOT EXISTS users (
  sub TEXT PRIMARY KEY,
  email TEXT,
  name TEXT,
  picture TEXT,
  is_pro INTEGER NOT NULL DEFAULT 0,
  pro_source TEXT,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS progress (
  user_sub TEXT PRIMARY KEY,
  stars INTEGER NOT NULL DEFAULT 5,
  gender TEXT NOT NULL DEFAULT 'boy',
  lang TEXT NOT NULL DEFAULT 'he',
  streak_days INTEGER NOT NULL DEFAULT 1,
  last_played TEXT,
  data_json TEXT NOT NULL DEFAULT '{}',
  updated_at TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS promo_codes (
  code TEXT PRIMARY KEY,
  uses_left INTEGER NOT NULL DEFAULT 1,
  note TEXT
);

CREATE TABLE IF NOT EXISTS analytics_events (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  event_type TEXT NOT NULL,
  activity_id TEXT,
  device_type TEXT,
  lang TEXT,
  session_id TEXT,
  referrer TEXT,
  search_term TEXT,
  utm_source TEXT,
  duration_sec INTEGER,
  country TEXT,
  created_at TEXT NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_analytics_created ON analytics_events(created_at);
CREATE INDEX IF NOT EXISTS idx_analytics_type ON analytics_events(event_type, activity_id);
