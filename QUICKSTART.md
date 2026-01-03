# 🚀 Démarrage rapide - Local

Ce guide vous permet de lancer l'environnement complet en local pour tester avant le déploiement sur serveur.

## Prérequis

- Docker et Docker Compose installés
- Node.js 20+ (pour les scripts de migration)

## Installation en 5 minutes

### 1. Créer le fichier `.env`

```bash
cp .env.example .env
```

### 2. Générer des clés sécurisées (optionnel mais recommandé)

Pour générer des valeurs aléatoires pour `DIRECTUS_KEY` et `DIRECTUS_SECRET` :

```bash
# Sur macOS/Linux
openssl rand -base64 32

# Utilisez cette commande deux fois pour générer KEY et SECRET
```

Puis éditez `.env` et remplacez :
```env
DIRECTUS_KEY=<valeur-générée-1>
DIRECTUS_SECRET=<valeur-générée-2>
DIRECTUS_ADMIN_PASSWORD=<votre-mot-de-passe>
```

### 3. Démarrer les services

```bash
docker-compose up -d
```

Cette commande démarre :
- ✅ PostgreSQL (base de données)
- ✅ Directus (CMS headless sur http://localhost:8055)
- ✅ Next.js (frontend sur http://localhost:3000)

### 4. Vérifier que tout fonctionne

```bash
# Voir les logs
docker-compose logs -f

# Vérifier l'état des services
docker-compose ps
```

### 5. Accéder à Directus

1. Ouvrez http://localhost:8055
2. Connectez-vous avec :
   - Email : `admin@example.com` (ou celui défini dans `.env`)
   - Mot de passe : `admin` (ou celui défini dans `.env`)

### 6. Configurer le schéma Directus

```bash
# Installer les dépendances des scripts
cd scripts
npm install

# Créer les collections dans Directus
node setup-directus-schema.js
```

**Note** : Pour exécuter ce script, vous devez d'abord créer un token statique dans Directus :
1. Allez dans Directus → Settings → Access Tokens
2. Créez un nouveau token
3. Copiez le token et ajoutez-le dans `.env` :
   ```env
   DIRECTUS_STATIC_TOKEN=votre-token-ici
   ```

### 7. Importer des données (optionnel)

Pour importer des contenus dans Directus :

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

### 8. Accéder au site

- **Frontend** : http://localhost:3000
- **Directus Admin** : http://localhost:8055

## Commandes utiles

```bash
# Arrêter tous les services
docker-compose down

# Redémarrer un service spécifique
docker-compose restart directus

# Voir les logs d'un service
docker-compose logs -f frontend
docker-compose logs -f directus

# Rebuild le frontend après modification
docker-compose build frontend
docker-compose up -d frontend

# Accéder au shell du conteneur Directus
docker-compose exec directus sh

# Accéder à PostgreSQL
docker-compose exec postgres psql -U directus directus
```

## Développement local (sans Docker pour le frontend)

Si vous préférez développer le frontend localement (plus rapide pour le hot-reload) :

```bash
# 1. Démarrer seulement PostgreSQL et Directus
docker-compose up -d postgres directus

# 2. Dans un autre terminal, lancer Next.js en dev
cd front
npm install
npm run dev
```

Le frontend sera sur http://localhost:3000 et se connectera à Directus sur http://localhost:8055.

## Problèmes courants

### Directus ne démarre pas

```bash
# Vérifier les logs
docker-compose logs directus

# Vérifier que PostgreSQL est démarré
docker-compose ps postgres

# Redémarrer Directus
docker-compose restart directus
```

### Le frontend ne peut pas se connecter à Directus

1. Vérifiez que Directus est accessible : http://localhost:8055
2. Vérifiez `NEXT_PUBLIC_DIRECTUS_URL` dans `.env`
3. Vérifiez les CORS dans Directus (Settings → Settings → CORS)

### Erreur de permissions Docker

Sur Linux, vous pourriez avoir besoin de :
```bash
sudo docker-compose up -d
```

## Prochaines étapes

Une fois que tout fonctionne en local :
1. ✅ Testez la création/modification de contenu dans Directus
2. ✅ Vérifiez que le frontend affiche correctement les données
3. ✅ Consultez `README-MIGRATION.md` pour le déploiement en production

## Architecture

```
┌─────────────┐
│   Next.js   │  http://localhost:3000
│  (Frontend) │
└──────┬──────┘
       │ API REST
       │
┌──────▼──────┐
│  Directus   │  http://localhost:8055
│   (CMS)     │
└──────┬──────┘
       │
┌──────▼──────┐
│ PostgreSQL  │  Port interne
│  (Database) │
└─────────────┘
```

Tout est self-hosted et fonctionne exactement comme sur votre serveur de production ! 🎉

