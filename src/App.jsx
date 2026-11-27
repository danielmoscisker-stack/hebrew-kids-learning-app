import React, { useState, useEffect, useCallback } from 'react';
import Navbar from './components/Navbar';
import HomeHub from './components/HomeHub';
import KidCursor from './components/KidCursor';
import ParentModal from './components/ParentModal';
import ProUpgradeModal from './components/ProUpgradeModal';
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
import AccessibilityMenu from './components/AccessibilityMenu';
import { playSound, playPhraseAudio, setMuted } from './utils/audio';
import { useDeviceType } from './utils/useDeviceType';
import { fetchServerConfig, fetchCurrentSession, pushCloudProgress } from './utils/cloudSync';
import { trackEvent } from './utils/analytics';

const todayStr = () => new Date().toISOString().slice(0, 10);

export default function App() {
  const [currentTab, setCurrentTab] = useState('home');
  const [lang, setLang] = useState('he');
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [showParentModal, setShowParentModal] = useState(false);
  const [showProModal, setShowProModal] = useState(false);
  const [serverConfig, setServerConfig] = useState(null);
  const [user, setUser] = useState(null);

  const [isPro, setIsPro] = useState(() => {
    try {
      return localStorage.getItem('kids_pro_unlocked') === 'true';
    } catch {
      return false;
    }
  });

  const [needsGenderPick, setNeedsGenderPick] = useState(() => {
    try {
      return !localStorage.getItem('kid_gender');
    } catch {
      return false;
    }
  });

  const [gender, setGender] = useState(() => {
    try {
      return localStorage.getItem('kid_gender') || 'boy';
    } catch {
      return 'boy';
    }
  });

  const [kidCursorEnabled, setKidCursorEnabled] = useState(() => {
    try {
      const saved = localStorage.getItem('kid_cursor_enabled');
      return saved === null ? true : saved === 'true';
    } catch {
      return true;
    }
  });

  const [stars, setStars] = useState(() => {
    try {
      const saved = localStorage.getItem('kids_stars_total');
      return saved ? parseInt(saved, 10) : 5;
    } catch {
      return 5;
    }
  });

  const [streakDays, setStreakDays] = useState(() => {
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
    try {
      localStorage.setItem('kid_gender', gender);
    } catch {
      // ignore
    }
  }, [gender]);

  useEffect(() => {
    try {
      localStorage.setItem('kid_cursor_enabled', String(kidCursorEnabled));
    } catch {
      // ignore
    }
  }, [kidCursorEnabled]);

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

  // Load optional Cloudflare config + session on startup (non-blocking)
  useEffect(() => {
    fetchServerConfig().then((cfg) => cfg && setServerConfig(cfg));
    fetchCurrentSession().then((sess) => {
      if (!sess) return;
      if (sess.isPro) setIsPro(true);
      if (sess.user) setUser(sess.user);
      if (sess.progress) {
        setStars((prev) => Math.max(prev, sess.progress.stars || 0));
        if (sess.progress.streakDays) setStreakDays((prev) => Math.max(prev, sess.progress.streakDays));
        if (sess.progress.gender) setGender(sess.progress.gender);
      }
    });
  }, []);

  // Debounced cloud progress backup when signed in
  useEffect(() => {
    if (!user) return;
    const t = setTimeout(() => {
      pushCloudProgress({
        stars,
        gender,
        lang,
        streakDays,
        lastPlayed: todayStr(),
        data: {}
      });
    }, 1200);
    return () => clearTimeout(t);
  }, [user, stars, gender, lang, streakDays]);

  const { isTouch } = useDeviceType();

  // Track initial page_view & activity_start events (privacy-safe, zero cookies)
  useEffect(() => {
    trackEvent('page_view', { isTouch, lang });
  }, []);

  useEffect(() => {
    if (currentTab !== 'home') {
      trackEvent('activity_start', { activityId: currentTab, isTouch, lang });
    }
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
    if (!soundEnabled || currentTab === 'home') return;
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
  }, [currentTab, soundEnabled, gender, isTouch]);

  const handleEarnStar = (amount = 1) => {
    setStars((prev) => prev + amount);
    setDailyStars((prev) => prev + amount);
    trackEvent('star_earned', { activityId: currentTab, isTouch, lang });
  };

  const handlePickGender = (picked) => {
    setGender(picked);
    setNeedsGenderPick(false);
    playSound('star');
    if (soundEnabled) {
      setTimeout(() => playPhraseAudio('welcome_home', picked), 150);
    }
  };

  const handleAuthSuccess = useCallback((result) => {
    trackEvent('google_signin', { isTouch, lang });
    if (result?.user) {
      setUser(result.user);
      if (result.user.isPro) setIsPro(true);
    }
    if (result?.progress) {
      setStars((prev) => Math.max(prev, result.progress.stars || 0));
    }
  }, []);

  const isHe = lang === 'he';

  useEffect(() => {
    document.documentElement.lang = lang;
    document.documentElement.dir = isHe ? 'rtl' : 'ltr';
  }, [lang, isHe]);

  return (
    <div
      className="min-h-screen flex flex-col font-['Fredoka','Rubik','Varela_Round',sans-serif] pb-[env(safe-area-inset-bottom)]"
      dir={isHe ? 'rtl' : 'ltr'}
    >
      <KidCursor enabled={kidCursorEnabled} />

      {/* Skip to Main Content link (IS 5568 / WCAG 2.1 AA) */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-2 focus:right-2 focus:z-[100] focus:px-4 focus:py-2 focus:bg-indigo-700 focus:text-white focus:font-black focus:rounded-xl focus:shadow-lg"
      >
        {isHe ? 'דַּלֵּג לַתֹּכֶן הָרָאשִׁי' : 'Skip to main content'}
      </a>

      <Navbar
        currentTab={currentTab}
        setCurrentTab={setCurrentTab}
        lang={lang}
        stars={stars}
        soundEnabled={soundEnabled}
        setSoundEnabled={setSoundEnabled}
        gender={gender}
        setGender={setGender}
        onOpenParentGate={() => setShowParentModal(true)}
      />

      <main id="main-content" tabIndex={-1} className="flex-1 pb-12 outline-none">
        {currentTab === 'home' && (
          <HomeHub
            lang={lang}
            soundEnabled={soundEnabled}
            gender={gender}
            stars={stars}
            streakDays={streakDays}
            dailyStars={dailyStars}
            isPro={isPro}
            user={user}
            onSelectActivity={(id) => setCurrentTab(id)}
            onOpenPro={() => {
              trackEvent('pro_modal', { isTouch, lang });
              setShowProModal(true);
            }}
            onOpenParentGate={() => setShowParentModal(true)}
            needsGenderPick={needsGenderPick}
            onPickGender={handlePickGender}
          />
        )}

        {currentTab === 'letters' && (
          <AlphabetCards lang={lang} soundEnabled={soundEnabled} gender={gender} onEarnStar={handleEarnStar} />
        )}
        {currentTab === 'quiz' && (
          <LetterQuiz lang={lang} soundEnabled={soundEnabled} gender={gender} onEarnStar={handleEarnStar} />
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
        {currentTab === 'tracing' && (
          <LetterTracer lang={lang} soundEnabled={soundEnabled} gender={gender} onEarnStar={handleEarnStar} />
        )}
        {currentTab === 'memory' && (
          <MemoryGame lang={lang} soundEnabled={soundEnabled} gender={gender} onEarnStar={handleEarnStar} />
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

      <ParentModal
        open={showParentModal}
        onClose={() => setShowParentModal(false)}
        lang={lang}
        setLang={setLang}
        kidCursorEnabled={kidCursorEnabled}
        setKidCursorEnabled={setKidCursorEnabled}
        onResetStars={() => {
          setStars(5);
          setDailyStars(0);
        }}
        user={user}
        onAuthSuccess={handleAuthSuccess}
        onSignOut={() => setUser(null)}
        isPro={isPro}
        onOpenPro={() => {
          trackEvent('pro_modal', { isTouch, lang });
          setShowProModal(true);
        }}
        serverConfig={serverConfig}
      />

      <ProUpgradeModal
        open={showProModal}
        onClose={() => setShowProModal(false)}
        lang={lang}
        isPro={isPro}
        onUnlockPro={() => {
          trackEvent('pro_unlock', { isTouch, lang });
          setIsPro(true);
        }}
        serverConfig={serverConfig}
        user={user}
      />

      <AccessibilityMenu
        lang={lang}
        kidCursorEnabled={kidCursorEnabled}
        setKidCursorEnabled={setKidCursorEnabled}
      />
    </div>
  );
}
