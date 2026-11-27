import React, { useState, useEffect } from 'react';
import { Accessibility, X, RotateCcw, Eye, Type, PauseCircle, MousePointer2, Sparkles, ExternalLink } from 'lucide-react';
import { playSound } from '../utils/audio';
import { tr } from '../utils/i18n';
import { useDeviceType } from '../utils/useDeviceType';

const DEFAULT_PREFS = {
  fontSize: 100, // 100 | 115 | 130
  highContrast: false,
  grayscale: false,
  highlightLinks: false,
  readableFont: false,
  reduceMotion: false
};

/**
 * Israeli Standard SI 5568 (WCAG 2.1 AA) Accessibility Toolbar & Widget.
 * Persists user preferences in localStorage and applies root CSS classes cleanly.
 */
export default function AccessibilityMenu({
  lang,
  kidCursorEnabled,
  setKidCursorEnabled
}) {
  const isHe = lang === 'he';
  const { isTouch } = useDeviceType();
  const [open, setOpen] = useState(false);
  const [prefs, setPrefs] = useState(() => {
    try {
      const saved = localStorage.getItem('hk_a11y_prefs');
      return saved ? { ...DEFAULT_PREFS, ...JSON.parse(saved) } : DEFAULT_PREFS;
    } catch {
      return DEFAULT_PREFS;
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem('hk_a11y_prefs', JSON.stringify(prefs));
    } catch {
      // ignore
    }

    const root = document.documentElement;
    root.style.fontSize = `${prefs.fontSize}%`;
    root.classList.toggle('a11y-high-contrast', prefs.highContrast);
    root.classList.toggle('a11y-grayscale', prefs.grayscale);
    root.classList.toggle('a11y-highlight-links', prefs.highlightLinks);
    root.classList.toggle('a11y-readable-font', prefs.readableFont);
    root.classList.toggle('a11y-reduce-motion', prefs.reduceMotion);
  }, [prefs]);

  useEffect(() => {
    if (!open) return;
    const onKeyDown = (e) => {
      if (e.key === 'Escape') setOpen(false);
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [open]);

  const toggle = (key) => {
    playSound('pop');
    setPrefs((p) => ({ ...p, [key]: !p[key] }));
  };

  const resetAll = () => {
    playSound('whoosh');
    setPrefs(DEFAULT_PREFS);
  };

  return (
    <>
      {/* Floating Accessible Trigger Button (IS 5568) */}
      <button
        type="button"
        onClick={() => {
          playSound('pop');
          setOpen((v) => !v);
        }}
        aria-label={tr(lang, 'תַּפְרִיט נְגִישׁוּת', 'Accessibility Menu', 'Menú de Accesibilidad')}
        aria-expanded={open}
        title={tr(lang, 'נְגִישׁוּת (ת״י 5568)', 'Accessibility (SI 5568)', 'Accesibilidad (Norma SI 5568)')}
        className="fixed bottom-[max(1rem,env(safe-area-inset-bottom))] left-4 z-50 w-12 h-12 rounded-full bg-indigo-700 hover:bg-indigo-800 text-white border-2 border-white shadow-lg flex items-center justify-center btn-press-3d cursor-pointer"
      >
        <Accessibility className="w-6 h-6" aria-hidden="true" />
      </button>

      {open && (
        <div
          className="fixed inset-0 z-50 bg-black/45 backdrop-blur-xs flex items-end sm:items-center justify-center p-4"
          onClick={() => setOpen(false)}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="a11y-dialog-title"
            dir={isHe ? 'rtl' : 'ltr'}
            onClick={(e) => e.stopPropagation()}
            className="bg-white rounded-3xl max-w-md w-full p-5 md:p-6 shadow-2xl border-4 border-indigo-500 max-h-[88vh] overflow-y-auto animate-pop-in"
          >
            <div className="flex items-center justify-between pb-3 border-b border-slate-200 mb-4">
              <div className="flex items-center gap-2">
                <Accessibility className="w-6 h-6 text-indigo-700" aria-hidden="true" />
                <h2 id="a11y-dialog-title" className="text-lg font-black text-slate-900">
                  {tr(lang, 'תַּפְרִיט נְגִישׁוּת (ת״י 5568)', 'Accessibility Menu (SI 5568)', 'Menú de Accesibilidad (SI 5568)')}
                </h2>
              </div>
              <button
                type="button"
                onClick={() => setOpen(false)}
                aria-label={tr(lang, 'סְגוֹר תַּפְרִיט נְגִישׁוּת', 'Close accessibility menu', 'Cerrar menú de accesibilidad')}
                className="p-2 rounded-full hover:bg-slate-100 text-slate-600 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-sm">
              {/* Text Size */}
              <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200 flex items-center justify-between gap-2">
                <span className="font-bold text-slate-800 flex items-center gap-2">
                  <Type className="w-4 h-4 text-indigo-600" aria-hidden="true" />
                  {tr(lang, 'גֹּדֶל טֶקְסְט', 'Text Size', 'Tamaño de Texto')}
                </span>
                <div className="flex gap-1.5">
                  {[
                    { val: 100, label: '100%' },
                    { val: 115, label: '115%' },
                    { val: 130, label: '130%' }
                  ].map((opt) => (
                    <button
                      key={opt.val}
                      type="button"
                      aria-pressed={prefs.fontSize === opt.val}
                      onClick={() => {
                        playSound('pop');
                        setPrefs((p) => ({ ...p, fontSize: opt.val }));
                      }}
                      className={`px-2.5 py-1 rounded-xl font-black text-xs cursor-pointer border ${
                        prefs.fontSize === opt.val
                          ? 'bg-indigo-700 text-white border-indigo-700'
                          : 'bg-white text-slate-700 border-slate-300'
                      }`}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Toggles Grid */}
              <div className="grid grid-cols-2 gap-2.5">
                <button
                  type="button"
                  aria-pressed={prefs.highContrast}
                  onClick={() => toggle('highContrast')}
                  className={`p-3 rounded-2xl border-2 font-bold text-xs flex items-center gap-2 cursor-pointer text-start ${
                    prefs.highContrast ? 'bg-slate-900 text-yellow-300 border-yellow-400' : 'bg-white text-slate-800 border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  <Eye className="w-4 h-4 flex-shrink-0" aria-hidden="true" />
                  <span>{tr(lang, 'נִגּוּדִיּוּת גְּבוֹהָה', 'High Contrast', 'Alto Contraste')}</span>
                </button>

                <button
                  type="button"
                  aria-pressed={prefs.grayscale}
                  onClick={() => toggle('grayscale')}
                  className={`p-3 rounded-2xl border-2 font-bold text-xs flex items-center gap-2 cursor-pointer text-start ${
                    prefs.grayscale ? 'bg-indigo-700 text-white border-indigo-800' : 'bg-white text-slate-800 border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  <Sparkles className="w-4 h-4 flex-shrink-0" aria-hidden="true" />
                  <span>{tr(lang, 'גְּוָנֵי אָפֹר', 'Grayscale', 'Escala de Grises')}</span>
                </button>

                <button
                  type="button"
                  aria-pressed={prefs.reduceMotion}
                  onClick={() => toggle('reduceMotion')}
                  className={`p-3 rounded-2xl border-2 font-bold text-xs flex items-center gap-2 cursor-pointer text-start ${
                    prefs.reduceMotion ? 'bg-indigo-700 text-white border-indigo-800' : 'bg-white text-slate-800 border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  <PauseCircle className="w-4 h-4 flex-shrink-0" aria-hidden="true" />
                  <span>{tr(lang, 'עֲצִירַת אָנִימַצְיוֹת', 'Stop Animations', 'Detener Animaciones')}</span>
                </button>

                <button
                  type="button"
                  aria-pressed={prefs.highlightLinks}
                  onClick={() => toggle('highlightLinks')}
                  className={`p-3 rounded-2xl border-2 font-bold text-xs flex items-center gap-2 cursor-pointer text-start ${
                    prefs.highlightLinks ? 'bg-indigo-700 text-white border-indigo-800' : 'bg-white text-slate-800 border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  <Type className="w-4 h-4 flex-shrink-0" aria-hidden="true" />
                  <span>{tr(lang, 'הַדְגָּשַׁת פְּקָדִים', 'Highlight Controls', 'Resaltar Controles')}</span>
                </button>

                <button
                  type="button"
                  aria-pressed={prefs.readableFont}
                  onClick={() => toggle('readableFont')}
                  className={`p-3 rounded-2xl border-2 font-bold text-xs flex items-center gap-2 cursor-pointer text-start ${
                    prefs.readableFont ? 'bg-indigo-700 text-white border-indigo-800' : 'bg-white text-slate-800 border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  <Type className="w-4 h-4 flex-shrink-0" aria-hidden="true" />
                  <span>{tr(lang, 'גּוֹפָן קָרִיא', 'Readable Font', 'Fuente Legible')}</span>
                </button>

                {!isTouch && (
                  <button
                    type="button"
                    aria-pressed={!kidCursorEnabled}
                    onClick={() => {
                      playSound('pop');
                      setKidCursorEnabled(!kidCursorEnabled);
                    }}
                    className={`p-3 rounded-2xl border-2 font-bold text-xs flex items-center gap-2 cursor-pointer text-start ${
                      !kidCursorEnabled ? 'bg-indigo-700 text-white border-indigo-800' : 'bg-white text-slate-800 border-slate-200 hover:bg-slate-50'
                    }`}
                  >
                    <MousePointer2 className="w-4 h-4 flex-shrink-0" aria-hidden="true" />
                    <span>{tr(lang, 'סַמָּן מַעֲרֶכֶת רָגִיל', 'Standard Cursor', 'Cursor Estándar')}</span>
                  </button>
                )}
              </div>

              {/* Accessibility Statement Link & Reset */}
              <div className="flex items-center justify-between pt-3 border-t border-slate-200">
                <a
                  href="/accessibility.html"
                  className="inline-flex items-center gap-1.5 text-xs font-black text-indigo-700 hover:underline"
                >
                  <span>{tr(lang, 'הַצְהָרַת נְגִישׁוּת מְלֵאָה', 'Accessibility Statement', 'Declaración de Accesibilidad')}</span>
                  <ExternalLink className="w-3.5 h-3.5" aria-hidden="true" />
                </a>

                <button
                  type="button"
                  onClick={resetAll}
                  className="inline-flex items-center gap-1 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold cursor-pointer"
                >
                  <RotateCcw className="w-3.5 h-3.5" aria-hidden="true" />
                  <span>{tr(lang, 'אִפּוּס', 'Reset', 'Restablecer')}</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
