import { json } from '../_lib.js';

export async function onRequestGet({ request, env }) {
  if (!env.DB) return json({ error: 'Database not bound' }, 500);

  const url = new URL(request.url);
  const days = Math.min(90, Math.max(1, parseInt(url.searchParams.get('days') || '30', 10)));
  const sinceIso = new Date(Date.now() - days * 86400000).toISOString();
  const last24hIso = new Date(Date.now() - 86400000).toISOString();

  const [
    totals,
    todayRow,
    byActivity,
    byDevice,
    byLang,
    dailyTrend,
    funnel,
    userCounts
  ] = await Promise.all([
    env.DB.prepare(
      `SELECT
         COUNT(CASE WHEN event_type = 'page_view' THEN 1 END) AS pageViews,
         COUNT(CASE WHEN event_type = 'activity_start' THEN 1 END) AS gamePlays,
         COUNT(CASE WHEN event_type = 'star_earned' THEN 1 END) AS starsEvents,
         COUNT(DISTINCT session_id) AS uniqueSessions
       FROM analytics_events
       WHERE created_at >= ?`
    )
      .bind(sinceIso)
      .first(),

    env.DB.prepare(
      `SELECT
         COUNT(CASE WHEN event_type = 'page_view' THEN 1 END) AS pageViews24h,
         COUNT(DISTINCT session_id) AS uniqueSessions24h
       FROM analytics_events
       WHERE created_at >= ?`
    )
      .bind(last24hIso)
      .first(),

    env.DB.prepare(
      `SELECT activity_id AS id, COUNT(*) AS count
       FROM analytics_events
       WHERE event_type = 'activity_start' AND activity_id IS NOT NULL AND created_at >= ?
       GROUP BY activity_id
       ORDER BY count DESC`
    )
      .bind(sinceIso)
      .all(),

    env.DB.prepare(
      `SELECT device_type AS device, COUNT(DISTINCT session_id) AS sessions, COUNT(*) AS events
       FROM analytics_events
       WHERE created_at >= ?
       GROUP BY device_type`
    )
      .bind(sinceIso)
      .all(),

    env.DB.prepare(
      `SELECT lang, COUNT(DISTINCT session_id) AS sessions
       FROM analytics_events
       WHERE created_at >= ?
       GROUP BY lang`
    )
      .bind(sinceIso)
      .all(),

    env.DB.prepare(
      `SELECT substr(created_at, 1, 10) AS day,
              COUNT(CASE WHEN event_type = 'page_view' THEN 1 END) AS views,
              COUNT(CASE WHEN event_type = 'activity_start' THEN 1 END) AS plays,
              COUNT(DISTINCT session_id) AS sessions
       FROM analytics_events
       WHERE created_at >= ?
       GROUP BY substr(created_at, 1, 10)
       ORDER BY day ASC`
    )
      .bind(new Date(Date.now() - 14 * 86400000).toISOString())
      .all(),

    env.DB.prepare(
      `SELECT
         COUNT(CASE WHEN event_type = 'pro_modal' THEN 1 END) AS proViews,
         COUNT(CASE WHEN event_type = 'pro_unlock' THEN 1 END) AS proUnlocks,
         COUNT(CASE WHEN event_type = 'google_signin' THEN 1 END) AS googleSignins
       FROM analytics_events
       WHERE created_at >= ?`
    )
      .bind(sinceIso)
      .first(),

    env.DB.prepare(
      `SELECT
         COUNT(*) AS totalUsers,
         COUNT(CASE WHEN is_pro = 1 THEN 1 END) AS proUsers
       FROM users`
    ).first()
  ]);

  return json({
    days,
    totals: totals || { pageViews: 0, gamePlays: 0, starsEvents: 0, uniqueSessions: 0 },
    last24h: todayRow || { pageViews24h: 0, uniqueSessions24h: 0 },
    byActivity: byActivity?.results || [],
    byDevice: byDevice?.results || [],
    byLang: byLang?.results || [],
    dailyTrend: dailyTrend?.results || [],
    funnel: funnel || { proViews: 0, proUnlocks: 0, googleSignins: 0 },
    accounts: userCounts || { totalUsers: 0, proUsers: 0 }
  });
}
