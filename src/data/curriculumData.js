// Curriculum data faithfully extracted from the 15-page PDF
// Aligned with Israeli Ministry of Education (Misrad HaChinuch) preschool literacy & early math standards.

export const LETTER_NAMES_DICT = {
  'א': { he: 'אָלֶף', en: 'Alef', es: 'Álef' },
  'בּ': { he: 'בֵּית', en: 'Bet', es: 'Bet' },
  'ב': { he: 'וֵית', en: 'Vet', es: 'Vet' },
  'ג': { he: 'גִּימֶל', en: 'Gimel', es: 'Guímel' },
  'ד': { he: 'דָּלֶת', en: 'Dalet', es: 'Dálet' },
  'ה': { he: 'הֵא', en: 'Hay', es: 'He' },
  'ו': { he: 'וָו', en: 'Vav', es: 'Vav' },
  'ז': { he: 'זַיִן', en: 'Zayin', es: 'Zayin' },
  'ח': { he: 'חֵית', en: 'Chet', es: 'Jet' },
  'ט': { he: 'טֵית', en: 'Tet', es: 'Tet' },
  'י': { he: 'יוּד', en: 'Yud', es: 'Yod' },
  'כּ': { he: 'כַּף', en: 'Kaf', es: 'Kaf' },
  'כ': { he: 'כַף (חָף)', en: 'Chaf', es: 'Jaf' },
  'ל': { he: 'לָמֶד', en: 'Lamed', es: 'Lámed' },
  'מ': { he: 'מֵם', en: 'Mem', es: 'Mem' },
  'נ': { he: 'נוּן', en: 'Nun', es: 'Nun' },
  'ס': { he: 'סָמֶךְ', en: 'Samekh', es: 'Sámej' },
  'ע': { he: 'עַיִן', en: 'Ayin', es: 'Ayin' },
  'פּ': { he: 'פֵּי', en: 'Pay', es: 'Pe' },
  'פ': { he: 'פֵיי', en: 'Fay', es: 'Fe' },
  'צ': { he: 'צָדִי', en: 'Sadi', es: 'Tsadi' },
  'ק': { he: 'קוּף', en: 'Kof', es: 'Kof' },
  'ר': { he: 'רֵישׁ', en: 'Resh', es: 'Resh' },
  'שׁ': { he: 'שִׁין', en: 'Shin', es: 'Shin' },
  'שׂ': { he: 'שִׂין', en: 'Sin', es: 'Sin' },
  'ת': { he: 'תָּיו', en: 'Tav', es: 'Tav' }
};

