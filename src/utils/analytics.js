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

function classifyReferrer(rawRef) {
  if (!rawRef) return { referrer: 'Direct / Bookmark', searchTerm: null };
  try {
    const url = new URL(rawRef);
    if (url.hostname === window.location.hostname) {
      return { referrer: 'Direct / Bookmark', searchTerm: null };
    }
    const host = url.hostname.replace(/^www\./, '').toLowerCase();
    const q =
      url.searchParams.get('q') ||
      url.searchParams.get('p') ||
      url.searchParams.get('query') ||
      url.searchParams.get('text') ||
      null;

    if (host.includes('google.')) return { referrer: 'Google Search', searchTerm: q };
    if (host.includes('bing.com')) return { referrer: 'Bing Search', searchTerm: q };
    if (host.includes('duckduckgo.com')) return { referrer: 'DuckDuckGo', searchTerm: q };
    if (host.includes('yahoo.')) return { referrer: 'Yahoo Search', searchTerm: q };
    if (host.includes('yandex.')) return { referrer: 'Yandex', searchTerm: q };
    if (host === 'l.facebook.com' || host.endsWith('facebook.com') || host === 'fb.me') {
      return { referrer: 'Facebook', searchTerm: null };
    }
    if (host.includes('instagram.com')) return { referrer: 'Instagram', searchTerm: null };
    if (host.includes('whatsapp.com') || host === 'wa.me') return { referrer: 'WhatsApp', searchTerm: null };
    if (host.includes('youtube.com') || host === 'youtu.be') return { referrer: 'YouTube', searchTerm: null };
    if (host.includes('tiktok.com')) return { referrer: 'TikTok', searchTerm: null };
    if (host === 't.co' || host.includes('twitter.com') || host === 'x.com') {
      return { referrer: 'X / Twitter', searchTerm: null };
    }
    return { referrer: host, searchTerm: q };
  } catch {
    return { referrer: 'Direct / Bookmark', searchTerm: null };
  }
}

export function getAcquisitionInfo() {
  try {
    const { referrer, searchTerm: refQuery } = classifyReferrer(document.referrer);
    const params = new URLSearchParams(window.location.search);
    const utmSource = params.get('utm_source') || '';
    const utmCampaign = params.get('utm_campaign') || '';
    const utmTerm = params.get('utm_term') || '';
    const combinedUtm = utmSource
      ? utmCampaign
        ? `${utmSource} (${utmCampaign})`
        : utmSource
      : null;

    return {
      referrer: utmSource && referrer === 'Direct / Bookmark' ? `Campaign: ${utmSource}` : referrer,
      searchTerm: (utmTerm || refQuery || '').trim() || null,
      utmSource: combinedUtm
    };
  } catch {
    return { referrer: 'Direct / Bookmark', searchTerm: null, utmSource: null };
  }
}

export function trackEvent(
  eventType,
  {
    activityId = null,
    isTouch = false,
    lang = 'he',
    referrer = null,
    searchTerm = null,
    utmSource = null,
    durationSec = null
  } = {}
) {
  try {
    const payload = JSON.stringify({
      eventType,
      activityId,
      deviceType: isTouch ? 'mobile' : 'desktop',
      lang,
      sessionId: getSessionId(),
      referrer,
      searchTerm,
      utmSource,
      durationSec
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
