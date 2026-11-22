import * as googleTTS from 'google-tts-api';
import fs from 'fs';
import path from 'path';

const LETTERS_TO_GENERATE = [
  { id: 'alef', text: 'אָלֶף!', haotText: 'הָאוֹת אָלֶף!', filename: 'alef.mp3' },
  { id: 'bet_dagesh', text: 'בֵּט', haotText: 'בֵּט', filename: 'bet_dagesh.mp3' },
  { id: 'vet', text: 'וֵט', haotText: 'וֵט', filename: 'vet.mp3' },
  { id: 'gimel', text: 'גִּימֶל!', haotText: 'הָאוֹת גִּימֶל!', filename: 'gimel.mp3' },
  { id: 'dalet', text: 'דָּלֶת!', haotText: 'הָאוֹת דָּלֶת!', filename: 'dalet.mp3' },
  { id: 'he', text: 'הֵי', haotText: 'הָאוֹת הֵי', filename: 'he.mp3' },
  { id: 'vav', text: 'וָו!', haotText: 'הָאוֹת וָו!', filename: 'vav.mp3' },
  { id: 'zayin', text: 'זַיִן!', haotText: 'הָאוֹת זַיִן!', filename: 'zayin.mp3' },
  { id: 'chet', text: 'חֵית!', haotText: 'הָאוֹת חֵית!', filename: 'chet.mp3' },
  { id: 'tet', text: 'טֵית!', haotText: 'הָאוֹת טֵית!', filename: 'tet.mp3' },
  { id: 'yod', text: 'יוּד', haotText: 'הָאוֹת יוּד', filename: 'yod.mp3' },
  { id: 'kaf_dagesh', text: 'כַּף!', haotText: 'הָאוֹת כַּף!', filename: 'kaf_dagesh.mp3' },
  { id: 'khaf', text: 'חַף', haotText: 'הָאוֹת חַף', filename: 'khaf.mp3' },
  { id: 'lamed', text: 'לָמֶד!', haotText: 'הָאוֹת לָמֶד!', filename: 'lamed.mp3' },
  { id: 'mem', text: 'מֵם!', haotText: 'הָאוֹת מֵם!', filename: 'mem.mp3' },
  { id: 'nun', text: 'נוּן!', haotText: 'הָאוֹת נוּן!', filename: 'nun.mp3' },
  { id: 'samech', text: 'סָמֶךְ!', haotText: 'הָאוֹת סָמֶךְ!', filename: 'samech.mp3' },
  { id: 'ayin', text: 'עַיִן!', haotText: 'הָאוֹת עַיִן!', filename: 'ayin.mp3' },
  { id: 'pe_dagesh', text: 'פֵּא!', haotText: 'הָאוֹת פֵּא!', filename: 'pe_dagesh.mp3' },
  { id: 'fe', text: 'פֵיי', haotText: 'הָאוֹת פֵיי', filename: 'fe.mp3' },
  { id: 'tsadi', text: 'סָאדִי', haotText: 'הָאוֹת סָאדִי', filename: 'tsadi.mp3' },
  { id: 'kof', text: 'קוּף!', haotText: 'הָאוֹת קוּף!', filename: 'kof.mp3' },
  { id: 'resh', text: 'רֵישׁ!', haotText: 'הָאוֹת רֵישׁ!', filename: 'resh.mp3' },
  { id: 'shin', text: 'שִׁין!', haotText: 'הָאוֹת שִׁין!', filename: 'shin.mp3' },
  { id: 'sin', text: 'שִׂין!', haotText: 'הָאוֹת שִׂין!', filename: 'sin.mp3' },
  { id: 'tav', text: 'תָּיו!', haotText: 'הָאוֹת תָּיו!', filename: 'tav.mp3' },
];

const NUMBERS_TO_GENERATE = [
  { num: 1, text: 'אֶחָד', filename: 'num_1.mp3' },
  { num: 2, text: 'שְׁתַּיִם', filename: 'num_2.mp3' },
  { num: 3, text: 'שָׁלוֹשׁ', filename: 'num_3.mp3' },
  { num: 4, text: 'אַרְבַּע', filename: 'num_4.mp3' },
  { num: 5, text: 'חָמֵשׁ', filename: 'num_5.mp3' },
  { num: 6, text: 'שֵׁשׁ', filename: 'num_6.mp3' },
  { num: 7, text: 'שֶׁבַע', filename: 'num_7.mp3' },
  { num: 8, text: 'שְׁמוֹנֶה', filename: 'num_8.mp3' },
  { num: 9, text: 'תֵּשַׁע', filename: 'num_9.mp3' },
  { num: 10, text: 'עֶשֶׂר', filename: 'num_10.mp3' },
];

