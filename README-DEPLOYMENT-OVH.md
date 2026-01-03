# Guide de déploiement sur OVH VPS

Ce guide vous explique comment déployer le site Florine Clap sur un serveur VPS OVH.

## 📋 Prérequis

- Un serveur VPS OVH avec Ubuntu 20.04+ ou Debian 11+
- Un nom de domaine pointant vers l'IP de votre serveur
- Un accès SSH au serveur
- Les droits root ou sudo

## 🚀 Étape 1 : Préparation du serveur

### 1.1 Connexion SSH

```bash
ssh root@votre-ip-ovh
# ou
ssh votre-utilisateur@votre-ip-ovh
```

### 1.2 Mise à jour du système

```bash
sudo apt update
sudo apt upgrade -y
```

### 1.3 Installation de Docker et Docker Compose

```bash
# Installation de Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh

# Ajouter votre utilisateur au groupe docker (évite d'utiliser sudo)
sudo usermod -aG docker $USER

# Installation de Docker Compose
sudo curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose

# Vérifier l'installation
docker --version
docker-compose --version

# Redémarrer la session SSH pour que les changements de groupe prennent effet
exit
# Puis reconnectez-vous
```

### 1.4 Installation de Nginx (reverse proxy)

```bash
sudo apt install nginx -y
sudo systemctl enable nginx
sudo systemctl start nginx
```

### 1.5 Installation de Certbot (pour SSL)

```bash
sudo apt install certbot python3-certbot-nginx -y
```

## 📁 Étape 2 : Déploiement du code

### 2.1 Créer le répertoire de travail

```bash
sudo mkdir -p /var/www/florine-clap
sudo chown $USER:$USER /var/www/florine-clap
cd /var/www/florine-clap
```

### 2.2 Transférer les fichiers du projet

Depuis votre machine locale, utilisez `scp` ou `rsync` :

```bash
# Depuis votre machine locale
cd /Users/takcastel/projects/florine-clap

# Transférer tous les fichiers nécessaires
rsync -avz --exclude 'node_modules' --exclude '.next' --exclude '.git' \
  ./ root@votre-ip-ovh:/var/www/florine-clap/

# Ou avec scp (moins efficace)
scp -r ./ root@votre-ip-ovh:/var/www/florine-clap/
```

**Alternative : Utiliser Git**

```bash
# Sur le serveur
cd /var/www/florine-clap
git clone https://github.com/votre-repo/florine-clap.git .
# ou avec SSH
git clone git@github.com:votre-repo/florine-clap.git .
```

## 🔐 Étape 3 : Configuration des variables d'environnement

### 3.1 Créer le fichier `.env`

```bash
cd /var/www/florine-clap
nano .env
```

### 3.2 Contenu du fichier `.env` de production

Remplacez les valeurs entre `<>` par vos propres valeurs :

```env
# Base de données PostgreSQL
POSTGRES_USER=directus
POSTGRES_PASSWORD=<GÉNÉRER-UN-MOT-DE-PASSE-FORT>
POSTGRES_DB=directus

# Directus - Sécurité (GÉNÉRER DES VALEURS ALÉATOIRES)
DIRECTUS_KEY=<GÉNÉRER-UNE-VALEUR-ALÉATOIRE-64-CARACTÈRES>
DIRECTUS_SECRET=<GÉNÉRER-UNE-VALEUR-ALÉATOIRE-64-CARACTÈRES>

# Directus - Admin
DIRECTUS_ADMIN_EMAIL=admin@votre-domaine.com
DIRECTUS_ADMIN_PASSWORD=<MOT-DE-PASSE-ADMIN-FORT>

# URLs publiques (remplacer par vos domaines)
DIRECTUS_PUBLIC_URL=https://cms.votre-domaine.com
DIRECTUS_CORS_ORIGIN=https://votre-domaine.com
NEXT_PUBLIC_DIRECTUS_URL=https://cms.votre-domaine.com

# Ports (optionnel, par défaut 3000 et 8055)
FRONTEND_PORT=3000
DIRECTUS_PORT=8055

# Token statique Directus (optionnel, à générer après le premier démarrage)
DIRECTUS_STATIC_TOKEN=
```

### 3.3 Générer des valeurs aléatoires sécurisées

```bash
# Générer DIRECTUS_KEY (64 caractères)
openssl rand -hex 32

# Générer DIRECTUS_SECRET (64 caractères)
openssl rand -hex 32

# Générer POSTGRES_PASSWORD (32 caractères)
openssl rand -hex 16
```

### 3.4 Sécuriser le fichier `.env`

```bash
chmod 600 .env
```

## 🌐 Étape 4 : Configuration DNS

Dans votre panneau OVH, configurez les enregistrements DNS :

1. **Enregistrement A** pour le domaine principal :
   - Nom : `@` ou `votre-domaine.com`
   - Valeur : IP de votre serveur VPS
   - TTL : 3600

2. **Enregistrement A** pour le sous-domaine Directus (optionnel) :
   - Nom : `cms` ou `admin`
   - Valeur : IP de votre serveur VPS
   - TTL : 3600

