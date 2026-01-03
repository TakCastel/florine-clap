# Florine Clap – Next.js 14 + Directus

### Démarrage

1. Installer les dépendances:
```bash
npm i # ou pnpm i / yarn
```
2. Variables d'environnement (créez `.env.local`):
```bash
SITE_URL=https://example.com
NEXT_PUBLIC_DIRECTUS_URL=http://localhost:8055
DIRECTUS_STATIC_TOKEN=votre-token
```
3. Lancer le dev:
```bash
npm run dev
```

### Contenu
- Le contenu est géré via Directus (CMS headless).
- Accès à l'admin Directus: http://localhost:8055

### SEO
- `app/sitemap.ts` et `app/robots.ts` génèrent sitemap/robots.
- Utiliser `buildMetadata` pour title/description/images/canonical.

### Déploiement
- Build: `npm run build`.
- Variables: `SITE_URL`, `NEXT_PUBLIC_DIRECTUS_URL`, `DIRECTUS_STATIC_TOKEN`.

### Migration
- Tous les contenus sont maintenant gérés via Directus.
- Voir `README-MIGRATION.md` à la racine du projet pour plus de détails.


