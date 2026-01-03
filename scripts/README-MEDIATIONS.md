# Scripts d'import des médiations

Ce dossier contient les scripts pour importer les médiations et leurs images dans Directus.

## Prérequis

1. Avoir un fichier `.env` à la racine du projet avec les variables suivantes :
   - `DIRECTUS_PUBLIC_URL` : URL de votre instance Directus
   - `DIRECTUS_STATIC_TOKEN` ou `DIRECTUS_ADMIN_TOKEN` : Token d'authentification
   - `DIRECTUS_ADMIN_EMAIL` et `DIRECTUS_ADMIN_PASSWORD` : Identifiants admin (si pas de token)

2. Créer un dossier `temp-mediations-images/` à la racine du projet pour y placer les images des médiations (optionnel si les images sont déjà dans Directus)

## Structure des données

Les médiations peuvent être importées depuis un fichier JSON. Voir `import-mediations.example.json` pour un exemple complet.

### Champs principaux

- `title` (obligatoire) : Titre de la médiation/atelier
- `slug` (optionnel) : Identifiant unique (généré automatiquement depuis le titre si absent)
- `cover` : Nom du fichier image dans le dossier `temp-mediations-images/` ou déjà présent dans Directus
- `body` : Contenu markdown détaillé de la médiation
- `excerpt` : Résumé court
- `date` : Date de la médiation (format ISO : "2024-01-15T10:00:00")
- `lieu` : Lieu où se déroule la médiation
- `duree` : Durée de la médiation
- `modalites` : Modalités d'inscription et de participation
- `lien_inscription` : Lien vers la page d'inscription
- `tags` : Tableau de tags (ex: ["atelier", "vidéo", "médiation"])

## Utilisation

### Import des contenus et images

Cette méthode importe les contenus et utilise les images déjà présentes dans Directus, ou les upload depuis le dossier temporaire si elles n'existent pas :

```bash
cd scripts
node import-mediations.js --file ../mediations-data.json
```

Ou avec npm :

```bash
cd scripts
npm run import-mediations -- --file ../mediations-data.json
```

## Comportement des images

Le script cherche d'abord si l'image existe déjà dans Directus par son nom de fichier :
- Si l'image existe → utilisation de l'image existante
- Si l'image n'existe pas dans Directus mais est dans `temp-mediations-images/` → upload depuis le dossier temporaire
- Si l'image n'existe ni dans Directus ni dans le dossier temporaire → la médiation sera créée sans image

## Exemple de fichier JSON

Voir `import-mediations.example.json` pour un exemple complet avec tous les champs disponibles.

## Notes

- Les images peuvent être placées dans le dossier `temp-mediations-images/` à la racine du projet (optionnel)
- Le dossier "Médiations" sera créé automatiquement dans Directus si il n'existe pas
- Les médiations existantes (même slug) seront mises à jour au lieu d'être dupliquées
- Les images déjà uploadées dans Directus seront réutilisées (pas de doublon)

