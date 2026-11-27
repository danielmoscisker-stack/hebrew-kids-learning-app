// Curriculum-aligned problem generator for Israel Math Arena (Grades 1-2 / Age 7 & Grades 3-4 / Age 9)
// Supports Hebrew (with nikud), English, and Spanish, with Israeli school mental-math tricks.

const randInt = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;
const pick = (arr) => arr[Math.floor(Math.random() * arr.length)];
const shuffle = (arr) => {
  const copy = [...arr];
  for (let i = copy.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
};

/** Generate 4 unique numeric choices including the exact answer */
function makeNumericChoices(answer, extras = [], { minVal = 0, maxStep = 8 } = {}) {
  const set = new Set([answer]);
  for (const val of extras) {
    if (Number.isInteger(val) && val >= minVal && val !== answer && set.size < 4) {
      set.add(val);
    }
  }
  let guard = 0;
  while (set.size < 4 && guard < 80) {
    guard += 1;
    const offset = randInt(1, maxStep) * (Math.random() < 0.5 ? 1 : -1);
    const candidate = answer + offset;
    if (candidate >= minVal && candidate !== answer) {
      set.add(candidate);
    }
  }
  let fallback = answer + 1;
  while (set.size < 4) {
    set.add(fallback);
    fallback += 1;
  }
  return shuffle([...set]).map(String);
}

/** Generate 4 unique fraction choices with same or related denominator */
function makeFractionChoices(num, denom, extras = []) {
  const canonical = `${num}/${denom}`;
  const set = new Set([canonical]);
  for (const frac of extras) {
    if (frac && frac !== canonical && set.size < 4) {
      set.add(frac);
    }
  }
  let guard = 0;
  while (set.size < 4 && guard < 60) {
    guard += 1;
    const candNum = randInt(1, Math.max(2, denom));
    const frac = `${candNum}/${denom}`;
    if (frac !== canonical) set.add(frac);
  }
  let altD = denom + 1;
  while (set.size < 4) {
    set.add(`${num}/${altD}`);
    altD += 1;
  }
  return shuffle([...set]);
}

export const AGE_TOPICS = {
  '7': [
    { id: 'mix', icon: '🎲', labelHe: 'מִיקְס מָהִיר', labelEn: 'Quick Mix', labelEs: 'Mezcla rápida' },
    { id: 'add_sub', icon: '➕', labelHe: 'חִבּוּר וְחִסּוּר עַד 100', labelEn: 'Add & Sub 20/100', labelEs: 'Sumas y restas 20/100' },
    { id: 'missing', icon: '🧩', labelHe: 'מִסְפָּר חָסֵר', labelEn: 'Missing Numbers', labelEs: 'Número faltante' },
    { id: 'mult_starter', icon: '✖️', labelHe: 'כֶּפֶל רִאשׁוֹן', labelEn: 'Starter ×2/3/4/5/10', labelEs: 'Tablas ×2/3/4/5/10' },
    { id: 'compare', icon: '⚖️', labelHe: 'הַשְׁוָאָה < = >', labelEn: 'Compare < = >', labelEs: 'Comparar < = >' },
    { id: 'word_ils', icon: '🪙', labelHe: 'בְּעָיוֹת בִּשְׁקָלִים ₪', labelEn: 'Shekel Stories ₪', labelEs: 'Problemas en ₪' }
  ],
  '9': [
    { id: 'mix', icon: '🚀', labelHe: 'מִיקְס מָהִיר', labelEn: 'Quick Mix', labelEs: 'Mezcla rápida' },
    { id: 'times_div', icon: '⚡', labelHe: 'לוּחַ הַכֶּפֶל וְחִלּוּק', labelEn: 'Times & Division', labelEs: 'Tablas y división' },
    { id: 'mental_1000', icon: '🧠', labelHe: 'חִבּוּר וְחִסּוּר עַד 1,000', labelEn: 'Mental to 1,000', labelEs: 'Cálculo hasta 1,000' },
    { id: 'order_ops', icon: '🎯', labelHe: 'סֵדֶר פְּעֻלּוֹת', labelEn: 'Order of Ops', labelEs: 'Orden de operaciones' },
    { id: 'fractions', icon: '🍕', labelHe: 'שְׁבָרִים פְּשׁוּטִים', labelEn: 'Fractions', labelEs: 'Fracciones' },
    { id: 'word_perimeter', icon: '📐', labelHe: 'עֹדֶף ₪ וְהֶקֵּף', labelEn: '₪ Change & Perimeter', labelEs: 'Cambio ₪ y Perímetro' }
  ]
};

const GROUP_EMOJIS = ['🍎', '⭐', '⚽', '🧁', '🎈', '🍓', '🦋', '🚗'];

/* ===================== AGE 7 (GRADES 1-2 / כיתה א׳–ב׳) ===================== */

function genAge7AddSub() {
  const mode = randInt(1, 4);

  // Mode 1: Bridging 10 addition within 20 (Make-10 trick!)
  if (mode === 1) {
    const a = randInt(6, 9);
    const bridge = 10 - a;
    const b = randInt(bridge + 1, 9);
    const ans = a + b;
    const rem = b - bridge;
    return {
      age: '7',
      topic: 'add_sub',
      answerType: 'number',
      answer: String(ans),
      choices: makeNumericChoices(ans, [ans - 1, ans + 1, ans - 2, 10 + b], { minVal: 10, maxStep: 4 }),
      equation: `${a} + ${b} = ?`,
      story: null,
      prompt: {
        he: 'פִּתְרוּ בְּעֶזְרַת הַשְׁלָמָה לְ-10:',
        en: 'Solve using Make-10:',
        es: 'Resuelve completando a 10:'
      },
      hint: {
        he: `טְרִיק הַשְׁלָמָה לְעֶשֶׂר: קֹדֶם מַשְׁלִימִים מִ-${a} לְ-10 (+${bridge}), וְאָז מוֹסִיפִים אֶת הַ-${rem} שֶׁנִּשְׁאֲרוּ!`,
        en: `Make-10 trick: first bridge ${a} up to 10 (+${bridge}), then add the remaining ${rem}!`,
        es: `Truco del 10: primero lleva ${a} hasta 10 (+${bridge}) y luego suma los ${rem} restantes.`
      },
      hintMath: `${a} + ${bridge} = 10  →  10 + ${rem} = ${ans}`,
      unit: null,
      visual: { type: 'make10', op: '+', a, b, bridge, rem, targetTen: 10 }
    };
  }

  // Mode 2: Bridging 10 subtraction within 20 (Down to 10 trick!)
  if (mode === 2) {
    const a = randInt(11, 18);
    const ones = a - 10;
    const b = randInt(ones + 1, 9);
    const ans = a - b;
    const rem = b - ones;
    return {
      age: '7',
      topic: 'add_sub',
      answerType: 'number',
      answer: String(ans),
      choices: makeNumericChoices(ans, [ans + 1, ans - 1, ans + 2, 10 - ones], { minVal: 1, maxStep: 4 }),
      equation: `${a} − ${b} = ?`,
      story: null,
      prompt: {
        he: 'חַסְּרוּ דֶּרֶךְ הָעֶשֶׂר:',
        en: 'Subtract down through 10:',
        es: 'Resta pasando por el 10:'
      },
      hint: {
        he: `טְרִיק הַיְּרִידָה לְ-10: קֹדֶם מוֹרִידִים ${ones} כְּדֵי לְהַגִּיעַ לְ-10, וְאָז עוֹד ${rem}!`,
        en: `Down-to-10 trick: first subtract ${ones} to reach 10, then subtract the remaining ${rem}!`,
        es: `Truco bajar a 10: primero resta ${ones} para llegar a 10, y luego resta los ${rem} que quedan.`
      },
      hintMath: `${a} − ${ones} = 10  →  10 − ${rem} = ${ans}`,
      unit: null,
      visual: { type: 'make10', op: '−', a, b, bridge: ones, rem, targetTen: 10 }
    };
  }

  // Mode 3: 2-digit addition to 100 (bridging next ten OR adding tens)
  if (mode === 3) {
    if (Math.random() < 0.5) {
      const tens = randInt(2, 7) * 10;
      const ones = randInt(6, 9);
      const a = tens + ones;
      const bridge = 10 - ones;
      const b = randInt(bridge + 1, 9);
      const nextTen = tens + 10;
      const rem = b - bridge;
      const ans = a + b;
      return {
        age: '7',
        topic: 'add_sub',
        answerType: 'number',
        answer: String(ans),
        choices: makeNumericChoices(ans, [ans - 10, ans + 10, ans - 1, ans + 1], { minVal: 10, maxStep: 6 }),
        equation: `${a} + ${b} = ?`,
        story: null,
        prompt: {
          he: 'הַשְׁלִימוּ לָעֶשֶׂרֶת הַקְּרוֹבָה:',
          en: 'Bridge to the next ten:',
          es: 'Completa a la siguiente decena:'
        },
        hint: {
          he: `מַשְׁלִימִים מִ-${a} לְ-${nextTen} (+${bridge}), וּמוֹסִיפִים עוֹד ${rem}!`,
          en: `Jump from ${a} to ${nextTen} (+${bridge}), then add ${rem} more!`,
          es: `Salta de ${a} a ${nextTen} (+${bridge}) y suma ${rem} más.`
        },
        hintMath: `${a} + ${bridge} = ${nextTen}  →  ${nextTen} + ${rem} = ${ans}`,
        unit: null,
        visual: { type: 'make10', op: '+', a, b, bridge, rem, targetTen: nextTen }
      };
    }
    const a = randInt(14, 65);
    const tensAdd = randInt(1, 3) * 10;
    const onesAdd = randInt(0, 9 - (a % 10));
    const b = tensAdd + onesAdd;
    const ans = a + b;
    return {
      age: '7',
      topic: 'add_sub',
      answerType: 'number',
      answer: String(ans),
      choices: makeNumericChoices(ans, [ans - 10, ans + 10, ans + 2, ans - 2], { minVal: 10, maxStep: 8 }),
      equation: `${a} + ${b} = ?`,
      story: null,
      prompt: {
        he: 'חַבְּרוּ עֲשָׂרוֹת וַאֲחָדוֹת:',
        en: 'Add tens and ones:',
        es: 'Suma decenas y unidades:'
      },
      hint: {
        he: `מְפָרְקִים אֶת ${b} לַעֲשָׂרוֹת (${tensAdd}) וַאֲחָדוֹת (${onesAdd}) וּמְחַבְּרִים בִּשְׁלַבִּים!`,
        en: `Split ${b} into tens (${tensAdd}) and ones (${onesAdd}) and add step by step!`,
        es: `Divide ${b} en decenas (${tensAdd}) y unidades (${onesAdd}) y suma paso a paso.`
      },
      hintMath: onesAdd > 0 ? `${a} + ${tensAdd} = ${a + tensAdd}  →  ${a + tensAdd} + ${onesAdd} = ${ans}` : `${a} + ${tensAdd} = ${ans}`,
      unit: null,
      visual: null
    };
  }

  // Mode 4: 2-digit subtraction to 100
  const tens = randInt(3, 8) * 10;
  const ones = randInt(1, 5);
  const a = tens + ones;
  const b = randInt(ones + 1, 9);
  const rem = b - ones;
  const ans = a - b;
  return {
    age: '7',
    topic: 'add_sub',
    answerType: 'number',
    answer: String(ans),
    choices: makeNumericChoices(ans, [ans + 10, ans - 1, ans + 1, ans + 2], { minVal: 5, maxStep: 6 }),
    equation: `${a} − ${b} = ?`,
    story: null,
    prompt: {
      he: 'חַסְּרוּ דֶּרֶךְ הָעֶשֶׂרֶת הָעֲגֻלָּה:',
      en: 'Subtract down through the round ten:',
      es: 'Resta pasando por la decena exacta:'
    },
    hint: {
      he: `קֹדֶם יוֹרְדִים מִ-${a} לְ-${tens} (−${ones}), וְאָז מוֹרִידִים עוֹד ${rem}!`,
      en: `First drop from ${a} to ${tens} (−${ones}), then subtract ${rem} more!`,
      es: `Primero baja de ${a} a ${tens} (−${ones}) y luego resta ${rem} más.`
    },
    hintMath: `${a} − ${ones} = ${tens}  →  ${tens} − ${rem} = ${ans}`,
    unit: null,
    visual: { type: 'make10', op: '−', a, b, bridge: ones, rem, targetTen: tens }
  };
}

function genAge7Missing() {
  const variant = randInt(1, 4);

  if (variant === 1) {
    // a + □ = c (within 20)
    const a = randInt(4, 11);
    const ans = randInt(3, 9);
    const c = a + ans;
    return {
      age: '7',
      topic: 'missing',
      answerType: 'number',
      answer: String(ans),
      choices: makeNumericChoices(ans, [ans + 1, ans - 1, c - ans, a], { minVal: 1, maxStep: 4 }),
      equation: `${a} + □ = ${c}`,
      story: null,
      prompt: {
        he: 'אֵיזֶה מִסְפָּר מִסְתַּתֵּר בָּרִבּוּעַ?',
        en: 'Which number hides in the box?',
        es: '¿Qué número se esconde en el cuadro?'
      },
      hint: {
        he: `כְּדֵי לִמְצֹא מִסְפָּר חָסֵר בְּחִבּוּר, עוֹשִׂים חִסּוּר הָפוּךְ מִ-${c}!`,
        en: `To find a missing addend, subtract ${a} from ${c}!`,
        es: `Para hallar el sumando que falta, ¡resta ${a} de ${c}!`
      },
      hintMath: `${c} − ${a} = ${ans}`,
      unit: null,
      visual: null
    };
  }

  if (variant === 2) {
    // □ + b = c (clean tens to 100)
    const b = randInt(2, 5) * 10;
    const ans = randInt(2, 5) * 10;
    const c = ans + b;
    return {
      age: '7',
      topic: 'missing',
      answerType: 'number',
      answer: String(ans),
      choices: makeNumericChoices(ans, [ans + 10, ans - 10, ans + 20, b], { minVal: 10, maxStep: 20 }),
      equation: `□ + ${b} = ${c}`,
      story: null,
      prompt: {
        he: 'מִצְאוּ אֶת הָעֶשֶׂרֶת הַחֲסֵרָה:',
        en: 'Find the missing ten:',
        es: 'Encuentra la decena que falta:'
      },
      hint: {
        he: `חִשְׁבוּ בַּעֲשָׂרוֹת: כַּמָּה עֲשָׂרוֹת צָרִיךְ לְהוֹסִיף לְ-${b} כְּדֵי לְהַגִּיעַ לְ-${c}?`,
        en: `Think in tens: how many tens from ${b} up to ${c}?`,
        es: `Piensa en decenas: ¿cuánto falta de ${b} para llegar a ${c}?`
      },
      hintMath: `${c} − ${b} = ${ans}`,
      unit: null,
      visual: null
    };
  }

  if (variant === 3) {
    // c - □ = b
    const b = randInt(4, 11);
    const ans = randInt(3, 9);
    const c = b + ans;
    return {
      age: '7',
      topic: 'missing',
      answerType: 'number',
      answer: String(ans),
      choices: makeNumericChoices(ans, [ans + 1, ans - 1, ans + 2, c + b], { minVal: 1, maxStep: 4 }),
      equation: `${c} − □ = ${b}`,
      story: null,
      prompt: {
        he: 'כַּמָּה הוֹרַדְנוּ מִן הַמִּסְפָּר?',
        en: 'How much was taken away?',
        es: '¿Cuánto se restó?'
      },
      hint: {
        he: `בּוֹדְקִים אֶת הַהֶפְרֵשׁ בֵּין ${c} לְ-${b}!`,
        en: `Find the difference between ${c} and ${b}!`,
        es: `Calcula la diferencia entre ${c} y ${b}.`
      },
      hintMath: `${c} − ${b} = ${ans}`,
      unit: null,
      visual: null
    };
  }

  // □ - b = a
  const a = randInt(5, 12);
  const b = randInt(3, 8);
  const ans = a + b;
  return {
    age: '7',
    topic: 'missing',
    answerType: 'number',
    answer: String(ans),
    choices: makeNumericChoices(ans, [Math.abs(a - b), ans + 1, ans - 1, ans + 2], { minVal: 4, maxStep: 5 }),
    equation: `□ − ${b} = ${a}`,
    story: null,
    prompt: {
      he: 'מֵאֵיזֶה מִסְפָּר הִתְחַלְנוּ?',
      en: 'What number did we start with?',
      es: '¿Con qué número empezamos?'
    },
    hint: {
      he: `כְּשֶׁהַמִּסְפָּר הָרִאשׁוֹן בְּחִסּוּר חָסֵר — מְחַבְּרִים אֶת שְׁנֵי הַמִּסְפָּרִים!`,
      en: `When the first number in subtraction is missing, add the two numbers back together!`,
      es: `Cuando falta el primer número de una resta, ¡suma los dos números!`
    },
    hintMath: `${a} + ${b} = ${ans}`,
    unit: null,
    visual: null
  };
}

function genAge7MultStarter() {
  const factor = pick([2, 3, 4, 5, 10]);
  const other = factor === 10 ? randInt(2, 9) : randInt(2, 8);
  // Keep visual groups compact: show fewer groups (2..5) when possible, or clean ten-rods for ×10
  const groups = factor === 10 ? other : factor;
  const perGroup = factor === 10 ? 10 : other;
  const ans = groups * perGroup;
  const emoji = pick(GROUP_EMOJIS);

  // Build skip-counting sequence for hint
  const steps = Array.from({ length: Math.min(groups, 6) }, (_, i) => (i + 1) * perGroup);
  const skipSeq = groups > 6 ? `${steps.join(', ')}, ... → ${ans}` : steps.join(', ');

  let trickHe = `סוֹפְרִים בִּקְפִיצוֹת שֶׁל ${perGroup} (${groups} פְּעָמִים):`;
  let trickEn = `Skip-count by ${perGroup}s (${groups} times):`;
  let trickEs = `Cuenta de ${perGroup} en ${perGroup} (${groups} veces):`;

  if (perGroup === 10) {
    trickHe = `טְרִיק ×10: כְּשֶׁכּוֹפְלִים בְּ-10, פָּשׁוּט מוֹסִיפִים 0 בַּסּוֹף!`;
    trickEn = `×10 trick: multiply by 10 by placing a 0 at the end!`;
    trickEs = `Truco ×10: ¡al multiplicar por 10, solo añade un 0 al final!`;
  } else if (groups === 2) {
    trickHe = `טְרִיק ×2: כָּפוּל 2 זֶה פָּשׁוּט לְחַבֵּר אֶת הַמִּסְפָּר עִם עַצְמוֹ!`;
    trickEn = `×2 trick: multiplying by 2 is just doubling the number!`;
    trickEs = `Truco ×2: ¡multiplicar por 2 es sumar el número consigo mismo!`;
  } else if (groups === 4) {
    trickHe = `טְרִיק ×4: מַכְפִּילִים פַּעֲמַיִם בְּ-2 (כָּפוּל 2 וְשׁוּב כָּפוּל 2)!`;
    trickEn = `×4 trick: double ${perGroup} once (${perGroup * 2}), then double again!`;
    trickEs = `Truco ×4: duplica ${perGroup} (${perGroup * 2}) y vuelve a duplicar.`;
  }

  return {
    age: '7',
    topic: 'mult_starter',
    answerType: 'number',
    answer: String(ans),
    choices: makeNumericChoices(ans, [ans + perGroup, Math.max(2, ans - perGroup), groups + perGroup, ans + 2], {
      minVal: 2,
      maxStep: Math.max(4, perGroup)
    }),
    equation: `${groups} × ${perGroup} = ?`,
    story: null,
    prompt: {
      he: `${groups} קְבוּצוֹת שֶׁל ${perGroup} — כַּמָּה יֵשׁ יַחַד?`,
      en: `${groups} groups of ${perGroup} — how many in total?`,
      es: `${groups} grupos de ${perGroup} — ¿cuántos hay en total?`
    },
    hint: { he: trickHe, en: trickEn, es: trickEs },
    hintMath:
      groups === 2
        ? `${perGroup} + ${perGroup} = ${ans}`
        : groups === 4
          ? `${perGroup} × 2 = ${perGroup * 2}  →  ${perGroup * 2} + ${perGroup * 2} = ${ans}`
          : skipSeq,
    unit: null,
    visual: { type: 'groups', groups, perGroup, emoji }
  };
}

function genAge7Compare() {
  const targetRel = pick(['<', '=', '>']);
  let leftExpr = '';
  let rightExpr = '';
  let leftVal = 0;
  let rightVal = 0;

  const variant = randInt(1, 3);
  if (variant === 1) {
    // Expression vs Number
    const a = randInt(6, 15);
    const b = randInt(3, 9);
    leftVal = a + b;
    leftExpr = `${a} + ${b}`;
    if (targetRel === '=') rightVal = leftVal;
    else if (targetRel === '<') rightVal = leftVal + randInt(1, 5);
    else rightVal = Math.max(2, leftVal - randInt(1, 5));
    rightExpr = String(rightVal);
  } else if (variant === 2) {
    // Add vs Sub (or Add vs Add)
    const a = randInt(12, 24);
    const b = randInt(3, 8);
    leftVal = a - b;
    leftExpr = `${a} − ${b}`;
    const c = randInt(4, Math.max(5, leftVal - 2));
    if (targetRel === '=') {
      const d = leftVal - c;
      rightVal = c + d;
      rightExpr = `${c} + ${d}`;
    } else if (targetRel === '<') {
      const d = leftVal - c + randInt(1, 4);
      rightVal = c + d;
      rightExpr = `${c} + ${d}`;
    } else {
      const d = Math.max(1, leftVal - c - randInt(1, 3));
      rightVal = c + d;
      rightExpr = `${c} + ${d}`;
    }
  } else {
    // Starter multiplication vs number
    const f = pick([2, 3, 5, 10]);
    const n = randInt(2, 6);
    leftVal = f * n;
    leftExpr = `${f} × ${n}`;
    if (targetRel === '=') rightVal = leftVal;
    else if (targetRel === '<') rightVal = leftVal + randInt(2, 6);
    else rightVal = Math.max(2, leftVal - randInt(2, 6));
    rightExpr = String(rightVal);
  }

  const answer = leftVal < rightVal ? '<' : leftVal > rightVal ? '>' : '=';

  return {
    age: '7',
    topic: 'compare',
    answerType: 'compare',
    answer,
    choices: ['<', '=', '>'],
    equation: `${leftExpr}   ◯   ${rightExpr}`,
    story: null,
    prompt: {
      he: 'בַּחֲרוּ אֶת הַסִּימָן הַנָּכוֹן בֵּין שְׁנֵי הַצְּדָדִים (< , = , >):',
      en: 'Pick the right symbol between both sides (< , = , >):',
      es: 'Elige el símbolo correcto entre ambos lados (< , = , >):'
    },
    hint: {
      he: 'מְחַשְּׁבִים קֹדֶם כָּל צַד בְּנִפְרָד, וְאָז הַפֶּה הַפָּתוּחַ שֶׁל הַתַּנִּין פּוֹנֶה לַמִּסְפָּר הַגָּדוֹל יוֹתֵר!',
      en: 'Compute each side first — the open alligator mouth always faces the bigger number!',
      es: 'Calcula cada lado primero: ¡la boca abierta siempre apunta al número mayor!'
    },
    hintMath: `${leftVal}  ${answer}  ${rightVal}`,
    unit: null,
    visual: null
  };
}

function genAge7WordIls() {
  const templates = [
    () => {
      const p1 = randInt(6, 14);
      const p2 = randInt(4, 12);
      const ans = p1 + p2;
      return {
        story: {
          he: `נוֹעָה קָנְתָה גְּלִידָה בְּ-${p1} ₪ וְאַרְטִיק בְּ-${p2} ₪. כַּמָּה שְׁקָלִים הִיא שִׁלְּמָה בְּסַךְ הַכֹּל? 🍦`,
          en: `Noa bought an ice cream for ${p1} ₪ and a popsicle for ${p2} ₪. How many shekels did she pay in total? 🍦`,
          es: `Noa compró un helado por ${p1} ₪ y una paleta por ${p2} ₪. ¿Cuántos shékels pagó en total? 🍦`
        },
        ans,
        hint: {
          he: 'כְּדֵי לָדַעַת כַּמָּה שִׁלְּמָה בְּסַךְ הַכֹּל — מְחַבְּרִים אֶת שְׁנֵי הַמְּחִירִים!',
          en: 'To find the total cost, add both prices together!',
          es: 'Para saber el total, ¡suma ambos precios!'
        },
        hintMath: `${p1} + ${p2} = ${ans} ₪`
      };
    },
    () => {
      const bill = pick([20, 30, 50]);
      const price = randInt(7, bill - 5);
      const ans = bill - price;
      return {
        story: {
          he: `לְיוֹנָתָן יֵשׁ ${bill} ₪. הוּא קָנָה פִּיתָה עִם פָּלָאפֶל בְּ-${price} ₪. כַּמָּה עֹדֶף נִשְׁאַר לוֹ? 🧆`,
          en: `Yonatan has ${bill} ₪. He bought a falafel pita for ${price} ₪. How much change does he have left? 🧆`,
          es: `Yonatan tiene ${bill} ₪. Compró un falafel por ${price} ₪. ¿Cuánto cambio le queda? 🧆`
        },
        ans,
        hint: {
          he: 'עֹדֶף מוֹצְאִים בְּחִסּוּר: מַתְחִילִים מֵהַכֶּסֶף שֶׁהָיָה וּמוֹרִידִים אֶת הַמְּחִיר!',
          en: 'Find change by subtracting the price from the money he started with!',
          es: 'Para calcular el cambio, ¡resta el precio del dinero inicial!'
        },
        hintMath: `${bill} − ${price} = ${ans} ₪`
      };
    },
    () => {
      const qty = randInt(2, 5);
      const price = pick([3, 4, 5, 10]);
      const ans = qty * price;
      return {
        story: {
          he: `מָאיָה קָנְתָה ${qty} חֲבִילוֹת מַדְבֵּקוֹת. כָּל חֲבִילָה עוֹלָה ${price} ₪. כַּמָּה הִיא שִׁלְּמָה? ✨`,
          en: `Maya bought ${qty} sticker packs. Each pack costs ${price} ₪. How much did she pay? ✨`,
          es: `Maya compró ${qty} paquetes de pegatinas. Cada uno cuesta ${price} ₪. ¿Cuánto pagó? ✨`
        },
        ans,
        hint: {
          he: `${qty} פְּעָמִים ${price} שְׁקָלִים — מְחַבְּרִים בִּקְפִיצוֹת אוֹ כּוֹפְלִים!`,
          en: `${qty} times ${price} shekels — multiply or skip-count!`,
          es: `${qty} veces ${price} shékels — ¡multiplica o cuenta de ${price} en ${price}!`
        },
        hintMath: `${qty} × ${price} = ${ans} ₪`
      };
    },
    () => {
      const start = randInt(15, 45);
      const gift = pick([10, 15, 20]);
      const ans = start + gift;
      return {
        story: {
          he: `בַּקֻּפָּה שֶׁל עֹמֶר הָיוּ ${start} ₪. סָבְתָא נָתְנָה לוֹ עוֹד ${gift} ₪ דְּמֵי כִּיס. כַּמָּה יֵשׁ לוֹ עַכְשָׁו? 🏦`,
          en: `Omer had ${start} ₪ in his piggy bank. Grandma gave him ${gift} ₪ more. How much does he have now? 🏦`,
          es: `Omer tenía ${start} ₪ en su alcancía. Su abuela le dio ${gift} ₪ más. ¿Cuánto tiene ahora? 🏦`
        },
        ans,
        hint: {
          he: 'הוּא קִבֵּל עוֹד כֶּסֶף — לָכֵן מְחַבְּרִים!',
          en: 'He received more money, so we add!',
          es: 'Recibió más dinero, ¡así que sumamos!'
        },
        hintMath: `${start} + ${gift} = ${ans} ₪`
      };
    },
    () => {
      const total = randInt(24, 48);
      const spent = randInt(8, 19);
      const ans = total - spent;
      return {
        story: {
          he: `תָּמָר חָסְכָה ${total} ₪ וְקָנְתָה כַּדּוּר צִבְעוֹנִי בְּ-${spent} ₪. כַּמָּה שְׁקָלִים נִשְׁאֲרוּ לָהּ? ⚽`,
          en: `Tamar saved ${total} ₪ and bought a colorful ball for ${spent} ₪. How many shekels are left? ⚽`,
          es: `Tamar ahorró ${total} ₪ y compró una pelota por ${spent} ₪. ¿Cuántos shékels le quedan? ⚽`
        },
        ans,
        hint: {
          he: 'כַּמָּה נִשְׁאַר = חִסּוּר! מוֹרִידִים אֶת מְחִיר הַכַּדּוּר מֵהַחִסָּכוֹן.',
          en: '"How much is left" means subtraction — subtract the ball price from her savings!',
          es: '"Cuánto queda" significa resta: resta el precio de la pelota a sus ahorros.'
        },
        hintMath: `${total} − ${spent} = ${ans} ₪`
      };
    }
  ];

  const t = pick(templates)();
  return {
    age: '7',
    topic: 'word_ils',
    answerType: 'number',
    answer: String(t.ans),
    choices: makeNumericChoices(t.ans, [t.ans + 10, Math.max(1, t.ans - 10), t.ans + 2, Math.max(1, t.ans - 2)], {
      minVal: 1,
      maxStep: 7
    }),
    equation: null,
    story: t.story,
    prompt: null,
    hint: t.hint,
    hintMath: t.hintMath,
    unit: { he: '₪', en: '₪', es: '₪' },
    visual: null
  };
}

/* ===================== AGE 9 (GRADES 3-4 / כיתה ג׳–ד׳) ===================== */

function genAge9TimesDiv() {
  const isDiv = Math.random() < 0.45;
  const hardPool = [6, 7, 8, 9];
  const a = Math.random() < 0.7 ? pick(hardPool) : randInt(3, 10);
  const b = randInt(3, 10);
  const prod = a * b;

  if (!isDiv) {
    let hintHe = `טְרִיק פֵּרוּק: מְפָרְקִים אֶת ${a} לְ-5 וְ-${a - 5}, וּמְחַבְּרִים!`;
    let hintEn = `Split trick: split ${a} into 5 + ${a - 5}, multiply each by ${b}, and add!`;
    let hintEs = `Truco de dividir: separa ${a} en 5 + ${a - 5}, multiplica cada uno por ${b} y suma.`;
    let hintMath =
      a > 5
        ? `5 × ${b} = ${5 * b},  ${a - 5} × ${b} = ${(a - 5) * b}  →  ${5 * b} + ${(a - 5) * b} = ${prod}`
        : `${a} × ${b} = ${prod}`;

    if (a === 9 || b === 9) {
      const other = a === 9 ? b : a;
      hintHe = `טְרִיק כֶּפֶל בְּ-9: כּוֹפְלִים בְּ-10 וּמוֹרִידִים פַּעַם אַחַת אֶת ${other}!`;
      hintEn = `×9 trick: multiply ${other} by 10 (${other * 10}), then subtract ${other} once!`;
      hintEs = `Truco ×9: multiplica ${other} por 10 (${other * 10}) y resta ${other} una vez.`;
      hintMath = `10 × ${other} = ${10 * other}  →  ${10 * other} − ${other} = ${prod}`;
    } else if (a === 10 || b === 10) {
      const other = a === 10 ? b : a;
      hintHe = `טְרִיק ×10: מוֹסִיפִים 0 מִיָּמִין לַ-${other}!`;
      hintEn = `×10 trick: add a 0 after ${other}!`;
      hintEs = `Truco ×10: ¡añade un 0 después del ${other}!`;
      hintMath = `${other} × 10 = ${prod}`;
    }

    return {
      age: '9',
      topic: 'times_div',
      answerType: 'number',
      answer: String(prod),
      choices: makeNumericChoices(prod, [prod + a, Math.max(2, prod - a), prod + b, Math.max(2, prod - b)], {
        minVal: 6,
        maxStep: 12
      }),
      equation: `${a} × ${b} = ?`,
      story: null,
      prompt: {
        he: 'לוּחַ הַכֶּפֶל — מָה הַמַּכְפֵּלָה?',
        en: 'Times Tables — what is the product?',
        es: 'Tablas de multiplicar — ¿cuál es el producto?'
      },
      hint: { he: hintHe, en: hintEn, es: hintEs },
      hintMath,
      unit: null,
      visual: null
    };
  }

  return {
    age: '9',
    topic: 'times_div',
    answerType: 'number',
    answer: String(b),
    choices: makeNumericChoices(b, [b + 1, Math.max(1, b - 1), b + 2, a], { minVal: 2, maxStep: 4 }),
    equation: `${prod} ÷ ${a} = ?`,
    story: null,
    prompt: {
      he: 'חִלּוּק מָהִיר עַד 100:',
      en: 'Quick Division up to 100:',
      es: 'División rápida hasta 100:'
    },
    hint: {
      he: `טְרִיק חִלּוּק: הוֹפְכִים לְכֶפֶל! שׁוֹאֲלִים: אֵיזֶה מִסְפָּר כָּפוּל ${a} נוֹתֵן ${prod}?`,
      en: `Division trick: turn it into multiplication! What number × ${a} equals ${prod}?`,
      es: `Truco de división: ¡conviértela en multiplicación! ¿Qué número × ${a} da ${prod}?`
    },
    hintMath: `? × ${a} = ${prod}  →  ${b} × ${a} = ${prod}`,
    unit: null,
    visual: null
  };
}

function genAge9Mental1000() {
  const variant = randInt(1, 3);

  // Variant 1: Compensation trick (+199 / +298 / -199)
  if (variant === 1) {
    const isAdd = Math.random() < 0.6;
    const roundH = pick([100, 200, 300]);
    const diff = pick([1, 2]);
    const b = roundH - diff;
    if (isAdd) {
      const a = randInt(125, 650);
      const ans = a + b;
      return {
        age: '9',
        topic: 'mental_1000',
        answerType: 'number',
        answer: String(ans),
        choices: makeNumericChoices(ans, [ans + 1, ans - 1, ans + diff * 2, ans - 10], { minVal: 100, maxStep: 15 }),
        equation: `${a} + ${b} = ?`,
        story: null,
        prompt: {
          he: 'חִשּׁוּב בְּעַל-פֶּה עִם טְרִיק הָעִגּוּל:',
          en: 'Mental Math with Rounding Trick:',
          es: 'Cálculo mental con truco de redondeo:'
        },
        hint: {
          he: `טְרִיק עִגּוּל לְמֵאוֹת: מוֹסִיפִים ${roundH} שָׁלֵם, וְאָז מוֹרִידִים ${diff}!`,
          en: `Rounding trick: add a clean ${roundH}, then subtract ${diff}!`,
          es: `Truco de redondeo: suma ${roundH} exactos y luego resta ${diff}.`
        },
        hintMath: `${a} + ${roundH} = ${a + roundH}  →  ${a + roundH} − ${diff} = ${ans}`,
        unit: null,
        visual: null
      };
    }
    const a = randInt(roundH + 120, 950);
    const ans = a - b;
    return {
      age: '9',
      topic: 'mental_1000',
      answerType: 'number',
      answer: String(ans),
      choices: makeNumericChoices(ans, [ans - diff * 2, ans + 10, ans - 10, ans + 1], { minVal: 50, maxStep: 15 }),
      equation: `${a} − ${b} = ?`,
      story: null,
      prompt: {
        he: 'חִסּוּר בְּעַל-פֶּה עַד 1,000:',
        en: 'Mental Subtraction to 1,000:',
        es: 'Resta mental hasta 1,000:'
      },
      hint: {
        he: `טְרִיק עִגּוּל: מוֹרִידִים ${roundH} שָׁלֵם, וּמַחְזִירִים ${diff}!`,
        en: `Rounding trick: subtract a clean ${roundH}, then add back ${diff}!`,
        es: `Truco de redondeo: resta ${roundH} exactos y devuelve ${diff}.`
      },
      hintMath: `${a} − ${roundH} = ${a - roundH}  →  ${a - roundH} + ${diff} = ${ans}`,
      unit: null,
      visual: null
    };
  }

  // Variant 2: Clean 3-digit tens addition (e.g., 340 + 280)
  if (variant === 2) {
    const a = randInt(15, 62) * 10;
    const b = randInt(12, 35) * 10;
    const ans = a + b;
    const bH = Math.floor(b / 100) * 100;
    const bT = b % 100;
    return {
      age: '9',
      topic: 'mental_1000',
      answerType: 'number',
      answer: String(ans),
      choices: makeNumericChoices(ans, [ans + 100, Math.max(10, ans - 100), ans + 10, ans - 10], {
        minVal: 100,
        maxStep: 30
      }),
      equation: `${a} + ${b} = ?`,
      story: null,
      prompt: {
        he: 'חִבּוּר מֵאוֹת וַעֲשָׂרוֹת בְּרֹאשׁ:',
        en: 'Add hundreds and tens mentally:',
        es: 'Suma centenas y decenas mentalmente:'
      },
      hint: {
        he: `מְפָרְקִים לְמֵאוֹת וַעֲשָׂרוֹת: קֹדֶם מוֹסִיפִים ${bH} וְאָז עוֹד ${bT}!`,
        en: `Split into hundreds and tens: add ${bH} first, then add ${bT}!`,
        es: `Divide en centenas y decenas: primero suma ${bH} y luego ${bT}.`
      },
      hintMath: `${a} + ${bH} = ${a + bH}  →  ${a + bH} + ${bT} = ${ans}`,
      unit: null,
      visual: null
    };
  }

  // Variant 3: Subtract from round hundred (e.g., 600 - 240 or 800 - 275)
  const a = randInt(4, 9) * 100;
  const b = randInt(1, Math.floor(a / 100) - 2) * 100 + pick([25, 30, 40, 50, 60, 75, 80]);
  const ans = a - b;
  const bH = Math.floor(b / 100) * 100;
  const bRem = b - bH;
  return {
    age: '9',
    topic: 'mental_1000',
    answerType: 'number',
    answer: String(ans),
    choices: makeNumericChoices(ans, [ans + 100, Math.max(10, ans - 100), ans + 20, Math.max(10, ans - 20)], {
      minVal: 20,
      maxStep: 35
    }),
    equation: `${a} − ${b} = ?`,
    story: null,
    prompt: {
      he: 'חִסּוּר מִמֵּאוֹת שְׁלֵמוֹת:',
      en: 'Subtract from a round hundred:',
      es: 'Resta desde una centena exacta:'
    },
    hint: {
      he: `קֹדֶם מוֹרִידִים אֶת הַמֵּאוֹת (${bH}), וְאָז מוֹרִידִים עוֹד ${bRem}!`,
      en: `First subtract the hundreds (${bH}), then subtract the remaining ${bRem}!`,
      es: `Primero resta las centenas (${bH}) y luego los ${bRem} restantes.`
    },
    hintMath: `${a} − ${bH} = ${a - bH}  →  ${a - bH} − ${bRem} = ${ans}`,
    unit: null,
    visual: null
  };
}

function genAge9OrderOps() {
  const variant = randInt(1, 4);

  if (variant === 1) {
    // a + b × c
    const a = randInt(4, 20);
    const b = randInt(2, 8);
    const c = randInt(3, 8);
    const mult = b * c;
    const ans = a + mult;
    const trap = (a + b) * c;
    return {
      age: '9',
      topic: 'order_ops',
      answerType: 'number',
      answer: String(ans),
      choices: makeNumericChoices(ans, [trap, ans + c, Math.max(2, ans - b), ans + 2], { minVal: 5, maxStep: 12 }),
      equation: `${a} + ${b} × ${c} = ?`,
      story: null,
      prompt: {
        he: 'שִׂימוּ לֵב לְסֵדֶר פְּעֻלּוֹת הַחֶשְׁבּוֹן!',
        en: 'Watch the Order of Operations!',
        es: '¡Atención al orden de las operaciones!'
      },
      hint: {
        he: 'כְּלַל בֵּית הַסֵּפֶר: כֶּפֶל וְחִלּוּק תָּמִיד קוֹדְמִים לְחִבּוּר וְחִסּוּר! פּוֹתְרִים קֹדֶם אֶת הַכֶּפֶל.',
        en: 'School rule: Multiplication & Division ALWAYS come before Addition & Subtraction! Solve × first.',
        es: 'Regla escolar: ¡Multiplicación y división SIEMPRE van antes que suma y resta!'
      },
      hintMath: `${b} × ${c} = ${mult}  →  ${a} + ${mult} = ${ans}`,
      unit: null,
      visual: null
    };
  }

  if (variant === 2) {
    // (a + b) × c
    const a = randInt(2, 7);
    const b = randInt(2, 6);
    const c = randInt(3, 7);
    const sum = a + b;
    const ans = sum * c;
    const trap = a + b * c;
    return {
      age: '9',
      topic: 'order_ops',
      answerType: 'number',
      answer: String(ans),
      choices: makeNumericChoices(ans, [trap, ans + c, Math.max(2, ans - c), sum + c], { minVal: 6, maxStep: 12 }),
      equation: `(${a} + ${b}) × ${c} = ?`,
      story: null,
      prompt: {
        he: 'מָה פּוֹתְרִים קֹדֶם כְּשֶׁיֵּשׁ סוֹגְרַיִם?',
        en: 'What do we solve first with parentheses?',
        es: '¿Qué resolvemos primero cuando hay paréntesis?'
      },
      hint: {
        he: 'סוֹגְרַיִם תָּמִיד רִאשׁוֹנִים! קֹדֶם מְחַשְּׁבִים מָה שֶׁבִּפְנִים הַסּוֹגְרַיִם, וְאָז כּוֹפְלִים.',
        en: 'Parentheses ALWAYS go first! Compute inside ( ) first, then multiply.',
        es: '¡Los paréntesis SIEMPRE van primero! Calcula dentro del paréntesis y luego multiplica.'
      },
      hintMath: `(${a} + ${b}) = ${sum}  →  ${sum} × ${c} = ${ans}`,
      unit: null,
      visual: null
    };
  }

  if (variant === 3) {
    // a - b × c (guaranteed positive)
    const b = randInt(2, 6);
    const c = randInt(3, 7);
    const mult = b * c;
    const a = mult + randInt(6, 25);
    const ans = a - mult;
    const trap = Math.max(1, (a - b) * c);
    return {
      age: '9',
      topic: 'order_ops',
      answerType: 'number',
      answer: String(ans),
      choices: makeNumericChoices(ans, [trap, ans + b, Math.max(1, ans - b), mult], { minVal: 1, maxStep: 10 }),
      equation: `${a} − ${b} × ${c} = ?`,
      story: null,
      prompt: {
        he: 'כֶּפֶל קוֹדֵם לְחִסּוּר — פִּתְרוּ בִּשְׁנֵי שְׁלַבִּים:',
        en: 'Multiply before subtracting — solve in 2 steps:',
        es: 'Multiplica antes de restar — resuelve en 2 pasos:'
      },
      hint: {
        he: `קֹדֶם כּוֹפְלִים ${b} × ${c}, וְרַק אַחַר כָּךְ מְחַסְּרִים מִ-${a}!`,
        en: `First compute ${b} × ${c}, and only then subtract from ${a}!`,
        es: `Primero calcula ${b} × ${c}, y después réstalo de ${a}.`
      },
      hintMath: `${b} × ${c} = ${mult}  →  ${a} − ${mult} = ${ans}`,
      unit: null,
      visual: null
    };
  }

  // Variant 4: a + (b*c) ÷ c
  const c = randInt(3, 8);
  const q = randInt(3, 9);
  const dividend = c * q;
  const a = randInt(5, 25);
  const ans = a + q;
  return {
    age: '9',
    topic: 'order_ops',
    answerType: 'number',
    answer: String(ans),
    choices: makeNumericChoices(ans, [ans + c, Math.max(2, ans - c), ans + 2, ans - 2], { minVal: 4, maxStep: 10 }),
    equation: `${a} + ${dividend} ÷ ${c} = ?`,
    story: null,
    prompt: {
      he: 'חִלּוּק קוֹדֵם לְחִבּוּר!',
      en: 'Division comes before addition!',
      es: '¡La división va antes que la suma!'
    },
    hint: {
      he: `קֹדֶם פּוֹתְרִים אֶת הַחִלּוּק ${dividend} ÷ ${c}, וְאָז מוֹסִיפִים ${a}!`,
      en: `First solve ${dividend} ÷ ${c}, then add ${a}!`,
      es: `Primero resuelve ${dividend} ÷ ${c} y luego suma ${a}.`
    },
    hintMath: `${dividend} ÷ ${c} = ${q}  →  ${a} + ${q} = ${ans}`,
    unit: null,
    visual: null
  };
}

function genAge9Fractions() {
  const variant = randInt(1, 4);

  // Variant 1: Add fractions with same denominator + 2-color visual bar
  if (variant === 1) {
    const denom = pick([4, 5, 6, 8, 10]);
    const a = randInt(1, denom - 2);
    const b = randInt(1, denom - a);
    const sum = a + b;
    const ans = `${sum}/${denom}`;
    return {
      age: '9',
      topic: 'fractions',
      answerType: 'fraction',
      answer: ans,
      choices: makeFractionChoices(sum, denom, [
        `${sum}/${denom * 2}`,
        `${Math.max(1, sum - 1)}/${denom}`,
        `${Math.min(denom, sum + 1)}/${denom}`
      ]),
      equation: `${a}/${denom} + ${b}/${denom} = ?`,
      story: null,
      prompt: {
        he: 'חַבְּרוּ אֶת הַשְּׁבָרִים בְּעֶזְרַת סַרְגֵּל הַשְּׁבָרִים:',
        en: 'Add the fractions using the fraction bar:',
        es: 'Suma las fracciones usando la barra visual:'
      },
      hint: {
        he: `כְּשֶׁהַמְּכַנֶּה זֵהֶה (${denom}), הוּא נִשְׁאָר אוֹתוֹ דָּבָר! מְחַבְּרִים רַק אֶת הַמּוֹנִים לְמַעְלָה (${a} + ${b}).`,
        en: `When denominators match (${denom}), keep the bottom the same and just add the top numbers (${a} + ${b})!`,
        es: `Cuando el denominador es igual (${denom}), se mantiene abajo y solo sumas arriba (${a} + ${b}).`
      },
      hintMath: `(${a} + ${b}) / ${denom} = ${sum}/${denom}`,
      unit: null,
      visual: { type: 'fraction_bar', denom, coloredA: a, coloredB: b, crossed: 0 }
    };
  }

  // Variant 2: Complement to 1 whole (1 - a/d)
  if (variant === 2) {
    const denom = pick([4, 5, 6, 8, 10]);
    const colored = randInt(1, denom - 1);
    const missing = denom - colored;
    const ans = `${missing}/${denom}`;
    return {
      age: '9',
      topic: 'fractions',
      answerType: 'fraction',
      answer: ans,
      choices: makeFractionChoices(missing, denom, [
        `${colored}/${denom}`,
        `${Math.max(1, missing - 1)}/${denom}`,
        `${Math.min(denom, missing + 1)}/${denom}`
      ]),
      equation: `1 − ${colored}/${denom} = ?`,
      story: null,
      prompt: {
        he: 'כַּמָּה חָסֵר כְּדֵי לְהַשְׁלִים לְשָׁלֵם אֶחָד (1)?',
        en: 'How much more is needed to make 1 whole?',
        es: '¿Cuánto falta para completar 1 entero?'
      },
      hint: {
        he: `שָׁלֵם אֶחָד שָׁוֶה לְ-${denom}/${denom}. סִפְרוּ אֶת הַחֲלָקִים הָרֵיקִים בַּסַּרְגֵּל!`,
        en: `One whole equals ${denom}/${denom}. Count the unshaded parts on the bar!`,
        es: `Un entero equivale a ${denom}/${denom}. ¡Cuenta las partes vacías de la barra!`
      },
      hintMath: `${denom}/${denom} − ${colored}/${denom} = ${missing}/${denom}`,
      unit: null,
      visual: { type: 'fraction_bar', denom, coloredA: colored, coloredB: 0, crossed: 0 }
    };
  }

  // Variant 3: Subtract same denominator
  if (variant === 3) {
    const denom = pick([5, 6, 8, 10]);
    const a = randInt(3, denom);
    const b = randInt(1, a - 1);
    const diff = a - b;
    const ans = `${diff}/${denom}`;
    return {
      age: '9',
      topic: 'fractions',
      answerType: 'fraction',
      answer: ans,
      choices: makeFractionChoices(diff, denom, [
        `${Math.min(denom, a + b)}/${denom}`,
        `${Math.max(1, diff - 1)}/${denom}`,
        `${Math.min(denom, diff + 1)}/${denom}`
      ]),
      equation: `${a}/${denom} − ${b}/${denom} = ?`,
      story: null,
      prompt: {
        he: 'חַסְּרוּ אֶת הַשְּׁבָרִים:',
        en: 'Subtract the fractions:',
        es: 'Resta las fracciones:'
      },
      hint: {
        he: `הַמְּכַנֶּה (${denom}) נִשְׁאָר זֵהֶה — מְחַסְּרִים רַק אֶת הַמּוֹנִים (${a} − ${b})!`,
        en: `Keep the denominator (${denom}) the same and subtract the numerators (${a} − ${b})!`,
        es: `Mantén el denominador (${denom}) y resta solo los numeradores (${a} − ${b}).`
      },
      hintMath: `(${a} − ${b}) / ${denom} = ${diff}/${denom}`,
      unit: null,
      visual: { type: 'fraction_bar', denom, coloredA: diff, coloredB: 0, crossed: b }
    };
  }

  // Variant 4: Fraction of a whole number (Israeli Grade 4 favorite!)
  const denom = pick([2, 3, 4, 5]);
  const partSize = randInt(3, 9);
  const total = denom * partSize;
  const num = denom === 2 ? 1 : randInt(1, denom - 1);
  const ans = num * partSize;

  return {
    age: '9',
    topic: 'fractions',
    answerType: 'number',
    answer: String(ans),
    choices: makeNumericChoices(ans, [partSize, total - ans, ans + partSize, Math.max(1, ans - 2)], {
      minVal: 1,
      maxStep: Math.max(5, partSize)
    }),
    equation: `${num}/${denom} × ${total} = ?`,
    story: null,
    prompt: {
      he: `כַּמָּה זֶה ${num}/${denom} מִתּוֹךְ ${total}?`,
      en: `What is ${num}/${denom} of ${total}?`,
      es: `¿Cuánto es ${num}/${denom} de ${total}?`
    },
    hint: {
      he: `טְרִיק שֶׁבֶר מִמִּסְפָּר: קֹדֶם מְחַלְּקִים ${total} בַּמְּכַנֶּה (${denom}) כְּדֵי לִמְצֹא חֵלֶק אֶחָד, וְאָז כּוֹפְלִים בַּמּוֹנֶה (${num})!`,
      en: `Fraction-of-a-number trick: divide ${total} by the bottom (${denom}) to get 1 part, then multiply by the top (${num})!`,
      es: `Truco: divide ${total} entre el denominador (${denom}) para hallar 1 parte y luego multiplica por ${num}.`
    },
    hintMath:
      num === 1
        ? `${total} ÷ ${denom} = ${ans}`
        : `${total} ÷ ${denom} = ${partSize}  →  ${partSize} × ${num} = ${ans}`,
    unit: null,
    visual: { type: 'fraction_bar', denom, coloredA: num, coloredB: 0, crossed: 0, totalQty: total, partSize }
  };
}

function genAge9WordPerimeter() {
  const isPerimeter = Math.random() < 0.5;

  if (isPerimeter) {
    const isSquare = Math.random() < 0.35;
    if (isSquare) {
      const side = randInt(4, 15);
      const ans = side * 4;
      const unitObj = { he: "מ'", en: 'm', es: 'm' };
      return {
        age: '9',
        topic: 'word_perimeter',
        answerType: 'number',
        answer: String(ans),
        choices: makeNumericChoices(ans, [side * side, side * 2, ans + side, Math.max(4, ans - side)], {
          minVal: 8,
          maxStep: 12
        }),
        equation: null,
        story: {
          he: `לְגִנַּת הַכִּתָּה יֵשׁ צוּרַת רִבּוּעַ שֶׁאֹרֶךְ כָּל צֶלַע שֶׁלּוֹ הוּא ${side} מֶטְרִים. מָה הֶקֵּף הַגִּנָּה? 🌿`,
          en: `The class garden is a square where each side is ${side} meters long. What is its perimeter? 🌿`,
          es: `El jardín escolar es un cuadrado con cada lado de ${side} metros. ¿Cuál es su perímetro? 🌿`
        },
        prompt: null,
        hint: {
          he: 'הֶקֵּף רִבּוּעַ = 4 צְלָעוֹת שָׁווֹת! מַכְפִּילִים אֹרֶךְ צֶלַע אַחַת בְּ-4.',
          en: 'Square perimeter = 4 equal sides! Multiply one side by 4.',
          es: 'Perímetro de un cuadrado = 4 lados iguales. Multiplica un lado por 4.'
        },
        hintMath: `4 × ${side} = ${ans}`,
        unit: unitObj,
        visual: { type: 'perimeter', shape: 'square', width: side, height: side, unit: unitObj }
      };
    }

    const width = randInt(6, 16);
    const height = randInt(3, width - 2);
    const ans = 2 * (width + height);
    const unitObj = { he: "מ'", en: 'm', es: 'm' };
    return {
      age: '9',
      topic: 'word_perimeter',
      answerType: 'number',
      answer: String(ans),
      choices: makeNumericChoices(ans, [width + height, width * height, ans + 2, Math.max(6, ans - 2)], {
        minVal: 10,
        maxStep: 10
      }),
      equation: null,
      story: {
        he: `מִגְרַשׁ כַּדּוּרֶגֶל קָטָן הוּא מַלְבֵּן בְּאֹרֶךְ ${width} מ' וּבְרֹחַב ${height} מ'. מָה הֶקֵּף הַמִּגְרָשׁ? ⚽`,
        en: `A mini soccer field is a rectangle ${width} m long and ${height} m wide. What is its perimeter? ⚽`,
        es: `Una cancha de fútbol es un rectángulo de ${width} m de largo y ${height} m de ancho. ¿Cuál es su perímetro? ⚽`
      },
      prompt: null,
      hint: {
        he: 'טְרִיק הֶקֵּף מַלְבֵּן: מְחַבְּרִים אֹרֶךְ + רֹחַב, וְאָז מַכְפִּילִים בְּ-2!',
        en: 'Rectangle perimeter trick: add length + width, then double it!',
        es: 'Truco de perímetro: suma largo + ancho y multiplícalo por 2.'
      },
      hintMath: `(${width} + ${height}) × 2 = ${width + height} × 2 = ${ans}`,
      unit: unitObj,
      visual: { type: 'perimeter', shape: 'rect', width, height, unit: unitObj }
    };
  }

  // Shekel change (2-step Israeli shopping word problem)
  const bill = pick([50, 100]);
  const qty = randInt(2, 4);
  const unitPrice = bill === 50 ? randInt(5, 11) : randInt(12, 22);
  const cost = qty * unitPrice;
  const ans = bill - cost;

  const item = pick([
    { he: 'גְּלִידוֹת', en: 'ice creams', es: 'helados', emoji: '🍨' },
    { he: 'מַחְבָּרוֹת', en: 'notebooks', es: 'cuadernos', emoji: '📓' },
    { he: 'כַּרְטִיסִים לַסֶּרֶט', en: 'snack boxes', es: 'cajas de snacks', emoji: '🍿' },
    { he: 'חֲבִילוֹת קְלָפִים', en: 'card packs', es: 'sobres de cartas', emoji: '🃏' }
  ]);

  return {
    age: '9',
    topic: 'word_perimeter',
    answerType: 'number',
    answer: String(ans),
    choices: makeNumericChoices(ans, [cost, ans + unitPrice, Math.max(1, ans - unitPrice), ans + 10], {
      minVal: 1,
      maxStep: 12
    }),
    equation: null,
    story: {
      he: `דָּנִי קָנָה ${qty} ${item.he} בִּמְחִיר ${unitPrice} ₪ כָּל אַחַת, וְשִׁלֵּם בִּשְׁטָר שֶׁל ${bill} ₪. כַּמָּה עֹדֶף הוּא מְקַבֵּל? ${item.emoji}`,
      en: `Dani bought ${qty} ${item.en} at ${unitPrice} ₪ each and paid with a ${bill} ₪ bill. How much change does he get? ${item.emoji}`,
      es: `Dani compró ${qty} ${item.es} a ${unitPrice} ₪ cada uno y pagó con un billete de ${bill} ₪. ¿Cuánto cambio recibe? ${item.emoji}`
    },
    prompt: null,
    hint: {
      he: `פּוֹתְרִים בִּשְׁנֵי שְׁלַבִּים: קֹדֶם מְחַשְּׁבִים כַּמָּה עוֹלָה הַקְּנִיָּה (${qty} × ${unitPrice}), וְאָז מְחַסְּרִים מִ-${bill} ₪!`,
      en: `Solve in 2 steps: first find total cost (${qty} × ${unitPrice}), then subtract from ${bill} ₪!`,
      es: `Resuelve en 2 pasos: primero calcula el costo total (${qty} × ${unitPrice}) y luego réstalo de ${bill} ₪.`
    },
    hintMath: `${qty} × ${unitPrice} = ${cost} ₪  →  ${bill} − ${cost} = ${ans} ₪`,
    unit: { he: '₪', en: '₪', es: '₪' },
    visual: null
  };
}

let questionCounter = 0;

/** Main problem factory for Israel Math Arena */
export function generateMathArenaProblem(age = '7', topic = 'mix') {
  questionCounter += 1;
  const ageStr = String(age) === '9' ? '9' : '7';

  let chosenTopic = topic;
  if (chosenTopic === 'mix') {
    const pool =
      ageStr === '7'
        ? ['add_sub', 'missing', 'mult_starter', 'compare', 'word_ils']
        : ['times_div', 'mental_1000', 'order_ops', 'fractions', 'word_perimeter'];
    chosenTopic = pick(pool);
  }

  let problem;
  if (ageStr === '7') {
    switch (chosenTopic) {
      case 'add_sub':
        problem = genAge7AddSub();
        break;
      case 'missing':
        problem = genAge7Missing();
        break;
      case 'mult_starter':
        problem = genAge7MultStarter();
        break;
      case 'compare':
        problem = genAge7Compare();
        break;
      case 'word_ils':
      default:
        problem = genAge7WordIls();
        break;
    }
  } else {
    switch (chosenTopic) {
      case 'times_div':
        problem = genAge9TimesDiv();
        break;
      case 'mental_1000':
        problem = genAge9Mental1000();
        break;
      case 'order_ops':
        problem = genAge9OrderOps();
        break;
      case 'fractions':
        problem = genAge9Fractions();
        break;
      case 'word_perimeter':
      default:
        problem = genAge9WordPerimeter();
        break;
    }
  }

  return {
    ...problem,
    id: `ma-${ageStr}-${chosenTopic}-${questionCounter}-${Date.now()}`
  };
}
