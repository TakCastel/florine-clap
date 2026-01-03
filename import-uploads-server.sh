#!/bin/bash

# Script pour importer les uploads Directus sur le serveur VPS
# Usage: ./import-uploads-server.sh [archive_file]

set -e

ARCHIVE_FILE="${1:-directus-uploads-export.tar.gz}"
COMPOSE_FILE="docker-compose.yml"
CONTAINER_NAME="florine-clap-directus"

echo "📥 Import des uploads Directus sur le serveur..."

# Vérifier que le fichier archive existe
if [ ! -f "$ARCHIVE_FILE" ]; then
    echo "❌ Erreur: Le fichier archive '$ARCHIVE_FILE' n'existe pas"
    echo "   Usage: $0 [archive_file]"
    exit 1
fi

# Vérifier que Docker est disponible
if ! command -v docker &> /dev/null; then
    echo "❌ Docker n'est pas installé"
    exit 1
fi

echo "⚠️  ATTENTION: Cette opération va remplacer les uploads actuels !"
echo "   Fichier: $ARCHIVE_FILE"
read -p "Êtes-vous sûr de vouloir continuer ? (oui/non): " confirm

if [ "$confirm" != "oui" ]; then
    echo "❌ Import annulé"
    exit 0
fi

echo ""
echo "🛑 Arrêt de Directus..."
docker compose -f $COMPOSE_FILE stop directus || true

echo ""
echo "📥 Extraction des fichiers dans le container..."
# Copier l'archive dans le container
docker cp "$ARCHIVE_FILE" $CONTAINER_NAME:/tmp/uploads.tar.gz

# Extraire dans le répertoire uploads
docker exec -i $CONTAINER_NAME sh -c "cd /directus/uploads && rm -rf * && tar xzf /tmp/uploads.tar.gz && rm /tmp/uploads.tar.gz"

echo ""
echo "🚀 Redémarrage de Directus..."
docker compose -f $COMPOSE_FILE up -d directus

echo ""
echo "✅ Import des uploads terminé avec succès !"
echo ""
echo "📋 Vérifications:"
echo "   1. Accédez à Directus et vérifiez que les images/assets sont visibles"
echo "   2. Vérifiez les logs: docker compose -f $COMPOSE_FILE logs -f directus"

