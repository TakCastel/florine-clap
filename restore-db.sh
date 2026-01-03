#!/bin/bash

# Script de restauration de la base de données PostgreSQL
# Usage: ./restore-db.sh [chemin-vers-backup.sql.gz]

set -e

if [ -z "$1" ]; then
    echo "❌ Usage: $0 <chemin-vers-backup.sql.gz>"
    echo ""
    echo "Exemples:"
    echo "  $0 /var/backups/florine-clap/backup_20240101_120000.sql.gz"
    echo "  $0 backup_20240101_120000.sql.gz"
    exit 1
fi

BACKUP_FILE="$1"
PROJECT_DIR="/var/www/florine-clap"

# Si le chemin est relatif, chercher dans le répertoire de sauvegarde par défaut
if [ ! -f "$BACKUP_FILE" ]; then
    BACKUP_FILE="/var/backups/florine-clap/$1"
fi

# Vérifier que le fichier existe
if [ ! -f "$BACKUP_FILE" ]; then
    echo "❌ Erreur: Le fichier de sauvegarde n'existe pas : $BACKUP_FILE"
    exit 1
fi

echo "⚠️  ATTENTION: Cette opération va remplacer toutes les données actuelles !"
echo "Fichier de sauvegarde: $BACKUP_FILE"
read -p "Êtes-vous sûr de vouloir continuer ? (oui/non): " confirm

if [ "$confirm" != "oui" ]; then
    echo "❌ Restauration annulée"
    exit 0
fi

echo "🔄 Restauration de la base de données..."

cd $PROJECT_DIR

# Restaurer la sauvegarde
gunzip < "$BACKUP_FILE" | docker-compose exec -T postgres psql -U directus directus

echo "✅ Restauration terminée avec succès"
echo "💡 Vous devrez peut-être redémarrer Directus: docker-compose restart directus"

