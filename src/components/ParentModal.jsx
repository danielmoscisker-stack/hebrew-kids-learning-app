import React, { useState, useEffect } from 'react';
import { X, Lock, Languages, Sparkles, ShieldCheck, MousePointer2, RotateCcw } from 'lucide-react';
import { playSound, playAudioFile } from '../utils/audio';
import { useDeviceType } from '../utils/useDeviceType';

/**
 * Parental Gate + Settings / Pedagogy Guide Modal.
 * Follows Google Play "Designed for Families" & Apple Kids Category standards:
 * a simple arithmetic check keeps 4-year-olds from leaving Hebrew or changing settings.
 */
export default function ParentModal({
  open,
  onClose,
  lang,
  setLang,
  kidCursorEnabled,
  setKidCursorEnabled,
  onResetStars
}) {
  const isHe = lang === 'he';
  const { isTouch } = useDeviceType();
  const [unlocked, setUnlocked] = useState(false);
  const [challenge, setChallenge] = useState({ a: 4, b: 3, options: [6, 7, 8, 9] });
  const [wrong, setWrong] = useState(false);

  useEffect(() => {
    if (open) {
      setUnlocked(false);
      setWrong(false);
      const a = 3 + Math.floor(Math.random() * 5);
      const b = 2 + Math.floor(Math.random() * 4);
      const ans = a + b;
      const opts = new Set([ans]);
      while (opts.size < 4) {
        opts.add(ans + (Math.floor(Math.random() * 5) - 2) || ans + 3);
      }
      setChallenge({ a, b, ans, options: [...opts].sort(() => 0.5 - Math.random()) });
      playAudioFile('/audio/phrases/parents_only.mp3');
    }
  }, [open]);

  if (!open) return null;

  const toggleLanguage = () => {
    playSound('pop');
    const newLang = isHe ? 'en' : 'he';
    setLang(newLang);
    document.documentElement.lang = newLang;
    document.documentElement.dir = newLang === 'he' ? 'rtl' : 'ltr';
  };

  return (
    <div
      className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4"
      dir={isHe ? 'rtl' : 'ltr'}
    >
      <div className="bg-white rounded-3xl max-w-xl w-full p-6 md:p-7 shadow-2xl border-4 border-amber-300 max-h-[90vh] overflow-y-auto animate-pop-in">
        <div className="flex items-center justify-between pb-3 border-b border-slate-200 mb-4">
          <div className="flex items-center gap-2">
            {unlocked ? (
              <Sparkles className="w-6 h-6 text-pink-500" />
            ) : (
              <Lock className="w-6 h-6 text-indigo-600" />
            )}
            <h3 className="text-xl font-black text-slate-800">
              {unlocked
                ? isHe
                  ? 'אֵזוֹר הוֹרִים וְגַנָּנוֹת'
                  : 'Parents & Educators'
                : isHe
                  ? 'אֵזוֹר הוֹרִים בִּלְבַד'
                  : 'For Parents Only'}
            </h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-full hover:bg-slate-100 text-slate-500 cursor-pointer"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {!unlocked ? (
          <div className="text-center py-4 flex flex-col items-center gap-4">
            <p className="text-slate-600 font-bold text-base">
              {isHe
                ? 'כְּדֵי לְהִכָּנֵס לַהַגְדָּרוֹת, פִּתְרוּ אֶת הַתַּרְגִּיל:'
                : 'To access parent settings, solve this quick question:'}
            </p>
            <div className="text-4xl font-black text-indigo-700 bg-indigo-50 border-2 border-indigo-200 px-8 py-4 rounded-2xl" dir="ltr">
              {challenge.a} + {challenge.b} = ?
            </div>
            <div className="grid grid-cols-4 gap-3 w-full max-w-xs">
              {challenge.options.map((opt) => (
                <button
                  key={opt}
                  type="button"
                  onClick={() => {
                    if (opt === challenge.ans) {
                      playSound('star');
                      setUnlocked(true);
                    } else {
                      playSound('whoosh');
                      setWrong(true);
                    }
                  }}
                  className="py-3 rounded-2xl bg-amber-100 hover:bg-amber-200 border-2 border-amber-400 font-black text-xl text-slate-900 btn-press-3d cursor-pointer"
                >
                  {opt}
                </button>
              ))}
            </div>
            {wrong && (
              <p className="text-sm font-bold text-rose-600">
                {isHe ? 'נַסּוּ שׁוּב :)' : 'Try again :)'}
              </p>
            )}
          </div>
        ) : (
          <div className="space-y-4 text-sm text-slate-700">
            {/* Settings Row */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <button
                type="button"
                onClick={toggleLanguage}
                className="flex items-center justify-center gap-2 px-4 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-black rounded-2xl btn-press-3d cursor-pointer"
              >
                <Languages className="w-5 h-5" />
                <span>{isHe ? 'Switch to English 🇬🇧' : 'הַחֲלֵף לְעִבְרִית 🇮🇱'}</span>
              </button>

              {!isTouch && (
                <button
                  type="button"
                  onClick={() => {
                    playSound('pop');
                    setKidCursorEnabled(!kidCursorEnabled);
                  }}
                  className={`flex items-center justify-center gap-2 px-4 py-3 font-black rounded-2xl border-2 btn-press-3d cursor-pointer ${
                    kidCursorEnabled
                      ? 'bg-amber-100 border-amber-400 text-amber-950'
                      : 'bg-slate-100 border-slate-300 text-slate-700'
                  }`}
                >
                  <MousePointer2 className="w-5 h-5" />
                  <span>
                    {isHe
                      ? `סַמָּן עַכְבָּר גָּדוֹל: ${kidCursorEnabled ? 'פָּעִיל ⭐' : 'כָּבוּי'}`
                      : `Big Kid Cursor: ${kidCursorEnabled ? 'ON ⭐' : 'OFF'}`}
                  </span>
                </button>
              )}
            </div>

            {/* Pedagogy & Privacy Summary */}
            <div className="p-3.5 bg-amber-50 rounded-2xl border border-amber-200 leading-relaxed">
              <h4 className="font-black text-amber-900 mb-1">
                {isHe
                  ? 'תְּאִימוּת לְתָכְנִית מִשְׂרַד הַחִנּוּךְ (גִּילָאֵי 4–5):'
                  : 'Curriculum & Play Psychology (Ages 4–5):'}
              </h4>
              <p className="text-xs md:text-sm">
                {isHe
                  ? 'מודעות פונולוגית, שיטת "הפופיק" לדגש קל (בּ/ב, כּ/כ, פּ/פ), תנועות יסוד והבעות פנים, קריאה מימין לשמאל ברכבת הקריאה, וספירה חד-חד-ערכית 1–10 עם משוב חיובי ללא ענישה.'
                  : 'Phonological awareness, Pupik somatic dagesh method, vowel mouth cues, right-to-left reading train, and 1-to-1 counting 1–10 with zero-punishment encouragement.'}
              </p>
            </div>

            <div className="p-3.5 bg-emerald-50 rounded-2xl border border-emerald-200 flex items-start gap-2.5">
              <ShieldCheck className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" />
              <p className="text-xs md:text-sm text-emerald-950 font-medium">
                {isHe
                  ? 'פְּרָטִיּוּת מְלֵאָה לִילָדִים: 100% אופליין, ללא פרסומות, ללא מעקב וללא איסוף מידע אישי. ההתקדמות נשמרת מקומית על המכשיר בלבד.'
                  : '100% Kid-Safe & Private: Runs completely offline with zero ads, zero analytics, and zero personal data collection. Progress stays locally on this device.'}
              </p>
            </div>

            <div className="flex items-center justify-between pt-2">
              <button
                type="button"
                onClick={() => {
                  onResetStars();
                  playSound('whoosh');
                }}
                className="flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-rose-600 px-3 py-2 rounded-xl cursor-pointer"
              >
                <RotateCcw className="w-4 h-4" />
                <span>{isHe ? 'אִפּוּס כּוֹכָבִים' : 'Reset Stars'}</span>
              </button>

              <button
                type="button"
                onClick={onClose}
                className="px-6 py-2.5 bg-amber-400 hover:bg-amber-500 font-black text-slate-900 rounded-2xl shadow btn-press-3d cursor-pointer"
              >
                {isHe ? 'סְגוֹר' : 'Close'}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
