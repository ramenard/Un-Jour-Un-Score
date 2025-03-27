# Un-Jour-Un-Score

Ce projet est une application proposant un site de jeux en ligne comme le pierre-feuille-ciseaux.
L'utilisateur, une fois inscrit et connecté, peut participer au jeu actuellement en cours en échange d'une pièce de jeu.  
Après une partie, le score de l'utilisateur est sauvegardé est comparé à ceux d'autres joueurs afin d'afficher le classement
dans la page d'accueil.  
Attention, le score sauvegardé est celui de la dernière partie de l'utilisateur ! Même si il s'avère moins bon que celui d'avant.  
Si l'utilisateur n'a plus de pièces de jeu, il est possible d'acheter des pièces premiums à échanger contre de nouveaux essais.  
Le site est accessible à l'adresse `https://un-jour-un-score.vercel.app/`.

## Prérequis

- Node.js (version 20 ou supérieure)
- npm (version 9 ou supérieure)
- docker (par exemple Docker Engine pour windows)

## Démarrage

### Installation du projet en local

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

### Ajout des variables d'environnements requises

1. Créer un fichier .env dans le dossier api et y ajouter : 
```sh
    MYSQLHOST=localhost
    MYSQLPORT=3307
    MYSQLUSER=user
    MYSQL_DATABASE=db
    MYSQL_ROOT_PASSWORD=password 
```

2. Créer un fichier .env dans le dossier client et y ajouter :
```sh
    API_URL='127.0.0.1'
    API_PORT=':3001'
    SESSION_SECRET='jwt'
    NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=
    STRIPE_SECRET_KEY=
```
La clé "SESSION_SECRET" est réglé sur cette valeur pour être conforme au backend. Mais en effet ce n'est pas un format adéquat.  
Pour les clés Stripe, se créer un compte sur https://stripe.com/fr puis accéder à API KEY depuis le dashboard.



### Exécution

1. Démarrer le docker avec le mysql depuis le dossier docker :
```sh
    docker compose up
```

2. Démarrer le backend depuis le dossier api :
```sh
    npm run start:dev
```

3. Démarrer le frontend depuis le dossier client :
```sh
    npm run dev
```

### Précision

Le mot de passe de l'utilisateur admin créé par défaut est 'securepassword6!'.  
Le cron situé dans le backend, ayant pour rôle de cycler les jeux activés, est actuellement 
configuré pour faire tourner le jeu actif toutes les 10 minutes avec un trou de 2 minutes sans activité.

## Licence

Ce projet est sous licence MIT.
```