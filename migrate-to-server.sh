#!/bin/bash

# Script complet pour migrer la DB et les uploads vers le serveur
# Usage: ./migrate-to-server.sh [VPS_IP] [VPS_USER]

set -e

VPS_IP="${1}"
VPS_USER="${2:-root}"
VPS_PATH="/srv/florine-clap"

if [ -z "$VPS_IP" ]; then
    echo "❌ Usage: $0 <VPS_IP> [VPS_USER]"
    echo "   Exemple: $0 37.59.98.75 root"
    exit 1
fi

echo "🚀 Migration complète vers le serveur VPS"
echo "   IP: $VPS_IP"
echo "   User: $VPS_USER"
echo "   Path: $VPS_PATH"
echo ""

# Étape 1: Exporter la DB locale
echo "📦 Étape 1/4: Export de la base de données locale..."
./export-db-local.sh

# Étape 2: Transférer la DB
echo ""
echo "📤 Étape 2/4: Transfert de la base de données vers le serveur..."
scp directus.dump $VPS_USER@$VPS_IP:$VPS_PATH/

# Étape 3: Exporter les uploads (optionnel)
echo ""
read -p "Voulez-vous aussi migrer les uploads Directus ? (oui/non): " migrate_uploads

if [ "$migrate_uploads" = "oui" ]; then
    echo ""
    echo "📦 Étape 3/4: Export des uploads locaux..."
    ./export-uploads-local.sh
    
    echo ""
    echo "📤 Transfert des uploads vers le serveur..."
    scp directus-uploads-export.tar.gz $VPS_USER@$VPS_IP:$VPS_PATH/
    
    echo ""
    echo "📥 Import des uploads sur le serveur..."
    ssh $VPS_USER@$VPS_IP "cd $VPS_PATH && chmod +x import-uploads-server.sh && ./import-uploads-server.sh directus-uploads-export.tar.gz"
else
    echo ""
    echo "⏭️  Étape 3/4: Migration des uploads ignorée"
fi

# Étape 4: Importer la DB sur le serveur
echo ""
echo "📥 Étape 4/4: Import de la base de données sur le serveur..."
ssh $VPS_USER@$VPS_IP "cd $VPS_PATH && chmod +x import-db-server.sh && ./import-db-server.sh directus.dump"

echo ""
echo "✅ Migration terminée avec succès !"
echo ""
echo "📋 Vérifications sur le serveur:"
echo "   ssh $VPS_USER@$VPS_IP"
echo "   cd $VPS_PATH"
echo "   docker compose ps"
echo "   docker compose logs -f directus"

