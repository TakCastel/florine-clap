# Variables d'environnement selon l'environnement

## Architecture

- **Local** : Développement sur votre machine (peut utiliser `localhost`)
- **Netlify** : Préproduction (doit utiliser des URLs publiques)
- **Serveur OVH** : Production (doit utiliser des URLs publiques)

## Variables nécessaires pour Netlify (préprod)

Ces variables doivent être configurées dans Netlify (Site settings > Environment variables) :

- `SITE_URL` - URL du site de préprod (ex: `https://preprod.florineclap.com`)
- `NEXT_PUBLIC_DIRECTUS_URL` - URL publique de l'API Directus (ex: `https://cms.florineclap.com`)
- `DIRECTUS_STATIC_TOKEN` - Token statique Directus pour les appels API (optionnel mais recommandé)

⚠️ **IMPORTANT** : `NEXT_PUBLIC_DIRECTUS_URL` est **obligatoire** sur Netlify. Sans cette variable, le site essaiera d'utiliser `localhost` et déclenchera une demande d'accès réseau.

## Variables à NE PAS configurer dans Netlify

Ces variables sont utilisées uniquement pour Docker/Directus et ne doivent **PAS** être configurées dans Netlify car elles contiennent des secrets :

- ❌ `FRONTEND_PORT` - Port du frontend (Docker uniquement)
- ❌ `DIRECTUS_PORT` - Port de Directus (Docker uniquement)
- ❌ `DIRECTUS_ADMIN_EMAIL` - Email admin Directus (non utilisé dans le frontend)
- ❌ `DIRECTUS_ADMIN_PASSWORD` - Mot de passe admin Directus (non utilisé dans le frontend)
- ❌ `DIRECTUS_PUBLIC_URL` - URL publique Directus (redondant avec NEXT_PUBLIC_DIRECTUS_URL)
- ❌ `POSTGRES_PASSWORD` - Mot de passe PostgreSQL (Docker uniquement)
- ❌ `POSTGRES_USER` - Utilisateur PostgreSQL (Docker uniquement)
- ❌ `POSTGRES_DB` - Base de données PostgreSQL (Docker uniquement)
- ❌ `DIRECTUS_KEY` - Clé Directus (Docker uniquement)
- ❌ `DIRECTUS_SECRET` - Secret Directus (Docker uniquement)
- ❌ `DIRECTUS_CORS_ORIGIN` - CORS Directus (Docker uniquement)

## Configuration Netlify

Dans l'interface Netlify, allez dans :
1. Site settings > Environment variables
2. Supprimez toutes les variables listées ci-dessus dans "Variables à NE PAS configurer"
3. Gardez uniquement : `SITE_URL`, `NEXT_PUBLIC_DIRECTUS_URL`, et `DIRECTUS_STATIC_TOKEN`

