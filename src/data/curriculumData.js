// Curriculum data faithfully extracted from the 15-page PDF
// Aligned with Israeli Ministry of Education (Misrad HaChinuch) preschool literacy & early math standards.

export const LETTER_NAMES_DICT = {
  'א': { he: 'אָלֶף', en: 'Alef' },
  'בּ': { he: 'בֵּית', en: 'Bet' },
  'ב': { he: 'וֵית', en: 'Vet' },
  'ג': { he: 'גִּימֶל', en: 'Gimel' },
  'ד': { he: 'דָּלֶת', en: 'Dalet' },
  'ה': { he: 'הֵא', en: 'Hay' },
  'ו': { he: 'וָו', en: 'Vav' },
  'ז': { he: 'זַיִן', en: 'Zayin' },
  'ח': { he: 'חֵית', en: 'Chet' },
  'ט': { he: 'טֵית', en: 'Tet' },
  'י': { he: 'יוּד', en: 'Yud' },
  'כּ': { he: 'כַּף', en: 'Kaf' },
  'כ': { he: 'כַף (חָף)', en: 'Chaf' },
  'ל': { he: 'לָמֶד', en: 'Lamed' },
  'מ': { he: 'מֵם', en: 'Mem' },
  'נ': { he: 'נוּן', en: 'Nun' },
  'ס': { he: 'סָמֶךְ', en: 'Samekh' },
  'ע': { he: 'עַיִן', en: 'Ayin' },
  'פּ': { he: 'פֵּי', en: 'Pay' },
  'פ': { he: 'פֵיי', en: 'Fay' },
  'צ': { he: 'צָדִי', en: 'Sadi' },
  'ק': { he: 'קוּף', en: 'Kof' },
  'ר': { he: 'רֵישׁ', en: 'Resh' },
  'שׁ': { he: 'שִׁין', en: 'Shin' },
  'שׂ': { he: 'שִׂין', en: 'Sin' },
  'ת': { he: 'תָּיו', en: 'Tav' }
};

