// Personalized kid-name messaging & spoken encouragement (Hebrew gender-aware, English, Spanish).

export function cleanKidName(name) {
  return String(name || '').trim();
}

export function speakPersonalText(text, lang = 'he', rate = 0.92) {
  if (!text) return;
  try {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;
    window.speechSynthesis.cancel();
    const clean = String(text)
      .replace(/[\u{1F300}-\u{1FAFF}\u{2600}-\u{27BF}]/gu, ' ')
      .replace(/\s+/g, ' ')
      .trim();
    if (!clean) return;
    const utt = new SpeechSynthesisUtterance(clean);
    utt.lang = lang === 'he' ? 'he-IL' : lang === 'es' ? 'es-ES' : 'en-US';
    utt.rate = rate;
    window.speechSynthesis.speak(utt);
  } catch {
    // ignore speech errors
  }
}

export function getKidWelcome(kidName, lang = 'he', gender = 'boy') {
  const n = cleanKidName(kidName);
  if (!n) {
    if (lang === 'en') return 'Welcome! Let’s play and learn!';
    if (lang === 'es') return '¡Hola! ¡Vamos a jugar y aprender!';
    return 'שָׁלוֹם! בּוֹאוּ נְשַׂחֵק וְנִלְמַד!';
  }
  if (lang === 'en') return `Hi ${n}! Ready to play and learn?`;
  if (lang === 'es') return `¡Hola ${n}! ¿Listo para jugar y aprender?`;
  return gender === 'girl'
    ? `שָׁלוֹם ${n}! אֵיזֶה כֵּיף שֶׁבָּאת לְשַׂחֵק!`
    : `שָׁלוֹם ${n}! אֵיזֶה כֵּיף שֶׁבָּאתָ לְשַׂחֵק!`;
}

export function getKidMissionComplete(kidName, lang = 'he', gender = 'boy') {
  const n = cleanKidName(kidName);
  if (!n) {
    if (lang === 'en') return 'Mission Complete! Great Job! 🎉';
    if (lang === 'es') return '¡Misión cumplida! ¡Excelente! 🎉';
    return gender === 'girl'
      ? 'אַלּוּפָה! סִיַּמְתְּ אֶת הַמְּשִׂימָה! 🎉'
      : 'אַלּוּף! סִיַּמְתָּ אֶת הַמְּשִׂימָה! 🎉';
  }
  if (lang === 'en') return `Way to go, ${n}! Mission Complete! 🎉`;
  if (lang === 'es') return `¡Muy bien, ${n}! ¡Misión cumplida! 🎉`;
  return gender === 'girl'
    ? `אַלּוּפָה ${n}! סִיַּמְתְּ אֶת הַמְּשִׂימָה! 🎉`
    : `אַלּוּף ${n}! סִיַּמְתָּ אֶת הַמְּשִׂימָה! 🎉`;
}

export function getKidPraise(kidName, lang = 'he', gender = 'boy') {
  const n = cleanKidName(kidName);
  const picksHe =
    gender === 'girl'
      ? n
        ? [`כָּל הַכָּבוֹד ${n}!`, `אַלּוּפָה ${n}!`, `יֹפִי ${n}, מְעוּלֶּה!`]
        : ['כָּל הַכָּבוֹד!', 'אַלּוּפָה!', 'מְעוּלֶּה!']
      : n
        ? [`כָּל הַכָּבוֹד ${n}!`, `אַלּוּף ${n}!`, `יֹפִי ${n}, מְעוּלֶּה!`]
        : ['כָּל הַכָּבוֹד!', 'אַלּוּף!', 'מְעוּלֶּה!'];

  const picksEn = n
    ? [`Awesome job, ${n}!`, `Way to go, ${n}!`, `You nailed it, ${n}!`]
    : ['Awesome job!', 'Way to go!', 'You nailed it!'];

  const picksEs = n
    ? [`¡Muy bien, ${n}!`, `¡Genial, ${n}!`, `¡Excelente, ${n}!`]
    : ['¡Muy bien!', '¡Genial!', '¡Excelente!'];

  const list = lang === 'en' ? picksEn : lang === 'es' ? picksEs : picksHe;
  return list[Math.floor(Math.random() * list.length)];
}

export function getKidCoachHeading(kidName, lang = 'he', gender = 'boy') {
  const n = cleanKidName(kidName);
  if (!n) {
    if (lang === 'en') return 'Let’s learn the easy trick for this one together!';
    if (lang === 'es') return '¡Veamos juntos el truco fácil para resolverlo!';
    return 'בּוֹאוּ נִרְאֶה יַחַד אֵיךְ פּוֹתְרִים אֶת זֶה בְּקַלּוּת!';
  }
  if (lang === 'en') return `${n}, let’s learn the easy trick for this one together!`;
  if (lang === 'es') return `${n}, ¡veamos juntos el truco fácil para resolverlo!`;
  return gender === 'girl'
    ? `${n}, בּוֹאִי נִרְאֶה יַחַד אֵיךְ פּוֹתְרִים אֶת זֶה בְּקַלּוּת!`
    : `${n}, בּוֹא נִרְאֶה יַחַד אֵיךְ פּוֹתְרִים אֶת זֶה בְּקַלּוּת!`;
}

export function getKidGameWin(kidName, lang = 'he', gender = 'boy') {
  const n = cleanKidName(kidName);
  if (!n) {
    if (lang === 'en') return 'Amazing! You matched every pair!';
    if (lang === 'es') return '¡Increíble! ¡Encontraste todas las parejas!';
    return gender === 'girl' ? 'כָּל הַכָּבוֹד! מָצָאת אֶת כָּל הַזּוּגוֹת!' : 'כָּל הַכָּבוֹד! מָצָאתָ אֶת כָּל הַזּוּגוֹת!';
  }
  if (lang === 'en') return `Amazing, ${n}! You matched every pair!`;
  if (lang === 'es') return `¡Increíble, ${n}! ¡Encontraste todas las parejas!`;
  return gender === 'girl'
    ? `כָּל הַכָּבוֹד ${n}! מָצָאת אֶת כָּל הַזּוּגוֹת!`
    : `כָּל הַכָּבוֹד ${n}! מָצָאתָ אֶת כָּל הַזּוּגוֹת!`;
}
