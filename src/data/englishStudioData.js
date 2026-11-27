// Curated English learning decks for Age 7 (Grades 1-2) and Age 9 (Grades 3-4)
// Full trilingual support (Hebrew, English, Spanish):
// - Full A-Z English Phonics & Picture Cards (Age 7)
// - Listen & Spell Word Banks (Age 7 & Age 9)
// - Thematic Flashcards with Example Sentences (Age 9)
// - English Sentence Builder / Word-Order Puzzles (Age 9)

export const ENGLISH_ABC_CARDS = [
  { upper: 'A', lower: 'a', word: 'Apple', emoji: '🍎', he: 'תַּפּוּחַ', es: 'Manzana', soundHe: 'אֶה / אֵי', soundEn: '/æ/ as in Apple', soundEs: 'a / ei', sentence: 'I eat a red apple.' },
  { upper: 'B', lower: 'b', word: 'Ball', emoji: '⚽', he: 'כַּדּוּר', es: 'Pelota', soundHe: 'בּ', soundEn: '/b/ as in Ball', soundEs: 'b', sentence: 'Kick the big ball.' },
  { upper: 'C', lower: 'c', word: 'Cat', emoji: '🐱', he: 'חָתוּל', es: 'Gato', soundHe: 'ק / כּ', soundEn: '/k/ as in Cat', soundEs: 'k / s', sentence: 'The cat is cute.' },
  { upper: 'D', lower: 'd', word: 'Dog', emoji: '🐶', he: 'כֶּלֶב', es: 'Perro', soundHe: 'ד', soundEn: '/d/ as in Dog', soundEs: 'd', sentence: 'My dog loves to run.' },
  { upper: 'E', lower: 'e', word: 'Elephant', emoji: '🐘', he: 'פִּיל', es: 'Elefante', soundHe: 'אֶה', soundEn: '/e/ as in Elephant', soundEs: 'e / i', sentence: 'The elephant is huge.' },
  { upper: 'F', lower: 'f', word: 'Fish', emoji: '🐟', he: 'דָּג', es: 'Pez', soundHe: 'פ', soundEn: '/f/ as in Fish', soundEs: 'f', sentence: 'A blue fish swims.' },
  { upper: 'G', lower: 'g', word: 'Giraffe', emoji: '🦒', he: 'גִּ׳ירָפָה', es: 'Jirafa', soundHe: 'ג / ג׳', soundEn: '/dʒ/ or /g/', soundEs: 'g / y', sentence: 'The giraffe is tall.' },
  { upper: 'H', lower: 'h', word: 'House', emoji: '🏠', he: 'בַּיִת', es: 'Casa', soundHe: 'ה', soundEn: '/h/ as in House', soundEs: 'j suave', sentence: 'This is my house.' },
  { upper: 'I', lower: 'i', word: 'Ice Cream', emoji: '🍦', he: 'גְּלִידָה', es: 'Helado', soundHe: 'אִי / אַי', soundEn: '/aɪ/ as in Ice', soundEs: 'i / ai', sentence: 'I like ice cream!' },
  { upper: 'J', lower: 'j', word: 'Juice', emoji: '🧃', he: 'מִיץ', es: 'Jugo', soundHe: 'ג׳', soundEn: '/dʒ/ as in Juice', soundEs: 'y fuerte', sentence: 'Drink orange juice.' },
  { upper: 'K', lower: 'k', word: 'Kite', emoji: '🪁', he: 'עֲפִיפוֹן', es: 'Cometa', soundHe: 'ק', soundEn: '/k/ as in Kite', soundEs: 'k', sentence: 'Fly the kite high.' },
  { upper: 'L', lower: 'l', word: 'Lion', emoji: '🦁', he: 'אַרְיֵה', es: 'León', soundHe: 'ל', soundEn: '/l/ as in Lion', soundEs: 'l', sentence: 'The lion can roar.' },
  { upper: 'M', lower: 'm', word: 'Moon', emoji: '🌙', he: 'יָרֵחַ', es: 'Luna', soundHe: 'מ', soundEn: '/m/ as in Moon', soundEs: 'm', sentence: 'Look at the moon.' },
  { upper: 'N', lower: 'n', word: 'Nest', emoji: '🪺', he: 'קֵן', es: 'Nido', soundHe: 'נ', soundEn: '/n/ as in Nest', soundEs: 'n', sentence: 'Three eggs in a nest.' },
  { upper: 'O', lower: 'o', word: 'Orange', emoji: '🍊', he: 'תַּפּוּז', es: 'Naranja', soundHe: 'אוֹ', soundEn: '/ɔː/ as in Orange', soundEs: 'o', sentence: 'An orange is sweet.' },
  { upper: 'P', lower: 'p', word: 'Penguin', emoji: '🐧', he: 'פִּינְגְּוִין', es: 'Pingüino', soundHe: 'פּ', soundEn: '/p/ as in Penguin', soundEs: 'p', sentence: 'The penguin loves snow.' },
  { upper: 'Q', lower: 'q', word: 'Queen', emoji: '👑', he: 'מַלְכָּה', es: 'Reina', soundHe: 'קְוו', soundEn: '/kw/ as in Queen', soundEs: 'ku', sentence: 'The queen wears a crown.' },
  { upper: 'R', lower: 'r', word: 'Rainbow', emoji: '🌈', he: 'קֶשֶׁת בֶּעָנָן', es: 'Arcoíris', soundHe: 'ר', soundEn: '/r/ as in Rainbow', soundEs: 'r suave', sentence: 'Look at the bright rainbow.' },
  { upper: 'S', lower: 's', word: 'Sun', emoji: '☀️', he: 'שֶׁמֶשׁ', es: 'Sol', soundHe: 'ס', soundEn: '/s/ as in Sun', soundEs: 's', sentence: 'The sun is yellow.' },
  { upper: 'T', lower: 't', word: 'Tiger', emoji: '🐯', he: 'נָמֵר', es: 'Tigre', soundHe: 'ט', soundEn: '/t/ as in Tiger', soundEs: 't', sentence: 'The tiger runs fast.' },
  { upper: 'U', lower: 'u', word: 'Umbrella', emoji: '☂️', he: 'מִטְרִיָּה', es: 'Paraguas', soundHe: 'אַה', soundEn: '/ʌ/ as in Umbrella', soundEs: 'a / yu', sentence: 'Open your umbrella.' },
  { upper: 'V', lower: 'v', word: 'Violin', emoji: '🎻', he: 'כִּנּוֹר', es: 'Violín', soundHe: 'ו / ב', soundEn: '/v/ as in Violin', soundEs: 'v', sentence: 'She plays the violin.' },
  { upper: 'W', lower: 'w', word: 'Whale', emoji: '🐳', he: 'לִוְיָתָן', es: 'Ballena', soundHe: 'וו', soundEn: '/w/ as in Whale', soundEs: 'gu / u', sentence: 'The whale lives in the sea.' },
  { upper: 'X', lower: 'x', word: 'Xylophone', emoji: '🎼', he: 'קְסִילוֹפוֹן', es: 'Xilófono', soundHe: 'קְס / ז', soundEn: '/ks/ or /z/', soundEs: 'ks / z', sentence: 'Play music on the xylophone.' },
  { upper: 'Y', lower: 'y', word: 'Yellow', emoji: '💛', he: 'צָהֹב', es: 'Amarillo', soundHe: 'י', soundEn: '/j/ as in Yellow', soundEs: 'y', sentence: 'The banana is yellow.' },
  { upper: 'Z', lower: 'z', word: 'Zebra', emoji: '🦓', he: 'זֶבְּרָה', es: 'Cebra', soundHe: 'ז', soundEn: '/z/ as in Zebra', soundEs: 'z sonora', sentence: 'A zebra has stripes.' }
];

