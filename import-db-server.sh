#!/bin/bash

# Script pour importer la base de données sur le serveur VPS
# Usage: ./import-db-server.sh [dump_file]

set -e

DUMP_FILE="${1:-directus.dump}"
COMPOSE_FILE="docker-compose.yml"

echo "📥 Import de la base de données sur le serveur..."

# Vérifier que le fichier dump existe
if [ ! -f "$DUMP_FILE" ]; then
    echo "❌ Erreur: Le fichier dump '$DUMP_FILE' n'existe pas"
    echo "   Usage: $0 [dump_file]"
    exit 1
fi

# Vérifier que Docker est disponible
if ! command -v docker &> /dev/null; then
    echo "❌ Docker n'est pas installé"
    exit 1
fi

# Lire les variables d'environnement depuis .env ou utiliser les valeurs par défaut
POSTGRES_USER=${POSTGRES_USER:-directus}
POSTGRES_DB=${POSTGRES_DB:-directus}
CONTAINER_NAME="florine-clap-postgres"

echo "⚠️  ATTENTION: Cette opération va remplacer toutes les données actuelles !"
echo "   Fichier: $DUMP_FILE"
echo "   Database: $POSTGRES_DB"
echo "   User: $POSTGRES_USER"
read -p "Êtes-vous sûr de vouloir continuer ? (oui/non): " confirm

if [ "$confirm" != "oui" ]; then
    echo "❌ Import annulé"
    exit 0
fi

echo ""
echo "🛑 Arrêt des services Directus et Frontend..."
docker compose -f $COMPOSE_FILE stop directus frontend || true

echo ""
echo "🗑️  Suppression de l'ancienne base de données..."
docker exec -i $CONTAINER_NAME psql -U $POSTGRES_USER -d postgres -c "DROP DATABASE IF EXISTS $POSTGRES_DB;" || true

echo ""
echo "✨ Création de la nouvelle base de données..."
docker exec -i $CONTAINER_NAME psql -U $POSTGRES_USER -d postgres -c "CREATE DATABASE $POSTGRES_DB;"

echo ""
echo "📥 Restauration du dump..."
# Utiliser pg_restore avec le fichier dans le container
docker cp "$DUMP_FILE" $CONTAINER_NAME:/tmp/directus.dump
docker exec -i $CONTAINER_NAME pg_restore -U $POSTGRES_USER -d $POSTGRES_DB --clean --if-exists /tmp/directus.dump
docker exec -i $CONTAINER_NAME rm /tmp/directus.dump

echo ""
echo "🚀 Redémarrage des services..."
docker compose -f $COMPOSE_FILE up -d

echo ""
echo "✅ Import terminé avec succès !"
echo ""
echo "📋 Vérifications:"
echo "   1. Vérifiez les logs: docker compose -f $COMPOSE_FILE logs -f directus"
echo "   2. Accédez à Directus et vérifiez vos collections"
echo "   3. Vérifiez que les images/assets sont bien présents"

