// Curated Star Shop catalog for Ages 4, 7 & 9 (trilingual: Hebrew, English, Spanish)
// Kids spend stars earned from games on Avatars, App Themes, Companion Pets, and Champion Titles.

export const SHOP_CATEGORIES = [
  { id: 'avatars', icon: '🦊', he: 'דְּמוּיוֹת וְאָוָואטָארִים', en: 'Cool Avatars', es: 'Avatares' },
  { id: 'pets', icon: '🐾', he: 'חַיּוֹת מַחְמָד', en: 'Companion Pets', es: 'Mascotas' },
  { id: 'themes', icon: '🎨', he: 'עוֹלָמוֹת וְרְקָעִים', en: 'App Worlds', es: 'Temas' },
  { id: 'badges', icon: '🏅', he: 'תָּאֳרֵי אַלּוּפִים', en: 'Hero Titles', es: 'Títulos' }
];

export const SHOP_ITEMS = [
  /* ===================== AVATARS ===================== */
  {
    id: 'av_fox',
    category: 'avatars',
    icon: '🦊',
    price: 10,
    rarity: 'common',
    nameHe: 'שׁוּעָל חָכָם',
    nameEn: 'Clever Fox',
    nameEs: 'Zorro Listo',
    descHe: 'אָוָואטָאר שׁוּעָל זָרִיז וְחָכָם',
    descEn: 'Quick & clever fox avatar',
    descEs: 'Avatar de zorro inteligente'
  },
  {
    id: 'av_panda',
    category: 'avatars',
    icon: '🐼',
    price: 15,
    rarity: 'common',
    nameHe: 'פַּנְדָּה נִינְגָּ׳ה',
    nameEn: 'Ninja Panda',
    nameEs: 'Panda Ninja',
    descHe: 'פַּנְדָּה חֲמוּדָה שֶׁאוֹהֶבֶת לִלְמֹד',
    descEn: 'Cute panda who loves challenges',
    descEs: 'Panda adorable y valiente'
  },
  {
    id: 'av_owl',
    category: 'avatars',
    icon: '🦉',
    price: 20,
    rarity: 'rare',
    nameHe: 'יַנְשׁוּף חָכָם',
    nameEn: 'Wise Owl',
    nameEs: 'Búho Sabio',
    descHe: 'מַאֲמִין בְּךָ בְּכָל חִידָה',
    descEn: 'Master of tricky riddles',
    descEs: 'Maestro de acertijos'
  },
  {
    id: 'av_robot',
    category: 'avatars',
    icon: '🤖',
    price: 25,
    rarity: 'rare',
    nameHe: 'סוּפֶּר רוֹבּוֹט',
    nameEn: 'Super Robot',
    nameEs: 'Súper Robot',
    descHe: 'מוֹחַ טוּרְבּוֹ לְחֶשְׁבּוֹן וְלִשְׂפוֹת',
    descEn: 'Turbo brain for math & words',
    descEs: 'Cerebro turbo de mates y letras'
  },
  {
    id: 'av_dragon',
    category: 'avatars',
    icon: '🐉',
    price: 35,
    rarity: 'epic',
    nameHe: 'דְּרָקוֹן קֶסֶם',
    nameEn: 'Magic Dragon',
    nameEs: 'Dragón Mágico',
    descHe: 'דְּרָקוֹן נָדִיר שֶׁל אַלּוּפִים',
    descEn: 'Rare champion dragon avatar',
    descEs: 'Avatar raro de dragón campeón'
  },
  {
    id: 'av_ninja',
    category: 'avatars',
    icon: '🥷',
    price: 45,
    rarity: 'epic',
    nameHe: 'נִינְגָּ׳ת הַכּוֹכָבִים',
    nameEn: 'Star Ninja',
    nameEs: 'Ninja Estelar',
    descHe: 'מָהִיר כְּבָרָק בְּכָל מִשְׂחָק',
    descEn: 'Lightning fast in every game',
    descEs: 'Rápido como un rayo'
  },
  {
    id: 'av_wizard',
    category: 'avatars',
    icon: '🧙',
    price: 60,
    rarity: 'legendary',
    nameHe: 'קוֹסֵם הַיֶּדַע',
    nameEn: 'Knowledge Wizard',
    nameEs: 'Mago del Saber',
    descHe: 'קוֹסֵם אַגָּדִי שֶׁיּוֹדֵעַ הַכֹּל!',
    descEn: 'Legendary wizard of wisdom!',
    descEs: '¡Mago legendario de sabiduría!'
  },
  {
    id: 'av_crown',
    category: 'avatars',
    icon: '👑',
    price: 80,
    rarity: 'legendary',
    nameHe: 'כֶּתֶר הַגָּלַקְסְיָה',
    nameEn: 'Galaxy Royalty',
    nameEs: 'Corona Galáctica',
    descHe: 'הַכֶּתֶר הֲכִי נָדִיר בַּחֲנוּת!',
    descEn: 'The rarest royal avatar in the shop!',
    descEs: '¡El avatar más raro de la tienda!'
  },

  /* ===================== COMPANION PETS ===================== */
  {
    id: 'pet_puppy',
    category: 'pets',
    icon: '🐶',
    price: 15,
    rarity: 'common',
    nameHe: 'גּוּר כְּלָבִים שָׂמֵחַ',
    nameEn: 'Happy Puppy',
    nameEs: 'Cachorro Feliz',
    descHe: 'מְעוֹדֵד אוֹתְךָ בְּדַף הַבַּיִת!',
    descEn: 'Cheers for you on Home screen!',
    descEs: '¡Te anima en la pantalla de inicio!'
  },
  {
    id: 'pet_kitty',
    category: 'pets',
    icon: '🐱',
    price: 20,
    rarity: 'common',
    nameHe: 'חֲתַלְתּוּל חָלָל',
    nameEn: 'Space Kitty',
    nameEs: 'Gatito Espacial',
    descHe: 'חָבֵר חָמוּד שֶׁשּׁוֹמֵר עַל הַכּוֹכָבִים',
    descEn: 'Cute buddy guarding your stars',
    descEs: 'Compañero que cuida tus estrellas'
  },
  {
    id: 'pet_chick',
    category: 'pets',
    icon: '🐣',
    price: 25,
    rarity: 'rare',
    nameHe: 'אֶפְרוֹחַ זָהָב',
    nameEn: 'Golden Chick',
    nameEs: 'Pollito Dorado',
    descHe: 'אֶפְרוֹחַ מַזָּל שֶׁמֵּבִיא בְּרָכָה',
    descEn: 'Lucky golden companion chick',
    descEs: 'Pollito dorado de la suerte'
  },
  {
    id: 'pet_unicorn',
    category: 'pets',
    icon: '🦄',
    price: 40,
    rarity: 'epic',
    nameHe: 'חַד-קֶרֶן קָטָן',
    nameEn: 'Baby Unicorn',
    nameEs: 'Unicornio Bebé',
    descHe: 'מְפַזֵּר אֲבָקַת קֶסֶם וְכּוֹכָבִים!',
    descEn: 'Sprinkles magic sparkles & luck!',
    descEs: '¡Esparce magia y estrellas!'
  },
  {
    id: 'pet_dino',
    category: 'pets',
    icon: '🦖',
    price: 50,
    rarity: 'epic',
    nameHe: 'מִינִי טִי-רֶקְס',
    nameEn: 'Mini T-Rex',
    nameEs: 'Mini T-Rex',
    descHe: 'דִּינוֹזָאוּר אַמִּיץ לְהַרְפַּתְקָאוֹת!',
    descEn: 'Brave dino buddy for adventures!',
    descEs: '¡Dinosaurio valiente para aventuras!'
  },
  {
    id: 'pet_dragon',
    category: 'pets',
    icon: '🐲',
    price: 70,
    rarity: 'legendary',
    nameHe: 'דְּרָקוֹנִית אֵשׁ',
    nameEn: 'Baby Dragon',
    nameEs: 'Dragón Bebé',
    descHe: 'חַיַּת מַחְמָד אַגָּדִית שֶׁעָפָה אִתְּךָ!',
    descEn: 'Legendary flying dragon companion!',
    descEs: '¡Mascota dragón legendaria!'
  },

  /* ===================== APP THEMES / WORLDS ===================== */
  {
    id: 'theme_classic',
    category: 'themes',
    icon: '☀️',
    price: 0,
    rarity: 'common',
    bgClass: '',
    previewClass: 'from-amber-100 via-yellow-50 to-orange-100',
    nameHe: 'שֶׁמֶשׁ קְלָאסִית',
    nameEn: 'Sunny Classic',
    nameEs: 'Sol Clásico',
    descHe: 'הָעוֹלָם הַשָּׂמֵחַ הָרָגִיל',
    descEn: 'Warm classic sunny theme',
    descEs: 'Tema soleado clásico'
  },
  {
    id: 'theme_space',
    category: 'themes',
    icon: '🌌',
    price: 20,
    rarity: 'rare',
    bgClass: 'bg-gradient-to-b from-indigo-100 via-violet-50 to-sky-100',
    previewClass: 'from-indigo-400 via-purple-400 to-sky-400',
    nameHe: 'חָלָל וְכּוֹכָבִים',
    nameEn: 'Cosmic Space',
    nameEs: 'Espacio Cósmico',
    descHe: 'רֶקַע גָּלַקְסְיָה סְגַלְגַּל-כָּחֹל',
    descEn: 'Galaxy purple & starry sky look',
    descEs: 'Fondo de galaxia estrellada'
  },
  {
    id: 'theme_ocean',
    category: 'themes',
    icon: '🌊',
    price: 20,
    rarity: 'rare',
    bgClass: 'bg-gradient-to-b from-cyan-100 via-sky-50 to-teal-100',
    previewClass: 'from-cyan-400 via-sky-400 to-teal-400',
    nameHe: 'הַרְפַּתְקַת אוֹקְיָנוֹס',
    nameEn: 'Ocean Adventure',
    nameEs: 'Aventura Oceánica',
    descHe: 'רֶקַע גַּלִּים טוּרְקִיז וְרַעֲנָן',
    descEn: 'Cool turquoise ocean waves',
    descEs: 'Olas turquesa refrescantes'
  },
  {
    id: 'theme_jungle',
    category: 'themes',
    icon: '🌴',
    price: 25,
    rarity: 'rare',
    bgClass: 'bg-gradient-to-b from-emerald-100 via-lime-50 to-amber-100',
    previewClass: 'from-emerald-400 via-green-400 to-lime-400',
    nameHe: 'סָפָארִי בַּגּ׳וּנְגֶּל',
    nameEn: 'Jungle Safari',
    nameEs: 'Safari en la Selva',
    descHe: 'רֶקַע גּ׳וּנְגֶּל יָרֹק וּמְלֵא טֶבַע',
    descEn: 'Lush green safari adventure',
    descEs: 'Aventura verde en la selva'
  },
  {
    id: 'theme_candy',
    category: 'themes',
    icon: '🍭',
    price: 30,
    rarity: 'epic',
    bgClass: 'bg-gradient-to-b from-pink-100 via-fuchsia-50 to-amber-100',
    previewClass: 'from-pink-400 via-fuchsia-400 to-amber-300',
    nameHe: 'קֶשֶׁת מַמְתַּקִּים',
    nameEn: 'Candy Rainbow',
    nameEs: 'Arcoíris Dulce',
    descHe: 'צְבָעִים מְתוּקִים שֶׁל קֶשֶׁת וּסֻכָּרִיּוֹת',
    descEn: 'Sweet pastel candy rainbow',
    descEs: 'Colores dulces de arcoíris'
  },
  {
    id: 'theme_volcano',
    category: 'themes',
    icon: '🌋',
    price: 40,
    rarity: 'legendary',
    bgClass: 'bg-gradient-to-b from-orange-100 via-amber-50 to-rose-100',
    previewClass: 'from-orange-500 via-rose-500 to-amber-400',
    nameHe: 'הַר הַדְּרָקוֹנִים',
    nameEn: 'Dragon Volcano',
    nameEs: 'Volcán Dragón',
    descHe: 'עוֹלַם אֵשׁ וְזָהָב שֶׁל גִּבּוֹרִים!',
    descEn: 'Fiery gold dragon world!',
    descEs: '¡Mundo dorado de dragones!'
  },

  /* ===================== HERO TITLES / BADGES ===================== */
  {
    id: 'badge_speed',
    category: 'badges',
    icon: '⚡',
    price: 12,
    rarity: 'common',
    nameHe: 'בָּרָק מָהִיר',
    nameEn: 'Speed Star',
    nameEs: 'Rayo Veloz',
    descHe: 'תֹּאַר כָּבוֹד בְּדַף הַבַּיִת',
    descEn: 'Displayed next to your name',
    descEs: 'Título junto a tu nombre'
  },
  {
    id: 'badge_brain',
    category: 'badges',
    icon: '🧠',
    price: 25,
    rarity: 'rare',
    nameHe: 'סוּפֶּר מוֹחַ',
    nameEn: 'Super Brain',
    nameEs: 'Súper Cerebro',
    descHe: 'לְגְאוֹנִים שֶׁאוֹהֲבִים לַחְשֹׁב!',
    descEn: 'For geniuses who love to think!',
    descEs: '¡Para genios que aman pensar!'
  },
  {
    id: 'badge_astronaut',
    category: 'badges',
    icon: '🚀',
    price: 35,
    rarity: 'epic',
    nameHe: 'חוֹקֵר חָלָל',
    nameEn: 'Space Explorer',
    nameEs: 'Explorador Espacial',
    descHe: 'תֹּאַר אַסְטְרוֹנָאוּט נָדִיר',
    descEn: 'Rare astronaut explorer title',
    descEs: 'Título raro de astronauta'
  },
  {
    id: 'badge_legend',
    category: 'badges',
    icon: '🏆',
    price: 55,
    rarity: 'epic',
    nameHe: 'אַגָּדַת הַלְּמִידָה',
    nameEn: 'Learning Legend',
    nameEs: 'Leyenda del Saber',
    descHe: 'תֹּאַר גָּבֹהַּ לְאַלּוּפִים אֲמִתִּיִּים',
    descEn: 'High honor for true champions',
    descEs: 'Gran honor para campeones'
  },
  {
    id: 'badge_diamond',
    category: 'badges',
    icon: '💎',
    price: 90,
    rarity: 'legendary',
    nameHe: 'מָאסְטֶר יַהֲלוֹם',
    nameEn: 'Diamond Master',
    nameEs: 'Maestro Diamante',
    descHe: 'נָדִיר מְאֹד — רַק לְמַתְמִידִים!',
    descEn: 'Ultra-rare — for dedicated heroes!',
    descEs: '¡Súper raro, para héroes dedicados!'
  },
  {
    id: 'badge_superstar',
    category: 'badges',
    icon: '🌟',
    price: 120,
    rarity: 'legendary',
    nameHe: 'סוּפֶּר-סְטָאר עֶלְיוֹן',
    nameEn: 'Ultimate Superstar',
    nameEs: 'Súper Estrella Suprema',
    descHe: 'הַפְּרָס הֲכִי גָּדוֹל בְּכָל הָאֲפְּלִיקַצְיָה!',
    descEn: 'The ultimate prize in the entire app!',
    descEs: '¡El mayor premio de toda la app!'
  }
];

export function getShopItemById(id) {
  return SHOP_ITEMS.find((item) => item.id === id) || null;
}

export function getThemeBgClass(themeId) {
  const item = getShopItemById(themeId);
  return item?.bgClass || '';
}