export const LETTERS_DATA = [
  // Page 1
  {
    id: 'alef',
    letter: 'א',
    displayWithNikud: 'אָלֶף',
    nameHe: 'אָלֶף',
    nameEn: 'Alef',
    nameEs: 'Álef',
    soundHe: 'אָה!',
    soundQuoteHe: 'וְצוֹעֶקֶת: "אָה!"',
    soundQuoteEn: 'Shouting: "Ah!"',
    soundQuoteEs: 'Gritando: "¡Ah!"',
    shapeDescriptionHe: 'כוכב זוהר של התחלה!',
    shapeDescriptionEn: 'A bright opening star!',
    shapeDescriptionEs: '¡Una brillante estrella de comienzo!',
    hasPupik: false,
    color: 'from-amber-400 to-orange-500',
    borderColor: 'border-amber-400',
    badgeColor: 'bg-amber-100 text-amber-800',
    examples: [
      { he: 'אַבַטִּיחַ', en: 'Watermelon', es: 'Sandía', emoji: '🍉', phonetic: 'Avatiach' },
      { he: 'אַרְיֵה', en: 'Lion', es: 'León', emoji: '🦁', phonetic: 'Aryeh' },
      { he: 'אֲוִירוֹן', en: 'Airplane', es: 'Avión', emoji: '✈️', phonetic: 'Aviron' },
      { he: 'אַבָּא', en: 'Daddy', es: 'Papá', emoji: '👨‍👧', phonetic: 'Abba' }
    ]
  },
  {
    id: 'bet_dagesh',
    letter: 'בּ',
    displayWithNikud: 'בֵּית',
    nameHe: 'בֵּית (עם פופיק!)',
    nameEn: 'Bet (with Pupik!)',
    nameEs: 'Bet (¡con ombliguito!)',
    soundHe: 'בּוּהּ!',
    soundQuoteHe: 'וְקוֹפֶצֶת: "בּוּהּ!"',
    soundQuoteEn: 'Jumping: "Buh!"',
    soundQuoteEs: 'Saltando: "¡Buh!"',
    shapeDescriptionHe: 'יֵשׁ פּוּפִּיק בַּבֶּטֶן! (קוֹל בּוּם!)',
    shapeDescriptionEn: 'Has a belly-button dot! (Boom sound!)',
    shapeDescriptionEs: '¡Tiene un puntito en la pancita! (¡Sonido bum!)',
    hasPupik: true,
    color: 'from-blue-500 to-indigo-600',
    borderColor: 'border-blue-500',
    badgeColor: 'bg-blue-100 text-blue-800',
    examples: [
      { he: 'בַּלּוֹן', en: 'Balloon', es: 'Globo', emoji: '🎈', phonetic: 'Balon' },
      { he: 'בַּיִת', en: 'House', es: 'Casa', emoji: '🏠', phonetic: 'Bayit' },
      { he: 'בַּנָנָה', en: 'Banana', es: 'Plátano', emoji: '🍌', phonetic: 'Banana' },
      { he: 'בֻּבָּה', en: 'Doll/Teddy', es: 'Muñeca / Peluche', emoji: '🧸', phonetic: 'Buba' }
    ]
  },
  {
    id: 'vet',
    letter: 'ב',
    displayWithNikud: 'וֵית',
    nameHe: 'וֵית (בלי פופיק)',
    nameEn: 'Vet (No Pupik)',
    nameEs: 'Vet (sin ombliguito)',
    soundHe: 'וְוְו...',
    soundQuoteHe: 'רוּחַ: "וְוְו..."',
    soundQuoteEn: 'Gentle wind: "Vvv..."',
    soundQuoteEs: 'Viento suave: "Vvv..."',
    shapeDescriptionHe: 'בֶּטֶן רֵיקָה – שׁוּם נְקֻדָּה! בְּלִי בּוּם!',
    shapeDescriptionEn: 'Empty belly – no dot! Soft wind, no boom!',
    shapeDescriptionEs: 'Pancita vacía – ¡sin puntito! Viento suave, ¡sin bum!',
    hasPupik: false,
    color: 'from-purple-400 to-indigo-500',
    borderColor: 'border-purple-400',
    badgeColor: 'bg-purple-100 text-purple-800',
    examples: [
      { he: 'כּוֹכָב', en: 'Star', es: 'Estrella', emoji: '⭐', phonetic: 'Kochav' },
      { he: 'לֵב', en: 'Heart', es: 'Corazón', emoji: '❤️', phonetic: 'Lev' },
      { he: 'עֲנָבִים', en: 'Grapes', es: 'Uvas', emoji: '🍇', phonetic: 'Anavim' },
      { he: 'זְאֵב', en: 'Wolf', es: 'Lobo', emoji: '🐺', phonetic: 'Zeev' }
    ]
  },
  {
    id: 'gimel',
    letter: 'ג',
    displayWithNikud: 'גִּימֶל',
    nameHe: 'גִּימֶל',
    nameEn: 'Gimel',
    nameEs: 'Guímel',
    soundHe: 'גָּה!',
    soundQuoteHe: 'וְאוֹמֶרֶת: "גָּה!"',
    soundQuoteEn: 'Saying: "Gah!"',
    soundQuoteEs: 'Diciendo: "¡Gah!"',
    shapeDescriptionHe: 'עומדת על רגל אחת וצועדת!',
    shapeDescriptionEn: 'Standing tall on one leg and stepping!',
    shapeDescriptionEs: '¡De pie sobre una patita y caminando!',
    hasPupik: false,
    color: 'from-emerald-400 to-teal-600',
    borderColor: 'border-emerald-400',
    badgeColor: 'bg-emerald-100 text-emerald-800',
    examples: [
      { he: 'גִּ\'ירָפָה', en: 'Giraffe', es: 'Jirafa', emoji: '🦒', phonetic: 'Girafa' },
      { he: 'גְּלִידָה', en: 'Ice cream', es: 'Helado', emoji: '🍦', phonetic: 'Glida' },
      { he: 'גָּמָל', en: 'Camel', es: 'Camello', emoji: '🐪', phonetic: 'Gamal' },
      { he: 'גֶּזֶר', en: 'Carrot', es: 'Zanahoria', emoji: '🥕', phonetic: 'Gezer' }
    ]
  },

  // Page 2
  {
    id: 'dalet',
    letter: 'ד',
    displayWithNikud: 'דָּלֶת',
    nameHe: 'דָּלֶת',
    nameEn: 'Dalet',
    nameEs: 'Dálet',
    soundHe: 'דָּה!',
    soundQuoteHe: 'וְצוֹעֶקֶת: "דָּה!"',
    soundQuoteEn: 'Shouting: "Dah!"',
    soundQuoteEs: 'Gritando: "¡Dah!"',
    shapeDescriptionHe: 'פינה יפה כמו דלת פתוחה לרווחה!',
    shapeDescriptionEn: 'A sharp corner like an open door!',
    shapeDescriptionEs: '¡Una esquina linda como una puerta abierta!',
    hasPupik: false,
    color: 'from-orange-500 to-red-500',
    borderColor: 'border-orange-500',
    badgeColor: 'bg-orange-100 text-orange-800',
    examples: [
      { he: 'דֹּב', en: 'Bear', es: 'Oso', emoji: '🧸', phonetic: 'Dov' },
      { he: 'דָּג', en: 'Fish', es: 'Pez', emoji: '🐟', phonetic: 'Dag' },
      { he: 'דֶּלֶת', en: 'Door', es: 'Puerta', emoji: '🚪', phonetic: 'Delet' }
    ]
  },
  {
    id: 'he',
    letter: 'ה',
    displayWithNikud: 'הֵא',
    nameHe: 'הֵא',
    nameEn: 'Hay',
    nameEs: 'He',
    soundHe: 'הָה!',
    soundQuoteHe: 'וְנוֹשֶׁפֶת: "הָה!"',
    soundQuoteEn: 'Breathing out: "Hah!"',
    soundQuoteEs: 'Soplando suave: "¡Hah!"',
    shapeDescriptionHe: 'חלון קטן פתוח לרוח הנעימה!',
    shapeDescriptionEn: 'A little open window for the fresh breeze!',
    shapeDescriptionEs: '¡Una ventanita abierta para la brisa fresca!',
    hasPupik: false,
    color: 'from-cyan-400 to-blue-500',
    borderColor: 'border-cyan-400',
    badgeColor: 'bg-cyan-100 text-cyan-800',
    examples: [
      { he: 'הַר', en: 'Mountain', es: 'Montaña', emoji: '⛰️', phonetic: 'Har' },
      { he: 'הַפְתָּעָה', en: 'Surprise / Gift', es: 'Sorpresa / Regalo', emoji: '🎁', phonetic: 'Haftaah' },
      { he: 'הֵיכָל', en: 'Palace', es: 'Palacio', emoji: '🪟', phonetic: 'Heichal' }
    ]
  },

  // Page 3
  {
    id: 'vav',
    letter: 'ו',
    displayWithNikud: 'וָו',
    nameHe: 'וָו',
    nameEn: 'Vav',
    nameEs: 'Vav',
    soundHe: 'וָה!',
    soundQuoteHe: 'אוֹמֶרֶת: "וָה!"',
    soundQuoteEn: 'Saying: "Vah!"',
    soundQuoteEs: 'Diciendo: "¡Vah!"',
    shapeDescriptionHe: 'עַמּוּד גָּבוֹהַּ וְיָשָׁר!',
    shapeDescriptionEn: 'A tall and straight column!',
    shapeDescriptionEs: '¡Una columna alta y derechita!',
    hasPupik: false,
    color: 'from-teal-400 to-emerald-500',
    borderColor: 'border-teal-400',
    badgeColor: 'bg-teal-100 text-teal-800',
    examples: [
      { he: 'וֶרֶד', en: 'Rose', es: 'Rosa', emoji: '🌹', phonetic: 'Vered' },
      { he: 'וָו', en: 'Hook', es: 'Gancho', emoji: '🪝', phonetic: 'Vav' },
      { he: 'וֶסְט', en: 'Vest', es: 'Chaleco', emoji: '🦺', phonetic: 'Vest' }
    ]
  },
  {
    id: 'zayin',
    letter: 'ז',
    displayWithNikud: 'זַיִן',
    nameHe: 'זַיִן',
    nameEn: 'Zayin',
    nameEs: 'Zayin',
    soundHe: 'זְזְז...',
    soundQuoteHe: 'זִמְזוּם: "זְזְז..."',
    soundQuoteEn: 'Buzzing: "Zzz..."',
    soundQuoteEs: 'Zumbando: "Zzz..."',
    shapeDescriptionHe: 'כְּמוֹ מַקֵּל עִם כֶּתֶר!',
    shapeDescriptionEn: 'Like a stick with a crown!',
    shapeDescriptionEs: '¡Como un bastón con una corona!',
    hasPupik: false,
    color: 'from-amber-500 to-yellow-600',
    borderColor: 'border-amber-500',
    badgeColor: 'bg-amber-100 text-amber-800',
    examples: [
      { he: 'זֶבְּרָה', en: 'Zebra', es: 'Cebra', emoji: '🦓', phonetic: 'Zebra' },
      { he: 'זְאֵב', en: 'Wolf', es: 'Lobo', emoji: '🐺', phonetic: 'Zeev' },
      { he: 'זַיִת', en: 'Olive', es: 'Aceituna', emoji: '🫒', phonetic: 'Zayit' }
    ]
  },
  {
    id: 'chet',
    letter: 'ח',
    displayWithNikud: 'חֵית',
    nameHe: 'חֵית',
    nameEn: 'Chet',
    nameEs: 'Jet',
    soundHe: 'חָה!',
    soundQuoteHe: 'חַם בַּגָּרוֹן: "חָה!"',
    soundQuoteEn: 'Warm throat: "Chah!"',
    soundQuoteEs: 'Garganta tibiecita: "¡Jah!"',
    shapeDescriptionHe: 'שַׁעַר סָגוּר מִלְמַעְלָה!',
    shapeDescriptionEn: 'A gate closed securely at the top!',
    shapeDescriptionEs: '¡Un portón cerrado arriba!',
    hasPupik: false,
    color: 'from-sky-400 to-blue-600',
    borderColor: 'border-sky-400',
    badgeColor: 'bg-sky-100 text-sky-800',
    examples: [
      { he: 'חָתוּל', en: 'Cat', es: 'Gato', emoji: '🐱', phonetic: 'Chatul' },
      { he: 'חָלָב', en: 'Milk', es: 'Leche', emoji: '🥛', phonetic: 'Chalav' },
      { he: 'חַלָּה', en: 'Challah bread', es: 'Pan jalá', emoji: '🍞', phonetic: 'Challah' }
    ]
  },
  {
    id: 'tet',
    letter: 'ט',
    displayWithNikud: 'טֵית',
    nameHe: 'טֵית',
    nameEn: 'Tet',
    nameEs: 'Tet',
    soundHe: 'טָה!',
    soundQuoteHe: 'וְקוֹפֶצֶת: "טָה!"',
    soundQuoteEn: 'Jumping: "Tah!"',
    soundQuoteEs: 'Saltando: "¡Tah!"',
    shapeDescriptionHe: 'כְּמוֹ סִיר עִם יָדִית!',
    shapeDescriptionEn: 'Like a cozy cooking pot with a handle!',
    shapeDescriptionEs: '¡Como una ollita con asa!',
    hasPupik: false,
    color: 'from-purple-500 to-fuchsia-600',
    borderColor: 'border-purple-500',
    badgeColor: 'bg-purple-100 text-purple-800',
    examples: [
      { he: 'טְרַקְטוֹר', en: 'Tractor', es: 'Tractor', emoji: '🚜', phonetic: 'Traktor' },
      { he: 'טָלֶה', en: 'Lamb', es: 'Corderito', emoji: '🐑', phonetic: 'Taleh' },
      { he: 'טַבַּעַת', en: 'Ring', es: 'Anillo', emoji: '💍', phonetic: 'Tabaat' }
    ]
  },

  // Page 4
  {
    id: 'yod',
    letter: 'י',
    displayWithNikud: 'יוּד',
    nameHe: 'יוּד',
    nameEn: 'Yud',
    nameEs: 'Yod',
    soundHe: 'יָה!',
    soundQuoteHe: 'הֲכִי קְטַנָּה: "יָה!"',
    soundQuoteEn: 'The tiniest: "Yah!"',
    soundQuoteEs: 'La más pequeñita: "¡Yah!"',
    shapeDescriptionHe: 'נְקֻדָּה שֶׁקּוֹפֶצֶת בָּאֲוִיר!',
    shapeDescriptionEn: 'A dot leaping joyfully in the air!',
    shapeDescriptionEs: '¡Un puntito saltando feliz en el aire!',
    hasPupik: false,
    color: 'from-pink-500 to-rose-600',
    borderColor: 'border-pink-500',
    badgeColor: 'bg-pink-100 text-pink-800',
    examples: [
      { he: 'יָד', en: 'Hand', es: 'Mano', emoji: '✋', phonetic: 'Yad' },
      { he: 'יֶלֶד', en: 'Child / Boy', es: 'Niño', emoji: '👦', phonetic: 'Yeled' },
      { he: 'יוֹנָה', en: 'Dove', es: 'Paloma', emoji: '🕊️', phonetic: 'Yona' }
    ]
  },
  {
    id: 'kaf_dagesh',
    letter: 'כּ',
    displayWithNikud: 'כַּף',
    nameHe: 'כַּף (עם פופיק!)',
    nameEn: 'Kaf (with Pupik!)',
    nameEs: 'Kaf (¡con ombliguito!)',
    soundHe: 'כָּה!',
    soundQuoteHe: 'חוֹבֶטֶת: "כָּה!"',
    soundQuoteEn: 'Striking strong: "Kah!"',
    soundQuoteEs: 'Golpeando fuerte: "¡Kah!"',
    shapeDescriptionHe: 'פּוּפִּיק בַּבֶּטֶן! (כּוֹחַ!)',
    shapeDescriptionEn: 'Pupik inside the belly! (Power!)',
    shapeDescriptionEs: '¡Ombliguito en la pancita! (¡Fuerza!)',
    hasPupik: true,
    color: 'from-blue-600 to-cyan-700',
    borderColor: 'border-blue-600',
    badgeColor: 'bg-blue-100 text-blue-800',
    examples: [
      { he: 'כֶּלֶב', en: 'Dog', es: 'Perro', emoji: '🐶', phonetic: 'Kelev' },
      { he: 'כַּדּוּר', en: 'Ball', es: 'Pelota', emoji: '⚽', phonetic: 'Kadur' },
      { he: 'כֶּתֶר', en: 'Crown', es: 'Corona', emoji: '👑', phonetic: 'Keter' }
    ]
  },
  {
    id: 'khaf',
    letter: 'כ',
    displayWithNikud: 'כַף (חָף)',
    nameHe: 'כַף (חָף בלי פופיק)',
    nameEn: 'Chaf (No Pupik)',
    nameEs: 'Jaf (sin ombliguito)',
    soundHe: 'חְחְח...',
    soundQuoteHe: 'רוּחַ גָּרוֹן: "חְחְח..."',
    soundQuoteEn: 'Throat breeze: "Khhh..."',
    soundQuoteEs: 'Brisa de garganta: "Jjj..."',
    shapeDescriptionHe: 'בֶּטֶן רֵיקָה – בְּלִי נְקֻדָּה!',
    shapeDescriptionEn: 'Empty belly – without any dot!',
    shapeDescriptionEs: 'Pancita vacía – ¡sin ningún puntito!',
    hasPupik: false,
    color: 'from-violet-500 to-purple-600',
    borderColor: 'border-violet-500',
    badgeColor: 'bg-violet-100 text-violet-800',
    examples: [
      { he: 'כּוֹכָב', en: 'Star', es: 'Estrella', emoji: '⭐', phonetic: 'Kochav' },
      { he: 'מֶלֶךְ', en: 'King', es: 'Rey', emoji: '👑', phonetic: 'Melech' },
      { he: 'הוֹלֵךְ', en: 'Walking', es: 'Caminando', emoji: '🚶', phonetic: 'Holech' }
    ]
  },
  {
    id: 'lamed',
    letter: 'ל',
    displayWithNikud: 'לָמֶד',
    nameHe: 'לָמֶד',
    nameEn: 'Lamed',
    nameEs: 'Lámed',
    soundHe: 'לָה-לָה!',
    soundQuoteHe: 'מְנַגֶּנֶת: "לָה-לָה!"',
    soundQuoteEn: 'Singing: "La-la!"',
    soundQuoteEs: 'Cantando: "¡La-la!"',
    shapeDescriptionHe: 'הָאוֹת הֲכִי גְּבוֹהָה עַד הַשָּׁמַיִם!',
    shapeDescriptionEn: 'The tallest letter reaching up to the sky!',
    shapeDescriptionEs: '¡La letra más alta que llega hasta el cielo!',
    hasPupik: false,
    color: 'from-emerald-500 to-green-600',
    borderColor: 'border-emerald-500',
    badgeColor: 'bg-emerald-100 text-emerald-800',
    examples: [
      { he: 'לִימוֹן', en: 'Lemon', es: 'Limón', emoji: '🍋', phonetic: 'Limon' },
      { he: 'לֵב', en: 'Heart', es: 'Corazón', emoji: '❤️', phonetic: 'Lev' },
      { he: 'לֶחֶם', en: 'Bread', es: 'Pan', emoji: '🍞', phonetic: 'Lechem' }
    ]
  },

  // Page 5
  {
    id: 'mem',
    letter: 'מ',
    displayWithNikud: 'מֵם',
    nameHe: 'מֵם',
    nameEn: 'Mem',
    nameEs: 'Mem',
    soundHe: 'מַמָּה!',
    soundQuoteHe: 'טָעִים: "מַמָּה!"',
    soundQuoteEn: 'Yummy: "Mamma!"',
    soundQuoteEs: '¡Qué rico: "¡Mamma!"',
    shapeDescriptionHe: 'כְּמוֹ גַּל שֶׁל מַיִם!',
    shapeDescriptionEn: 'Like a gentle wave of clear water!',
    shapeDescriptionEs: '¡Como una ola suave de agua clara!',
    hasPupik: false,
    color: 'from-sky-500 to-cyan-600',
    borderColor: 'border-sky-500',
    badgeColor: 'bg-sky-100 text-sky-800',
    examples: [
      { he: 'מַיִם', en: 'Water', es: 'Agua', emoji: '💧', phonetic: 'Mayim' },
      { he: 'מַרְאָה', en: 'Mirror', es: 'Espejo', emoji: '🪞', phonetic: 'Marea' },
      { he: 'מְלָפְפוֹן', en: 'Cucumber', es: 'Pepino', emoji: '🥒', phonetic: 'Melafefon' }
    ]
  },
  {
    id: 'nun',
    letter: 'נ',
    displayWithNikud: 'נוּן',
    nameHe: 'נוּן',
    nameEn: 'Nun',
    nameEs: 'Nun',
    soundHe: 'נָה!',
    soundQuoteHe: 'מַנְעִימָה: "נָה!"',
    soundQuoteEn: 'Sweet humming: "Nah!"',
    soundQuoteEs: 'Tarareando dulce: "¡Nah!"',
    shapeDescriptionHe: 'כְּמוֹ פָּמוֹט עִם נֵר קָטָן!',
    shapeDescriptionEn: 'Like a holder with a little candle!',
    shapeDescriptionEs: '¡Como un candelabro con una velita!',
    hasPupik: false,
    color: 'from-amber-500 to-orange-600',
    borderColor: 'border-amber-500',
    badgeColor: 'bg-amber-100 text-amber-800',
    examples: [
      { he: 'נֵר', en: 'Candle', es: 'Vela', emoji: '🕯️', phonetic: 'Ner' },
      { he: 'נָמֵר', en: 'Tiger', es: 'Tigre', emoji: '🐆', phonetic: 'Namer' },
      { he: 'נֶשֶׁר', en: 'Eagle', es: 'Águila', emoji: '🦅', phonetic: 'Nesher' }
    ]
  },
  {
    id: 'samech',
    letter: 'ס',
    displayWithNikud: 'סָמֶךְ',
    nameHe: 'סָמֶךְ',
    nameEn: 'Samekh',
    nameEs: 'Sámej',
    soundHe: 'סְסְס...',
    soundQuoteHe: 'נוֹשֶׁפֶת: "סְסְס..."',
    soundQuoteEn: 'Hissing: "Sss..."',
    soundQuoteEs: 'Soplando: "Sss..."',
    shapeDescriptionHe: 'עֲגֻלָּה וּסְגוּרָה כְּמוֹ כַּדּוּר!',
    shapeDescriptionEn: 'Round and completely closed like a ball!',
    shapeDescriptionEs: '¡Redonda y cerradita como una pelota!',
    hasPupik: false,
    color: 'from-orange-400 to-amber-500',
    borderColor: 'border-orange-400',
    badgeColor: 'bg-orange-100 text-orange-800',
    examples: [
      { he: 'סוּס', en: 'Horse', es: 'Caballo', emoji: '🐎', phonetic: 'Sus' },
      { he: 'סֻלָּם', en: 'Ladder', es: 'Escalera', emoji: '🪜', phonetic: 'Sulam' },
      { he: 'סֵפֶר', en: 'Book', es: 'Libro', emoji: '📖', phonetic: 'Sefer' }
    ]
  },
  {
    id: 'ayin',
    letter: 'ע',
    displayWithNikud: 'עַיִן',
    nameHe: 'עַיִן',
    nameEn: 'Ayin',
    nameEs: 'Ayin',
    soundHe: 'עָה!',
    soundQuoteHe: 'עֲמֻקָּה: "עָה!"',
    soundQuoteEn: 'Deep throat: "Ah!"',
    soundQuoteEs: 'Desde la garganta: "¡Ah!"',
    shapeDescriptionHe: 'רוֹאָה הַכֹּל סְבִיבָהּ עִם שְׁתֵּי עֵינַיִם!',
    shapeDescriptionEn: 'Sees all around with wide open eyes!',
    shapeDescriptionEs: '¡Mira todo alrededor con los ojos bien abiertos!',
    hasPupik: false,
    color: 'from-emerald-500 to-teal-600',
    borderColor: 'border-emerald-500',
    badgeColor: 'bg-emerald-100 text-emerald-800',
    examples: [
      { he: 'עַיִן', en: 'Eye', es: 'Ojo', emoji: '👁️', phonetic: 'Ayin' },
      { he: 'עֵץ', en: 'Tree', es: 'Árbol', emoji: '🌳', phonetic: 'Etz' },
      { he: 'עֲנָבִים', en: 'Grapes', es: 'Uvas', emoji: '🍇', phonetic: 'Anavim' }
    ]
  },

  // Page 6
  {
    id: 'pe_dagesh',
    letter: 'פּ',
    displayWithNikud: 'פֵּי',
    nameHe: 'פֵּי (עם פופיק!)',
    nameEn: 'Pay (with Pupik!)',
    nameEs: 'Pe (¡con ombliguito!)',
    soundHe: 'פּוּם!',
    soundQuoteHe: 'פּוֹצֶצֶת: "פּוּם!"',
    soundQuoteEn: 'Popping: "Poom!"',
    soundQuoteEs: 'Explotando: "¡Pum!"',
    shapeDescriptionHe: 'פּוּפִּיק בַּבֶּטֶן! (קוֹל פּוֹצֵץ!)',
    shapeDescriptionEn: 'Pupik inside belly! (Pop-bang sound!)',
    shapeDescriptionEs: '¡Ombliguito en la pancita! (¡Sonido pum!)',
    hasPupik: true,
    color: 'from-blue-500 to-indigo-600',
    borderColor: 'border-blue-500',
    badgeColor: 'bg-blue-100 text-blue-800',
    examples: [
      { he: 'פִּיל', en: 'Elephant', es: 'Elefante', emoji: '🐘', phonetic: 'Pil' },
      { he: 'פַּרְפַּר', en: 'Butterfly', es: 'Mariposa', emoji: '🦋', phonetic: 'Parpar' },
      { he: 'פִּיצָה', en: 'Pizza', es: 'Pizza', emoji: '🍕', phonetic: 'Pizza' },
      { he: 'צִפּוֹר', en: 'Bird', es: 'Pájaro', emoji: '🐦', phonetic: 'Tzipor' }
    ]
  },
  {
    id: 'fe',
    letter: 'פ',
    displayWithNikud: 'פֵיי',
    nameHe: 'פֵיי (בלי פופיק - רוח)',
    nameEn: 'Fay (No Pupik - Wind)',
    nameEs: 'Fe (sin ombliguito - viento)',
    soundHe: 'פְפְפ...',
    soundQuoteHe: 'נוֹשֶׁבֶת: "פְפְפ..."',
    soundQuoteEn: 'Blowing: "Fff..."',
    soundQuoteEs: 'Soplando: "Fff..."',
    shapeDescriptionHe: 'בֶּטֶן רֵיקָה – שׁוּם נְקֻדָּה!',
    shapeDescriptionEn: 'Empty belly – no dot at all!',
    shapeDescriptionEs: 'Pancita vacía – ¡sin ningún puntito!',
    hasPupik: false,
    color: 'from-purple-500 to-indigo-600',
    borderColor: 'border-purple-500',
    badgeColor: 'bg-purple-100 text-purple-800',
    examples: [
      { he: 'עֲפִיפוֹן', en: 'Kite', es: 'Cometa', emoji: '🪁', phonetic: 'Afifon' },
      { he: 'מְלָפְפוֹן', en: 'Cucumber', es: 'Pepino', emoji: '🥒', phonetic: 'Melafefon' },
      { he: 'אַף', en: 'Nose', es: 'Nariz', emoji: '👃', phonetic: 'Af' }
    ]
  },
  {
    id: 'tsadi',
    letter: 'צ',
    displayWithNikud: 'צָדִי',
    nameHe: 'צָדִי',
    nameEn: 'Sadi',
    nameEs: 'Tsadi',
    soundHe: 'צָה!',
    soundQuoteHe: 'מְצַיְּצָה: "צָה!"',
    soundQuoteEn: 'Chirping: "Tzah!"',
    soundQuoteEs: 'Piando: "¡Tsah!"',
    shapeDescriptionHe: 'כְּמוֹ אֶפְרוֹחַ קָטָן!',
    shapeDescriptionEn: 'Cute like a chirping little baby chick!',
    shapeDescriptionEs: '¡Lindo como un pollito chiquito!',
    hasPupik: false,
    color: 'from-amber-500 to-yellow-600',
    borderColor: 'border-amber-500',
    badgeColor: 'bg-amber-100 text-amber-800',
    examples: [
      { he: 'צָב', en: 'Turtle', es: 'Tortuga', emoji: '🐢', phonetic: 'Tzav' },
      { he: 'צְפַרְדֵּעַ', en: 'Frog', es: 'Rana', emoji: '🐸', phonetic: 'Tzfardea' },
      { he: 'צִפּוֹר', en: 'Bird', es: 'Pájaro', emoji: '🐦', phonetic: 'Tzipor' }
    ]
  },
  {
    id: 'kof',
    letter: 'ק',
    displayWithNikud: 'קוּף',
    nameHe: 'קוּף',
    nameEn: 'Kof',
    nameEs: 'Kof',
    soundHe: 'קוּ!',
    soundQuoteHe: 'קוֹפֶצֶת: "קוּ!"',
    soundQuoteEn: 'Jumping: "Koo!"',
    soundQuoteEs: 'Saltando: "¡Ku!"',
    shapeDescriptionHe: 'רֶגֶל אֲרֻכָּה שֶׁיּוֹרֶדֶת לְמַטָּה!',
    shapeDescriptionEn: 'A long playful leg swinging downwards!',
    shapeDescriptionEs: '¡Una patita larga que baja jugando!',
    hasPupik: false,
    color: 'from-cyan-500 to-blue-600',
    borderColor: 'border-cyan-500',
    badgeColor: 'bg-cyan-100 text-cyan-800',
    examples: [
      { he: 'קוֹף', en: 'Monkey', es: 'Mono', emoji: '🐒', phonetic: 'Kof' },
      { he: 'קֶשֶׁת', en: 'Rainbow', es: 'Arcoíris', emoji: '🌈', phonetic: 'Keshet' },
      { he: 'קַרְטִיב', en: 'Popsicle', es: 'Paleta helada', emoji: '🍦', phonetic: 'Kartiv' }
    ]
  },

  // Page 7
  {
    id: 'resh',
    letter: 'ר',
    displayWithNikud: 'רֵישׁ',
    nameHe: 'רֵישׁ',
    nameEn: 'Resh',
    nameEs: 'Resh',
    soundHe: 'רָה!',
    soundQuoteHe: 'מִתְגַּלְגֶּלֶת: "רָה!"',
    soundQuoteEn: 'Rolling: "Rah!"',
    soundQuoteEs: 'Rodando: "¡Rah!"',
    shapeDescriptionHe: 'פִּנָּה עֲגֻלָּה כְּמוֹ מַגְלֵשָׁה!',
    shapeDescriptionEn: 'A curved corner smooth like a playground slide!',
    shapeDescriptionEs: '¡Una esquina curva suave como un tobogán!',
    hasPupik: false,
    color: 'from-orange-500 to-red-600',
    borderColor: 'border-orange-500',
    badgeColor: 'bg-orange-100 text-orange-800',
    examples: [
      { he: 'רֶכֶב', en: 'Car', es: 'Coche', emoji: '🚗', phonetic: 'Rechev' },
      { he: 'רַכֶּבֶת', en: 'Train', es: 'Tren', emoji: '🚂', phonetic: 'Rakevet' },
      { he: 'רֹאשׁ', en: 'Head', es: 'Cabeza', emoji: '🎈', phonetic: 'Rosh' }
    ]
  },
  {
    id: 'shin',
    letter: 'שׁ',
    displayWithNikud: 'שִׁין',
    nameHe: 'שִׁין (נקודה בימין)',
    nameEn: 'Shin (Dot on right)',
    nameEs: 'Shin (puntito a la derecha)',
    soundHe: 'שְׁשְׁשׁ...',
    soundQuoteHe: 'לוֹחֶשֶׁת: "שְׁשְׁשׁ..."',
    soundQuoteEn: 'Whispering: "Shhh..."',
    soundQuoteEs: 'Susurrando: "Shhh..."',
    shapeDescriptionHe: 'נְקֻדָּה בְּצַד יָמִין (שָׁלוֹם!)',
    shapeDescriptionEn: 'Crown dot on the right side (Shalom!)',
    shapeDescriptionEs: 'Puntito de corona a la derecha (¡Shalom!)',
    hasPupik: true,
    pupikLocation: 'top-right',
    color: 'from-blue-600 to-indigo-700',
    borderColor: 'border-blue-600',
    badgeColor: 'bg-blue-100 text-blue-800',
    examples: [
      { he: 'שֶׁמֶשׁ', en: 'Sun', es: 'Sol', emoji: '☀️', phonetic: 'Shemesh' },
      { he: 'שׁוּעָל', en: 'Fox', es: 'Zorro', emoji: '🦊', phonetic: 'Shual' },
      { he: 'שׁוֹקוֹלָד', en: 'Chocolate', es: 'Chocolate', emoji: '🍫', phonetic: 'Shokolad' }
    ]
  },
  {
    id: 'sin',
    letter: 'שׂ',
    displayWithNikud: 'שִׂין',
    nameHe: 'שִׂין (נקודה בשמאל)',
    nameEn: 'Sin (Dot on left)',
    nameEs: 'Sin (puntito a la izquierda)',
    soundHe: 'סָה!',
    soundQuoteHe: 'שְׂמֵחָה: "סָה!"',
    soundQuoteEn: 'Joyful: "Sah!"',
    soundQuoteEs: 'Alegre: "¡Sah!"',
    shapeDescriptionHe: 'נְקֻדָּה בְּצַד שְׂמֹאל (שִׂמְחָה!)',
    shapeDescriptionEn: 'Crown dot on the left side (Simcha - Joy!)',
    shapeDescriptionEs: 'Puntito de corona a la izquierda (¡Simjá - Alegría!)',
    hasPupik: true,
    pupikLocation: 'top-left',
    color: 'from-purple-500 to-pink-600',
    borderColor: 'border-purple-500',
    badgeColor: 'bg-purple-100 text-purple-800',
    examples: [
      { he: 'שִׂמְחָה', en: 'Joy / Happiness', es: 'Alegría / Felicidad', emoji: '😃', phonetic: 'Simcha' },
      { he: 'שִׂמְלָה', en: 'Dress', es: 'Vestido', emoji: '👗', phonetic: 'Simla' },
      { he: 'שָׂדֶה', en: 'Field', es: 'Campo', emoji: '🌾', phonetic: 'Sadeh' }
    ]
  },
  {
    id: 'tav',
    letter: 'ת',
    displayWithNikud: 'תָּיו',
    nameHe: 'תָּיו',
    nameEn: 'Tav',
    nameEs: 'Tav',
    soundHe: 'תָּה!',
    soundQuoteHe: 'אַחֲרוֹנָה: "תָּה!"',
    soundQuoteEn: 'The champion: "Tah!"',
    soundQuoteEs: 'La campeona: "¡Tah!"',
    shapeDescriptionHe: 'יֵשׁ לָהּ מַגָּף קָטָן בַּקָּצֶה!',
    shapeDescriptionEn: 'Has a cute little walking boot at the tip!',
    shapeDescriptionEs: '¡Tiene una botita linda en la punta!',
    hasPupik: false,
    color: 'from-emerald-500 to-green-700',
    borderColor: 'border-emerald-500',
    badgeColor: 'bg-emerald-100 text-emerald-800',
    examples: [
      { he: 'תַּפּוּחַ', en: 'Apple', es: 'Manzana', emoji: '🍎', phonetic: 'Tapuach' },
      { he: 'תּוּת', en: 'Strawberry', es: 'Fresa', emoji: '🍓', phonetic: 'Tut' },
      { he: 'תִּיק', en: 'Backpack / Bag', es: 'Mochila / Bolsa', emoji: '🎒', phonetic: 'Tik' }
    ]
  }
];

