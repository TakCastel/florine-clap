#!/bin/bash

# Script pour exporter les uploads Directus depuis le volume Docker local
# Usage: ./export-uploads-local.sh

set -e

OUTPUT_DIR="directus-uploads-export"
COMPOSE_FILE="docker-compose.dev.yml"
VOLUME_NAME="florine-clap_directus_uploads"

echo "📦 Export des uploads Directus locaux..."

# Vérifier que Docker est disponible
if ! command -v docker &> /dev/null; then
    echo "❌ Docker n'est pas installé"
    exit 1
fi

# Vérifier que le volume existe
if ! docker volume ls | grep -q "$VOLUME_NAME"; then
    echo "⚠️  Volume '$VOLUME_NAME' non trouvé"
    echo "   Vérifiez le nom du volume avec: docker volume ls"
    read -p "Nom du volume Directus uploads (ou laissez vide pour ignorer): " VOLUME_NAME
    if [ -z "$VOLUME_NAME" ]; then
        echo "❌ Export annulé"
        exit 0
    fi
fi

echo "📤 Extraction des fichiers depuis le volume Docker..."
echo "   Volume: $VOLUME_NAME"
echo "   Destination: $OUTPUT_DIR"

# Créer un container temporaire pour extraire les fichiers
docker run --rm \
    -v "$VOLUME_NAME:/source:ro" \
    -v "$(pwd):/dest" \
    alpine:latest \
    sh -c "cd /source && tar czf /dest/$OUTPUT_DIR.tar.gz ."

# Vérifier que l'archive a été créée
if [ -f "$OUTPUT_DIR.tar.gz" ]; then
    SIZE=$(du -h "$OUTPUT_DIR.tar.gz" | cut -f1)
    echo "✅ Archive créée: $OUTPUT_DIR.tar.gz ($SIZE)"
    echo ""
    echo "📋 Prochaines étapes:"
    echo "   1. Transférez l'archive sur le serveur:"
    echo "      scp $OUTPUT_DIR.tar.gz root@VOTRE_IP_VPS:/srv/florine-clap/"
    echo ""
    echo "   2. Sur le serveur, exécutez:"
    echo "      cd /srv/florine-clap"
    echo "      ./import-uploads-server.sh"
else
    echo "❌ Erreur: L'archive n'a pas été créée"
    exit 1
fi

