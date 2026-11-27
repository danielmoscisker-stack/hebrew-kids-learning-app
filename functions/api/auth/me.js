import { json, getSessionUser, hasProCookie } from '../_lib.js';

export async function onRequestGet({ request, env }) {
  const user = await getSessionUser(request, env);
  const proCookie = await hasProCookie(request, env);

  if (!user) {
    return json({ user: null, isPro: proCookie, progress: null });
  }

  let progress = null;
  if (env.DB) {
    const prog = await env.DB.prepare(
      'SELECT stars, gender, lang, streak_days, last_played, data_json FROM progress WHERE user_sub = ?'
    )
      .bind(user.sub)
      .first();
    if (prog) {
      progress = {
        stars: prog.stars,
        gender: prog.gender,
        lang: prog.lang,
        streakDays: prog.streak_days,
        lastPlayed: prog.last_played,
        data: JSON.parse(prog.data_json || '{}')
      };
    }
  }

  return json({
    user: {
      sub: user.sub,
      email: user.email,
      name: user.name,
      picture: user.picture,
      isPro: Boolean(user.is_pro) || proCookie
    },
    isPro: Boolean(user.is_pro) || proCookie,
    progress
  });
}
