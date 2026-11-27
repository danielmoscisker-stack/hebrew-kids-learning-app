import { getSessionUser } from './api/_lib.js';

const OWNER_EMAIL = 'danielmoscisker@gmail.com';

export async function onRequestGet({ request, env }) {
  const url = new URL(request.url);
  const queryKey = url.searchParams.get('key') || '';
  const authHeader = request.headers.get('Authorization') || '';
  const bearer = authHeader.startsWith('Bearer ') ? authHeader.slice(7).trim() : '';
  const providedKey = bearer || queryKey;

  const keyValid = Boolean(env.ADMIN_STATS_KEY && providedKey && providedKey === env.ADMIN_STATS_KEY);
  const sessionUser = await getSessionUser(request, env);
  const isOwnerGoogle = Boolean(
    sessionUser?.email && sessionUser.email.toLowerCase() === OWNER_EMAIL
  );

  // Not authorized yet -> show private Google + PIN login gate (no stats leaked!)
  if (!keyValid && !isOwnerGoogle) {
    const clientId = env.GOOGLE_CLIENT_ID || '';
    const wrongAccountMsg =
      sessionUser && !isOwnerGoogle
        ? `<p style="color:#f87171;font-weight:700">Signed in as ${sessionUser.email} — only ${OWNER_EMAIL} is authorized.</p>`
        : '';

    const gateHtml = `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width,initial-scale=1" />
  <meta name="robots" content="noindex,nofollow" />
  <title>Owner Access</title>
  ${clientId ? '<script src="https://accounts.google.com/gsi/client" async defer></script>' : ''}
  <style>
    body{font-family:system-ui,sans-serif;background:#0f172a;color:#e2e8f0;display:flex;align-items:center;justify-content:center;min-height:100vh;margin:0;padding:16px}
    .box{background:#1e293b;border:1px solid #334155;border-radius:16px;padding:28px;max-width:380px;width:100%;text-align:center}
    h1{margin:0 0 8px;font-size:20px;color:#fbbf24}
    p{font-size:13px;color:#94a3b8;margin:0 0 18px}
    .sep{margin:16px 0;font-size:12px;color:#64748b}
    form{display:flex;gap:8px}
    input{flex:1;padding:10px 12px;border-radius:10px;border:1px solid #475569;background:#0f172a;color:#fff}
    button{padding:10px 14px;border-radius:10px;border:0;background:#6366f1;color:#fff;font-weight:700;cursor:pointer}
    #gbtn{display:flex;justify-content:center}
    #err{color:#f87171;font-size:12px;margin-top:10px}
  </style>
</head>
<body>
  <div class="box">
    <h1>Owner Stats</h1>
    <p>Sign in with <strong>${OWNER_EMAIL}</strong> or enter your admin key.</p>
    ${wrongAccountMsg}
    ${clientId ? '<div id="gbtn"></div>' : ''}
    <div class="sep">or</div>
    <form method="GET" action="/ops-k9m4x">
      <input type="password" name="key" placeholder="Admin key / PIN" required />
      <button type="submit">Open</button>
    </form>
    <div id="err"></div>
  </div>
  ${
    clientId
      ? `<script>
    window.addEventListener('load', () => {
      if (!window.google?.accounts?.id) return;
      google.accounts.id.initialize({
        client_id: ${JSON.stringify(clientId)},
        callback: async (resp) => {
          const r = await fetch('/api/auth/google', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
            body: JSON.stringify({ idToken: resp.credential })
          });
          if (r.ok) location.reload();
          else document.getElementById('err').textContent = 'Google sign-in failed';
        }
      });
      google.accounts.id.renderButton(document.getElementById('gbtn'), { theme: 'filled_black', size: 'large', shape: 'pill', width: 260 });
    });
  </script>`
      : ''
  }
</body>
</html>`;

    return new Response(gateHtml, {
      status: 401,
      headers: {
        'Content-Type': 'text/html; charset=utf-8',
        'X-Robots-Tag': 'noindex, nofollow',
        'Cache-Control': 'no-store'
      }
    });
  }

  if (!env.DB) return new Response('Database not bound', { status: 500 });

  const days = Math.min(90, Math.max(1, parseInt(url.searchParams.get('days') || '30', 10)));
  const sinceIso = new Date(Date.now() - days * 86400000).toISOString();
  const last24hIso = new Date(Date.now() - 86400000).toISOString();

  const [totals, todayRow, byActivity, byDevice, byLang, dailyTrend, funnel, userCounts] =
    await Promise.all([
      env.DB.prepare(
        `SELECT
           COUNT(CASE WHEN event_type = 'page_view' THEN 1 END) AS pageViews,
           COUNT(CASE WHEN event_type = 'activity_start' THEN 1 END) AS gamePlays,
           COUNT(CASE WHEN event_type = 'star_earned' THEN 1 END) AS starsEvents,
           COUNT(DISTINCT session_id) AS uniqueSessions
         FROM analytics_events WHERE created_at >= ?`
      ).bind(sinceIso).first(),
      env.DB.prepare(
        `SELECT
           COUNT(CASE WHEN event_type = 'page_view' THEN 1 END) AS pageViews24h,
           COUNT(DISTINCT session_id) AS uniqueSessions24h
         FROM analytics_events WHERE created_at >= ?`
      ).bind(last24hIso).first(),
      env.DB.prepare(
        `SELECT activity_id AS id, COUNT(*) AS count
         FROM analytics_events
         WHERE event_type = 'activity_start' AND activity_id IS NOT NULL AND created_at >= ?
         GROUP BY activity_id ORDER BY count DESC`
      ).bind(sinceIso).all(),
      env.DB.prepare(
        `SELECT device_type AS device, COUNT(DISTINCT session_id) AS sessions, COUNT(*) AS events
         FROM analytics_events WHERE created_at >= ? GROUP BY device_type`
      ).bind(sinceIso).all(),
      env.DB.prepare(
        `SELECT lang, COUNT(DISTINCT session_id) AS sessions
         FROM analytics_events WHERE created_at >= ? GROUP BY lang`
      ).bind(sinceIso).all(),
      env.DB.prepare(
        `SELECT substr(created_at, 1, 10) AS day,
                COUNT(CASE WHEN event_type = 'page_view' THEN 1 END) AS views,
                COUNT(CASE WHEN event_type = 'activity_start' THEN 1 END) AS plays,
                COUNT(DISTINCT session_id) AS sessions
         FROM analytics_events WHERE created_at >= ?
         GROUP BY substr(created_at, 1, 10) ORDER BY day ASC`
      ).bind(new Date(Date.now() - 14 * 86400000).toISOString()).all(),
      env.DB.prepare(
        `SELECT
           COUNT(CASE WHEN event_type = 'pro_modal' THEN 1 END) AS proViews,
           COUNT(CASE WHEN event_type = 'pro_unlock' THEN 1 END) AS proUnlocks,
           COUNT(CASE WHEN event_type = 'google_signin' THEN 1 END) AS googleSignins
         FROM analytics_events WHERE created_at >= ?`
      ).bind(sinceIso).first(),
      env.DB.prepare(
        `SELECT COUNT(*) AS totalUsers, COUNT(CASE WHEN is_pro = 1 THEN 1 END) AS proUsers FROM users`
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

  if (url.searchParams.get('format') === 'json') {
    return new Response(JSON.stringify(payload, null, 2), {
      status: 200,
      headers: {
        'Content-Type': 'application/json; charset=utf-8',
        'X-Robots-Tag': 'noindex, nofollow',
        'Cache-Control': 'no-store'
      }
    });
  }

  const maxAct = Math.max(1, ...payload.byActivity.map((a) => a.count));
  const actHtml =
    payload.byActivity
      .map((a) => {
        const w = Math.max(6, Math.round((a.count / maxAct) * 100));
        return `<div class="bar-row"><span class="lbl">${a.id}</span><div class="bar-bg"><div class="bar" style="width:${w}%"></div></div><span class="val">${a.count}</span></div>`;
      })
      .join('') || '<p style="color:#94a3b8">No game plays recorded yet.</p>';

  const devHtml =
    payload.byDevice
      .map((d) => `<li>${d.device}: <strong>${d.sessions}</strong> sessions (${d.events} events)</li>`)
      .join('') || '<li>No data yet</li>';
  const langHtml =
    payload.byLang
      .map((l) => `<li>${l.lang === 'he' ? 'Hebrew (he)' : 'English (en)'}: <strong>${l.sessions}</strong> sessions</li>`)
      .join('') || '<li>No data yet</li>';
  const trendHtml =
    payload.dailyTrend
      .map((d) => `<tr><td>${d.day}</td><td>${d.sessions}</td><td>${d.views}</td><td>${d.plays}</td></tr>`)
      .join('') || '<tr><td colspan="4">No data yet</td></tr>';

  const keySuffix = keyValid ? `&key=${encodeURIComponent(providedKey)}` : '';
  const html = `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width,initial-scale=1" />
  <meta name="robots" content="noindex,nofollow" />
  <title>Owner Stats — kids.moscisker.info</title>
  <style>
    body{font-family:system-ui,sans-serif;max-width:900px;margin:28px auto;padding:0 16px;background:#0f172a;color:#e2e8f0}
    .top{display:flex;flex-wrap:wrap;align-items:center;justify-content:space-between;gap:12px}
    h1{color:#fbbf24;margin:0}
    .pills a{display:inline-block;padding:6px 12px;border-radius:8px;background:#1e293b;color:#e2e8f0;text-decoration:none;font-size:13px;font-weight:700;border:1px solid #334155;margin-left:6px}
    .pills a.active{background:#fbbf24;color:#0f172a;border-color:#fbbf24}
    .grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(155px,1fr));gap:12px;margin:18px 0}
    .card{background:#1e293b;padding:14px;border-radius:12px;border:1px solid #334155}
    .num{font-size:28px;font-weight:800;color:#fff;margin:4px 0}
    .panel{background:#1e293b;padding:16px;border-radius:12px;border:1px solid #334155;margin-top:16px}
    h2{margin:0 0 12px;font-size:16px;color:#cbd5e1}
    .bar-row{display:flex;align-items:center;gap:10px;margin:8px 0}
    .lbl{width:130px;font-size:13px;font-weight:600}
    .bar-bg{flex:1;height:14px;background:#0f172a;border-radius:99px;overflow:hidden}
    .bar{height:100%;background:linear-gradient(90deg,#6366f1,#ec4899)}
    .val{width:40px;text-align:right;font-weight:700}
    table{width:100%;border-collapse:collapse}
    th,td{padding:8px 10px;border-bottom:1px solid #334155;text-align:left;font-size:13px}
    th{color:#94a3b8}
  </style>
</head>
<body>
  <div class="top">
    <div>
      <h1>Owner Usage Stats (${days}d)</h1>
      <small style="color:#94a3b8">${isOwnerGoogle ? `Signed in: ${sessionUser.email}` : 'Authenticated via Admin Key'}</small>
    </div>
    <div class="pills">
      <a href="/ops-k9m4x?days=7${keySuffix}" class="${days === 7 ? 'active' : ''}">7d</a>
      <a href="/ops-k9m4x?days=30${keySuffix}" class="${days === 30 ? 'active' : ''}">30d</a>
      <a href="/ops-k9m4x?days=90${keySuffix}" class="${days === 90 ? 'active' : ''}">90d</a>
      <a href="/">← App</a>
    </div>
  </div>

  <div class="grid">
    <div class="card"><div>Unique Sessions</div><div class="num">${payload.totals.uniqueSessions}</div><small>24h: ${payload.last24h.uniqueSessions24h}</small></div>
    <div class="card"><div>Page Views</div><div class="num">${payload.totals.pageViews}</div><small>24h: ${payload.last24h.pageViews24h}</small></div>
    <div class="card"><div>Games Played</div><div class="num">${payload.totals.gamePlays}</div><small>Star wins: ${payload.totals.starsEvents}</small></div>
    <div class="card"><div>Google Parents</div><div class="num">${payload.accounts.totalUsers}</div><small>Sign-ins: ${payload.funnel.googleSignins}</small></div>
    <div class="card"><div>Pro Users</div><div class="num">${payload.accounts.proUsers}</div><small>Modal views: ${payload.funnel.proViews}</small></div>
  </div>

  <div class="panel"><h2>Popular Games</h2>${actHtml}</div>
  <div class="panel"><h2>Devices &amp; Languages</h2><ul>${devHtml}${langHtml}</ul></div>
  <div class="panel"><h2>Last 14 Days</h2><table><tr><th>Date</th><th>Sessions</th><th>Views</th><th>Plays</th></tr>${trendHtml}</table></div>
</body>
</html>`;

  return new Response(html, {
    status: 200,
    headers: {
      'Content-Type': 'text/html; charset=utf-8',
      'X-Robots-Tag': 'noindex, nofollow',
      'Cache-Control': 'no-store'
    }
  });
}