export const SPELLING_WORDS_AGE7 = [
  { word: 'CAT', emoji: '🐱', he: 'חָתוּל', en: 'A furry pet that says meow', es: 'Gato', hintHe: 'מַתְחִיל בְּ-C וְנִגְמָר בְּ-T', hintEn: 'Starts with C and ends with T', hintEs: 'Empieza con C y termina con T' },
  { word: 'DOG', emoji: '🐶', he: 'כֶּלֶב', en: 'A friendly pet that barks', es: 'Perro', hintHe: 'D - O - G', hintEn: 'Sounds like D - O - G', hintEs: 'Suena D - O - G' },
  { word: 'SUN', emoji: '☀️', he: 'שֶׁמֶשׁ', en: 'Shines bright in the sky', es: 'Sol', hintHe: 'מַתְחִיל בְּ-S (ס)', hintEn: 'Starts with S', hintEs: 'Empieza con S' },
  { word: 'RED', emoji: '🔴', he: 'אָדֹם', en: 'Color of a strawberry', es: 'Rojo', hintHe: 'R - E - D', hintEn: '3 letters: R - E - D', hintEs: '3 letras: R - E - D' },
  { word: 'BUS', emoji: '🚌', he: 'אוֹטוֹבּוּס', en: 'Big yellow vehicle for school', es: 'Autobús', hintHe: 'מַתְחִיל בְּ-B (בּ)', hintEn: 'Starts with B and ends with S', hintEs: 'Empieza con B y termina con S' },
  { word: 'HAT', emoji: '🎩', he: 'כּוֹבַע', en: 'You wear it on your head', es: 'Sombrero', hintHe: 'מַתְחִיל בְּ-H וְנִגְמָר בְּ-T', hintEn: 'Starts with H and rhymes with CAT', hintEs: 'Empieza con H y rima con CAT' },
  { word: 'CUP', emoji: '🥤', he: 'כּוֹס', en: 'You drink water from it', es: 'Taza / Vaso', hintHe: 'C - U - P', hintEn: '3 letters: C - U - P', hintEs: '3 letras: C - U - P' },
  { word: 'BED', emoji: '🛏️', he: 'מִטָּה', en: 'You sleep on it at night', es: 'Cama', hintHe: 'B - E - D', hintEn: 'Starts with B and rhymes with RED', hintEs: 'Empieza con B y rima con RED' },
  { word: 'BOX', emoji: '📦', he: 'קֻפְסָה', en: 'Cardboard container', es: 'Caja', hintHe: 'נִגְמָר בְּאוֹת X!', hintEn: 'Ends with the letter X!', hintEs: '¡Termina con la letra X!' },
  { word: 'FISH', emoji: '🐟', he: 'דָּג', en: 'Swims in the sea', es: 'Pez', hintHe: 'מַתְחִיל בְּ-F וְנִגְמָר בְּ-SH (שׁ)', hintEn: 'Starts with F and ends with SH', hintEs: 'Empieza con F y termina con SH' },
  { word: 'STAR', emoji: '⭐', he: 'כּוֹכָב', en: 'Twinkles in the night sky', es: 'Estrella', hintHe: 'מַתְחִיל בְּ-ST', hintEn: 'Starts with ST + AR', hintEs: 'Empieza con ST + AR' },
  { word: 'BOOK', emoji: '📖', he: 'סֵפֶר', en: 'Full of stories to read', es: 'Libro', hintHe: 'יֵשׁ שְׁתֵּי אוֹתִיּוֹת O בָּאֶמְצַע!', hintEn: 'Has double O in the middle!', hintEs: '¡Tiene doble O en el medio!' },
  { word: 'BLUE', emoji: '🔵', he: 'כָּחֹל', en: 'Color of the clear sky', es: 'Azul', hintHe: 'B - L - U - E', hintEn: 'Starts with BL and ends with E', hintEs: 'Empieza con BL y termina con E' },
  { word: 'FROG', emoji: '🐸', he: 'צְפַרְדֵּעַ', en: 'Green animal that hops', es: 'Rana', hintHe: 'מַתְחִיל בְּ-FR', hintEn: 'Starts with FR + OG', hintEs: 'Empieza con FR + OG' }
];

