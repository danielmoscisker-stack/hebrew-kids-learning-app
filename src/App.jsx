import React, { useState, useEffect, useCallback, useRef } from 'react';
import Navbar from './components/Navbar';
import HomeHub from './components/HomeHub';
import KidCursor from './components/KidCursor';
import ParentModal from './components/ParentModal';
import ProUpgradeModal from './components/ProUpgradeModal';
import ProfilePickerModal from './components/ProfilePickerModal';
import AlphabetCards from './components/AlphabetCards';
import LetterQuiz from './components/LetterQuiz';
import ReadingTrain from './components/ReadingTrain';
import PupikDetective from './components/PupikDetective';
import VowelsWorld from './components/VowelsWorld';
import FirstWords from './components/FirstWords';
import NumbersWorld from './components/NumbersWorld';
import LetterTracer from './components/LetterTracer';
import MemoryGame from './components/MemoryGame';
import StickerPlayground from './components/StickerPlayground';
import OpeningSoundGame from './components/OpeningSoundGame';
import MathPlay from './components/MathPlay';
import IsraelMathArena from './components/IsraelMathArena';
import SchoolSkillArena from './components/SchoolSkillArena';
import EnglishLearnStudio from './components/EnglishLearnStudio';
import StarShop from './components/StarShop';
import HabitTracker from './components/HabitTracker';
import PlayTimeLockOverlay from './components/PlayTimeLockOverlay';
import FullscreenUnlockModal from './components/FullscreenUnlockModal';
import AccessibilityMenu from './components/AccessibilityMenu';
import { playSound, playPhraseAudio, setMuted } from './utils/audio';
import { useDeviceType } from './utils/useDeviceType';
import { useScreenWakeLock } from './utils/useScreenWakeLock';
import { fetchServerConfig, fetchCurrentSession, pushCloudProgress } from './utils/cloudSync';
import { trackEvent, getAcquisitionInfo } from './utils/analytics';
import { tr } from './utils/i18n';
import {
  todayStr,
  normalizeAge,
  createKidProfile,
  sanitizeProfilesList,
  loadLocalProfiles,
  saveLocalProfiles,
  loadLocalActiveProfileId,
  saveLocalActiveProfileId,
  touchProfileForToday
} from './utils/profiles';
import {
  getKidLimitKey,
  createDefaultKidLimitEntry,
  normalizeKidLimitEntry,
  loadLocalPlayLimits,
  saveLocalPlayLimits,
  mergePlayLimitsMaps,
  evaluatePlayLimit,
  localTodayStr
} from './utils/playLimits';
import {
  getLockKey,
  createPinRecord,
  loadLocalLocks,
  saveLocalLocks,
  mergeLocksMaps,
  loadLocalBiometrics,
  saveLocalBiometrics,
  registerBiometricForKid,
  isCurrentlyFullscreen,
  enterBrowserFullscreen,
  exitBrowserFullscreen
} from './utils/fullscreenLock';
import { getKidWelcome, speakPersonalText } from './utils/personalize';
import { getThemeBgClass } from './data/starShopData';
import {
  getShopKey,
  createDefaultShopEntry,
  normalizeShopEntry,
  loadLocalShopMap,
  saveLocalShopMap,
  mergeShopMaps
} from './utils/starShop';
import {
  getHabitKey,
  createDefaultHabitEntry,
  normalizeHabitEntry,
  loadLocalHabitMap,
  saveLocalHabitMap,
  mergeHabitMaps
} from './utils/habitTracker';

const APP_BUILD_TIME = import.meta.env.VITE_BUILD_TIME || new Date().toISOString();

function formatLastUpdated(iso, lang) {
  try {
    const date = new Date(iso);
    if (Number.isNaN(date.getTime())) return iso;
    const locale = lang === 'he' ? 'he-IL' : lang === 'es' ? 'es-ES' : 'en-GB';
    return new Intl.DateTimeFormat(locale, {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      hour12: false
    }).format(date);
  } catch {
    return iso;
  }
}