export const LETTERS_DATA = [
  // Page 1
  {
    id: 'alef',
    letter: 'א',
    displayWithNikud: 'אָלֶף',
    nameHe: 'אָלֶף',
    nameEn: 'Alef',
    soundHe: 'אָה!',
    soundQuoteHe: 'וְצוֹעֶקֶת: "אָה!"',
    soundQuoteEn: 'Shouting: "Ah!"',
    shapeDescriptionHe: 'כוכב זוהר של התחלה!',
    shapeDescriptionEn: 'A bright opening star!',
    hasPupik: false,
    color: 'from-amber-400 to-orange-500',
    borderColor: 'border-amber-400',
    badgeColor: 'bg-amber-100 text-amber-800',
    examples: [
      { he: 'אַבַטִּיחַ', en: 'Watermelon', emoji: '🍉', phonetic: 'Avatiach' },
      { he: 'אַרְיֵה', en: 'Lion', emoji: '🦁', phonetic: 'Aryeh' },
      { he: 'אֲוִירוֹן', en: 'Airplane', emoji: '✈️', phonetic: 'Aviron' },
      { he: 'אַבָּא', en: 'Daddy', emoji: '👨‍👧', phonetic: 'Abba' }
    ]
  },
  {
    id: 'bet_dagesh',
    letter: 'בּ',
    displayWithNikud: 'בֵּית',
    nameHe: 'בֵּית (עם פופיק!)',
    nameEn: 'Bet (with Pupik!)',
    soundHe: 'בּוּהּ!',
    soundQuoteHe: 'וְקוֹפֶצֶת: "בּוּהּ!"',
    soundQuoteEn: 'Jumping: "Buh!"',
    shapeDescriptionHe: 'יֵשׁ פּוּפִּיק בַּבֶּטֶן! (קוֹל בּוּם!)',
    shapeDescriptionEn: 'Has a belly-button dot! (Boom sound!)',
    hasPupik: true,
    color: 'from-blue-500 to-indigo-600',
    borderColor: 'border-blue-500',
    badgeColor: 'bg-blue-100 text-blue-800',
    examples: [
      { he: 'בַּלּוֹן', en: 'Balloon', emoji: '🎈', phonetic: 'Balon' },
      { he: 'בַּיִת', en: 'House', emoji: '🏠', phonetic: 'Bayit' },
      { he: 'בַּנָנָה', en: 'Banana', emoji: '🍌', phonetic: 'Banana' },
      { he: 'בֻּבָּה', en: 'Doll/Teddy', emoji: '🧸', phonetic: 'Buba' }
    ]
  },
  {
    id: 'vet',
    letter: 'ב',
    displayWithNikud: 'וֵית',
    nameHe: 'וֵית (בלי פופיק)',
    nameEn: 'Vet (No Pupik)',
    soundHe: 'וְוְו...',
    soundQuoteHe: 'רוּחַ: "וְוְו..."',
    soundQuoteEn: 'Gentle wind: "Vvv..."',
    shapeDescriptionHe: 'בֶּטֶן רֵיקָה – שׁוּם נְקֻדָּה! בְּלִי בּוּם!',
    shapeDescriptionEn: 'Empty belly – no dot! Soft wind, no boom!',
    hasPupik: false,
    color: 'from-purple-400 to-indigo-500',
    borderColor: 'border-purple-400',
    badgeColor: 'bg-purple-100 text-purple-800',
    examples: [
      { he: 'כּוֹכָב', en: 'Star', emoji: '⭐', phonetic: 'Kochav' },
      { he: 'לֵב', en: 'Heart', emoji: '❤️', phonetic: 'Lev' },
      { he: 'עֲנָבִים', en: 'Grapes', emoji: '🍇', phonetic: 'Anavim' },
      { he: 'זְאֵב', en: 'Wolf', emoji: '🐺', phonetic: 'Zeev' }
    ]
  },
  {
    id: 'gimel',
    letter: 'ג',
    displayWithNikud: 'גִּימֶל',
    nameHe: 'גִּימֶל',
    nameEn: 'Gimel',
    soundHe: 'גָּה!',
    soundQuoteHe: 'וְאוֹמֶרֶת: "גָּה!"',
    soundQuoteEn: 'Saying: "Gah!"',
    shapeDescriptionHe: 'עומדת על רגל אחת וצועדת!',
    shapeDescriptionEn: 'Standing tall on one leg and stepping!',
    hasPupik: false,
    color: 'from-emerald-400 to-teal-600',
    borderColor: 'border-emerald-400',
    badgeColor: 'bg-emerald-100 text-emerald-800',
    examples: [
      { he: 'גִּ\'ירָפָה', en: 'Giraffe', emoji: '🦒', phonetic: 'Girafa' },
      { he: 'גְּלִידָה', en: 'Ice cream', emoji: '🍦', phonetic: 'Glida' },
      { he: 'גָּמָל', en: 'Camel', emoji: '🐪', phonetic: 'Gamal' },
      { he: 'גֶּזֶר', en: 'Carrot', emoji: '🥕', phonetic: 'Gezer' }
    ]
  },

  // Page 2
  {
    id: 'dalet',
    letter: 'ד',
    displayWithNikud: 'דָּלֶת',
    nameHe: 'דָּלֶת',
    nameEn: 'Dalet',
    soundHe: 'דָּה!',
    soundQuoteHe: 'וְצוֹעֶקֶת: "דָּה!"',
    soundQuoteEn: 'Shouting: "Dah!"',
    shapeDescriptionHe: 'פינה יפה כמו דלת פתוחה לרווחה!',
    shapeDescriptionEn: 'A sharp corner like an open door!',
    hasPupik: false,
    color: 'from-orange-500 to-red-500',
    borderColor: 'border-orange-500',
    badgeColor: 'bg-orange-100 text-orange-800',
    examples: [
      { he: 'דֹּב', en: 'Bear', emoji: '🧸', phonetic: 'Dov' },
      { he: 'דָּג', en: 'Fish', emoji: '🐟', phonetic: 'Dag' },
      { he: 'דֶּלֶת', en: 'Door', emoji: '🚪', phonetic: 'Delet' }
    ]
  },
  {
    id: 'he',
    letter: 'ה',
    displayWithNikud: 'הֵא',
    nameHe: 'הֵא',
    nameEn: 'Hay',
    soundHe: 'הָה!',
    soundQuoteHe: 'וְנוֹשֶׁפֶת: "הָה!"',
    soundQuoteEn: 'Breathing out: "Hah!"',
    shapeDescriptionHe: 'חלון קטן פתוח לרוח הנעימה!',
    shapeDescriptionEn: 'A little open window for the fresh breeze!',
    hasPupik: false,
    color: 'from-cyan-400 to-blue-500',
    borderColor: 'border-cyan-400',
    badgeColor: 'bg-cyan-100 text-cyan-800',
    examples: [
      { he: 'הַר', en: 'Mountain', emoji: '⛰️', phonetic: 'Har' },
      { he: 'הַפְתָּעָה', en: 'Surprise / Gift', emoji: '🎁', phonetic: 'Haftaah' },
      { he: 'הֵיכָל', en: 'Palace', emoji: '🪟', phonetic: 'Heichal' }
    ]
  },

  // Page 3
  {
    id: 'vav',
    letter: 'ו',
    displayWithNikud: 'וָו',
    nameHe: 'וָו',
    nameEn: 'Vav',
    soundHe: 'וָה!',
    soundQuoteHe: 'אוֹמֶרֶת: "וָה!"',
    soundQuoteEn: 'Saying: "Vah!"',
    shapeDescriptionHe: 'עַמּוּד גָּבוֹהַּ וְיָשָׁר!',
    shapeDescriptionEn: 'A tall and straight column!',
    hasPupik: false,
    color: 'from-teal-400 to-emerald-500',
    borderColor: 'border-teal-400',
    badgeColor: 'bg-teal-100 text-teal-800',
    examples: [
      { he: 'וֶרֶד', en: 'Rose', emoji: '🌹', phonetic: 'Vered' },
      { he: 'וָו', en: 'Hook', emoji: '🪝', phonetic: 'Vav' },
      { he: 'וֶסְט', en: 'Vest', emoji: '🦺', phonetic: 'Vest' }
    ]
  },
  {
    id: 'zayin',
    letter: 'ז',
    displayWithNikud: 'זַיִן',
    nameHe: 'זַיִן',
    nameEn: 'Zayin',
    soundHe: 'זְזְז...',
    soundQuoteHe: 'זִמְזוּם: "זְזְז..."',
    soundQuoteEn: 'Buzzing: "Zzz..."',
    shapeDescriptionHe: 'כְּמוֹ מַקֵּל עִם כֶּתֶר!',
    shapeDescriptionEn: 'Like a stick with a crown!',
    hasPupik: false,
    color: 'from-amber-500 to-yellow-600',
    borderColor: 'border-amber-500',
    badgeColor: 'bg-amber-100 text-amber-800',
    examples: [
      { he: 'זֶבְּרָה', en: 'Zebra', emoji: '🦓', phonetic: 'Zebra' },
      { he: 'זְאֵב', en: 'Wolf', emoji: '🐺', phonetic: 'Zeev' },
      { he: 'זַיִת', en: 'Olive', emoji: '🫒', phonetic: 'Zayit' }
    ]
  },
  {
    id: 'chet',
    letter: 'ח',
    displayWithNikud: 'חֵית',
    nameHe: 'חֵית',
    nameEn: 'Chet',
    soundHe: 'חָה!',
    soundQuoteHe: 'חַם בַּגָּרוֹן: "חָה!"',
    soundQuoteEn: 'Warm throat: "Chah!"',
    shapeDescriptionHe: 'שַׁעַר סָגוּר מִלְמַעְלָה!',
    shapeDescriptionEn: 'A gate closed securely at the top!',
    hasPupik: false,
    color: 'from-sky-400 to-blue-600',
    borderColor: 'border-sky-400',
    badgeColor: 'bg-sky-100 text-sky-800',
    examples: [
      { he: 'חָתוּל', en: 'Cat', emoji: '🐱', phonetic: 'Chatul' },
      { he: 'חָלָב', en: 'Milk', emoji: '🥛', phonetic: 'Chalav' },
      { he: 'חַלָּה', en: 'Challah bread', emoji: '🍞', phonetic: 'Challah' }
    ]
  },
  {
    id: 'tet',
    letter: 'ט',
    displayWithNikud: 'טֵית',
    nameHe: 'טֵית',
    nameEn: 'Tet',
    soundHe: 'טָה!',
    soundQuoteHe: 'וְקוֹפֶצֶת: "טָה!"',
    soundQuoteEn: 'Jumping: "Tah!"',
    shapeDescriptionHe: 'כְּמוֹ סִיר עִם יָדִית!',
    shapeDescriptionEn: 'Like a cozy cooking pot with a handle!',
    hasPupik: false,
    color: 'from-purple-500 to-fuchsia-600',
    borderColor: 'border-purple-500',
    badgeColor: 'bg-purple-100 text-purple-800',
    examples: [
      { he: 'טְרַקְטוֹר', en: 'Tractor', emoji: '🚜', phonetic: 'Traktor' },
      { he: 'טָלֶה', en: 'Lamb', emoji: '🐑', phonetic: 'Taleh' },
      { he: 'טַבַּעַת', en: 'Ring', emoji: '💍', phonetic: 'Tabaat' }
    ]
  },

  // Page 4
  {
    id: 'yod',
    letter: 'י',
    displayWithNikud: 'יוּד',
    nameHe: 'יוּד',
    nameEn: 'Yud',
    soundHe: 'יָה!',
    soundQuoteHe: 'הֲכִי קְטַנָּה: "יָה!"',
    soundQuoteEn: 'The tiniest: "Yah!"',
    shapeDescriptionHe: 'נְקֻדָּה שֶׁקּוֹפֶצֶת בָּאֲוִיר!',
    shapeDescriptionEn: 'A dot leaping joyfully in the air!',
    hasPupik: false,
    color: 'from-pink-500 to-rose-600',
    borderColor: 'border-pink-500',
    badgeColor: 'bg-pink-100 text-pink-800',
    examples: [
      { he: 'יָד', en: 'Hand', emoji: '✋', phonetic: 'Yad' },
      { he: 'יֶלֶד', en: 'Child / Boy', emoji: '👦', phonetic: 'Yeled' },
      { he: 'יוֹנָה', en: 'Dove', emoji: '🕊️', phonetic: 'Yona' }
    ]
  },
  {
    id: 'kaf_dagesh',
    letter: 'כּ',
    displayWithNikud: 'כַּף',
    nameHe: 'כַּף (עם פופיק!)',
    nameEn: 'Kaf (with Pupik!)',
    soundHe: 'כָּה!',
    soundQuoteHe: 'חוֹבֶטֶת: "כָּה!"',
    soundQuoteEn: 'Striking strong: "Kah!"',
    shapeDescriptionHe: 'פּוּפִּיק בַּבֶּטֶן! (כּוֹחַ!)',
    shapeDescriptionEn: 'Pupik inside the belly! (Power!)',
    hasPupik: true,
    color: 'from-blue-600 to-cyan-700',
    borderColor: 'border-blue-600',
    badgeColor: 'bg-blue-100 text-blue-800',
    examples: [
      { he: 'כֶּלֶב', en: 'Dog', emoji: '🐶', phonetic: 'Kelev' },
      { he: 'כַּדּוּר', en: 'Ball', emoji: '⚽', phonetic: 'Kadur' },
      { he: 'כֶּתֶר', en: 'Crown', emoji: '👑', phonetic: 'Keter' }
    ]
  },
  {
    id: 'khaf',
    letter: 'כ',
    displayWithNikud: 'כַף (חָף)',
    nameHe: 'כַף (חָף בלי פופיק)',
    nameEn: 'Chaf (No Pupik)',
    soundHe: 'חְחְח...',
    soundQuoteHe: 'רוּחַ גָּרוֹן: "חְחְח..."',
    soundQuoteEn: 'Throat breeze: "Khhh..."',
    shapeDescriptionHe: 'בֶּטֶן רֵיקָה – בְּלִי נְקֻדָּה!',
    shapeDescriptionEn: 'Empty belly – without any dot!',
    hasPupik: false,
    color: 'from-violet-500 to-purple-600',
    borderColor: 'border-violet-500',
    badgeColor: 'bg-violet-100 text-violet-800',
    examples: [
      { he: 'כּוֹכָב', en: 'Star', emoji: '⭐', phonetic: 'Kochav' },
      { he: 'מֶלֶךְ', en: 'King', emoji: '👑', phonetic: 'Melech' },
      { he: 'הוֹלֵךְ', en: 'Walking', emoji: '🚶', phonetic: 'Holech' }
    ]
  },
  {
    id: 'lamed',
    letter: 'ל',
    displayWithNikud: 'לָמֶד',
    nameHe: 'לָמֶד',
    nameEn: 'Lamed',
    soundHe: 'לָה-לָה!',
    soundQuoteHe: 'מְנַגֶּנֶת: "לָה-לָה!"',
    soundQuoteEn: 'Singing: "La-la!"',
    shapeDescriptionHe: 'הָאוֹת הֲכִי גְּבוֹהָה עַד הַשָּׁמַיִם!',
    shapeDescriptionEn: 'The tallest letter reaching up to the sky!',
    hasPupik: false,
    color: 'from-emerald-500 to-green-600',
    borderColor: 'border-emerald-500',
    badgeColor: 'bg-emerald-100 text-emerald-800',
    examples: [
      { he: 'לִימוֹן', en: 'Lemon', emoji: '🍋', phonetic: 'Limon' },
      { he: 'לֵב', en: 'Heart', emoji: '❤️', phonetic: 'Lev' },
      { he: 'לֶחֶם', en: 'Bread', emoji: '🍞', phonetic: 'Lechem' }
    ]
  },

  // Page 5
  {
    id: 'mem',
    letter: 'מ',
    displayWithNikud: 'מֵם',
    nameHe: 'מֵם',
    nameEn: 'Mem',
    soundHe: 'מַמָּה!',
    soundQuoteHe: 'טָעִים: "מַמָּה!"',
    soundQuoteEn: 'Yummy: "Mamma!"',
    shapeDescriptionHe: 'כְּמוֹ גַּל שֶׁל מַיִם!',
    shapeDescriptionEn: 'Like a gentle wave of clear water!',
    hasPupik: false,
    color: 'from-sky-500 to-cyan-600',
    borderColor: 'border-sky-500',
    badgeColor: 'bg-sky-100 text-sky-800',
    examples: [
      { he: 'מַיִם', en: 'Water', emoji: '💧', phonetic: 'Mayim' },
      { he: 'מַרְאָה', en: 'Mirror', emoji: '🪞', phonetic: 'Marea' },
      { he: 'מְלָפְפוֹן', en: 'Cucumber', emoji: '🥒', phonetic: 'Melafefon' }
    ]
  },
  {
    id: 'nun',
    letter: 'נ',
    displayWithNikud: 'נוּן',
    nameHe: 'נוּן',
    nameEn: 'Nun',
    soundHe: 'נָה!',
    soundQuoteHe: 'מַנְעִימָה: "נָה!"',
    soundQuoteEn: 'Sweet humming: "Nah!"',
    shapeDescriptionHe: 'כְּמוֹ פָּמוֹט עִם נֵר קָטָן!',
    shapeDescriptionEn: 'Like a holder with a little candle!',
    hasPupik: false,
    color: 'from-amber-500 to-orange-600',
    borderColor: 'border-amber-500',
    badgeColor: 'bg-amber-100 text-amber-800',
    examples: [
      { he: 'נֵר', en: 'Candle', emoji: '🕯️', phonetic: 'Ner' },
      { he: 'נָמֵר', en: 'Tiger', emoji: '🐆', phonetic: 'Namer' },
      { he: 'נֶשֶׁר', en: 'Eagle', emoji: '🦅', phonetic: 'Nesher' }
    ]
  },
  {
    id: 'samech',
    letter: 'ס',
    displayWithNikud: 'סָמֶךְ',
    nameHe: 'סָמֶךְ',
    nameEn: 'Samekh',
    soundHe: 'סְסְס...',
    soundQuoteHe: 'נוֹשֶׁפֶת: "סְסְס..."',
    soundQuoteEn: 'Hissing: "Sss..."',
    shapeDescriptionHe: 'עֲגֻלָּה וּסְגוּרָה כְּמוֹ כַּדּוּר!',
    shapeDescriptionEn: 'Round and completely closed like a ball!',
    hasPupik: false,
    color: 'from-orange-400 to-amber-500',
    borderColor: 'border-orange-400',
    badgeColor: 'bg-orange-100 text-orange-800',
    examples: [
      { he: 'סוּס', en: 'Horse', emoji: '🐎', phonetic: 'Sus' },
      { he: 'סֻלָּם', en: 'Ladder', emoji: '🪜', phonetic: 'Sulam' },
      { he: 'סֵפֶר', en: 'Book', emoji: '📖', phonetic: 'Sefer' }
    ]
  },
  {
    id: 'ayin',
    letter: 'ע',
    displayWithNikud: 'עַיִן',
    nameHe: 'עַיִן',
    nameEn: 'Ayin',
    soundHe: 'עָה!',
    soundQuoteHe: 'עֲמֻקָּה: "עָה!"',
    soundQuoteEn: 'Deep throat: "Ah!"',
    shapeDescriptionHe: 'רוֹאָה הַכֹּל סְבִיבָהּ עִם שְׁתֵּי עֵינַיִם!',
    shapeDescriptionEn: 'Sees all around with wide open eyes!',
    hasPupik: false,
    color: 'from-emerald-500 to-teal-600',
    borderColor: 'border-emerald-500',
    badgeColor: 'bg-emerald-100 text-emerald-800',
    examples: [
      { he: 'עַיִן', en: 'Eye', emoji: '👁️', phonetic: 'Ayin' },
      { he: 'עֵץ', en: 'Tree', emoji: '🌳', phonetic: 'Etz' },
      { he: 'עֲנָבִים', en: 'Grapes', emoji: '🍇', phonetic: 'Anavim' }
    ]
  },

  // Page 6
  {
    id: 'pe_dagesh',
    letter: 'פּ',
    displayWithNikud: 'פֵּי',
    nameHe: 'פֵּי (עם פופיק!)',
    nameEn: 'Pay (with Pupik!)',
    soundHe: 'פּוּם!',
    soundQuoteHe: 'פּוֹצֶצֶת: "פּוּם!"',
    soundQuoteEn: 'Popping: "Poom!"',
    shapeDescriptionHe: 'פּוּפִּיק בַּבֶּטֶן! (קוֹל פּוֹצֵץ!)',
    shapeDescriptionEn: 'Pupik inside belly! (Pop-bang sound!)',
    hasPupik: true,
    color: 'from-blue-500 to-indigo-600',
    borderColor: 'border-blue-500',
    badgeColor: 'bg-blue-100 text-blue-800',
    examples: [
      { he: 'פִּיל', en: 'Elephant', emoji: '🐘', phonetic: 'Pil' },
      { he: 'פַּרְפַּר', en: 'Butterfly', emoji: '🦋', phonetic: 'Parpar' },
      { he: 'פִּיצָה', en: 'Pizza', emoji: '🍕', phonetic: 'Pizza' }
    ]
  },
  {
    id: 'fe',
    letter: 'פ',
    displayWithNikud: 'פֵיי',
    nameHe: 'פֵיי (בלי פופיק - רוח)',
    nameEn: 'Fay (No Pupik - Wind)',
    soundHe: 'פְּפְפ...',
    soundQuoteHe: 'נוֹשֶׁבֶת: "פְּפְפ..."',
    soundQuoteEn: 'Blowing: "Fff..."',
    shapeDescriptionHe: 'בֶּטֶן רֵיקָה – שׁוּם נְקֻדָּה!',
    shapeDescriptionEn: 'Empty belly – no dot at all!',
    hasPupik: false,
    color: 'from-purple-500 to-indigo-600',
    borderColor: 'border-purple-500',
    badgeColor: 'bg-purple-100 text-purple-800',
    examples: [
      { he: 'עֲפִיפוֹן', en: 'Kite', emoji: '🪁', phonetic: 'Afifon' },
      { he: 'צִפּוֹר', en: 'Bird', emoji: '🐦', phonetic: 'Tzipor' },
      { he: 'אַף', en: 'Nose', emoji: '👃', phonetic: 'Af' }
    ]
  },
  {
    id: 'tsadi',
    letter: 'צ',
    displayWithNikud: 'צָדִי',
    nameHe: 'צָדִי',
    nameEn: 'Sadi',
    soundHe: 'צָה!',
    soundQuoteHe: 'מְצַיְּצָה: "צָה!"',
    soundQuoteEn: 'Chirping: "Tzah!"',
    shapeDescriptionHe: 'כְּמוֹ אֶפְרוֹחַ קָטָן!',
    shapeDescriptionEn: 'Cute like a chirping little baby chick!',
    hasPupik: false,
    color: 'from-amber-500 to-yellow-600',
    borderColor: 'border-amber-500',
    badgeColor: 'bg-amber-100 text-amber-800',
    examples: [
      { he: 'צָב', en: 'Turtle', emoji: '🐢', phonetic: 'Tzav' },
      { he: 'צְפַרְדֵּעַ', en: 'Frog', emoji: '🐸', phonetic: 'Tzfardea' },
      { he: 'צִפּוֹר', en: 'Bird', emoji: '🐦', phonetic: 'Tzipor' }
    ]
  },
  {
    id: 'kof',
    letter: 'ק',
    displayWithNikud: 'קוּף',
    nameHe: 'קוּף',
    nameEn: 'Kof',
    soundHe: 'קוּ!',
    soundQuoteHe: 'קוֹפֶצֶת: "קוּ!"',
    soundQuoteEn: 'Jumping: "Koo!"',
    shapeDescriptionHe: 'רֶגֶל אֲרֻכָּה שֶׁיּוֹרֶדֶת לְמַטָּה!',
    shapeDescriptionEn: 'A long playful leg swinging downwards!',
    hasPupik: false,
    color: 'from-cyan-500 to-blue-600',
    borderColor: 'border-cyan-500',
    badgeColor: 'bg-cyan-100 text-cyan-800',
    examples: [
      { he: 'קוֹף', en: 'Monkey', emoji: '🐒', phonetic: 'Kof' },
      { he: 'קֶשֶׁת', en: 'Rainbow', emoji: '🌈', phonetic: 'Keshet' },
      { he: 'קַרְטִיב', en: 'Popsicle', emoji: '🍦', phonetic: 'Kartiv' }
    ]
  },

  // Page 7
  {
    id: 'resh',
    letter: 'ר',
    displayWithNikud: 'רֵישׁ',
    nameHe: 'רֵישׁ',
    nameEn: 'Resh',
    soundHe: 'רָה!',
    soundQuoteHe: 'מִתְגַּלְגֶּלֶת: "רָה!"',
    soundQuoteEn: 'Rolling: "Rah!"',
    shapeDescriptionHe: 'פִּנָּה עֲגֻלָּה כְּמוֹ מַגְלֵשָׁה!',
    shapeDescriptionEn: 'A curved corner smooth like a playground slide!',
    hasPupik: false,
    color: 'from-orange-500 to-red-600',
    borderColor: 'border-orange-500',
    badgeColor: 'bg-orange-100 text-orange-800',
    examples: [
      { he: 'רֶכֶב', en: 'Car', emoji: '🚗', phonetic: 'Rechev' },
      { he: 'רַכֶּבֶת', en: 'Train', emoji: '🚂', phonetic: 'Rakevet' },
      { he: 'רֹאשׁ', en: 'Head', emoji: '🎈', phonetic: 'Rosh' }
    ]
  },
  {
    id: 'shin',
    letter: 'שׁ',
    displayWithNikud: 'שִׁין',
    nameHe: 'שִׁין (נקודה בימין)',
    nameEn: 'Shin (Dot on right)',
    soundHe: 'שְׁשְׁשׁ...',
    soundQuoteHe: 'לוֹחֶשֶׁת: "שְׁשְׁשׁ..."',
    soundQuoteEn: 'Whispering: "Shhh..."',
    shapeDescriptionHe: 'נְקֻדָּה בְּצַד יָמִין (שָׁלוֹם!)',
    shapeDescriptionEn: 'Crown dot on the right side (Shalom!)',
    hasPupik: true,
    pupikLocation: 'top-right',
    color: 'from-blue-600 to-indigo-700',
    borderColor: 'border-blue-600',
    badgeColor: 'bg-blue-100 text-blue-800',
    examples: [
      { he: 'שֶׁמֶשׁ', en: 'Sun', emoji: '☀️', phonetic: 'Shemesh' },
      { he: 'שׁוּעָל', en: 'Fox', emoji: '🦊', phonetic: 'Shual' },
      { he: 'שׁוֹקוֹלָד', en: 'Chocolate', emoji: '🍫', phonetic: 'Shokolad' }
    ]
  },
  {
    id: 'sin',
    letter: 'שׂ',
    displayWithNikud: 'שִׂין',
    nameHe: 'שִׂין (נקודה בשמאל)',
    nameEn: 'Sin (Dot on left)',
    soundHe: 'סָה!',
    soundQuoteHe: 'שְׂמֵחָה: "סָה!"',
    soundQuoteEn: 'Joyful: "Sah!"',
    shapeDescriptionHe: 'נְקֻדָּה בְּצַד שְׂמֹאל (שִׂמְחָה!)',
    shapeDescriptionEn: 'Crown dot on the left side (Simcha - Joy!)',
    hasPupik: true,
    pupikLocation: 'top-left',
    color: 'from-purple-500 to-pink-600',
    borderColor: 'border-purple-500',
    badgeColor: 'bg-purple-100 text-purple-800',
    examples: [
      { he: 'שִׂמְחָה', en: 'Joy / Happiness', emoji: '😃', phonetic: 'Simcha' },
      { he: 'שִׂמְלָה', en: 'Dress', emoji: '👗', phonetic: 'Simla' },
      { he: 'שָׂדֶה', en: 'Field', emoji: '🌾', phonetic: 'Sadeh' }
    ]
  },
  {
    id: 'tav',
    letter: 'ת',
    displayWithNikud: 'תָּיו',
    nameHe: 'תָּיו',
    nameEn: 'Tav',
    soundHe: 'תָּה!',
    soundQuoteHe: 'אַחֲרוֹנָה: "תָּה!"',
    soundQuoteEn: 'The champion: "Tah!"',
    shapeDescriptionHe: 'יֵשׁ לָהּ מַגָּף קָטָן בַּקָּצֶה!',
    shapeDescriptionEn: 'Has a cute little walking boot at the tip!',
    hasPupik: false,
    color: 'from-emerald-500 to-green-700',
    borderColor: 'border-emerald-500',
    badgeColor: 'bg-emerald-100 text-emerald-800',
    examples: [
      { he: 'תַּפּוּחַ', en: 'Apple', emoji: '🍎', phonetic: 'Tapuach' },
      { he: 'תּוּת', en: 'Strawberry', emoji: '🍓', phonetic: 'Tut' },
      { he: 'תִּיק', en: 'Backpack / Bag', emoji: '🎒', phonetic: 'Tik' }
    ]
  }
];

