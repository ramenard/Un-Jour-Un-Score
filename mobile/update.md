# Mobile App — Journal des décisions

## Vue d'ensemble

Application React Native / Expo pour *Un Jour Un Score*, développée à partir du backend NestJS existant (`/api`) et en s'inspirant du frontend web (`/client`).

---

## Choix techniques

### Framework & routing
- **Expo SDK 55** + **Expo Router v5** (file-based routing, identique à Next.js App Router) — initialement ciblé SDK 52, mis à jour vers SDK 55 (version actuelle)
- Navigation par onglets (Bottom Tabs) : Jouer · Classement · Profil
- Écrans de jeu en stack séparé (slide-from-bottom)
- Redirect automatique vers `/login` si non authentifié

### Auth
- JWT stocké dans **AsyncStorage** (`@react-native-async-storage/async-storage`)
- Décodage du payload JWT en JS pur (`atob`) pour extraire l'`id` et le `role` sans dépendance externe
- Vérification de l'expiration du token au démarrage
- `AuthContext` miroir du `AuthContext` web, adapté : plus de cookies, token Bearer direct

### Appels API
- **Axios** avec intercepteur : ajout automatique du header `Authorization: Bearer <token>`
- URL configurée via `EXPO_PUBLIC_API_URL` (variable d'environnement Expo)
- Copier `.env.example` → `.env` et ajuster l'URL selon l'environnement :
  - Android émulateur : `http://10.0.2.2:3001`
  - iOS simulateur : `http://localhost:3001`
  - Appareil physique : `http://192.168.x.x:3001`

### État global
- **React Context** uniquement (AuthContext + UserContext), même pattern que le web
- Pas de Zustand/Redux — la complexité ne le justifie pas pour ce volume de données

### Styling
- **React Native StyleSheet** (pas de NativeWind) : plus fiable, pas de configuration babel supplémentaire
- Thème centralisé dans `src/theme/index.ts` : couleurs, espacements, rayons, typographie
- Design gaming sombre : fond `#080812`, accent violet `#7c3aed`, cyan `#06b6d4`, or `#f59e0b`

### Animations
- **Animated API** React Native (pas Reanimated) pour les animations des jeux
- CoinFlip : animation `scaleX` (effet flip 3D simulé), 5 cycles accélérés
- RPS : blink de l'opacité pendant "l'attente", puis spring reveal sur le résultat
- Score : spring pop (+scale 1.4) à chaque point gagné

---

## Structure du projet

```
mobile/
├── app/
│   ├── _layout.tsx          # Root layout (AuthProvider + UserProvider)
│   ├── index.tsx            # Redirect auth/tabs selon état
│   ├── (auth)/
│   │   ├── login.tsx        # Formulaire de connexion
│   │   └── register.tsx     # Formulaire d'inscription
│   ├── (tabs)/
│   │   ├── index.tsx        # Onglet Jouer (jeu actif + coins)
│   │   ├── leaderboard.tsx  # Classement en temps quasi-réel
│   │   └── profile.tsx      # Profil + gestion des jetons
│   └── game/
│       ├── coin-flip.tsx    # Jeu Pile ou Face
│       └── rock-paper-scissors.tsx  # Jeu Pierre Papier Ciseaux
├── src/
│   ├── api/                 # Couche API (Axios, endpoints NestJS directs)
│   ├── context/             # AuthContext + UserContext
│   ├── components/          # Button, Card, LoadingSpinner, LeaderboardTable
│   ├── theme/               # Palette + tokens de design
│   └── types/               # Types TypeScript miroir du backend
└── .env.example             # Configuration URL API
```

---

## Intégration API

Tous les appels vont directement au NestJS (`/api`) sans proxy Next.js intermédiaire :

| Fonction | Endpoint NestJS |
|---|---|
| Login | `POST /security/login` |
| Register | `POST /security/register` |
| Profil | `GET /users/:id` |
| Peut jouer ? | `GET /users/:id/isAble` |
| Position leaderboard | `GET /users/:id/leaderboard` |
| Mettre à jour jetons | `PATCH /users/:id` |
| Sauvegarder score | `PATCH /users/:id/score` |
| Jeu actif | `GET /games/current` |
| Leaderboard actuel | `GET /leaderboards/current` |
| Classement général | `GET /leaderboards/user-leaderboard` |
| Vérifier participation | `GET /has-played?userId=&leaderboardId=` |
| Créer participation | `POST /has-played` |

---

## Ce qui est exclu

- **Stripe / paiement** : intentionnellement ignoré (cf. consigne)
- **Dashboard admin** : non pertinent sur mobile
- **Badges** : l'API est disponible, non implémenté dans ce sprint (peut être ajouté dans `profile.tsx`)

---

## Démarrage

```bash
cd mobile
cp .env.example .env
# Éditer .env avec l'URL correcte selon ton environnement
npm install expo --legacy-peer-deps
npx expo install expo-router expo-constants expo-font expo-splash-screen expo-status-bar @expo/vector-icons @react-native-async-storage/async-storage react react-native react-native-gesture-handler react-native-reanimated react-native-safe-area-context react-native-screens
npx expo start
```

---

## Difficultés d'installation (2026-04-29)

### Problème : conflits de peer dependencies npm

Plusieurs blocages rencontrés lors du `npm install` initial :

1. **`react@18.3.2` inexistant** — la version `18.3.2` de React n'existe pas sur npm (dernière React 18 = `18.3.1`). Idem pour `react-native@0.76.7` (inexistant). Ces versions avaient été spécifiées manuellement en ciblant SDK 52, mais elles ne correspondaient pas aux packages réels sur le registre npm.

2. **Décalage de version SDK** — l'environnement local avait `npx expo install` qui résolvait vers Expo SDK 55 (pas SDK 52 comme prévu initialement). Les versions de l'ensemble de l'écosystème (React 19, React Native 0.83, etc.) étaient donc incompatibles avec les pins manuels initiaux.

3. **`react-dom@19.2.5` vs `react@19.2.0`** — conflit de patch version interne à Expo lors de `npx expo install` car il appelait `npm install` sans `--legacy-peer-deps`.

### Solution appliquée

- Ajout d'un fichier **`.npmrc`** avec `legacy-peer-deps=true` : applique le flag à tous les appels `npm install`, y compris ceux lancés en interne par `npx expo install`.
- Suppression des pins manuels de `react` et `react-native` dans `package.json` — ces versions sont désormais gérées entièrement par `npx expo install`.
- Installation en deux temps :
  1. `npm install expo --legacy-peer-deps` (installe Expo seul en premier)
  2. `npx expo install [packages...]` (Expo résout les versions compatibles SDK 55)

### À retenir

Ne jamais spécifier manuellement les versions de `react`, `react-native` et des packages de l'écosystème RN dans `package.json`. Utiliser exclusivement `npx expo install` pour ces packages — c'est lui qui connaît la matrice de compatibilité du SDK installé.

---

## Date de création

2026-04-29