Attendez la propagation DNS (peut prendre quelques minutes à quelques heures).

## 🔒 Étape 5 : Configuration Nginx et SSL

### 5.1 Configuration Nginx pour le frontend

```bash
sudo nano /etc/nginx/sites-available/florine-clap
```

Contenu du fichier :

```nginx
# Redirection HTTP vers HTTPS
server {
    listen 80;
    listen [::]:80;
    server_name votre-domaine.com www.votre-domaine.com;
    
    return 301 https://$server_name$request_uri;
}

# Configuration HTTPS pour le frontend
server {
    listen 443 ssl http2;
    listen [::]:443 ssl http2;
    server_name votre-domaine.com www.votre-domaine.com;

    # Certificats SSL (seront générés par Certbot)
    ssl_certificate /etc/letsencrypt/live/votre-domaine.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/votre-domaine.com/privkey.pem;
    
    # Configuration SSL recommandée
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers HIGH:!aNULL:!MD5;
    ssl_prefer_server_ciphers on;

    # Logs
    access_log /var/log/nginx/florine-clap-access.log;
    error_log /var/log/nginx/florine-clap-error.log;

    # Proxy vers Next.js
    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
        
        # Timeouts
        proxy_connect_timeout 60s;
        proxy_send_timeout 60s;
        proxy_read_timeout 60s;
    }

    # Cache pour les assets statiques
    location /_next/static {
        proxy_pass http://localhost:3000;
        proxy_cache_valid 200 60m;
        add_header Cache-Control "public, immutable";
    }
}
```

### 5.2 Configuration Nginx pour Directus (optionnel, si sous-domaine séparé)

```bash
sudo nano /etc/nginx/sites-available/directus
```

Contenu :

```nginx
# Redirection HTTP vers HTTPS
server {
    listen 80;
    listen [::]:80;
    server_name cms.votre-domaine.com;
    
    return 301 https://$server_name$request_uri;
}

# Configuration HTTPS pour Directus
server {
    listen 443 ssl http2;
    listen [::]:443 ssl http2;
    server_name cms.votre-domaine.com;

    ssl_certificate /etc/letsencrypt/live/cms.votre-domaine.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/cms.votre-domaine.com/privkey.pem;
    
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers HIGH:!aNULL:!MD5;
    ssl_prefer_server_ciphers on;

    access_log /var/log/nginx/directus-access.log;
    error_log /var/log/nginx/directus-error.log;

    # Proxy vers Directus
    location / {
        proxy_pass http://localhost:8055;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
        
        # Augmenter les timeouts pour les uploads
        client_max_body_size 100M;
        proxy_connect_timeout 300s;
        proxy_send_timeout 300s;
        proxy_read_timeout 300s;
    }
}
```

### 5.3 Activer les configurations Nginx

```bash
# Créer les liens symboliques
sudo ln -s /etc/nginx/sites-available/florine-clap /etc/nginx/sites-enabled/
sudo ln -s /etc/nginx/sites-available/directus /etc/nginx/sites-enabled/

# Tester la configuration
sudo nginx -t

# Si OK, recharger Nginx
sudo systemctl reload nginx
```

### 5.4 Obtenir les certificats SSL avec Let's Encrypt

```bash
# Pour le domaine principal
sudo certbot --nginx -d votre-domaine.com -d www.votre-domaine.com

# Pour le sous-domaine Directus (si configuré)
sudo certbot --nginx -d cms.votre-domaine.com

# Renouvellement automatique (vérifier qu'il est activé)
sudo certbot renew --dry-run
```

Certbot va automatiquement modifier vos fichiers Nginx pour inclure les certificats SSL.

## 🐳 Étape 6 : Déploiement avec Docker Compose

### 6.1 Modifier docker-compose.yml pour la production

Assurez-vous que les ports ne sont exposés qu'en interne (pas besoin de modifier, c'est déjà le cas) :

```bash
cd /var/www/florine-clap
# Vérifier que les ports dans docker-compose.yml sont corrects
```

### 6.2 Construire et démarrer les services

```bash
cd /var/www/florine-clap

# Construire et démarrer tous les services
docker-compose up -d --build

# Vérifier que tout fonctionne
docker-compose ps
docker-compose logs -f
```

### 6.3 Vérifier les logs

```bash
# Logs de tous les services
docker-compose logs -f

# Logs d'un service spécifique
docker-compose logs -f frontend
docker-compose logs -f directus
docker-compose logs -f postgres
```

## ⚙️ Étape 7 : Configuration initiale de Directus

### 7.1 Accéder à Directus

Ouvrez votre navigateur : `https://cms.votre-domaine.com` (ou `https://votre-domaine.com:8055` si pas de sous-domaine)

Connectez-vous avec :
- Email : celui défini dans `DIRECTUS_ADMIN_EMAIL`
- Mot de passe : celui défini dans `DIRECTUS_ADMIN_PASSWORD`

### 7.2 Configurer le schéma et les permissions

