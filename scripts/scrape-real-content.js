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
${actu.subtitle ? `subtitle: "${actu.subtitle.replace(/"/g, '\\"')}"` : ''}
date: "${actu.date}"
excerpt: "${actu.excerpt.replace(/"/g, '\\"')}"
${actu.image ? `cover: "${actu.image}"` : ''}
${actu.location ? `location: "${actu.location.replace(/"/g, '\\"')}"` : ''}
tags:
${actu.tags.map(tag => `  - ${tag}`).join('\n')}
---

# ${actu.title}
${actu.subtitle ? `\n## ${actu.subtitle}\n` : ''}
${actu.location ? `\n**${actu.location}**\n` : ''}
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

async function scrapeRealContent() {
  console.log('🚀 Scraping du VRAI contenu du site de Florine Clap...');
  
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
    
    // Parcourir toutes les pages de pagination (1 à 14)
    console.log('🔍 Parcours de toutes les pages de pagination...');
    const allActus = [];
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
      
      // Extraire le contenu réel de cette page
      console.log(`🔍 Extraction du contenu de la page ${pageNum}...`);
      const pageContent = await page.evaluate(() => {
      // Chercher tous les éléments qui pourraient contenir des actualités
      const articles = [];
      
      // Chercher dans le contenu de la page
      const bodyText = document.body.textContent;
      const lines = bodyText.split('\n').map(line => line.trim()).filter(line => line.length > 10);
      
      // Chercher TOUS les articles sur la page en analysant la structure
      const allLinks = document.querySelectorAll('a');
      const foundArticles = new Set(); // Pour éviter les doublons
      
      allLinks.forEach(link => {
        const text = link.textContent?.trim();
        const href = link.getAttribute('href');
        
        // Chercher des liens qui ressemblent à des actualités (pas les pages de pagination)
        if (text && text.length > 10 && text.length < 100 && 
            href && href.includes('florineclap.com') && !href.includes('/blank') &&
            !text.includes('F l o r i n e C l a p') &&
            !text.includes('F l o r i n e   C l a p') &&
            !text.includes('Autrice et réalisatrice') &&
            !text.includes('Direction d\'ateliers') &&
            !text.includes('ACTU') &&
            !text.includes('FILMS') &&
            !text.includes('BIO') &&
            !text.includes('More') &&
            !text.includes('Contact') &&
            !text.includes('Grey Vimeo') &&
            !text.includes('Grey Facebook') &&
            !text.includes('Use tab to navigate') &&
            !text.includes('top of page') &&
            !text.includes('bottom of page') &&
            !text.includes('12345') &&
            !text.match(/^F\s+l\s+o\s+r\s+i\s+n\s+e\s+C\s+l\s+a\s+p\s*$/i) &&
            !foundArticles.has(text)) {
          
          foundArticles.add(text);
          
          // Extraire le contenu complet autour de ce lien
          const parent = link.closest('div, article, section');
          let content = '';
          let location = '';
          let date = '';
          
          if (parent) {
            content = parent.textContent?.trim() || '';
            
            // Extraire le lieu et la date du contenu
            const locationMatch = content.match(/([A-Z][a-z]+(?:-[A-Z][a-z]+)*,?\s*(?:du|le|en)\s*\d{1,2}\s*(?:janvier|février|mars|avril|mai|juin|juillet|août|septembre|octobre|novembre|décembre)\s*\d{4})/i);
            if (locationMatch) {
              location = locationMatch[1];
            }
            
            const dateMatch = content.match(/(\d{1,2}\s*(?:janvier|février|mars|avril|mai|juin|juillet|août|septembre|octobre|novembre|décembre)\s*\d{4})/i);
            if (dateMatch) {
              date = dateMatch[1];
            }
          } else {
            // Si pas de parent, chercher dans le contenu de la page
            const index = bodyText.indexOf(text);
            if (index !== -1) {
              const start = Math.max(0, index - 100);
              const end = Math.min(bodyText.length, index + 500);
              content = bodyText.substring(start, end);
            }
          }
          
          articles.push({
            title: text,
            content: content,
            location: location,
            date: date,
            href: href,
            found: true
          });
        }
      });
      
      console.log(`🔍 Articles uniques trouvés: ${foundArticles.size}`);
      
      // Chercher les vraies images des articles (pas les icônes)
      const images = [];
      document.querySelectorAll('img').forEach(img => {
        const src = img.getAttribute('src');
        const alt = img.getAttribute('alt') || '';
        
        // Filtrer pour prendre seulement les vraies images d'articles
        if (src && 
            !src.includes('logo') && 
            !src.includes('icon') && 
            !src.includes('avatar') &&
            !src.includes('grey') &&
            !src.includes('vimeo') &&
            !src.includes('facebook') &&
            !src.includes('email') &&
            !src.includes('contact') &&
            !alt.includes('icon') &&
            !alt.includes('logo') &&
            !alt.includes('grey') &&
            (src.includes('static.wixstatic.com') || 
             src.includes('media') || 
             src.includes('fill') || 
             src.includes('quality_auto') ||
             src.includes('.jpg') ||
             src.includes('.jpeg') ||
             src.includes('.png') ||
             src.includes('.webp'))) {
          
          const fullUrl = src.startsWith('http') ? src : new URL(src, window.location.href).href;
          images.push({ src: fullUrl, alt: alt });
        }
      });
      
        return {
          articles: articles,
          images: images,
          bodyText: bodyText
        };
      });
      
      console.log(`📰 Page ${pageNum}: ${pageContent.articles.length} articles trouvés`);
      console.log(`📸 Page ${pageNum}: ${pageContent.images.length} images trouvées`);
      
      // Ajouter les articles de cette page à la liste globale
      if (pageContent.articles.length > 0) {
        for (let i = 0; i < pageContent.articles.length; i++) {
          const article = pageContent.articles[i];
          const title = article.title;
          const href = article.href;
          
          console.log(`🔍 Scraping article complet: ${title}`);
          
          // Aller sur la page de l'article pour récupérer le contenu complet
          let fullContent = '';
          let fullImages = [];
          let subtitle = '';
          let location = '';
          let date = '';
          
          if (href && href.includes('florineclap.com') && !href.includes('/blank')) {
            try {
              await page.goto(href, { waitUntil: 'networkidle2' });
              await page.waitForTimeout(2000);
              
              // Extraire le contenu complet de la page de l'article
              const articleData = await page.evaluate(() => {
                // 1. Récupérer le titre principal (deuxième h1)
                const h1Elements = document.querySelectorAll('h1');
                const mainTitle = h1Elements.length > 1 ? h1Elements[1].textContent?.trim() : (h1Elements[0]?.textContent?.trim() || '');
                
                // 2. Récupérer TOUS les strong après le deuxième h1 et les concaténer pour le sous-titre
                const allStrongElements = document.querySelectorAll('strong');
                const allStrongTexts = Array.from(allStrongElements).map(strong => strong.textContent?.trim()).filter(text => text);
                const subtitle = allStrongTexts.join(' - ');
                
                // 3. Récupérer tout le texte jusqu'à l'image (peu importe le formatage)
                let content = '';
                let contentElements = [];
                
                // Trouver le deuxième h1
                const secondH1 = h1Elements.length > 1 ? h1Elements[1] : h1Elements[0];
                if (secondH1) {
                  let currentElement = secondH1.nextElementSibling;
                  
                  // Collecter tout le texte jusqu'à la première image
                  while (currentElement) {
                    // Si on trouve une image, on s'arrête
                    if (currentElement.tagName === 'IMG' || currentElement.querySelector('img')) {
                      break;
                    }
                    
                    // Ajouter le texte de l'élément
                    if (currentElement.textContent?.trim()) {
                      contentElements.push(currentElement.textContent.trim());
                    }
                    
                    currentElement = currentElement.nextElementSibling;
                  }
                  
                  content = contentElements.join(' ').trim();
                }
                
                // 4. Récupérer la première image valide de la page
                let firstImage = null;
                const allImages = document.querySelectorAll('img');
                for (const img of allImages) {
                  const src = img.getAttribute('src');
                  const alt = img.getAttribute('alt') || '';
                  
                  if (src && 
                      !src.includes('logo') && 
                      !src.includes('icon') && 
                      !src.includes('avatar') &&
                      !src.includes('grey') &&
                      !src.includes('vimeo') &&
                      !src.includes('facebook') &&
                      !src.includes('email') &&
                      !src.includes('contact') &&
                      !alt.includes('icon') &&
                      !alt.includes('logo') &&
                      !alt.includes('grey') &&
                      (src.includes('static.wixstatic.com') || 
                       src.includes('media') || 
                       src.includes('fill') || 
                       src.includes('quality_auto') ||
                       src.includes('.jpg') ||
                       src.includes('.jpeg') ||
                       src.includes('.png') ||
                       src.includes('.webp'))) {
                    
                    const fullUrl = src.startsWith('http') ? src : new URL(src, window.location.href).href;
                    firstImage = { src: fullUrl, alt: alt };
                    break; // Prendre seulement la première image valide
                  }
                }
                
                return {
                  title: mainTitle,
                  subtitle: subtitle,
                  allStrongTexts: allStrongTexts,
                  content: content,
                  image: firstImage
                };
              });
              
              fullContent = cleanText(articleData.content);
              subtitle = articleData.subtitle;
              
              // Fouiller dans tous les strong pour extraire date et lieu
              const allStrongText = articleData.allStrongTexts.join(' ');
              
              // Extraire le lieu (ville, région, etc.)
              const locationMatch = allStrongText.match(/([A-Z][a-z]+(?:-[A-Z][a-z]+)*,?\s*(?:du|le|en|à|sur)\s*\d{1,2}\s*(?:janvier|février|mars|avril|mai|juin|juillet|août|septembre|octobre|novembre|décembre)\s*\d{4})/i);
              if (locationMatch) {
                location = locationMatch[1];
              }
              
              // Extraire la date
              const dateMatch = allStrongText.match(/(\d{1,2}\s*(?:janvier|février|mars|avril|mai|juin|juillet|août|septembre|octobre|novembre|décembre)\s*\d{4})/i);
              if (dateMatch) {
                date = dateMatch[1];
              }
              
              // Utiliser l'image unique trouvée
              if (articleData.image) {
                fullImages = [articleData.image];
              } else {
                fullImages = [];
              }
              
            } catch (error) {
              console.log(`⚠️ Erreur lors du scraping de ${title}: ${error.message}`);
              fullContent = cleanText(article.content);
            }
          } else {
            fullContent = cleanText(article.content);
            fullImages = pageContent.images;
          }
          
          const excerpt = fullContent.length > 150 
            ? fullContent.substring(0, 150) + '...'
            : fullContent;
          
          // Utiliser la date extraite ou extraire depuis le contenu
          const finalDate = date || extractDate(fullContent);
          
          const tags = [];
          const contentLower = fullContent.toLowerCase();
          if (contentLower.includes('festival')) tags.push('festival');
          if (contentLower.includes('documentaire')) tags.push('documentaire');
          if (contentLower.includes('diffusion')) tags.push('diffusion');
          if (contentLower.includes('tournage')) tags.push('tournage');
          if (contentLower.includes('production')) tags.push('production');
          if (contentLower.includes('avignon')) tags.push('avignon');
          if (contentLower.includes('cannes')) tags.push('cannes');
          if (contentLower.includes('poitiers')) tags.push('poitiers');
          if (contentLower.includes('chalon')) tags.push('chalon');
          if (contentLower.includes('paris')) tags.push('paris');
          if (contentLower.includes('fémis')) tags.push('fémis');
          if (tags.length === 0) tags.push('actualité');
          
          // Télécharger UNIQUEMENT la première image de l'article
          const imagePaths = [];
          if (fullImages.length > 0) {
            const imageData = fullImages[0];
            const imageUrl = typeof imageData === 'string' ? imageData : imageData.src;
            const imageExtension = path.extname(imageUrl) || '.jpg';
            const imageFilename = `${createSlug(title)}-1${imageExtension}`;
            
            try {
              await downloadImage(imageUrl, imageFilename);
              imagePaths.push(`/images/uploads/${imageFilename}`);
            } catch (error) {
              console.log(`⚠️ Impossible de télécharger l'image: ${error.message}`);
            }
          }
          
          const actu = {
            title: title,
            subtitle: subtitle,
            content: fullContent,
            excerpt: excerpt,
            date: finalDate,
            location: location,
            tags: tags,
            image: imagePaths[0] || null, // Première image comme cover
            images: imagePaths // Toutes les images
          };
          
          allActus.push(actu);
          console.log(`✅ Actualité complète: ${title} (${imagePaths.length} images)`);
        }
      } else {
        console.log(`⚠️ Page ${pageNum}: Aucun article trouvé`);
      }
    }
    
    console.log(`\n📊 Total: ${allActus.length} actualités trouvées sur ${maxPages} pages`);
    
    // Trier les actualités par date (plus récent au plus ancien)
    allActus.sort((a, b) => {
      const dateA = new Date(a.date);
      const dateB = new Date(b.date);
      return dateB - dateA; // Plus récent en premier
    });
    
    console.log('📅 Actualités triées par date (plus récent au plus ancien)');
    
    // Sauvegarder toutes les actualités
    console.log('\n💾 Sauvegarde de toutes les actualités...');
    for (const actu of allActus) {
      const slug = createSlug(actu.title);
      const filename = `${slug}.mdx`;
      const filepath = path.join(OUTPUT_DIR, filename);
      
      const mdxContent = createMdxContent(actu);
      fs.writeFileSync(filepath, mdxContent, 'utf8');
      console.log(`📄 Sauvegardé: ${filename}`);
    }
    
    console.log(`\n🎉 Terminé! ${allActus.length} actualités créées dans ${OUTPUT_DIR}`);
    
  } catch (error) {
    console.error('❌ Erreur:', error);
  } finally {
    await browser.close();
  }
}

// Exécuter le scraping
if (require.main === module) {
  scrapeRealContent().catch(console.error);
}

module.exports = { scrapeRealContent };