export const SPELLING_WORDS_AGE9 = [
  { word: 'SCHOOL', emoji: '🏫', he: 'בֵּית סֵפֶר', en: 'Place where students learn', es: 'Escuela', hintHe: 'מַתְחִיל בְּ-SCH וְיֵשׁ OO בָּאֶמְצַע', hintEn: 'Starts with SCH + double O + L', hintEs: 'Empieza con SCH + doble O + L' },
  { word: 'FRIEND', emoji: '🤝', he: 'חָבֵר / חֲבֵרָה', en: 'Someone you love playing with', es: 'Amigo / Amiga', hintHe: 'זִכְרוּ: FR-I-END (בְּסוֹף יֵשׁ END!)', hintEn: 'Memory trick: FR-I-END (ends with END!)', hintEs: 'Truco: FR-I-END (¡termina en END!)' },
  { word: 'WATER', emoji: '💧', he: 'מַיִם', en: 'Clear drink we need every day', es: 'Agua', hintHe: 'W - A - T - E - R', hintEn: 'WA + TER', hintEs: 'WA + TER' },
  { word: 'HAPPY', emoji: '😊', he: 'שָׂמֵחַ', en: 'Feeling joyful and smiling', es: 'Feliz', hintHe: 'יֵשׁ שְׁתֵּי אוֹתִיּוֹת P בָּאֶמְצַע!', hintEn: 'Has double P in the middle!', hintEs: '¡Lleva doble P en el medio!' },
  { word: 'WINTER', emoji: '❄️', he: 'חוֹרֶף', en: 'The cold rainy season', es: 'Invierno', hintHe: 'WIN + TER', hintEn: 'Split into two parts: WIN + TER', hintEs: 'Dos partes: WIN + TER' },
  { word: 'SUMMER', emoji: '🏖️', he: 'קַיִץ', en: 'The hot beach season', es: 'Verano', hintHe: 'יֵשׁ שְׁתֵּי אוֹתִיּוֹת M בָּאֶמְצַע!', hintEn: 'Has double M in the middle!', hintEs: '¡Lleva doble M en el medio!' },
  { word: 'GARDEN', emoji: '🌻', he: 'גִּנָּה', en: 'Place where flowers grow', es: 'Jardín', hintHe: 'GAR + DEN', hintEn: 'Two parts: GAR + DEN', hintEs: 'Dos partes: GAR + DEN' },
  { word: 'FAMILY', emoji: '👨‍👩‍👧‍👦', he: 'מִשְׁפָּחָה', en: 'Parents, kids and relatives', es: 'Familia', hintHe: 'FAM + I + LY', hintEn: 'FAM + I + LY', hintEs: 'FAM + I + LY' },
  { word: 'PLANET', emoji: '🪐', he: 'כּוֹכַב לֶכֶת', en: 'Earth or Mars in space', es: 'Planeta', hintHe: 'PLA + NET', hintEn: 'Two parts: PLA + NET', hintEs: 'Dos partes: PLA + NET' },
  { word: 'ANIMAL', emoji: '🦁', he: 'בַּעַל חַיִּים', en: 'Living creature like a lion or dog', es: 'Animal', hintHe: 'ANI + MAL', hintEn: 'ANI + MAL', hintEs: 'ANI + MAL' },
  { word: 'MORNING', emoji: '🌅', he: 'בֹּקֶר', en: 'Early part of the day', es: 'Mañana', hintHe: 'MORN + ING', hintEn: 'MORN + ING', hintEs: 'MORN + ING' },
  { word: 'TEACHER', emoji: '👩‍🏫', he: 'מוֹרֶה / מוֹרָה', en: 'Person who teaches in class', es: 'Maestro / Maestra', hintHe: 'TEACH + ER', hintEn: 'TEACH + ER', hintEs: 'TEACH + ER' }
];