```bash
cd /var/www/florine-clap/scripts
npm install

# Créer les collections
npm run setup-schema

# Configurer les permissions publiques
npm run setup-permissions
```

### 7.3 Créer un token statique (optionnel mais recommandé)

1. Dans Directus : **Settings** > **Access Tokens** > **Create Token**
2. Nom : `Frontend Static Token`
3. Rôle : **Public**
4. Expiration : **Never** (ou une date lointaine)
5. Copiez le token généré

Ajoutez-le dans votre `.env` :

```bash
nano /var/www/florine-clap/.env
# Ajouter : DIRECTUS_STATIC_TOKEN=votre-token-ici
```

Redémarrez le frontend :

```bash
docker-compose restart frontend
```

## 📦 Étape 8 : Importer les données (si nécessaire)

```bash
cd /var/www/florine-clap/scripts

# Importer les films
npm run import-films -- --file ../films-data.json

# Importer les médiations
npm run import-mediations -- --file ../mediations-data.json

# Importer les vidéos d'art
npm run import-videos-art -- --file ../videos-art-data.json
```

## ✅ Étape 9 : Vérification finale

1. **Frontend** : `https://votre-domaine.com` doit afficher le site
2. **Directus** : `https://cms.votre-domaine.com` doit afficher l'interface admin
3. **Vérifier les logs** : `docker-compose logs -f` ne doit pas afficher d'erreurs

## 🔄 Maintenance et mises à jour

### Mettre à jour le code

```bash
cd /var/www/florine-clap

# Si vous utilisez Git
git pull origin main

# Reconstruire et redémarrer
docker-compose up -d --build

# Vérifier les logs
docker-compose logs -f
```

### Sauvegarder la base de données

```bash
# Créer un script de sauvegarde
nano /var/www/florine-clap/backup-db.sh
```

Contenu :

```bash
#!/bin/bash
BACKUP_DIR="/var/backups/florine-clap"
DATE=$(date +%Y%m%d_%H%M%S)
mkdir -p $BACKUP_DIR

docker-compose exec -T postgres pg_dump -U directus directus | gzip > $BACKUP_DIR/backup_$DATE.sql.gz

# Garder seulement les 30 derniers backups
ls -t $BACKUP_DIR/backup_*.sql.gz | tail -n +31 | xargs -r rm

echo "Backup créé : $BACKUP_DIR/backup_$DATE.sql.gz"
```

Rendre exécutable :

```bash
chmod +x /var/www/florine-clap/backup-db.sh
```

### Restaurer la base de données

```bash
gunzip < /var/backups/florine-clap/backup_YYYYMMDD_HHMMSS.sql.gz | \
  docker-compose exec -T postgres psql -U directus directus
```

### Automatiser les sauvegardes avec cron

```bash
# Éditer le crontab
crontab -e

# Ajouter cette ligne pour une sauvegarde quotidienne à 2h du matin
0 2 * * * /var/www/florine-clap/backup-db.sh >> /var/log/florine-clap-backup.log 2>&1
```

## 🛠️ Commandes utiles

```bash
# Voir l'état des conteneurs
docker-compose ps

# Voir les logs
docker-compose logs -f [service]

# Redémarrer un service
docker-compose restart [service]

# Arrêter tous les services
docker-compose down

# Arrêter et supprimer les volumes (⚠️ supprime les données)
docker-compose down -v

# Voir l'utilisation des ressources
docker stats

# Nettoyer les images Docker inutilisées
docker system prune -a
```

## 🔍 Dépannage

### Le site ne s'affiche pas

1. Vérifier que les conteneurs sont démarrés : `docker-compose ps`
2. Vérifier les logs : `docker-compose logs -f frontend`
3. Vérifier Nginx : `sudo systemctl status nginx`
4. Vérifier les logs Nginx : `sudo tail -f /var/log/nginx/florine-clap-error.log`

### Erreurs de connexion à la base de données

1. Vérifier que PostgreSQL est démarré : `docker-compose ps postgres`
2. Vérifier les logs : `docker-compose logs postgres`
3. Vérifier les variables d'environnement dans `.env`

### Problèmes SSL

1. Vérifier que le certificat est valide : `sudo certbot certificates`
2. Renouveler le certificat : `sudo certbot renew`
3. Vérifier la configuration Nginx : `sudo nginx -t`

### Problèmes de permissions

```bash
# Si des erreurs de permissions avec Docker
sudo chown -R $USER:$USER /var/www/florine-clap
```

## 📞 Support

En cas de problème, vérifiez :
- Les logs Docker : `docker-compose logs -f`
- Les logs Nginx : `sudo tail -f /var/log/nginx/*.log`
- L'état des services : `docker-compose ps` et `sudo systemctl status nginx`

---

**Note** : N'oubliez pas de configurer un pare-feu (UFW) si nécessaire :

```bash
sudo ufw allow 22/tcp    # SSH
sudo ufw allow 80/tcp    # HTTP
sudo ufw allow 443/tcp   # HTTPS
sudo ufw enable
```