// Pages 8, 9, 10: Reading Train (רַכֶּבֶת קְרִיאָה מַדְרֵגָה אַחַר מַדְרֵגָה)
export const READING_TRAIN_DATA = [
  {
    level: 1,
    titleHe: "רַכֶּבֶת קְרִיאָה מַדְרֵגָה אַחַר מַדְרֵגָה: מ-א' עַד ט'",
    titleEn: "Step-by-Step Reading Train: Alef to Tet",
    titleEs: "Tren de Lectura Paso a Paso: de Álef a Tet",
    subtitleHe: "בְּכָל שׁוּרָה נוֹסֶפֶת אוֹת חֲדָשָׁה! קוֹרְאִים מִיָּמִין לִשְׂמֹאל וְצוֹבְעִים כּוֹכָב ⭐",
    subtitleEn: "A new letter in each row! Read right-to-left and collect stars ⭐",
    subtitleEs: "¡Una letra nueva en cada fila! Lee de derecha a izquierda y junta estrellas ⭐",
    rows: [
      { labelHe: 'שׁוּרָה 1 (א)', labelEn: 'Row 1 (Alef)', labelEs: 'Fila 1 (Álef)', letters: ['א', 'א', 'א', 'א'] },
      { labelHe: '+ בּוּם! (בּ)', labelEn: '+ Boom! (Bet)', labelEs: '+ ¡Bum! (Bet)', letters: ['בּ', 'א', 'בּ', 'בּ', 'א'] },
      { labelHe: '+ רוּחַ (ב)', labelEn: '+ Wind (Vet)', labelEs: '+ Viento (Vet)', letters: ['בּ', 'ב', 'א', 'ב', 'בּ'] },
      { labelHe: '+ גִּימֶל (ג)', labelEn: '+ Gimel (ג)', labelEs: '+ Guímel (ג)', letters: ['ג', 'בּ', 'ב', 'ג', 'א'] },
      { labelHe: '+ דָּלֶת (ד)', labelEn: '+ Dalet (ד)', labelEs: '+ Dálet (ד)', letters: ['ד', 'ג', 'בּ', 'ד', 'ב'] },
      { labelHe: '+ הֵא (ה)', labelEn: '+ He (ה)', labelEs: '+ He (ה)', letters: ['ה', 'ד', 'בּ', 'ב', 'ה'] },
      { labelHe: '+ וָו (ו)', labelEn: '+ Vav (ו)', labelEs: '+ Vav (ו)', letters: ['ו', 'ה', 'ו', 'בּ', 'ב'] },
      { labelHe: '+ זַיִן (ז)', labelEn: '+ Zayin (ז)', labelEs: '+ Zayin (ז)', letters: ['ז', 'ו', 'ז', 'בּ', 'ב'] },
      { labelHe: '+ חֵית (ח)', labelEn: '+ Chet (ח)', labelEs: '+ Jet (ח)', letters: ['ח', 'ה', 'ח', 'בּ', 'ב'] },
      { labelHe: '+ טֵית (ט)', labelEn: '+ Tet (ט)', labelEs: '+ Tet (ט)', letters: ['ט', 'ח', 'ז', 'ט', 'בּ'] }
    ]
  },
  {
    level: 2,
    titleHe: "רַכֶּבֶת קְרִיאָה מַדְרֵגָה אַחַר מַדְרֵגָה: מ-י' עַד ע'",
    titleEn: "Step-by-Step Reading Train: Yud to Ayin",
    titleEs: "Tren de Lectura Paso a Paso: de Yod a Ayin",
    subtitleHe: "מוֹסִיפִים אוֹת חֲדָשָׁה • בּוֹדְקִים הֵיטֵב כּ' עִם פּוּפִּיק וְ-כ' בְּלִי!",
    subtitleEn: "Add new letters • Check Kaf with Pupik vs Khaf without!",
    subtitleEs: "Agrega letras nuevas • ¡Fíjate en Kaf con ombliguito vs. Jaf sin él!",
    rows: [
      { labelHe: '+ יוּד (י)', labelEn: '+ Yud (י)', labelEs: '+ Yod (י)', letters: ['י', 'ט', 'י', 'בּ', 'ב'] },
      { labelHe: '+ כַּף פּוּפִּיק (כּ)', labelEn: '+ Kaf with pupik (כּ)', labelEs: '+ Kaf con ombliguito (כּ)', letters: ['כּ', 'בּ', 'י', 'כּ', 'ב'] },
      { labelHe: '+ כַף רֵיקָה (כ)', labelEn: '+ Khaf empty (כ)', labelEs: '+ Jaf vacía (כ)', letters: ['כּ', 'כ', 'בּ', 'כ', 'ב'] },
      { labelHe: '+ לָמֶד גְּבוֹהָה (ל)', labelEn: '+ Tall Lamed (ל)', labelEs: '+ Lámed alta (ל)', letters: ['ל', 'כּ', 'ל', 'כ', 'י'] },
      { labelHe: '+ מֵם (מ)', labelEn: '+ Mem (מ)', labelEs: '+ Mem (מ)', letters: ['מ', 'ל', 'מ', 'בּ', 'ב'] },
      { labelHe: '+ נוּן (נ)', labelEn: '+ Nun (נ)', labelEs: '+ Nun (נ)', letters: ['נ', 'מ', 'נ', 'ל', 'כּ'] },
      { labelHe: '+ סָמֶךְ עֲגֻלָּה (ס)', labelEn: '+ Round Samekh (ס)', labelEs: '+ Sámej redonda (ס)', letters: ['ס', 'נ', 'ס', 'מ', 'בּ'] },
      { labelHe: '+ עַיִן (ע)', labelEn: '+ Ayin (ע)', labelEs: '+ Ayin (ע)', letters: ['ע', 'ס', 'ע', 'ל', 'ב'] }
    ]
  },
  {
    level: 3,
    titleHe: "רַכֶּבֶת קְרִיאָה: מ-פּ' עַד ת' (סִיּוּם הָאָלֶף-בֵּית!)",
    titleEn: "Reading Train: Pe to Tav (Grand Finale!)",
    titleEs: "Tren de Lectura: de Pe a Tav (¡Gran Final!)",
    subtitleHe: "מוֹסִיפִים פּוּפִּיקִים, נְקֻדּוֹת יָמִין וּשְׂמֹאל וּמַגִּיעִים עַד הַכֶּתֶר 👑",
    subtitleEn: "Add pupiks, right & left dots, all the way to the Crown 👑",
    subtitleEs: "Agrega ombliguitos y puntitos de derecha e izquierda hasta llegar a la Corona 👑",
    rows: [
      { labelHe: '+ פֵּי פּוּם (פּ)', labelEn: '+ Pay boom (פּ)', labelEs: '+ Pe bum (פּ)', letters: ['פּ', 'ע', 'פּ', 'בּ', 'כּ'] },
      { labelHe: '+ פֵיי רוּחַ (פ)', labelEn: '+ Fay wind (פ)', labelEs: '+ Fe viento (פ)', letters: ['פּ', 'פ', 'בּ', 'פ', 'ב'] },
      { labelHe: '+ צָדִי (צ)', labelEn: '+ Sadi (צ)', labelEs: '+ Tsadi (צ)', letters: ['צ', 'פּ', 'צ', 'פ', 'ע'] },
      { labelHe: '+ קוּף קוֹפֶצֶת (ק)', labelEn: '+ Kof jumping (ק)', labelEs: '+ Kof saltarina (ק)', letters: ['ק', 'צ', 'ק', 'בּ', 'ב'] },
      { labelHe: '+ רֵישׁ (ר)', labelEn: '+ Resh (ר)', labelEs: '+ Resh (ר)', letters: ['ר', 'ד', 'ר', 'ק', 'ל'] },
      { labelHe: '+ שִׁין יָמִין (שׁ)', labelEn: '+ Shin right (שׁ)', labelEs: '+ Shin derecha (שׁ)', letters: ['שׁ', 'ר', 'שׁ', 'בּ', 'ב'] },
      { labelHe: '+ שִׂין שְׂמֹאל (שׂ)', labelEn: '+ Sin left (שׂ)', labelEs: '+ Sin izquierda (שׂ)', letters: ['שׁ', 'שׂ', 'שׁ', 'ס', 'שׂ'] },
      { labelHe: '+ תָּיו מְנַצַּחַת (ת)', labelEn: '+ Tav winner! (ת)', labelEs: '+ ¡Tav ganadora! (ת)', letters: ['ת', 'שׁ', 'ר', 'בּ', 'ב', 'ת'] }
    ]
  }
];

