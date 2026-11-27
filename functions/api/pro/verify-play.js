import { json, getSessionUser, signToken, makeCookie } from '../_lib.js';

const PACKAGE_NAME = 'com.learningapp.hebrewkids';

const b64Url = (input) => {
  const bytes = typeof input === 'string' ? new TextEncoder().encode(input) : new Uint8Array(input);
  return btoa(String.fromCharCode(...bytes))
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '');
};

function pemToArrayBuffer(pem) {
  const clean = pem
    .replace(/-----BEGIN PRIVATE KEY-----/g, '')
    .replace(/-----END PRIVATE KEY-----/g, '')
    .replace(/\s+/g, '');
  const bin = atob(clean);
  const bytes = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) bytes[i] = bin.charCodeAt(i);
  return bytes.buffer;
}

async function getGooglePlayAccessToken(serviceAccountJson) {
  const sa = typeof serviceAccountJson === 'string' ? JSON.parse(serviceAccountJson) : serviceAccountJson;
  const now = Math.floor(Date.now() / 1000);
  const header = b64Url(JSON.stringify({ alg: 'RS256', typ: 'JWT' }));
  const claim = b64Url(
    JSON.stringify({
      iss: sa.client_email,
      scope: 'https://www.googleapis.com/auth/androidpublisher',
      aud: 'https://oauth2.googleapis.com/token',
      iat: now,
      exp: now + 3600
    })
  );
  const signingInput = `${header}.${claim}`;
  const key = await crypto.subtle.importKey(
    'pkcs8',
    pemToArrayBuffer(sa.private_key),
    { name: 'RSASSA-PKCS1-v1_5', hash: 'SHA-256' },
    false,
    ['sign']
  );
  const sig = await crypto.subtle.sign(
    'RSASSA-PKCS1-v1_5',
    key,
    new TextEncoder().encode(signingInput)
  );
  const jwt = `${signingInput}.${b64Url(sig)}`;

  const tokenRes = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      grant_type: 'urn:ietf:params:oauth:grant-type:jwt-bearer',
      assertion: jwt
    })
  });
  if (!tokenRes.ok) {
    throw new Error('Failed to authenticate with Google Play API');
  }
  const tokenData = await tokenRes.json();
  return tokenData.access_token;
}

export async function onRequestPost({ request, env }) {
  try {
    const { purchaseToken } = await request.json();
    if (!purchaseToken) {
      return json({ error: 'Missing purchaseToken' }, 400);
    }
    if (!env.GOOGLE_PLAY_SERVICE_ACCOUNT_JSON) {
      return json({ error: 'Google Play verification is not configured on server yet' }, 503);
    }

    const accessToken = await getGooglePlayAccessToken(env.GOOGLE_PLAY_SERVICE_ACCOUNT_JSON);
    const verifyUrl = `https://androidpublisher.googleapis.com/androidpublisher/v3/applications/${PACKAGE_NAME}/purchases/subscriptionsv2/tokens/${encodeURIComponent(purchaseToken)}`;

    const playRes = await fetch(verifyUrl, {
      headers: { Authorization: `Bearer ${accessToken}` }
    });
    if (!playRes.ok) {
      return json({ error: 'Invalid or expired Google Play purchase' }, 402);
    }

    const sub = await playRes.json();
    const state = sub.subscriptionState;
    const isActive =
      state === 'SUBSCRIPTION_STATE_ACTIVE' ||
      state === 'SUBSCRIPTION_STATE_IN_GRACE_PERIOD';

    if (!isActive) {
      return json({ error: 'Subscription is not active', state }, 402);
    }

    const user = await getSessionUser(request, env);
    if (user && env.DB) {
      await env.DB.prepare(
        'UPDATE users SET is_pro = 1, pro_source = ?, updated_at = ? WHERE sub = ?'
      )
        .bind('google_play', new Date().toISOString(), user.sub)
        .run();
    }

    const proToken = await signToken(
      { pro: true, source: 'google_play', exp: Date.now() + 1000 * 60 * 60 * 24 * 35 },
      env
    );

    return json(
      { ok: true, isPro: true, state, syncedToAccount: Boolean(user) },
      200,
      { 'Set-Cookie': makeCookie('hk_pro', proToken, 60 * 60 * 24 * 35) }
    );
  } catch (e) {
    return json({ error: e.message || 'Verification failed' }, 500);
  }
}
