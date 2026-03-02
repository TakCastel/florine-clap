#!/bin/bash
# Script de backup à lancer SUR LA PROD
# Capture la BDD + tous les uploads dans backups/
# Usage: ./scripts/backup-prod.sh

set -e

BACKUP_DIR="backups"
TIMESTAMP=$(date +%Y%m%d_%H%M)
DUMP_FILE="${BACKUP_DIR}/directus_${TIMESTAMP}.dump"
UPLOADS_FILE="${BACKUP_DIR}/uploads_${TIMESTAMP}.tar.gz"

mkdir -p "$BACKUP_DIR"

echo "📦 Backup en cours..."
echo ""

# 1. Dump de la BDD
echo "1/2 Base de données..."
docker compose exec -T postgres pg_dump -U directus -Fc directus > "$DUMP_FILE"
echo "   → $DUMP_FILE"

# 2. Archive des uploads (tout le contenu de /directus/uploads)
echo "2/2 Uploads..."
docker compose exec -T directus tar -czf - -C /directus uploads > "$UPLOADS_FILE"
echo "   → $UPLOADS_FILE"

echo ""
echo "✅ Backup terminé : $DUMP_FILE + $UPLOADS_FILE"
echo ""
echo "Pour restaurer en local :"
echo "  1. Copie les 2 fichiers dans backups/"
echo "  2. docker compose stop directus frontend"
echo "  3. docker compose exec postgres psql -U directus -d directus -c \"DROP SCHEMA public CASCADE; CREATE SCHEMA public; GRANT ALL ON SCHEMA public TO directus; GRANT ALL ON SCHEMA public TO public;\""
echo "  4. docker compose cp backups/directus_XXX.dump postgres:/tmp/restore.dump"
echo "  5. docker compose exec postgres pg_restore -U directus -d directus /tmp/restore.dump"
echo "  6. docker run --rm -v florine-clap_directus_uploads:/uploads -v \$(pwd)/backups:/backups alpine sh -c \"rm -rf /uploads/*; tar -xzf /backups/uploads_XXX.tar.gz -C /uploads --strip-components=1\""
echo "  7. docker compose up -d"
