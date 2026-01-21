# Extension Auto Slug pour Directus

Cette extension génère automatiquement les slugs à partir du titre pour toutes les collections configurées.

## Fonctionnalités

- ✅ Génération automatique de slugs à partir du titre
- ✅ Gestion des slugs uniques avec suffixes numériques (ex: `titre-de-page-1`, `titre-de-page-2`)
- ✅ Suppression automatique des accents
- ✅ Nettoyage des caractères spéciaux
- ✅ Limitation à 100 caractères

## Collections concernées

- `actus`
- `films`
- `mediations`
- `pages`
- `videos_art`

## Installation

1. L'extension est déjà montée dans le docker-compose via le volume `./directus/extensions:/directus/extensions`

2. Redémarrer le conteneur Directus pour charger l'extension :
   ```bash
   docker-compose restart directus
   ```

3. Configurer les champs slug en lecture seule dans Directus :
   ```bash
   cd front
   npm run directus:slug-readonly
   ```

## Utilisation

Une fois l'extension installée et configurée :

1. **Création d'un nouveau contenu** : Il suffit de remplir le champ `title`, le slug sera généré automatiquement
2. **Titres similaires** : Si plusieurs contenus ont le même titre, les slugs seront automatiquement différenciés :
   - Premier : `mon-titre`
   - Deuxième : `mon-titre-1`
   - Troisième : `mon-titre-2`
   - etc.

## Notes

- Le champ slug devient en lecture seule dans l'interface Directus
- Si un slug est déjà fourni lors de la création, il sera conservé tel quel
- Si le titre est modifié mais que le slug existe déjà, le slug ne sera pas modifié automatiquement (pour éviter de casser les URLs existantes)
