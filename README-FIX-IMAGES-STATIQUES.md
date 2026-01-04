# Fix : Images statiques (PNG/AVIF) ne s'affichent pas en production

## Problème

Les images SVG fonctionnent, mais les images PNG et AVIF ne s'affichent pas en production, alors qu'elles fonctionnent en local.

## Cause probable

Next.js en mode `standalone` peut avoir des difficultés à servir correctement les fichiers binaires (PNG, AVIF) du dossier `public`, alors que les fichiers texte (SVG) fonctionnent.

## Solutions

### Solution 1 : Vérifier que les fichiers sont bien copiés

Sur le serveur, vérifiez que les fichiers sont bien présents dans le conteneur :

```bash
# Vérifier la structure
docker exec florine-clap-frontend ls -la /app/public/images/logos/

# Vérifier les types de fichiers
docker exec florine-clap-frontend find /app/public/images/logos/ -name "*.png"
docker exec florine-clap-frontend find /app/public/images/logos/ -name "*.svg"
docker exec florine-clap-frontend find /app/public/images/ -name "*.avif"
```

### Solution 2 : Vérifier les logs Next.js

Vérifiez les logs du conteneur pour voir si Next.js essaie de servir les fichiers :

```bash
docker logs florine-clap-frontend | grep -i "images\|public\|static"
```

### Solution 3 : Tester directement l'URL

Testez directement l'URL de l'image depuis le serveur :

```bash
# Depuis le serveur
curl -I http://localhost:3000/images/logos/france-tv.png
curl -I http://localhost:3000/images/FLORINE_DEF.avif
```

### Solution 4 : Vérifier les types MIME

Next.js devrait servir les fichiers avec les bons types MIME. Vérifiez les headers de réponse :

```bash
curl -v http://localhost:3000/images/logos/france-tv.png 2>&1 | grep -i "content-type"
```

### Solution 5 : Rebuild complet

Si les fichiers ne sont pas copiés correctement, faites un rebuild complet :

```bash
# Sur le serveur
cd /srv/florine-clap  # ou votre chemin
docker-compose down
docker-compose build --no-cache frontend
docker-compose up -d
```

### Solution 6 : Vérifier les permissions

Assurez-vous que les fichiers ont les bonnes permissions :

```bash
docker exec florine-clap-frontend ls -la /app/public/images/logos/
# Les fichiers devraient être lisibles (r--r--r--)
```

## Diagnostic

Utilisez le script de vérification :

```bash
./scripts/check-public-files.sh
```

## Note importante

Si le problème persiste après avoir vérifié tout ce qui précède, il se peut que Next.js en mode standalone ait un bug avec certains types de fichiers. Dans ce cas, il faudrait peut-être :

1. Servir les fichiers statiques directement avec nginx (nécessite de monter le dossier public comme volume)
2. Ou utiliser une route API Next.js pour servir les fichiers statiques
3. Ou héberger les images statiques ailleurs (CDN, etc.)

