import { json } from '../_lib.js';

export async function onRequestGet({ request, env }) {
  if (!env.DB) return json({ error: 'Database not bound' }, 500);

  const url = new URL(request.url);
  const authHeader = request.headers.get('Authorization') || '';
  const bearer = authHeader.startsWith('Bearer ') ? authHeader.slice(7).trim() : '';
  const queryKey = url.searchParams.get('key') || '';
  const providedKey = bearer || queryKey;

  if (!env.ADMIN_STATS_KEY || !providedKey || providedKey !== env.ADMIN_STATS_KEY) {
    return new Response('Not Found', { status: 404 });
  }

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

  const payload = {
    days,
    totals: totals || { pageViews: 0, gamePlays: 0, starsEvents: 0, uniqueSessions: 0 },
    last24h: todayRow || { pageViews24h: 0, uniqueSessions24h: 0 },
    byActivity: byActivity?.results || [],
    byDevice: byDevice?.results || [],
    byLang: byLang?.results || [],
    dailyTrend: dailyTrend?.results || [],
    funnel: funnel || { proViews: 0, proUnlocks: 0, googleSignins: 0 },
    accounts: userCounts || { totalUsers: 0, proUsers: 0 }
  };

  if (url.searchParams.get('format') === 'html') {
    const rowsHtml = payload.byActivity
      .map((a) => `<tr><td>${a.id}</td><td><strong>${a.count}</strong></td></tr>`)
      .join('') || '<tr><td colspan="2">No plays yet</td></tr>';
    const devHtml = payload.byDevice
      .map((d) => `<li>${d.device}: <strong>${d.sessions}</strong> sessions (${d.events} events)</li>`)
      .join('');
    const langHtml = payload.byLang
      .map((l) => `<li>${l.lang}: <strong>${l.sessions}</strong> sessions</li>`)
      .join('');
    const trendHtml = payload.dailyTrend
      .map((d) => `<tr><td>${d.day}</td><td>${d.sessions}</td><td>${d.views}</td><td>${d.plays}</td></tr>`)
      .join('') || '<tr><td colspan="4">No data yet</td></tr>';

    const html = `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="robots" content="noindex,nofollow"><title>Backend Stats — kids.moscisker.info</title><style>body{font-family:system-ui,sans-serif;max-width:860px;margin:28px auto;padding:0 16px;background:#0f172a;color:#e2e8f0}h1{color:#fbbf24}.grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(150px,1fr));gap:12px;margin:16px 0}.card{background:#1e293b;padding:14px;border-radius:12px;border:1px solid #334155}.num{font-size:28px;font-weight:800;color:#fff}table{width:100%;border-collapse:collapse;background:#1e293b;border-radius:12px;overflow:hidden;margin-top:8px}th,td{padding:8px 12px;border-bottom:1px solid #334155;text-align:left}th{background:#334155}</style></head><body><h1>Admin Usage Stats (Last ${days}d)</h1><div class="grid"><div class="card"><div>Sessions</div><div class="num">${payload.totals.uniqueSessions}</div><small>24h: ${payload.last24h.uniqueSessions24h}</small></div><div class="card"><div>Page Views</div><div class="num">${payload.totals.pageViews}</div><small>24h: ${payload.last24h.pageViews24h}</small></div><div class="card"><div>Games Played</div><div class="num">${payload.totals.gamePlays}</div><small>Stars: ${payload.totals.starsEvents}</small></div><div class="card"><div>Google Users</div><div class="num">${payload.accounts.totalUsers}</div><small>Sign-ins: ${payload.funnel.googleSignins}</small></div><div class="card"><div>Pro Users</div><div class="num">${payload.accounts.proUsers}</div><small>Modal: ${payload.funnel.proViews}</small></div></div><h2>Popular Activities</h2><table><tr><th>Activity</th><th>Plays</th></tr>${rowsHtml}</table><h2>Devices &amp; Languages</h2><ul>${devHtml}${langHtml}</ul><h2>Last 14 Days</h2><table><tr><th>Date</th><th>Sessions</th><th>Views</th><th>Plays</th></tr>${trendHtml}</table></body></html>`;
    return new Response(html, {
      status: 200,
      headers: { 'Content-Type': 'text/html; charset=utf-8', 'Cache-Control': 'no-store' }
    });
  }

  return json(payload);
}
