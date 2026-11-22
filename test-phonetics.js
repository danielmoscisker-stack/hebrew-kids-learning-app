import * as googleTTS from 'google-tts-api';
import fs from 'fs';

const tests = [
  { name: 'bet_bayit', text: 'בֵּית' },
  { name: 'bet_haot', text: 'הָאוֹת בֵּית' },
  { name: 'bet_haot_short', text: 'אוֹת בֵּית' },
  { name: 'bet_bess', text: 'בֵּית' },
  { name: 'bet_phonetic_bejt', text: 'בֵּת' },
  { name: 'dalet_haot', text: 'הָאוֹת דָּלֶת' },
  { name: 'dalet_phonetic', text: 'דָּאלֶת' },
  { name: 'vet_haot', text: 'הָאוֹת וֵית' },
  { name: 'vet_phonetic', text: 'וֵת' }
];

async function run() {
  if (!fs.existsSync('public/audio/test')) {
    fs.mkdirSync('public/audio/test', { recursive: true });
  }
  for (const t of tests) {
    const b64 = await googleTTS.getAudioBase64(t.text, { lang: 'iw' });
    fs.writeFileSync(`public/audio/test/${t.name}.mp3`, Buffer.from(b64, 'base64'));
    console.log(`Saved ${t.name}: ${t.text}`);
  }
}

run().catch(console.error);
