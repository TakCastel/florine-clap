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

### 2. Committer et pousser sur `main`

```bash
# Depuis la racine du projet
git add .
git commit -m "Modifications + mise à jour du schéma Directus"
git push origin main
```

Chaque push (ou merge) sur `main` déclenche automatiquement le déploiement via GitHub Actions (voir ci-dessous).

### 3. Déploiement automatique (CI/CD GitHub Actions)

Le workflow `.github/workflows/deploy.yml` :

1. **Build** l'image Docker sur GitHub Actions (Next.js compilé dans la CI)
2. **Push** vers GitHub Container Registry : `ghcr.io/takcastel/florine-clap-frontend:<commit>`
3. **SSH** sur le VPS → `git reset` + `docker compose pull` + restart (pas de build sur le serveur)

```
push main → GitHub build l'image → GHCR → VPS pull + restart
```

#### Configuration initiale (une seule fois)

**1. Clé SSH dédiée au déploiement** (en local) :

```bash
ssh-keygen -t ed25519 -C "github-deploy-florine-clap" -f ~/.ssh/florine-clap-deploy -N ""
```

**2. Autoriser la clé sur le VPS** (utilisateur `ubuntu`) :

```bash
cat florine-clap-deploy.pub >> ~/.ssh/authorized_keys
chmod 600 ~/.ssh/authorized_keys
```

Vérifier que `ubuntu` est dans le groupe `docker` : `groups ubuntu` (sinon `sudo usermod -aG docker ubuntu`).

**3. Secrets GitHub** — repo `TakCastel/florine-clap` → Settings → Secrets and variables → Actions :

| Secret | Valeur |
|--------|--------|
| `VPS_HOST` | IP ou domaine du VPS |
| `VPS_USER` | `ubuntu` |
| `VPS_SSH_KEY` | contenu de la clé privée `florine-clap-deploy` |
| `VPS_PORT` | `22` (optionnel) |
| `NEXT_PUBLIC_DIRECTUS_URL` | URL HTTPS publique de Directus (ex. `https://api.florineclap.com`) — **figée au build** |
| `GHCR_TOKEN` | PAT GitHub avec scope `read:packages` (pour que le VPS pull l'image privée) |

> **GHCR_TOKEN** : créer un [Personal Access Token](https://github.com/settings/tokens) (classic) avec `read:packages`.  
> Alternative : rendre le package public dans GitHub → Packages → florine-clap-frontend → Package settings → Change visibility.

**4. Vérifier le clone Git sur le serveur** :

```bash
cd /srv/florine-clap
git remote -v
git branch
```

Le remote doit pointer vers `github.com:TakCastel/florine-clap.git`. Si `git fetch` échoue sans authentification, ajouter une [deploy key](https://docs.github.com/en/authentication/connecting-to-github-with-ssh/managing-deploy-keys) en lecture seule sur le repo.

Suivi des déploiements : onglet **Actions** sur GitHub.

### 4. Sur le serveur : Déploiement manuel (secours)

**Option A : Déploiement standard**

```bash
./scripts/deploy.sh
```

Ce script fait automatiquement :
- `git pull` pour récupérer les modifications
- **Ne touche pas au schéma Directus** (préserve les modifs faites dans l'admin)
- Reconstruction locale du frontend (`docker compose build`) ou pull GHCR (`--pull-image`)
- Redémarrage du conteneur

**Option B : Déploiement avec application du schéma**

Uniquement quand vous avez exporté et versionné un nouveau schéma :

```bash
./scripts/deploy.sh --apply-schema
```

⚠️ Cela **écrase** la base Directus avec le schéma versionné. À utiliser avec précaution.

**Option C : Déploiement manuel étape par étape**

```bash
# 1. Récupérer les modifications
git pull

# 2. Reconstruire et redémarrer le frontend
docker compose up -d --build frontend
```

**Option D : Appliquer uniquement le schéma Directus (sans rebuild du frontend)**

```bash
./scripts/apply-schema.sh
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
# Déploiement standard (build local sur le VPS)
./scripts/deploy.sh

# Déploiement CI : pull image GHCR (après build GitHub Actions)
FRONTEND_IMAGE_TAG=abc123 ./scripts/deploy.sh --pull-image

# Sans git pull (code déjà à jour, ex. après reset CI)
./scripts/deploy.sh --no-pull --pull-image

# Déploiement avec application du schéma (écrase les modifs Directus)
./scripts/deploy.sh --apply-schema

# Appliquer uniquement le schéma Directus (sans rebuild frontend)
./scripts/apply-schema.sh
```

### Cache et première visite

Les pages listes (Films, Vidéos-art, Médiations, Actus) affichent un **skeleton** dès le clic, puis le contenu se charge. Le script `deploy.sh` appelle automatiquement `/api/warmup` après redémarrage. Variable optionnelle : définir `SITE_URL` dans `.env` (ex. `https://florineclap.com`) si le frontend est derrière un reverse proxy. 

## ⚠️ Notes importantes

- **Par défaut, le déploiement ne touche jamais au schéma Directus** — les modifications faites dans l'interface admin sont préservées
- Le schéma est versionné dans `directus/snapshots/schema.yaml` ; utiliser `--apply-schema` uniquement quand vous voulez l'appliquer explicitement
- Les données (contenu) ne sont **pas** affectées par l'application d'un snapshot
- Toujours tester en local avant de déployer

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
