# Snapshots Directus

Ce dossier contient les snapshots du schéma Directus versionnés dans Git.

## 📋 Qu'est-ce qu'un snapshot ?

Un snapshot Directus contient uniquement la **structure** de votre base de données :
- Collections (tables)
- Champs et leurs types
- Relations entre collections
- Permissions
- Paramètres

⚠️ **Important** : Les snapshots ne contiennent **PAS** les données (contenu des articles, films, etc.)

## 🚀 Workflow de déploiement

### 1. En local : Exporter le schéma après modifications

Quand vous modifiez la structure Directus (ajout de collections, champs, etc.) :

```bash
# Depuis le dossier front/
npm run directus:export
```

Cela va :
- Se connecter à votre Directus local
- Exporter le schéma dans `directus/snapshots/schema.yaml`
- Vous indiquer de committer le fichier

### 2. Committer le snapshot

```bash
git add directus/snapshots/schema.yaml
git commit -m "Mise à jour du schéma Directus"
git push
```

### 3. Sur le serveur : Appliquer le schéma

Après avoir fait `git pull` sur le serveur :

```bash
# Depuis le dossier front/
npm run directus:apply
```

Cela va :
- Lire le snapshot depuis Git
- Appliquer les modifications au Directus du serveur
- Synchroniser la structure avec votre environnement local

## 🔍 Prévisualiser avant d'appliquer

Pour voir ce qui sera modifié sans appliquer :

```bash
npm run directus:apply:dry-run
```

## ⚙️ Configuration

Les scripts utilisent les variables d'environnement suivantes (définies dans `.env`) :

- `DIRECTUS_PUBLIC_URL` ou `NEXT_PUBLIC_DIRECTUS_URL` : URL de votre instance Directus
- `DIRECTUS_STATIC_TOKEN` ou `DIRECTUS_ADMIN_TOKEN` : Token d'authentification (admin requis pour appliquer)

## 📝 Notes

- Le snapshot est en JSON pour faciliter le versionnement dans Git
- Toujours tester en local avant de déployer sur le serveur
- Les données ne sont pas affectées par l'application d'un snapshot
- En cas de conflit, Directus essaiera de faire un merge intelligent
