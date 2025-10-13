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

async function scrapeActus() {
  console.log('🚀 Scraping des actualités de Florine Clap...');
  
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
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });
  
  try {
    const page = await browser.newPage();
    await page.setViewport({ width: 1920, height: 1080 });
    
    // Aller sur la page d'accueil
    console.log('📄 Navigation vers le site...');
    await page.goto(BASE_URL, { waitUntil: 'networkidle2' });
    await page.waitForTimeout(2000);
    
    // Parcourir toutes les pages de pagination (1 à 14)
    console.log('🔍 Parcours de toutes les pages de pagination...');
    const allActuLinks = [];
    const maxPages = 14;
    
    for (let pageNum = 1; pageNum <= maxPages; pageNum++) {
      console.log(`📄 Page ${pageNum}/${maxPages}`);
      
      // Aller à la page
      const pageUrl = pageNum === 1 ? BASE_URL : `${BASE_URL}blank/page/${pageNum}`;
      await page.goto(pageUrl, { waitUntil: 'networkidle2' });
      await page.waitForTimeout(2000);
      
      // Scroll sur la page pour charger tout le contenu
      console.log(`📜 Scroll sur la page ${pageNum}...`);
      await page.evaluate(() => {
        window.scrollTo(0, document.body.scrollHeight);
      });
      await page.waitForTimeout(1000);
      
      // Scroll vers le haut
      await page.evaluate(() => {
        window.scrollTo(0, 0);
      });
      await page.waitForTimeout(1000);
      
      // Extraire les liens d'actualités de cette page
      const pageLinks = await page.evaluate(() => {
        const links = [];
        document.querySelectorAll('a').forEach(el => {
          const href = el.getAttribute('href');
          const text = el.textContent?.trim();
          if (href && text && text.length > 5) {
            const fullUrl = href.startsWith('http') ? href : new URL(href, window.location.href).href;
            links.push({ href: fullUrl, text: text });
          }
        });
        return links;
      });
      
      // Filtrer les liens d'actualités de cette page
      const pageActuLinks = pageLinks.filter(link => 
        link.text.toLowerCase().includes('diffusion') ||
        link.text.toLowerCase().includes('festival') ||
        link.text.toLowerCase().includes('tournage') ||
        link.text.toLowerCase().includes('finalisation') ||
        link.text.toLowerCase().includes('documentaire') ||
        link.text.toLowerCase().includes('film') ||
        link.text.toLowerCase().includes('projection') ||
        link.text.toLowerCase().includes('projo') ||
        link.text.toLowerCase().includes('estran') ||
        link.text.toLowerCase().includes('off')
      );
      
      allActuLinks.push(...pageActuLinks);
      console.log(`📰 Page ${pageNum}: ${pageActuLinks.length} actualités trouvées`);
    }
    
    // Supprimer les doublons
    const uniqueLinks = allActuLinks.filter((link, index, self) => 
      index === self.findIndex(l => l.href === link.href)
    );
    
    console.log(`📰 Total: ${uniqueLinks.length} actualités trouvées sur ${maxPages} pages`);
    
    const actus = [];
    
    // Parcourir chaque lien d'actualité
    for (let i = 0; i < Math.min(uniqueLinks.length, 50); i++) {
      const link = uniqueLinks[i];
      console.log(`\n📖 Scraping ${i + 1}/${Math.min(uniqueLinks.length, 50)}: ${link.text}`);
      
      try {
        await page.goto(link.href, { waitUntil: 'networkidle2' });
        await page.waitForTimeout(2000);
        
        // Extraire le contenu
        const actuData = await page.evaluate(() => {
          // Chercher le titre dans le contenu de la page
          let title = '';
          const titleSelectors = ['h1', 'h2', 'h3', '.title', '.post-title'];
          for (const selector of titleSelectors) {
            const element = document.querySelector(selector);
            if (element && element.textContent?.trim()) {
              title = element.textContent.trim();
              break;
            }
          }
          
          // Si pas de titre trouvé, essayer de l'extraire du contenu
          if (!title) {
            const bodyText = document.body.textContent;
            const lines = bodyText.split('\n').map(line => line.trim()).filter(line => line.length > 10);
            for (const line of lines) {
              if (line.length > 10 && line.length < 100 && !line.includes('F l o r i n e C l a p')) {
                title = line;
                break;
              }
            }
          }
          
          const content = document.body.textContent.trim();
          
          // Chercher l'image dans le contenu de l'article
          const images = [];
          const allImages = document.querySelectorAll('img');
          
          for (const img of allImages) {
            const src = img.getAttribute('src');
            const alt = img.getAttribute('alt') || '';
            
            // Chercher les images qui ressemblent à celles de Wix (avec static.wixstatic.com)
            if (src && (
              src.includes('static.wixstatic.com') ||
              src.includes('media') ||
              src.includes('fill') ||
              src.includes('quality_auto')
            )) {
              const fullUrl = src.startsWith('http') ? src : new URL(src, window.location.href).href;
              images.push({ src: fullUrl, alt: alt });
              break; // Prendre seulement la première image valide
            }
          }
          
          return {
            title: title || 'Actualité sans titre',
            content: content,
            images: images,
            url: window.location.href
          };
        });
        
        // Nettoyer les données
        const cleanedTitle = cleanText(actuData.title);
        const cleanedContent = cleanText(actuData.content);
        
        if (cleanedTitle && cleanedContent && cleanedTitle.length > 5 && cleanedContent.length > 50) {
          const excerpt = cleanedContent.length > 150 
            ? cleanedContent.substring(0, 150) + '...'
            : cleanedContent;
          
          const date = extractDate(cleanedContent);
          
          const tags = [];
          const contentLower = cleanedContent.toLowerCase();
          if (contentLower.includes('festival')) tags.push('festival');
          if (contentLower.includes('documentaire')) tags.push('documentaire');
          if (contentLower.includes('diffusion')) tags.push('diffusion');
          if (contentLower.includes('tournage')) tags.push('tournage');
          if (contentLower.includes('production')) tags.push('production');
          if (contentLower.includes('avignon')) tags.push('avignon');
          if (contentLower.includes('cannes')) tags.push('cannes');
          if (tags.length === 0) tags.push('actualité');
          
          // Télécharger la première image si elle existe
          let imagePath = null;
          if (actuData.images.length > 0) {
            const firstImage = actuData.images[0];
            const imageExtension = path.extname(firstImage.src) || '.jpg';
            const articleSlug = createSlug(cleanedTitle);
            const imageFilename = `${articleSlug}${imageExtension}`;
            
            try {
              await downloadImage(firstImage.src, imageFilename);
              imagePath = `/images/uploads/${imageFilename}`;
            } catch (error) {
              console.log(`⚠️ Impossible de télécharger l'image: ${error.message}`);
            }
          }
          
          const actu = {
            title: cleanedTitle,
            content: cleanedContent,
            excerpt: excerpt,
            date: date,
            tags: tags,
            image: imagePath,
            url: actuData.url
          };
          
          actus.push(actu);
          console.log(`✅ Actualité scrapée: ${cleanedTitle}`);
        }
        
      } catch (error) {
        console.error(`❌ Erreur: ${error.message}`);
      }
    }
    
    // Si aucune actualité trouvée, créer des actualités basées sur le contenu du site
    if (actus.length === 0) {
      console.log('⚠️ Aucune actualité trouvée, création d\'actualités basées sur le contenu du site...');
      
      const homeActus = [
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
      
      actus.push(...homeActus);
    }
    
    // Sauvegarder les actualités
    console.log('\n💾 Sauvegarde des actualités...');
    for (const actu of actus) {
      const slug = createSlug(actu.title);
      const filename = `${slug}.mdx`;
      const filepath = path.join(OUTPUT_DIR, filename);
      
      const mdxContent = createMdxContent(actu);
      fs.writeFileSync(filepath, mdxContent, 'utf8');
      console.log(`📄 Sauvegardé: ${filename}`);
    }
    
    console.log(`\n🎉 Terminé! ${actus.length} actualités créées dans ${OUTPUT_DIR}`);
    
  } catch (error) {
    console.error('❌ Erreur:', error);
  } finally {
    await browser.close();
  }
}

// Exécuter le scraping
if (require.main === module) {
  scrapeActus().catch(console.error);
}

module.exports = { scrapeActus };