# Test de configuration Decap CMS

## Vérifications à effectuer

### 1. Serveur de développement
- [ ] Le serveur démarre sans erreur (`npm run dev`)
- [ ] Le site est accessible sur `http://localhost:3000`
- [ ] L'interface admin est accessible sur `http://localhost:3000/admin`

### 2. Configuration GitHub
- [ ] Mettre à jour le repository dans `public/admin/config.yml`
- [ ] Créer une OAuth App sur GitHub
- [ ] Configurer les variables d'environnement

### 3. Test des collections
- [ ] Films : Créer un nouveau film
- [ ] m�diations : Créer un nouvel atelier
- [ ] Actualités : Créer une nouvelle actualité
- [ ] Pages : Modifier la page Bio

### 4. Upload d'images
- [ ] Tester l'upload d'images dans la galerie
- [ ] Vérifier que les images sont bien stockées dans `public/images/uploads/`

### 5. Déploiement
- [ ] Déployer sur Vercel/Netlify
- [ ] Configurer les variables d'environnement
- [ ] Tester l'accès à l'interface admin en production

## Prochaines étapes

1. **Configuration GitHub OAuth** :
   - Aller sur GitHub > Settings > Developer settings > OAuth Apps
   - Créer une nouvelle OAuth App
   - Configurer les URLs de callback

2. **Variables d'environnement** :
   ```env
   BASIC_AUTH_USER=votre_utilisateur
   BASIC_AUTH_PASS=votre_mot_de_passe
   NEXT_PUBLIC_SITE_URL=https://votre-site.com
   ```

3. **Test en local** :
   - Accéder à `http://localhost:3000/admin`
   - Se connecter avec GitHub
   - Tester la création de contenu

4. **Déploiement** :
   - Déployer sur votre plateforme préférée
   - Configurer les variables d'environnement
   - Tester l'interface admin en production
