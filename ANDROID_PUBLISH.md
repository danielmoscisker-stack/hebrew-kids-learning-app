# Android & Google Play Publishing Guide

This project is pre-configured with Capacitor 8 (`com.learningapp.hebrewkids`) and follows Google Play's **Designed for Families** requirements (100% offline audio & fonts, arithmetic Parental Gate before settings/purchases, zero ads, zero third-party ad trackers).

## 1. Prerequisites (One-Time on Build Machine)
- Install **JDK 21** (required by Android Gradle / `compileSdk = 36`)
- Install **Android Studio** (with Android SDK 36 & Build-Tools)

## 2. Generate Release Keystore (One-Time)
```bash
keytool -genkey -v -keystore android/release-key.jks -keyalg RSA -keysize 2048 -validity 10000 -alias hebrewkids
```
Create `android/keystore.properties` (already gitignored!):
```properties
storePassword=YOUR_STORE_PASSWORD
keyPassword=YOUR_KEY_PASSWORD
keyAlias=hebrewkids
storeFile=../release-key.jks
```

## 3. Build Signed Play Store App Bundle (`.aab`)
```bash
npm run android:sync
cd android
./gradlew bundleRelease
```
Output AAB: `android/app/build/outputs/bundle/release/app-release.aab`

## 4. Google Play Console Store Listing & Data Safety
- **Target audience:** Ages 5 and under (Families)
- **Ads:** No ("My app does not contain ads")
- **Privacy Policy URL:** `https://kids.moscisker.info/privacy.html`
- **Data Safety:**
  - *Is data collected?* Optional for parents only (Google Sign-In inside the Parental Gate to back up child progress to Cloudflare D1; children never log in).
  - *Data types (when parent signs in):* Name, Email address, User IDs (strictly for App Functionality / Account & Cloud Sync, encrypted in transit, not shared with third parties).
- **App Icon (512x512):** `public/icon-512.png`
- **Feature Graphic (1024x500) & Screenshots:** Capture 2–4 phone/tablet screenshots from `https://kids.moscisker.info/` (or Android emulator).

## 5. Optional Web Environment Variables (Cloudflare Pages)
In Cloudflare Dashboard → **Pages → hebrew-kids → Settings → Variables and Secrets**, you can optionally add:
- `GOOGLE_CLIENT_ID` — Enables the **Sign in with Google** button inside Parent Zone (add `https://kids.moscisker.info` to Authorized JavaScript Origins in Google Cloud Console).
- `STRIPE_PAYMENT_LINK` — Enables the web checkout button inside the Parental-Gated Pro Upgrade modal (automatically hidden inside Android native builds per Google Play policy).
- `PRO_PRICE_LABEL` — Display price label (defaults to `$4.99`).
- **Default Family Promo Code (already seeded in D1):** `FAMILY4KIDS`
