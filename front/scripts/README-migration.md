# Script de Migration des Articles

Ce script permet de migrer les articles depuis florineclap.com vers Directus en préservant l'ordre, le contenu exact (titre, sous-titre, contenu markdown, images).

## Installation des dépendances

Avant d'utiliser le script, installez les dépendances nécessaires :

```bash
cd front
npm install --save-dev cheerio turndown @types/turndown tsx form-data puppeteer
```

**Note** : Puppeteer est nécessaire car le site utilise du JavaScript pour afficher les articles et nécessite de cliquer sur les éléments pour accéder au contenu.

## Configuration

Le script utilise les variables d'environnement suivantes (définies dans `.env` à la racine) :

- `DIRECTUS_INTERNAL_URL` ou `NEXT_PUBLIC_DIRECTUS_URL` : URL de votre instance Directus
- `DIRECTUS_STATIC_TOKEN` : Token statique Directus (optionnel, utilise l'auth admin sinon)
- `DIRECTUS_ADMIN_EMAIL` : Email admin Directus
- `DIRECTUS_ADMIN_PASSWORD` : Mot de passe admin Directus

## Utilisation

1. **Installer les dépendances** (si pas déjà fait) :

```bash
cd front
npm install --save-dev cheerio turndown @types/turndown tsx form-data
```

2. **Adapter les sélecteurs CSS** dans le script selon la structure HTML de florineclap.com :
   - Ouvrez `scripts/migrate-articles.ts`
   - Modifiez les sélecteurs dans `getArticleUrls()` et `scrapeArticle()` pour correspondre à la structure HTML du site source
   - Le script essaie déjà plusieurs sélecteurs courants, mais vous pouvez les adapter

3. **Tester en mode dry-run** (recommandé) :

```bash
cd front
npx tsx scripts/migrate-articles.ts --dry-run
```

Cela affichera ce qui serait fait sans créer réellement les articles dans Directus.

4. **Exécuter la migration réelle** :

Plusieurs options sont disponibles :

**Option A : Supprimer tous les articles existants puis migrer** (recommandé pour une migration complète)
```bash
cd front
npx tsx scripts/migrate-articles.ts --force
```

**Option B : Mettre à jour les articles existants et créer les nouveaux**
```bash
cd front
npx tsx scripts/migrate-articles.ts --update
```

**Option C : Créer tous les articles (peut créer des doublons si des articles existent déjà)**
```bash
cd front
npx tsx scripts/migrate-articles.ts
```

**Recommandation** : Utilisez `--force` pour une migration propre qui évite les doublons.

## Fonctionnalités

Le script :

1. ✅ Récupère toutes les URLs des articles depuis la page d'actualités (gère la pagination)
2. ✅ Scrape chaque article pour extraire :
   - Titre (plusieurs sélecteurs essayés)
   - Sous-titre (si présent)
   - Contenu (converti en Markdown propre)
   - Images (dans le contenu et meta tags)
   - Date (plusieurs formats supportés)
   - Slug (généré depuis l'URL ou le titre)
3. ✅ Télécharge les images et les upload dans Directus
4. ✅ Crée les articles dans Directus avec l'ordre exact
5. ✅ Préserve l'intégrité du contenu (aucune hallucination, extraction exacte)
6. ✅ Mode dry-run pour tester sans créer d'articles
7. ✅ **Gestion des doublons** : détecte les articles existants et propose plusieurs options :
   - `--force` : supprime tous les articles existants avant de migrer
   - `--update` : met à jour les articles existants au lieu de créer des doublons
   - Sans option : avertit mais peut créer des doublons

## Personnalisation des sélecteurs

Pour adapter le script à la structure HTML de florineclap.com, modifiez ces sections :

### Dans `getArticleUrls()` :
```typescript
// Exemple : adapter selon la structure HTML
$('a[href*="/actualites/"], a[href*="/actus/"], .article-link, article a').each(...)
```

### Dans `scrapeArticle()` :
```typescript
// Titre
const title = $('h1').first().text().trim() || 
              $('.article-title').text().trim() || ...

// Sous-titre
const subtitle = $('h2').first().text().trim() ||
                 $('.article-subtitle').text().trim() || ...

// Contenu
const contentSelector = 'article, .article-content, .content, main, .post-content'
```

## Dépannage

- **Aucun article trouvé** : 
  - Vérifiez que les sélecteurs CSS correspondent à la structure HTML du site
  - Vérifiez que l'URL de base (`SOURCE_URL`) est correcte
  - Essayez d'accéder manuellement à la page d'actualités pour voir sa structure

- **Erreur d'authentification** : 
  - Vérifiez vos credentials Directus dans `.env`
  - Vérifiez que `DIRECTUS_INTERNAL_URL` ou `NEXT_PUBLIC_DIRECTUS_URL` est correct
  - Vérifiez que Directus est démarré et accessible

- **Erreur d'upload d'image** : 
  - Vérifiez que Directus est accessible et que les permissions sont correctes
  - Vérifiez que le dossier `uploads` existe dans Directus
  - Vérifiez les permissions d'écriture

- **Contenu mal formaté** :
  - Le script essaie plusieurs sélecteurs, mais vous pouvez les adapter
  - Vérifiez le HTML source de quelques articles pour comprendre la structure
  - Utilisez le mode dry-run pour voir ce qui est extrait avant de migrer

## Notes importantes

- ⚠️ **Respect des droits d'auteur** : Assurez-vous d'avoir les autorisations nécessaires pour reproduire le contenu
- ⚠️ **Ordre des articles** : L'ordre est préservé selon l'ordre de découverte sur le site source
- ⚠️ **Images** : Les images sont téléchargées et uploadées dans Directus. La première image devient l'image de couverture
- ⚠️ **Slugs** : Les slugs sont générés depuis l'URL ou le titre. Vérifiez qu'ils sont uniques
- ⚠️ **Testez d'abord** : Utilisez toujours `--dry-run` avant de faire la migration réelle

