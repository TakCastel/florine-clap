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

## 🔍 Vérification après déploiement

```bash
# Vérifier que les conteneurs tournent
docker compose ps

# Voir les logs du frontend
docker compose logs -f frontend

# Voir les logs de Directus
docker compose logs -f directus
```
