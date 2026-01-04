#!/bin/bash

# Script de déploiement automatique
# Ce script est exécuté sur le serveur par GitHub Actions
# Usage: ./scripts/deploy-auto.sh

set -e  # Arrêter en cas d'erreur

echo "🚀 Déploiement automatique de Florine Clap..."
echo "📅 $(date)"

# Vérifier que nous sommes dans le bon répertoire
if [ ! -f "docker-compose.yml" ]; then
    echo "❌ Le fichier docker-compose.yml n'existe pas. Êtes-vous dans le bon répertoire ?"
    exit 1
fi

# Vérifier que le fichier .env existe
if [ ! -f .env ]; then
    echo "❌ Le fichier .env n'existe pas. Veuillez le créer d'abord."
    exit 1
fi

# Pull des dernières modifications
echo "🔄 Récupération des dernières modifications..."
git pull origin main || {
    echo "⚠️  Erreur lors du pull. Vérifiez votre connexion Git."
    exit 1
}

# Rebuild du frontend uniquement (plus rapide)
echo "📦 Reconstruction de l'image frontend..."
docker-compose build frontend || {
    echo "❌ Erreur lors de la construction de l'image frontend."
    exit 1
}

# Redémarrage du conteneur frontend
echo "🚀 Redémarrage du conteneur frontend..."
docker-compose up -d frontend || {
    echo "❌ Erreur lors du redémarrage du conteneur frontend."
    exit 1
}

# Attendre un peu pour que le conteneur démarre
echo "⏳ Attente du démarrage du conteneur..."
sleep 5

# Vérifier l'état du conteneur
echo "✅ Vérification de l'état du conteneur..."
docker-compose ps frontend

# Afficher les dernières lignes des logs
echo ""
echo "📋 Dernières lignes des logs du frontend:"
docker-compose logs --tail=20 frontend

echo ""
echo "✅ Déploiement terminé avec succès !"
echo "🌐 Le site devrait être accessible dans quelques secondes."

