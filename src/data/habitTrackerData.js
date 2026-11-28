// Default daily habits & real-world parent prize presets (trilingual: Hebrew, English, Spanish)

export const DEFAULT_HABITS = [
  {
    id: 'hab_brush_am',
    icon: '🪥',
    stars: 2,
    titleHe: 'צִחְצוּחַ שִׁנַּיִם (בֹּקֶר)',
    titleEn: 'Brush Teeth (Morning)',
    titleEs: 'Lavarse los dientes (Mañana)'
  },
  {
    id: 'hab_brush_pm',
    icon: '✨',
    stars: 2,
    titleHe: 'צִחְצוּחַ שִׁנַּיִם (עֶרֶב)',
    titleEn: 'Brush Teeth (Night)',
    titleEs: 'Lavarse los dientes (Noche)'
  },
  {
    id: 'hab_bedtime',
    icon: '🌙',
    stars: 3,
    titleHe: 'לָלֶכֶת לִישֹׁן בַּזְּמַן',
    titleEn: 'Go to Bed on Time',
    titleEs: 'Ir a la cama a tiempo'
  },
  {
    id: 'hab_toilet',
    icon: '🚽',
    stars: 2,
    titleHe: 'שֵׁרוּתִים וּרְחִיצַת יָדַיִם',
    titleEn: 'Toilet & Wash Hands',
    titleEs: 'Ir al baño y lavar manos'
  },
  {
    id: 'hab_tidy',
    icon: '🧸',
    stars: 2,
    titleHe: 'סִדּוּר הַחֶדֶר וְהַצַּעֲצוּעִים',
    titleEn: 'Tidy Room & Toys',
    titleEs: 'Ordenar cuarto y juguetes'
  },
  {
    id: 'hab_healthy',
    icon: '🥗',
    stars: 2,
    titleHe: 'אֹכֶל בָּרִיא וּשְׁתִיַּת מַיִם',
    titleEn: 'Healthy Meal & Water',
    titleEs: 'Comida sana y agua'
  },
  {
    id: 'hab_kind',
    icon: '💛',
    stars: 2,
    titleHe: 'עֶזְרָה וְהִתְנַהֲגוּת טוֹבָה',
    titleEn: 'Kindness & Helping',
    titleEs: 'Amabilidad y ayudar'
  }
];

export const PRIZE_PRESETS = [
  {
    id: 'dad_out',
    icon: '🍦',
    titleHe: 'יְצִיאָה כֵּיפִית עִם אַבָּא',
    titleEn: 'Special Outing with Dad',
    titleEs: 'Salida especial con Papá'
  },
  {
    id: 'mom_out',
    icon: '🎨',
    titleHe: 'זְמַן אֵיכוּת עִם אִמָּא',
    titleEn: 'Special Date with Mom',
    titleEs: 'Salida especial con Mamá'
  },
  {
    id: 'present',
    icon: '🎁',
    titleHe: 'מַתָּנָה שֶׁבָּחַרְנוּ יַחַד',
    titleEn: 'Chosen Present / Toy',
    titleEs: 'Regalo elegido juntos'
  },
  {
    id: 'movie',
    icon: '🎬',
    titleHe: 'עֶרֶב סֶרֶט וּפּוֹפְּקוֹרְן',
    titleEn: 'Movie & Popcorn Night',
    titleEs: 'Noche de película y palomitas'
  },
  {
    id: 'park',
    icon: '🎡',
    titleHe: 'פַּארְק / גַּן חַיּוֹת',
    titleEn: 'Park or Zoo Trip',
    titleEs: 'Paseo al parque o zoológico'
  }
];

export const CUSTOM_HABIT_ICONS = ['🪥', '🌙', '🚽', '🧸', '📚', '🥗', '🚿', '🎒', '👟', '💛', '🐶', '🎹'];
export const CUSTOM_PRIZE_ICONS = ['🎁', '🍦', '🎬', '🎡', '🍕', '⚽', '🧸', '🚴', '🎨', '🏆'];
