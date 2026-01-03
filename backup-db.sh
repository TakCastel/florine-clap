#!/bin/bash

# Script de sauvegarde de la base de données PostgreSQL
# Usage: ./backup-db.sh

set -e

BACKUP_DIR="/var/backups/florine-clap"
DATE=$(date +%Y%m%d_%H%M%S)
PROJECT_DIR="/var/www/florine-clap"

# Créer le répertoire de sauvegarde s'il n'existe pas
mkdir -p $BACKUP_DIR

echo "💾 Création de la sauvegarde de la base de données..."

# Vérifier que docker-compose est disponible
if [ ! -f "$PROJECT_DIR/docker-compose.yml" ]; then
    echo "❌ Erreur: docker-compose.yml introuvable dans $PROJECT_DIR"
    exit 1
fi

# Créer la sauvegarde
cd $PROJECT_DIR
docker-compose exec -T postgres pg_dump -U directus directus | gzip > $BACKUP_DIR/backup_$DATE.sql.gz

# Vérifier que la sauvegarde a été créée
if [ -f "$BACKUP_DIR/backup_$DATE.sql.gz" ]; then
    SIZE=$(du -h "$BACKUP_DIR/backup_$DATE.sql.gz" | cut -f1)
    echo "✅ Sauvegarde créée : $BACKUP_DIR/backup_$DATE.sql.gz ($SIZE)"
else
    echo "❌ Erreur lors de la création de la sauvegarde"
    exit 1
fi

# Garder seulement les 30 derniers backups
echo "🧹 Nettoyage des anciennes sauvegardes (conservation des 30 dernières)..."
ls -t $BACKUP_DIR/backup_*.sql.gz 2>/dev/null | tail -n +31 | xargs -r rm -f

echo "✅ Sauvegarde terminée avec succès"

