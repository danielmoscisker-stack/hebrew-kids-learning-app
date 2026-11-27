// Optional Cloud Sync & Auth client (100% non-blocking; works offline via localStorage).
// Never forces login on children — parents can optionally sign in with Google in Parent Zone
// to back up progress across devices and tie Pro unlocks to their account.

let gisScriptPromise = null;

export function loadGoogleIdentityScript() {
  if (window.google?.accounts?.id) return Promise.resolve(true);
  if (gisScriptPromise) return gisScriptPromise;

  gisScriptPromise = new Promise((resolve) => {
    const script = document.createElement('script');
    script.src = 'https://accounts.google.com/gsi/client';
    script.async = true;
    script.defer = true;
    script.onload = () => resolve(Boolean(window.google?.accounts?.id));
    script.onerror = () => resolve(false);
    document.head.appendChild(script);
  });
  return gisScriptPromise;
}

export async function fetchServerConfig() {
  try {
    const res = await fetch('/api/config');
    if (!res.ok) return null;
    return await res.json();
  } catch {
    return null;
  }
}

export async function fetchCurrentSession() {
  try {
    const res = await fetch('/api/auth/me', { credentials: 'include' });
    if (!res.ok) return null;
    return await res.json();
  } catch {
    return null;
  }
}

export async function signInWithGoogleCredential(idToken) {
  const res = await fetch('/api/auth/google', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify({ idToken })
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Google sign-in failed');
  return data;
}

export async function signOutSession() {
  try {
    await fetch('/api/auth/logout', { method: 'POST', credentials: 'include' });
  } catch {
    // offline ignore
  }
}

export async function pushCloudProgress(payload) {
  try {
    const res = await fetch('/api/progress', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify(payload)
    });
    return res.ok;
  } catch {
    return false;
  }
}

export async function verifyPlayPurchase(purchaseToken, productId) {
  const res = await fetch('/api/pro/verify-play', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify({ purchaseToken, productId })
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Play verification failed');
  return data;
}