export default function App() {
  const [currentTab, setCurrentTab] = useState('home');
  const [lang, setLang] = useState(() => {
    try {
      const urlLang = new URLSearchParams(window.location.search).get('lang');
      if (urlLang === 'he' || urlLang === 'en' || urlLang === 'es') return urlLang;
      const saved = localStorage.getItem('hk_lang');
      return saved === 'en' || saved === 'es' ? saved : 'he';
    } catch {
      return 'he';
    }
  });
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [showParentModal, setShowParentModal] = useState(false);
  const [parentModalUnlocked, setParentModalUnlocked] = useState(false);
  const [showProModal, setShowProModal] = useState(false);
  const [showProfilePicker, setShowProfilePicker] = useState(false);
  const [proSkipGate, setProSkipGate] = useState(false);
  const [quizFocusLocked, setQuizFocusLocked] = useState(false);
  const [serverConfig, setServerConfig] = useState(null);
  const [user, setUser] = useState(null);
  const cloudHydratedRef = useRef(false);

  const [profiles, setProfiles] = useState(() => loadLocalProfiles());
  const [activeProfileId, setActiveProfileId] = useState(() => {
    const localList = loadLocalProfiles();
    const savedId = loadLocalActiveProfileId();
    if (savedId && localList.some((p) => p.id === savedId)) return savedId;
    return localList[0]?.id || null;
  });

  const activeProfile = profiles.find((p) => p.id === activeProfileId) || null;

  const [playLimitsMap, setPlayLimitsMap] = useState(() => loadLocalPlayLimits());
  const [playLimitsSyncNonce, setPlayLimitsSyncNonce] = useState(0);
  const playLimitsRef = useRef(playLimitsMap);

  const activeLimitKey = getKidLimitKey(activeProfileId);
  const activeLimitEntry = playLimitsMap[activeLimitKey] || createDefaultKidLimitEntry();
  const playLimitState = evaluatePlayLimit(activeLimitEntry);

  const [kidLocksMap, setKidLocksMap] = useState(() => loadLocalLocks());
  const [biometricsMap, setBiometricsMap] = useState(() => loadLocalBiometrics());
  const [fullscreenLockActive, setFullscreenLockActive] = useState(false);
  const [fullscreenEscaped, setFullscreenEscaped] = useState(false);
  const [showFullscreenUnlock, setShowFullscreenUnlock] = useState(false);

  const activeLockKey = getLockKey(activeProfileId);
  const activePinRecord = kidLocksMap[activeLockKey] || null;
  const activeBiometricRecord = biometricsMap[activeLockKey] || null;

  const [starShopMap, setStarShopMap] = useState(() => loadLocalShopMap());
  const activeShopKey = getShopKey(activeProfileId);
  const activeShopEntry = starShopMap[activeShopKey] || createDefaultShopEntry();
  const activeThemeBgClass = getThemeBgClass(activeShopEntry.equippedTheme);

  const [habitTrackersMap, setHabitTrackersMap] = useState(() => loadLocalHabitMap());
  const activeHabitKey = getHabitKey(activeProfileId);
  const activeHabitEntry = habitTrackersMap[activeHabitKey] || createDefaultHabitEntry();

  const [kidAge, setKidAge] = useState(() => {
    const localList = loadLocalProfiles();
    const savedId = loadLocalActiveProfileId();
    const initialProf = localList.find((p) => p.id === savedId) || localList[0];
    if (initialProf) return normalizeAge(initialProf.age);
    try {
      return normalizeAge(localStorage.getItem('hk_kid_age'));
    } catch {
      return 4;
    }
  });

  const [isPro, setIsPro] = useState(() => {
    try {
      return localStorage.getItem('kids_pro_unlocked') === 'true';
    } catch {
      return false;
    }
  });

  const [needsGenderPick, setNeedsGenderPick] = useState(() => {
    try {
      const localList = loadLocalProfiles();
      if (localList.length > 0) return false;
      return !localStorage.getItem('kid_gender');
    } catch {
      return false;
    }
  });

  const [gender, setGender] = useState(() => {
    const localList = loadLocalProfiles();
    const savedId = loadLocalActiveProfileId();
    const initialProf = localList.find((p) => p.id === savedId) || localList[0];
    if (initialProf) return initialProf.gender;
    try {
      return localStorage.getItem('kid_gender') || 'boy';
    } catch {
      return 'boy';
    }
  });

  const [kidCursorSize, setKidCursorSize] = useState(() => {
    try {
      const savedSize = localStorage.getItem('kid_cursor_size');
      if (savedSize === 'off' || savedSize === 'normal' || savedSize === 'large' || savedSize === 'huge') {
        return savedSize;
      }
      const legacy = localStorage.getItem('kid_cursor_enabled');
      return legacy === 'false' ? 'off' : 'large';
    } catch {
      return 'large';
    }
  });
  const kidCursorEnabled = kidCursorSize !== 'off';
  const setKidCursorEnabled = useCallback((val) => {
    setKidCursorSize(val ? 'large' : 'off');
  }, []);

  const [stars, setStars] = useState(() => {
    const localList = loadLocalProfiles();
    const savedId = loadLocalActiveProfileId();
    const initialProf = localList.find((p) => p.id === savedId) || localList[0];
    if (initialProf) return initialProf.stars;
    try {
      const saved = localStorage.getItem('kids_stars_total');
      return saved ? parseInt(saved, 10) : 5;
    } catch {
      return 5;
    }
  });

  const [streakDays, setStreakDays] = useState(() => {
    const localList = loadLocalProfiles();
    const savedId = loadLocalActiveProfileId();
    const initialProf = localList.find((p) => p.id === savedId) || localList[0];
    if (initialProf) return touchProfileForToday(initialProf).streakDays;
    try {
      const today = todayStr();
      const last = localStorage.getItem('kids_last_played');
      let streak = parseInt(localStorage.getItem('kids_streak_days') || '1', 10);
      if (last && last !== today) {
        const diffDays = Math.round((new Date(today) - new Date(last)) / 86400000);
        streak = diffDays === 1 ? streak + 1 : 1;
      }
      localStorage.setItem('kids_last_played', today);
      localStorage.setItem('kids_streak_days', String(streak));
      return streak;
    } catch {
      return 1;
    }
  });

  const [dailyStars, setDailyStars] = useState(() => {
    const localList = loadLocalProfiles();
    const savedId = loadLocalActiveProfileId();
    const initialProf = localList.find((p) => p.id === savedId) || localList[0];
    if (initialProf) return touchProfileForToday(initialProf).dailyStars;
    try {
      const today = todayStr();
      if (localStorage.getItem('kids_daily_date') === today) {
        return parseInt(localStorage.getItem('kids_daily_stars') || '0', 10);
      }
      localStorage.setItem('kids_daily_date', today);
      localStorage.setItem('kids_daily_stars', '0');
      return 0;
    } catch {
      return 0;
    }
  });

  useEffect(() => {
    saveLocalProfiles(profiles);
  }, [profiles]);

  useEffect(() => {
    saveLocalActiveProfileId(activeProfileId);
  }, [activeProfileId]);

  useEffect(() => {
    try {
      localStorage.setItem('hk_kid_age', String(kidAge));
    } catch {
      // ignore
    }
  }, [kidAge]);

  useEffect(() => {
    try {
      localStorage.setItem('kid_gender', gender);
    } catch {
      // ignore
    }
  }, [gender]);

  useEffect(() => {
    try {
      localStorage.setItem('kid_cursor_size', kidCursorSize);
      localStorage.setItem('kid_cursor_enabled', String(kidCursorEnabled));
    } catch {
      // ignore
    }
  }, [kidCursorSize, kidCursorEnabled]);

  useEffect(() => {
    try {
      localStorage.setItem('hk_lang', lang);
    } catch {
      // ignore
    }
  }, [lang]);

  useEffect(() => {
    try {
      localStorage.setItem('kids_pro_unlocked', String(isPro));
    } catch {
      // ignore
    }
  }, [isPro]);

  useEffect(() => {
    try {
      localStorage.setItem('kids_stars_total', String(stars));
      localStorage.setItem('kids_daily_stars', String(dailyStars));
    } catch {
      // ignore
    }
  }, [stars, dailyStars]);

  useEffect(() => {
    setMuted(!soundEnabled);
  }, [soundEnabled]);

  const applyProfileState = useCallback((profile) => {
    if (!profile) return;
    const touched = touchProfileForToday(profile);
    setActiveProfileId(touched.id);
    setStars(touched.stars);
    setDailyStars(touched.dailyStars);
    setStreakDays(touched.streakDays);
    setGender(touched.gender);
    setKidAge(normalizeAge(touched.age));
    setNeedsGenderPick(false);
    setProfiles((prev) => prev.map((p) => (p.id === touched.id ? touched : p)));
  }, []);

  useEffect(() => {
    playLimitsRef.current = playLimitsMap;
    saveLocalPlayLimits(playLimitsMap);
  }, [playLimitsMap]);

  useEffect(() => {
    saveLocalLocks(kidLocksMap);
  }, [kidLocksMap]);

  useEffect(() => {
    saveLocalBiometrics(biometricsMap);
  }, [biometricsMap]);

  useEffect(() => {
    saveLocalShopMap(starShopMap);
  }, [starShopMap]);

  useEffect(() => {
    saveLocalHabitMap(habitTrackersMap);
  }, [habitTrackersMap]);

  // Browser Fullscreen Lock guards: re-lock overlay if Esc/gesture exits fullscreen, block accidental Back/close
  useEffect(() => {
    if (!fullscreenLockActive) return undefined;

    const onFullscreenChange = () => {
      if (!isCurrentlyFullscreen()) {
        setFullscreenEscaped(true);
      }
    };

    const onBeforeUnload = (e) => {
      e.preventDefault();
      e.returnValue = '';
    };

    try {
      window.history.pushState({ hkFullscreenLock: true }, '');
    } catch {
      // ignore
    }

    const onPopState = () => {
      try {
        window.history.pushState({ hkFullscreenLock: true }, '');
      } catch {
        // ignore
      }
      setShowFullscreenUnlock(true);
    };

    document.addEventListener('fullscreenchange', onFullscreenChange);
    document.addEventListener('webkitfullscreenchange', onFullscreenChange);
    window.addEventListener('beforeunload', onBeforeUnload);
    window.addEventListener('popstate', onPopState);

    return () => {
      document.removeEventListener('fullscreenchange', onFullscreenChange);
      document.removeEventListener('webkitfullscreenchange', onFullscreenChange);
      window.removeEventListener('beforeunload', onBeforeUnload);
      window.removeEventListener('popstate', onPopState);
    };
  }, [fullscreenLockActive]);

  // Active play time counter: ticks 1s while visible, unlocked, and not paused in a parent/profile modal
  const timerPaused =
    !playLimitState.hasLimit ||
    playLimitState.isLocked ||
    showParentModal ||
    showProfilePicker ||
    showProModal ||
    fullscreenEscaped ||
    showFullscreenUnlock ||
    needsGenderPick;

  useEffect(() => {
    if (timerPaused) return undefined;
    const interval = setInterval(() => {
      if (document.visibilityState !== 'visible') return;
      const now = Date.now();
      const today = localTodayStr();
      setPlayLimitsMap((prev) => {
        const current = normalizeKidLimitEntry(prev[activeLimitKey], now);
        const nextEntry = {
          ...current,
          dailyDate: today,
          dailyUsedSec: (current.dailyUsedSec || 0) + 1,
          sessionUsedSec: (current.sessionUsedSec || 0) + 1,
          lastActiveAt: now
        };
        return { ...prev, [activeLimitKey]: nextEntry };
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [timerPaused, activeLimitKey]);

  // Stop any playing speech audio immediately when play time expires
  useEffect(() => {
    if (!playLimitState.isLocked) return;
    try {
      if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
    } catch {
      // ignore
    }
  }, [playLimitState.isLocked]);

  // Load optional Cloudflare config + session on startup (non-blocking)
  useEffect(() => {
    fetchServerConfig().then((cfg) => cfg && setServerConfig(cfg));
    fetchCurrentSession().then((sess) => {
      cloudHydratedRef.current = true;
      if (!sess) return;
      if (sess.isPro) setIsPro(true);
      if (sess.user) setUser(sess.user);
      if (sess.progress) {
        if (sess.progress.lang) setLang(sess.progress.lang);
        const d = sess.progress.data || {};
        if (d.kidCursorSize) setKidCursorSize(d.kidCursorSize);
        else if (typeof d.kidCursorEnabled === 'boolean') setKidCursorSize(d.kidCursorEnabled ? 'large' : 'off');
        if (d.playLimits && typeof d.playLimits === 'object') {
          setPlayLimitsMap((prev) => mergePlayLimitsMaps(prev, d.playLimits));
        }
        if (d.kidLocks && typeof d.kidLocks === 'object') {
          setKidLocksMap((prev) => mergeLocksMaps(prev, d.kidLocks));
        }
        if (d.starShop && typeof d.starShop === 'object') {
          setStarShopMap((prev) => mergeShopMaps(prev, d.starShop));
        }
        if (d.habitTrackers && typeof d.habitTrackers === 'object') {
          setHabitTrackersMap((prev) => mergeHabitMaps(prev, d.habitTrackers));
        }

        const cloudProfiles = sanitizeProfilesList(d.profiles);
        if (cloudProfiles.length > 0) {
          setProfiles(cloudProfiles);
          const preferredId =
            (d.activeProfileId && cloudProfiles.some((p) => p.id === d.activeProfileId) && d.activeProfileId) ||
            cloudProfiles[0].id;
          const picked = cloudProfiles.find((p) => p.id === preferredId) || cloudProfiles[0];
          const touched = touchProfileForToday(picked);
          setActiveProfileId(touched.id);
          setStars(touched.stars);
          setDailyStars(touched.dailyStars);
          setStreakDays(touched.streakDays);
          setGender(touched.gender);
          setKidAge(normalizeAge(touched.age));
          setNeedsGenderPick(false);

          // Prompt kid to choose their profile once per browser session when logged in with Google
          try {
            if (sess.user && !sessionStorage.getItem('hk_profile_picked')) {
              setShowProfilePicker(true);
            }
          } catch {
            // ignore
          }
        } else {
          setStars((prev) => Math.max(prev, sess.progress.stars || 0));
          if (sess.progress.streakDays) setStreakDays((prev) => Math.max(prev, sess.progress.streakDays));
          if (sess.progress.gender) setGender(sess.progress.gender);
          if (d.kidAge) setKidAge(normalizeAge(d.kidAge));
        }
      }
    });
  }, []);

  // Bucketed usage checkpoint (every 30s) so cloud backup syncs play usage without firing every second
  const usageCloudBucket = Math.floor((activeLimitEntry.dailyUsedSec || 0) / 30);

  // Debounced cloud progress backup when signed in
  useEffect(() => {
    if (!user || !cloudHydratedRef.current) return;
    const t = setTimeout(() => {
      pushCloudProgress({
        stars,
        gender,
        lang,
        streakDays,
        lastPlayed: todayStr(),
        data: {
          kidCursorEnabled,
          kidCursorSize,
          kidAge,
          profiles,
          activeProfileId,
          playLimits: playLimitsRef.current,
          kidLocks: kidLocksMap,
          starShop: starShopMap,
          habitTrackers: habitTrackersMap
        }
      });
    }, 900);
    return () => clearTimeout(t);
  }, [
    user,
    stars,
    gender,
    lang,
    streakDays,
    kidCursorEnabled,
    kidCursorSize,
    kidAge,
    profiles,
    activeProfileId,
    playLimitsSyncNonce,
    usageCloudBucket,
    playLimitState.isLocked,
    kidLocksMap,
    starShopMap,
    habitTrackersMap
  ]);

  const { isTouch } = useDeviceType();
  // Keep tablet/phone screens from dimming while thinking (releases after 3 minutes of inactivity)
  useScreenWakeLock(3 * 60 * 1000);

  // Track initial page_view & acquisition source (privacy-safe, zero cookies)
  useEffect(() => {
    const acq = getAcquisitionInfo();
    trackEvent('page_view', { isTouch, lang, ...acq });
  }, []);

  // Track activity_start & active time spent per activity/session
  useEffect(() => {
    if (currentTab !== 'home') {
      trackEvent('activity_start', { activityId: currentTab, isTouch, lang });
    }

    let activeStart = document.visibilityState === 'visible' ? Date.now() : null;
    const flushTime = () => {
      if (!activeStart) return;
      const secs = Math.round((Date.now() - activeStart) / 1000);
      activeStart = document.visibilityState === 'visible' ? Date.now() : null;
      if (secs >= 2) {
        trackEvent('session_time', {
          activityId: currentTab,
          isTouch,
          lang,
          durationSec: secs
        });
      }
    };

    const onVisibility = () => {
      if (document.visibilityState === 'hidden') {
        flushTime();
      } else if (!activeStart) {
        activeStart = Date.now();
      }
    };

    document.addEventListener('visibilitychange', onVisibility);
    window.addEventListener('pagehide', flushTime);
    return () => {
      flushTime();
      document.removeEventListener('visibilitychange', onVisibility);
      window.removeEventListener('pagehide', flushTime);
    };
  }, [currentTab, isTouch, lang]);

  // Android native integration: back button returns to Home Hub, StatusBar & SplashScreen setup
  useEffect(() => {
    let removeBackListener = null;
    (async () => {
      try {
        const { Capacitor } = await import('@capacitor/core');
        if (!Capacitor.isNativePlatform()) return;
        const { SplashScreen } = await import('@capacitor/splash-screen');
        const { StatusBar, Style } = await import('@capacitor/status-bar');
        const { App: CapApp } = await import('@capacitor/app');
        StatusBar.setStyle({ style: Style.Light }).catch(() => {});
        StatusBar.setBackgroundColor({ color: '#FFFBEB' }).catch(() => {});
        SplashScreen.hide().catch(() => {});
        const handle = await CapApp.addListener('backButton', ({ canGoBack }) => {
          setCurrentTab((tab) => {
            if (tab !== 'home') return 'home';
            if (!canGoBack) CapApp.exitApp();
            return tab;
          });
        });
        removeBackListener = () => handle.remove();
      } catch {
        // Web mode
      }
    })();
    return () => {
      if (removeBackListener) removeBackListener();
    };
  }, []);

  // Automatically read out instructions for a 4-year-old child whenever they enter any activity
  useEffect(() => {
    if (!soundEnabled || currentTab === 'home' || lang !== 'he') return;
    const tabInstructions = {
      letters: isTouch ? 'inst_letters_touch' : 'inst_letters_mouse',
      quiz: isTouch ? 'inst_quiz_cards_touch' : 'inst_quiz_cards_mouse',
      train: 'inst_train',
      detective: 'inst_detective',
      vowels: isTouch ? 'inst_vowels_touch' : 'inst_vowels_mouse',
      first_words: isTouch ? 'inst_first_words_touch' : 'inst_first_words_mouse',
      numbers: isTouch ? 'inst_numbers_touch' : 'inst_numbers_mouse',
      tracing: isTouch ? 'inst_tracing_touch' : 'inst_tracing_mouse',
      memory: 'inst_memory',
      stickers: 'inst_stickers',
      opening_sound: 'inst_opening_sound',
      math_play: 'inst_math_play'
    };

    const instKey = tabInstructions[currentTab];
    if (instKey) {
      const timer = setTimeout(() => {
        playPhraseAudio(instKey, gender);
      }, 400);
      return () => clearTimeout(timer);
    }
  }, [currentTab, soundEnabled, gender, isTouch, lang]);

  const handleEarnStar = (amount = 1) => {
    setStars((prev) => prev + amount);
    setDailyStars((prev) => prev + amount);
    if (activeProfileId) {
      const today = todayStr();
      setProfiles((prev) =>
        prev.map((p) =>
          p.id === activeProfileId
            ? {
                ...p,
                stars: (p.stars || 0) + amount,
                dailyStars: (p.dailyDate === today ? p.dailyStars || 0 : 0) + amount,
                dailyDate: today,
                lastPlayed: today
              }
            : p
        )
      );
    }
    trackEvent('star_earned', { activityId: currentTab, isTouch, lang });
  };

  const handleChangeAge = useCallback(
    (nextAge) => {
      const safeAge = normalizeAge(nextAge);
      setKidAge(safeAge);
      if (activeProfileId) {
        setProfiles((prev) => prev.map((p) => (p.id === activeProfileId ? { ...p, age: safeAge } : p)));
      }
    },
    [activeProfileId]
  );

  const handleSelectProfile = useCallback(
    (profileId) => {
      const target = profiles.find((p) => p.id === profileId);
      if (!target) return;
      if (target.id !== activeProfileId) {
        setCurrentTab('home');
      }
      applyProfileState(target);
      if (soundEnabled && target.name) {
        setTimeout(() => speakPersonalText(getKidWelcome(target.name, lang, target.gender), lang), 180);
      }
      try {
        sessionStorage.setItem('hk_profile_picked', target.id);
      } catch {
        // ignore
      }
    },
    [profiles, activeProfileId, applyProfileState, soundEnabled, lang]
  );

  const handleSaveProfile = useCallback(
    ({ id, name, age, gender: profGender, avatar }) => {
      const safeAge = normalizeAge(age);
      const safeGender = profGender === 'girl' ? 'girl' : 'boy';

      if (id) {
        setProfiles((prev) =>
          prev.map((p) =>
            p.id === id ? { ...p, name, age: safeAge, gender: safeGender, avatar } : p
          )
        );
        if (id === activeProfileId) {
          setKidAge(safeAge);
          setGender(safeGender);
        }
        return;
      }

      // First profile inherits existing guest progress; subsequent siblings start fresh
      const isFirst = profiles.length === 0;
      const created = createKidProfile({
        name,
        age: safeAge,
        gender: safeGender,
        avatar,
        stars: isFirst ? stars : 5,
        dailyStars: isFirst ? dailyStars : 0,
        streakDays: isFirst ? streakDays : 1
      });

      setProfiles((prev) => [...prev, created]);
      setActiveProfileId(created.id);
      setStars(created.stars);
      setDailyStars(created.dailyStars);
      setStreakDays(created.streakDays);
      setGender(created.gender);
      setKidAge(created.age);
      setNeedsGenderPick(false);
      if (soundEnabled && created.name) {
        setTimeout(() => speakPersonalText(getKidWelcome(created.name, lang, created.gender), lang), 220);
      }
      try {
        sessionStorage.setItem('hk_profile_picked', created.id);
      } catch {
        // ignore
      }
    },
    [activeProfileId, profiles.length, stars, dailyStars, streakDays, soundEnabled, lang]
  );

  const handleDeleteProfile = useCallback(
    (profileId) => {
      const remaining = profiles.filter((p) => p.id !== profileId);
      setProfiles(remaining);
      if (profileId === activeProfileId) {
        if (remaining.length > 0) {
          applyProfileState(remaining[0]);
        } else {
          setActiveProfileId(null);
        }
      }
    },
    [profiles, activeProfileId, applyProfileState]
  );

  const handlePickGender = (picked) => {
    setGender(picked);
    setNeedsGenderPick(false);
    playSound('star');
    if (soundEnabled) {
      setTimeout(() => playPhraseAudio('welcome_home', picked), 150);
    }
  };

  const handleUpdatePlayLimits = useCallback(
    ({ dailyLimitMin, sessionLimitMin }) => {
      const now = Date.now();
      setPlayLimitsMap((prev) => {
        const cur = normalizeKidLimitEntry(prev[activeLimitKey], now);
        return {
          ...prev,
          [activeLimitKey]: {
            ...cur,
            dailyLimitMin: dailyLimitMin || null,
            sessionLimitMin: sessionLimitMin || null,
            dailyDate: localTodayStr(),
            lastActiveAt: now
          }
        };
      });
      setPlayLimitsSyncNonce((n) => n + 1);
    },
    [activeLimitKey]
  );

  const handleGrantBonusMinutes = useCallback(
    (mins) => {
      const addSec = Math.max(1, Number(mins) || 5) * 60;
      const now = Date.now();
      setPlayLimitsMap((prev) => {
        const cur = normalizeKidLimitEntry(prev[activeLimitKey], now);
        return {
          ...prev,
          [activeLimitKey]: {
            ...cur,
            bonusDailySec: cur.dailyLimitMin ? (cur.bonusDailySec || 0) + addSec : cur.bonusDailySec || 0,
            bonusSessionSec: cur.sessionLimitMin ? (cur.bonusSessionSec || 0) + addSec : cur.bonusSessionSec || 0,
            lastActiveAt: now
          }
        };
      });
      setPlayLimitsSyncNonce((n) => n + 1);
    },
    [activeLimitKey]
  );

  const handleResetSessionTimer = useCallback(() => {
    const now = Date.now();
    setPlayLimitsMap((prev) => {
      const cur = normalizeKidLimitEntry(prev[activeLimitKey], now);
      return {
        ...prev,
        [activeLimitKey]: {
          ...cur,
          sessionUsedSec: 0,
          bonusSessionSec: 0,
          lastActiveAt: now
        }
      };
    });
    setPlayLimitsSyncNonce((n) => n + 1);
  }, [activeLimitKey]);

  const handleResetTodayUsage = useCallback(() => {
    const now = Date.now();
    setPlayLimitsMap((prev) => {
      const cur = normalizeKidLimitEntry(prev[activeLimitKey], now);
      return {
        ...prev,
        [activeLimitKey]: {
          ...cur,
          dailyDate: localTodayStr(),
          dailyUsedSec: 0,
          sessionUsedSec: 0,
          bonusDailySec: 0,
          bonusSessionSec: 0,
          lastActiveAt: now
        }
      };
    });
    setPlayLimitsSyncNonce((n) => n + 1);
  }, [activeLimitKey]);

  const handleSavePin = useCallback(
    async (pin) => {
      const record = await createPinRecord(pin);
      setKidLocksMap((prev) => ({ ...prev, [activeLockKey]: record }));
    },
    [activeLockKey]
  );

  const handleClearPin = useCallback(() => {
    setKidLocksMap((prev) => {
      const next = { ...prev };
      delete next[activeLockKey];
      return next;
    });
  }, [activeLockKey]);

  const handleEnableBiometric = useCallback(async () => {
    const bio = await registerBiometricForKid(activeLockKey, activeProfile?.name || 'Parent');
    setBiometricsMap((prev) => ({ ...prev, [activeLockKey]: bio }));
  }, [activeLockKey, activeProfile?.name]);

  const handleDisableBiometric = useCallback(() => {
    setBiometricsMap((prev) => {
      const next = { ...prev };
      delete next[activeLockKey];
      return next;
    });
  }, [activeLockKey]);

  const handleEnterFullscreenLock = useCallback(async () => {
    if (!activePinRecord && !activeBiometricRecord?.credIdB64) {
      setParentModalUnlocked(false);
      setShowParentModal(true);
      return;
    }
    await enterBrowserFullscreen();
    setFullscreenLockActive(true);
    setFullscreenEscaped(false);
    setShowFullscreenUnlock(false);
  }, [activePinRecord, activeBiometricRecord?.credIdB64]);

  const handleUnlockFullscreen = useCallback(async () => {
    setFullscreenLockActive(false);
    setFullscreenEscaped(false);
    setShowFullscreenUnlock(false);
    await exitBrowserFullscreen();
  }, []);

  const handleReturnToFullscreen = useCallback(async () => {
    await enterBrowserFullscreen();
    setFullscreenEscaped(false);
  }, []);

  const handleBuyShopItem = useCallback(
    (item) => {
      if (!item || stars < item.price) return;
      const nextStars = Math.max(0, stars - item.price);
      setStars(nextStars);
      if (activeProfileId) {
        setProfiles((prev) =>
          prev.map((p) =>
            p.id === activeProfileId
              ? {
                  ...p,
                  stars: nextStars,
                  avatar: item.category === 'avatars' ? item.icon : p.avatar
                }
              : p
          )
        );
      }

      setStarShopMap((prev) => {
        const cur = normalizeShopEntry(prev[activeShopKey]);
        const ownedIds = cur.ownedIds.includes(item.id) ? cur.ownedIds : [...cur.ownedIds, item.id];
        return {
          ...prev,
          [activeShopKey]: normalizeShopEntry({
            ...cur,
            ownedIds,
            equippedAvatar: item.category === 'avatars' ? item.icon : cur.equippedAvatar,
            equippedTheme: item.category === 'themes' ? item.id : cur.equippedTheme,
            equippedPet: item.category === 'pets' ? item.id : cur.equippedPet,
            equippedBadge: item.category === 'badges' ? item.id : cur.equippedBadge,
            wishlistId: cur.wishlistId === item.id ? null : cur.wishlistId
          })
        };
      });
      trackEvent('shop_purchase', { itemId: item.id, category: item.category, price: item.price, lang });
    },
    [stars, activeProfileId, activeShopKey, lang]
  );

  const handleEquipShopItem = useCallback(
    (item) => {
      if (!item) return;
      if (item.category === 'avatars' && activeProfileId) {
        setProfiles((prev) =>
          prev.map((p) => (p.id === activeProfileId ? { ...p, avatar: item.icon } : p))
        );
      }
      setStarShopMap((prev) => {
        const cur = normalizeShopEntry(prev[activeShopKey]);
        if (!cur.ownedIds.includes(item.id)) return prev;
        return {
          ...prev,
          [activeShopKey]: normalizeShopEntry({
            ...cur,
            equippedAvatar: item.category === 'avatars' ? item.icon : cur.equippedAvatar,
            equippedTheme: item.category === 'themes' ? item.id : cur.equippedTheme,
            equippedPet:
              item.category === 'pets' ? (cur.equippedPet === item.id ? null : item.id) : cur.equippedPet,
            equippedBadge:
              item.category === 'badges' ? (cur.equippedBadge === item.id ? null : item.id) : cur.equippedBadge
          })
        };
      });
    },
    [activeProfileId, activeShopKey]
  );

  const handleSetWishlist = useCallback(
    (itemId) => {
      setStarShopMap((prev) => {
        const cur = normalizeShopEntry(prev[activeShopKey]);
        return {
          ...prev,
          [activeShopKey]: {
            ...cur,
            wishlistId: itemId || null
          }
        };
      });
    },
    [activeShopKey]
  );

  const applyHabitApprovalDelta = (goals, habitId, delta) =>
    (goals || []).map((g) => {
      if (g.claimed) return g;
      const countsThis = !g.habitIds || g.habitIds.length === 0 || g.habitIds.includes(habitId);
      if (!countsThis) return g;
      return { ...g, currentCount: Math.max(0, (g.currentCount || 0) + delta) };
    });

  const handleKidToggleHabit = useCallback(
    (habit, dateStr) => {
      if (!habit) return;
      const mode =
        activeHabitEntry.trackingMode || (activeHabitEntry.requireParentApproval === false ? 'kid_self' : 'parent_approval');
      if (mode === 'adult_only') return;
      const requireApproval = mode !== 'kid_self';
      let earnedStars = 0;

      setHabitTrackersMap((prev) => {
        const cur = normalizeHabitEntry(prev[activeHabitKey]);
        const day = cur.logs[dateStr] || { approvedIds: [], pendingIds: [], bedtime: '' };
        if (day.approvedIds.includes(habit.id)) return prev;

        if (!requireApproval) {
          earnedStars = habit.stars || 2;
          return {
            ...prev,
            [activeHabitKey]: {
              ...cur,
              logs: {
                ...cur.logs,
                [dateStr]: {
                  ...day,
                  approvedIds: [...day.approvedIds, habit.id],
                  pendingIds: day.pendingIds.filter((id) => id !== habit.id)
                }
              },
              goals: applyHabitApprovalDelta(cur.goals, habit.id, 1)
            }
          };
        }

        const alreadyPending = day.pendingIds.includes(habit.id);
        return {
          ...prev,
          [activeHabitKey]: {
            ...cur,
            logs: {
              ...cur.logs,
              [dateStr]: {
                ...day,
                pendingIds: alreadyPending
                  ? day.pendingIds.filter((id) => id !== habit.id)
                  : [...day.pendingIds, habit.id]
              }
            }
          }
        };
      });

      if (earnedStars > 0) {
        handleEarnStar(earnedStars);
      }
    },
    [activeHabitKey, activeHabitEntry.trackingMode, activeHabitEntry.requireParentApproval, handleEarnStar]
  );

  const handleParentApproveHabit = useCallback(
    (habit, dateStr) => {
      if (!habit) return;
      const dayLog = activeHabitEntry.logs?.[dateStr] || { approvedIds: [] };
      const wasApproved = dayLog.approvedIds.includes(habit.id);
      const starReward = habit.stars || 2;

      setHabitTrackersMap((prev) => {
        const cur = normalizeHabitEntry(prev[activeHabitKey]);
        const day = cur.logs[dateStr] || { approvedIds: [], pendingIds: [], bedtime: '' };
        const nextApproved = wasApproved
          ? day.approvedIds.filter((id) => id !== habit.id)
          : [...day.approvedIds, habit.id];
        return {
          ...prev,
          [activeHabitKey]: {
            ...cur,
            logs: {
              ...cur.logs,
              [dateStr]: {
                ...day,
                approvedIds: nextApproved,
                pendingIds: day.pendingIds.filter((id) => id !== habit.id)
              }
            },
            goals: applyHabitApprovalDelta(cur.goals, habit.id, wasApproved ? -1 : 1)
          }
        };
      });

      if (!wasApproved) {
        handleEarnStar(starReward);
      } else {
        setStars((s) => Math.max(0, s - starReward));
        if (activeProfileId) {
          setProfiles((prev) =>
            prev.map((p) =>
              p.id === activeProfileId ? { ...p, stars: Math.max(0, (p.stars || 0) - starReward) } : p
            )
          );
        }
      }
    },
    [activeHabitKey, activeHabitEntry.logs, activeProfileId, handleEarnStar]
  );

  const handleParentApproveAllPending = useCallback(
    (dateStr) => {
      const dayLog = activeHabitEntry.logs?.[dateStr] || { approvedIds: [], pendingIds: [] };
      const toApprove = dayLog.pendingIds.filter((id) => !dayLog.approvedIds.includes(id));
      if (toApprove.length === 0) return;

      let totalStars = 0;
      for (const hid of toApprove) {
        const h = activeHabitEntry.habits.find((x) => x.id === hid);
        totalStars += h?.stars || 2;
      }

      setHabitTrackersMap((prev) => {
        const cur = normalizeHabitEntry(prev[activeHabitKey]);
        const day = cur.logs[dateStr] || { approvedIds: [], pendingIds: [], bedtime: '' };
        let nextGoals = cur.goals;
        for (const hid of toApprove) {
          nextGoals = applyHabitApprovalDelta(nextGoals, hid, 1);
        }
        return {
          ...prev,
          [activeHabitKey]: {
            ...cur,
            logs: {
              ...cur.logs,
              [dateStr]: {
                ...day,
                approvedIds: [...new Set([...day.approvedIds, ...toApprove])],
                pendingIds: []
              }
            },
            goals: nextGoals
          }
        };
      });

      if (totalStars > 0) {
        handleEarnStar(totalStars);
      }
    },
    [activeHabitKey, activeHabitEntry.logs, activeHabitEntry.habits, handleEarnStar]
  );

  const handleSetBedtime = useCallback(
    (dateStr, bedtime) => {
      setHabitTrackersMap((prev) => {
        const cur = normalizeHabitEntry(prev[activeHabitKey]);
        const day = cur.logs[dateStr] || { approvedIds: [], pendingIds: [], bedtime: '' };
        return {
          ...prev,
          [activeHabitKey]: {
            ...cur,
            logs: {
              ...cur.logs,
              [dateStr]: { ...day, bedtime }
            }
          }
        };
      });
    },
    [activeHabitKey]
  );

  const handleAddHabit = useCallback(
    ({ icon, title, stars: habitStars }) => {
      const newHabit = {
        id: `hab_${Date.now()}`,
        icon: icon || '⭐',
        stars: habitStars || 2,
        titleHe: title,
        titleEn: title,
        titleEs: title
      };
      setHabitTrackersMap((prev) => {
        const cur = normalizeHabitEntry(prev[activeHabitKey]);
        return {
          ...prev,
          [activeHabitKey]: { ...cur, habits: [...cur.habits, newHabit] }
        };
      });
    },
    [activeHabitKey]
  );

  const handleDeleteHabit = useCallback(
    (habitId) => {
      setHabitTrackersMap((prev) => {
        const cur = normalizeHabitEntry(prev[activeHabitKey]);
        return {
          ...prev,
          [activeHabitKey]: { ...cur, habits: cur.habits.filter((h) => h.id !== habitId) }
        };
      });
    },
    [activeHabitKey]
  );

  const handleSetTrackingMode = useCallback(
    (nextMode) => {
      setHabitTrackersMap((prev) => {
        const cur = normalizeHabitEntry(prev[activeHabitKey]);
        return {
          ...prev,
          [activeHabitKey]: normalizeHabitEntry({
            ...cur,
            trackingMode: nextMode,
            requireParentApproval: nextMode !== 'kid_self'
          })
        };
      });
    },
    [activeHabitKey]
  );

  const handleAddHabitGoal = useCallback(
    ({ icon, title, targetCount, habitIds }) => {
      const newGoal = {
        id: `goal_${Date.now()}`,
        icon: icon || '🎁',
        title,
        targetCount: Math.max(1, Number(targetCount) || 10),
        currentCount: 0,
        habitIds: Array.isArray(habitIds) ? habitIds : [],
        claimed: false,
        createdAt: new Date().toISOString()
      };
      setHabitTrackersMap((prev) => {
        const cur = normalizeHabitEntry(prev[activeHabitKey]);
        return {
          ...prev,
          [activeHabitKey]: { ...cur, goals: [newGoal, ...cur.goals] }
        };
      });
    },
    [activeHabitKey]
  );

  const handleClaimHabitGoal = useCallback(
    (goalId) => {
      setHabitTrackersMap((prev) => {
        const cur = normalizeHabitEntry(prev[activeHabitKey]);
        return {
          ...prev,
          [activeHabitKey]: {
            ...cur,
            goals: cur.goals.map((g) => (g.id === goalId ? { ...g, claimed: true } : g))
          }
        };
      });
    },
    [activeHabitKey]
  );

  const handleDeleteHabitGoal = useCallback(
    (goalId) => {
      setHabitTrackersMap((prev) => {
        const cur = normalizeHabitEntry(prev[activeHabitKey]);
        return {
          ...prev,
          [activeHabitKey]: {
            ...cur,
            goals: cur.goals.filter((g) => g.id !== goalId)
          }
        };
      });
    },
    [activeHabitKey]
  );

  const handleAuthSuccess = useCallback((result) => {
    cloudHydratedRef.current = true;
    trackEvent('google_signin', { isTouch, lang });
    if (result?.user) {
      setUser(result.user);
      if (result.user.isPro) setIsPro(true);
    }
    if (result?.progress) {
      if (result.progress.lang) setLang(result.progress.lang);
      const d = result.progress.data || {};
      if (d.kidCursorSize) setKidCursorSize(d.kidCursorSize);
      else if (typeof d.kidCursorEnabled === 'boolean') setKidCursorSize(d.kidCursorEnabled ? 'large' : 'off');
      if (d.playLimits && typeof d.playLimits === 'object') {
        setPlayLimitsMap((prev) => mergePlayLimitsMaps(prev, d.playLimits));
      }
      if (d.kidLocks && typeof d.kidLocks === 'object') {
        setKidLocksMap((prev) => mergeLocksMaps(prev, d.kidLocks));
      }
      if (d.starShop && typeof d.starShop === 'object') {
        setStarShopMap((prev) => mergeShopMaps(prev, d.starShop));
      }
      if (d.habitTrackers && typeof d.habitTrackers === 'object') {
        setHabitTrackersMap((prev) => mergeHabitMaps(prev, d.habitTrackers));
      }

      const cloudProfiles = sanitizeProfilesList(d.profiles);
      if (cloudProfiles.length > 0) {
        setProfiles(cloudProfiles);
        const preferredId =
          (d.activeProfileId && cloudProfiles.some((p) => p.id === d.activeProfileId) && d.activeProfileId) ||
          cloudProfiles[0].id;
        const picked = cloudProfiles.find((p) => p.id === preferredId) || cloudProfiles[0];
        const touched = touchProfileForToday(picked);
        setActiveProfileId(touched.id);
        setStars(touched.stars);
        setDailyStars(touched.dailyStars);
        setStreakDays(touched.streakDays);
        setGender(touched.gender);
        setKidAge(normalizeAge(touched.age));
        setNeedsGenderPick(false);
      } else {
        setStars((prev) => Math.max(prev, result.progress.stars || 0));
        if (result.progress.gender) setGender(result.progress.gender);
        if (d.kidAge) setKidAge(normalizeAge(d.kidAge));
      }
    }

    // Always prompt to pick (or create) a kid profile right after logging in with Google
    try {
      sessionStorage.removeItem('hk_profile_picked');
    } catch {
      // ignore
    }
    setShowProfilePicker(true);
  }, []);

  const isHe = lang === 'he';
  const isQuizTab = currentTab === 'quiz';
  const hideChrome = isQuizTab && quizFocusLocked && !playLimitState.isLocked;

  useEffect(() => {
    document.documentElement.lang = lang;
    document.documentElement.dir = isHe ? 'rtl' : 'ltr';
    document.title =
      lang === 'en'
        ? 'Kids Hebrew, Math & English (Ages 4–9) | Educational Learning Games'
        : lang === 'es'
          ? 'Hebreo, Mates e Inglés para Niños (Edades 4–9) | Juegos Educativos'
          : 'אלף-בית, חשבון ואנגלית לילדים (גילאי 4–9) | משחקי למידה חינוכיים';

    const metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) {
      metaDesc.setAttribute(
        'content',
        lang === 'en'
          ? 'Interactive educational learning app for ages 4, 7 & 9: Hebrew alphabet & nikud, Israeli curriculum math (Grades 1–4), English A–Z & grammar, Star Shop, and parent controls.'
          : lang === 'es'
            ? 'Aplicación educativa interactiva para edades 4, 7 y 9: alfabeto hebreo, matemáticas escolares, inglés A–Z y gramática, tienda de estrellas y control parental.'
            : 'אפליקציית למידה חינוכית לילדים בגילאי 4, 7 ו-9 (גן וכיתות א׳–ד׳): לימוד אותיות, ניקוד וקריאה, חשבון לפי תוכנית משרד החינוך (לוח הכפל, שברים ושקלים), אנגלית A–Z ודקדוק — בעברית, אנגלית וספרדית.'
      );
    }
  }, [lang, isHe]);

  return (
    <div
      className={`${
        isQuizTab
          ? 'h-[100dvh] overflow-hidden overscroll-none'
          : 'min-h-screen pb-[env(safe-area-inset-bottom)]'
      } ${activeThemeBgClass} flex flex-col font-['Fredoka','Rubik','Varela_Round',sans-serif] transition-colors duration-500`}
      dir={isHe ? 'rtl' : 'ltr'}
    >
      <KidCursor enabled={kidCursorEnabled} size={kidCursorSize} />

      {/* Skip to Main Content link (IS 5568 / WCAG 2.1 AA) */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-2 focus:start-2 focus:z-[100] focus:px-4 focus:py-2 focus:bg-indigo-700 focus:text-white focus:font-black focus:rounded-xl focus:shadow-lg"
      >
        {lang === 'he' ? 'דַּלֵּג לַתֹּכֶן הָרָאשִׁי' : lang === 'es' ? 'Saltar al contenido principal' : 'Skip to main content'}
      </a>

      {!hideChrome && (
        <Navbar
          currentTab={currentTab}
          setCurrentTab={setCurrentTab}
          lang={lang}
          setLang={setLang}
          stars={stars}
          soundEnabled={soundEnabled}
          setSoundEnabled={setSoundEnabled}
          gender={gender}
          kidAge={kidAge}
          activeProfile={activeProfile}
          limitState={playLimitState}
          fullscreenLockActive={fullscreenLockActive}
          onEnterFullscreenLock={handleEnterFullscreenLock}
          onRequestFullscreenUnlock={() => setShowFullscreenUnlock(true)}
          onOpenProfilePicker={() => setShowProfilePicker(true)}
          onOpenParentGate={() => {
            setParentModalUnlocked(false);
            setShowParentModal(true);
          }}
        />
      )}

      <main
        id="main-content"
        tabIndex={-1}
        className={isQuizTab ? 'flex-1 min-h-0 overflow-hidden pb-0 outline-none' : 'flex-1 pb-6 outline-none'}
      >
        {currentTab === 'home' && (
          <HomeHub
            lang={lang}
            soundEnabled={soundEnabled}
            gender={gender}
            kidAge={kidAge}
            onChangeAge={(nextAge) => {
              if (fullscreenLockActive) setShowFullscreenUnlock(true);
              else handleChangeAge(nextAge);
            }}
            activeProfile={activeProfile}
            profilesCount={profiles.length}
            onOpenProfilePicker={() => {
              if (fullscreenLockActive) setShowFullscreenUnlock(true);
              else setShowProfilePicker(true);
            }}
            streakDays={streakDays}
            dailyStars={dailyStars}
            stars={stars}
            shopEntry={activeShopEntry}
            isPro={isPro}
            user={user}
            onSelectActivity={(id) => setCurrentTab(id)}
            onOpenPro={() => {
              if (fullscreenLockActive) {
                setShowFullscreenUnlock(true);
                return;
              }
              trackEvent('pro_modal', { isTouch, lang });
              setProSkipGate(false);
              setShowProModal(true);
            }}
            onOpenParentGate={() => {
              if (fullscreenLockActive) {
                setShowFullscreenUnlock(true);
              } else {
                setParentModalUnlocked(false);
                setShowParentModal(true);
              }
            }}
            needsGenderPick={needsGenderPick}
            onPickGender={handlePickGender}
          />
        )}

        {currentTab === 'letters' && (
          <AlphabetCards lang={lang} soundEnabled={soundEnabled} gender={gender} onEarnStar={handleEarnStar} />
        )}
        {currentTab === 'quiz' && (
          <LetterQuiz
            lang={lang}
            soundEnabled={soundEnabled}
            gender={gender}
            kidName={activeProfile?.name || ''}
            onEarnStar={handleEarnStar}
            isFocusLocked={quizFocusLocked}
            onFocusLockChange={setQuizFocusLocked}
            onNavigate={setCurrentTab}
          />
        )}
        {currentTab === 'train' && (
          <ReadingTrain lang={lang} soundEnabled={soundEnabled} gender={gender} onEarnStar={handleEarnStar} />
        )}
        {currentTab === 'detective' && (
          <PupikDetective lang={lang} soundEnabled={soundEnabled} gender={gender} onEarnStar={handleEarnStar} />
        )}
        {currentTab === 'vowels' && (
          <VowelsWorld lang={lang} soundEnabled={soundEnabled} gender={gender} onEarnStar={handleEarnStar} />
        )}
        {currentTab === 'first_words' && (
          <FirstWords lang={lang} soundEnabled={soundEnabled} gender={gender} onEarnStar={handleEarnStar} />
        )}
        {currentTab === 'numbers' && (
          <NumbersWorld lang={lang} soundEnabled={soundEnabled} gender={gender} onEarnStar={handleEarnStar} />
        )}
        {currentTab === 'math_age7' && (
          <IsraelMathArena
            key={`math-7-${activeProfileId || 'guest'}`}
            lang={lang}
            soundEnabled={soundEnabled}
            gender={gender}
            kidName={activeProfile?.name || ''}
            onEarnStar={handleEarnStar}
            fixedAge="7"
            onChangeAge={handleChangeAge}
            onSwitchActivity={setCurrentTab}
          />
        )}
        {currentTab === 'math_age9' && (
          <IsraelMathArena
            key={`math-9-${activeProfileId || 'guest'}`}
            lang={lang}
            soundEnabled={soundEnabled}
            gender={gender}
            kidName={activeProfile?.name || ''}
            onEarnStar={handleEarnStar}
            fixedAge="9"
            onChangeAge={handleChangeAge}
            onSwitchActivity={setCurrentTab}
          />
        )}
        {currentTab === 'hebrew_age7' && (
          <SchoolSkillArena
            key={`hebrew-7-${activeProfileId || 'guest'}`}
            arenaId="hebrew_age7"
            lang={lang}
            soundEnabled={soundEnabled}
            gender={gender}
            kidName={activeProfile?.name || ''}
            onEarnStar={handleEarnStar}
            onSwitchActivity={setCurrentTab}
          />
        )}
        {currentTab === 'english_abc_age7' && (
          <EnglishLearnStudio
            key={`english-abc-7-${activeProfileId || 'guest'}`}
            ageMode={7}
            lang={lang}
            soundEnabled={soundEnabled}
            gender={gender}
            kidName={activeProfile?.name || ''}
            onEarnStar={handleEarnStar}
            onSwitchActivity={setCurrentTab}
          />
        )}
        {currentTab === 'english_age7' && (
          <SchoolSkillArena
            key={`english-7-${activeProfileId || 'guest'}`}
            arenaId="english_age7"
            lang={lang}
            soundEnabled={soundEnabled}
            gender={gender}
            kidName={activeProfile?.name || ''}
            onEarnStar={handleEarnStar}
            onSwitchActivity={setCurrentTab}
          />
        )}
        {currentTab === 'hebrew_age9' && (
          <SchoolSkillArena
            key={`hebrew-9-${activeProfileId || 'guest'}`}
            arenaId="hebrew_age9"
            lang={lang}
            soundEnabled={soundEnabled}
            gender={gender}
            kidName={activeProfile?.name || ''}
            onEarnStar={handleEarnStar}
            onSwitchActivity={setCurrentTab}
          />
        )}
        {currentTab === 'english_studio_age9' && (
          <EnglishLearnStudio
            key={`english-studio-9-${activeProfileId || 'guest'}`}
            ageMode={9}
            lang={lang}
            soundEnabled={soundEnabled}
            gender={gender}
            kidName={activeProfile?.name || ''}
            onEarnStar={handleEarnStar}
            onSwitchActivity={setCurrentTab}
          />
        )}
        {currentTab === 'english_age9' && (
          <SchoolSkillArena
            key={`english-9-${activeProfileId || 'guest'}`}
            arenaId="english_age9"
            lang={lang}
            soundEnabled={soundEnabled}
            gender={gender}
            kidName={activeProfile?.name || ''}
            onEarnStar={handleEarnStar}
            onSwitchActivity={setCurrentTab}
          />
        )}
        {currentTab === 'tracing' && (
          <LetterTracer lang={lang} soundEnabled={soundEnabled} gender={gender} onEarnStar={handleEarnStar} />
        )}
        {currentTab === 'memory' && (
          <MemoryGame key="mem-4" ageMode={4} lang={lang} soundEnabled={soundEnabled} gender={gender} kidName={activeProfile?.name || ''} onEarnStar={handleEarnStar} />
        )}
        {currentTab === 'memory_age7' && (
          <MemoryGame key="mem-7" ageMode={7} lang={lang} soundEnabled={soundEnabled} gender={gender} kidName={activeProfile?.name || ''} onEarnStar={handleEarnStar} />
        )}
        {currentTab === 'memory_age9' && (
          <MemoryGame key="mem-9" ageMode={9} lang={lang} soundEnabled={soundEnabled} gender={gender} kidName={activeProfile?.name || ''} onEarnStar={handleEarnStar} />
        )}
        {currentTab === 'shop' && (
          <StarShop
            lang={lang}
            soundEnabled={soundEnabled}
            kidName={activeProfile?.name || ''}
            stars={stars}
            activeAvatar={activeProfile?.avatar || activeShopEntry.equippedAvatar || (gender === 'girl' ? '👧' : '👦')}
            shopEntry={activeShopEntry}
            onBuyItem={handleBuyShopItem}
            onEquipItem={handleEquipShopItem}
            onSetWishlist={handleSetWishlist}
            onGoPlay={() => setCurrentTab('home')}
            onGoHabits={() => setCurrentTab('habits')}
          />
        )}
        {currentTab === 'habits' && (
          <HabitTracker
            key={`habits-${activeHabitKey}`}
            lang={lang}
            soundEnabled={soundEnabled}
            kidName={activeProfile?.name || ''}
            kidAge={kidAge}
            stars={stars}
            habitEntry={activeHabitEntry}
            profiles={profiles}
            activeProfileId={activeProfileId}
            habitTrackersMap={habitTrackersMap}
            pinRecord={activePinRecord}
            biometricRecord={activeBiometricRecord}
            onKidToggleHabit={handleKidToggleHabit}
            onParentApproveHabit={handleParentApproveHabit}
            onParentApproveAllPending={handleParentApproveAllPending}
            onSetBedtime={handleSetBedtime}
            onAddHabit={handleAddHabit}
            onDeleteHabit={handleDeleteHabit}
            onSetTrackingMode={handleSetTrackingMode}
            onAddGoal={handleAddHabitGoal}
            onClaimGoal={handleClaimHabitGoal}
            onDeleteGoal={handleDeleteHabitGoal}
            onGoToShop={() => setCurrentTab('shop')}
          />
        )}
        {currentTab === 'stickers' && (
          <StickerPlayground lang={lang} soundEnabled={soundEnabled} gender={gender} stars={stars} />
        )}
        {currentTab === 'opening_sound' && (
          <OpeningSoundGame lang={lang} soundEnabled={soundEnabled} gender={gender} onEarnStar={handleEarnStar} />
        )}
        {currentTab === 'math_play' && (
          <MathPlay lang={lang} soundEnabled={soundEnabled} gender={gender} onEarnStar={handleEarnStar} />
        )}
      </main>

      {!isQuizTab && (
        <div
          className="w-full py-3 pb-5 px-4 text-center text-xs font-bold text-slate-500"
          dir={isHe ? 'rtl' : 'ltr'}
        >
          <span>{tr(lang, 'עודכן לאחרונה:', 'Last updated:', 'Última actualización:')}</span>{' '}
          <time dateTime={APP_BUILD_TIME} className="font-extrabold text-slate-600">
            <bdi dir="ltr">{formatLastUpdated(APP_BUILD_TIME, lang)}</bdi>
          </time>
        </div>
      )}

      {playLimitState.isLocked && (
        <PlayTimeLockOverlay
          key={`lock-${activeLimitKey}-${playLimitState.lockReason}`}
          lang={lang}
          gender={gender}
          activeProfile={activeProfile}
          profilesCount={profiles.length}
          dailyStars={dailyStars}
          limitEntry={activeLimitEntry}
          limitState={playLimitState}
          pinRecord={activePinRecord}
          biometricRecord={activeBiometricRecord}
          onGrantBonusMinutes={handleGrantBonusMinutes}
          onStartNewSession={handleResetSessionTimer}
          onResetTodayUsage={handleResetTodayUsage}
          onOpenProfilePicker={() => setShowProfilePicker(true)}
          onOpenParentSettings={() => {
            setParentModalUnlocked(true);
            setShowParentModal(true);
          }}
        />
      )}

      <ProfilePickerModal
        open={showProfilePicker}
        onClose={() => setShowProfilePicker(false)}
        lang={lang}
        user={user}
        profiles={profiles}
        activeProfileId={activeProfileId}
        onSelectProfile={handleSelectProfile}
        onSaveProfile={handleSaveProfile}
        onDeleteProfile={handleDeleteProfile}
        onOpenParentGate={() => {
          setParentModalUnlocked(false);
          setShowParentModal(true);
        }}
      />

      {(fullscreenEscaped || showFullscreenUnlock) && (
        <FullscreenUnlockModal
          key={`fs-unlock-${activeLockKey}-${fullscreenEscaped ? 'escaped' : 'unlock'}`}
          mode={fullscreenEscaped ? 'escaped' : 'unlock'}
          lang={lang}
          activeProfile={activeProfile}
          pinRecord={activePinRecord}
          biometricRecord={activeBiometricRecord}
          onUnlocked={handleUnlockFullscreen}
          onReturnToFullscreen={handleReturnToFullscreen}
          onCancel={() => setShowFullscreenUnlock(false)}
        />
      )}

      <ParentModal
        open={showParentModal}
        onClose={() => {
          setShowParentModal(false);
          setParentModalUnlocked(false);
        }}
        lang={lang}
        setLang={setLang}
        kidAge={kidAge}
        activeProfile={activeProfile}
        kidCursorEnabled={kidCursorEnabled}
        setKidCursorEnabled={setKidCursorEnabled}
        kidCursorSize={kidCursorSize}
        setKidCursorSize={setKidCursorSize}
        onResetStars={() => {
          setStars(5);
          setDailyStars(0);
          if (activeProfileId) {
            setProfiles((prev) =>
              prev.map((p) => (p.id === activeProfileId ? { ...p, stars: 5, dailyStars: 0 } : p))
            );
          }
        }}
        user={user}
        onAuthSuccess={handleAuthSuccess}
        onSignOut={() => setUser(null)}
        isPro={isPro}
        onOpenPro={(skipGate = false) => {
          trackEvent('pro_modal', { isTouch, lang });
          setProSkipGate(Boolean(skipGate));
          setShowProModal(true);
        }}
        profilesCount={profiles.length}
        onOpenProfilePicker={() => setShowProfilePicker(true)}
        serverConfig={serverConfig}
        limitEntry={activeLimitEntry}
        limitState={playLimitState}
        onUpdatePlayLimits={handleUpdatePlayLimits}
        onResetSessionTimer={handleResetSessionTimer}
        onResetTodayUsage={handleResetTodayUsage}
        onGrantBonusMinutes={handleGrantBonusMinutes}
        pinRecord={activePinRecord}
        biometricRecord={activeBiometricRecord}
        fullscreenLockActive={fullscreenLockActive}
        onSavePin={handleSavePin}
        onClearPin={handleClearPin}
        onEnableBiometric={handleEnableBiometric}
        onDisableBiometric={handleDisableBiometric}
        onEnterFullscreenLock={handleEnterFullscreenLock}
        initialUnlocked={parentModalUnlocked}
      />

      <ProUpgradeModal
        open={showProModal}
        onClose={() => setShowProModal(false)}
        lang={lang}
        isPro={isPro}
        skipGate={proSkipGate}
        onOpenParentZone={() => {
          setShowProModal(false);
          setShowParentModal(true);
        }}
        onUnlockPro={() => {
          trackEvent('pro_unlock', { isTouch, lang });
          setIsPro(true);
        }}
        serverConfig={serverConfig}
        user={user}
      />

      {!hideChrome && (
        <AccessibilityMenu
          lang={lang}
          kidCursorEnabled={kidCursorEnabled}
          setKidCursorEnabled={setKidCursorEnabled}
        />
      )}
    </div>
  );
}
