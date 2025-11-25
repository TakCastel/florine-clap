#!/bin/bash

# Script de vérification du serveur Next.js

echo "=== Vérification du serveur Next.js ==="
echo ""

# Vérifier si Node.js est installé
echo "1. Vérification de Node.js..."
if command -v node &> /dev/null; then
    echo "   ✓ Node.js installé: $(node --version)"
else
    echo "   ✗ Node.js n'est pas installé"
    exit 1
fi

# Vérifier si le processus Next.js tourne
echo ""
echo "2. Vérification des processus Node.js..."
if pgrep -f "next" > /dev/null; then
    echo "   ✓ Processus Next.js détecté"
    ps aux | grep -E "next|node" | grep -v grep
else
    echo "   ✗ Aucun processus Next.js détecté"
fi

# Vérifier le port 3000
echo ""
echo "3. Vérification du port 3000..."
if netstat -tlnp 2>/dev/null | grep -q ":3000" || ss -tlnp 2>/dev/null | grep -q ":3000"; then
    echo "   ✓ Le port 3000 est en écoute"
    netstat -tlnp 2>/dev/null | grep ":3000" || ss -tlnp 2>/dev/null | grep ":3000"
else
    echo "   ✗ Le port 3000 n'est pas en écoute"
fi

# Tester la connexion locale
echo ""
echo "4. Test de connexion locale..."
if curl -s http://localhost:3000 > /dev/null; then
    echo "   ✓ Next.js répond sur http://localhost:3000"
else
    echo "   ✗ Next.js ne répond pas sur http://localhost:3000"
fi

# Vérifier nginx
echo ""
echo "5. Vérification de nginx..."
if systemctl is-active --quiet nginx; then
    echo "   ✓ nginx est actif"
else
    echo "   ✗ nginx n'est pas actif"
fi

# Vérifier la configuration nginx
echo ""
echo "6. Vérification de la configuration nginx..."
if sudo nginx -t 2>&1 | grep -q "successful"; then
    echo "   ✓ Configuration nginx valide"
else
    echo "   ✗ Configuration nginx invalide"
    sudo nginx -t
fi

# Vérifier les logs récents
echo ""
echo "7. Dernières erreurs nginx (10 lignes)..."
if [ -f /var/log/nginx/error.log ]; then
    sudo tail -n 10 /var/log/nginx/error.log
else
    echo "   ⚠ Fichier de log nginx non trouvé"
fi

echo ""
echo "=== Fin de la vérification ==="




