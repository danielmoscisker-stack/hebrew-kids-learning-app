import { json, getSessionUser, makeCookie, signToken } from '../_lib.js';

export async function onRequestPost({ request, env }) {
  if (!env.DB) return json({ error: 'Database not bound' }, 500);

  const { code } = await request.json();
  const cleanCode = String(code || '').trim().toUpperCase();
  if (!cleanCode) return json({ error: 'Missing code' }, 400);

  const row = await env.DB.prepare(
    'SELECT code, uses_left FROM promo_codes WHERE code = ?'
  )
    .bind(cleanCode)
    .first();

  if (!row || row.uses_left <= 0) {
    return json({ error: 'Invalid or expired code' }, 400);
  }

  await env.DB.prepare('UPDATE promo_codes SET uses_left = uses_left - 1 WHERE code = ?')
    .bind(cleanCode)
    .run();

  const user = await getSessionUser(request, env);
  if (user) {
    await env.DB.prepare(
      'UPDATE users SET is_pro = 1, pro_source = ?, updated_at = ? WHERE sub = ?'
    )
      .bind(`code:${cleanCode}`, new Date().toISOString(), user.sub)
      .run();
  }

  const proToken = await signToken(
    { pro: true, exp: Date.now() + 1000 * 60 * 60 * 24 * 365 },
    env
  );

  return json(
    { ok: true, isPro: true },
    200,
    { 'Set-Cookie': makeCookie('hk_pro', proToken, 60 * 60 * 24 * 365) }
  );
}