// Page 14: World of Vowels (עוֹלַם הַנְּקֻדּוֹת שֶׁל הָאוֹתִיּוֹת)
export const VOWELS_DATA = [
  {
    id: 'patach_kamatz',
    nameHe: 'פַּתַח • קָמַץ',
    nameEn: 'Patach & Kamatz',
    nameEs: 'Patáj y Kamátz',
    symbolHe: 'בַּ / בָּ',
    sound: 'בָּה!',
    faceEmoji: '😲',
    soundHintHe: 'פּוֹתְחִים פֶּה עֲנָק כְּמוֹ אֵצֶל רוֹפֵא: אָההה!',
    soundHintEn: 'Open a giant mouth like at the doctor: Ahhh!',
    soundHintEs: 'Abre una boca gigante como en el doctor: ¡Ahhh!',
    vowelSound: 'ah',
    accentColor: 'border-amber-400 bg-amber-50 text-amber-900',
    examples: ['אַ', 'בַּ', 'גַּ', 'דָּ']
  },
  {
    id: 'chirik',
    nameHe: 'חִירִיק (נְקֻדָּה לְמַטָּה)',
    nameEn: 'Chirik (Dot below)',
    nameEs: 'Jírik (puntito abajo)',
    symbolHe: 'בִּ',
    sound: 'בִּי!',
    faceEmoji: '😁',
    soundHintHe: 'חִיּוּךְ שֶׁמַּרְאֶה שִׁנַּיִם וְצוֹחֵק: אִי-אִי-אִי!',
    soundHintEn: 'Big smile showing teeth laughing: Ee-ee-ee!',
    soundHintEs: '¡Gran sonrisa mostrando los dientes y riendo: ¡Ii-ii-ii!',
    vowelSound: 'ee',
    accentColor: 'border-blue-400 bg-blue-50 text-blue-900',
    examples: ['אִ', 'בִּ', 'גִּ', 'דִּ']
  },
  {
    id: 'cholam',
    nameHe: 'חוֹלָם (כַּדּוּר לְמַעְלָה)',
    nameEn: 'Cholam (Ball up top)',
    nameEs: 'Jólam (pelotita arriba)',
    symbolHe: 'בּוֹ',
    sound: 'בּוֹ!',
    faceEmoji: '😮',
    soundHintHe: 'פֶּה עָגֹל וּמֻפְתָּע כְּמוֹ סֻכָּרִיָּה: אוֹוֹוֹ!',
    soundHintEn: 'Round surprised mouth like a lollipop: Ohhh!',
    soundHintEs: 'Boquita redonda y sorprendida como un caramelo: ¡Ohhh!',
    vowelSound: 'oh',
    accentColor: 'border-purple-400 bg-purple-50 text-purple-900',
    examples: ['אוֹ', 'בּוֹ', 'גּוֹ', 'דּוֹ']
  },
  {
    id: 'shuruk',
    nameHe: 'שׁוּרוּק (נְקֻדָּה בַּפֶּה / קוּבּוּץ)',
    nameEn: 'Shuruk (Dot in mouth)',
    nameEs: 'Shuruk (puntito en la boca)',
    symbolHe: 'בּוּ',
    sound: 'בּוּ!',
    faceEmoji: '😗',
    soundHintHe: 'שְׂפָתַיִם שֶׁשּׁוֹרְקוֹת כְּמוֹ רַכֶּבֶת: אוּ-אוּ-אוּ!',
    soundHintEn: 'Whistling lips like a little train: Oo-oo-oo!',
    soundHintEs: 'Labios silbando como un trenecito: ¡Uu-uu-uu!',
    vowelSound: 'oo',
    accentColor: 'border-teal-400 bg-teal-50 text-teal-900',
    examples: ['אוּ', 'בּוּ', 'גּוּ', 'דּוּ']
  },
  {
    id: 'segol',
    nameHe: 'סֶגוֹל (מְשֻׁלַּשׁ נְקֻדּוֹת)',
    nameEn: 'Segol (Three dots triangle)',
    nameEs: 'Segol (triángulo de tres puntitos)',
    symbolHe: 'בֶּ / בֵּ',
    sound: 'בֶּה!',
    faceEmoji: '😏',
    soundHintHe: 'צוֹעֲקִים כְּמוֹ כִּבְשָׂה קְטַנָּה: אֶה-אֶה-אֶה!',
    soundHintEn: 'Bleating like a cute little lamb: Eh-eh-eh!',
    soundHintEs: 'Balando como una ovejita linda: ¡Eh-eh-eh!',
    vowelSound: 'eh',
    accentColor: 'border-emerald-400 bg-emerald-50 text-emerald-900',
    examples: ['אֶ', 'בֶּ', 'גֶּ', 'דֶּ']
  }
];