// Pages 8, 9, 10: Reading Train (רַכֶּבֶת קְרִיאָה מַדְרֵגָה אַחַר מַדְרֵגָה)
export const READING_TRAIN_DATA = [
  {
    level: 1,
    titleHe: "רַכֶּבֶת קְרִיאָה מַדְרֵגָה אַחַר מַדְרֵגָה: מ-א' עַד ט'",
    titleEn: "Step-by-Step Reading Train: Alef to Tet",
    subtitleHe: "בְּכָל שׁוּרָה נוֹסֶפֶת אוֹת חֲדָשָׁה! קוֹרְאִים מִיָּמִין לִשְׂמֹאל וְצוֹבְעִים כּוֹכָב ⭐",
    subtitleEn: "A new letter in each row! Read right-to-left and collect stars ⭐",
    rows: [
      { labelHe: 'שׁוּרָה 1 (א)', labelEn: 'Row 1 (Alef)', letters: ['א', 'א', 'א', 'א'] },
      { labelHe: '+ בּוּם! (בּ)', labelEn: '+ Boom! (Bet)', letters: ['בּ', 'א', 'בּ', 'בּ', 'א'] },
      { labelHe: '+ רוּחַ (ב)', labelEn: '+ Wind (Vet)', letters: ['בּ', 'ב', 'א', 'ב', 'בּ'] },
      { labelHe: '+ גִּימֶל (ג)', labelEn: '+ Gimel (ג)', letters: ['ג', 'בּ', 'ב', 'ג', 'א'] },
      { labelHe: '+ דָּלֶת (ד)', labelEn: '+ Dalet (ד)', letters: ['ד', 'ג', 'בּ', 'ד', 'ב'] },
      { labelHe: '+ הֵא (ה)', labelEn: '+ He (ה)', letters: ['ה', 'ד', 'בּ', 'ב', 'ה'] },
      { labelHe: '+ וָו (ו)', labelEn: '+ Vav (ו)', letters: ['ו', 'ה', 'ו', 'בּ', 'ב'] },
      { labelHe: '+ זַיִן (ז)', labelEn: '+ Zayin (ז)', letters: ['ז', 'ו', 'ז', 'בּ', 'ב'] },
      { labelHe: '+ חֵית (ח)', labelEn: '+ Chet (ח)', letters: ['ח', 'ה', 'ח', 'בּ', 'ב'] },
      { labelHe: '+ טֵית (ט)', labelEn: '+ Tet (ט)', letters: ['ט', 'ח', 'ז', 'ט', 'בּ'] }
    ]
  },
  {
    level: 2,
    titleHe: "רַכֶּבֶת קְרִיאָה מַדְרֵגָה אַחַר מַדְרֵגָה: מ-י' עַד ע'",
    titleEn: "Step-by-Step Reading Train: Yud to Ayin",
    subtitleHe: "מוֹסִיפִים אוֹת חֲדָשָׁה • בּוֹדְקִים הֵיטֵב כּ' עִם פּוּפִּיק וְ-כ' בְּלִי!",
    subtitleEn: "Add new letters • Check Kaf with Pupik vs Khaf without!",
    rows: [
      { labelHe: '+ יוּד (י)', labelEn: '+ Yud (י)', letters: ['י', 'ט', 'י', 'בּ', 'ב'] },
      { labelHe: '+ כַּף פּוּפִּיק (כּ)', labelEn: '+ Kaf with pupik (כּ)', letters: ['כּ', 'בּ', 'י', 'כּ', 'ב'] },
      { labelHe: '+ כַף רֵיקָה (כ)', labelEn: '+ Khaf empty (כ)', letters: ['כּ', 'כ', 'בּ', 'כ', 'ב'] },
      { labelHe: '+ לָמֶד גְּבוֹהָה (ל)', labelEn: '+ Tall Lamed (ל)', letters: ['ל', 'כּ', 'ל', 'כ', 'י'] },
      { labelHe: '+ מֵם (מ)', labelEn: '+ Mem (מ)', letters: ['מ', 'ל', 'מ', 'בּ', 'ב'] },
      { labelHe: '+ נוּן (נ)', labelEn: '+ Nun (נ)', letters: ['נ', 'מ', 'נ', 'ל', 'כּ'] },
      { labelHe: '+ סָמֶךְ עֲגֻלָּה (ס)', labelEn: '+ Round Samekh (ס)', letters: ['ס', 'נ', 'ס', 'מ', 'בּ'] },
      { labelHe: '+ עַיִן (ע)', labelEn: '+ Ayin (ע)', letters: ['ע', 'ס', 'ע', 'ל', 'ב'] }
    ]
  },
  {
    level: 3,
    titleHe: "רַכֶּבֶת קְרִיאָה: מ-פּ' עַד ת' (סִיּוּם הָאָלֶף-בֵּית!)",
    titleEn: "Reading Train: Pe to Tav (Grand Finale!)",
    subtitleHe: "מוֹסִיפִים פּוּפִּיקִים, נְקֻדּוֹת יָמִין וּשְׂמֹאל וּמַגִּיעִים עַד הַכֶּתֶר 👑",
    subtitleEn: "Add pupiks, right & left dots, all the way to the Crown 👑",
    rows: [
      { labelHe: '+ פֵּי פּוּם (פּ)', labelEn: '+ Pay boom (פּ)', letters: ['פּ', 'ע', 'פּ', 'בּ', 'כּ'] },
      { labelHe: '+ פֵיי רוּחַ (פ)', labelEn: '+ Fay wind (פ)', letters: ['פּ', 'פ', 'בּ', 'פ', 'ב'] },
      { labelHe: '+ צָדִי (צ)', labelEn: '+ Sadi (צ)', letters: ['צ', 'פּ', 'צ', 'פ', 'ע'] },
      { labelHe: '+ קוּף קוֹפֶצֶת (ק)', labelEn: '+ Kof jumping (ק)', letters: ['ק', 'צ', 'ק', 'בּ', 'ב'] },
      { labelHe: '+ רֵישׁ (ר)', labelEn: '+ Resh (ר)', letters: ['ר', 'ד', 'ר', 'ק', 'ל'] },
      { labelHe: '+ שִׁין יָמִין (שׁ)', labelEn: '+ Shin right (שׁ)', letters: ['שׁ', 'ר', 'שׁ', 'בּ', 'ב'] },
      { labelHe: '+ שִׂין שְׂמֹאל (שׂ)', labelEn: '+ Sin left (שׂ)', letters: ['שׁ', 'שׂ', 'שׁ', 'ס', 'שׂ'] },
      { labelHe: '+ תָּיו מְנַצַּחַת (ת)', labelEn: '+ Tav winner! (ת)', letters: ['ת', 'שׁ', 'ר', 'בּ', 'ב', 'ת'] }
    ]
  }
];

