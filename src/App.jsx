import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import HomeHub from './components/HomeHub';
import KidCursor from './components/KidCursor';
import ParentModal from './components/ParentModal';
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
import { playSound, playPhraseAudio, setMuted } from './utils/audio';
import { useDeviceType } from './utils/useDeviceType';

export default function App() {
  const [currentTab, setCurrentTab] = useState('home');
  const [lang, setLang] = useState('he');
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [showParentModal, setShowParentModal] = useState(false);

  const [needsGenderPick, setNeedsGenderPick] = useState(() => {
    try {
      return !localStorage.getItem('kid_gender');
    } catch {
      return false;
    }
  });

  // Kid gender: 'boy' (זָכָר) or 'girl' (נְקֵבָה)
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

  useEffect(() => {
    try {
      localStorage.setItem('kid_gender', gender);
    } catch (e) {
      console.warn('Could not save kid gender', e);
    }
  }, [gender]);

  useEffect(() => {
    try {
      localStorage.setItem('kid_cursor_enabled', String(kidCursorEnabled));
    } catch (e) {
      console.warn('Could not save cursor setting', e);
    }
  }, [kidCursorEnabled]);

  useEffect(() => {
    setMuted(!soundEnabled);
  }, [soundEnabled]);

  const { isTouch } = useDeviceType();

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
      stickers: 'inst_stickers'
    };

    const instKey = tabInstructions[currentTab];
    if (instKey) {
      const timer = setTimeout(() => {
        playPhraseAudio(instKey, gender);
      }, 400);
      return () => clearTimeout(timer);
    }
  }, [currentTab, soundEnabled, gender, isTouch]);

  // Load / persist star score
  const [stars, setStars] = useState(() => {
    try {
      const saved = localStorage.getItem('kids_stars_total');
      return saved ? parseInt(saved, 10) : 5;
    } catch {
      return 5;
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem('kids_stars_total', stars.toString());
    } catch (e) {
      console.warn('Could not save stars', e);
    }
  }, [stars]);

  const handleEarnStar = (amount = 1) => {
    setStars((prev) => prev + amount);
  };

  const handlePickGender = (picked) => {
    setGender(picked);
    setNeedsGenderPick(false);
    playSound('star');
    if (soundEnabled) {
      setTimeout(() => playPhraseAudio('welcome_home', picked), 150);
    }
  };

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
      {/* Big playful cursor when played on a computer */}
      <KidCursor enabled={kidCursorEnabled} />

      {/* Clean Kid-First Header */}
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

      {/* Main Content Area */}
      <main className="flex-1 pb-12">
        {currentTab === 'home' && (
          <HomeHub
            lang={lang}
            soundEnabled={soundEnabled}
            gender={gender}
            stars={stars}
            onSelectActivity={(id) => setCurrentTab(id)}
            needsGenderPick={needsGenderPick}
            onPickGender={handlePickGender}
          />
        )}

        {currentTab === 'letters' && (
          <AlphabetCards
            lang={lang}
            soundEnabled={soundEnabled}
            gender={gender}
            onEarnStar={handleEarnStar}
          />
        )}

        {currentTab === 'quiz' && (
          <LetterQuiz
            lang={lang}
            soundEnabled={soundEnabled}
            gender={gender}
            onEarnStar={handleEarnStar}
          />
        )}

        {currentTab === 'train' && (
          <ReadingTrain
            lang={lang}
            soundEnabled={soundEnabled}
            gender={gender}
            onEarnStar={handleEarnStar}
          />
        )}

        {currentTab === 'detective' && (
          <PupikDetective
            lang={lang}
            soundEnabled={soundEnabled}
            gender={gender}
            onEarnStar={handleEarnStar}
          />
        )}

        {currentTab === 'vowels' && (
          <VowelsWorld
            lang={lang}
            soundEnabled={soundEnabled}
            gender={gender}
            onEarnStar={handleEarnStar}
          />
        )}

        {currentTab === 'first_words' && (
          <FirstWords
            lang={lang}
            soundEnabled={soundEnabled}
            gender={gender}
            onEarnStar={handleEarnStar}
          />
        )}

        {currentTab === 'numbers' && (
          <NumbersWorld
            lang={lang}
            soundEnabled={soundEnabled}
            gender={gender}
            onEarnStar={handleEarnStar}
          />
        )}

        {currentTab === 'tracing' && (
          <LetterTracer
            lang={lang}
            soundEnabled={soundEnabled}
            gender={gender}
            onEarnStar={handleEarnStar}
          />
        )}

        {currentTab === 'memory' && (
          <MemoryGame
            lang={lang}
            soundEnabled={soundEnabled}
            gender={gender}
            onEarnStar={handleEarnStar}
          />
        )}

        {currentTab === 'stickers' && (
          <StickerPlayground
            lang={lang}
            soundEnabled={soundEnabled}
            gender={gender}
            stars={stars}
          />
        )}
      </main>

      {/* Parent Gate & Settings Modal */}
      <ParentModal
        open={showParentModal}
        onClose={() => setShowParentModal(false)}
        lang={lang}
        setLang={setLang}
        kidCursorEnabled={kidCursorEnabled}
        setKidCursorEnabled={setKidCursorEnabled}
        onResetStars={() => setStars(5)}
      />
    </div>
  );
}