// Page 14 contrast practice (בּוּם מול רוּחַ עם נקודות)
export const VOWEL_CONTRASTS = [
  { left: 'בַּ', leftSound: 'בָּה!', right: 'בַ', rightSound: 'וָה!', desc: 'פתח/קמץ: בּוּם מול רוח', descEn: 'Patach/Kamatz: Boom vs Wind', descEs: 'Patach/Kamatz: Bum vs Viento' },
  { left: 'בִּ', leftSound: 'בִּי!', right: 'בִ', rightSound: 'וִי!', desc: 'חיריק: בּוּם מול רוח', descEn: 'Chirik: Boom vs Wind', descEs: 'Chirik: Bum vs Viento' },
  { left: 'בּוּ', leftSound: 'בּוּ!', right: 'בוּ', rightSound: 'ווּ!', desc: 'שורוק: בּוּם מול רוח', descEn: 'Shuruk: Boom vs Wind', descEs: 'Shuruk: Bum vs Viento' }
];

// Page 14: Vowel reading train rows (read right-to-left)
export const VOWEL_TRAIN_ROWS = [
  { titleHe: 'פֶּה פָּתוּחַ (אָה!)', titleEn: 'Open Mouth (Ah!)', titleEs: 'Boca abierta (¡Ah!)', emoji: '😲', letters: ['אָ', 'בַּ', 'בַ', 'גַּ', 'דָּ'] },
  { titleHe: 'חִיּוּךְ רָחָב (אִי!)', titleEn: 'Wide Smile (Ee!)', titleEs: 'Sonrisa grande (¡Ii!)', emoji: '😁', letters: ['אִ', 'בִּ', 'בִ', 'גִּ', 'הִ'] },
  { titleHe: 'עָגֹל וּמֻפְתָּע (אוֹ!)', titleEn: 'Round Surprised (Oh!)', titleEs: 'Redonda y sorprendida (¡Oh!)', emoji: '😮', letters: ['אוֹ', 'בּוֹ', 'בוֹ', 'גּוֹ', 'דּוֹ'] },
  { titleHe: 'שׁוֹרְקִים רַכֶּבֶת (אוּ!)', titleEn: 'Whistle Train (Oo!)', titleEs: 'Silbido de tren (¡Uu!)', emoji: '😗', letters: ['אוּ', 'בּוּ', 'בוּ', 'גּוּ', 'הוּ'] }
];

