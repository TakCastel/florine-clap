#!/bin/bash
# Script de déploiement complet sur le serveur
# Usage: ./scripts/deploy.sh [--skip-schema]

set -e  # Arrêter en cas d'erreur

SKIP_SCHEMA=false
if [ "$1" == "--skip-schema" ]; then
  SKIP_SCHEMA=true
fi

echo "🚀 Déploiement en cours..."
echo ""

# 1. Récupérer les modifications
echo "📥 Récupération des modifications depuis Git..."
git pull
echo "✅ Modifications récupérées"
echo ""

# 2. Appliquer le schéma Directus (si nécessaire)
if [ "$SKIP_SCHEMA" = false ]; then
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
    echo "ℹ️  Aucun snapshot trouvé, passage du schéma"
    echo ""
  fi
else
  echo "⏭️  Application du schéma ignorée (--skip-schema)"
  echo ""
fi

# 3. Reconstruire et redémarrer le frontend
echo "🔨 Reconstruction du frontend..."
docker compose build frontend
echo "✅ Frontend reconstruit"
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
