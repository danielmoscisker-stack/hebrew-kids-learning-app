import { json } from './_lib.js';

export async function onRequestGet({ env }) {
  return json({
    googleClientId: env.GOOGLE_CLIENT_ID || null,
    stripePaymentLink: env.STRIPE_PAYMENT_LINK || null,
    proPriceLabel: env.PRO_PRICE_LABEL || '$4.99',
    hasDb: Boolean(env.DB)
  });
}
