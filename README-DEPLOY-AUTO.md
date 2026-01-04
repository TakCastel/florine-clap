# Déploiement Automatique avec GitHub Actions

Ce projet utilise GitHub Actions pour déployer automatiquement le frontend sur le serveur à chaque push sur la branche `main`.

## 🔧 Configuration

### 1. Préparer le serveur

Sur votre serveur, assurez-vous que :
- Git est installé et configuré
- Le dépôt est cloné dans le répertoire de déploiement (ex: `/srv/florine-clap`)
- Docker et Docker Compose sont installés
- Le fichier `.env` est configuré

### 2. Générer une clé SSH pour GitHub Actions

Sur votre machine locale ou sur le serveur :

```bash
# Générer une nouvelle clé SSH (si vous n'en avez pas déjà une pour GitHub Actions)
ssh-keygen -t ed25519 -C "github-actions-deploy" -f ~/.ssh/github_actions_deploy

# Afficher la clé privée (à ajouter dans GitHub Secrets)
cat ~/.ssh/github_actions_deploy

# Afficher la clé publique (à ajouter sur le serveur)
cat ~/.ssh/github_actions_deploy.pub
```

### 3. Ajouter la clé publique sur le serveur

```bash
# Sur le serveur, ajouter la clé publique au fichier authorized_keys
echo "CONTENU_DE_LA_CLE_PUBLIQUE" >> ~/.ssh/authorized_keys
chmod 600 ~/.ssh/authorized_keys
```

### 4. Configurer les secrets GitHub

Dans votre dépôt GitHub, allez dans :
**Settings** → **Secrets and variables** → **Actions** → **New repository secret**

Ajoutez les secrets suivants :

- `SERVER_HOST` : L'adresse IP ou le domaine de votre serveur (ex: `37.59.98.75` ou `votre-domaine.com`)
- `SERVER_USER` : L'utilisateur SSH (ex: `root` ou `deploy`)
- `SERVER_SSH_KEY` : Le contenu de la clé privée SSH (le contenu complet de `~/.ssh/github_actions_deploy`)
- `SERVER_PORT` : (Optionnel) Le port SSH, par défaut `22`
- `SERVER_PATH` : (Optionnel) Le chemin du projet sur le serveur, par défaut `/srv/florine-clap`

### 5. Vérifier la configuration Git sur le serveur

Sur le serveur, dans le répertoire du projet :

```bash
cd /srv/florine-clap  # ou votre chemin
git remote -v  # Vérifier que l'URL du remote est correcte
git config user.name "Deploy Bot"
git config user.email "deploy@example.com"
```

## 🚀 Utilisation

Une fois configuré, chaque push sur la branche `main` déclenchera automatiquement :

1. ✅ Pull des dernières modifications
2. ✅ Rebuild de l'image Docker du frontend
3. ✅ Redémarrage du conteneur frontend

Vous pouvez suivre le déploiement dans l'onglet **Actions** de votre dépôt GitHub.

## 🔍 Vérification

Pour vérifier que le déploiement automatique fonctionne :

1. Faites une modification dans le code
2. Commitez et poussez sur `main` :
   ```bash
   git add .
   git commit -m "Test déploiement automatique"
   git push origin main
   ```
3. Allez dans l'onglet **Actions** de votre dépôt GitHub
4. Vous devriez voir un workflow "Deploy to Production" en cours d'exécution

## 🛠️ Dépannage

### Le déploiement échoue

1. Vérifiez les logs dans l'onglet **Actions** de GitHub
2. Vérifiez que les secrets sont correctement configurés
3. Testez la connexion SSH manuellement :
   ```bash
   ssh -i ~/.ssh/github_actions_deploy SERVER_USER@SERVER_HOST
   ```

### Le script ne s'exécute pas

Vérifiez que le script est exécutable sur le serveur :
```bash
chmod +x scripts/deploy-auto.sh
```

### Git pull échoue

Vérifiez que le dépôt sur le serveur est bien configuré :
```bash
cd /srv/florine-clap
git remote -v
git status
```

## 📝 Notes

- Le déploiement ne rebuild que le frontend (plus rapide)
- Si vous devez rebuild tous les services, utilisez `deploy.sh` manuellement
- Les variables d'environnement (`.env`) ne sont pas versionnées, elles restent sur le serveur