// Page 14: World of Vowels (עוֹלַם הַנְּקֻדּוֹת שֶׁל הָאוֹתִיּוֹת)
export const VOWELS_DATA = [
  {
    id: 'patach_kamatz',
    nameHe: 'פַּתַח • קָמַץ',
    nameEn: 'Patach & Kamatz',
    symbolHe: 'בַּ / בָּ',
    sound: 'בָּה!',
    faceEmoji: '😲',
    soundHintHe: 'פּוֹתְחִים פֶּה עֲנָק כְּמוֹ אֵצֶל רוֹפֵא: אָההה!',
    soundHintEn: 'Open a giant mouth like at the doctor: Ahhh!',
    vowelSound: 'ah',
    accentColor: 'border-amber-400 bg-amber-50 text-amber-900',
    examples: ['אַ', 'בַּ', 'גַּ', 'דָּ']
  },
  {
    id: 'chirik',
    nameHe: 'חִירִיק (נְקֻדָּה לְמַטָּה)',
    nameEn: 'Chirik (Dot below)',
    symbolHe: 'בִּ',
    sound: 'בִּי!',
    faceEmoji: '😁',
    soundHintHe: 'חִיּוּךְ שֶׁמַּרְאֶה שִׁנַּיִם וְצוֹחֵק: אִי-אִי-אִי!',
    soundHintEn: 'Big smile showing teeth laughing: Ee-ee-ee!',
    vowelSound: 'ee',
    accentColor: 'border-blue-400 bg-blue-50 text-blue-900',
    examples: ['אִ', 'בִּ', 'גִּ', 'דִּ']
  },
  {
    id: 'cholam',
    nameHe: 'חוֹלָם (כַּדּוּר לְמַעְלָה)',
    nameEn: 'Cholam (Ball up top)',
    symbolHe: 'בּוֹ',
    sound: 'בּוֹ!',
    faceEmoji: '😮',
    soundHintHe: 'פֶּה עָגֹל וּמֻפְתָּע כְּמוֹ סֻכָּרִיָּה: אוֹוֹוֹ!',
    soundHintEn: 'Round surprised mouth like a lollipop: Ohhh!',
    vowelSound: 'oh',
    accentColor: 'border-purple-400 bg-purple-50 text-purple-900',
    examples: ['אוֹ', 'בּוֹ', 'גּוֹ', 'דּוֹ']
  },
  {
    id: 'shuruk',
    nameHe: 'שׁוּרוּק (נְקֻדָּה בַּפֶּה / קוּבּוּץ)',
    nameEn: 'Shuruk (Dot in mouth)',
    symbolHe: 'בּוּ',
    sound: 'בּוּ!',
    faceEmoji: '😗',
    soundHintHe: 'שְׂפָתַיִם שֶׁשּׁוֹרְקוֹת כְּמוֹ רַכֶּבֶת: אוּ-אוּ-אוּ!',
    soundHintEn: 'Whistling lips like a little train: Oo-oo-oo!',
    vowelSound: 'oo',
    accentColor: 'border-teal-400 bg-teal-50 text-teal-900',
    examples: ['אוּ', 'בּוּ', 'גּוּ', 'דּוּ']
  },
  {
    id: 'segol',
    nameHe: 'סֶגוֹל (מְשֻׁלַּשׁ נְקֻדּוֹת)',
    nameEn: 'Segol (Three dots triangle)',
    symbolHe: 'בֶּ / בֵּ',
    sound: 'בֶּה!',
    faceEmoji: '😏',
    soundHintHe: 'צוֹעֲקִים כְּמוֹ כִּבְשָׂה קְטַנָּה: אֶה-אֶה-אֶה!',
    soundHintEn: 'Bleating like a cute little lamb: Eh-eh-eh!',
    vowelSound: 'eh',
    accentColor: 'border-emerald-400 bg-emerald-50 text-emerald-900',
    examples: ['אֶ', 'בֶּ', 'גֶּ', 'דֶּ']
  }
];

