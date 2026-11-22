# Android & Google Play Publishing Guide

This project is pre-configured with Capacitor 8 (`com.learningapp.hebrewkids`) and complies with Google Play's **Designed for Families** requirements (100% offline audio & fonts, Parental Gate for settings, zero ads, zero tracking).

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

## 4. Google Play Console Checklist
- **Target audience:** Ages 5 and under (Families)
- **Ads:** No
- **Data safety:** No user data collected or shared
- **Privacy Policy URL:** Host `PRIVACY_POLICY.md` (e.g. via your GitHub repo or Cloudflare URL `/privacy` if added)
- **App Icon (512x512):** `public/icon-512.png`
