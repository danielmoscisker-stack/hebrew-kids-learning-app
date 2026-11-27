// Privacy-safe first-party anonymous analytics (no cookies, no PII, zero third-party trackers).
// Uses an ephemeral sessionStorage ID to count sessions and popular games for the owner dashboard.

function getSessionId() {
  try {
    let sid = sessionStorage.getItem('hk_sid');
    if (!sid) {
      sid = `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`;
      sessionStorage.setItem('hk_sid', sid);
    }
    return sid;
  } catch {
    return 'anon';
  }
}

export function trackEvent(eventType, { activityId = null, isTouch = false, lang = 'he' } = {}) {
  try {
    const payload = JSON.stringify({
      eventType,
      activityId,
      deviceType: isTouch ? 'mobile' : 'desktop',
      lang,
      sessionId: getSessionId()
    });

    if (navigator.sendBeacon) {
      const blob = new Blob([payload], { type: 'application/json' });
      navigator.sendBeacon('/api/analytics/track', blob);
      return;
    }

    fetch('/api/analytics/track', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: payload,
      keepalive: true
    }).catch(() => {});
  } catch {
    // Offline / non-blocking
  }
}
