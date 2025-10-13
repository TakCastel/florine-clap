const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');

const BASE_URL = 'https://www.florineclap.com/blank';
const OUTPUT_DIR = path.join(__dirname, '..', 'content', 'actus');
const IMAGES_DIR = path.join(__dirname, '..', 'public', 'images', 'uploads');

// Créer les dossiers s'ils n'existent pas
if (!fs.existsSync(OUTPUT_DIR)) {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
}
if (!fs.existsSync(IMAGES_DIR)) {
  fs.mkdirSync(IMAGES_DIR, { recursive: true });
}

// Fonction pour créer un slug
function createSlug(title) {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim('-');
}

// Fonction pour nettoyer le texte
function cleanText(text) {
  return text
    .replace(/\s+/g, ' ')
    .replace(/\n+/g, '\n')
    .trim();
}

// Fonction pour extraire la date
function extractDate(content) {
  const dateMatch = content.match(/(\d{1,2}\s*(?:janvier|février|mars|avril|mai|juin|juillet|août|septembre|octobre|novembre|décembre)\s*\d{4})/i);
  if (dateMatch) {
    return dateMatch[1];
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

// Fonction pour supprimer les anciens articles et images
function cleanupOldArticles() {
  console.log('🧹 Suppression des anciens articles...');
  
  if (fs.existsSync(OUTPUT_DIR)) {
    const files = fs.readdirSync(OUTPUT_DIR);
    files.forEach(file => {
      if (file.endsWith('.mdx')) {
        fs.unlinkSync(path.join(OUTPUT_DIR, file));
        console.log(`🗑️ Supprimé: ${file}`);
      }
    });
  }
  
  console.log('🧹 Suppression des anciennes images...');
  
  if (fs.existsSync(IMAGES_DIR)) {
    const files = fs.readdirSync(IMAGES_DIR);
    files.forEach(file => {
      if (file.endsWith('.jpg') || file.endsWith('.jpeg') || file.endsWith('.png') || file.endsWith('.webp')) {
        fs.unlinkSync(path.join(IMAGES_DIR, file));
        console.log(`🗑️ Supprimé: ${file}`);
      }
    });
  }
  
  console.log('✅ Anciens articles et images supprimés');
}

// Fonction pour télécharger une image
async function downloadImage(url, filename) {
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Erreur HTTP: ${response.status}`);
    }
    
    const buffer = await response.arrayBuffer();
    const filepath = path.join(IMAGES_DIR, filename);
    fs.writeFileSync(filepath, Buffer.from(buffer));
    console.log(`📸 Image téléchargée: ${filename}`);
  } catch (error) {
    throw new Error(`Impossible de télécharger l'image: ${error.message}`);
  }
}

async function scrapeArticles() {
  console.log('🚀 Scraping des articles de Florine Clap...');
  
  // Nettoyer les anciens articles
  cleanupOldArticles();
  
  const browser = await puppeteer.launch({ 
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });
  
  try {
    const page = await browser.newPage();
    await page.setViewport({ width: 1920, height: 1080 });
    
    const allActus = [];
    const maxPages = 14;
    
    // Parcourir toutes les pages de pagination
    for (let pageNum = 1; pageNum <= maxPages; pageNum++) {
      console.log(`📄 Page ${pageNum}/${maxPages}`);
      
      // Aller à la page de pagination
      const pageUrl = pageNum === 1 ? BASE_URL : `${BASE_URL}/page/${pageNum}`;
      await page.goto(pageUrl, { waitUntil: 'networkidle2' });
      await page.waitForTimeout(2000);
      
      // Scroll pour charger tout le contenu
      await page.evaluate(() => {
        window.scrollTo(0, document.body.scrollHeight);
      });
      await page.waitForTimeout(1000);
      
      // Extraire les liens vers les articles de cette page
      console.log(`🔍 Extraction des liens d'articles de la page ${pageNum}...`);
      const articleLinks = await page.evaluate(() => {
        const links = [];
        const foundLinks = new Set();
        
        document.querySelectorAll('a').forEach(link => {
          const text = link.textContent?.trim();
          const href = link.getAttribute('href');
          
          // Filtrer les liens vers des articles individuels
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
              !foundLinks.has(href)) {
            
            foundLinks.add(href);
            links.push({ title: text, href: href });
          }
        });
        
        return links;
      });
      
      console.log(`📰 Page ${pageNum}: ${articleLinks.length} liens d'articles trouvés`);
      
      // Aller dans chaque article de cette page
      for (const articleLink of articleLinks) {
        console.log(`🔍 Scraping article: ${articleLink.title}`);
        
        try {
          // Aller dans l'article
          await page.goto(articleLink.href, { waitUntil: 'networkidle2' });
          await page.waitForTimeout(2000);
          
          // Extraire le contenu de l'article
          const articleData = await page.evaluate(() => {
            // 1. Récupérer le titre (deuxième h1 ou premier si un seul)
            const h1Elements = document.querySelectorAll('h1');
            let title = '';
            if (h1Elements.length > 1) {
              title = h1Elements[1].textContent?.trim() || '';
            } else if (h1Elements.length === 1) {
              title = h1Elements[0].textContent?.trim() || '';
            }
            
            // Si pas de h1, essayer avec h2
            if (!title) {
              const h2Elements = document.querySelectorAll('h2');
              if (h2Elements.length > 0) {
                title = h2Elements[0].textContent?.trim() || '';
              }
            }
            
            // Si toujours pas de titre, utiliser le titre de la page
            if (!title) {
              title = document.title || 'Article sans titre';
            }
            
            // 2. Récupérer tous les strong et les concaténer pour le sous-titre
            const strongElements = document.querySelectorAll('strong');
            const allStrongTexts = Array.from(strongElements).map(strong => strong.textContent?.trim()).filter(text => text);
            const subtitle = allStrongTexts.join(' - ');
            
            // 3. Récupérer tout le texte entre les strong et l'image
            let content = '';
            
            // Trouver le dernier strong
            const lastStrong = strongElements[strongElements.length - 1];
            if (lastStrong) {
              let currentElement = lastStrong.nextElementSibling;
              let contentElements = [];
              
              while (currentElement) {
                // Si on trouve une image, on s'arrête
                if (currentElement.tagName === 'IMG' || currentElement.querySelector('img')) {
                  break;
                }
                
                // Récupérer TOUT le texte de l'élément
                const elementText = currentElement.textContent?.trim();
                if (elementText && elementText.length > 0) {
                  contentElements.push(elementText);
                }
                
                currentElement = currentElement.nextElementSibling;
              }
              
              content = contentElements.join(' ').trim();
            }
            
            // Si pas de contenu trouvé, essayer une approche différente
            if (!content || content.length < 20) {
              // Chercher dans les paragraphes après le titre, mais filtrer le JSON
              const paragraphs = document.querySelectorAll('p');
              let contentParts = [];
              
              for (const p of paragraphs) {
                const text = p.textContent?.trim();
                if (text && 
                    text.length > 20 && 
                    !text.includes('Autrice et réalisatrice') &&
                    !text.includes('Direction d\'ateliers') &&
                    !text.includes('F l o r i n e C l a p') &&
                    !text.includes('ACTU') &&
                    !text.includes('FILMS') &&
                    !text.includes('BIO') &&
                    !text.includes('{"data"') &&
                    !text.includes('metaSiteId') &&
                    !text.includes('florine.clap@gmail.com') &&
                    !text.includes('bottom of page')) {
                  contentParts.push(text);
                }
              }
              
              content = contentParts.join(' ').trim();
            }
            
            // 4. Récupérer la première image valide
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
                break;
              }
            }
            
            return {
              title: title,
              subtitle: subtitle,
              allStrongTexts: allStrongTexts,
              content: content,
              image: firstImage
            };
          });
          
          // Traiter les données de l'article
          const fullContent = cleanText(articleData.content);
          const subtitle = articleData.subtitle;
          
          // Extraire date et lieu des strong
          const allStrongText = articleData.allStrongTexts.join(' ');
          const locationMatch = allStrongText.match(/([A-Z][a-z]+(?:-[A-Z][a-z]+)*,?\s*(?:du|le|en|à|sur)\s*\d{1,2}\s*(?:janvier|février|mars|avril|mai|juin|juillet|août|septembre|octobre|novembre|décembre)\s*\d{4})/i);
          const location = locationMatch ? locationMatch[1] : '';
          
          const dateMatch = allStrongText.match(/(\d{1,2}\s*(?:janvier|février|mars|avril|mai|juin|juillet|août|septembre|octobre|novembre|décembre)\s*\d{4})/i);
          const date = dateMatch ? dateMatch[1] : extractDate(fullContent);
          
          const excerpt = fullContent.length > 150 ? fullContent.substring(0, 150) + '...' : fullContent;
          
          // Générer les tags
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
          
          // Télécharger l'image si elle existe
          let imagePath = null;
          if (articleData.image) {
            const imageUrl = articleData.image.src;
            const imageExtension = path.extname(imageUrl) || '.jpg';
            // Utiliser TOUJOURS le titre du lien d'article pour le slug (qui fonctionne)
            const articleTitle = articleLink.title; // Utiliser directement le titre du lien
            const imageFilename = `${createSlug(articleTitle)}-1${imageExtension}`;
            
            try {
              await downloadImage(imageUrl, imageFilename);
              imagePath = `/images/uploads/${imageFilename}`;
            } catch (error) {
              console.log(`⚠️ Impossible de télécharger l'image: ${error.message}`);
            }
          }
          
          const actu = {
            title: articleLink.title, // Utiliser TOUJOURS le titre du lien d'article
            subtitle: subtitle,
            content: fullContent,
            excerpt: excerpt,
            date: date,
            location: location,
            tags: tags,
            image: imagePath
          };
          
          allActus.push(actu);
          console.log(`✅ Article extrait: ${articleData.title} (${imagePath ? '1 image' : '0 image'})`);
          
        } catch (error) {
          console.log(`⚠️ Erreur lors du scraping de ${articleLink.title}: ${error.message}`);
        }
      }
    }
    
    // Trier les actualités par date (plus récent au plus ancien)
    allActus.sort((a, b) => {
      const dateA = new Date(a.date);
      const dateB = new Date(b.date);
      return dateB - dateA;
    });
    
    console.log(`\n📊 Total: ${allActus.length} articles trouvés sur ${maxPages} pages`);
    
    // Sauvegarder tous les articles
    console.log('\n💾 Sauvegarde de tous les articles...');
    for (const actu of allActus) {
      const slug = createSlug(actu.title);
      const filename = `${slug}.mdx`;
      const filepath = path.join(OUTPUT_DIR, filename);
      
      const mdxContent = createMdxContent(actu);
      fs.writeFileSync(filepath, mdxContent, 'utf8');
      console.log(`📄 Sauvegardé: ${filename}`);
    }
    
    console.log(`\n🎉 Terminé! ${allActus.length} articles créés dans ${OUTPUT_DIR}`);
    
  } catch (error) {
    console.error('❌ Erreur:', error);
  } finally {
    await browser.close();
  }
}

scrapeArticles();
