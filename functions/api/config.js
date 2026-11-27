import { json } from './_lib.js';

export async function onRequestGet({ env }) {
  return json({
    googleClientId: env.GOOGLE_CLIENT_ID || null,
    playStoreUrl:
      env.PLAY_STORE_URL ||
      'https://play.google.com/store/apps/details?id=com.learningapp.hebrewkids',
    playProductId: env.PLAY_SUB_PRODUCT_ID || 'pro_monthly_20ils',
    proPriceLabel: env.PRO_PRICE_LABEL || '₪20',
    hasDb: Boolean(env.DB)
  });
}
