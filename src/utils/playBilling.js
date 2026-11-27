import { verifyPlayPurchase } from './cloudSync';

export async function purchasePlaySubscription(productId = 'pro_monthly_20ils') {
  const { NativePurchases, PURCHASE_TYPE } = await import('@capgo/native-purchases');
  const { isBillingSupported } = await NativePurchases.isBillingSupported();
  if (!isBillingSupported) {
    throw new Error('Google Play Billing is not available on this device.');
  }

  const tx = await NativePurchases.purchaseProduct({
    productIdentifier: productId,
    productType: PURCHASE_TYPE.SUBS,
    quantity: 1
  });

  const token = tx?.purchaseToken || tx?.transactionId;
  if (!token) {
    throw new Error('No purchase token returned by Google Play.');
  }

  return verifyPlayPurchase(token, productId);
}

export async function restorePlaySubscription(productId = 'pro_monthly_20ils') {
  const { NativePurchases, PURCHASE_TYPE } = await import('@capgo/native-purchases');
  await NativePurchases.restorePurchases();
  const { purchases } = await NativePurchases.getPurchases({
    productType: PURCHASE_TYPE.SUBS
  });

  const match = (purchases || []).find(
    (p) => p.productIdentifier === productId || p.purchaseToken
  );
  if (!match?.purchaseToken) {
    throw new Error('No active Google Play subscription found.');
  }

  return verifyPlayPurchase(match.purchaseToken, match.productIdentifier || productId);
}