// Page 15: First Words for 4-year-olds (ילדים כבר קוראים מילים אמיתיות!)
export const FIRST_WORDS_DATA = [
  {
    id: 'word-abba',
    syllables: ['אַ', 'בָּא'],
    wordHe: 'אַבָּא',
    wordEn: 'Abba (Daddy)',
    wordEs: 'Abba (Papá)',
    emoji: '👨‍👧',
    soundFileText: 'אַבָּא',
    descriptionHe: 'אַ וְעוֹד בָּא זֶה אַבָּא!',
    descriptionEn: 'Ah + Bah makes Abba!',
    descriptionEs: '¡Ah + Bah forma Abba!'
  },
  {
    id: 'word-buba',
    syllables: ['בֻּ', 'בָּה'],
    wordHe: 'בֻּבָּה',
    wordEn: 'Buba (Doll / Teddy)',
    wordEs: 'Buba (Muñeca / Peluche)',
    emoji: '🧸',
    soundFileText: 'בֻּבָּה',
    descriptionHe: 'בֻּ וְעוֹד בָּה זֶה בֻּבָּה!',
    descriptionEn: 'Boo + Bah makes Buba!',
    descriptionEs: '¡Bu + Bah forma Buba!'
  },
  {
    id: 'word-dag',
    syllables: ['דָּ', 'ג'],
    wordHe: 'דָּג',
    wordEn: 'Dag (Fish)',
    wordEs: 'Dag (Pez)',
    emoji: '🐟',
    soundFileText: 'דָּג',
    descriptionHe: 'דָּ וְעוֹד ג זֶה דָּג שׁוֹחֶה!',
    descriptionEn: 'Dah + G makes Dag swimming!',
    descriptionEs: '¡Dah + G forma Dag nadando!'
  },
  {
    id: 'word-gag',
    syllables: ['גַּ', 'ג'],
    wordHe: 'גַּג',
    wordEn: 'Gag (Roof)',
    wordEs: 'Gag (Techo)',
    emoji: '🏠',
    soundFileText: 'גַּג',
    descriptionHe: 'גַּ וְעוֹד ג זֶה גַּג שֶׁל בַּיִת!',
    descriptionEn: 'Gah + G makes Gag (Roof) of a house!',
    descriptionEs: '¡Gah + G forma Gag (techo) de una casa!'
  }
];

