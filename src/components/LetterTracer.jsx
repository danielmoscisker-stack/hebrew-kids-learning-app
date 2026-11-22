import React, { useRef, useState, useEffect, useCallback } from 'react';
import { Volume2, Sparkles, RotateCcw, CheckCircle2, ChevronLeft, ChevronRight, Palette, Award, Star } from 'lucide-react';
import { LETTERS_DATA, NUMBERS_DATA } from '../data/curriculumData';
import { playSound, speakLetterName, playNumberAudio, playPhraseAudio } from '../utils/audio';
import { triggerConfetti, triggerStarBurst } from '../utils/confetti';
import { useDeviceType } from '../utils/useDeviceType';

const BRUSH_COLORS = [
  { id: 'rainbow', label: '🌈', color: 'rainbow' },
  { id: 'red', label: '🔴', color: '#EF4444' },
  { id: 'yellow', label: '🟡', color: '#F59E0B' },
  { id: 'green', label: '🟢', color: '#10B981' },
  { id: 'blue', label: '🔵', color: '#3B82F6' },
  { id: 'purple', label: '🟣', color: '#8B5CF6' },
];

export default function LetterTracer({ lang, soundEnabled, gender = 'boy', onEarnStar }) {
  const isHe = lang === 'he';
  const { isTouch, withDeviceHe, withDeviceEn } = useDeviceType();

  const canvasRef = useRef(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [brushColor, setBrushColor] = useState('#3B82F6');
  const [brushSize, setBrushSize] = useState(22);
  const [mode, setMode] = useState('letters'); // 'letters' or 'numbers'
  const [currentIndex, setCurrentIndex] = useState(0);

  // Letter & Number Target Validation
  const [targetPoints, setTargetPoints] = useState([]);
  const [coveredCount, setCoveredCount] = useState(0);
  const [insideStrokes, setInsideStrokes] = useState(0);
  const [outsideStrokes, setOutsideStrokes] = useState(0);
  const [feedbackMessage, setFeedbackMessage] = useState(null);
  const [isSuccess, setIsSuccess] = useState(false);

  const currentItem = mode === 'letters' ? LETTERS_DATA[currentIndex] : NUMBERS_DATA[currentIndex];
  const charToDraw = mode === 'letters' ? currentItem.letter : currentItem.number.toString();

  // Generate target mask for accuracy checking
  useEffect(() => {
    const offscreen = document.createElement('canvas');
    offscreen.width = 400;
    offscreen.height = 400;
    const ctx = offscreen.getContext('2d');

    ctx.fillStyle = '#000000';
    ctx.font = 'bold 240px "Fredoka", "Rubik", system-ui, sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(charToDraw, 200, 205);

    const imgData = ctx.getImageData(0, 0, 400, 400).data;
    const pts = [];
    const step = 8; // sample grid
    for (let y = 16; y < 384; y += step) {
      for (let x = 16; x < 384; x += step) {
        const alpha = imgData[(y * 400 + x) * 4 + 3];
        if (alpha > 80) {
          pts.push({ x, y, hit: false });
        }
      }
    }

    setTargetPoints(pts);
    setCoveredCount(0);
    setInsideStrokes(0);
    setOutsideStrokes(0);
    setFeedbackMessage(null);
    setIsSuccess(false);
  }, [charToDraw]);

  const handleNext = () => {
    playSound('whoosh');
    const max = mode === 'letters' ? LETTERS_DATA.length : NUMBERS_DATA.length;
    const nextIdx = (currentIndex + 1) % max;
    setCurrentIndex(nextIdx);
    clearCanvas();
    if (soundEnabled) {
      if (mode === 'letters') {
        speakLetterName(LETTERS_DATA[nextIdx].id);
      } else {
        playNumberAudio(NUMBERS_DATA[nextIdx].number);
      }
    }
  };

  const handlePrev = () => {
    playSound('whoosh');
    const max = mode === 'letters' ? LETTERS_DATA.length : NUMBERS_DATA.length;
    const prevIdx = (currentIndex - 1 + max) % max;
    setCurrentIndex(prevIdx);
    clearCanvas();
    if (soundEnabled) {
      if (mode === 'letters') {
        speakLetterName(LETTERS_DATA[prevIdx].id);
      } else {
        playNumberAudio(NUMBERS_DATA[prevIdx].number);
      }
    }
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Reset tracking
    setTargetPoints((prev) => prev.map((p) => ({ ...p, hit: false })));
    setCoveredCount(0);
    setInsideStrokes(0);
    setOutsideStrokes(0);
    setFeedbackMessage(null);
    setIsSuccess(false);
  };

  const checkPointAccuracy = useCallback((x, y) => {
    if (targetPoints.length === 0) return;

    let hitAny = false;
    let newlyHit = 0;

    // Tolerance radius: 36px (comfortably forgiving for 4-year-olds)
    const toleranceSq = 36 * 36;
    const outsideThresholdSq = 55 * 55;
    let isNearLetter = false;

    for (let i = 0; i < targetPoints.length; i++) {
      const p = targetPoints[i];
      const dx = p.x - x;
      const dy = p.y - y;
      const distSq = dx * dx + dy * dy;

      if (distSq <= outsideThresholdSq) {
        isNearLetter = true;
      }

      if (distSq <= toleranceSq) {
        hitAny = true;
        if (!p.hit) {
          p.hit = true;
          newlyHit++;
        }
      }
    }

    if (newlyHit > 0) {
      setCoveredCount((c) => c + newlyHit);
    }

    if (isNearLetter) {
      setInsideStrokes((s) => s + 1);
    } else {
      setOutsideStrokes((s) => s + 1);
    }
  }, [targetPoints]);

  const startDrawing = (e) => {
    setIsDrawing(true);
    draw(e);
  };

  const stopDrawing = () => {
    setIsDrawing(false);
    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext('2d');
      ctx.beginPath();
    }
  };

  const draw = (e) => {
    if (!isDrawing) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    const rect = canvas.getBoundingClientRect();
    const clientX = e.clientX || (e.touches && e.touches[0].clientX);
    const clientY = e.clientY || (e.touches && e.touches[0].clientY);

    const x = (clientX - rect.left) * (canvas.width / rect.width);
    const y = (clientY - rect.top) * (canvas.height / rect.height);

    ctx.lineWidth = brushSize;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';

    if (brushColor === 'rainbow') {
      const hue = (Date.now() / 4) % 360;
      ctx.strokeStyle = `hsl(${hue}, 95%, 55%)`;
    } else {
      ctx.strokeStyle = brushColor;
    }

    ctx.lineTo(x, y);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(x, y);

    // Real-time accuracy check against target points
    checkPointAccuracy(x, y);
  };

  // Check that the child colored within the letter bounds or close to it
  const handleFinish = () => {
    const totalPoints = targetPoints.length || 1;
    const coverage = (coveredCount / totalPoints) * 100;
    const totalStrokes = insideStrokes + outsideStrokes;
    const accuracy = totalStrokes > 0 ? (insideStrokes / totalStrokes) * 100 : 0;

    // Case 1: Hardly anything drawn or empty canvas
    if (coverage < 15 || totalStrokes < 12) {
      playSound('whoosh');
      setFeedbackMessage({
        type: 'warning',
        text: isHe
          ? gender === 'girl'
            ? 'עוֹד קְצָת! צַבְּעִי עַל הַקַּוִּים שֶׁל הָאוֹת!'
            : 'עוֹד קְצָת! צַבַּע עַל הַקַּוִּים שֶׁל הָאוֹת!'
          : 'Almost there! Color over the lines of the letter!'
      });
      if (soundEnabled) {
        playPhraseAudio('tracing_keep_going', gender);
      }
      return;
    }

    // Case 2: Drew mostly far outside the letter
    if (accuracy < 35 && coverage < 30) {
      playSound('whoosh');
      setFeedbackMessage({
        type: 'warning',
        text: isHe
          ? gender === 'girl'
            ? 'נַסִּי לִצְבּוֹעַ בְּתוֹךְ קַוֵּי הָאוֹת, אַתְּ מַמָּשׁ קְרוֹבָה!'
            : 'נַסֵּה לִצְבּוֹעַ בְּתוֹךְ קַוֵּי הָאוֹת, אַתָּה מַמָּשׁ קָרוֹב!'
          : 'Try to color closer inside the lines of the letter!'
      });
      if (soundEnabled) {
        playPhraseAudio('tracing_inside', gender);
      }
      return;
    }

    // Case 3: SUCCESS! Accurately colored within/close to the letter
    setIsSuccess(true);
    playSound('win');
    triggerStarBurst();
    triggerConfetti();
    onEarnStar(2);

    setFeedbackMessage({
      type: 'success',
      text: isHe
        ? gender === 'girl'
          ? '🎉 וָואוּ! צִיַּרְתְּ מַדְהִים! כּוֹל הַכָּבוֹד!'
          : '🎉 וָואוּ! צִיַּרְתָּ מַדְהִים! כּוֹל הַכָּבוֹד!'
        : '🎉 WOW! You traced it amazingly! Kol HaKavod!'
    });

    if (soundEnabled) {
      playPhraseAudio('tracing_success', gender);
    }
  };

  const playActiveSound = () => {
    playSound('pop');
    if (soundEnabled) {
      if (mode === 'letters') {
        speakLetterName(currentItem.id);
      } else {
        playNumberAudio(currentItem.number);
      }
    }
  };

  const playInstructionSound = () => {
    playSound('pop');
    if (soundEnabled) {
      const phraseKey = isTouch ? 'inst_tracing_touch' : 'inst_tracing_mouse';
      playPhraseAudio(phraseKey, gender);
    }
  };

  const totalPoints = targetPoints.length || 1;
  const coveragePercent = Math.min(100, Math.round((coveredCount / totalPoints) * 100));

  return (
    <div
      className="max-w-4xl mx-auto px-4 py-6 flex flex-col gap-6"
      dir={isHe ? 'rtl' : 'ltr'}
    >
      {/* Top Banner (Adapts dynamically to Computer/Mouse vs Tablet/Finger) */}
      <div className="bg-gradient-to-r from-teal-400 via-emerald-500 to-teal-600 rounded-3xl p-6 text-white text-center shadow-lg relative overflow-hidden">
        <span className="text-4xl animate-bounce-gentle inline-block">🎨 ✍️ ⭐</span>
        <h2 className="text-2xl md:text-3xl font-black mt-2">
          {isHe
            ? `צִיּוּר וּכְתִיבָה ${withDeviceHe} (מוֹטוֹרִיקָה עֲדִינָה)`
            : `Drawing & Tracing ${withDeviceEn} (Fine Motor Skills)`}
        </h2>
        <p className="text-teal-100 text-sm md:text-base mt-1 font-medium">
          {isHe
            ? `עוֹבְרִים ${withDeviceHe} עַל הַקַּוִּים הַמְקֻוְקָוִים וְלוֹמְדִים לִכְתּוֹב!`
            : `Trace ${withDeviceEn} over the dotted lines and learn to write!`}
        </p>

        <button
          onClick={playInstructionSound}
          className="mt-3 inline-flex items-center gap-1.5 px-4 py-2 bg-white/20 hover:bg-white/30 rounded-2xl font-bold text-xs md:text-sm text-white shadow-sm border border-white/40 btn-press-3d"
          title={isHe ? (gender === 'girl' ? 'הַשְׁמִיעִי הוֹרָאוֹת' : 'הַשְׁמַע הוֹרָאוֹת') : 'Hear Instructions'}
        >
          <Volume2 className="w-4 h-4 text-teal-200 animate-pulse" />
          <span>
            {isHe
              ? gender === 'girl' ? '🔊 שִׁמְעִי הוֹרָאוֹת' : '🔊 שְׁמַע הוֹרָאוֹת'
              : '🔊 Hear Instructions'}
          </span>
        </button>

        {/* Switcher Letters / Numbers */}
        <div className="flex justify-center gap-3 mt-4">
          <button
            onClick={() => {
              playSound('pop');
              setMode('letters');
              setCurrentIndex(0);
              clearCanvas();
            }}
            className={`px-5 py-2 rounded-2xl font-black text-sm md:text-base transition-all btn-press-3d border-2 ${
              mode === 'letters'
                ? 'bg-amber-400 text-slate-900 border-amber-500 shadow-md scale-105'
                : 'bg-white/20 text-white hover:bg-white/30'
            }`}
          >
            {isHe ? '🔤 אוֹתִיּוֹת' : '🔤 Letters'}
          </button>
          <button
            onClick={() => {
              playSound('pop');
              setMode('numbers');
              setCurrentIndex(0);
              clearCanvas();
            }}
            className={`px-5 py-2 rounded-2xl font-black text-sm md:text-base transition-all btn-press-3d border-2 ${
              mode === 'numbers'
                ? 'bg-amber-400 text-slate-900 border-amber-500 shadow-md scale-105'
                : 'bg-white/20 text-white hover:bg-white/30'
            }`}
          >
            {isHe ? '🔢 מִסְפָּרִים' : '🔢 Numbers'}
          </button>
        </div>
      </div>

      {/* Main Tracing Board */}
      <div className="bg-white rounded-3xl p-6 md:p-8 border-4 border-teal-300 shadow-xl flex flex-col items-center relative">
        {/* Navigation Arrows (RTL Compliant) */}
        <div className="absolute top-4 left-4 right-4 flex justify-between pointer-events-none z-20">
          <button
            onClick={handlePrev}
            className="pointer-events-auto p-3 bg-teal-100 hover:bg-teal-200 active:scale-95 text-slate-800 rounded-full shadow-md btn-press-3d transition"
            title={isHe ? 'הַקּוֹדֵם' : 'Previous'}
          >
            {isHe ? <ChevronRight className="w-8 h-8" /> : <ChevronLeft className="w-8 h-8" />}
          </button>
          <button
            onClick={handleNext}
            className="pointer-events-auto p-3 bg-teal-100 hover:bg-teal-200 active:scale-95 text-slate-800 rounded-full shadow-md btn-press-3d transition"
            title={isHe ? 'הַבָּא' : 'Next'}
          >
            {isHe ? <ChevronLeft className="w-8 h-8" /> : <ChevronRight className="w-8 h-8" />}
          </button>
        </div>

        {/* Header with Letter Audio */}
        <div className="flex items-center gap-2 mb-2 cursor-pointer" onClick={playActiveSound}>
          <h3 className="text-3xl md:text-4xl font-black text-slate-800">
            {mode === 'letters' ? currentItem.displayWithNikud : currentItem.nameHe}
          </h3>
          <button
            className="p-2 bg-teal-100 hover:bg-teal-200 rounded-full shadow-sm"
            title="השמע / Listen"
          >
            <Volume2 className="w-6 h-6 text-teal-700 animate-pulse" />
          </button>
        </div>

        {/* Real-time Accuracy & Coverage Progress Bar */}
        <div className="w-full max-w-xs mb-3 flex flex-col items-center gap-1">
          <div className="w-full flex justify-between text-xs font-black text-teal-800 px-1">
            <span>{isHe ? `כִּיסוּי אוֹת: ${coveragePercent}%` : `Covered: ${coveragePercent}%`}</span>
            <span>{coveragePercent >= 35 ? '⭐ כִּמְעַט סִיַּמְתָּ!' : '✍️ צַבְּעוּ עַל הַקַּוִּים'}</span>
          </div>
          <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden border border-teal-200 shadow-inner">
            <div
              className={`h-full transition-all duration-200 rounded-full ${
                coveragePercent >= 40
                  ? 'bg-gradient-to-r from-emerald-400 to-teal-500'
                  : 'bg-gradient-to-r from-amber-400 to-orange-400'
              }`}
              style={{ width: `${coveragePercent}%` }}
            />
          </div>
        </div>

        {/* Tracing Canvas Area with Dotted Guide Shape */}
        <div className="relative w-72 h-72 sm:w-80 sm:h-80 md:w-96 md:h-96 rounded-3xl border-4 border-dashed border-teal-400 bg-slate-50 flex items-center justify-center overflow-hidden touch-none shadow-inner">
          {/* Faint Dotted Guide Shape */}
          <span className="absolute inset-0 flex items-center justify-center text-[170px] sm:text-[200px] md:text-[230px] font-black text-slate-200 select-none pointer-events-none">
            {charToDraw}
          </span>

          {/* Interactive HTML5 Canvas */}
          <canvas
            ref={canvasRef}
            width={400}
            height={400}
            onMouseDown={startDrawing}
            onMouseUp={stopDrawing}
            onMouseMove={draw}
            onMouseLeave={stopDrawing}
            onTouchStart={startDrawing}
            onTouchEnd={stopDrawing}
            onTouchMove={draw}
            className="relative z-10 w-full h-full cursor-crosshair"
          />
        </div>

        {/* Accuracy Feedback Notification Alert */}
        {feedbackMessage && (
          <div
            className={`mt-4 px-5 py-2.5 rounded-2xl font-extrabold text-sm md:text-base flex items-center gap-2 shadow-md animate-bounce ${
              feedbackMessage.type === 'success'
                ? 'bg-emerald-100 border-2 border-emerald-400 text-emerald-900'
                : 'bg-amber-100 border-2 border-amber-400 text-amber-900'
            }`}
          >
            <span>{feedbackMessage.text}</span>
          </div>
        )}

        {/* Color Palette & Brush Controls */}
        <div className="flex flex-wrap items-center justify-center gap-3 mt-6">
          <div className="flex items-center gap-2 bg-slate-100 p-2 rounded-2xl">
            {BRUSH_COLORS.map((bc) => (
              <button
                key={bc.id}
                onClick={() => {
                  playSound('pop');
                  setBrushColor(bc.color);
                }}
                className={`w-10 h-10 rounded-xl text-xl flex items-center justify-center transition-all ${
                  brushColor === bc.color
                    ? 'ring-4 ring-amber-400 scale-110 shadow-md'
                    : 'hover:scale-105'
                }`}
              >
                {bc.label}
              </button>
            ))}
          </div>

          <button
            onClick={() => {
              playSound('whoosh');
              clearCanvas();
            }}
            className="flex items-center gap-1.5 px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-2xl text-sm btn-press-3d"
          >
            <RotateCcw className="w-4 h-4" />
            <span>{isHe ? 'נַקֵּה' : 'Clear'}</span>
          </button>

          <button
            onClick={handleFinish}
            className="flex items-center gap-2 px-6 py-2.5 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white font-black rounded-2xl text-base shadow-md btn-press-3d animate-pulse"
          >
            <CheckCircle2 className="w-5 h-5" />
            <span>{isHe ? 'סִיַּמְתִּי! ✨' : 'Done! ✨'}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
