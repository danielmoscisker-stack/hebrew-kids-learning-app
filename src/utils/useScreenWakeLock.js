import { useEffect, useRef } from 'react';

const DEFAULT_IDLE_MS = 3 * 60 * 1000; // Keep screen awake for 3 minutes of inactivity

/**
 * Keeps tablet/mobile screen from dimming while the child is thinking,
 * using the standard Screen Wake Lock API (iPadOS/iOS Safari 16.4+, Android Chrome).
 * Automatically releases after `idleMs` (3 minutes) of no interaction to protect battery,
 * and re-acquires cleanly on the next tap or tab return.
 */
export function useScreenWakeLock(idleMs = DEFAULT_IDLE_MS) {
  const sentinelRef = useRef(null);
  const idleTimerRef = useRef(null);
  const acquiringRef = useRef(false);

  useEffect(() => {
    if (typeof navigator === 'undefined' || !('wakeLock' in navigator)) return;

    let unmounted = false;

    const releaseWakeLock = async () => {
      if (sentinelRef.current) {
        try {
          const s = sentinelRef.current;
          sentinelRef.current = null;
          await s.release();
        } catch {
          // ignore
        }
      }
    };

    const scheduleIdleRelease = () => {
      if (idleTimerRef.current) clearTimeout(idleTimerRef.current);
      idleTimerRef.current = setTimeout(() => {
        releaseWakeLock();
      }, idleMs);
    };

    const acquireWakeLock = async () => {
      if (unmounted || acquiringRef.current) return;
      if (typeof document !== 'undefined' && document.visibilityState !== 'visible') return;
      if (sentinelRef.current && !sentinelRef.current.released) {
        scheduleIdleRelease();
        return;
      }

      acquiringRef.current = true;
      try {
        const sentinel = await navigator.wakeLock.request('screen');
        if (unmounted) {
          sentinel.release().catch(() => {});
          return;
        }
        sentinelRef.current = sentinel;
        sentinel.addEventListener('release', () => {
          if (sentinelRef.current === sentinel) {
            sentinelRef.current = null;
          }
        });
        scheduleIdleRelease();
      } catch {
        // Browser may require a user gesture first or low-battery mode may block wake lock
      } finally {
        acquiringRef.current = false;
      }
    };

    const onUserActivity = () => {
      acquireWakeLock();
    };

    const onVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        acquireWakeLock();
      } else {
        if (idleTimerRef.current) clearTimeout(idleTimerRef.current);
        releaseWakeLock();
      }
    };

    // Try acquiring immediately on load, and also on user interaction / tab return
    acquireWakeLock();

    const opts = { passive: true };
    window.addEventListener('pointerdown', onUserActivity, opts);
    window.addEventListener('touchstart', onUserActivity, opts);
    window.addEventListener('keydown', onUserActivity, opts);
    document.addEventListener('visibilitychange', onVisibilityChange);

    return () => {
      unmounted = true;
      if (idleTimerRef.current) clearTimeout(idleTimerRef.current);
      window.removeEventListener('pointerdown', onUserActivity);
      window.removeEventListener('touchstart', onUserActivity);
      window.removeEventListener('keydown', onUserActivity);
      document.removeEventListener('visibilitychange', onVisibilityChange);
      releaseWakeLock();
    };
  }, [idleMs]);
}
