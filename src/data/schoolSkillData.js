// Curated Israeli school curriculum banks for Ages 7 (Grades 1-2) and 9 (Grades 3-4)
// Covers: Hebrew Spelling & Reading (Age 7), First English (Age 7),
// Hebrew Grammar & Roots (Age 9), and English Builder (Age 9).

const shuffle = (arr) => {
  const copy = [...arr];
  for (let i = copy.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
};

export const SKILL_ARENA_CONFIG = {
  hebrew_age7: {
    age: 7,
    icon: '📖',
    gradient: 'from-emerald-500 via-teal-500 to-cyan-600',
    border: 'border-emerald-300',
    titleHe: 'עִבְרִית וּכְתִיב • גִּיל 7',
    titleEn: 'Hebrew Reading & Spelling • Age 7',
    titleEs: 'Hebreo y Ortografía • Edad 7',
    subHe: 'כִּתָּה א׳–ב׳ • אוֹתִיּוֹת סוֹפִיּוֹת, אוֹת חֲסֵרָה וַהֲבָנַת מִשְׁפָּטִים!',
    subEn: 'Grades 1–2 • Final Letters (ם ן ץ ף ך), Missing Letters & Sentences!',
    subEs: 'Grados 1–2 • Letras finales, letras faltantes y frases.',
    speechLang: 'he-IL',
    easierTab: 'memory_age7',
    topics: [
      { id: 'mix', icon: '🎲', he: 'מִיקְס מָהִיר', en: 'Quick Mix', es: 'Mezcla rápida' },
      { id: 'sofit', icon: '🔚', he: 'אוֹתִיּוֹת סוֹפִיּוֹת (מנצפ״ך)', en: 'Final Letters', es: 'Letras finales' },
      { id: 'missing_letter', icon: '✏️', he: 'אוֹת חֲסֵרָה בַּמִּלָּה', en: 'Missing Letter', es: 'Letra faltante' },
      { id: 'sentences', icon: '💬', he: 'הַשְׁלָמַת מִשְׁפָּט', en: 'Complete Sentence', es: 'Completar frase' }
    ]
  },
  english_age7: {
    age: 7,
    icon: '🇬🇧',
    gradient: 'from-blue-500 via-sky-500 to-indigo-600',
    border: 'border-sky-300',
    titleHe: 'אַנְגְּלִית רִאשׁוֹנָה • גִּיל 7',
    titleEn: 'First English • Age 7',
    titleEs: 'Primer Inglés • Edad 7',
    subHe: 'כִּתָּה א׳–ב׳ • מִלִּים יוֹמְיוֹמִיּוֹת, צְבָעִים וְחַיּוֹת עִם הַקְרָאָה!',
    subEn: 'Grades 1–2 • Everyday Words, Colors & Animals with Audio!',
    subEs: 'Grados 1–2 • Palabras diarias, colores y animales con audio.',
    speechLang: 'en-US',
    easierTab: 'math_age7',
    topics: [
      { id: 'mix', icon: '🎲', he: 'מִיקְס מָהִיר', en: 'Quick Mix', es: 'Mezcla rápida' },
      { id: 'animals', icon: '🐾', he: 'חַיּוֹת', en: 'Animals', es: 'Animales' },
      { id: 'colors_nums', icon: '🎨', he: 'צְבָעִים וּמִסְפָּרִים', en: 'Colors & Numbers', es: 'Colores y Números' },
      { id: 'everyday', icon: '🏠', he: 'מִלִּים בַּבַּיִת', en: 'Everyday Words', es: 'Palabras diarias' }
    ]
  },
  hebrew_age9: {
    age: 9,
    icon: '📚',
    gradient: 'from-violet-600 via-purple-600 to-fuchsia-600',
    border: 'border-purple-300',
    titleHe: 'עִבְרִית וְלָשׁוֹן • גִּיל 9',
    titleEn: 'Hebrew Grammar & Roots • Age 9',
    titleEs: 'Hebreo y Gramática • Edad 9',
    subHe: 'כִּתָּה ג׳–ד׳ • שָׁרָשִׁים, הֲפָכִים וְנִרְדָּפוֹת, כְּתִיב נָכוֹן וּזְמַנִּים!',
    subEn: 'Grades 3–4 • 3-Letter Roots, Synonyms/Opposites, Spelling & Tenses!',
    subEs: 'Grados 3–4 • Raíces, sinónimos/opuestos, ortografía y tiempos.',
    speechLang: 'he-IL',
    easierTab: 'hebrew_age7',
    topics: [
      { id: 'mix', icon: '🚀', he: 'מִיקְס מָהִיר', en: 'Quick Mix', es: 'Mezcla rápida' },
      { id: 'roots', icon: '🌱', he: 'שׁוֹרֶשׁ הַמִּלָּה', en: 'Word Roots', es: 'Raíz de la palabra' },
      { id: 'synonyms', icon: '🔄', he: 'נִרְדָּפוֹת וַהֲפָכִים', en: 'Synonyms & Opposites', es: 'Sinónimos y Opuestos' },
      { id: 'spelling', icon: '✍️', he: 'כְּתִיב נָכוֹן', en: 'Tricky Spelling', es: 'Ortografía' },
      { id: 'tenses', icon: '⏳', he: 'זְמַנִּים וְרַבִּים', en: 'Tenses & Plurals', es: 'Tiempos y Plurales' }
    ]
  },
  english_age9: {
    age: 9,
    icon: '🌍',
    gradient: 'from-rose-500 via-pink-600 to-indigo-600',
    border: 'border-rose-300',
    titleHe: 'אַנְגְּלִית כִּתָּה ג׳–ד׳ • גִּיל 9',
    titleEn: 'English Builder • Age 9',
    titleEs: 'Inglés Avanzado • Edad 9',
    subHe: 'כִּתָּה ג׳–ד׳ • דִּקְדּוּק (am/is/are, have/has), אוֹצַר מִלִּים וַהֲפָכִים!',
    subEn: 'Grades 3–4 • Grammar (am/is/are, have/has), Vocabulary & Opposites!',
    subEs: 'Grados 3–4 • Gramática, vocabulario y opuestos en inglés.',
    speechLang: 'en-US',
    easierTab: 'english_age7',
    topics: [
      { id: 'mix', icon: '🚀', he: 'מִיקְס מָהִיר', en: 'Quick Mix', es: 'Mezcla rápida' },
      { id: 'grammar', icon: '🧩', he: 'דִּקְדּוּק (is/are/has)', en: 'Grammar', es: 'Gramática' },
      { id: 'vocab', icon: '💬', he: 'אוֹצַר מִלִּים', en: 'Vocabulary', es: 'Vocabulario' },
      { id: 'opposites_plurals', icon: '⚡', he: 'הֲפָכִים וְרַבִּים', en: 'Opposites & Plurals', es: 'Opuestos y Plurales' }
    ]
  }
};

const BANKS = {
  hebrew_age7: {
    sofit: [
      {
        emoji: '👋',
        display: 'שָׁלוֹ_',
        promptHe: 'אֵיזוֹ אוֹת סוֹפִית מַשְׁלִימָה אֶת הַמִּלָּה "שָׁלוֹם"?',
        promptEn: 'Which final letter completes the word "Shalom" (Peace/Hello)?',
        promptEs: '¿Qué letra final completa "Shalom"?',
        answer: 'ם',
        choices: ['ם', 'מ', 'ן', 'ך'],
        hintHe: 'בְּסוֹף מִלָּה כּוֹתְבִים מֵם סוֹפִית סְגוּרָה (ם) — לֹא מ רגילה!',
        hintEn: 'At the end of a word, Mem becomes closed Final Mem (ם)!',
        hintEs: 'Al final de la palabra, Mem se convierte en Mem final (ם).',
        speak: 'שלום'
      },
      {
        emoji: '🪟',
        display: 'חַלּוֹ_',
        promptHe: 'אֵיזוֹ אוֹת סוֹפִית מַשְׁלִימָה אֶת הַמִּלָּה "חַלּוֹן"?',
        promptEn: 'Which final letter completes "Chalon" (Window)?',
        promptEs: '¿Qué letra final completa "Chalon" (ventana)?',
        answer: 'ן',
        choices: ['ן', 'נ', 'ם', 'ץ'],
        hintHe: 'נוּן סוֹפִית (ן) יוֹרֶדֶת לְמַטָּה כְּמוֹ קַו אָרֹךְ בְּסוֹף הַמִּלָּה!',
        hintEn: 'Final Nun (ן) is a tall straight line going down at the end of the word!',
        hintEs: 'Nun final (ן) es una línea larga hacia abajo al final.',
        speak: 'חלון'
      },
      {
        emoji: '🌳',
        display: 'עֵ_',
        promptHe: 'אֵיזוֹ אוֹת סוֹפִית מַשְׁלִימָה אֶת הַמִּלָּה "עֵץ"?',
        promptEn: 'Which final letter completes "Etz" (Tree)?',
        promptEs: '¿Qué letra final completa "Etz" (árbol)?',
        answer: 'ץ',
        choices: ['ץ', 'צ', 'ף', 'ן'],
        hintHe: 'צָדִי סוֹפִית (ץ) נִרְאֵית כְּמוֹ עֵץ עִם עֲנָפִים בְּסוֹף הַמִּלָּה!',
        hintEn: 'Final Tsadi (ץ) looks just like a little tree with branches!',
        hintEs: 'Tsadi final (ץ) parece un arbolito con ramas.',
        speak: 'עץ'
      },
      {
        emoji: '👑',
        display: 'מֶלֶ_',
        promptHe: 'אֵיזוֹ אוֹת סוֹפִית מַשְׁלִימָה אֶת הַמִּלָּה "מֶלֶךְ"?',
        promptEn: 'Which final letter completes "Melech" (King)?',
        promptEs: '¿Qué letra final completa "Melech" (rey)?',
        answer: 'ך',
        choices: ['ך', 'כ', 'ף', 'ן'],
        hintHe: 'כַּף סוֹפִית (ך) יוֹרֶדֶת לְמַטָּה בְּסוֹף מִלָּה (מֶלֶךְ, דֶּרֶךְ)!',
        hintEn: 'Final Khaf (ך) drops down long at the end of a word!',
        hintEs: 'Jaf final (ך) baja largo al final de la palabra.',
        speak: 'מלך'
      },
      {
        emoji: '🥄',
        display: 'כַּ_',
        promptHe: 'אֵיזוֹ אוֹת סוֹפִית מַשְׁלִימָה אֶת הַמִּלָּה "כַּף"?',
        promptEn: 'Which final letter completes "Kaf" (Spoon)?',
        promptEs: '¿Qué letra final completa "Kaf" (cuchara)?',
        answer: 'ף',
        choices: ['ף', 'פ', 'ך', 'ץ'],
        hintHe: 'פֵּא סוֹפִית (ף) יוֹרֶדֶת לְמַטָּה בְּסוֹף הַמִּלָּה (כַּף, אַף, חוֹף)!',
        hintEn: 'Final Fe (ף) has a curly top and long tail at the end of a word!',
        hintEs: 'Fe final (ף) tiene cola larga al final de la palabra.',
        speak: 'כף'
      },
      {
        emoji: '🎈',
        display: 'בַּלּוֹ_',
        promptHe: 'אֵיזוֹ אוֹת סוֹפִית מַשְׁלִימָה אֶת הַמִּלָּה "בַּלּוֹן"?',
        promptEn: 'Which final letter completes "Balon" (Balloon)?',
        promptEs: '¿Qué letra final completa "Balon" (globo)?',
        answer: 'ן',
        choices: ['ן', 'נ', 'ם', 'ך'],
        hintHe: 'הַצְּלִיל "ן" בְּסוֹף מִלָּה נִכְתָּב תָּמִיד עִם נוּן סוֹפִית (ן)!',
        hintEn: 'The "n" sound at the end of a Hebrew word always uses Final Nun (ן)!',
        hintEs: 'El sonido "n" al final siempre usa Nun final (ן).',
        speak: 'בלון'
      }
    ],
    missing_letter: [
      {
        emoji: '🍎',
        display: 'תַּפּוּ_',
        promptHe: 'בַּחֲרוּ אֶת הָאוֹת הַחֲסֵרָה בַּמִּלָּה "תַּפּוּחַ":',
        promptEn: 'Pick the missing letter in "Tapuach" (Apple):',
        promptEs: 'Elige la letra que falta en "Tapuach" (manzana):',
        answer: 'ח',
        choices: ['ח', 'כ', 'ך', 'ה'],
        hintHe: 'תַּפּוּחַ נִגְמָר בְּאוֹת חֵית (ח) — לֹא בְּכַף!',
        hintEn: '"Tapuach" ends with Chet (ח)!',
        hintEs: '"Tapuach" termina con Jet (ח).',
        speak: 'תפוח'
      },
      {
        emoji: '☀️',
        display: '_ֶמֶשׁ',
        promptHe: 'בַּחֲרוּ אֶת הָאוֹת הָרִאשׁוֹנָה בַּמִּלָּה "שֶׁמֶשׁ":',
        promptEn: 'Pick the first letter in "Shemesh" (Sun):',
        promptEs: 'Elige la primera letra de "Shemesh" (sol):',
        answer: 'שׁ',
        choices: ['שׁ', 'ס', 'צ', 'שׂ'],
        hintHe: 'שֶׁמֶשׁ מַתְחִילָה בִּצְלִיל "שׁ" — שִׁין עִם נְקֻדָּה בְּצַד יָמִין!',
        hintEn: '"Shemesh" starts with Shin (שׁ, dot on the right)!',
        hintEs: '"Shemesh" empieza con Shin (שׁ).',
        speak: 'שמש'
      },
      {
        emoji: '📚',
        display: '_ֵפֶר',
        promptHe: 'בַּחֲרוּ אֶת הָאוֹת הַחֲסֵרָה בַּמִּלָּה "סֵפֶר":',
        promptEn: 'Pick the missing letter in "Sefer" (Book):',
        promptEs: 'Elige la letra que falta en "Sefer" (libro):',
        answer: 'ס',
        choices: ['ס', 'שׁ', 'ז', 'צ'],
        hintHe: 'סֵפֶר מַתְחִיל בְּסָמֶךְ עֲגֻלָּה (ס)!',
        hintEn: '"Sefer" starts with round Samech (ס)!',
        hintEs: '"Sefer" empieza con Sámej (ס).',
        speak: 'ספר'
      },
      {
        emoji: '🐶',
        display: '_ֶלֶב',
        promptHe: 'בַּחֲרוּ אֶת הָאוֹת הַחֲסֵרָה בַּמִּלָּה "כֶּלֶב":',
        promptEn: 'Pick the missing letter in "Kelev" (Dog):',
        promptEs: 'Elige la letra que falta en "Kelev" (perro):',
        answer: 'כ',
        choices: ['כ', 'ק', 'ג', 'ת'],
        hintHe: 'כֶּלֶב מַתְחִיל בְּאוֹת כַּף (כ) — לֹא בְּקוֹף!',
        hintEn: '"Kelev" (dog) is spelled with Kaf (כ), not Kof!',
        hintEs: '"Kelev" (perro) se escribe con Kaf (כ).',
        speak: 'כלב'
      },
      {
        emoji: '☁️',
        display: '_ָנָן',
        promptHe: 'בַּחֲרוּ אֶת הָאוֹת הַחֲסֵרָה בַּמִּלָּה "עָנָן":',
        promptEn: 'Pick the missing letter in "Anan" (Cloud):',
        promptEs: 'Elige la letra que falta en "Anan" (nube):',
        answer: 'ע',
        choices: ['ע', 'א', 'ה', 'ח'],
        hintHe: 'עָנָן מַתְחִיל בְּעַיִן (ע) — אֶפְשָׁר לִזְכֹּר שֶׁרוֹאִים עָנָן בָּעַיִן!',
        hintEn: '"Anan" (cloud) starts with Ayin (ע) — we see clouds with our eye (Ayin)!',
        hintEs: '"Anan" (nube) empieza con Ayin (ע).',
        speak: 'ענן'
      },
      {
        emoji: '🍉',
        display: 'אַבַ_ִּיחַ',
        promptHe: 'בַּחֲרוּ אֶת הָאוֹת הַחֲסֵרָה בַּמִּלָּה "אַבַטִּיחַ":',
        promptEn: 'Pick the missing letter in "Avatiach" (Watermelon):',
        promptEs: 'Elige la letra que falta en "Avatiach" (sandía):',
        answer: 'ט',
        choices: ['ט', 'ת', 'ד', 'ק'],
        hintHe: 'בְּאַבַטִּיחַ כּוֹתְבִים טֵית (ט) — לֹא תָּיו!',
        hintEn: '"Avatiach" uses Tet (ט), not Tav!',
        hintEs: '"Avatiach" se escribe con Tet (ט).',
        speak: 'אבטיח'
      }
    ],
    sentences: [
      {
        emoji: '🐱',
        display: 'הֶחָתוּל שׁוֹתֶה _____ בַּקְּעָרָה.',
        promptHe: 'הַשְׁלִימוּ אֶת הַמִּשְׁפָּט בַּמִּלָּה הַמַּתְאִימָה:',
        promptEn: 'Complete the Hebrew sentence with the right word:',
        promptEs: 'Completa la frase en hebreo con la palabra correcta:',
        answer: 'חָלָב',
        choices: ['חָלָב', 'כִּסֵּא', 'עִפָּרוֹן', 'נַעַל'],
        hintHe: 'מָה חָתוּל יָכוֹל לִשְׁתּוֹת מִתּוֹךְ קְעָרָה?',
        hintEn: 'What can a cat drink from a bowl? Milk (חָלָב)!',
        hintEs: '¿Qué puede beber un gato de un plato? Leche (חָלָב).',
        speak: 'החתול שותה חלב בקערה'
      },
      {
        emoji: '⚽',
        display: 'הַיְּלָדִים מְשַׂחֲקִים _____ בַּחֲצֵר בֵּית הַסֵּפֶר.',
        promptHe: 'אֵיזוֹ מִלָּה מַתְאִימָה לַמִּשְׁפָּט?',
        promptEn: 'Which word fits the sentence?',
        promptEs: '¿Qué palabra encaja en la frase?',
        answer: 'כַּדּוּרֶגֶל',
        choices: ['כַּדּוּרֶגֶל', 'מַחְבֶּרֶת', 'מִטָּה', 'מָרָק'],
        hintHe: 'מָה מְשַׂחֲקִים בַּחָצֵר עִם כַּדּוּר?',
        hintEn: 'What game do kids play outside with a ball? Soccer (כַּדּוּרֶגֶל)!',
        hintEs: '¿Qué juegan los niños en el patio con una pelota? Fútbol (כַּדּוּרֶגֶל).',
        speak: 'הילדים משחקים כדורגל בחצר בית הספר'
      },
      {
        emoji: '🌙',
        display: 'בַּלַּיְלָה רוֹאִים בַּשָּׁמַיִם יָרֵחַ וְ_____.',
        promptHe: 'הַשְׁלִימוּ אֶת הַמִּשְׁפָּט:',
        promptEn: 'Complete the sentence:',
        promptEs: 'Completa la frase:',
        answer: 'כּוֹכָבִים',
        choices: ['כּוֹכָבִים', 'דָּגִים', 'סְפָרִים', 'תַּפּוּחִים'],
        hintHe: 'מָה זוֹהֵר בַּשָּׁמַיִם בַּלַּיְלָה לְיַד הַיָּרֵחַ?',
        hintEn: 'What shines in the night sky next to the moon? Stars (כּוֹכָבִים)!',
        hintEs: '¿Qué brilla en el cielo de noche junto a la luna? Estrellas (כּוֹכָבִים).',
        speak: 'בלילה רואים בשמים ירח וכוכבים'
      },
      {
        emoji: '🌧️',
        display: 'כְּשֶׁיּוֹרֵד גֶּשֶׁם אֲנַחְנוּ פּוֹתְחִים _____.',
        promptHe: 'בַּחֲרוּ אֶת הַמִּלָּה הַנְּכוֹנָה:',
        promptEn: 'Choose the right word:',
        promptEs: 'Elige la palabra correcta:',
        answer: 'מִטְרִיָּה',
        choices: ['מִטְרִיָּה', 'גְּלִידָה', 'אוֹפַנַּיִם', 'שֻׁלְחָן'],
        hintHe: 'מָה שׁוֹמֵר עָלֵינוּ יְבֵשִׁים כְּשֶׁיּוֹרֵד גֶּשֶׁם?',
        hintEn: 'What keeps us dry when it rains? An umbrella (מִטְרִיָּה)!',
        hintEs: '¿Qué nos mantiene secos bajo la lluvia? Un paraguas (מִטְרִיָּה).',
        speak: 'כשיורד גשם אנחנו פותחים מטריה'
      }
    ]
  },

  english_age7: {
    animals: [
      { emoji: '🐶', display: 'DOG', promptHe: 'מָה הַפֵּרוּשׁ שֶׁל הַמִּלָּה בְּאַנְגְּלִית?', promptEn: 'What does DOG mean in Hebrew?', promptEs: '¿Qué significa DOG?', answer: 'כֶּלֶב', choices: ['כֶּלֶב', 'חָתוּל', 'דָּג', 'צִפּוֹר'], hintHe: 'הִסְתַּכְּלוּ עַל הַתְּמוּנָה 🐶 — הוּא נוֹבֵחַ הַאוּ-הַאוּ!', hintEn: 'Look at the picture 🐶 — it barks woof!', hintEs: 'Mira el dibujo 🐶: ¡ladra!', speak: 'Dog' },
      { emoji: '🐱', display: 'CAT', promptHe: 'מָה הַפֵּרוּשׁ שֶׁל CAT?', promptEn: 'What does CAT mean?', promptEs: '¿Qué significa CAT?', answer: 'חָתוּל', choices: ['חָתוּל', 'כֶּלֶב', 'אַרְיֵה', 'פִּיל'], hintHe: 'הִיא אוֹמֶרֶת מְיָאוּ 🐱!', hintEn: 'It says meow 🐱!', hintEs: 'Dice miau 🐱.', speak: 'Cat' },
      { emoji: '🐟', display: 'FISH', promptHe: 'מָה הַפֵּרוּשׁ שֶׁל FISH?', promptEn: 'What does FISH mean?', promptEs: '¿Qué significa FISH?', answer: 'דָּג', choices: ['דָּג', 'צָב', 'כֶּלֶב', 'סוּס'], hintHe: 'הוּא שׁוֹחֶה בַּמַּיִם 🐟!', hintEn: 'It swims in water 🐟!', hintEs: 'Nada en el agua 🐟.', speak: 'Fish' },
      { emoji: '🦁', display: 'LION', promptHe: 'מָה הַפֵּרוּשׁ שֶׁל LION?', promptEn: 'What does LION mean?', promptEs: '¿Qué significa LION?', answer: 'אַרְיֵה', choices: ['אַרְיֵה', 'דֹּב', 'קוֹף', 'חָתוּל'], hintHe: 'מֶלֶךְ הַחַיּוֹת 🦁!', hintEn: 'The king of the jungle 🦁!', hintEs: 'El rey de la selva 🦁.', speak: 'Lion' },
      { emoji: '🐦', display: 'BIRD', promptHe: 'מָה הַפֵּרוּשׁ שֶׁל BIRD?', promptEn: 'What does BIRD mean?', promptEs: '¿Qué significa BIRD?', answer: 'צִפּוֹר', choices: ['צִפּוֹר', 'דָּג', 'פָּרָה', 'כֶּלֶב'], hintHe: 'הִיא עָפָה בַּשָּׁמַיִם 🐦!', hintEn: 'It flies in the sky 🐦!', hintEs: 'Vuela en el cielo 🐦.', speak: 'Bird' }
    ],
    colors_nums: [
      { emoji: '🔵', display: 'BLUE', promptHe: 'אֵיזֶה צֶבַע זֶה BLUE?', promptEn: 'Which color is BLUE?', promptEs: '¿Qué color es BLUE?', answer: 'כָּחֹל', choices: ['כָּחֹל', 'אָדֹם', 'יָרֹק', 'צָהֹב'], hintHe: 'כְּמוֹ צֶבַע הַשָּׁמַיִם וְהַיָּם 🔵!', hintEn: 'Like the sky and sea 🔵!', hintEs: 'Como el cielo y el mar 🔵.', speak: 'Blue' },
      { emoji: '🔴', display: 'RED', promptHe: 'אֵיזֶה צֶבַע זֶה RED?', promptEn: 'Which color is RED?', promptEs: '¿Qué color es RED?', answer: 'אָדֹם', choices: ['אָדֹם', 'כָּחֹל', 'סָגֹל', 'לָבָן'], hintHe: 'כְּמוֹ תּוּת וְתַפּוּחַ 🔴!', hintEn: 'Like a strawberry 🔴!', hintEs: 'Como una fresa 🔴.', speak: 'Red' },
      { emoji: '🟢', display: 'GREEN', promptHe: 'אֵיזֶה צֶבַע זֶה GREEN?', promptEn: 'Which color is GREEN?', promptEs: '¿Qué color es GREEN?', answer: 'יָרֹק', choices: ['יָרֹק', 'צָהֹב', 'כָּתֹם', 'שָׁחֹר'], hintHe: 'כְּמוֹ דֶּשֶׁא וְעָלִים 🟢!', hintEn: 'Like grass and leaves 🟢!', hintEs: 'Como el pasto y las hojas 🟢.', speak: 'Green' },
      { emoji: '7️⃣', display: 'SEVEN', promptHe: 'אֵיזֶה מִסְפָּר זֶה SEVEN?', promptEn: 'Which number is SEVEN?', promptEs: '¿Qué número es SEVEN?', answer: '7', choices: ['7', '6', '8', '9'], hintHe: 'סוֹפְרִים בְּאַנְגְּלִית: One, Two, Three, Four, Five, Six, SEVEN!', hintEn: 'Count up: 5 (five), 6 (six), 7 (SEVEN)!', hintEs: 'Cuenta: 5 (five), 6 (six), 7 (SEVEN).', speak: 'Seven' },
      { emoji: '🔟', display: 'TEN', promptHe: 'אֵיזֶה מִסְפָּר זֶה TEN?', promptEn: 'Which number is TEN?', promptEs: '¿Qué número es TEN?', answer: '10', choices: ['10', '2', '8', '5'], hintHe: 'כַּמָּה אֶצְבָּעוֹת יֵשׁ בִּשְׁתֵּי הַיָּדַיִם יַחַד? TEN!', hintEn: 'How many fingers on both hands? TEN!', hintEs: '¿Cuántos dedos en ambas manos? ¡10!', speak: 'Ten' }
    ],
    everyday: [
      { emoji: '🍎', display: 'APPLE', promptHe: 'מָה הַפֵּרוּשׁ שֶׁל APPLE?', promptEn: 'What does APPLE mean?', promptEs: '¿Qué significa APPLE?', answer: 'תַּפּוּחַ', choices: ['תַּפּוּחַ', 'בָּנָנָה', 'לֶחֶם', 'מַיִם'], hintHe: 'פְּרִי עָגֹל וְטָעִים 🍎!', hintEn: 'A crunchy fruit 🍎!', hintEs: 'Una fruta crujiente 🍎.', speak: 'Apple' },
      { emoji: '📖', display: 'BOOK', promptHe: 'מָה הַפֵּרוּשׁ שֶׁל BOOK?', promptEn: 'What does BOOK mean?', promptEs: '¿Qué significa BOOK?', answer: 'סֵפֶר', choices: ['סֵפֶר', 'שֻׁלְחָן', 'בַּיִת', 'כַּדּוּר'], hintHe: 'קוֹרְאִים בּוֹ סִפּוּרִים 📖!', hintEn: 'We read stories in it 📖!', hintEs: 'Leemos cuentos en él 📖.', speak: 'Book' },
      { emoji: '🏠', display: 'HOUSE', promptHe: 'מָה הַפֵּרוּשׁ שֶׁל HOUSE?', promptEn: 'What does HOUSE mean?', promptEs: '¿Qué significa HOUSE?', answer: 'בַּיִת', choices: ['בַּיִת', 'מְכוֹנִית', 'עֵץ', 'שֶׁמֶשׁ'], hintHe: 'הַמָּקוֹם שֶׁבּוֹ אֲנַחְנוּ גָּרִים 🏠!', hintEn: 'The place where we live 🏠!', hintEs: 'El lugar donde vivimos 🏠.', speak: 'House' },
      { emoji: '💧', display: 'WATER', promptHe: 'מָה הַפֵּרוּשׁ שֶׁל WATER?', promptEn: 'What does WATER mean?', promptEs: '¿Qué significa WATER?', answer: 'מַיִם', choices: ['מַיִם', 'חָלָב', 'אֵשׁ', 'שֶׁלֶג'], hintHe: 'שׁוֹתִים כְּשֶׁצְּמֵאִים 💧!', hintEn: 'We drink it when thirsty 💧!', hintEs: 'Lo bebemos cuando tenemos sed 💧.', speak: 'Water' },
      { emoji: '😊', display: 'HAPPY', promptHe: 'מָה הַפֵּרוּשׁ שֶׁל HAPPY?', promptEn: 'What does HAPPY mean?', promptEs: '¿Qué significa HAPPY?', answer: 'שָׂמֵחַ', choices: ['שָׂמֵחַ', 'עָצוּב', 'עָיֵף', 'גָּדוֹל'], hintHe: 'חִיּוּךְ עֲנָק 😊 — כְּמוֹ בְּ-"Happy Birthday"!', hintEn: 'Big smile 😊 — like in "Happy Birthday"!', hintEs: 'Gran sonrisa 😊 — como en "Happy Birthday".', speak: 'Happy' }
    ]
  },

  hebrew_age9: {
    roots: [
      {
        emoji: '✍️',
        display: 'כּוֹתֵב • מִכְתָּב • כְּתִיבָה',
        promptHe: 'מָה שׁוֹרֶשׁ הַמִּלִּים הָאֵלּוּ (3 אוֹתִיּוֹת הַיְּסוֹד)?',
        promptEn: 'What is the 3-letter Hebrew root of these words?',
        promptEs: '¿Cuál es la raíz de 3 letras de estas palabras?',
        answer: 'כ-ת-ב',
        choices: ['כ-ת-ב', 'מ-כ-ת', 'כ-ו-ת', 'ת-ב-ה'],
        hintHe: 'חַפְּשׂוּ אֶת 3 הָאוֹתִיּוֹת שֶׁחוֹזְרוֹת בְּכָל הַמִּלִּים בְּאוֹתוֹ סֵדֶר: כ, ת, ב!',
        hintEn: 'Find the 3 letters that repeat in all three words in the same order: כ-ת-ב!',
        hintEs: 'Busca las 3 letras que se repiten en todas las palabras: כ-ת-ב.',
        speak: 'כותב, מכתב, כתיבה'
      },
      {
        emoji: '📚',
        display: 'לוֹמֵד • תַּלְמִיד • לִמּוּדִים',
        promptHe: 'מָה הַשׁוֹרֶשׁ הַמְּשֻׁתָּף לְמִשְׁפַּחַת הַמִּלִּים?',
        promptEn: 'What is the shared 3-letter root?',
        promptEs: '¿Cuál es la raíz compartida de 3 letras?',
        answer: 'ל-מ-ד',
        choices: ['ל-מ-ד', 'ת-ל-מ', 'ל-ו-מ', 'מ-ד-ד'],
        hintHe: 'מוֹרִידִים אוֹתִיּוֹת מוּסָפוֹת (כְּמוֹ ת׳, ו׳, ים) וְנִשְׁאָרִים עִם ל-מ-ד!',
        hintEn: 'Strip prefixes/suffixes (ת, ו, ים) and you’re left with ל-מ-ד!',
        hintEs: 'Quita prefijos y sufijos y queda ל-מ-ד.',
        speak: 'לומד, תלמיד, לימודים'
      },
      {
        emoji: '🎨',
        display: 'צִיּוּר • מְצַיֵּר • צַיָּר',
        promptHe: 'מָה הַשׁוֹרֶשׁ שֶׁל מִשְׁפַּחַת הַמִּלִּים?',
        promptEn: 'What is the root of this word family?',
        promptEs: '¿Cuál es la raíz de esta familia de palabras?',
        answer: 'צ-י-ר',
        choices: ['צ-י-ר', 'מ-צ-ר', 'צ-ו-ר', 'י-ר-ד'],
        hintHe: 'שָׁלוֹשׁ הָאוֹתִיּוֹת שֶׁמּוֹפִיעוֹת בְּכֻלָּן הֵן צ, י, ר!',
        hintEn: 'The 3 letters appearing in all of them are צ-י-ר!',
        hintEs: 'Las 3 letras que aparecen en todas son צ-י-ר.',
        speak: 'ציור, מצייר, צייר'
      },
      {
        emoji: '⚽',
        display: 'מִשְׂחָק • שַׂחְקָן • לְשַׂחֵק',
        promptHe: 'מִצְאוּ אֶת הַשׁוֹרֶשׁ שֶׁל הַמִּלִּים:',
        promptEn: 'Find the 3-letter root:',
        promptEs: 'Encuentra la raíz de 3 letras:',
        answer: 'שׂ-ח-ק',
        choices: ['שׂ-ח-ק', 'מ-שׂ-ח', 'ח-ק-נ', 'ל-שׂ-ח'],
        hintHe: 'אוֹתִיּוֹת הַשׁוֹרֶשׁ הַחוֹזְרוֹת בְּכָל מִלָּה הֵן שׂ, ח, ק!',
        hintEn: 'The repeating root letters across every word are שׂ-ח-ק!',
        hintEs: 'Las letras de raíz que se repiten son שׂ-ח-ק.',
        speak: 'משחק, שחקן, לשחק'
      }
    ],
    synonyms: [
      {
        emoji: '🦁',
        display: 'אָמִיץ ⇄ ?',
        promptHe: 'מָה הַהֵפֶךְ שֶׁל הַמִּלָּה "אָמִיץ"?',
        promptEn: 'What is the Hebrew opposite of "Amitz" (brave)?',
        promptEs: '¿Cuál es el opuesto de "Amitz" (valiente)?',
        answer: 'פַּחְדָן',
        choices: ['פַּחְדָן', 'גִּבּוֹר', 'חָזָק', 'מָהִיר'],
        hintHe: 'אָמִיץ = לֹא מְפַחֵד. הַהֵפֶךְ הוּא מִישֶׁהוּ שֶׁמְּפַחֵד (פַּחְדָן)!',
        hintEn: 'Brave = fearless. The opposite is fearful (פַּחְדָן)!',
        hintEs: 'Valiente = sin miedo. Lo opuesto es miedoso (פַּחְדָן).',
        speak: 'מה ההפך של אמיץ'
      },
      {
        emoji: '🏔️',
        display: 'גָּדוֹל = ?',
        promptHe: 'אֵיזוֹ מִלָּה נִרְדֶּפֶת (בְּאוֹתָהּ מַשְׁמָעוּת) לְ"גָּדוֹל"?',
        promptEn: 'Which word is a synonym for "Gadol" (big)?',
        promptEs: '¿Qué palabra es sinónimo de "Gadol" (grande)?',
        answer: 'עָצוּם',
        choices: ['עָצוּם', 'זָעִיר', 'קָצָר', 'צַר'],
        hintHe: 'מִלָּה נִרְדֶּפֶת = מִלָּה אַחֶרֶת עִם אוֹתָהּ מַשְׁמָעוּת (גָּדוֹל מְאֹד = עָצוּם)!',
        hintEn: 'Synonym means same meaning: very big = עָצוּם (huge)!',
        hintEs: 'Sinónimo significa mismo sentido: muy grande = עָצוּם.',
        speak: 'איזו מילה נרדפת לגדול'
      },
      {
        emoji: '✨',
        display: 'יָפֶה = ?',
        promptHe: 'אֵיזוֹ מִלָּה נִרְדֶּפֶת לְ"יָפֶה"?',
        promptEn: 'Which word is a synonym for "Yafe" (beautiful)?',
        promptEs: '¿Qué palabra es sinónimo de "Yafe" (bonito)?',
        answer: 'נָאֶה',
        choices: ['נָאֶה', 'מְכֹעָר', 'רָחוֹק', 'כָּבֵד'],
        hintHe: 'נָאֶה הִיא מִלָּה גְּבוֹהָה בְּעִבְרִית שֶׁמַּשְׁמָעוּתָהּ יָפֶה!',
        hintEn: 'נָאֶה (Naeh) is a rich Hebrew synonym for beautiful!',
        hintEs: 'נָאֶה significa bonito o agradable.',
        speak: 'איזו מילה נרדפת ליפה'
      },
      {
        emoji: '🐢',
        display: 'מָהִיר ⇄ ?',
        promptHe: 'מָה הַהֵפֶךְ שֶׁל "מָהִיר"?',
        promptEn: 'What is the opposite of "Mahir" (fast)?',
        promptEs: '¿Cuál es el opuesto de "Mahir" (rápido)?',
        answer: 'אִטִּי',
        choices: ['אִטִּי', 'זָרִיז', 'גָּבוֹהַּ', 'קָרוֹב'],
        hintHe: 'כְּמוֹ צָב הוֹלֵךְ לְאַט — אִטִּי!',
        hintEn: 'Like a turtle moving slowly — אִטִּי (slow)!',
        hintEs: 'Como una tortuga lenta: אִטִּי.',
        speak: 'מה ההפך של מהיר'
      }
    ],
    spelling: [
      {
        emoji: '🏫',
        display: 'הַשִּׁעוּר מַתְחִיל _____ הַצִּלְצוּל.',
        promptHe: 'אֵיזוֹ מִלָּה כְּתוּבָה בִּכְתִיב נָכוֹן ("אַחֲרֵי")?',
        promptEn: 'Which spelling is correct in Hebrew?',
        promptEs: '¿Qué ortografía en hebreo es correcta?',
        answer: 'אַחֲרֵי',
        choices: ['אַחֲרֵי', 'עַחֲרֵי', 'אַכֲרֵי', 'הַחֲרֵי'],
        hintHe: 'אַחֲרֵי כּוֹתְבִים עִם אָלֶף (א) וְחֵית (ח)!',
        hintEn: '"Acharei" (after) is spelled with Alef (א) and Chet (ח)!',
        hintEs: '"Acharei" se escribe con Álef (א) y Jet (ח).',
        speak: 'השיעור מתחיל אחרי הצלצול'
      },
      {
        emoji: '⏱️',
        display: 'הִגַּעְנוּ בִּזְמַן _____ הַתַּחֲרוּת.',
        promptHe: 'אֵיזוֹ מִלָּה כְּתוּבָה נָכוֹן ("לִקְרַאת")?',
        promptEn: 'Pick the correct Hebrew spelling of "Likrat" (towards):',
        promptEs: 'Elige la ortografía correcta de "Likrat":',
        answer: 'לִקְרַאת',
        choices: ['לִקְרַאת', 'לִכְרַאת', 'לִקְרַעט', 'לִקְרַט'],
        hintHe: 'לִקְרַאת מַגִּיעָה מֵהַשׁוֹרֶשׁ ק-ר-א — לָכֵן כּוֹתְבִים עִם קוֹף, אָלֶף וְתָּיו!',
        hintEn: 'It uses Kof (ק), Alef (א), and Tav (ת): לִקְרַאת!',
        hintEs: 'Se escribe con Kof (ק), Álef (א) y Tav (ת).',
        speak: 'הגענו בזמן לקראת התחרות'
      },
      {
        emoji: '💡',
        display: 'יֵשׁ לִי _____ מְעוּלֶּה לְמִשְׂחָק!',
        promptHe: 'בַּחֲרוּ אֶת הַכְּתִיב הַנָּכוֹן שֶׁל "רַעְיוֹן":',
        promptEn: 'Pick the correct Hebrew spelling of "Raayon" (idea):',
        promptEs: 'Elige la ortografía correcta de "Raayon" (idea):',
        answer: 'רַעְיוֹן',
        choices: ['רַעְיוֹן', 'רַאְיוֹן', 'רַהְיוֹן', 'רַעְיוֹנ'],
        hintHe: 'רַעְיוֹן כּוֹתְבִים עִם עַיִן (ע) בָּאֶמְצַע וְנוּן סוֹפִית (ן) בַּסּוֹף!',
        hintEn: '"Raayon" has Ayin (ע) in the middle and Final Nun (ן) at the end!',
        hintEs: '"Raayon" lleva Ayin (ע) en medio y Nun final (ן).',
        speak: 'יש לי רעיון מעולה למשחק'
      }
    ],
    tenses: [
      {
        emoji: '⏳',
        display: 'הַיּוֹם הוּא לוֹמֵד → אֶתְמוֹל הוּא _____',
        promptHe: 'הַשְׁלִימוּ אֶת הַפֹּעַל בִּזְמַן עָבָר:',
        promptEn: 'Complete the verb in past tense:',
        promptEs: 'Completa el verbo en tiempo pasado:',
        answer: 'לָמַד',
        choices: ['לָמַד', 'יִלְמַד', 'לוֹמְדִים', 'לִלְמֹד'],
        hintHe: 'אֶתְמוֹל = זְמַן עָבָר! אֶתְמוֹל הוּא לָמַד.',
        hintEn: 'Yesterday = past tense! Yesterday he studied (לָמַד).',
        hintEs: 'Ayer = pasado: אֶתְמוֹל הוּא לָמַד.',
        speak: 'היום הוא לומד, אתמול הוא למד'
      },
      {
        emoji: '🪑',
        display: 'שֻׁלְחָן אֶחָד → הַרְבֵּה _____',
        promptHe: 'מָה צוּרַת הָרַבִּים הַנְּכוֹנָה שֶׁל "שֻׁלְחָן"?',
        promptEn: 'What is the correct Hebrew plural of "Shulchan" (table)?',
        promptEs: '¿Cuál es el plural correcto de "Shulchan" (mesa)?',
        answer: 'שֻׁלְחָנוֹת',
        choices: ['שֻׁלְחָנוֹת', 'שֻׁלְחָנִים', 'שֻׁלְחָן', 'שֻׁלְחָנַיִם'],
        hintHe: 'שֻׁלְחָן הוּא יוֹצֵא דֹּפֶן: בְּרַבִּים אוֹמְרִים שֻׁלְחָנוֹת (עִם "וֹת")!',
        hintEn: 'Tricky Hebrew plural: "Shulchan" becomes שֻׁלְחָנוֹת (ends in -ot)!',
        hintEs: 'Plural irregular en hebreo: שֻׁלְחָנוֹת.',
        speak: 'שולחן אחד, הרבה שולחנות'
      },
      {
        emoji: '🚀',
        display: 'הַיּוֹם הִיא כּוֹתֶבֶת → מָחָר הִיא _____',
        promptHe: 'הַשְׁלִימוּ אֶת הַפֹּעַל בִּזְמַן עָתִיד:',
        promptEn: 'Complete the verb in future tense:',
        promptEs: 'Completa el verbo en futuro:',
        answer: 'תִּכְתֹּב',
        choices: ['תִּכְתֹּב', 'כָּתְבָה', 'כּוֹתֶבֶת', 'יִכְתֹּב'],
        hintHe: 'מָחָר = זְמַן עָתִיד! לְ"הִיא" בֶּעָתִיד מַתְחִילִים בְּאוֹת ת׳: תִּכְתֹּב.',
        hintEn: 'Tomorrow = future tense! For "she" (הִיא), future starts with Tav: תִּכְתֹּב.',
        hintEs: 'Mañana = futuro: para ella (הִיא) empieza con ת: תִּכְתֹּב.',
        speak: 'היום היא כותבת, מחר היא תכתוב'
      }
    ]
  },

  english_age9: {
    grammar: [
      {
        emoji: '🚲',
        display: 'She ___ a red bike.',
        promptHe: 'בַּחֲרוּ אֶת הַמִּלָּה הַנְּכוֹנָה בְּאַנְגְּלִית (have / has):',
        promptEn: 'Choose the right grammar word:',
        promptEs: 'Elige la palabra gramatical correcta:',
        answer: 'has',
        choices: ['has', 'have', 'are', 'am'],
        hintHe: 'טְרִיק בֵּית הַסֵּפֶר: עִם He / She / It תָּמִיד מִשְׁתַּמְּשִׁים בְּ-has (לֹא have)!',
        hintEn: 'School trick: He / She / It always takes "has"!',
        hintEs: 'Truco: con He / She / It siempre se usa "has".',
        speak: 'She has a red bike'
      },
      {
        emoji: '⚽',
        display: 'They ___ playing soccer.',
        promptHe: 'בַּחֲרוּ בֵּין am / is / are:',
        promptEn: 'Choose am, is, or are:',
        promptEs: 'Elige entre am, is o are:',
        answer: 'are',
        choices: ['are', 'is', 'am', 'has'],
        hintHe: 'They = הֵם (רַבִּים)! עִם You / We / They תָּמִיד כּוֹתְבִים are!',
        hintEn: 'You / We / They (plural) always take "are"!',
        hintEs: 'You / We / They siempre usan "are".',
        speak: 'They are playing soccer'
      },
      {
        emoji: '🎒',
        display: 'I ___ ready for school.',
        promptHe: 'בַּחֲרוּ אֶת הַמִּלָּה הַמַּתְאִימָה לְ-"I":',
        promptEn: 'Pick the matching verb for "I":',
        promptEs: 'Elige el verbo correcto para "I":',
        answer: 'am',
        choices: ['am', 'is', 'are', 'has'],
        hintHe: 'עִם I (אֲנִי) מִשְׁתַּמְּשִׁים רַק בְּ-am!',
        hintEn: '"I" always pairs with "am"!',
        hintEs: '"I" siempre va con "am".',
        speak: 'I am ready for school'
      },
      {
        emoji: '🐱',
        display: 'The cat ___ sleeping on the bed.',
        promptHe: 'בַּחֲרוּ בֵּין am / is / are:',
        promptEn: 'Choose the correct verb:',
        promptEs: 'Elige el verbo correcto:',
        answer: 'is',
        choices: ['is', 'are', 'am', 'have'],
        hintHe: 'The cat = חָתוּל אֶחָד (It / יָחִיד) — לָכֵן מִשְׁתַּמְּשִׁים בְּ-is!',
        hintEn: 'One cat = singular ("it"), so use "is"!',
        hintEs: 'Un gato = singular, así que usa "is".',
        speak: 'The cat is sleeping on the bed'
      }
    ],
    vocab: [
      { emoji: '🌤️', display: 'WEATHER', promptHe: 'מָה הַפֵּרוּשׁ שֶׁל WEATHER?', promptEn: 'What does WEATHER mean in Hebrew?', promptEs: '¿Qué significa WEATHER?', answer: 'מֶזֶג אֲוִיר', choices: ['מֶזֶג אֲוִיר', 'מַיִם', 'שָׁבוּעַ', 'חוֹרֶף'], hintHe: 'אִם שֶׁמֶשׁ אוֹ גֶּשֶׁם בַּחוּץ 🌤️ — מֶזֶג אֲוִיר!', hintEn: 'Sun, rain, or clouds outside 🌤️ = מֶזֶג אֲוִיר!', hintEs: 'Sol, lluvia o nubes afuera 🌤️.', speak: 'Weather' },
      { emoji: '🥞', display: 'BREAKFAST', promptHe: 'מָה הַפֵּרוּשׁ שֶׁל BREAKFAST?', promptEn: 'What does BREAKFAST mean in Hebrew?', promptEs: '¿Qué significa BREAKFAST?', answer: 'אֲרוּחַת בֹּקֶר', choices: ['אֲרוּחַת בֹּקֶר', 'אֲרוּחַת עֶרֶב', 'הַפְסָקָה', 'מִטְבָּח'], hintHe: 'הָאֲרוּחָה הָרִאשׁוֹנָה שֶׁל הַיּוֹם בַּבֹּקֶר 🥞!', hintEn: 'The first meal of the morning 🥞!', hintEs: 'La primera comida de la mañana 🥞.', speak: 'Breakfast' },
      { emoji: '❓', display: 'QUESTION', promptHe: 'מָה הַפֵּרוּשׁ שֶׁל QUESTION?', promptEn: 'What does QUESTION mean in Hebrew?', promptEs: '¿Qué significa QUESTION?', answer: 'שְׁאֵלָה', choices: ['שְׁאֵלָה', 'תְּשׁוּבָה', 'מִשְׁפָּט', 'סִפּוּר'], hintHe: 'כְּשֶׁמְּרִימִים יָד בַּכִּתָּה כְּדֵי לִשְׁאֹל ❓!', hintEn: 'What you ask when raising your hand ❓!', hintEs: 'Lo que haces al levantar la mano ❓.', speak: 'Question' },
      { emoji: '📅', display: 'YESTERDAY', promptHe: 'מָה הַפֵּרוּשׁ שֶׁל YESTERDAY?', promptEn: 'What does YESTERDAY mean in Hebrew?', promptEs: '¿Qué significa YESTERDAY?', answer: 'אֶתְמוֹל', choices: ['אֶתְמוֹל', 'מָחָר', 'הַיּוֹם', 'תָּמִיד'], hintHe: 'הַיּוֹם שֶׁהָיָה לִפְנֵי הַיּוֹם — אֶתְמוֹל!', hintEn: 'The day before today = אֶתְמוֹל!', hintEs: 'El día antes de hoy = ayer.', speak: 'Yesterday' }
    ],
    opposites_plurals: [
      { emoji: '⚡', display: 'FAST ⇄ ?', promptHe: 'מָה הַהֵפֶךְ שֶׁל FAST בְּאַנְגְּלִית?', promptEn: 'What is the opposite of FAST?', promptEs: '¿Cuál es el opuesto de FAST?', answer: 'SLOW', choices: ['SLOW', 'BIG', 'HIGH', 'OLD'], hintHe: 'FAST = מָהִיר. הַהֵפֶךְ שֶׁל מָהִיר הוּא אִטִּי (SLOW)!', hintEn: 'Fast ↔ Slow (like a turtle)!', hintEs: 'Rápido ↔ lento (SLOW).', speak: 'Fast and slow' },
      { emoji: '🌅', display: 'EARLY ⇄ ?', promptHe: 'מָה הַהֵפֶךְ שֶׁל EARLY (מֻקְדָּם)?', promptEn: 'What is the opposite of EARLY?', promptEs: '¿Cuál es el opuesto de EARLY?', answer: 'LATE', choices: ['LATE', 'SOON', 'DARK', 'COLD'], hintHe: 'EARLY = מֻקְדָּם. הַהֵפֶךְ הוּא מְאֻחָר (LATE)!', hintEn: 'Early ↔ Late!', hintEs: 'Temprano ↔ tarde (LATE).', speak: 'Early and late' },
      { emoji: '📦', display: 'one box → two ___', promptHe: 'אֵיךְ כּוֹתְבִים box בְּרַבִּים בְּאַנְגְּלִית?', promptEn: 'What is the plural of "box"?', promptEs: '¿Cuál es el plural de "box"?', answer: 'boxes', choices: ['boxes', 'boxs', 'boxies', 'box'], hintHe: 'מִלָּה שֶׁנִּגְמֶרֶת בְּ-x מְקַבֶּלֶת es בְּרַבִּים: boxes!', hintEn: 'Words ending in -x add -es for plural: boxes!', hintEs: 'Las palabras terminadas en -x añaden -es: boxes.', speak: 'Two boxes' },
      { emoji: '🧒', display: 'one child → three ___', promptHe: 'אֵיךְ כּוֹתְבִים child (יֶלֶד) בְּרַבִּים?', promptEn: 'What is the plural of "child"?', promptEs: '¿Cuál es el plural de "child"?', answer: 'children', choices: ['children', 'childs', 'childes', 'childrens'], hintHe: 'יוֹצֵא דֹּפֶן חָשׁוּב בְּאַנְגְּלִית: child → children!', hintEn: 'Irregular plural: one child → three children!', hintEs: 'Plural irregular: child → children.', speak: 'Three children' }
    ]
  }
};

let skillSeq = 0;

export function generateSkillQuestion(arenaId, topicId = 'mix') {
  skillSeq += 1;
  const arenaBank = BANKS[arenaId] || BANKS.hebrew_age7;
  const topicKeys = Object.keys(arenaBank);
  const chosenTopic = topicId === 'mix' || !arenaBank[topicId]
    ? topicKeys[Math.floor(Math.random() * topicKeys.length)]
    : topicId;

  const list = arenaBank[chosenTopic];
  const item = list[Math.floor(Math.random() * list.length)];

  return {
    ...item,
    id: `sk-${arenaId}-${chosenTopic}-${skillSeq}-${Date.now()}`,
    topic: chosenTopic,
    choices: shuffle(item.choices)
  };
}
