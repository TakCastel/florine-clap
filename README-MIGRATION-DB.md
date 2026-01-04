# Guide de migration de la base de données vers le serveur VPS

Ce guide explique comment transférer votre base de données PostgreSQL et les fichiers Directus de votre environnement local vers le serveur VPS.

## 📋 Prérequis

- Docker et Docker Compose installés localement et sur le serveur
- Accès SSH au serveur VPS
- Les services Docker doivent être démarrés localement

## 🚀 Méthode rapide (tout en un)

Si vous voulez migrer la DB et les uploads en une seule commande :

```bash
./migrate-to-server.sh VOTRE_IP_VPS [utilisateur]
```

Exemple :
```bash
./migrate-to-server.sh 37.59.98.75 root
```

## 📝 Méthode étape par étape

### Étape 1 : Exporter la base de données locale

Sur votre machine locale :

```bash
./export-db-local.sh
```

Ce script va :
- Détecter automatiquement le container Postgres local
- Créer un dump au format custom (`directus.dump`)
- Vous donner les instructions pour la suite

### Étape 2 : Transférer le dump vers le serveur

Depuis votre machine locale :

```bash
scp directus.dump root@VOTRE_IP_VPS:/srv/florine-clap/
```

Remplacez `VOTRE_IP_VPS` par l'IP de votre serveur.

### Étape 3 : Importer la base de données sur le serveur

Sur le serveur VPS :

```bash
cd /srv/florine-clap
chmod +x import-db-server.sh
./import-db-server.sh
```

Le script va :
- Arrêter Directus et le frontend
- Supprimer l'ancienne base de données
- Créer une nouvelle base de données
- Restaurer le dump
- Redémarrer les services

⚠️ **Attention** : Cette opération remplace toutes les données existantes sur le serveur !

### Étape 4 (optionnel) : Migrer les uploads Directus

Si vous avez des images, vidéos ou autres fichiers uploadés dans Directus :

#### 4.1 Exporter les uploads locaux

Sur votre machine locale :

```bash
./export-uploads-local.sh
```

Ce script va créer une archive `directus-uploads-export.tar.gz` contenant tous les fichiers uploadés.

#### 4.2 Transférer l'archive vers le serveur

```bash
scp directus-uploads-export.tar.gz root@VOTRE_IP_VPS:/srv/florine-clap/
```

#### 4.3 Importer les uploads sur le serveur

Sur le serveur VPS :

```bash
cd /srv/florine-clap
chmod +x import-uploads-server.sh
./import-uploads-server.sh
```

## 🔍 Vérifications après migration

### Sur le serveur

1. Vérifier que les services sont démarrés :
```bash
cd /srv/florine-clap
docker compose ps
```

2. Vérifier les logs de Directus :
```bash
docker compose logs -f directus
```

3. Accéder à Directus et vérifier :
   - Les collections sont présentes
   - Les données sont correctes
   - Les images/assets sont visibles

## 🛠️ Dépannage

### Le container Postgres n'est pas trouvé

Vérifiez que vos services sont démarrés :
```bash
docker compose -f docker-compose.dev.yml ps
```

Si nécessaire, démarrez-les :
```bash
docker compose -f docker-compose.dev.yml up -d
```

### Erreur de permissions sur le serveur

#### Problème : Permission denied lors du transfert SCP

Si vous avez une erreur `Permission denied` lors du `scp`, c'est que le répertoire `/srv/florine-clap/` n'a pas les bonnes permissions.

**Solution 1 : Corriger les permissions sur le serveur**

Sur le serveur VPS :
```bash
ssh root@VOTRE_IP_VPS
cd /srv
chown -R root:root florine-clap
chmod 755 florine-clap
```

**Solution 2 : Transférer dans un répertoire temporaire**

Si vous ne pouvez pas modifier les permissions, transférez dans `/tmp` :
```bash
# Local
scp directus.dump root@VOTRE_IP_VPS:/tmp/

# Sur le serveur
ssh root@VOTRE_IP_VPS
mv /tmp/directus.dump /srv/florine-clap/
cd /srv/florine-clap
./import-db-server.sh
```

**Solution 3 : Utiliser un répertoire utilisateur**

Si vous n'êtes pas root, utilisez le home directory :
```bash
# Local
scp directus.dump user@VOTRE_IP_VPS:~/directus.dump

# Sur le serveur
ssh user@VOTRE_IP_VPS
sudo mv ~/directus.dump /srv/florine-clap/
cd /srv/florine-clap
sudo ./import-db-server.sh
```

#### Scripts non exécutables

Assurez-vous que les scripts sont exécutables :
```bash
chmod +x import-db-server.sh import-uploads-server.sh
```

### Le dump est trop volumineux

Si le transfert est lent, vous pouvez compresser le dump :
```bash
gzip directus.dump
scp directus.dump.gz root@VOTRE_IP_VPS:/srv/florine-clap/
```

Puis sur le serveur, décompressez avant de restaurer :
```bash
gunzip directus.dump.gz
./import-db-server.sh directus.dump
```

### Les uploads ne s'affichent pas

Vérifiez que les permissions sont correctes dans le container :
```bash
docker exec -it florine-clap-directus ls -la /directus/uploads
```

Si nécessaire, corrigez les permissions :
```bash
docker exec -it florine-clap-directus chown -R node:node /directus/uploads
```

## 📊 Taille des fichiers

Pour vérifier la taille de vos fichiers avant transfert :

```bash
# Taille du dump
ls -lh directus.dump

# Taille des uploads
ls -lh directus-uploads-export.tar.gz
```

## 🔄 Migration inverse (serveur → local)

Si vous voulez récupérer la DB du serveur vers le local :

1. Sur le serveur, exporter :
```bash
cd /srv/florine-clap
docker exec -t florine-clap-postgres pg_dump -U directus -d directus -Fc > directus-server.dump
```

2. Transférer vers le local :
```bash
scp root@VOTRE_IP_VPS:/srv/florine-clap/directus-server.dump .
```

3. Importer localement :
```bash
docker compose -f docker-compose.dev.yml stop directus frontend
docker exec -i florine-clap-postgres psql -U directus -d postgres -c "DROP DATABASE IF EXISTS directus;"
docker exec -i florine-clap-postgres psql -U directus -d postgres -c "CREATE DATABASE directus;"
docker exec -i florine-clap-postgres pg_restore -U directus -d directus --clean --if-exists < directus-server.dump
docker compose -f docker-compose.dev.yml up -d
```

## ⚠️ Notes importantes

- **Sauvegarde** : Toujours faire une sauvegarde avant de migrer
- **Versions** : Assurez-vous que les versions de Directus sont compatibles entre local et serveur
- **Variables d'environnement** : Les clés Directus (KEY, SECRET) doivent être différentes entre local et production
- **URLs** : Après migration, vérifiez que les URLs dans Directus sont correctes pour la production

## 📞 Support

En cas de problème :
1. Vérifiez les logs : `docker compose logs -f`
2. Vérifiez l'état des containers : `docker compose ps`
3. Vérifiez les permissions des fichiers

