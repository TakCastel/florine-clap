# Solution pour la génération automatique de slugs

## Problème actuel
Les slugs ne sont pas générés automatiquement lors de la création de contenus.

## Solutions disponibles

### ✅ Solution 1 : Flows Directus (RECOMMANDÉ - Le plus simple)

**Avantages :**
- Configuration via l'interface Directus (pas de code)
- Facile à déboguer
- Pas besoin de redémarrer Directus

**Comment faire :**

1. **Aller dans Directus** : Settings > Flows
2. **Créer un Flow pour chaque collection** (films, actus, mediations, pages, videos_art)

**Exemple pour "films" :**

- **Nom** : "Auto Slug - Films"
- **Trigger** : Event Hook
  - Event : `items.create` et `items.update`
  - Scope : `films`
  - Type : **Filter (Blocking)**
- **Condition** : 
  - `$trigger.payload.slug` est vide OU null
  - ET `$trigger.payload.title` n'est pas vide
- **Operation** : Run Script
  ```javascript
  const title = $trigger.payload.title;
  
  if (!title) return $trigger.payload;
  
  function slugify(text) {
    return text
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '')
      .replace(/-+/g, '-')
      .substring(0, 100);
  }
  
  return {
    ...$trigger.payload,
    slug: slugify(title)
  };
  ```

3. **Répéter pour chaque collection** (actus, mediations, pages, videos_art)

### Solution 2 : Extension Hook (Plus complexe)

L'extension hook a été créée mais nécessite :
- Redémarrer Directus après modification
- Vérifier les logs pour les erreurs
- Syntaxe correcte selon la version de Directus

**Pour tester si elle fonctionne :**
1. Redémarrer Directus : `docker-compose restart directus`
2. Vérifier les logs : `docker-compose logs directus | grep -i error`
3. Créer un nouveau contenu et voir si le slug est généré

### Solution 3 : Script de régénération

Pour les contenus existants sans slug :
```bash
npm run directus:regenerate-slugs
```

## Recommandation immédiate

**Utilisez les Flows (Solution 1)** car :
1. ✅ Plus simple à configurer
2. ✅ Plus facile à déboguer
3. ✅ Pas besoin de redémarrer Directus
4. ✅ Visible dans l'interface Directus

Une fois les Flows créés, testez en créant un nouveau film. Le slug devrait être généré automatiquement.
