import * as googleTTS from 'google-tts-api';
import fs from 'fs';
import path from 'path';
import { LETTERS_DATA } from '../src/data/curriculumData.js';

async function generateWords() {
  const wordsDir = path.join(process.cwd(), 'public', 'audio', 'words');
  if (!fs.existsSync(wordsDir)) {
    fs.mkdirSync(wordsDir, { recursive: true });
  }

  const allWords = new Map();
  LETTERS_DATA.forEach(letter => {
    letter.examples.forEach(ex => {
      // sanitize filename
      const filename = ex.en.toLowerCase().replace(/[^a-z0-9]/g, '_') + '.mp3';
      allWords.set(filename, ex.he);
    });
  });

  console.log(`Generating ${allWords.size} example words...`);

  for (const [filename, hebrewText] of allWords.entries()) {
    const filePath = path.join(wordsDir, filename);
    if (fs.existsSync(filePath)) continue;

    try {
      const base64 = await googleTTS.getAudioBase64(hebrewText, {
        lang: 'iw',
        slow: false,
        host: 'https://translate.google.com',
        timeout: 10000,
      });
      fs.writeFileSync(filePath, Buffer.from(base64, 'base64'));
      console.log(`Word: ${filename} (${hebrewText})`);
      await new Promise(r => setTimeout(r, 120));
    } catch (e) {
      console.error(`Error word ${filename}:`, e.message);
    }
  }

  console.log('=== All Words Generated Successfully! ===');
}

generateWords().catch(console.error);
