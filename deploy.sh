#!/bin/bash

# Script de déploiement pour OVH VPS
# Usage: ./deploy.sh

set -e  # Arrêter en cas d'erreur

echo "🚀 Déploiement de Florine Clap..."

# Vérifier que Docker est installé
if ! command -v docker &> /dev/null; then
    echo "❌ Docker n'est pas installé. Veuillez l'installer d'abord."
    exit 1
fi

# Vérifier que Docker Compose est installé
if ! command -v docker-compose &> /dev/null; then
    echo "❌ Docker Compose n'est pas installé. Veuillez l'installer d'abord."
    exit 1
fi

# Vérifier que le fichier .env existe
if [ ! -f .env ]; then
    echo "❌ Le fichier .env n'existe pas. Veuillez le créer d'abord."
    exit 1
fi

echo "📦 Construction et démarrage des conteneurs..."
docker-compose up -d --build

echo "⏳ Attente du démarrage des services..."
sleep 10

echo "✅ Vérification de l'état des conteneurs..."
docker-compose ps

echo ""
echo "📋 Logs des services (Ctrl+C pour quitter) :"
echo ""
docker-compose logs -f

