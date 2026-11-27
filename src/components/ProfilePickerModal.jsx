import React, { useState, useEffect } from 'react';
import { X, Plus, Pencil, Trash2, Star, Check, Cloud, Users } from 'lucide-react';
import { playSound } from '../utils/audio';
import { tr } from '../utils/i18n';
import { KID_AVATARS, SUPPORTED_AGES } from '../utils/profiles';

const AGE_META = {
  4: { icon: '🧸', he: 'גִּיל 4 (גַּן)', en: 'Age 4 (Preschool)', es: 'Edad 4 (Preescolar)' },
  7: { icon: '🧒', he: 'גִּיל 7 (א׳–ב׳)', en: 'Age 7 (Grades 1–2)', es: 'Edad 7 (Grados 1–2)' },
  9: { icon: '🚀', he: 'גִּיל 9 (ג׳–ד׳)', en: 'Age 9 (Grades 3–4)', es: 'Edad 9 (Grados 3–4)' }
};

export default function ProfilePickerModal({
  open,
  onClose,
  lang,
  user,
  profiles = [],
  activeProfileId,
  onSelectProfile,
  onSaveProfile,
  onDeleteProfile,
  onOpenParentGate,
  initialMode = 'pick' // 'pick' | 'add'
}) {
  const isHe = lang === 'he';
  const [mode, setMode] = useState(initialMode); // 'pick' | 'form'
  const [editingId, setEditingId] = useState(null);
  const [nameInput, setNameInput] = useState('');
  const [ageInput, setAgeInput] = useState(4);
  const [genderInput, setGenderInput] = useState('boy');
  const [avatarInput, setAvatarInput] = useState('👦');
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    if (!open) return;
    const onKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [open, onClose]);

  if (!open) return null;

  const isFormView = mode === 'form' || (profiles.length === 0 && initialMode !== 'pick_only');

  const openAddForm = () => {
    playSound('pop');
    setEditingId(null);
    setNameInput('');
    setAgeInput(4);
    setGenderInput('boy');
    setAvatarInput('👦');
    setErrorMsg('');
    setMode('form');
  };

  const openEditForm = (profile, e) => {
    if (e) e.stopPropagation();
    playSound('pop');
    setEditingId(profile.id);
    setNameInput(profile.name || '');
    setAgeInput(profile.age || 4);
    setGenderInput(profile.gender || 'boy');
    setAvatarInput(profile.avatar || (profile.gender === 'girl' ? '👧' : '👦'));
    setErrorMsg('');
    setMode('form');
  };

  const handleSubmitForm = (e) => {
    e.preventDefault();
    const trimmed = nameInput.trim();
    if (!trimmed) {
      playSound('whoosh');
      setErrorMsg(tr(lang, 'נָא לִכְתֹּב אֶת שֵׁם הַיֶּלֶד/ה', 'Please enter the child’s name', 'Por favor escribe el nombre'));
      return;
    }
    playSound('star');
    onSaveProfile({
      id: editingId,
      name: trimmed,
      age: ageInput,
      gender: genderInput,
      avatar: avatarInput
    });
    setMode('pick');
    setEditingId(null);
    setErrorMsg('');
    onClose();
  };

  const handleDelete = (id) => {
    playSound('whoosh');
    onDeleteProfile(id);
    setMode('pick');
    setEditingId(null);
  };

  return (
    <div
      className="fixed inset-0 z-50 bg-slate-900/55 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4"
      dir={isHe ? 'rtl' : 'ltr'}
      onClick={onClose}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="profile-picker-title"
        onClick={(e) => e.stopPropagation()}
        className="bg-white rounded-3xl max-w-xl w-full shadow-2xl border-4 border-indigo-400 max-h-[90dvh] flex flex-col overflow-hidden animate-pop-in"
      >
        {/* Header */}
        <div className="px-5 py-4 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white flex items-center justify-between gap-2 flex-shrink-0">
          <div className="flex items-center gap-2.5 min-w-0">
            <Users className="w-6 h-6 flex-shrink-0 text-amber-200" />
            <div className="min-w-0">
              <h3 id="profile-picker-title" className="text-lg sm:text-xl font-black truncate">
                {isFormView
                  ? editingId
                    ? tr(lang, 'עֲרִיכַת פְּרוֹפִיל יֶלֶד/ה', 'Edit Kid Profile', 'Editar perfil')
                    : tr(lang, 'הוֹסָפַת יֶלֶד / יַלְדָּה חָדָשׁ', 'Add a Kid Profile', 'Añadir perfil')
                  : tr(lang, 'מִי מְשַׂחֵק הַיּוֹם? בַּחֲרוּ שֵׁם!', 'Who is playing? Choose a kid!', '¿Quién juega hoy? ¡Elige tu nombre!')}
              </h3>
              {user && (
                <p className="text-[11px] sm:text-xs font-bold text-white/90 truncate flex items-center gap-1">
                  <Cloud className="w-3.5 h-3.5 inline flex-shrink-0" />
                  <span>{user.email || user.name}</span>
                </p>
              )}
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label={tr(lang, 'סְגוֹר', 'Close', 'Cerrar')}
            className="w-9 h-9 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center cursor-pointer flex-shrink-0"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-4 sm:p-5 overflow-y-auto flex flex-col gap-4">
          {!isFormView ? (
            <>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {profiles.map((p) => {
                  const isActive = p.id === activeProfileId;
                  const meta = AGE_META[p.age] || AGE_META[4];
                  return (
                    <div
                      key={p.id}
                      onClick={() => {
                        playSound('star');
                        onSelectProfile(p.id);
                        onClose();
                      }}
                      role="button"
                      tabIndex={0}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' || e.key === ' ') {
                          e.preventDefault();
                          playSound('star');
                          onSelectProfile(p.id);
                          onClose();
                        }
                      }}
                      className={`relative rounded-3xl p-3.5 border-4 flex flex-col items-center text-center gap-1.5 transition cursor-pointer btn-press-3d ${
                        isActive
                          ? 'bg-gradient-to-b from-amber-100 to-yellow-100 border-amber-500 ring-4 ring-amber-200 shadow-lg'
                          : 'bg-slate-50 hover:bg-indigo-50 border-slate-200 hover:border-indigo-400'
                      }`}
                    >
                      {/* Edit pencil button */}
                      <button
                        type="button"
                        onClick={(e) => openEditForm(p, e)}
                        aria-label={tr(lang, `עֲרֹךְ אֶת ${p.name}`, `Edit ${p.name}`, `Editar ${p.name}`)}
                        className="absolute top-2 end-2 w-8 h-8 rounded-full bg-white/90 hover:bg-white border border-slate-200 text-slate-600 flex items-center justify-center shadow-2xs cursor-pointer"
                      >
                        <Pencil className="w-3.5 h-3.5" />
                      </button>

                      {isActive && (
                        <span className="absolute top-2 start-2 w-6 h-6 rounded-full bg-emerald-500 text-white flex items-center justify-center shadow-xs">
                          <Check className="w-3.5 h-3.5" />
                        </span>
                      )}

                      <span className="text-5xl mt-2">{p.avatar || (p.gender === 'girl' ? '👧' : '👦')}</span>

                      <div className="font-black text-lg text-slate-900 truncate max-w-full px-1">
                        {p.name}
                      </div>

                      <span className="text-[11px] font-black px-2.5 py-0.5 rounded-full bg-indigo-100 text-indigo-900">
                        {meta.icon} {tr(lang, `גִּיל ${p.age}`, `Age ${p.age}`, `Edad ${p.age}`)}
                      </span>

                      <span className="inline-flex items-center gap-1 text-xs font-black text-amber-800 bg-white/90 px-2.5 py-0.5 rounded-full border border-amber-200">
                        <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-400" />
                        <bdi>{p.stars}</bdi>
                      </span>
                    </div>
                  );
                })}

                {/* Add New Kid Tile */}
                <button
                  type="button"
                  onClick={openAddForm}
                  className="rounded-3xl p-4 border-4 border-dashed border-indigo-300 hover:border-indigo-500 bg-indigo-50/50 hover:bg-indigo-100/70 flex flex-col items-center justify-center gap-2 min-h-[168px] text-indigo-700 font-black transition cursor-pointer btn-press-3d"
                >
                  <div className="w-12 h-12 rounded-full bg-indigo-500 text-white flex items-center justify-center shadow">
                    <Plus className="w-7 h-7" />
                  </div>
                  <span className="text-sm">{tr(lang, 'הוֹסֵף יֶלֶד/ה', 'Add Kid', 'Añadir niño/a')}</span>
                </button>
              </div>

              {!user && onOpenParentGate && (
                <div className="p-3 bg-sky-50 border-2 border-sky-200 rounded-2xl flex flex-wrap items-center justify-between gap-2 text-xs font-bold text-sky-900">
                  <span>
                    ☁️{' '}
                    {tr(
                      lang,
                      'הִתְחַבְּרוּ עִם Google כְּדֵי לִשְׁמֹר אֶת כָּל פְּרוֹפִילֵי הַיְּלָדִים בְּכָל הַמַּכְשִׁירִים!',
                      'Sign in with Google to sync all kid profiles across your devices!',
                      '¡Inicia sesión con Google para sincronizar los perfiles en todos tus dispositivos!'
                    )}
                  </span>
                  <button
                    type="button"
                    onClick={() => {
                      onClose();
                      onOpenParentGate();
                    }}
                    className="px-3 py-1.5 bg-sky-600 hover:bg-sky-700 text-white rounded-xl font-black cursor-pointer"
                  >
                    {tr(lang, 'הִתְחַבְּרוּת Google', 'Google Sign-In', 'Iniciar con Google')}
                  </button>
                </div>
              )}
            </>
          ) : (
            /* ---------------- ADD / EDIT KID FORM ---------------- */
            <form onSubmit={handleSubmitForm} className="flex flex-col gap-4">
              {profiles.length === 0 && (
                <p className="text-sm font-bold text-indigo-900 bg-indigo-50 border border-indigo-200 rounded-2xl p-3 text-center">
                  {tr(
                    lang,
                    'צְרוּ פְּרוֹפִיל אִישִׁי לְכָל יֶלֶד/ה בַּמִּשְׁפָּחָה — כָּךְ לְכָל אֶחָד יִהְיוּ גִּיל, כּוֹכָבִים וְהִתְקַדְּמוּת מִשֶּׁלּוֹ!',
                    'Create a profile for each child — everyone gets their own age, stars, and progress!',
                    '¡Crea un perfil para cada niño o niña — cada uno tendrá su edad, estrellas y progreso!'
                  )}
                </p>
              )}

              {/* Name Input */}
              <div className="flex flex-col gap-1.5">
                <label htmlFor="kid-name-input" className="text-xs font-black text-slate-600">
                  {tr(lang, 'שֵׁם הַיֶּלֶד / הַיַּלְדָּה:', 'Child’s Name:', 'Nombre del niño/a:')}
                </label>
                <input
                  id="kid-name-input"
                  type="text"
                  maxLength={24}
                  autoFocus
                  value={nameInput}
                  onChange={(e) => {
                    setNameInput(e.target.value);
                    setErrorMsg('');
                  }}
                  placeholder={tr(lang, 'לְדֻגְמָה: נוֹעָה, אֵיתָן, תָּמָר...', 'e.g. Noa, Eitan, Maya...', 'Ej: Noa, Mateo, Sofía...')}
                  className="w-full px-4 py-3 rounded-2xl border-2 border-indigo-300 focus:border-indigo-600 bg-white text-slate-900 font-black text-lg outline-none select-text"
                />
                {errorMsg && <span className="text-xs font-bold text-rose-600">{errorMsg}</span>}
              </div>

              {/* Age Picker (4 / 7 / 9) */}
              <div className="flex flex-col gap-1.5">
                <span className="text-xs font-black text-slate-600">
                  {tr(lang, 'בַּחֲרוּ גִּיל (אֶפְשָׁר לְשַׁנּוֹת בְּכָל עֵת):', 'Choose Age (can be changed anytime):', 'Elige la edad (puedes cambiarla siempre):')}
                </span>
                <div className="grid grid-cols-3 gap-2">
                  {SUPPORTED_AGES.map((a) => {
                    const meta = AGE_META[a];
                    const selected = ageInput === a;
                    return (
                      <button
                        key={a}
                        type="button"
                        onClick={() => {
                          playSound('pop');
                          setAgeInput(a);
                        }}
                        className={`p-3 rounded-2xl border-2 font-black text-xs sm:text-sm flex flex-col items-center gap-1 transition cursor-pointer btn-press-3d ${
                          selected
                            ? 'bg-indigo-600 text-white border-indigo-800 shadow-md'
                            : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-indigo-50'
                        }`}
                      >
                        <span className="text-2xl">{meta.icon}</span>
                        <span>{tr(lang, meta.he, meta.en, meta.es)}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Boy / Girl Toggle */}
              <div className="flex flex-col gap-1.5">
                <span className="text-xs font-black text-slate-600">
                  {tr(lang, 'פְּנִיָּה בְּעִבְרִית:', 'Voice Style:', 'Estilo:')}
                </span>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      playSound('pop');
                      setGenderInput('boy');
                      if (avatarInput === '👧') setAvatarInput('👦');
                    }}
                    className={`py-2.5 px-3 rounded-2xl border-2 font-black text-sm flex items-center justify-center gap-2 cursor-pointer ${
                      genderInput === 'boy'
                        ? 'bg-sky-200 border-sky-500 text-sky-950'
                        : 'bg-slate-50 border-slate-200 text-slate-600'
                    }`}
                  >
                    <span className="text-xl">👦</span>
                    <span>{tr(lang, 'יֶלֶד', 'Boy', 'Niño')}</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      playSound('pop');
                      setGenderInput('girl');
                      if (avatarInput === '👦') setAvatarInput('👧');
                    }}
                    className={`py-2.5 px-3 rounded-2xl border-2 font-black text-sm flex items-center justify-center gap-2 cursor-pointer ${
                      genderInput === 'girl'
                        ? 'bg-pink-200 border-pink-500 text-pink-950'
                        : 'bg-slate-50 border-slate-200 text-slate-600'
                    }`}
                  >
                    <span className="text-xl">👧</span>
                    <span>{tr(lang, 'יַלְדָּה', 'Girl', 'Niña')}</span>
                  </button>
                </div>
              </div>

              {/* Avatar Picker */}
              <div className="flex flex-col gap-1.5">
                <span className="text-xs font-black text-slate-600">
                  {tr(lang, 'בַּחֲרוּ דְּמוּת:', 'Choose Avatar:', 'Elige un avatar:')}
                </span>
                <div className="flex flex-wrap gap-2">
                  {KID_AVATARS.map((em) => (
                    <button
                      key={em}
                      type="button"
                      onClick={() => {
                        playSound('pop');
                        setAvatarInput(em);
                      }}
                      className={`w-12 h-12 rounded-2xl border-2 text-2xl flex items-center justify-center cursor-pointer transition ${
                        avatarInput === em
                          ? 'bg-amber-200 border-amber-500 scale-110 shadow'
                          : 'bg-slate-50 border-slate-200 hover:bg-amber-50'
                      }`}
                    >
                      {em}
                    </button>
                  ))}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center justify-between gap-2 pt-2">
                {profiles.length > 0 && (
                  <button
                    type="button"
                    onClick={() => {
                      playSound('pop');
                      setMode('pick');
                      setEditingId(null);
                    }}
                    className="px-4 py-2.5 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-sm cursor-pointer"
                  >
                    {tr(lang, 'חֲזָרָה', 'Back', 'Volver')}
                  </button>
                )}

                {editingId && profiles.length > 1 && (
                  <button
                    type="button"
                    onClick={() => handleDelete(editingId)}
                    className="px-3.5 py-2.5 rounded-2xl bg-rose-100 hover:bg-rose-200 text-rose-700 font-black text-xs flex items-center gap-1 cursor-pointer"
                  >
                    <Trash2 className="w-4 h-4" />
                    <span>{tr(lang, 'מְחַק פְּרוֹפִיל', 'Delete', 'Eliminar')}</span>
                  </button>
                )}

                <button
                  type="submit"
                  className="flex-1 py-3 px-6 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white font-black text-base shadow-lg btn-press-3d cursor-pointer"
                >
                  {editingId
                    ? tr(lang, 'שְׁמֹר שִׁנּוּיִים ✓', 'Save Changes ✓', 'Guardar cambios ✓')
                    : tr(lang, 'שְׁמֹר וְהַתְחֵל לְשַׂחֵק! 🚀', 'Save & Play! 🚀', '¡Guardar y jugar! 🚀')}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