// Numbers 1 to 10 for 4-year-olds (compliant with Israeli preschool math curriculum)
export const NUMBERS_DATA = [
  {
    number: 1,
    nameHe: 'אֶחָד',
    nameEn: 'One',
    nameEs: 'Uno',
    emoji: '🎈',
    itemsCount: 1,
    color: 'from-rose-500 to-pink-500',
    itemLabelHe: 'בַּלּוֹן אֶחָד',
    itemLabelEn: 'One balloon',
    itemLabelEs: 'Un globo'
  },
  {
    number: 2,
    nameHe: 'שְׁתַּיִם',
    nameEn: 'Two',
    nameEs: 'Dos',
    emoji: '🍎',
    itemsCount: 2,
    color: 'from-amber-500 to-orange-500',
    itemLabelHe: 'שְׁנֵי תַּפּוּחִים',
    itemLabelEn: 'Two apples',
    itemLabelEs: 'Dos manzanas'
  },
  {
    number: 3,
    nameHe: 'שָׁלוֹשׁ',
    nameEn: 'Three',
    nameEs: 'Tres',
    emoji: '🍌',
    itemsCount: 3,
    color: 'from-yellow-400 to-amber-500',
    itemLabelHe: 'שָׁלוֹשׁ בַּנָנוֹת',
    itemLabelEn: 'Three bananas',
    itemLabelEs: 'Tres plátanos'
  },
  {
    number: 4,
    nameHe: 'אַרְבַּע',
    nameEn: 'Four',
    nameEs: 'Cuatro',
    emoji: '🚗',
    itemsCount: 4,
    color: 'from-emerald-500 to-green-600',
    itemLabelHe: 'אַרְבַּע מְכוֹנִיּוֹת',
    itemLabelEn: 'Four cars',
    itemLabelEs: 'Cuatro coches'
  },
  {
    number: 5,
    nameHe: 'חָמֵשׁ',
    nameEn: 'Five',
    nameEs: 'Cinco',
    emoji: '⭐',
    itemsCount: 5,
    color: 'from-teal-400 to-cyan-600',
    itemLabelHe: 'חֲמִשָּׁה כּוֹכָבִים',
    itemLabelEn: 'Five stars',
    itemLabelEs: 'Cinco estrellas'
  },
  {
    number: 6,
    nameHe: 'שֵׁשׁ',
    nameEn: 'Six',
    nameEs: 'Seis',
    emoji: '🐱',
    itemsCount: 6,
    color: 'from-blue-500 to-indigo-600',
    itemLabelHe: 'שִׁשָּׁה חֲתוּלִים',
    itemLabelEn: 'Six cats',
    itemLabelEs: 'Seis gatos'
  },
  {
    number: 7,
    nameHe: 'שֶׁבַע',
    nameEn: 'Seven',
    nameEs: 'Siete',
    emoji: '🍓',
    itemsCount: 7,
    color: 'from-purple-500 to-pink-600',
    itemLabelHe: 'שִׁבְעָה תּוּתִים',
    itemLabelEn: 'Seven strawberries',
    itemLabelEs: 'Siete fresas'
  },
  {
    number: 8,
    nameHe: 'שְׁמוֹנֶה',
    nameEn: 'Eight',
    nameEs: 'Ocho',
    emoji: '🐶',
    itemsCount: 8,
    color: 'from-cyan-500 to-blue-600',
    itemLabelHe: 'שְׁמוֹנָה כְּלָבִים',
    itemLabelEn: 'Eight puppies',
    itemLabelEs: 'Ocho perritos'
  },
  {
    number: 9,
    nameHe: 'תֵּשַׁע',
    nameEn: 'Nine',
    nameEs: 'Nueve',
    emoji: '🍦',
    itemsCount: 9,
    color: 'from-fuchsia-500 to-pink-500',
    itemLabelHe: 'תֵּשַׁע גְּלִידוֹת',
    itemLabelEn: 'Nine ice creams',
    itemLabelEs: 'Nueve helados'
  },
  {
    number: 10,
    nameHe: 'עֶשֶׂר',
    nameEn: 'Ten',
    nameEs: 'Diez',
    emoji: '🦋',
    itemsCount: 10,
    color: 'from-emerald-400 to-teal-500',
    itemLabelHe: 'עֲשָׂרָה פַּרְפָּרִים',
    itemLabelEn: 'Ten butterflies',
    itemLabelEs: 'Diez mariposas'
  }
];