export const AGE9_FLASHCARD_DECKS = [
  {
    id: 'school',
    icon: '🏫',
    titleHe: 'בֵּית סֵפֶר',
    titleEn: 'School',
    titleEs: 'Escuela',
    cards: [
      { en: 'Library', he: 'סִפְרִיָּה', es: 'Biblioteca', enDef: 'A quiet room full of books', emoji: '📚', example: 'We read quiet books in the library.' },
      { en: 'Notebook', he: 'מַחְבֶּרֶת', es: 'Cuaderno', enDef: 'Paper book for writing notes', emoji: '📓', example: 'Write the new words in your notebook.' },
      { en: 'Homework', he: 'שִׁעוּרֵי בַּיִת', es: 'Tarea', enDef: 'School practice done at home', emoji: '✏️', example: 'I finished my homework before dinner.' },
      { en: 'Question', he: 'שְׁאֵלָה', es: 'Pregunta', enDef: 'Something you ask to learn', emoji: '❓', example: 'Raise your hand to ask a question.' },
      { en: 'Answer', he: 'תְּשׁוּבָה', es: 'Respuesta', enDef: 'Reply to a question', emoji: '💡', example: 'You found the right answer!' },
      { en: 'Science', he: 'מַדָּע', es: 'Ciencia', enDef: 'Studying nature and experiments', emoji: '🔬', example: 'Science class is full of cool experiments.' }
    ]
  },
  {
    id: 'verbs',
    icon: '🏃',
    titleHe: 'פְּעָלִים חֲשׁוּבִים',
    titleEn: 'Action Verbs',
    titleEs: 'Verbos',
    cards: [
      { en: 'Understand', he: 'לְהָבִין', es: 'Entender', enDef: 'To know what something means', emoji: '🧠', example: 'Now I understand the math problem!' },
      { en: 'Remember', he: 'לִזְכֹּר', es: 'Recordar', enDef: 'To keep in your memory', emoji: '💭', example: 'Remember to bring your water bottle.' },
      { en: 'Travel', he: 'לְטַיֵּל / לִנְסֹעַ', es: 'Viajar', enDef: 'To go visit new places', emoji: '✈️', example: 'We love to travel in the summer.' },
      { en: 'Build', he: 'לִבְנוֹת', es: 'Construir', enDef: 'To make by putting parts together', emoji: '🧱', example: 'Let us build a tall tower together.' },
      { en: 'Listen', he: 'לְהַקְשִׁיב', es: 'Escuchar', enDef: 'To pay attention to sounds', emoji: '🎧', example: 'Listen carefully to the English story.' },
      { en: 'Explore', he: 'לַחְקֹר / לְגַלּוֹת', es: 'Explorar', enDef: 'To discover and search around', emoji: '🧭', example: 'Astronauts explore space and planets.' }
    ]
  },
  {
    id: 'phrases',
    icon: '💬',
    titleHe: 'בִּטּוּיִים יוֹמְיוֹמִיִּים',
    titleEn: 'Useful Phrases',
    titleEs: 'Frases útiles',
    cards: [
      { en: 'Excuse me', he: 'סְלִיחָה', es: 'Disculpa / Perdón', enDef: 'Polite way to get attention', emoji: '🙋', example: 'Excuse me, where is the park?' },
      { en: 'How much is it?', he: 'כַּמָּה זֶה עוֹלֶה?', es: '¿Cuánto cuesta?', enDef: 'Asking the price of an item', emoji: '🛍️', example: 'How much is this blue notebook?' },
      { en: 'Can you help me?', he: 'אֶפְשָׁר לַעֲזֹר לִי?', es: '¿Puedes ayudarme?', enDef: 'Politely asking for help', emoji: '🤝', example: 'Can you help me read this word?' },
      { en: 'See you tomorrow!', he: 'נִתְרָאֶה מָחָר!', es: '¡Hasta mañana!', enDef: 'Friendly goodbye until next day', emoji: '👋', example: 'Goodbye friends, see you tomorrow!' },
      { en: 'I am proud of you', he: 'אֲנִי גֵּאֶה בְּךָ / בָּךְ', es: 'Estoy orgulloso de ti', enDef: 'Praising someone for great effort', emoji: '🏆', example: 'Great work! I am proud of you.' },
      { en: 'What time is it?', he: 'מָה הַשָּׁעָה?', es: '¿Qué hora es?', enDef: 'Asking for the clock time', emoji: '⏰', example: 'What time is it? It is three o’clock.' }
    ]
  }
];

