# Migration vers Directus - Documentation

Ce document décrit la configuration et le déploiement du site avec Directus et Docker.

## Architecture

- **Frontend**: Next.js 14 (dans `/front`)
- **Backend**: Directus (CMS headless)
- **Base de données**: PostgreSQL
- **Déploiement**: Docker Compose

## Structure du projet

```
florine-clap/
├── docker-compose.yml          # Configuration Docker
├── .env.example                # Variables d'environnement
├── scripts/
│   ├── setup-directus-schema.js    # Création des collections Directus
│   ├── import-films.js             # Import des films
│   ├── import-mediations.js        # Import des médiations
│   └── import-videos-art.js        # Import des vidéos/art
└── front/
    ├── Dockerfile              # Image Docker Next.js
    ├── lib/
    │   ├── directus.ts        # Client Directus
    │   └── directus-types.ts  # Types TypeScript
    └── ...
```

## Installation et configuration

### 1. Prérequis

- Docker et Docker Compose installés
- Node.js 20+ (pour les scripts de migration)

### 2. Configuration des variables d'environnement

Copiez `.env.example` vers `.env` et configurez les variables :

```bash
cp .env.example .env
```

Éditez `.env` et modifiez les valeurs suivantes (importantes pour la sécurité) :

```env
# Générer des valeurs aléatoires pour KEY et SECRET
DIRECTUS_KEY=<valeur-aléatoire>
DIRECTUS_SECRET=<valeur-aléatoire>
DIRECTUS_ADMIN_EMAIL=admin@example.com
DIRECTUS_ADMIN_PASSWORD=<mot-de-passe-sécurisé>
```

### 3. Démarrage des services

```bash
# Démarrer tous les services (PostgreSQL, Directus, Next.js)
docker-compose up -d

# Voir les logs
docker-compose logs -f
```

Les services seront disponibles sur :
- **Directus Admin**: http://localhost:8055
- **Next.js Frontend**: http://localhost:3000

### 4. Configuration du schéma Directus

Une fois Directus démarré, exécutez le script pour créer les collections :

```bash
# Depuis la racine du projet
cd scripts
npm install  # Installer les dépendances (axios, gray-matter, etc.)
node setup-directus-schema.js
```

Ce script crée automatiquement les collections :
- `films`
- `mediations`
- `actus`
- `pages`

### 5. Importer des données

Pour importer des contenus dans Directus, utilisez les scripts d'import :

```bash
# Depuis le dossier scripts
cd scripts
npm install

# Importer les films
node import-films.js --file ../films-data.json

# Importer les médiations
node import-mediations.js --file ../mediations-data.json

# Importer les vidéos/art
node import-videos-art.js --file ../videos-art-data.json
```

**Note**: Les scripts nécessitent un token d'authentification Directus. Ajoutez-le dans `.env` :
```env
DIRECTUS_STATIC_TOKEN=votre-token-ici
```

## Utilisation

### Accès à Directus

1. Ouvrez http://localhost:8055
2. Connectez-vous avec les identifiants configurés dans `.env`
3. Vous pouvez maintenant gérer le contenu via l'interface Directus

### Développement local

Pour développer le frontend localement (sans Docker) :

```bash
cd front
npm install
npm run dev
```

Assurez-vous que `NEXT_PUBLIC_DIRECTUS_URL` dans `.env` pointe vers votre instance Directus.

### Build de production

```bash
# Build avec Docker
docker-compose build frontend

# Ou build local
cd front
npm run build
npm start
```

## Structure des collections Directus

### Films

- `slug` (string, unique) - Identifiant URL
- `title` (string) - Titre du film
- `image` (file) - Image principale
- `body` (text) - Contenu Markdown
- `vimeo_id`, `video_url` - Liens vidéo
- Champs techniques : `realisation`, `montage`, `son`, etc.

### Médiations

- `slug` (string, unique)
- `title` (string)
- `date` (datetime)
- `lieu` (string)
- `body` (text) - Contenu Markdown
- `gallery` (files) - Galerie d'images

### Actualités

- `slug` (string, unique)
- `title` (string)
- `date` (datetime)
- `body` (text) - Contenu Markdown
- `tags` (json) - Liste de tags

### Pages

- `slug` (string, unique)
- `title` (string)
- `body` (text) - Contenu Markdown
- `portrait`, `hero_image` (files)

## Déploiement en production

### 1. Préparer l'environnement

1. Configurez un serveur avec Docker
2. Copiez les fichiers du projet
3. Configurez `.env` avec les valeurs de production
4. Configurez un reverse proxy (nginx) pour :
   - `directus.example.com` → Directus (port 8055)
   - `example.com` → Next.js (port 3000)

### 2. Variables d'environnement de production

```env
# URLs publiques
DIRECTUS_PUBLIC_URL=https://directus.example.com
NEXT_PUBLIC_DIRECTUS_URL=https://directus.example.com

# Sécurité
DIRECTUS_KEY=<générer-une-valeur-aléatoire>
DIRECTUS_SECRET=<générer-une-valeur-aléatoire>
DIRECTUS_ADMIN_PASSWORD=<mot-de-passe-fort>

# Base de données (utiliser des credentials sécurisés)
POSTGRES_PASSWORD=<mot-de-passe-fort>
```

### 3. Déploiement

```bash
# Build et démarrage
docker-compose -f docker-compose.yml up -d --build

# Vérifier les logs
docker-compose logs -f
```

### 4. Sauvegarde

Pour sauvegarder la base de données :

```bash
# Sauvegarde
docker-compose exec postgres pg_dump -U directus directus > backup.sql

# Restauration
docker-compose exec -T postgres psql -U directus directus < backup.sql
```

## Scripts utiles

```bash
# Arrêter tous les services
docker-compose down

# Arrêter et supprimer les volumes (⚠️ supprime les données)
docker-compose down -v

# Redémarrer un service spécifique
docker-compose restart directus

# Voir les logs d'un service
docker-compose logs -f frontend
```

## Import de données

Les scripts d'import (`import-films.js`, `import-mediations.js`, `import-videos-art.js`) :
- Détectent automatiquement les entrées existantes
- Met à jour les entrées si le slug existe déjà
- Créent une nouvelle entrée sinon

Pour forcer une réimportation complète, supprimez d'abord les collections dans Directus.

## Dépannage

### Directus ne démarre pas

- Vérifiez que PostgreSQL est démarré : `docker-compose ps`
- Vérifiez les logs : `docker-compose logs directus`
- Vérifiez les variables d'environnement dans `.env`

### Le frontend ne peut pas se connecter à Directus

- Vérifiez `NEXT_PUBLIC_DIRECTUS_URL` dans `.env`
- Vérifiez que Directus est accessible : `curl http://localhost:8055/server/info`
- Vérifiez les CORS dans Directus (Settings > Settings > CORS)

### Erreurs d'import

- Vérifiez que Directus est démarré
- Vérifiez que le token est valide dans `.env`
- Vérifiez les logs des scripts d'import

## Support

Pour toute question ou problème, consultez :
- [Documentation Directus](https://docs.directus.io/)
- [Documentation Next.js](https://nextjs.org/docs)
- [Documentation Docker Compose](https://docs.docker.com/compose/)