const PHRASES_TO_GENERATE = [
  // --- BOY PHRASES (זָכָר) - Warm, natural, human Israeli kindergarten teacher voice ---
  { id: 'crazy_correct_boy', text: 'יוֹפִי, כּוֹל הַכָּבוֹד, אַתָּה מַמָּשׁ אַלּוּף', filename: 'crazy_correct_boy.mp3' },
  { id: 'great_job_boy', text: 'כּוֹל הַכָּבוֹד, אַתָּה אַלּוּף', filename: 'great_job_boy.mp3' },
  { id: 'pupik_touch_boy', text: 'בּוּם, נָגַעְתָּ בַּפּוּפִּיק, כּוֹל הַכָּבוֹד', filename: 'pupik_touch_boy.mp3' },
  { id: 'train_star_boy', text: 'כּוֹל הַכָּבוֹד, קָרָאתָ אֶת כָּל הַשּׁוּרָה בָּרַכֶּבֶת', filename: 'train_star_boy.mp3' },
  { id: 'try_again_boy', text: 'לֹא נוֹרָא, בּוֹא נְנַסֶּה שׁוּב', filename: 'try_again_boy.mp3' },
  { id: 'correct_answer_boy', text: 'נָכוֹן מְאוֹד, אַתָּה אַלּוּף', filename: 'correct_answer_boy.mp3' },
  { id: 'helper_hint_boy', text: 'הִנֵּה רֶמֶז, נַסֵּה לִלְחֹץ עַל הָאוֹת הַזֹּאת', filename: 'helper_hint_boy.mp3' },
  { id: 'inst_letters_boy', text: 'לְחַץ עַל הָאוֹת כְּדֵי לִשְׁמוֹעַ אֶת הַשֵּׁם שֶׁלָּהּ, וְלִחְצוּ עַל הַתְּמוּנוֹת', filename: 'inst_letters_boy.mp3' },
  { id: 'inst_quiz_boy', text: 'הִסְתַּכֵּל עַל הָאוֹת שֶׁבַּמֶּרְכָּז, וּבְחַר אֶת הַשֵּׁם הַנָּכוֹן שֶׁלָּהּ', filename: 'inst_quiz_boy.mp3' },
  { id: 'inst_train_boy', text: 'קְרָא אֶת הָאוֹתִיּוֹת בָּרַכֶּבֶת מִיָּמִין לִשְׂמֹאל וּצְבַע כּוֹכָבִים', filename: 'inst_train_boy.mp3' },
  { id: 'inst_detective_boy', text: 'שִׂים אֶצְבַּע עַל כָּל אוֹת שֶׁיֵּשׁ לָהּ פּוּפִּיק בַּבֶּטֶן', filename: 'inst_detective_boy.mp3' },
  { id: 'inst_sorting_boy', text: 'הַנַּח כָּל כַּרְטִיס בַּבַּיִת הַמַּתְאִים: בַּיִת עִם פּוּפִּיק אוֹ בַּיִת בְּלִי פּוּפִּיק', filename: 'inst_sorting_boy.mp3' },
  { id: 'inst_numbers_boy', text: 'לְחַץ עַל הַפְּרִיטִים כְּדֵי לִסְפּוֹר אוֹתָם עִם הָאֶצְבַּע', filename: 'inst_numbers_boy.mp3' },
  { id: 'inst_tracing_boy', text: 'עֲבֹר עִם הָאֶצְבַּע עַל הַקַּוִּים שֶׁל הָאוֹת וּלְמַד לִכְתּוֹב', filename: 'inst_tracing_boy.mp3' },
  { id: 'inst_tracing_mouse_boy', text: 'עֲבֹר עִם הָעַכְבָּר עַל הַקַּוִּים שֶׁל הָאוֹת וּלְמַד לִכְתּוֹב', filename: 'inst_tracing_mouse_boy.mp3' },
  { id: 'inst_tracing_touch_boy', text: 'עֲבֹר עִם הָאֶצְבַּע עַל הַקַּוִּים שֶׁל הָאוֹת וּלְמַד לִכְתּוֹב', filename: 'inst_tracing_touch_boy.mp3' },
  { id: 'tracing_keep_going_boy', text: 'עוֹד קְצָת, צַבַּע עַל הַקַּוִּים שֶׁל הָאוֹת', filename: 'tracing_keep_going_boy.mp3' },
  { id: 'tracing_inside_boy', text: 'נַסֵּה לִצְבּוֹעַ בְּתוֹךְ הָאוֹת, אַתָּה מַמָּשׁ קָרוֹב', filename: 'tracing_inside_boy.mp3' },
  { id: 'tracing_success_boy', text: 'וָואוּ, צִיַּרְתָּ מַדְהִים, כּוֹל הַכָּבוֹד', filename: 'tracing_success_boy.mp3' },
  { id: 'inst_memory_boy', text: 'הֲפֹךְ אֶת הַכַּרְטִיסִים וּמְצָא זוּגוֹת שֶׁל אוֹת וּתְמוּנָה', filename: 'inst_memory_boy.mp3' },
  { id: 'inst_stickers_boy', text: 'לְחַץ עַל הַמַּדְבֵּקוֹת שֶׁפָּתַחְתָּ וְשַׂחֵק אִתָּן עַל הַלּוּחַ', filename: 'inst_stickers_boy.mp3' },

  // --- GIRL PHRASES (נְקֵבָה) - Warm, natural, human Israeli kindergarten teacher voice ---
  { id: 'crazy_correct_girl', text: 'יוֹפִי, כּוֹל הַכָּבוֹד, אַתְּ מַמָּשׁ אַלּוּפָה', filename: 'crazy_correct_girl.mp3' },
  { id: 'great_job_girl', text: 'כּוֹל הַכָּבוֹד, אַתְּ אַלּוּפָה', filename: 'great_job_girl.mp3' },
  { id: 'pupik_touch_girl', text: 'בּוּם, נָגַעַתְּ בַּפּוּפִּיק, כּוֹל הַכָּבוֹד', filename: 'pupik_touch_girl.mp3' },
  { id: 'train_star_girl', text: 'כּוֹל הַכָּבוֹד, קָרָאת אֶת כָּל הַשּׁוּרָה בָּרַכֶּבֶת', filename: 'train_star_girl.mp3' },
  { id: 'try_again_girl', text: 'לֹא נוֹרָא, בּוֹאִי נְנַסֶּה שׁוּב', filename: 'try_again_girl.mp3' },
  { id: 'correct_answer_girl', text: 'נָכוֹן מְאוֹד, אַתְּ אַלּוּפָה', filename: 'correct_answer_girl.mp3' },
  { id: 'helper_hint_girl', text: 'הִנֵּה רֶמֶז, נַסִּי לִלְחֹץ עַל הָאוֹת הַזֹּאת', filename: 'helper_hint_girl.mp3' },
  { id: 'inst_letters_girl', text: 'לַחְצִי עַל הָאוֹת כְּדֵי לִשְׁמוֹעַ אֶת הַשֵּׁם שֶׁלָּהּ, וְלִחְצוּ עַל הַתְּמוּנוֹת', filename: 'inst_letters_girl.mp3' },
  { id: 'inst_quiz_girl', text: 'הִסְתַּכְּלִי עַל הָאוֹת שֶׁבַּמֶּרְכָּז, וּבַחֲרִי אֶת הַשֵּׁם הַנָּכוֹן שֶׁלָּהּ', filename: 'inst_quiz_girl.mp3' },
  { id: 'inst_train_girl', text: 'קִרְאִי אֶת הָאוֹתִיּוֹת בָּרַכֶּבֶת מִיָּמִין לִשְׂמֹאל וְצִבְעִי כּוֹכָבִים', filename: 'inst_train_girl.mp3' },
  { id: 'inst_detective_girl', text: 'שִׂימִי אֶצְבַּע עַל כָּל אוֹת שֶׁיֵּשׁ לָהּ פּוּפִּיק בַּבֶּטֶן', filename: 'inst_detective_girl.mp3' },
  { id: 'inst_sorting_girl', text: 'הַנִּיחִי כָּל כַּרְטִיס בַּבַּיִת הַמַּתְאִים: בַּיִת עִם פּוּפִּיק אוֹ בַּיִת בְּלִי פּוּפִּיק', filename: 'inst_sorting_girl.mp3' },
  { id: 'inst_numbers_girl', text: 'לַחְצִי עַל הַפְּרִיטִים כְּדֵי לִסְפּוֹר אוֹתָם עִם הָאֶצְבַּע', filename: 'inst_numbers_girl.mp3' },
  { id: 'inst_tracing_girl', text: 'עִבְרִי עִם הָאֶצְבַּע עַל הַקַּוִּים שֶׁל הָאוֹת וְלִמְדִי לִכְתּוֹב', filename: 'inst_tracing_girl.mp3' },
  { id: 'inst_tracing_mouse_girl', text: 'עִבְרִי עִם הָעַכְבָּר עַל הַקַּוִּים שֶׁל הָאוֹת וְלִמְדִי לִכְתּוֹב', filename: 'inst_tracing_mouse_girl.mp3' },
  { id: 'inst_tracing_touch_girl', text: 'עִבְרִי עִם הָאֶצְבַּע עַל הַקַּוִּים שֶׁל הָאוֹת וְלִמְדִי לִכְתּוֹב', filename: 'inst_tracing_touch_girl.mp3' },
  { id: 'tracing_keep_going_girl', text: 'עוֹד קְצָת, צַבְּעִי עַל הַקַּוִּים שֶׁל הָאוֹת', filename: 'tracing_keep_going_girl.mp3' },
  { id: 'tracing_inside_girl', text: 'נַסִּי לִצְבּוֹעַ בְּתוֹךְ הָאוֹת, אַתְּ מַמָּשׁ קְרוֹבָה', filename: 'tracing_inside_girl.mp3' },
  { id: 'tracing_success_girl', text: 'וָואוּ, צִיַּרְתְּ מַדְהִים, כּוֹל הַכָּבוֹד', filename: 'tracing_success_girl.mp3' },
  { id: 'inst_memory_girl', text: 'הַפְכִי אֶת הַכַּרְטִיסִים וּמִצְאִי זוּגוֹת שֶׁל אוֹת וּתְמוּנָה', filename: 'inst_memory_girl.mp3' },
  { id: 'inst_stickers_girl', text: 'לַחְצִי עַל הַמַּדְבֵּקוֹת שֶׁפָּתַחַתְּ וְשַׂחֲקִי אִתָּן עַל הַלּוּחַ', filename: 'inst_stickers_girl.mp3' },

  // --- NEUTRAL / LEGACY FALLBACKS ---
  { id: 'crazy_correct', text: 'יוֹפִי, כּוֹל הַכָּבוֹד', filename: 'crazy_correct.mp3' },
  { id: 'great_job', text: 'כּוֹל הַכָּבוֹד', filename: 'great_job.mp3' },
  { id: 'pupik_touch', text: 'בּוּם, נָגַעְתָּ בַּפּוּפִּיק, כּוֹל הַכָּבוֹד', filename: 'pupik_touch.mp3' },
  { id: 'train_star', text: 'כּוֹל הַכָּבוֹד, קָרָאתָ אֶת כָּל הַשּׁוּרָה בָּרַכֶּבֶת', filename: 'train_star.mp3' },
  { id: 'try_again', text: 'לֹא נוֹרָא, בּוֹא נְנַסֶּה שׁוּב', filename: 'try_again.mp3' },
  { id: 'correct_answer', text: 'נָכוֹן מְאוֹד', filename: 'correct_answer.mp3' },
  { id: 'where_is', text: 'אֵיפֹה הָאוֹת', filename: 'where_is.mp3' },
  { id: 'click_on', text: 'לִחְצוּ עַל הָאוֹת', filename: 'click_on.mp3' },
  { id: 'helper_hint', text: 'הִנֵּה רֶמֶז, נַסּוּ לִלְחֹץ עַל הָאוֹת הַזֹּאת', filename: 'helper_hint.mp3' },
  { id: 'what_letter', text: 'אֵיזוֹ אוֹת זֹאת?', filename: 'what_letter.mp3' },
  { id: 'inst_letters', text: 'לִחְצוּ עַל הָאוֹת כְּדֵי לִשְׁמוֹעַ אֶת הַשֵּׁם שֶׁלָּהּ, וְלִחְצוּ עַל הַתְּמוּנוֹת', filename: 'inst_letters.mp3' },
  { id: 'inst_quiz', text: 'הִסְתַּכְּלוּ עַל הָאוֹת שֶׁבַּמֶּרְכָּז, וּבַחֲרוּ אֶת הַשֵּׁם הַנָּכוֹן שֶׁלָּהּ', filename: 'inst_quiz.mp3' },
  { id: 'inst_train', text: 'קִרְאוּ אֶת הָאוֹתִיּוֹת בָּרַכֶּבֶת מִיָּמִין לִשְׂמֹאל וְצִבְעוּ כּוֹכָבִים', filename: 'inst_train.mp3' },
  { id: 'inst_detective', text: 'שִׂימוּ אֶצְבַּע עַל כָּל אוֹת שֶׁיֵּשׁ לָהּ פּוּפִּיק בַּבֶּטֶן', filename: 'inst_detective.mp3' },
  { id: 'inst_sorting', text: 'הַנִּיחוּ כָּל כַּרְטִיס בַּבַּיִת הַמַּתְאִים: בַּיִת עִם פּוּפִּיק אוֹ בַּיִת בְּלִי פּוּפִּיק', filename: 'inst_sorting.mp3' },
  { id: 'inst_vowels', text: 'עֲשׂוּ אֶת הַפַּרְצוּף וְהַשְׁמִיעוּ אֶת קוֹל הַתְּנוּעָה', filename: 'inst_vowels.mp3' },
  { id: 'inst_first_words', text: 'קִרְאוּ אֶת הַחֲלָקִים, חַבְּרוּ אוֹתָם יַחַד וְגַלּוּ אֶת הַמִּלָּה', filename: 'inst_first_words.mp3' },
  { id: 'inst_numbers', text: 'לִחְצוּ עַל הַפְּרִיטִים כְּדֵי לִסְפּוֹר אוֹתָם עִם הָאֶצְבַּע', filename: 'inst_numbers.mp3' },
  { id: 'inst_tracing', text: 'עִבְרוּ עִם הָאֶצְבַּע עַל הַקַּוִּים שֶׁל הָאוֹת וְלִמְדוּ לִכְתּוֹב', filename: 'inst_tracing.mp3' },
  { id: 'inst_memory', text: 'הַפְכוּ אֶת הַכַּרְטִיסִים וּמִצְאוּ זוּגוֹת שֶׁל אוֹת וּתְמוּנָה', filename: 'inst_memory.mp3' },
  { id: 'inst_stickers', text: 'לִחְצוּ עַל הַמַּדְבֵּקוֹת שֶׁפְּתַחְתֶּם וְשַׂחֲקוּ אִתָּן עַל הַלּוּחַ', filename: 'inst_stickers.mp3' }
];

