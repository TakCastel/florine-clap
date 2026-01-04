# Debug : Images non affichées en production

## Problème
Les images statiques du dossier `public/images/` ne s'affichent pas en production alors qu'elles fonctionnent en local.

## Diagnostic à effectuer sur le serveur

### 1. Vérifier que les fichiers sont dans le conteneur

```bash
# Vérifier la structure du dossier public
docker exec florine-clap-frontend ls -la /app/public/images/logos/

# Vérifier les fichiers PNG
docker exec florine-clap-frontend find /app/public/images -name "*.png"

# Vérifier les fichiers SVG
docker exec florine-clap-frontend find /app/public/images -name "*.svg"

# Vérifier les permissions
docker exec florine-clap-frontend ls -la /app/public/images/logos/Utopia_logo.png
```

### 2. Tester l'accès direct depuis le conteneur

```bash
# Tester si Next.js sert le fichier
docker exec florine-clap-frontend curl -I http://localhost:3000/images/logos/Utopia_logo.png

# Vérifier les logs Next.js
docker logs florine-clap-frontend | grep -i "images\|404\|error"
```

### 3. Tester depuis l'extérieur du conteneur

```bash
# Tester depuis le serveur (si Nginx est configuré)
curl -I http://localhost:3000/images/logos/Utopia_logo.png

# Vérifier les logs Nginx
sudo tail -f /var/log/nginx/florine-clap-error.log
```

### 4. Vérifier la structure Next.js standalone

```bash
# Vérifier la structure du dossier standalone
docker exec florine-clap-frontend ls -la /app/

# Vérifier que server.js existe
docker exec florine-clap-frontend ls -la /app/server.js

# Vérifier que public est bien à côté de server.js
docker exec florine-clap-frontend ls -la /app/public/
```

## Solutions possibles

### Solution 1 : Vérifier que Next.js sert les fichiers statiques

Next.js en mode standalone devrait servir automatiquement les fichiers du dossier `public` s'il est à côté de `server.js`. Si ce n'est pas le cas, il faut vérifier la configuration.

### Solution 2 : Servir les fichiers avec Nginx directement

Si Next.js ne sert pas correctement les fichiers, on peut servir les fichiers statiques directement avec Nginx en montant le dossier public comme volume partagé.

### Solution 3 : Vérifier les types MIME

Assurez-vous que les types MIME sont corrects pour les fichiers PNG, SVG, etc.

## Commandes de rebuild

```bash
# Rebuild complet du frontend
cd /srv/florine-clap  # ou votre chemin
docker-compose build --no-cache frontend
docker-compose up -d frontend

# Vérifier les logs après rebuild
docker-compose logs -f frontend
```

