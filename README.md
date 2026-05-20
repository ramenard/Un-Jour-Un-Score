# Un-Jour-Un-Score

Ce projet est une application proposant des jeux en ligne comme le pierre-feuille-ciseaux ou pile ou face.
L'utilisateur, une fois inscrit et connecté, peut participer au jeu actuellement en cours en échange d'une pièce de jeu.  
Après une partie, le score de l'utilisateur est sauvegardé et comparé à ceux d'autres joueurs afin d'afficher le classement
dans la page d'accueil.  
Attention, le score sauvegardé est celui de la dernière partie de l'utilisateur ! Même si il s'avère moins bon que celui d'avant.  
Si l'utilisateur n'a plus de pièces de jeu, il est possible d'en acheter via Stripe (paiement intégré sur le web et sur mobile).  
Le site est accessible à l'adresse `https://un-jour-un-score.vercel.app/`.

## Structure du projet

```
Un-Jour-Un-Score/
├── api/        # Backend NestJS
├── client/     # Frontend web Next.js
├── mobile/     # Application mobile React Native / Expo
└── docker/     # Configuration Docker (MySQL)
```

## Prérequis

- Node.js (version 20 ou supérieure)
- npm (version 9 ou supérieure)
- Docker (par exemple Docker Engine pour Windows)
- Pour le mobile : Expo Go (Android/iOS) ou un émulateur

---

## Web (client + api)

### Installation

1. Clonez le dépôt :
    ```sh
    git clone https://github.com/ramenard/Un-Jour-Un-Score.git
    cd Un-Jour-Un-Score
    ```

2. Installez les dépendances du frontend :
    ```sh
    cd client
    npm install
    ```

3. Installez les dépendances du backend :
    ```sh
    cd api
    npm install
    ```

### Variables d'environnement

1. Créer un fichier `.env` dans le dossier `api` :
```sh
MYSQLHOST=localhost
MYSQLPORT=3307
MYSQLUSER=user
MYSQL_DATABASE=db
MYSQL_ROOT_PASSWORD=password
STRIPE_SECRET_KEY=
```

2. Créer un fichier `.env` dans le dossier `client` :
```sh
API_URL='127.0.0.1'
API_PORT=':3001'
SESSION_SECRET='jwt'
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=
STRIPE_SECRET_KEY=
```
La clé `SESSION_SECRET` est réglée sur cette valeur pour être conforme au backend (format non sécurisé, à changer en production).  
Pour les clés Stripe, se créer un compte sur https://stripe.com/fr puis accéder à **API Keys** depuis le dashboard.

### Exécution

1. Démarrer la base de données depuis le dossier `docker` :
```sh
docker compose up
```

2. Démarrer le backend depuis le dossier `api` :
```sh
npm run start:dev
```

3. Démarrer le frontend depuis le dossier `client` :
```sh
npm run dev
```

### Précisions

Le mot de passe de l'utilisateur admin créé par défaut est `securepassword6!`.  
Le cron situé dans le backend, ayant pour rôle de cycler les jeux activés, est actuellement
configuré pour faire tourner le jeu actif toutes les 10 minutes avec un trou de 2 minutes sans activité.

---

## Mobile (React Native / Expo)

Application React Native avec Expo Router ciblant Android et iOS, utilisant directement l'API NestJS.

### Fonctionnalités

- Authentification JWT (login / inscription)
- Jeux disponibles : Pierre Papier Ciseaux, Pile ou Face
- Classement en temps quasi-réel
- Profil utilisateur avec gestion des jetons
- Achat de jetons premium via **Stripe** (`@stripe/stripe-react-native`)

### Installation

```sh
cd mobile
cp .env.example .env
# Éditer .env avec l'URL correcte selon l'environnement (voir ci-dessous)
npm install expo --legacy-peer-deps
npx expo install
```

> **Note** : Le fichier `.npmrc` à la racine de `mobile/` inclut `legacy-peer-deps=true` pour résoudre les conflits de peer dependencies de l'écosystème Expo SDK 55. Ne pas supprimer ce fichier.

### Variables d'environnement

Copier `.env.example` en `.env` et ajuster selon l'environnement :

```sh
# Android Emulator
EXPO_PUBLIC_API_URL=http://10.0.2.2:3001

# iOS Simulator
EXPO_PUBLIC_API_URL=http://localhost:3001

# Appareil physique (remplacer par l'IP locale de la machine)
EXPO_PUBLIC_API_URL=http://192.168.X.X:3001

# Clé publique Stripe (test : pk_test_...)
EXPO_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_REMPLACE_MOI
```

### Lancement

```sh
cd mobile
npx expo start
```

Scanner le QR code avec **Expo Go** (Android) ou l'appareil photo (iOS).  
Pour lancer directement sur un émulateur Android :

```sh
npx expo run:android
```

### Structure

```
mobile/
├── app/
│   ├── _layout.tsx              # Root layout (AuthProvider + UserProvider)
│   ├── index.tsx                # Redirect auth/tabs selon état
│   ├── (auth)/
│   │   ├── login.tsx            # Formulaire de connexion
│   │   └── register.tsx         # Formulaire d'inscription
│   ├── (tabs)/
│   │   ├── index.tsx            # Onglet Jouer (jeu actif + coins)
│   │   ├── leaderboard.tsx      # Classement
│   │   └── profile.tsx          # Profil + achat de jetons (Stripe)
│   └── game/
│       ├── coin-flip.tsx        # Jeu Pile ou Face
│       └── rock-paper-scissors.tsx  # Jeu Pierre Papier Ciseaux
├── src/
│   ├── api/                     # Couche Axios (intercepteur JWT Bearer)
│   ├── context/                 # AuthContext + UserContext
│   ├── components/              # Composants réutilisables
│   ├── theme/                   # Palette de couleurs et tokens de design
│   └── types/                   # Types TypeScript miroir du backend
└── .env.example                 # Template des variables d'environnement
```

---

## Licence

Ce projet est sous licence MIT.