async function generateAll() {
  const lettersDir = path.join(process.cwd(), 'public', 'audio', 'letters');
  const numbersDir = path.join(process.cwd(), 'public', 'audio', 'numbers');
  const sfxDir = path.join(process.cwd(), 'public', 'audio', 'phrases');
  const questionsDir = path.join(process.cwd(), 'public', 'audio', 'questions');

  [lettersDir, numbersDir, sfxDir, questionsDir].forEach(dir => {
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
  });

  console.log('--- Generating Letter Audio Files (Consistent Israeli Female Voice) ---');
  for (const item of LETTERS_TO_GENERATE) {
    try {
      // 1. Crisp Letter Name
      const base64 = await googleTTS.getAudioBase64(item.text, {
        lang: 'iw',
        slow: false,
        host: 'https://translate.google.com',
        timeout: 10000,
      });
      fs.writeFileSync(path.join(lettersDir, item.filename), Buffer.from(base64, 'base64'));

      // 2. Full "הָאוֹת ..." pedagogical pronunciation
      const base64Haot = await googleTTS.getAudioBase64(item.haotText, {
        lang: 'iw',
        slow: false,
        host: 'https://translate.google.com',
        timeout: 10000,
      });
      fs.writeFileSync(path.join(lettersDir, `haot_${item.id}.mp3`), Buffer.from(base64Haot, 'base64'));

      console.log(`Generated: ${item.filename} and haot_${item.id}.mp3`);
      await new Promise(r => setTimeout(r, 120));
    } catch (e) {
      console.error(`Error generating ${item.filename}:`, e.message);
    }
  }

  // Create aliases so any lookup never fails
  const copyAlias = (src, dest) => {
    const srcPath = path.join(lettersDir, src);
    if (fs.existsSync(srcPath)) {
      fs.copyFileSync(srcPath, path.join(lettersDir, dest));
    }
  };
  copyAlias('bet_dagesh.mp3', 'bet.mp3');
  copyAlias('haot_bet_dagesh.mp3', 'haot_bet.mp3');
  copyAlias('kaf_dagesh.mp3', 'kaf.mp3');
  copyAlias('haot_kaf_dagesh.mp3', 'haot_kaf.mp3');
  copyAlias('khaf.mp3', 'chaf.mp3');
  copyAlias('haot_khaf.mp3', 'haot_chaf.mp3');
  copyAlias('pe_dagesh.mp3', 'pe.mp3');
  copyAlias('haot_pe_dagesh.mp3', 'haot_pe.mp3');
  copyAlias('tsadi.mp3', 'tzadi.mp3');
  copyAlias('haot_tsadi.mp3', 'haot_tzadi.mp3');
  copyAlias('tsadi.mp3', 'sadi.mp3');
  copyAlias('haot_tsadi.mp3', 'haot_sadi.mp3');
  copyAlias('fe.mp3', 'fay.mp3');
  copyAlias('haot_fe.mp3', 'haot_fay.mp3');
  copyAlias('he.mp3', 'hay.mp3');
  copyAlias('haot_he.mp3', 'haot_hay.mp3');
  copyAlias('yod.mp3', 'yud.mp3');
  copyAlias('haot_yod.mp3', 'haot_yud.mp3');

  console.log('--- Generating Number Audio Files ---');
  for (const item of NUMBERS_TO_GENERATE) {
    try {
      const base64 = await googleTTS.getAudioBase64(item.text, {
        lang: 'iw',
        slow: false,
        host: 'https://translate.google.com',
        timeout: 10000,
      });
      const filePath = path.join(numbersDir, item.filename);
      fs.writeFileSync(filePath, Buffer.from(base64, 'base64'));
      console.log(`Generated: ${item.filename} (${item.text})`);
      await new Promise(r => setTimeout(r, 150));
    } catch (e) {
      console.error(`Error generating ${item.filename}:`, e.message);
    }
  }

  console.log('--- Generating Phrase Audio Files ---');
  for (const item of PHRASES_TO_GENERATE) {
    try {
      const base64 = await googleTTS.getAudioBase64(item.text, {
        lang: 'iw',
        slow: false,
        host: 'https://translate.google.com',
        timeout: 10000,
      });
      const filePath = path.join(sfxDir, item.filename);
      fs.writeFileSync(filePath, Buffer.from(base64, 'base64'));
      console.log(`Generated: ${item.filename}`);
      await new Promise(r => setTimeout(r, 150));
    } catch (e) {
      console.error(`Error generating ${item.filename}:`, e.message);
    }
  }

  console.log('--- Generating Question Audio Files (איפה האות...?) ---');
  for (const item of LETTERS_TO_GENERATE) {
    const filename = `where_${item.id}.mp3`;
    const cleanName = item.text.replace(/!/g, '').trim();
    const qText = `אֵיפֹה הָאוֹת ${cleanName}?`;
    try {
      const base64 = await googleTTS.getAudioBase64(qText, {
        lang: 'iw',
        slow: false,
        host: 'https://translate.google.com',
        timeout: 10000,
      });
      const filePath = path.join(questionsDir, filename);
      fs.writeFileSync(filePath, Buffer.from(base64, 'base64'));
      console.log(`Question: ${filename} (${qText})`);
      await new Promise(r => setTimeout(r, 120));
    } catch (e) {
      console.error(`Error generating ${filename}:`, e.message);
    }
  }

  // Create question aliases
  const copyQuestionAlias = (src, dest) => {
    const srcPath = path.join(questionsDir, src);
    if (fs.existsSync(srcPath)) {
      fs.copyFileSync(srcPath, path.join(questionsDir, dest));
    }
  };
  copyQuestionAlias('where_bet_dagesh.mp3', 'where_bet.mp3');
  copyQuestionAlias('where_kaf_dagesh.mp3', 'where_kaf.mp3');
  copyQuestionAlias('where_khaf.mp3', 'where_chaf.mp3');
  copyQuestionAlias('where_pe_dagesh.mp3', 'where_pe.mp3');
  copyQuestionAlias('where_tsadi.mp3', 'where_tzadi.mp3');
  copyQuestionAlias('where_tsadi.mp3', 'where_sadi.mp3');
  copyQuestionAlias('where_fe.mp3', 'where_fay.mp3');
  copyQuestionAlias('where_he.mp3', 'where_hay.mp3');
  copyQuestionAlias('where_yod.mp3', 'where_yud.mp3');

  console.log('=== All Audio Files Generated Successfully! ===');
}

generateAll().catch(console.error);
