# 🚀 Guide de déploiement

## Workflow complet : Local → Serveur

### 1. En local : Modifier et exporter

Après avoir modifié la structure Directus (collections, champs, etc.) :

```bash
# Depuis le dossier front/
cd front
npm run directus:export
```

Cela exporte le schéma dans `directus/snapshots/schema.yaml`.

### 2. Committer les modifications

```bash
# Depuis la racine du projet
git add .
git commit -m "Modifications + mise à jour du schéma Directus"
git push
```

### 3. Sur le serveur : Déployer

**Option A : Déploiement automatique complet**

```bash
./scripts/deploy.sh
```

Ce script fait automatiquement :
- `git pull` pour récupérer les modifications
- Application du schéma Directus (si modifié)
- Reconstruction du frontend
- Redémarrage du conteneur

**Option B : Déploiement manuel étape par étape**

```bash
# 1. Récupérer les modifications
git pull

# 2. Appliquer le schéma Directus (si modifié)
cd front
npm run directus:apply
cd ..

# 3. Reconstruire et redémarrer le frontend
docker compose up -d --build frontend

```

**Option C : Appliquer uniquement le schéma Directus (sans rebuild du frontend)**

Si vous avez seulement modifié le schéma Directus et que vous voulez l'appliquer sans reconstruire le frontend :

```bash
# 1. Récupérer les modifications
git pull

# 2. Appliquer uniquement le schéma Directus
./scripts/apply-schema.sh
```

**Option D : Déploiement rapide (code uniquement, sans schéma)**

```bash
git pull && docker compose up -d --build frontend
```

Ou avec le script :

```bash
./scripts/deploy.sh --skip-schema
```

## 📋 Commandes utiles

### Gestion du schéma Directus

```bash
# Exporter le schéma (local)
cd front && npm run directus:export

# Appliquer le schéma (serveur)
cd front && npm run directus:apply

# Prévisualiser les modifications (sans appliquer)
cd front && npm run directus:apply:dry-run
```

### Déploiement

```bash
# Déploiement complet (code + schéma + rebuild frontend)
./scripts/deploy.sh

# Appliquer uniquement le schéma Directus (sans rebuild frontend)
./scripts/apply-schema.sh

# Déploiement sans schéma (code uniquement)
./scripts/deploy.sh --skip-schema
```

### Cache et première visite

Les pages listes (Films, Vidéos-art, Médiations, Actus) affichent un **skeleton** dès le clic, puis le contenu se charge. Aucune configuration supplémentaire. Optionnel : après déploiement, `GET /api/warmup` pré-remplit le cache pour que le contenu s’affiche plus vite (aucune clé requise).

## ⚠️ Notes importantes

- Le schéma Directus est versionné dans `directus/snapshots/schema.yaml`
- Les données (contenu) ne sont **pas** affectées par l'application d'un snapshot
- Toujours tester en local avant de déployer
- En cas d'erreur lors de l'application du schéma, vérifiez les logs

### Variables d'environnement requises

Pour appliquer le schéma Directus, assurez-vous que votre fichier `.env` à la racine du projet contient :

```env
DIRECTUS_ADMIN_EMAIL=votre-email@example.com
DIRECTUS_ADMIN_PASSWORD=votre-mot-de-passe
DIRECTUS_PUBLIC_URL=http://votre-serveur:8055
```

Le script cherche automatiquement le fichier `.env` à la racine du projet. Si ces variables ne sont pas définies, vous obtiendrez un message d'erreur détaillé.

### Production : éviter Mixed Content (HTTPS)

Si le site est servi en **HTTPS** (ex. `https://www.florineclap.com`), les assets Directus doivent aussi être chargés en HTTPS. Sinon le navigateur bloque les requêtes (Mixed Content).

**Sur le serveur de production**, dans le `.env` utilisé par `docker compose build frontend`, définir l’URL **publique HTTPS** de Directus (pas `localhost`) :

```env
# Exemple : Directus exposé derrière le même domaine ou un sous-domaine
DIRECTUS_PUBLIC_URL=https://api.florineclap.com
NEXT_PUBLIC_DIRECTUS_URL=https://api.florineclap.com
```

- `NEXT_PUBLIC_DIRECTUS_URL` est figée au **build** du frontend : après modification, il faut **reconstruire** le front (`docker compose up -d --build frontend` ou `./scripts/deploy.sh`).
- En production, le code refuse d’utiliser `localhost` pour les assets ; si cette variable pointe encore vers localhost, les images Directus ne s’afficheront pas tant que la bonne URL HTTPS n’est pas configurée et le front reconstruit.

### Erreur WebSocket HMR en production

Si vous voyez dans la console : `WebSocket connection to 'wss://.../_next/webpack-hmr' failed`, c’est que le frontend tourne en mode **développement** (`npm run dev`). Le HMR (Hot Module Replacement) ne sert qu’en dev.

Pour une vraie **production** (sans cette erreur, sans outil de dev) : construire l’app puis lancer le serveur standalone, par exemple en utilisant un Dockerfile avec une cible `production` qui fait `next build` puis `node server.js` (avec `output: 'standalone'`), au lieu de `npm run dev`. Le `docker-compose.yml` actuel est orienté dev (volumes montés, `npm run dev`).

## 🔍 Vérification après déploiement

```bash
# Vérifier que les conteneurs tournent
docker compose ps

# Voir les logs du frontend
docker compose logs -f frontend

# Voir les logs de Directus
docker compose logs -f directus
```

## Cache et revalidation à la demande

Les pages (accueil, films, médiations, vidéos/art, actualités, bio, pages légales) sont mises en cache **24 h** (`revalidate = 86400`). Pour mettre à jour le site dès qu’un contenu est modifié dans Directus, sans attendre 24 h :

1. **Variable d’environnement** (frontend / serveur Next) : définir `REVALIDATE_SECRET` avec une valeur secrète (ex. générée avec `openssl rand -hex 32`).

2. **Webhook Directus** : créer un Flow ou Webhook qui envoie une requête **POST** vers  
   `https://votre-domaine.com/api/revalidate`  
   avec :
   - Header : `Authorization: Bearer <REVALIDATE_SECRET>`
   - Body JSON (optionnel) : `{ "path": "/films" }` ou `{ "paths": ["/films", "/mediations"] }`  
   Si aucun `path` n’est fourni, les routes principales sont revalidées (/, /films, /mediations, etc.).

Après une requête réussie, les pages concernées sont régénérées au prochain hit.

## Lighthouse et performances

- **Minification (JS/CSS)** : en mode développement (`npm run dev`), Next.js ne minifie pas. Les alertes Lighthouse « Minify JavaScript » / « Minify CSS » disparaissent en production (`npm run build && npm run start`).
- **LCP** : les pages listes (films, médiations, vidéos/art) préchargent l’image hero via les metadata ; l’image hero a `priority={true}`.
- **Back/forward cache** : si Lighthouse signale « Page prevented back/forward cache », vérifier qu’aucun listener `beforeunload` / `unload` n’est utilisé et que les en-têtes de cache permettent la mise en cache navigateur.

## Vidéo hero (page d'accueil)

Pour que la vidéo de fond se charge et démarre plus vite : la page précharge la vidéo et fait un preconnect (metadata), le lecteur a `preload="auto"` et `fetchPriority="high"`, et la balise `<video>` est rendue dès le premier affichage. Côté fichier : privilégier un MP4 avec moov en tête (`ffmpeg -movflags +faststart`) ou un WebM, résolution adaptée (ex. 1280×720).
