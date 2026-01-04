# Florine Clap - Site Web

Site web avec Next.js 14 et Directus CMS.

## 🚀 Démarrage rapide

### 1. Variables d'environnement

Créez un fichier `.env` à la racine avec :

```env
POSTGRES_USER=directus
POSTGRES_PASSWORD=directus
POSTGRES_DB=directus

DIRECTUS_KEY=change-me-to-a-random-value
DIRECTUS_SECRET=change-me-to-a-random-value
DIRECTUS_ADMIN_EMAIL=admin@example.com
DIRECTUS_ADMIN_PASSWORD=admin
DIRECTUS_PUBLIC_URL=http://localhost:8055
DIRECTUS_CORS_ORIGIN=http://localhost:3000

FRONTEND_PORT=3000
DIRECTUS_PORT=8055
NEXT_PUBLIC_DIRECTUS_URL=http://localhost:8055

# À générer après le premier démarrage
DIRECTUS_STATIC_TOKEN=
```

### 2. Démarrer les services

```bash
docker-compose up -d
```

### 3. Configurer Directus

Configurez Directus directement via l'interface d'administration :

1. Ouvrez Directus: http://localhost:8055
2. Connectez-vous avec les identifiants définis dans `.env`
3. Créez les collections nécessaires (films, médiations, vidéos d'art, etc.)
4. Configurez les permissions publiques

**Token statique (optionnel)** : Le frontend fonctionne sans token (utilise le token admin en fallback). Pour la production, créez un token dans Directus :

1. **Settings** > **Access Tokens** > **Create Token**
2. Sélectionnez le rôle **Public**
3. Copiez le token dans votre `.env` : `DIRECTUS_STATIC_TOKEN=votre-token`
4. Redémarrez : `docker-compose restart frontend`

### 4. Accéder aux services

- Frontend: http://localhost:3000
- Directus Admin: http://localhost:8055

## 🛠️ Commandes utiles

```bash
# Voir les logs
docker-compose logs -f

# Redémarrer un service
docker-compose restart frontend

# Arrêter tout
docker-compose down
```
