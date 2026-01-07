# DevShowcase

Une plateforme pour les développeurs permettant de publier et découvrir des projets, similaire à Product Hunt et Indie Hackers.

## Fonctionnalités

- Authentification utilisateur avec vérification par email et 2FA
- Gestion de projets (opérations CRUD)
- Système de votes
- Découverte publique de projets
- Panel administrateur pour la gestion des utilisateurs et projets
- Contrôle d'accès basé sur les rôles

## Stack Technique

- NestJS
- TypeORM
- PostgreSQL
- Redis
- JWT Authentication
- Documentation Swagger

## Démarrage

### Prérequis

- Node.js 20+
- Docker & Docker Compose

### Installation

1. Cloner le dépôt

2. Installer les dépendances :
```bash
npm install --legacy-peer-deps
```

3. Créer le fichier d'environnement :
```bash
cp .env.example .env
```

4. Mettre à jour le fichier `.env` avec votre configuration

### Lancement de l'application

1. Démarrer PostgreSQL et Redis avec Docker :
```bash
docker compose up -d
```

Attendre quelques secondes que PostgreSQL démarre, puis créer la base de données :
```bash
docker compose exec postgres psql -U postgres -c "CREATE DATABASE devshowcase;"
```

2. Installer les dépendances :
```bash
npm install --legacy-peer-deps
```

3. Créer l'utilisateur admin :
```bash
npm run seed
```

Cela crée un compte administrateur :
- Email : `admin@devshowcase.com`
- Mot de passe : `Admin123!`

4. Lancer l'application :
```bash
npm run start:dev
```

L'application sera disponible sur :
- API : http://localhost:3000
- Documentation Swagger : http://localhost:3000/api
- Mailpit (Visualiseur d'emails) : http://localhost:8025

## Documentation API

Accéder à la documentation Swagger sur http://localhost:3000/api

### Endpoints Principaux

#### Authentification
- `POST /auth/register` - Inscription d'un nouvel utilisateur
- `POST /auth/verify-email` - Vérification de l'email
- `POST /auth/login` - Connexion (envoie un code 2FA)
- `POST /auth/verify-2fa` - Vérification du code 2FA et obtention du JWT

#### Projets
- `GET /projects/public` - Liste des projets publiés
- `GET /projects/trending` - Projets tendance
- `POST /projects` - Créer un projet (authentifié)
- `POST /projects/:id/upvote` - Voter pour un projet

#### Administration
- `GET /admin/users` - Liste de tous les utilisateurs
- `GET /admin/stats` - Statistiques de la plateforme

## Structure du Projet

```
src/
├── common/              # Ressources partagées
│   ├── decorators/      # Décorateurs personnalisés
│   ├── enums/           # Énumérations
│   ├── filters/         # Filtres d'exceptions
│   ├── guards/          # Guards d'authentification
│   ├── interfaces/      # Interfaces
│   └── interceptors/    # Intercepteurs
├── config/              # Fichiers de configuration
├── modules/             # Modules fonctionnels
│   ├── auth/            # Authentification
│   ├── users/           # Gestion des utilisateurs
│   ├── projects/        # Gestion des projets
│   ├── admin/           # Opérations d'administration
│   └── mail/            # Service d'email
├── app.module.ts        # Module racine
└── main.ts              # Point d'entrée
```

## Variables d'Environnement

Voir `.env.example` pour toutes les variables d'environnement disponibles.

```env
NODE_ENV=development

DATABASE_HOST=localhost
DATABASE_PORT=5432
DATABASE_USERNAME=postgres
DATABASE_PASSWORD=postgres
DATABASE_NAME=devshowcase

REDIS_HOST=localhost
REDIS_PORT=6379

JWT_SECRET=dev-secret-key-please-change-in-production
JWT_EXPIRES_IN=7d

SMTP_HOST=localhost
SMTP_PORT=1025
MAIL_FROM_EMAIL=noreply@devshowcase.com
MAIL_FROM_NAME=DevShowcase

CORS_ORIGIN=*
PORT=3000
```

