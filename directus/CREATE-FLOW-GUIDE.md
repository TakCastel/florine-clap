# Guide : Créer un Flow pour générer automatiquement les slugs

## Étapes détaillées pour créer un Flow dans Directus

### Pour chaque collection (films, actus, mediations, pages, videos_art)

1. **Ouvrir Directus** dans votre navigateur (http://localhost:8055)

2. **Aller dans Settings** (icône d'engrenage en bas à gauche)

3. **Cliquer sur "Flows"** dans le menu de gauche

4. **Cliquer sur "Create Flow"** (bouton en haut à droite)

5. **Configurer le Flow :**

   **Nom du Flow :** `Auto Slug - Films` (ou le nom de la collection)

   **Trigger :**
   - Type : **Event Hook**
   - Event : Sélectionner `items.create` ET `items.update`
   - Scope : Sélectionner la collection (ex: `films`)
   - Type : **Filter (Blocking)** ⚠️ Important : cela permet de modifier les données avant la sauvegarde

   **Condition (Optionnel mais recommandé) :**
   - Cliquer sur "Add Condition"
   - Condition 1 : `$trigger.payload.slug` est `empty` OU `null`
   - Opérateur : `AND`
   - Condition 2 : `$trigger.payload.title` est `not empty`

   **Operation : Run Script**
   - Cliquer sur "Add Operation"
   - Type : **Run Script**
   - Code JavaScript :
   ```javascript
   const title = $trigger.payload.title;
   
   if (!title) {
     return $trigger.payload;
   }
   
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
   
   // Retourner le payload avec le slug généré
   return {
     ...$trigger.payload,
     slug: baseSlug
   };
   ```

6. **Activer le Flow :**
   - Toggle "Status" sur "Active" (en haut à droite)
   - Cliquer sur "Save"

7. **Répéter pour chaque collection :**
   - `films`
   - `actus`
   - `mediations`
   - `pages`
   - `videos_art`

## Test

1. Créer un nouveau film avec un titre (ex: "Mon nouveau film")
2. Le champ slug devrait être automatiquement rempli avec "mon-nouveau-film"
3. Sauvegarder

## Note sur l'unicité

Cette version simple ne vérifie pas l'unicité. Si vous avez besoin de vérifier l'unicité (pour éviter les doublons), il faudrait ajouter une opération "Read Data" avant le script pour vérifier si le slug existe déjà.

Pour une version avec vérification d'unicité, voir la section suivante.

## Version avec vérification d'unicité (avancé)

Si vous voulez que les slugs soient uniques (ex: `mon-titre`, `mon-titre-1`, `mon-titre-2`), il faut :

1. **Operation 1 : Read Data**
   - Collection : la même collection (ex: `films`)
   - Filter : `slug` equals `$trigger.payload.slug` (le slug généré)
   - Limite : 1

2. **Operation 2 : Condition**
   - Si des résultats existent, ajouter un suffixe numérique

3. **Operation 3 : Run Script**
   - Générer le slug avec suffixe si nécessaire

Cette configuration est plus complexe mais garantit l'unicité.