// Page 14 contrast practice (בּוּם מול רוּחַ עם נקודות)
export const VOWEL_CONTRASTS = [
  { left: 'בַּ', leftSound: 'בָּה!', right: 'בַ', rightSound: 'וָה!', desc: 'פתח/קמץ: בּוּם מול רוח' },
  { left: 'בִּ', leftSound: 'בִּי!', right: 'בִ', rightSound: 'וִי!', desc: 'חיריק: בּוּם מול רוח' },
  { left: 'בּוּ', leftSound: 'בּוּ!', right: 'בוּ', rightSound: 'ווּ!', desc: 'שורוק: בּוּם מול רוח' }
];

// Page 14: Vowel reading train rows (read right-to-left)
export const VOWEL_TRAIN_ROWS = [
  { titleHe: 'פֶּה פָּתוּחַ (אָה!)', titleEn: 'Open Mouth (Ah!)', emoji: '😲', letters: ['אָ', 'בַּ', 'בַ', 'גַּ', 'דָּ'] },
  { titleHe: 'חִיּוּךְ רָחָב (אִי!)', titleEn: 'Wide Smile (Ee!)', emoji: '😁', letters: ['אִ', 'בִּ', 'בִ', 'גִּ', 'הִ'] },
  { titleHe: 'עָגֹל וּמֻפְתָּע (אוֹ!)', titleEn: 'Round Surprised (Oh!)', emoji: '😮', letters: ['אוֹ', 'בּוֹ', 'בוֹ', 'גּוֹ', 'דּוֹ'] },
  { titleHe: 'שׁוֹרְקִים רַכֶּבֶת (אוּ!)', titleEn: 'Whistle Train (Oo!)', emoji: '😗', letters: ['אוּ', 'בּוּ', 'בוּ', 'גּוּ', 'הוּ'] }
];

