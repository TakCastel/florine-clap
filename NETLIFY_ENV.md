# Variables d'environnement pour Netlify

## Variables nécessaires pour le build

Ces variables doivent être configurées dans Netlify (Site settings > Environment variables) :

- `SITE_URL` - URL du site (ex: `https://florineclap.com`)
- `NEXT_PUBLIC_DIRECTUS_URL` - URL publique de l'API Directus (ex: `https://api.florineclap.com`)
- `DIRECTUS_STATIC_TOKEN` - Token statique Directus pour les appels API (optionnel mais recommandé)

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