// Page 11: House Sorting Game items
export const SORTING_ITEMS = [
  // House of Pupik (בּ)
  { id: 's1', wordHe: 'בַּלּוֹן', wordEn: 'Balloon', wordEs: 'Globo', emoji: '🎈', targetHouse: 'pupik', sound: 'בּוּהּ!' },
  { id: 's2', wordHe: 'בַּיִת', wordEn: 'House', wordEs: 'Casa', emoji: '🏠', targetHouse: 'pupik', sound: 'בּוּהּ!' },
  { id: 's3', wordHe: 'בַּנָנָה', wordEn: 'Banana', wordEs: 'Plátano', emoji: '🍌', targetHouse: 'pupik', sound: 'בּוּהּ!' },
  { id: 's4', wordHe: 'בֻּבָּה', wordEn: 'Doll', wordEs: 'Muñeca', emoji: '🧸', targetHouse: 'pupik', sound: 'בּוּהּ!' },
  // House of No-Pupik (ב)
  { id: 's5', wordHe: 'כּוֹכָב', wordEn: 'Star', wordEs: 'Estrella', emoji: '⭐', targetHouse: 'no_pupik', sound: 'וְוְו...' },
  { id: 's6', wordHe: 'לֵב', wordEn: 'Heart', wordEs: 'Corazón', emoji: '❤️', targetHouse: 'no_pupik', sound: 'וְוְו...' },
  { id: 's7', wordHe: 'עֲנָבִים', wordEn: 'Grapes', wordEs: 'Uvas', emoji: '🍇', targetHouse: 'no_pupik', sound: 'וְוְו...' },
  { id: 's8', wordHe: 'זְאֵב', wordEn: 'Wolf', wordEs: 'Lobo', emoji: '🐺', targetHouse: 'no_pupik', sound: 'וְוְו...' }
];