// Page 15: First Words for 4-year-olds (ילדים כבר קוראים מילים אמיתיות!)
export const FIRST_WORDS_DATA = [
  {
    id: 'word-abba',
    syllables: ['אַ', 'בָּא'],
    wordHe: 'אַבָּא',
    wordEn: 'Abba (Daddy)',
    emoji: '👨‍👧',
    soundFileText: 'אַבָּא',
    descriptionHe: 'אַ וְעוֹד בָּא זֶה אַבָּא!',
    descriptionEn: 'Ah + Bah makes Abba!'
  },
  {
    id: 'word-buba',
    syllables: ['בֻּ', 'בָּה'],
    wordHe: 'בֻּבָּה',
    wordEn: 'Buba (Doll / Teddy)',
    emoji: '🧸',
    soundFileText: 'בֻּבָּה',
    descriptionHe: 'בֻּ וְעוֹד בָּה זֶה בֻּבָּה!',
    descriptionEn: 'Boo + Bah makes Buba!'
  },
  {
    id: 'word-dag',
    syllables: ['דָּ', 'ג'],
    wordHe: 'דָּג',
    wordEn: 'Dag (Fish)',
    emoji: '🐟',
    soundFileText: 'דָּג',
    descriptionHe: 'דָּ וְעוֹד ג זֶה דָּג שׁוֹחֶה!',
    descriptionEn: 'Dah + G makes Dag swimming!'
  },
  {
    id: 'word-gag',
    syllables: ['גַּ', 'ג'],
    wordHe: 'גַּג',
    wordEn: 'Gag (Roof)',
    emoji: '🏠',
    soundFileText: 'גַּג',
    descriptionHe: 'גַּ וְעוֹד ג זֶה גַּג שֶׁל בַּיִת!',
    descriptionEn: 'Gah + G makes Gag (Roof) of a house!'
  }
];

