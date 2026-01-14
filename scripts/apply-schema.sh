#!/bin/bash
# Script pour appliquer uniquement le schéma Directus (sans rebuild du frontend)
# Usage: ./scripts/apply-schema.sh [--force]

set -e  # Arrêter en cas d'erreur

FORCE=false
if [ "$1" == "--force" ]; then
  FORCE=true
  echo "⚠️  Mode FORCE activé - le schéma sera appliqué même si aucune différence n'est détectée"
  echo ""
fi

echo "🔄 Application du schéma Directus..."
echo ""

SNAPSHOT_PATH="directus/snapshots/schema.yaml"

if [ ! -f "$SNAPSHOT_PATH" ]; then
  echo "❌ Erreur: Le fichier snapshot n'existe pas: $SNAPSHOT_PATH"
  echo "   Exécutez d'abord en local: cd front && npm run directus:export"
  exit 1
fi

echo "📋 Snapshot trouvé: $SNAPSHOT_PATH"
echo ""

# Appliquer le schéma Directus
cd front
if [ "$FORCE" = true ]; then
  if npm run directus:apply:force; then
    echo ""
    echo "✅ Schéma Directus appliqué avec succès (mode forcé)!"
  else
    echo ""
    echo "❌ Erreur lors de l'application du schéma"
    exit 1
  fi
else
  if npm run directus:apply; then
    echo ""
    echo "✅ Schéma Directus appliqué avec succès!"
  else
    echo ""
    echo "❌ Erreur lors de l'application du schéma"
    exit 1
  fi
fi
cd ..

echo ""
echo "✨ Terminé!"
