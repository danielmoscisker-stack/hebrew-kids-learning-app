import { json, makeCookie } from '../_lib.js';

export async function onRequestPost() {
  return json(
    { ok: true },
    200,
    { 'Set-Cookie': makeCookie('hk_session', '', 0) }
  );
}
