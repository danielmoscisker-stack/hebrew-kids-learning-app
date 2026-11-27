import { json, getSessionUser } from './_lib.js';

export async function onRequestPost({ request, env }) {
  const user = await getSessionUser(request, env);
  if (!user) return json({ error: 'Not signed in' }, 401);
  if (!env.DB) return json({ error: 'Database not bound' }, 500);

  const body = await request.json();
  const stars = Math.max(0, Math.min(99999, Number(body.stars) || 0));
  const gender = body.gender === 'girl' ? 'girl' : 'boy';
  const lang = body.lang === 'en' ? 'en' : 'he';
  const streakDays = Math.max(1, Number(body.streakDays) || 1);
  const lastPlayed = String(body.lastPlayed || '');
  const dataJson = JSON.stringify(body.data || {});
  const now = new Date().toISOString();

  await env.DB.prepare(
    `INSERT INTO progress (user_sub, stars, gender, lang, streak_days, last_played, data_json, updated_at)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?)
     ON CONFLICT(user_sub) DO UPDATE SET
       stars = MAX(progress.stars, excluded.stars),
       gender = excluded.gender,
       lang = excluded.lang,
       streak_days = MAX(progress.streak_days, excluded.streak_days),
       last_played = excluded.last_played,
       data_json = excluded.data_json,
       updated_at = excluded.updated_at`
  )
    .bind(user.sub, stars, gender, lang, streakDays, lastPlayed, dataJson, now)
    .run();

  return json({ ok: true, updatedAt: now });
}
