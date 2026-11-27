import { json } from '../_lib.js';

const ALLOWED_EVENTS = new Set([
  'page_view',
  'activity_start',
  'star_earned',
  'pro_modal',
  'pro_unlock',
  'google_signin',
  'session_time'
]);

export async function onRequestPost({ request, env }) {
  if (!env.DB) return json({ ok: false }, 200);
  try {
    const body = await request.json();
    const eventType = String(body.eventType || '');
    if (!ALLOWED_EVENTS.has(eventType)) {
      return json({ error: 'Invalid eventType' }, 400);
    }
    const activityId = body.activityId ? String(body.activityId).slice(0, 40) : null;
    const deviceType = body.deviceType === 'mobile' ? 'mobile' : 'desktop';
    const lang = body.lang === 'en' ? 'en' : body.lang === 'es' ? 'es' : 'he';
    const sessionId = body.sessionId ? String(body.sessionId).slice(0, 48) : null;
    const referrer = body.referrer ? String(body.referrer).slice(0, 120) : null;
    const searchTerm = body.searchTerm ? String(body.searchTerm).slice(0, 120) : null;
    const utmSource = body.utmSource ? String(body.utmSource).slice(0, 80) : null;
    const rawDur = Number(body.durationSec);
    const durationSec =
      eventType === 'session_time' && Number.isFinite(rawDur) && rawDur >= 1
        ? Math.min(7200, Math.round(rawDur))
        : null;
    const country = String(request.cf?.country || request.headers.get('CF-IPCountry') || '')
      .trim()
      .toUpperCase()
      .slice(0, 8) || null;
    const now = new Date().toISOString();

    await env.DB.prepare(
      `INSERT INTO analytics_events
         (event_type, activity_id, device_type, lang, session_id, referrer, search_term, utm_source, duration_sec, country, created_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
    )
      .bind(
        eventType,
        activityId,
        deviceType,
        lang,
        sessionId,
        referrer,
        searchTerm,
        utmSource,
        durationSec,
        country,
        now
      )
      .run();

    return json({ ok: true });
  } catch {
    return json({ ok: false }, 200);
  }
}
