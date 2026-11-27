// Shared helpers for Cloudflare Pages Functions (Web Crypto HMAC + D1 + Google token verification)

export const json = (data, status = 200, extraHeaders = {}) =>
  new Response(JSON.stringify(data), {
    status,
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
      'Cache-Control': 'no-store',
      ...extraHeaders
    }
  });

export const getCookie = (request, name) => {
  const raw = request.headers.get('Cookie') || '';
  const match = raw.match(new RegExp(`(?:^|;\\s*)${name}=([^;]+)`));
  return match ? decodeURIComponent(match[1]) : null;
};

export const makeCookie = (name, value, maxAgeSeconds = 60 * 60 * 24 * 30) =>
  `${name}=${encodeURIComponent(value)}; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=${maxAgeSeconds}`;

const toBase64Url = (bytes) =>
  btoa(String.fromCharCode(...new Uint8Array(bytes)))
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '');

const fromBase64Url = (str) => {
  const pad = str.replace(/-/g, '+').replace(/_/g, '/') + '==='.slice((str.length + 3) % 4);
  const bin = atob(pad);
  return Uint8Array.from(bin, (c) => c.charCodeAt(0));
};

const getSecret = (env) => env.SESSION_SECRET || 'hebrew-kids-fallback-dev-secret-change-in-cf';

async function hmacKey(secret) {
  return crypto.subtle.importKey(
    'raw',
    new TextEncoder().encode(secret),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign', 'verify']
  );
}

export async function signToken(payload, env) {
  const body = toBase64Url(new TextEncoder().encode(JSON.stringify(payload)));
  const key = await hmacKey(getSecret(env));
  const sig = await crypto.subtle.sign('HMAC', key, new TextEncoder().encode(body));
  return `${body}.${toBase64Url(sig)}`;
}

export async function verifyToken(token, env) {
  if (!token || !token.includes('.')) return null;
  try {
    const [body, sig] = token.split('.');
    const key = await hmacKey(getSecret(env));
    const ok = await crypto.subtle.verify(
      'HMAC',
      key,
      fromBase64Url(sig),
      new TextEncoder().encode(body)
    );
    if (!ok) return null;
    const parsed = JSON.parse(new TextDecoder().decode(fromBase64Url(body)));
    if (parsed.exp && Date.now() > parsed.exp) return null;
    return parsed;
  } catch {
    return null;
  }
}

export async function verifyGoogleIdToken(idToken, expectedClientId) {
  const res = await fetch(
    `https://oauth2.googleapis.com/tokeninfo?id_token=${encodeURIComponent(idToken)}`
  );
  if (!res.ok) return null;
  const info = await res.json();
  if (expectedClientId && info.aud !== expectedClientId) return null;
  if (info.email_verified !== 'true' && info.email_verified !== true) return null;
  if (!info.sub) return null;
  return {
    sub: String(info.sub),
    email: info.email || '',
    name: info.name || info.given_name || 'Parent',
    picture: info.picture || ''
  };
}

export async function getSessionUser(request, env) {
  const token = getCookie(request, 'hk_session');
  const session = await verifyToken(token, env);
  if (!session?.sub || !env.DB) return null;
  const user = await env.DB.prepare(
    'SELECT sub, email, name, picture, is_pro, pro_source FROM users WHERE sub = ?'
  )
    .bind(session.sub)
    .first();
  return user || null;
}

export async function hasProCookie(request, env) {
  const token = getCookie(request, 'hk_pro');
  const data = await verifyToken(token, env);
  return Boolean(data?.pro);
}
