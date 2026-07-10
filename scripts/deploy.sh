#!/bin/bash
# Script de déploiement complet sur le serveur
# Usage: ./scripts/deploy.sh [--apply-schema] [--no-pull] [--pull-image]
#
# Par défaut, le schéma Directus n'est JAMAIS appliqué pour ne pas écraser
# les modifications faites dans l'interface admin. Utiliser --apply-schema
# uniquement quand vous avez exporté et versionné un nouveau schéma.
# --no-pull : saute git pull (utilisé par la CI GitHub après git reset)
# --pull-image : pull l'image GHCR au lieu de builder (CI/CD, nécessite FRONTEND_IMAGE_TAG)

set -e  # Arrêter en cas d'erreur

APPLY_SCHEMA=false
SKIP_PULL=false
PULL_IMAGE=false

for arg in "$@"; do
  case "$arg" in
    --apply-schema) APPLY_SCHEMA=true ;;
    --no-pull) SKIP_PULL=true ;;
    --pull-image) PULL_IMAGE=true ;;
  esac
done

echo "🚀 Déploiement en cours..."
echo ""

# 1. Récupérer les modifications
if [ "$SKIP_PULL" = true ]; then
  echo "⏭️  git pull ignoré (--no-pull)"
  echo ""
else
  echo "📥 Récupération des modifications depuis Git..."
  git pull
  echo "✅ Modifications récupérées"
  echo ""
fi

# 2. Appliquer le schéma Directus (uniquement si --apply-schema)
if [ "$APPLY_SCHEMA" = true ]; then
  SNAPSHOT_PATH="directus/snapshots/schema.yaml"
  if [ -f "$SNAPSHOT_PATH" ]; then
    echo "🔄 Application du schéma Directus..."
    cd front
    if npm run directus:apply 2>/dev/null; then
      echo "✅ Schéma Directus appliqué"
    else
      echo "⚠️  Erreur lors de l'application du schéma (peut être normal si déjà à jour)"
    fi
    cd ..
    echo ""
  else
    echo "ℹ️  Aucun snapshot trouvé"
    echo ""
  fi
else
  echo "⏭️  Schéma Directus non appliqué (les modifs back-office sont préservées)"
  echo "   Pour appliquer le schéma : ./scripts/deploy.sh --apply-schema"
  echo ""
fi

# 3. Mettre à jour le frontend
if [ "$PULL_IMAGE" = true ]; then
  if [ -z "$FRONTEND_IMAGE_TAG" ]; then
    echo "❌ FRONTEND_IMAGE_TAG est requis avec --pull-image"
    exit 1
  fi
  echo "📥 Récupération de l'image ghcr.io/takcastel/florine-clap-frontend:${FRONTEND_IMAGE_TAG}..."
  docker compose pull frontend
  echo "✅ Image récupérée"
else
  echo "🔨 Reconstruction du frontend..."
  docker compose build frontend
  echo "✅ Frontend reconstruit"
fi
echo ""

echo "🔄 Redémarrage du frontend..."
docker compose up -d frontend
echo "✅ Frontend redémarré"
echo ""

# 4. Warmup du cache (pré-remplit le cache Directus pour navigation rapide)
echo "🔥 Warmup du cache..."
WARMUP_URL="${SITE_URL:-http://localhost:3000}"
sleep 5
WARMUP_OK=false
for i in 1 2 3; do
  if curl -sf "${WARMUP_URL}/api/warmup" > /dev/null 2>&1; then
    echo "✅ Cache pré-rempli (warmup OK)"
    WARMUP_OK=true
    break
  fi
  [ $i -lt 3 ] && echo "   Tentative $i échouée, nouvel essai dans 3s..." && sleep 3
done
if [ "$WARMUP_OK" = false ]; then
  echo "⚠️  Warmup échoué (optionnel). Définir SITE_URL dans .env si reverse proxy (ex: https://florineclap.com)"
fi
echo ""

echo "✨ Déploiement terminé avec succès!"
echo ""
echo "📊 Vérification des conteneurs:"
docker compose ps