// Numbers 1 to 10 for 4-year-olds (compliant with Israeli preschool math curriculum)
export const NUMBERS_DATA = [
  {
    number: 1,
    nameHe: 'אֶחָד',
    nameEn: 'One',
    emoji: '🎈',
    itemsCount: 1,
    color: 'from-rose-500 to-pink-500',
    itemLabelHe: 'בַּלּוֹן אֶחָד',
    itemLabelEn: 'One balloon'
  },
  {
    number: 2,
    nameHe: 'שְׁתַּיִם',
    nameEn: 'Two',
    emoji: '🍎',
    itemsCount: 2,
    color: 'from-amber-500 to-orange-500',
    itemLabelHe: 'שְׁנֵי תַּפּוּחִים',
    itemLabelEn: 'Two apples'
  },
  {
    number: 3,
    nameHe: 'שָׁלוֹשׁ',
    nameEn: 'Three',
    emoji: '🍌',
    itemsCount: 3,
    color: 'from-yellow-400 to-amber-500',
    itemLabelHe: 'שָׁלוֹשׁ בַּנָנוֹת',
    itemLabelEn: 'Three bananas'
  },
  {
    number: 4,
    nameHe: 'אַרְבַּע',
    nameEn: 'Four',
    emoji: '🚗',
    itemsCount: 4,
    color: 'from-emerald-500 to-green-600',
    itemLabelHe: 'אַרְבַּע מְכוֹנִיּוֹת',
    itemLabelEn: 'Four cars'
  },
  {
    number: 5,
    nameHe: 'חָמֵשׁ',
    nameEn: 'Five',
    emoji: '⭐',
    itemsCount: 5,
    color: 'from-teal-400 to-cyan-600',
    itemLabelHe: 'חֲמִשָּׁה כּוֹכָבִים',
    itemLabelEn: 'Five stars'
  },
  {
    number: 6,
    nameHe: 'שֵׁשׁ',
    nameEn: 'Six',
    emoji: '🐱',
    itemsCount: 6,
    color: 'from-blue-500 to-indigo-600',
    itemLabelHe: 'שִׁשָּׁה חֲתוּלִים',
    itemLabelEn: 'Six cats'
  },
  {
    number: 7,
    nameHe: 'שֶׁבַע',
    nameEn: 'Seven',
    emoji: '🍓',
    itemsCount: 7,
    color: 'from-purple-500 to-pink-600',
    itemLabelHe: 'שִׁבְעָה תּוּתִים',
    itemLabelEn: 'Seven strawberries'
  },
  {
    number: 8,
    nameHe: 'שְׁמוֹנֶה',
    nameEn: 'Eight',
    emoji: '🐶',
    itemsCount: 8,
    color: 'from-cyan-500 to-blue-600',
    itemLabelHe: 'שְׁמוֹנָה כְּלָבִים',
    itemLabelEn: 'Eight puppies'
  },
  {
    number: 9,
    nameHe: 'תֵּשַׁע',
    nameEn: 'Nine',
    emoji: '🍦',
    itemsCount: 9,
    color: 'from-fuchsia-500 to-pink-500',
    itemLabelHe: 'תֵּשַׁע גְּלִידוֹת',
    itemLabelEn: 'Nine ice creams'
  },
  {
    number: 10,
    nameHe: 'עֶשֶׂר',
    nameEn: 'Ten',
    emoji: '🦋',
    itemsCount: 10,
    color: 'from-emerald-400 to-teal-500',
    itemLabelHe: 'עֲשָׂרָה פַּרְפָּרִים',
    itemLabelEn: 'Ten butterflies'
  }
];

