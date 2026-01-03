#!/bin/bash

# Script pour exporter la base de données locale vers un dump
# Usage: ./export-db-local.sh

set -e

DUMP_FILE="directus.dump"
COMPOSE_FILE="docker-compose.dev.yml"

echo "📦 Export de la base de données locale..."

# Vérifier que Docker est disponible
if ! command -v docker &> /dev/null; then
    echo "❌ Docker n'est pas installé"
    exit 1
fi

# Vérifier que docker-compose est disponible
if ! command -v docker-compose &> /dev/null && ! docker compose version &> /dev/null; then
    echo "❌ Docker Compose n'est pas installé"
    exit 1
fi

# Détecter le nom du container Postgres
if docker compose -f $COMPOSE_FILE ps postgres | grep -q "Up"; then
    CONTAINER_NAME="florine-clap-postgres"
    echo "✅ Container Postgres trouvé: $CONTAINER_NAME"
elif docker ps | grep -q "florine-clap-postgres"; then
    CONTAINER_NAME="florine-clap-postgres"
    echo "✅ Container Postgres trouvé: $CONTAINER_NAME"
else
    echo "❌ Container Postgres non trouvé. Démarrez d'abord: docker-compose -f $COMPOSE_FILE up -d"
    exit 1
fi

# Lire les variables d'environnement depuis .env ou utiliser les valeurs par défaut
POSTGRES_USER=${POSTGRES_USER:-directus}
POSTGRES_DB=${POSTGRES_DB:-directus}

echo "📤 Création du dump..."
echo "   User: $POSTGRES_USER"
echo "   Database: $POSTGRES_DB"

# Créer le dump au format custom (-Fc)
docker exec -t $CONTAINER_NAME pg_dump -U $POSTGRES_USER -d $POSTGRES_DB -Fc > $DUMP_FILE

# Vérifier que le dump a été créé
if [ -f "$DUMP_FILE" ]; then
    SIZE=$(du -h "$DUMP_FILE" | cut -f1)
    echo "✅ Dump créé: $DUMP_FILE ($SIZE)"
    echo ""
    echo "📋 Prochaines étapes:"
    echo "   1. Transférez le fichier sur le serveur:"
    echo "      scp $DUMP_FILE root@VOTRE_IP_VPS:/srv/florine-clap/"
    echo ""
    echo "   2. Sur le serveur, exécutez:"
    echo "      cd /srv/florine-clap"
    echo "      ./import-db-server.sh"
else
    echo "❌ Erreur: Le dump n'a pas été créé"
    exit 1
fi

