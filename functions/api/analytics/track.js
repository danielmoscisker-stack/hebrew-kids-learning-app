import { json } from '../_lib.js';

const ALLOWED_EVENTS = new Set([
  'page_view',
  'activity_start',
  'star_earned',
  'pro_modal',
  'pro_unlock',
  'google_signin'
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
    const lang = body.lang === 'en' ? 'en' : 'he';
    const sessionId = body.sessionId ? String(body.sessionId).slice(0, 48) : null;
    const now = new Date().toISOString();

    await env.DB.prepare(
      `INSERT INTO analytics_events (event_type, activity_id, device_type, lang, session_id, created_at)
       VALUES (?, ?, ?, ?, ?, ?)`
    )
      .bind(eventType, activityId, deviceType, lang, sessionId, now)
      .run();

    return json({ ok: true });
  } catch {
    return json({ ok: false }, 200);
  }
}
