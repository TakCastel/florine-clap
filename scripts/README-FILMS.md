# Scripts d'import des films

Ce dossier contient les scripts pour importer les films et leurs images dans Directus.

## Prérequis

1. Avoir un fichier `.env` à la racine du projet avec les variables suivantes :
   - `DIRECTUS_PUBLIC_URL` : URL de votre instance Directus
   - `DIRECTUS_STATIC_TOKEN` ou `DIRECTUS_ADMIN_TOKEN` : Token d'authentification
   - `DIRECTUS_ADMIN_EMAIL` et `DIRECTUS_ADMIN_PASSWORD` : Identifiants admin (si pas de token)

2. Créer un dossier `temp-films-images/` à la racine du projet pour y placer les images des films

## Structure des données

Les films peuvent être importés depuis un fichier JSON. Voir `import-films.example.json` pour un exemple complet.

### Champs principaux

- `title` (obligatoire) : Titre du film
- `slug` (optionnel) : Identifiant unique (généré automatiquement depuis le titre si absent)
- `image` : Nom du fichier image dans le dossier `temp-films-images/`
- `body` : Contenu markdown du film
- `short_synopsis` : Synopsis court
- `type` : Genre (Documentaire, Fiction, Documentaire/fiction)
- `duree` : Durée du film
- `annee` : Date de production
- `langue` : Langue du film
- `pays_production` : Pays de production

### Champs équipe technique

- `realisation` : Réalisateur
- `mixage` : Mixeur
- `son` : Preneur de son
- `musique` : Compositeur
- `montage` : Monteur
- `scenario` : Scénariste
- `etalonnage` : Étalonneur
- `montage_son` : Monteur son
- `steadycamer` : Steadycam operator
- `assistants_mise_en_scene` : Assistants mise en scène
- `assistante_mise_en_scene` : Assistante mise en scène
- `assistants_images` : Assistants images

### Champs production

- `production` : Nom de la production
- `producteurs` : Producteur(s)
- `realisateur_captation` : Réalisateur captation
- `image_captation` : Image captation

### Champs casting

- `avec` : Acteurs principaux

### Champs diffusion

- `diffusion` : Tableau de chaînes/festivals de diffusion
- `selection` : Tableau de sélections/festivals
- `lien_film` : Lien externe vers le film (URL YouTube, etc.)

## Utilisation

### 1. Import des contenus et images (recommandé)

Cette méthode importe les contenus et upload les images en une seule fois :

```bash
cd scripts
node import-films.js --file ../films-data.json
```

Ou avec npm :

```bash
cd scripts
npm run import-films -- --file ../films-data.json
```

### 2. Import séparé des images

Si vous avez déjà importé les contenus et souhaitez seulement uploader/associer les images :

1. Créez un fichier `films-data.json` à la racine du projet avec le mapping image -> slug :

```json
[
  {
    "slug": "mon-film",
    "image": "mon-image.jpg"
  },
  {
    "slug": "autre-film",
    "image": "autre-image.jpg"
  }
]
```

2. Placez les images dans `temp-films-images/`

3. Lancez le script :

```bash
cd scripts
node upload-films-images.js
```

Ou avec npm :

```bash
cd scripts
npm run upload-films-images
```

## Exemple de fichier JSON

Voir `import-films.example.json` pour un exemple complet avec tous les champs disponibles.

## Notes

- Les images doivent être dans le dossier `temp-films-images/` à la racine du projet
- Le dossier "Films" sera créé automatiquement dans Directus si il n'existe pas
- Les films existants (même slug) seront mis à jour au lieu d'être dupliqués
- Les images déjà uploadées seront réutilisées (pas de doublon)