// Page 11: House Sorting Game items
export const SORTING_ITEMS = [
  // House of Pupik (בּ)
  { id: 's1', wordHe: 'בַּלּוֹן', wordEn: 'Balloon', emoji: '🎈', targetHouse: 'pupik', sound: 'בּוּהּ!' },
  { id: 's2', wordHe: 'בַּיִת', wordEn: 'House', emoji: '🏠', targetHouse: 'pupik', sound: 'בּוּהּ!' },
  { id: 's3', wordHe: 'בַּנָנָה', wordEn: 'Banana', emoji: '🍌', targetHouse: 'pupik', sound: 'בּוּהּ!' },
  { id: 's4', wordHe: 'בֻּבָּה', wordEn: 'Doll', emoji: '🧸', targetHouse: 'pupik', sound: 'בּוּהּ!' },
  // House of No-Pupik (ב)
  { id: 's5', wordHe: 'כּוֹכָב', wordEn: 'Star', emoji: '⭐', targetHouse: 'no_pupik', sound: 'וְוְו...' },
  { id: 's6', wordHe: 'לֵב', wordEn: 'Heart', emoji: '❤️', targetHouse: 'no_pupik', sound: 'וְוְו...' },
  { id: 's7', wordHe: 'עֲנָבִים', wordEn: 'Grapes', emoji: '🍇', targetHouse: 'no_pupik', sound: 'וְוְו...' },
  { id: 's8', wordHe: 'זְאֵב', wordEn: 'Wolf', emoji: '🐺', targetHouse: 'no_pupik', sound: 'וְוְו...' }
];
