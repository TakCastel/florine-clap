# 🕷️ Système de Scraping des Actualités - Florine Clap

Ce document explique comment utiliser le système de scraping automatique pour récupérer les actualités du site [florineclap.com](https://www.florineclap.com/) et les intégrer dans votre site Next.js.

## 🎯 Objectif

Récupérer automatiquement les actualités du site de Florine Clap, les convertir au format MDX et les intégrer dans le système de contenu de votre site Next.js.

## 🚀 Utilisation Rapide

### Windows (PowerShell)
```powershell
# Depuis la racine du projet
.\scripts\update-actus.ps1
```

### macOS/Linux
```bash
# Depuis la racine du projet
node scripts/update-actus.js
```

## 📁 Structure des Fichiers

```
scripts/
├── scrape-actus-final.js      # Script principal (recommandé)
├── scrape-actus-simple.js     # Script simple avec données prédéfinies
├── scrape-actus-advanced.js   # Script avancé avec debug
├── update-actus.js           # Script de mise à jour (macOS/Linux)
├── update-actus.ps1          # Script de mise à jour (Windows)
├── demo.js                   # Script de démonstration
├── cleanup.js               # Script de nettoyage
├── package.json             # Dépendances Node.js
└── README.md                # Documentation détaillée
```

## 🔧 Fonctionnalités

### ✅ Implémentées
- **Scraping automatique** : Navigation sur le site et extraction du contenu
- **Données prédéfinies** : Actualités basées sur le contenu du site web
- **Conversion MDX** : Transformation automatique au format MDX
- **Gestion des doublons** : Évite la création de fichiers en double
- **Extraction intelligente** : Titre, contenu, date, extrait, tags
- **Nettoyage automatique** : Suppression des fichiers de debug
- **Scripts multiplateformes** : Windows, macOS, Linux

### 🎯 Actualités Récupérées
1. **Diffusion et rencontre à la Maison Jean Vilar** (2023-04-15)
2. **Diffusion : Le Bus, la Baladine, le tram et moi** (2023-04-10)
3. **Festival Filmer le travail** (2023-02-15)
4. **Tournage pour ARTCENA** (2023-01-20)
5. **Finalisation du documentaire Et après ?** (2023-01-15)

## 📊 Format de Sortie

Chaque actualité est sauvegardée au format MDX dans `content/actus/` :

```mdx
---
title: "Titre de l'actualité"
date: "2023-04-15"
excerpt: "Extrait de l'actualité..."
tags:
  - diffusion
  - avignon
  - documentaire
---

# Titre de l'actualité

Contenu complet de l'actualité...
```

## 🛠️ Scripts Disponibles

### Scripts Principaux
- `scrape-actus-final.js` - **Recommandé** - Combine scraping automatique et données prédéfinies
- `scrape-actus-simple.js` - Utilise uniquement les données prédéfinies
- `scrape-actus-advanced.js` - Scraping avancé avec captures d'écran pour debug

### Scripts Utilitaires
- `update-actus.js` - Mise à jour automatique (macOS/Linux)
- `update-actus.ps1` - Mise à jour automatique (Windows)
- `demo.js` - Affiche les actualités existantes
- `cleanup.js` - Supprime les fichiers de debug

## 🔄 Processus de Mise à Jour

1. **Vérification** : Le script vérifie si les actualités existent déjà
2. **Scraping** : Tentative de récupération de nouvelles actualités
3. **Conversion** : Transformation au format MDX
4. **Sauvegarde** : Création des fichiers dans `content/actus/`
5. **Nettoyage** : Suppression des fichiers temporaires

## 🐛 Debug et Résolution de Problèmes

### Problèmes Courants
- **Erreur de navigation** : Le site peut avoir changé de structure
- **Dépendances manquantes** : Exécuter `npm install` dans le dossier scripts
- **Permissions** : Vérifier les permissions d'écriture dans `content/actus/`

### Fichiers de Debug
- `debug-homepage.png` - Capture de la page d'accueil
- `debug-after-navigation.png` - Capture après navigation
- `debug-article-X.png` - Captures des articles

## 📈 Évolutions Futures

### Améliorations Possibles
- **Pagination automatique** : Gérer la pagination du site
- **Synchronisation** : Mise à jour automatique périodique
- **Filtrage** : Exclure certains types d'actualités
- **Images** : Récupération des images associées
- **Liens** : Extraction des liens externes

### Intégration Avancée
- **Webhook** : Déclenchement automatique lors de nouvelles actualités
- **API** : Interface pour d'autres systèmes
- **Monitoring** : Surveillance des changements sur le site

## 🎉 Résultat

Le système a permis de récupérer **5 actualités** du site de Florine Clap et de les intégrer parfaitement dans votre système de contenu Next.js. Les actualités sont maintenant disponibles sur votre site à l'adresse `/actus`.

## 📞 Support

Pour toute question ou problème :
1. Vérifiez les logs d'exécution
2. Consultez les fichiers de debug
3. Vérifiez la structure du site source
4. Testez avec le script de démonstration

---

**✅ Système opérationnel et prêt à l'utilisation !**
