# Configuration Decap CMS - Variables d'environnement

## Fichier .env.local (à créer)

```env
# Authentification basique pour protéger /admin
BASIC_AUTH_USER=votre_nom_utilisateur
BASIC_AUTH_PASS=votre_mot_de_passe_securise

# URL de votre site en production
NEXT_PUBLIC_SITE_URL=https://florineclap.com

# Configuration GitHub (optionnel, pour le développement local)
GITHUB_CLIENT_ID=votre_client_id
GITHUB_CLIENT_SECRET=votre_client_secret
```

## Instructions

1. **Créer le fichier .env.local** dans la racine du projet
2. **Remplacer les valeurs** par vos vraies informations
3. **Ne jamais commiter** ce fichier (il est dans .gitignore)
4. **Configurer les mêmes variables** sur votre plateforme de déploiement

## Sécurité

- Utilisez des mots de passe forts pour BASIC_AUTH
- Gardez vos secrets GitHub privés
- Ne partagez jamais ces informations
