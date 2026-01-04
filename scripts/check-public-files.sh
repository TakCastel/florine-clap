#!/bin/bash

# Script pour vérifier que les fichiers du dossier public sont bien présents dans le conteneur
# Usage: ./scripts/check-public-files.sh

echo "🔍 Vérification des fichiers du dossier public dans le conteneur..."
echo ""

CONTAINER_NAME="florine-clap-frontend"

if [ ! "$(docker ps -q -f name=$CONTAINER_NAME)" ]; then
    echo "❌ Le conteneur $CONTAINER_NAME n'est pas en cours d'exécution"
    exit 1
fi

echo "📁 Structure du dossier public:"
docker exec $CONTAINER_NAME ls -la /app/public/ 2>/dev/null || echo "❌ Dossier /app/public/ non trouvé"

echo ""
echo "📁 Fichiers dans /app/public/images/:"
docker exec $CONTAINER_NAME ls -la /app/public/images/ 2>/dev/null || echo "❌ Dossier /app/public/images/ non trouvé"

echo ""
echo "📁 Fichiers dans /app/public/images/logos/:"
docker exec $CONTAINER_NAME ls -la /app/public/images/logos/ 2>/dev/null || echo "❌ Dossier /app/public/images/logos/ non trouvé"

echo ""
echo "🔍 Vérification des types de fichiers:"
echo "SVG:"
docker exec $CONTAINER_NAME find /app/public/images/logos/ -name "*.svg" 2>/dev/null | wc -l
echo "PNG:"
docker exec $CONTAINER_NAME find /app/public/images/logos/ -name "*.png" 2>/dev/null | wc -l
echo "AVIF:"
docker exec $CONTAINER_NAME find /app/public/images/ -name "*.avif" 2>/dev/null | wc -l

echo ""
echo "✅ Vérification terminée"

