# Guide : Génération automatique de slugs dans Directus

Il existe plusieurs façons de gérer les slugs automatiquement dans Directus. Voici les options :

## Option 1 : Flows Directus (RECOMMANDÉ - Plus simple)

Les Flows sont la méthode la plus simple et la plus maintenable. Voici comment les configurer :

### Pour chaque collection (films, actus, mediations, pages, videos_art) :

1. **Aller dans Settings > Flows**
2. **Créer un nouveau Flow** avec ce nom : "Auto Slug - [nom de la collection]"
3. **Trigger** : Event Hook
   - Event : `items.create` et `items.update`
   - Scope : `[nom de la collection]` (ex: `films`)
   - Type : **Filter (Blocking)** - important pour que le slug soit généré avant la sauvegarde
4. **Condition** : 
   - Si `$trigger.payload.slug` est vide ou null
   - ET si `$trigger.payload.title` existe
5. **Operation 1** : Run Script
   ```javascript
   const title = $trigger.payload.title;
   
   if (!title) return $trigger.payload;
   
   // Fonction de slugification
   function slugify(text) {
     return text
       .toLowerCase()
       .normalize('NFD')
       .replace(/[\u0300-\u036f]/g, '') // Supprimer les accents
       .replace(/[^a-z0-9]+/g, '-') // Remplacer les caractères non alphanumériques par des tirets
       .replace(/^-+|-+$/g, '') // Supprimer les tirets en début et fin
       .replace(/-+/g, '-') // Remplacer les tirets multiples par un seul
       .substring(0, 100); // Limiter à 100 caractères
   }
   
   const baseSlug = slugify(title);
   
   // Vérifier l'unicité (simplifié - pour une vraie vérification, utiliser Read Data)
   let slug = baseSlug;
   let counter = 1;
   
   // Note: Pour une vraie vérification d'unicité, il faudrait utiliser Read Data
   // Pour l'instant, on génère juste le slug de base
   
   return {
     ...$trigger.payload,
     slug: slug
   };
   ```

6. **Activer le Flow**

### Limitation de cette approche simple :
- Ne vérifie pas l'unicité automatiquement
- Pour vérifier l'unicité, il faudrait ajouter une opération "Read Data" avant le script

## Option 2 : Extension Hook (Ce qu'on a créé)

L'extension hook devrait fonctionner mais nécessite :
1. Que Directus soit redémarré après création/modification
2. Que l'extension soit correctement chargée (vérifier les logs Directus)
3. Que la syntaxe soit correcte pour votre version de Directus

### Vérifier si l'extension fonctionne :
1. Regarder les logs Directus : `docker-compose logs directus`
2. Vérifier que l'extension est chargée dans Settings > Extensions
3. Tester en créant un nouvel item

## Option 3 : Utiliser une extension du marketplace

Des extensions comme "Slugify Operation" ou "Unique Slugify" existent dans le marketplace Directus et peuvent être installées directement.

## Option 4 : Script de migration ponctuelle

Pour régénérer les slugs existants, utiliser le script :
```bash
npm run directus:regenerate-slugs
```

## Recommandation

**Pour commencer rapidement** : Utiliser les Flows (Option 1)
**Pour une solution robuste** : Corriger l'extension hook ou utiliser une extension du marketplace
