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

**Option C : Déploiement rapide (code uniquement, sans schéma)**

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
# Déploiement complet
./scripts/deploy.sh

# Déploiement sans schéma
./scripts/deploy.sh --skip-schema
```

## ⚠️ Notes importantes

- Le schéma Directus est versionné dans `directus/snapshots/schema.yaml`
- Les données (contenu) ne sont **pas** affectées par l'application d'un snapshot
- Toujours tester en local avant de déployer
- En cas d'erreur lors de l'application du schéma, vérifiez les logs

## 🔍 Vérification après déploiement

```bash
# Vérifier que les conteneurs tournent
docker compose ps

# Voir les logs du frontend
docker compose logs -f frontend

# Voir les logs de Directus
docker compose logs -f directus
```
