# Configuration Decap CMS - Guide d'installation

## 1. Configuration GitHub

1. Créez un repository GitHub pour votre projet
2. Mettez à jour `public/admin/config.yml` avec vos informations :
   - Remplacez `tak.DESKTOP-E57KV1B/wp-florine` par `votre-username/votre-repo`
   - Mettez à jour les URLs de production

## 2. Variables d'environnement

Créez un fichier `.env.local` avec :

```env
# Pour protéger l'accès à /admin avec une authentification basique
BASIC_AUTH_USER=votre_nom_utilisateur
BASIC_AUTH_PASS=votre_mot_de_passe

# URL de votre site en production
NEXT_PUBLIC_SITE_URL=https://florineclap.com
```

## 3. Configuration GitHub OAuth

1. Allez sur GitHub > Settings > Developer settings > OAuth Apps
2. Créez une nouvelle OAuth App avec :
   - Application name: "Florine Clap CMS"
   - Homepage URL: `https://votre-site.com`
   - Authorization callback URL: `https://votre-site.com/admin/`

## 4. Déploiement

1. Déployez votre site sur Vercel/Netlify
2. Ajoutez les variables d'environnement dans votre plateforme de déploiement
3. Accédez à `https://votre-site.com/admin/` pour utiliser le CMS

## 5. Utilisation

- Films : Gérez vos réalisations et projets vidéo
- Ateliers : Créez et organisez vos ateliers vidéo
- Actualités : Publiez des nouvelles et événements
- Pages : Modifiez le contenu des pages statiques (Bio, Accueil)

## Structure des fichiers

- Les images sont stockées dans `public/images/uploads/`
- Le contenu est sauvegardé dans le dossier `content/`
- Les changements sont automatiquement commités sur GitHub
