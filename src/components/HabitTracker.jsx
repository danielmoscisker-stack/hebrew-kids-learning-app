import React, { useState } from 'react';
import {
  Star,
  Check,
  Clock,
  Lock,
  Unlock,
  Plus,
  Trash2,
  Gift,
  ShoppingBag,
  Sparkles,
  Trophy,
  Volume2,
  ShieldCheck,
  X
} from 'lucide-react';
import {
  PRIZE_PRESETS,
  CUSTOM_HABIT_ICONS,
  CUSTOM_PRIZE_ICONS
} from '../data/habitTrackerData';
import { getTodayHabitLog, createDefaultHabitEntry } from '../utils/habitTracker';
import { localTodayStr } from '../utils/playLimits';
import { playSound } from '../utils/audio';
import { triggerConfetti, triggerStarBurst } from '../utils/confetti';
import { tr } from '../utils/i18n';
import { speakPersonalText } from '../utils/personalize';
import ParentGate from './ParentGate';

export default function HabitTracker({
  lang,
  soundEnabled,
  kidName = '',
  kidAge = 4,
  stars = 0,
  habitEntry,
  profiles = [],
  activeProfileId = null,
  habitTrackersMap = {},
  pinRecord = null,
  biometricRecord = null,
  onKidToggleHabit,
  onParentApproveHabit,
  onParentRejectHabit,
  onParentApproveAllPending,
  onSetBedtime,
  onAddHabit,
  onDeleteHabit,
  onSetTrackingMode,
  onAddGoal,
  onClaimGoal,
  onDeleteGoal,
  onGoToShop
}) {
  const isHe = lang === 'he';
  const today = localTodayStr();
  const todayLog = getTodayHabitLog(habitEntry, today);
  const habits = habitEntry?.habits || [];
  const goals = habitEntry?.goals || [];
  const trackingMode =
    habitEntry?.trackingMode || (habitEntry?.requireParentApproval === false ? 'kid_self' : 'parent_approval');
  const isAdultOnly = trackingMode === 'adult_only';
  const requireApproval = trackingMode !== 'kid_self';

  const [parentUnlocked, setParentUnlocked] = useState(false);
  const [chartProfileId, setChartProfileId] = useState(activeProfileId || null);
  const [showGate, setShowGate] = useState(false);

  // Parent Goal Builder state
  const [showGoalForm, setShowGoalForm] = useState(false);
  const [goalTitle, setGoalTitle] = useState('');
  const [goalIcon, setGoalIcon] = useState('🎁');
  const [goalTarget, setGoalTarget] = useState(10);
  const [goalHabitFilter, setGoalHabitFilter] = useState([]); // empty = any habit

  // Parent Custom Habit state
  const [showHabitForm, setShowHabitForm] = useState(false);
  const [habitTitle, setHabitTitle] = useState('');
  const [habitIcon, setHabitIcon] = useState('📚');
  const [habitStars, setHabitStars] = useState(2);

  // Bedtime input state
  const [bedtimeDraft, setBedtimeDraft] = useState(todayLog.bedtime || '20:00');

  const approvedCount = todayLog.approvedIds.length;
  const pendingCount = todayLog.pendingIds.length;
  const totalHabits = habits.length;
  const todayPct = totalHabits > 0 ? Math.round((approvedCount / totalHabits) * 100) : 0;

  const openParentGate = () => {
    playSound('pop');
    setShowGate(true);
  };

  const handleKidHabitPress = (habit, e) => {
    const isApproved = todayLog.approvedIds.includes(habit.id);
    const isPending = todayLog.pendingIds.includes(habit.id);

    if (parentUnlocked) {
      onParentApproveHabit(habit, today);
      if (!isApproved) {
        playSound('star');
        if (e?.currentTarget) {
          const r = e.currentTarget.getBoundingClientRect();
          triggerStarBurst(r.left + r.width / 2, r.top + r.height / 2);
        }
      } else {
        playSound('pop');
      }
      return;
    }

    if (isAdultOnly) {
      playSound('whoosh');
      openParentGate();
      return;
    }

    if (isApproved) {
      if (!requireApproval) {
        onKidToggleHabit(habit, today);
        playSound('whoosh');
        return;
      }
      playSound('pop');
      return;
    }

    if (!requireApproval) {
      onKidToggleHabit(habit, today);
      playSound('star');
      triggerConfetti({ x: 0.5, y: 0.6 });
      if (soundEnabled && kidName) {
        speakPersonalText(
          tr(lang, `כל הכבוד ${kidName}! קיבלת ${habit.stars} כוכבים!`, `Great job ${kidName}! You earned ${habit.stars} stars!`, `¡Muy bien ${kidName}! ¡Ganaste ${habit.stars} estrellas!`),
          lang
        );
      }
      return;
    }

    onKidToggleHabit(habit, today);
    playSound(isPending ? 'whoosh' : 'pop');
  };

  // Weekly 7-Day Chart target kid (defaults to active kid, switchable if multiple profiles exist)
  const effectiveChartId =
    chartProfileId && profiles.some((p) => p.id === chartProfileId) ? chartProfileId : activeProfileId;
  const chartProfile = profiles.find((p) => p.id === effectiveChartId) || null;
  const isViewingActiveKidChart = effectiveChartId === activeProfileId;
  const chartEntry = isViewingActiveKidChart
    ? habitEntry
    : habitTrackersMap[effectiveChartId || 'guest'] || createDefaultHabitEntry();
  const chartHabits = chartEntry?.habits || [];

  const localeCode = lang === 'he' ? 'he-IL' : lang === 'es' ? 'es-ES' : 'en-US';
  const last7Days = Array.from({ length: 7 }).map((_, offset) => {
    const d = new Date();
    d.setDate(d.getDate() - (6 - offset));
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    const key = `${y}-${m}-${day}`;
    const log = chartEntry?.logs?.[key] || { approvedIds: [], pendingIds: [], bedtime: '' };
    let weekday = '';
    try {
      weekday = new Intl.DateTimeFormat(localeCode, { weekday: 'short' }).format(d);
    } catch {
      weekday = `${day}/${m}`;
    }
    const approvedCountDay = (log.approvedIds || []).filter((id) =>
      chartHabits.some((h) => h.id === id)
    ).length;
    const pct = chartHabits.length > 0 ? Math.round((approvedCountDay / chartHabits.length) * 100) : 0;
    return {
      key,
      weekday,
      label: `${day}/${m}`,
      approvedIds: log.approvedIds || [],
      pendingIds: log.pendingIds || [],
      bedtime: log.bedtime || '',
      count: approvedCountDay,
      pct,
      isToday: key === today
    };
  });

  const activeGoals = goals.filter((g) => !g.claimed);
  const claimedGoals = goals.filter((g) => g.claimed);

  return (
    <div className="max-w-5xl mx-auto px-3 sm:px-5 pt-4 pb-10 flex flex-col gap-5" dir={isHe ? 'rtl' : 'ltr'}>
      {/* Hero Banner */}
      <div className="rounded-3xl p-5 sm:p-6 bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-600 text-white border-4 border-emerald-200 shadow-xl">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-white/25 backdrop-blur-sm border-2 border-white/50 flex items-center justify-center text-4xl shadow-inner flex-shrink-0">
              🌟
            </div>
            <div>
              <h2 className="text-2xl sm:text-3xl font-black leading-tight">
                {tr(
                  lang,
                  kidName ? `הַמְּשִׂימוֹת הַיּוֹמִיּוֹת שֶׁל ${kidName}` : 'מְשִׂימוֹת יוֹמִיּוֹת וּפְרָסִים',
                  kidName ? `${kidName}’s Daily Habits & Prizes` : 'Daily Habits & Prize Goals',
                  kidName ? `Hábitos y Premios de ${kidName}` : 'Hábitos Diarios y Premios'
                )}
              </h2>
              <p className="text-xs sm:text-sm font-bold text-white/95 mt-0.5">
                {tr(
                  lang,
                  'צַחְצְחוּ שִׁנַּיִם, לְכוּ לִישֹׁן בַּזְּמַן וְהַרְוִיחוּ כּוֹכָבִים לַחֲנוּת וּלְפְרָסִים מֵאִמָּא וְאַבָּא!',
                  'Brush teeth, go to bed on time & earn stars for the Star Shop and real-world parent prizes!',
                  '¡Lávate los dientes, duerme a tiempo y gana estrellas para la tienda y premios de tus padres!'
                )}
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {onGoToShop && (
              <button
                type="button"
                onClick={() => {
                  playSound('star');
                  onGoToShop();
                }}
                className="flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-amber-300 hover:bg-amber-400 text-amber-950 border-2 border-white font-black text-sm shadow-md btn-press-3d cursor-pointer"
              >
                <ShoppingBag className="w-4 h-4" />
                <span>{tr(lang, `חֲנוּת (${stars} ⭐)`, `Shop (${stars} ⭐)`, `Tienda (${stars} ⭐)`)}</span>
              </button>
            )}

            {parentUnlocked ? (
              <button
                type="button"
                onClick={() => {
                  playSound('pop');
                  setParentUnlocked(false);
                }}
                className="flex items-center gap-1.5 px-4 py-2.5 rounded-2xl bg-white text-emerald-900 border-2 border-emerald-200 font-black text-sm shadow-md btn-press-3d cursor-pointer"
              >
                <Unlock className="w-4 h-4 text-emerald-600" />
                <span>{tr(lang, 'נְעַל מַצַּב הוֹרֶה', 'Lock Parent Mode', 'Bloquear')}</span>
              </button>
            ) : (
              <button
                type="button"
                onClick={openParentGate}
                className="flex items-center gap-1.5 px-4 py-2.5 rounded-2xl bg-white/20 hover:bg-white/30 text-white border-2 border-white/50 font-black text-sm btn-press-3d cursor-pointer"
              >
                <Lock className="w-4 h-4" />
                <span>{tr(lang, 'מַצַּב הוֹרֶה (אִשּׁוּר וּפְרָסִים)', 'Parent Mode (Approve & Goals)', 'Modo Padres')}</span>
              </button>
            )}
          </div>
        </div>

        {/* Today's progress bar */}
        <div className="mt-4 bg-black/15 rounded-2xl p-3 flex flex-wrap items-center justify-between gap-3">
          <div className="flex-1 min-w-[200px]">
            <div className="flex items-center justify-between text-xs font-black mb-1">
              <span>{tr(lang, 'הַהִתְקַדְּמוּת שֶׁל הַיּוֹם:', "Today's Progress:", 'Progreso de hoy:')}</span>
              <bdi dir="ltr">
                {approvedCount}/{totalHabits} ({todayPct}%)
              </bdi>
            </div>
            <div className="w-full h-3 bg-white/25 rounded-full overflow-hidden">
              <div
                className="h-full bg-amber-300 rounded-full transition-all duration-500"
                style={{ width: `${todayPct}%` }}
              />
            </div>
          </div>

          {pendingCount > 0 && (
            <span className="px-3 py-1 rounded-full bg-amber-300 text-amber-950 font-black text-xs">
              {tr(lang, `${pendingCount} מַמְתִּינִים לְאִשּׁוּר הוֹרֶה`, `${pendingCount} waiting for parent`, `${pendingCount} esperando aprobación`)}
            </span>
          )}
        </div>
      </div>

      {/* Inline Parent Gate Modal */}
      {showGate && !parentUnlocked && (
        <div className="bg-white rounded-3xl border-4 border-indigo-400 shadow-xl p-5 flex flex-col items-center text-center gap-3 animate-pop-in">
          <div className="flex items-center gap-2 font-black text-indigo-950 text-lg">
            <ShieldCheck className="w-6 h-6 text-indigo-600" />
            <span>{tr(lang, 'כְּנִיסָה לְמַצַּב הוֹרֶה', 'Unlock Parent Controls', 'Desbloquear Modo Padres')}</span>
          </div>
          <ParentGate
            lang={lang}
            hardMode={kidAge >= 7 || Boolean(pinRecord)}
            pinRecord={pinRecord}
            biometricRecord={biometricRecord}
            compact={true}
            onUnlock={() => {
              setParentUnlocked(true);
              setShowGate(false);
            }}
            onCancel={() => setShowGate(false)}
          />
        </div>
      )}

      {/* ===================== PARENT PRIZE GOALS SECTION ===================== */}
      <div className="bg-white rounded-3xl border-4 border-amber-300 shadow-lg p-4 sm:p-5 flex flex-col gap-4">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <Gift className="w-6 h-6 text-pink-500" />
            <h3 className="text-lg sm:text-xl font-black text-slate-900">
              {tr(lang, 'פְּרָסִים מֵהַהוֹרִים (יַעֲדֵי הַסְכָּמָה)', 'Parent Prize Goals', 'Metas de Premios con Padres')}
            </h3>
          </div>

          {parentUnlocked && (
            <button
              type="button"
              onClick={() => {
                playSound('pop');
                setShowGoalForm((s) => !s);
              }}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-2xl bg-pink-600 hover:bg-pink-700 text-white font-black text-xs sm:text-sm btn-press-3d cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>{tr(lang, 'הוֹסֵף יַעַד פְּרָס', 'Add Prize Goal', 'Añadir Premio')}</span>
            </button>
          )}
        </div>

        {/* Add Prize Goal Form (Parent Unlocked) */}
        {parentUnlocked && showGoalForm && (
          <div className="bg-pink-50 border-2 border-pink-200 rounded-2xl p-4 flex flex-col gap-3 animate-pop-in">
            <div className="text-xs font-black text-pink-900">
              {tr(lang, 'בַּחֲרוּ רַעְיוֹן אוֹ כִּתְבוּ פְּרָס מֻסְכָּם:', 'Pick a preset or type your agreed prize:', 'Elige un premio o escribe uno personalizado:')}
            </div>

            <div className="flex flex-wrap gap-1.5">
              {PRIZE_PRESETS.map((p) => (
                <button
                  key={p.id}
                  type="button"
                  onClick={() => {
                    playSound('pop');
                    setGoalIcon(p.icon);
                    setGoalTitle(tr(lang, p.titleHe, p.titleEn, p.titleEs));
                  }}
                  className="px-3 py-1.5 rounded-xl bg-white hover:bg-pink-100 border border-pink-300 text-xs font-black text-slate-800 cursor-pointer"
                >
                  {p.icon} {tr(lang, p.titleHe, p.titleEn, p.titleEs)}
                </button>
              ))}
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <div className="flex gap-1 flex-wrap">
                {CUSTOM_PRIZE_ICONS.map((ic) => (
                  <button
                    key={ic}
                    type="button"
                    onClick={() => setGoalIcon(ic)}
                    className={`w-9 h-9 rounded-xl border text-lg cursor-pointer ${
                      goalIcon === ic ? 'bg-pink-600 border-pink-700 scale-105' : 'bg-white border-pink-200'
                    }`}
                  >
                    {ic}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              <input
                type="text"
                value={goalTitle}
                onChange={(e) => setGoalTitle(e.target.value)}
                placeholder={tr(lang, 'לְמָשָׁל: גְּלִידָה עִם אַבָּא', 'e.g. Ice cream with Dad', 'Ej: Helado con Papá')}
                className="sm:col-span-2 px-3 py-2.5 rounded-xl bg-white border-2 border-pink-200 font-bold text-sm"
              />
              <div className="flex items-center gap-2 bg-white px-3 py-1.5 rounded-xl border-2 border-pink-200">
                <span className="text-xs font-black text-slate-600">
                  {tr(lang, 'כַּמָּה פְּעָמִים:', 'Target:', 'Meta:')}
                </span>
                <input
                  type="number"
                  min={1}
                  max={100}
                  value={goalTarget}
                  onChange={(e) => setGoalTarget(Math.max(1, Math.min(100, Number(e.target.value) || 1)))}
                  className="w-16 text-center font-black text-sm border border-slate-200 rounded-lg py-1"
                  dir="ltr"
                />
              </div>
            </div>

            {/* Optional: select specific habits that count toward this goal */}
            <div>
              <div className="text-xs font-black text-slate-700 mb-1.5">
                {tr(
                  lang,
                  'אֵילוּ מְשִׂימוֹת נִסְפָּרוֹת לַיַּעַד? (לְלֹא בְּחִירָה = כָּל מְשִׂימָה):',
                  'Which habits count? (None selected = all habits count):',
                  '¿Qué hábitos cuentan? (Ninguno = todos):'
                )}
              </div>
              <div className="flex flex-wrap gap-1.5">
                {habits.map((h) => {
                  const selected = goalHabitFilter.includes(h.id);
                  return (
                    <button
                      key={h.id}
                      type="button"
                      onClick={() =>
                        setGoalHabitFilter((prev) =>
                          prev.includes(h.id) ? prev.filter((x) => x !== h.id) : [...prev, h.id]
                        )
                      }
                      className={`px-2.5 py-1 rounded-xl text-xs font-black border cursor-pointer ${
                        selected
                          ? 'bg-indigo-600 text-white border-indigo-700'
                          : 'bg-white text-slate-700 border-slate-300'
                      }`}
                    >
                      {h.icon} {tr(lang, h.titleHe, h.titleEn, h.titleEs)}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setShowGoalForm(false)}
                className="px-4 py-2 rounded-xl bg-white border border-slate-300 font-bold text-xs cursor-pointer"
              >
                {tr(lang, 'בִּטּוּל', 'Cancel', 'Cancelar')}
              </button>
              <button
                type="button"
                onClick={() => {
                  if (!goalTitle.trim()) return;
                  playSound('star');
                  onAddGoal({
                    icon: goalIcon,
                    title: goalTitle.trim(),
                    targetCount: goalTarget,
                    habitIds: goalHabitFilter
                  });
                  setGoalTitle('');
                  setGoalHabitFilter([]);
                  setShowGoalForm(false);
                }}
                className="px-5 py-2 rounded-xl bg-pink-600 hover:bg-pink-700 text-white font-black text-xs sm:text-sm cursor-pointer"
              >
                {tr(lang, 'שְׁמֹר יַעַד פְּרָס ✓', 'Save Prize Goal ✓', 'Guardar Premio ✓')}
              </button>
            </div>
          </div>
        )}

        {activeGoals.length === 0 ? (
          <div className="bg-amber-50 border-2 border-dashed border-amber-300 rounded-2xl p-4 text-center text-sm font-bold text-amber-900">
            {tr(
              lang,
              'הוֹרִים יְכוֹלִים לִלְחֹץ עַל "מַצַּב הוֹרֶה" כְּדֵי לְהַגְדִּיר פְּרָס מֻסְכָּם (כְּמוֹ "יְצִיאָה עִם אַבָּא" אוֹ "מַתָּנָה")!',
              'Parents can unlock Parent Mode above to set a real-world prize goal (like "Outing with Dad" or "Special Present")!',
              '¡Los padres pueden abrir el Modo Padres arriba para fijar un premio real!'
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {activeGoals.map((goal) => {
              const pct = Math.min(100, Math.round((goal.currentCount / Math.max(1, goal.targetCount)) * 100));
              const ready = goal.currentCount >= goal.targetCount;
              return (
                <div
                  key={goal.id}
                  className={`rounded-2xl border-3 p-4 flex flex-col gap-2.5 ${
                    ready ? 'bg-emerald-50 border-emerald-400 shadow-md' : 'bg-amber-50/70 border-amber-200'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-2.5">
                      <span className="text-3xl">{goal.icon}</span>
                      <div>
                        <div className="font-black text-base text-slate-900">{goal.title}</div>
                        <div className="text-xs font-bold text-slate-600">
                          <bdi dir="ltr">
                            {goal.currentCount} / {goal.targetCount}
                          </bdi>{' '}
                          {tr(lang, 'מְשִׂימוֹת הֻשְׁלְמוּ', 'habits completed', 'hábitos completados')}
                        </div>
                      </div>
                    </div>

                    {parentUnlocked && (
                      <button
                        type="button"
                        onClick={() => onDeleteGoal(goal.id)}
                        className="p-1.5 text-slate-400 hover:text-rose-600 cursor-pointer"
                        aria-label="Delete goal"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>

                  <div className="w-full h-3 bg-white rounded-full overflow-hidden border border-amber-200">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${
                        ready ? 'bg-emerald-500' : 'bg-gradient-to-r from-pink-500 to-amber-400'
                      }`}
                      style={{ width: `${pct}%` }}
                    />
                  </div>

                  {ready && (
                    <div className="flex items-center justify-between gap-2 pt-1">
                      <span className="text-xs font-black text-emerald-800 flex items-center gap-1">
                        <Trophy className="w-4 h-4" />
                        {tr(lang, '🎉 הַפְּרָס מוּכָן! תֵּהָנוּ!', '🎉 Prize Ready to Claim!', '🎉 ¡Premio listo!')}
                      </span>
                      {parentUnlocked && (
                        <button
                          type="button"
                          onClick={() => {
                            playSound('win');
                            triggerConfetti();
                            onClaimGoal(goal.id);
                          }}
                          className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs cursor-pointer"
                        >
                          {tr(lang, 'סַמֵּן שֶׁנִּתַּן ✓', 'Mark Claimed ✓', 'Marcar entregado ✓')}
                        </button>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}

        {claimedGoals.length > 0 && (
          <div className="flex flex-wrap items-center gap-2 pt-1 text-xs font-bold text-slate-500">
            <span>{tr(lang, 'פְּרָסִים שֶׁכְּבָר הֻשְּׂגוּ:', 'Claimed Prizes:', 'Premios ganados:')}</span>
            {claimedGoals.slice(-4).map((g) => (
              <span key={g.id} className="px-2.5 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-900">
                {g.icon} {g.title} ✓
              </span>
            ))}
          </div>
        )}
      </div>

      {/* ===================== PARENT QUICK BAR (APPROVAL + BEDTIME + CUSTOM HABIT) ===================== */}
      <div className="bg-white rounded-3xl border-4 border-sky-200 shadow-md p-4 sm:p-5 flex flex-col gap-4">
        {/* Bedtime Logger + Parent Quick Controls */}
        <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2.5">
            <Clock className="w-5 h-5 text-indigo-600" />
            <span className="font-black text-sm text-slate-800">
              {tr(lang, '🌙 שְׁעַת שֵׁנָה הַיּוֹם:', "Today's Bedtime:", 'Hora de dormir hoy:')}
            </span>
            <input
              type="time"
              value={bedtimeDraft}
              disabled={isAdultOnly && !parentUnlocked}
              onChange={(e) => {
                setBedtimeDraft(e.target.value);
                onSetBedtime(today, e.target.value);
              }}
              className={`px-2.5 py-1 rounded-xl border-2 border-indigo-200 font-black text-sm text-indigo-950 bg-indigo-50 ${
                isAdultOnly && !parentUnlocked ? 'opacity-70 cursor-not-allowed' : ''
              }`}
              dir="ltr"
            />
          </div>

          {parentUnlocked && (
            <div className="flex flex-wrap items-center gap-2">
              {pendingCount > 0 && (
                <button
                  type="button"
                  onClick={() => {
                    playSound('win');
                    triggerConfetti();
                    onParentApproveAllPending(today);
                  }}
                  className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs sm:text-sm flex items-center gap-1.5 shadow-sm cursor-pointer"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>{tr(lang, `אַשֵּׁר הַכֹּל (${pendingCount}) ⭐`, `Approve All (${pendingCount}) ⭐`, `Aprobar todo (${pendingCount}) ⭐`)}</span>
                </button>
              )}

              {/* 3-Way Marking Mode Selector */}
              <div className="flex flex-wrap items-center bg-slate-100 border border-slate-300 rounded-xl p-0.5 gap-0.5">
                {[
                  {
                    id: 'adult_only',
                    he: '🔒 הוֹרֶה בִּלְבַד',
                    en: '🔒 Adult Only',
                    es: '🔒 Solo Padres'
                  },
                  {
                    id: 'parent_approval',
                    he: '🙋 יֶלֶד + אִשּׁוּר',
                    en: '🙋 Kid + Approval',
                    es: '🙋 Niño + Aprob.'
                  },
                  {
                    id: 'kid_self',
                    he: '✅ סִמּוּן עַצְמִי',
                    en: '✅ Kid Self-Check',
                    es: '✅ Auto-marcado'
                  }
                ].map((m) => {
                  const active = trackingMode === m.id;
                  return (
                    <button
                      key={m.id}
                      type="button"
                      onClick={() => {
                        playSound('pop');
                        onSetTrackingMode?.(m.id);
                      }}
                      className={`px-2.5 py-1.5 rounded-lg font-black text-[11px] sm:text-xs transition cursor-pointer ${
                        active
                          ? 'bg-indigo-600 text-white shadow-xs'
                          : 'text-slate-700 hover:bg-white'
                      }`}
                    >
                      {tr(lang, m.he, m.en, m.es)}
                    </button>
                  );
                })}
              </div>

              <button
                type="button"
                onClick={() => setShowHabitForm((s) => !s)}
                className="px-3 py-2 rounded-xl bg-sky-600 hover:bg-sky-700 text-white font-black text-xs flex items-center gap-1 cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>{tr(lang, 'מְשִׂימָה חֲדָשָׁה', 'Add Habit', 'Añadir Hábito')}</span>
              </button>
            </div>
          )}
        </div>

        {/* Add Custom Habit Form */}
        {parentUnlocked && showHabitForm && (
          <div className="bg-sky-50 border-2 border-sky-200 rounded-2xl p-3.5 flex flex-col gap-2.5 animate-pop-in">
            <div className="flex flex-wrap gap-1">
              {CUSTOM_HABIT_ICONS.map((ic) => (
                <button
                  key={ic}
                  type="button"
                  onClick={() => setHabitIcon(ic)}
                  className={`w-9 h-9 rounded-xl border text-lg cursor-pointer ${
                    habitIcon === ic ? 'bg-sky-600 border-sky-700' : 'bg-white border-sky-200'
                  }`}
                >
                  {ic}
                </button>
              ))}
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <input
                type="text"
                value={habitTitle}
                onChange={(e) => setHabitTitle(e.target.value)}
                placeholder={tr(lang, 'שֵׁם הַמְּשִׂימָה (לְמָשָׁל: הֲכָנַת תִּיק)', 'Habit name (e.g. Pack school bag)', 'Nombre del hábito')}
                className="flex-1 min-w-[200px] px-3 py-2 rounded-xl bg-white border-2 border-sky-200 font-bold text-sm"
              />
              <select
                value={habitStars}
                onChange={(e) => setHabitStars(Number(e.target.value))}
                className="px-3 py-2 rounded-xl bg-white border-2 border-sky-200 font-black text-sm"
              >
                {[1, 2, 3, 4, 5].map((n) => (
                  <option key={n} value={n}>
                    +{n} ⭐
                  </option>
                ))}
              </select>
              <button
                type="button"
                onClick={() => {
                  if (!habitTitle.trim()) return;
                  playSound('star');
                  onAddHabit({ icon: habitIcon, title: habitTitle.trim(), stars: habitStars });
                  setHabitTitle('');
                  setShowHabitForm(false);
                }}
                className="px-4 py-2 rounded-xl bg-sky-600 hover:bg-sky-700 text-white font-black text-xs sm:text-sm cursor-pointer"
              >
                {tr(lang, 'הוֹסֵף ✓', 'Add ✓', 'Añadir ✓')}
              </button>
            </div>
          </div>
        )}

        {/* Daily Habits Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {habits.map((habit) => {
            const isApproved = todayLog.approvedIds.includes(habit.id);
            const isPending = todayLog.pendingIds.includes(habit.id);
            const isRejected = (todayLog.rejectedIds || []).includes(habit.id);
            const title = tr(lang, habit.titleHe, habit.titleEn, habit.titleEs);

            return (
              <div
                key={habit.id}
                className={`rounded-2xl border-3 p-3.5 flex flex-col justify-between gap-3 transition ${
                  isApproved
                    ? 'bg-emerald-50 border-emerald-400 shadow-sm'
                    : isPending
                      ? 'bg-amber-50 border-amber-400 shadow-sm'
                      : isRejected
                        ? 'bg-rose-50/60 border-rose-300'
                        : 'bg-slate-50 border-slate-200 hover:border-sky-300'
                }`}
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2.5">
                    <span className="text-3xl flex-shrink-0">{habit.icon}</span>
                    <div>
                      <div className="font-black text-sm sm:text-base text-slate-900 leading-snug">{title}</div>
                      <span className="inline-flex items-center gap-0.5 text-xs font-black text-amber-800 bg-amber-100 px-2 py-0.5 rounded-full mt-1">
                        <Star className="w-3 h-3 text-amber-500 fill-amber-400" />
                        <bdi dir="ltr">+{habit.stars}</bdi>
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      onClick={() => speakPersonalText(title, lang)}
                      aria-label={tr(lang, 'הַקְרֵא', 'Read aloud', 'Leer')}
                      className="p-1.5 rounded-full hover:bg-white text-indigo-600 cursor-pointer"
                    >
                      <Volume2 className="w-4 h-4" />
                    </button>
                    {parentUnlocked && (
                      <button
                        type="button"
                        onClick={() => onDeleteHabit(habit.id)}
                        aria-label="Delete habit"
                        className="p-1.5 rounded-full hover:bg-rose-50 text-slate-400 hover:text-rose-600 cursor-pointer"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>

                {isRejected && !isApproved && !isPending && (
                  <div className="text-[11px] font-black text-rose-700 bg-rose-100 border border-rose-200 rounded-lg px-2.5 py-1 text-center">
                    {tr(lang, 'לֹא אֻשַּׁר עַל יְדֵי הוֹרֶה — נַסּוּ שׁוּב', 'Not approved by parent — try again', 'No aprobado — intenta de nuevo')}
                  </div>
                )}

                {isPending && parentUnlocked ? (
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={(e) => handleKidHabitPress(habit, e)}
                      className="flex-1 py-2.5 px-2.5 rounded-xl font-black text-xs sm:text-sm flex items-center justify-center gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm btn-press-3d cursor-pointer transition"
                    >
                      <Check className="w-4 h-4" />
                      <span>{tr(lang, `אַשֵּׁר +${habit.stars} ⭐`, `Approve +${habit.stars} ⭐`, `Aprobar +${habit.stars} ⭐`)}</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        playSound('whoosh');
                        onParentRejectHabit?.(habit, today);
                      }}
                      className="py-2.5 px-3 rounded-xl font-black text-xs sm:text-sm flex items-center justify-center gap-1 bg-rose-500 hover:bg-rose-600 text-white shadow-sm btn-press-3d cursor-pointer transition"
                    >
                      <X className="w-4 h-4" />
                      <span>{tr(lang, 'דְּחֵה', 'Reject', 'Rechazar')}</span>
                    </button>
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={(e) => handleKidHabitPress(habit, e)}
                    className={`w-full py-2.5 px-3 rounded-xl font-black text-xs sm:text-sm flex items-center justify-center gap-1.5 btn-press-3d cursor-pointer transition ${
                      isApproved
                        ? 'bg-emerald-500 hover:bg-emerald-600 text-white shadow-xs'
                        : isPending
                          ? 'bg-amber-300 hover:bg-amber-400 text-amber-950'
                          : isAdultOnly && !parentUnlocked
                            ? 'bg-slate-100 hover:bg-slate-200 border-2 border-slate-300 text-slate-600'
                            : 'bg-white hover:bg-sky-100 border-2 border-sky-300 text-sky-950'
                    }`}
                  >
                    {isApproved ? (
                      <>
                        <Check className="w-4 h-4" />
                        <span>
                          {parentUnlocked
                            ? tr(lang, 'אֻשַּׁר ✓ (בַּטֵּל)', 'Approved ✓ (Undo)', 'Aprobado ✓ (Quitar)')
                            : !requireApproval
                              ? tr(lang, 'בֻּצַּע! ⭐ (לַחַץ לְהָסִיר)', 'Done! ⭐ (Tap to Remove)', '¡Hecho! ⭐ (Quitar)')
                              : tr(lang, 'בֻּצַּע וְאֻשַּׁר! ⭐', 'Done & Approved! ⭐', '¡Hecho y aprobado! ⭐')}
                        </span>
                      </>
                    ) : isPending ? (
                      <span>{tr(lang, 'מַמְתִּין לְאִשּׁוּר ⏳ (לַחַץ לְהָסִיר)', 'Waiting ⏳ (Tap to Remove)', 'Esperando ⏳ (Toca para quitar)')}</span>
                    ) : (
                      <span>
                        {parentUnlocked
                          ? tr(lang, `סַמֵּן בֻּצַּע (+${habit.stars} ⭐)`, `Mark Done (+${habit.stars} ⭐)`, `Marcar (+${habit.stars} ⭐)`)
                          : isAdultOnly
                            ? tr(lang, '🔒 הוֹרֶה מְסַמֵּן בִּלְבַד', '🔒 Parent Marks Only', '🔒 Solo marca el adulto')
                            : tr(lang, 'עָשִׂיתִי אֶת זֶה! 🙋', 'I Did It! 🙋', '¡Lo hice! 🙋')}
                      </span>
                    )}
                  </button>
                )}
              </div>
            );
          })}
        </div>

      </div>

      {/* ===================== 7-DAY WEEKLY PROGRESS CHART (PER KID) ===================== */}
      <div className="bg-white rounded-3xl border-4 border-indigo-200 shadow-lg p-4 sm:p-5 flex flex-col gap-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h3 className="text-lg sm:text-xl font-black text-slate-900 flex items-center gap-2">
              <span>📅</span>
              <span>
                {tr(
                  lang,
                  chartProfile?.name ? `טַבְלַת שָׁבוּעַ (7 יָמִים) — ${chartProfile.name}` : 'טַבְלַת שָׁבוּעַ (7 יָמִים)',
                  chartProfile?.name ? `7-Day Weekly Chart — ${chartProfile.name}` : '7-Day Weekly Chart',
                  chartProfile?.name ? `Gráfico Semanal (7 días) — ${chartProfile.name}` : 'Gráfico Semanal (7 días)'
                )}
              </span>
            </h3>
            <p className="text-xs font-bold text-slate-500 mt-0.5">
              {tr(
                lang,
                'מַעֲקָב יוֹמִי אַחֲרֵי כָּל מְשִׂימָה וּשְׁעַת שֵׁנָה בְּמֶשֶׁךְ 7 הַיָּמִים הָאַחֲרוֹנִים',
                'See what was completed or missed each day across the 7-day week',
                'Mira lo que hizo o faltó cada día durante la semana de 7 días'
              )}
            </p>
          </div>

          {/* Multi-kid switcher if family has 2+ profiles */}
          {profiles.length > 1 && (
            <div className="flex flex-wrap items-center gap-1.5">
              {profiles.map((p) => {
                const selected = p.id === effectiveChartId;
                return (
                  <button
                    key={p.id}
                    type="button"
                    onClick={() => {
                      playSound('pop');
                      setChartProfileId(p.id);
                    }}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-2xl font-black text-xs border-2 transition cursor-pointer ${
                      selected
                        ? 'bg-indigo-600 text-white border-indigo-700 shadow-sm'
                        : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-indigo-50'
                    }`}
                  >
                    <span>{p.avatar || '👦'}</span>
                    <span>{p.name}</span>
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* 7-Day Visual Completion Bar Chart */}
        <div className="bg-slate-50 rounded-2xl border border-slate-200 p-3 sm:p-4">
          <div className="grid grid-cols-7 gap-2 items-end h-28" dir="ltr">
            {last7Days.map((day) => (
              <div key={day.key} className="flex flex-col items-center justify-end h-full gap-1">
                <span className="text-[10px] font-black text-slate-600">{day.pct}%</span>
                <div className="w-full max-w-[34px] flex-1 bg-slate-200 rounded-t-xl overflow-hidden flex items-end">
                  <div
                    className={`w-full rounded-t-xl transition-all duration-500 ${
                      day.pct >= 80
                        ? 'bg-emerald-500'
                        : day.pct >= 40
                          ? 'bg-amber-400'
                          : day.pct > 0
                            ? 'bg-sky-400'
                            : 'bg-slate-300'
                    }`}
                    style={{ height: `${Math.max(day.pct > 0 ? 12 : 4, day.pct)}%` }}
                  />
                </div>
                <span className={`text-[10px] font-black ${day.isToday ? 'text-indigo-700' : 'text-slate-500'}`}>
                  {day.weekday}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Detailed 7-Day Matrix (Habits × Days) */}
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-xs sm:text-sm">
            <thead>
              <tr className="border-b-2 border-slate-200">
                <th className="py-2 px-2 text-start font-black text-slate-700 min-w-[140px]">
                  {tr(lang, 'מְשִׂימָה', 'Habit', 'Hábito')}
                </th>
                {last7Days.map((day) => (
                  <th
                    key={day.key}
                    className={`py-2 px-1.5 text-center font-black min-w-[52px] rounded-t-xl ${
                      day.isToday ? 'bg-indigo-50 text-indigo-900' : 'text-slate-600'
                    }`}
                  >
                    <div className="text-[11px]">{day.weekday}</div>
                    <div className="text-[10px] font-bold opacity-75" dir="ltr">
                      {day.label}
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {chartHabits.map((h) => (
                <tr key={h.id} className="border-b border-slate-100 hover:bg-slate-50/70">
                  <td className="py-2 px-2 font-bold text-slate-800">
                    <div className="flex items-center gap-1.5">
                      <span className="text-base">{h.icon}</span>
                      <span className="truncate max-w-[180px]">{tr(lang, h.titleHe, h.titleEn, h.titleEs)}</span>
                    </div>
                  </td>
                  {last7Days.map((day) => {
                    const done = day.approvedIds.includes(h.id);
                    const pending = !done && day.pendingIds.includes(h.id);
                    const canParentEdit = parentUnlocked && isViewingActiveKidChart;
                    return (
                      <td
                        key={day.key}
                        className={`py-1.5 px-1 text-center ${day.isToday ? 'bg-indigo-50/60' : ''}`}
                      >
                        <button
                          type="button"
                          disabled={!canParentEdit}
                          onClick={() => {
                            if (!canParentEdit) return;
                            onParentApproveHabit(h, day.key);
                            playSound(done ? 'pop' : 'star');
                          }}
                          title={
                            canParentEdit
                              ? tr(lang, 'לחץ לשינוי מצב', 'Tap to toggle', 'Tocar para cambiar')
                              : done
                                ? tr(lang, 'בוצע ✓', 'Done ✓', 'Hecho ✓')
                                : pending
                                  ? tr(lang, 'ממתין לאישור', 'Pending', 'Pendiente')
                                  : tr(lang, 'לא בוצע', 'Not done', 'No hecho')
                          }
                          className={`w-8 h-8 rounded-xl inline-flex items-center justify-center font-black text-sm transition ${
                            done
                              ? 'bg-emerald-100 text-emerald-700 border border-emerald-300'
                              : pending
                                ? 'bg-amber-100 text-amber-700 border border-amber-300'
                                : day.isToday
                                  ? 'bg-slate-100 text-slate-400 border border-slate-200'
                                  : 'bg-rose-50 text-rose-400 border border-rose-200'
                          } ${canParentEdit ? 'cursor-pointer hover:scale-110' : 'cursor-default'}`}
                        >
                          {done ? '✓' : pending ? '⏳' : day.isToday ? '·' : '✕'}
                        </button>
                      </td>
                    );
                  })}
                </tr>
              ))}

              {/* Bedtime Row */}
              <tr className="bg-indigo-50/40">
                <td className="py-2 px-2 font-black text-indigo-950">
                  <div className="flex items-center gap-1.5">
                    <span>🌙</span>
                    <span>{tr(lang, 'שְׁעַת שֵׁנָה', 'Bedtime', 'Hora de dormir')}</span>
                  </div>
                </td>
                {last7Days.map((day) => (
                  <td key={day.key} className="py-2 px-1 text-center font-black text-[11px] text-indigo-900" dir="ltr">
                    {day.bedtime || '—'}
                  </td>
                ))}
              </tr>
            </tbody>
          </table>
        </div>

        {/* Legend */}
        <div className="flex flex-wrap items-center justify-between gap-2 text-[11px] font-bold text-slate-500 pt-1">
          <div className="flex flex-wrap items-center gap-3">
            <span className="inline-flex items-center gap-1">
              <span className="w-5 h-5 rounded-md bg-emerald-100 text-emerald-700 border border-emerald-300 inline-flex items-center justify-center font-black">✓</span>
              {tr(lang, 'בֻּצַּע', 'Done', 'Hecho')}
            </span>
            <span className="inline-flex items-center gap-1">
              <span className="w-5 h-5 rounded-md bg-amber-100 text-amber-700 border border-amber-300 inline-flex items-center justify-center font-black">⏳</span>
              {tr(lang, 'מַמְתִּין לְאִשּׁוּר', 'Pending', 'Pendiente')}
            </span>
            <span className="inline-flex items-center gap-1">
              <span className="w-5 h-5 rounded-md bg-rose-50 text-rose-400 border border-rose-200 inline-flex items-center justify-center font-black">✕</span>
              {tr(lang, 'לֹא בֻּצַּע', 'Missed', 'Faltó')}
            </span>
          </div>
          {parentUnlocked && isViewingActiveKidChart && (
            <span className="text-indigo-700 font-black">
              {tr(lang, '💡 בְּמַצַּב הוֹרֶה אֶפְשָׁר לִלְחֹץ עַל כָּל מִשְׁבֶּצֶת כְּדֵי לְעַדְכֵּן יוֹם קוֹדֵם', '💡 Parent Mode: tap any cell to update past days', '💡 Modo Padres: toca cualquier celda para editar')}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
