import { json, makeCookie, signToken, verifyGoogleIdToken, hasProCookie } from '../_lib.js';

export async function onRequestPost({ request, env }) {
  try {
    const { idToken } = await request.json();
    if (!idToken) return json({ error: 'Missing idToken' }, 400);

    const gUser = await verifyGoogleIdToken(idToken, env.GOOGLE_CLIENT_ID);
    if (!gUser) return json({ error: 'Invalid Google token' }, 401);

    const now = new Date().toISOString();
    const proFromCookie = await hasProCookie(request, env);

    if (env.DB) {
      await env.DB.prepare(
        `INSERT INTO users (sub, email, name, picture, is_pro, pro_source, created_at, updated_at)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?)
         ON CONFLICT(sub) DO UPDATE SET
           email = excluded.email,
           name = excluded.name,
           picture = excluded.picture,
           is_pro = CASE WHEN users.is_pro = 1 OR excluded.is_pro = 1 THEN 1 ELSE 0 END,
           updated_at = excluded.updated_at`
      )
        .bind(
          gUser.sub,
          gUser.email,
          gUser.name,
          gUser.picture,
          proFromCookie ? 1 : 0,
          proFromCookie ? 'code' : null,
          now,
          now
        )
        .run();

      const dbUser = await env.DB.prepare(
        'SELECT sub, email, name, picture, is_pro, pro_source FROM users WHERE sub = ?'
      )
        .bind(gUser.sub)
        .first();

      const prog = await env.DB.prepare(
        'SELECT stars, gender, lang, streak_days, last_played, data_json FROM progress WHERE user_sub = ?'
      )
        .bind(gUser.sub)
        .first();

      const sessionToken = await signToken(
        { sub: gUser.sub, exp: Date.now() + 1000 * 60 * 60 * 24 * 30 },
        env
      );

      return json(
        {
          user: {
            sub: dbUser.sub,
            email: dbUser.email,
            name: dbUser.name,
            picture: dbUser.picture,
            isPro: Boolean(dbUser.is_pro)
          },
          progress: prog
            ? {
                stars: prog.stars,
                gender: prog.gender,
                lang: prog.lang,
                streakDays: prog.streak_days,
                lastPlayed: prog.last_played,
                data: JSON.parse(prog.data_json || '{}')
              }
            : null
        },
        200,
        { 'Set-Cookie': makeCookie('hk_session', sessionToken) }
      );
    }

    return json({ error: 'Database not bound' }, 500);
  } catch (e) {
    return json({ error: e.message || 'Auth failed' }, 500);
  }
}