export const AGE9_SENTENCE_PUZZLES = [
  {
    emoji: '🚲',
    he: 'יֵשׁ לָהּ אוֹפַנַּיִם כְּחֻלִּים.',
    en: 'Build a sentence about a girl and her blue bike:',
    es: 'Ella tiene una bicicleta azul.',
    words: ['She', 'has', 'a', 'blue', 'bike.'],
    hintHe: 'מַתְחִילִים בְּ-"She" וְאַחֲרָיו הַפֹּעַל "has".',
    hintEn: 'Start with "She", then the verb "has".',
    hintEs: 'Empieza con "She" seguido del verbo "has".'
  },
  {
    emoji: '📚',
    he: 'אֲנִי אוֹהֵב לִקְרֹא סְפָרִים.',
    en: 'Build a sentence about loving to read books:',
    es: 'Me gusta leer libros.',
    words: ['I', 'like', 'to', 'read', 'books.'],
    hintHe: 'מַתְחִילִים בְּ-"I like to...".',
    hintEn: 'Start with "I like to...".',
    hintEs: 'Empieza con "I like to...".'
  },
  {
    emoji: '🐶',
    he: 'הַכֶּלֶב יָשֵׁן מִתַּחַת לַשֻּׁלְחָן.',
    en: 'Build a sentence saying where the dog is:',
    es: 'El perro está debajo de la mesa.',
    words: ['The', 'dog', 'is', 'under', 'the', 'table.'],
    hintHe: 'מַתְחִילִים בְּ-"The dog is...".',
    hintEn: 'Start with "The dog is...".',
    hintEs: 'Empieza con "The dog is...".'
  },
  {
    emoji: '🏫',
    he: 'אֲנַחְנוּ הוֹלְכִים לְבֵית הַסֵּפֶר.',
    en: 'Build a sentence about going to school:',
    es: 'Nosotros vamos a la escuela.',
    words: ['We', 'are', 'going', 'to', 'school.'],
    hintHe: 'מַתְחִילִים בְּ-"We are going...".',
    hintEn: 'Start with "We are going...".',
    hintEs: 'Empieza con "We are going...".'
  },
  {
    emoji: '⚽',
    he: 'הֵם מְשַׂחֲקִים כַּדּוּרֶגֶל בַּפַּארְק.',
    en: 'Build a sentence about playing soccer in the park:',
    es: 'Ellos juegan fútbol en el parque.',
    words: ['They', 'play', 'soccer', 'in', 'the', 'park.'],
    hintHe: 'מַתְחִילִים בְּ-"They play soccer...".',
    hintEn: 'Start with "They play soccer...".',
    hintEs: 'Empieza con "They play soccer...".'
  },
  {
    emoji: '🌞',
    he: 'מֶזֶג הָאֲוִיר חַם וְשִׁמְשִׁי הַיּוֹם.',
    en: 'Build a sentence about warm sunny weather today:',
    es: 'Hoy está cálido y soleado.',
    words: ['Today', 'is', 'warm', 'and', 'sunny.'],
    hintHe: 'מַתְחִילִים בְּ-"Today is...".',
    hintEn: 'Start with "Today is...".',
    hintEs: 'Empieza con "Today is...".'
  },
  {
    emoji: '🎵',
    he: 'אֲחוֹתִי מְנַגֶּנֶת בַּפְּסַנְתֵּר.',
    en: 'Build a sentence about your sister playing piano:',
    es: 'Mi hermana toca el piano.',
    words: ['My', 'sister', 'plays', 'the', 'piano.'],
    hintHe: 'מַתְחִילִים בְּ-"My sister plays...".',
    hintEn: 'Start with "My sister plays...".',
    hintEs: 'Empieza con "My sister plays...".'
  },
  {
    emoji: '🍎',
    he: 'הוּא אוֹכֵל תַּפּוּחַ בְּכָל בֹּקֶר.',
    en: 'Build a sentence about eating an apple every morning:',
    es: 'Él come una manzana cada mañana.',
    words: ['He', 'eats', 'an', 'apple', 'every', 'morning.'],
    hintHe: 'זִכְרוּ: לִפְנֵי apple שָׂמִים "an"!',
    hintEn: 'Remember: use "an" before "apple"!',
    hintEs: 'Recuerda: antes de "apple" se usa "an".'
  }
];
