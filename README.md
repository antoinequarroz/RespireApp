# Respire

Application mobile iOS/Android de sevrage tabagique construite avec Expo et React Native.

Respire suit localement:
- le temps sans fumer
- les cigarettes evitees
- l argent economise
- la progression sante
- les milestones
- un mode SOS avec respiration guidee et mini-jeu

## Stack

- Expo SDK 56
- React Native 0.85
- TypeScript strict
- Expo Router
- NativeWind v4
- Zustand + AsyncStorage
- Expo Notifications
- Expo Widgets + `react-native-android-widget`
- RevenueCat (`react-native-purchases`)
- Reanimated
- `react-native-svg`
- `i18n-js` + `expo-localization`
- ESLint + Prettier
- EAS Build

## Fonctionnalites MVP

- Onboarding en 8 ecrans
- Home avec compteur live
- Stats avec courbe d economies
- Mode SOS plein ecran
- Journal Premium
- Paywall RevenueCat
- Settings: langue, theme, rappels, abonnement
- Base widgets iOS/Android

## Prerequis

- Node.js 20+
- npm
- compte Expo / EAS
- Xcode pour build iOS local si necessaire
- Android Studio pour Android local si necessaire

## Installation

```bash
npm install
```

## Lancement local

```bash
npx expo start
npx expo start --ios
npx expo start --android
npm run start:dev-client
```

Pour tester RevenueCat, widgets et les modules natifs hors Expo Go:

```bash
npm run build:dev:android
adb install -r ton-build.apk
npm run start:dev-client
```

Le serveur Metro a ete valide localement sur:

```bash
http://localhost:8081
```

## Qualite

```bash
npm run lint
npm run typecheck
npm run format:check
```

## Variables d environnement

Creer un fichier `.env` a la racine:

```bash
EXPO_PUBLIC_REVENUECAT_IOS_API_KEY=your_ios_key
EXPO_PUBLIC_REVENUECAT_ANDROID_API_KEY=your_android_key
```

Sans ces cles, le paywall reste affichable mais les achats ne seront pas operationnels.

## Configuration Expo / EAS

Le projet utilise:
- scheme deep link: `respire://`
- iOS bundle id: `com.respire.app`
- Android package: `com.respire.app`

Le `projectId` EAS est deja renseigne dans `app.json`.

## Builds EAS

Preview:

```bash
eas build --platform ios --profile preview
eas build --platform android --profile preview
```

Production:

```bash
eas build --platform all --profile production
```

Soumission:

```bash
eas submit --platform ios
eas submit --platform android
```

## Architecture

```text
app/
  (onboarding)/
  (tabs)/
  milestone/[id].tsx
  paywall.tsx
  sos.tsx

components/
  ui/
  sections/
  domain/

constants/
hooks/
locales/
services/
store/
widgets/
```

## Structure metier

- `store/userStore.ts`: profil fumeur, langue, theme, onboarding, rappels
- `store/progressStore.ts`: journal, cravings, milestones celebres, permissions
- `store/premiumStore.ts`: etat Premium et offerings
- `hooks/useCounter.ts`: compteur temps reel
- `hooks/useSavings.ts`: economies + equivalent
- `hooks/useHealthStats.ts`: timeline sante
- `hooks/useMilestones.ts`: prochain milestone + progression
- `hooks/useSos.ts`: etat du mode SOS

## Notes importantes

- Toutes les donnees MVP sont stockees localement.
- Le projet est configure en TypeScript strict.
- Les textes sont centralises dans `locales/fr.json` et `locales/en.json`.
- L onboarding est skippable en `__DEV__`.
- Les widgets et achats in-app demandent un dev build ou un build EAS, pas Expo Go.
- La logique de notification et la structure widget sont posees, mais la validation finale doit se faire sur appareils/builds natifs.

## Etat actuel

Valide localement:
- `npm run lint`
- `npm run typecheck`
- `npx expo start`

Non verifies dans cet environnement:
- build iOS complet
- build Android complet
- achat RevenueCat reel
- rendu widget sur appareil

## Depot

GitHub:

```text
https://github.com/antoinequarroz/RespireApp
```
