# Florine Clap – Next.js 14 + Contentlayer + Decap CMS

### Démarrage

1. Installer les dépendances:
```bash
npm i # ou pnpm i / yarn
```
2. Variables d'environnement (créez `.env.local`):
```bash
SITE_URL=https://example.com
# Optionnel: protection /admin par Basic Auth (utile en préprod)
BASIC_AUTH_USER=
BASIC_AUTH_PASS=
```
3. Lancer le dev:
```bash
npm run dev
```

### Contenu
- Tous les contenus MDX dans `content/`.
- Types générés par Contentlayer dans `.contentlayer/`.

### SEO
- `app/sitemap.ts` et `app/robots.ts` génèrent sitemap/robots.
- Utiliser `buildMetadata` pour title/description/images/canonical.

### Decap CMS
- Accessible via `/admin`.
- Config: `public/admin/config.yml` (backend GitHub par défaut).
- Uploads d'images: `public/images/uploads`.

### Déploiement Vercel
- Build: `contentlayer build && next build`.
- Variables: `SITE_URL`. (Optionnel) `BASIC_AUTH_USER` / `BASIC_AUTH_PASS`.

### Extensibilité
- Ajoutez des types via `contentlayer.config.ts` + `public/admin/config.yml`.


