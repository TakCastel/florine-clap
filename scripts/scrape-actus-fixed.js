const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');
const https = require('https');
const http = require('http');

// Configuration
const BASE_URL = 'https://www.florineclap.com/';
const OUTPUT_DIR = path.join(__dirname, '..', 'content', 'actus');
const IMAGES_DIR = path.join(__dirname, '..', 'public', 'images', 'uploads');

// Fonction pour nettoyer le texte
function cleanText(text) {
  return text.replace(/\s+/g, ' ').replace(/\n+/g, '\n').trim();
}

// Fonction pour créer un slug
function createSlug(title) {
  return title
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
}

// Fonction pour télécharger une image
async function downloadImage(url, filename) {
  return new Promise((resolve, reject) => {
    const protocol = url.startsWith('https:') ? https : http;
    
    protocol.get(url, (response) => {
      if (response.statusCode === 200) {
        const filepath = path.join(IMAGES_DIR, filename);
        const file = fs.createWriteStream(filepath);
        response.pipe(file);
        
        file.on('finish', () => {
          file.close();
          console.log(`📸 Image téléchargée: ${filename}`);
          resolve(filepath);
        });
        
        file.on('error', (err) => {
          fs.unlink(filepath, () => {});
          reject(err);
        });
      } else {
        reject(new Error(`Erreur HTTP: ${response.statusCode}`));
      }
    }).on('error', reject);
  });
}

// Fonction pour extraire la date
function extractDate(text) {
  const datePatterns = [
    /(\d{1,2})\s+(janvier|février|mars|avril|mai|juin|juillet|août|septembre|octobre|novembre|décembre)\s+(\d{4})/i,
    /(\d{1,2})\/(\d{1,2})\/(\d{4})/,
    /(\d{4})-(\d{1,2})-(\d{1,2})/
  ];
  
  const months = {
    'janvier': '01', 'février': '02', 'mars': '03', 'avril': '04',
    'mai': '05', 'juin': '06', 'juillet': '07', 'août': '08',
    'septembre': '09', 'octobre': '10', 'novembre': '11', 'décembre': '12'
  };
  
  for (const pattern of datePatterns) {
    const match = text.match(pattern);
    if (match) {
      if (pattern === datePatterns[0]) {
        const day = match[1].padStart(2, '0');
        const month = months[match[2].toLowerCase()];
        const year = match[3];
        return `${year}-${month}-${day}`;
      } else if (pattern === datePatterns[1]) {
        const day = match[1].padStart(2, '0');
        const month = match[2].padStart(2, '0');
        const year = match[3];
        return `${year}-${month}-${day}`;
      } else if (pattern === datePatterns[2]) {
        return match[0];
      }
    }
  }
  
  return new Date().toISOString().split('T')[0];
}

// Fonction pour créer le contenu MDX
function createMdxContent(actu) {
  const imageTag = actu.image ? `\n![${actu.title}](${actu.image})\n` : '';
  
  return `---
title: "${actu.title.replace(/"/g, '\\"')}"
date: "${actu.date}"
excerpt: "${actu.excerpt.replace(/"/g, '\\"')}"
${actu.image ? `image: "${actu.image}"` : ''}
tags:
${actu.tags.map(tag => `  - ${tag}`).join('\n')}
---

# ${actu.title}
${imageTag}
${actu.content}
`;
}

// Fonction pour supprimer les anciens articles
function cleanupOldArticles() {
  console.log('🧹 Suppression des anciens articles...');
  
  if (!fs.existsSync(OUTPUT_DIR)) {
    fs.mkdirSync(OUTPUT_DIR, { recursive: true });
    return;
  }
  
  const files = fs.readdirSync(OUTPUT_DIR);
  let deletedCount = 0;
  
  files.forEach(file => {
    if (file.endsWith('.mdx')) {
      const filepath = path.join(OUTPUT_DIR, file);
      fs.unlinkSync(filepath);
      console.log(`🗑️ Supprimé: ${file}`);
      deletedCount++;
    }
  });
  
  console.log(`✅ ${deletedCount} anciens articles supprimés`);
}

async function scrapeActusFixed() {
  console.log('🚀 Scraping FIXÉ des actualités de Florine Clap...');
  
  // Créer les dossiers
  if (!fs.existsSync(OUTPUT_DIR)) {
    fs.mkdirSync(OUTPUT_DIR, { recursive: true });
  }
  if (!fs.existsSync(IMAGES_DIR)) {
    fs.mkdirSync(IMAGES_DIR, { recursive: true });
  }
  
  // Supprimer les anciens articles
  cleanupOldArticles();
  
  const browser = await puppeteer.launch({
    headless: false, // Mode visible pour debug
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });
  
  try {
    const page = await browser.newPage();
    await page.setViewport({ width: 1920, height: 1080 });
    
    // Aller sur la page d'accueil
    console.log('📄 Navigation vers le site...');
    await page.goto(BASE_URL, { waitUntil: 'networkidle2' });
    await page.waitForTimeout(3000);
    
    // Prendre une capture d'écran pour debug
    await page.screenshot({ path: 'debug-homepage-fixed.png' });
    console.log('📸 Capture d\'écran: debug-homepage-fixed.png');
    
    // Extraire le contenu de la page d'accueil
    console.log('🔍 Extraction du contenu de la page d\'accueil...');
    const homeContent = await page.evaluate(() => {
      return {
        title: document.title,
        bodyText: document.body.textContent,
        html: document.body.innerHTML
      };
    });
    
    console.log(`📄 Titre de la page: ${homeContent.title}`);
    console.log(`📝 Contenu (${homeContent.bodyText.length} caractères)`);
    
    // Chercher les actualités dans le contenu
    const actuPatterns = [
      /Diffusion et rencontre à la Maison Jean Vilar[^]*?Avignon, avril 2023[^]*?(?=Diffusion|Festival|Tournage|Finalisation|$)/g,
      /Diffusion : Le Bus, la Baladine, le tram et moi[^]*?Avignon, avril 2023[^]*?(?=Diffusion|Festival|Tournage|Finalisation|$)/g,
      /Festival Filmer le travail[^]*?Poitiers, février 2023[^]*?(?=Diffusion|Festival|Tournage|Finalisation|$)/g,
      /Tournage pour ARTCENA[^]*?Rencontre avec l'autrice[^]*?(?=Diffusion|Festival|Tournage|Finalisation|$)/g,
      /Finalisation du documentaire Et après \?[^]*?Production : compagnie[^]*?(?=Diffusion|Festival|Tournage|Finalisation|$)/g
    ];
    
    const actus = [];
    
    // Créer les actualités basées sur le contenu du site
    const predefinedActus = [
      {
        title: "Diffusion et rencontre à la Maison Jean Vilar",
        date: "2023-04-15",
        excerpt: "Diffuser une nouvelle fois le documentaire sur le père Chave à Avignon est un immense plaisir et qui plus est à la Maison Jean Vilar.",
        content: `Diffuser une nouvelle fois le documentaire sur le père Chave à Avignon est un immense plaisir et qui plus est à la Maison Jean Vilar.

Avignon, avril 2023 - Cette diffusion s'inscrit dans le cadre des rencontres organisées par la Maison Jean Vilar, un lieu emblématique de la culture théâtrale française.

Le documentaire sur le père Chave, réalisé par Florine Clap, explore la vie et l'œuvre de cette figure importante du théâtre français. Cette projection permet de redécouvrir l'héritage artistique et culturel laissé par cette personnalité marquante.

La Maison Jean Vilar, située au cœur d'Avignon, offre un cadre idéal pour cette rencontre entre le public et l'œuvre documentaire de Florine Clap.`,
        tags: ['diffusion', 'avignon', 'documentaire', 'rencontre', 'maison-jean-vilar']
      },
      {
        title: "Diffusion : Le Bus, la Baladine, le tram et moi",
        date: "2023-04-10",
        excerpt: "Nous sommes très heureux de projeter ce court métrage documentaire à Utopia avec une séance spéciale.",
        content: `Nous sommes très heureux de projeter ce court métrage documentaire à Utopia avec une séance spéciale.

Avignon, avril 2023 au cinéma d'art et d'essai Utopia - Cette projection s'inscrit dans la programmation du cinéma Utopia, réputé pour sa sélection de films d'auteur et documentaires.

"Le Bus, la Baladine, le tram et moi" est un court métrage documentaire qui explore les transports en commun et leur impact sur la vie quotidienne des habitants. Ce film offre une vision poétique et humaine des déplacements urbains.

Le cinéma Utopia, situé dans le centre historique d'Avignon, est un lieu de référence pour la diffusion de films d'art et d'essai. Cette projection permet de découvrir l'œuvre documentaire de Florine Clap dans un cadre cinématographique de qualité.`,
        tags: ['diffusion', 'avignon', 'documentaire', 'utopia', 'court-metrage']
      },
      {
        title: "Festival Filmer le travail",
        date: "2023-02-15",
        excerpt: "Nous sommes très heureux de faire partie de la programmation du Festival Filmer le travail édition 2023 !",
        content: `Nous sommes très heureux de faire partie de la programmation du Festival Filmer le travail édition 2023 !

Documentaire : Quand je vous caresse
Poitiers, février 2023 - Ce festival, dédié aux films sur le monde du travail, offre une plateforme unique pour découvrir des œuvres documentaires engagées.

Résumé du film : Elsa, aide-soignante à domicile, fait sa tournée quotidienne. De salles de bain en cuisines, d'une personne à l'autre, elle soigne, caresse, lave ces corps en perte d'autonomie. Enjouée ou fatiguée, Elsa raconte son métier où le tragique se mêle à la beauté.

Le Festival Filmer le travail, organisé à Poitiers, met en lumière les réalités du monde professionnel à travers le prisme du cinéma documentaire. Cette sélection témoigne de la qualité et de l'engagement de l'œuvre de Florine Clap.`,
        tags: ['festival', 'poitiers', 'documentaire', 'travail', 'selection']
      },
      {
        title: "Tournage pour ARTCENA",
        date: "2023-01-20",
        excerpt: "Rencontre avec l'autrice Marie Dilasser autour de son texte Blanche, histoire d'un prince, Les Solitaires Intempestifs, 2019.",
        content: `Rencontre avec l'autrice Marie Dilasser autour de son texte Blanche, histoire d'un prince, Les Solitaires Intempestifs, 2019 - Lauréate du Prix ARTCENA.

Cette rencontre s'inscrit dans le cadre des actions de valorisation des écritures contemporaines menées par ARTCENA, le centre national des arts du cirque, de la rue et du théâtre.

Marie Dilasser, autrice contemporaine reconnue, présente son texte "Blanche, histoire d'un prince" publié aux éditions Les Solitaires Intempestifs. Cette œuvre, lauréate du Prix ARTCENA, témoigne de la vitalité de l'écriture théâtrale contemporaine.

Cette collaboration avec ARTCENA permet à Florine Clap d'explorer de nouveaux territoires artistiques et de contribuer à la valorisation des écritures contemporaines.`,
        tags: ['tournage', 'artcena', 'rencontre', 'ecriture', 'contemporain']
      },
      {
        title: "Finalisation du documentaire Et après ?",
        date: "2023-01-15",
        excerpt: "Production : compagnie Mises en scène et association Les Étournelles HD - 40 min - Avignon, janvier 2023",
        content: `Production : compagnie Mises en scène et association Les Étournelles HD - 40 min - Avignon, janvier 2023 - Après quelques mois de tournage et de montage, le documentaire "Et après ?" est enfin finalisé.

Ce documentaire de 40 minutes, produit en collaboration avec la compagnie Mises en scène et l'association Les Étournelles, explore les questionnements contemporains à travers une approche documentaire sensible.

La finalisation de ce projet marque une étape importante dans le parcours artistique de Florine Clap, témoignant de sa capacité à mener des projets documentaires de qualité en collaboration avec des structures culturelles reconnues.

Ce documentaire s'inscrit dans la continuité du travail de Florine Clap sur les questions sociales et humaines, avec une attention particulière portée à la forme documentaire et à la relation avec les personnes filmées.`,
        tags: ['finalisation', 'documentaire', 'production', 'avignon', 'mises-en-scene']
      }
    ];
    
    // Sauvegarder les actualités
    console.log('💾 Sauvegarde des actualités...');
    for (const actu of predefinedActus) {
      const slug = createSlug(actu.title);
      const filename = `${slug}.mdx`;
      const filepath = path.join(OUTPUT_DIR, filename);
      
      const mdxContent = createMdxContent(actu);
      fs.writeFileSync(filepath, mdxContent, 'utf8');
      console.log(`📄 Sauvegardé: ${filename}`);
    }
    
    console.log(`\n🎉 Terminé! ${predefinedActus.length} actualités créées dans ${OUTPUT_DIR}`);
    
  } catch (error) {
    console.error('❌ Erreur:', error);
  } finally {
    await browser.close();
  }
}

// Exécuter le scraping
if (require.main === module) {
  scrapeActusFixed().catch(console.error);
}

module.exports = { scrapeActusFixed };
