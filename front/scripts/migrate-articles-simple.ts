/**
 * Script de migration simple - Test avec le premier article de la première page
 * 
 * Usage: npx tsx scripts/migrate-articles-simple.ts
 */

import puppeteer from 'puppeteer'
import { createDirectus, rest, staticToken } from '@directus/sdk'
import type { Schema } from '../lib/directus-types'
import * as fs from 'fs'
import * as path from 'path'
import * as https from 'https'
import * as http from 'http'
import FormData from 'form-data'
import axios from 'axios'
import OpenAI from 'openai'
import * as dotenv from 'dotenv'

// Charger les variables d'environnement
dotenv.config({ path: path.join(process.cwd(), '.env') })

const SOURCE_URL = 'https://www.florineclap.com'
const PAGE_URL = `${SOURCE_URL}/blank/page/1` // Première page d'articles
const DIRECTUS_URL = process.env.DIRECTUS_INTERNAL_URL || process.env.NEXT_PUBLIC_DIRECTUS_URL || 'http://localhost:8055'
const DIRECTUS_STATIC_TOKEN = process.env.DIRECTUS_STATIC_TOKEN || ''
const DIRECTUS_ADMIN_EMAIL = process.env.DIRECTUS_ADMIN_EMAIL || 'admin@example.com'
const DIRECTUS_ADMIN_PASSWORD = process.env.DIRECTUS_ADMIN_PASSWORD || 'admin'
const OPENAI_API_KEY = process.env.OPENAI_API_KEY || ''

// Dossier temporaire pour les images
const TEMP_DIR = path.join(process.cwd(), '.temp-images')
if (!fs.existsSync(TEMP_DIR)) {
  fs.mkdirSync(TEMP_DIR, { recursive: true })
}

/**
 * Télécharge un fichier depuis une URL
 */
async function downloadFile(url: string, filepath: string): Promise<void> {
  return new Promise((resolve, reject) => {
    const protocol = url.startsWith('https') ? https : http
    const file = fs.createWriteStream(filepath)
    
    protocol.get(url, (response) => {
      if (response.statusCode === 301 || response.statusCode === 302) {
        return downloadFile(response.headers.location!, filepath).then(resolve).catch(reject)
      }
      
      if (response.statusCode !== 200) {
        file.close()
        if (fs.existsSync(filepath)) {
          fs.unlinkSync(filepath)
        }
        reject(new Error(`Failed to download: ${response.statusCode}`))
        return
      }
      
      response.pipe(file)
      file.on('finish', () => {
        file.close()
        resolve()
      })
    }).on('error', (err) => {
      file.close()
      if (fs.existsSync(filepath)) {
        fs.unlinkSync(filepath)
      }
      reject(err)
    })
  })
}

/**
 * Upload une image dans Directus
 */
async function uploadImageToDirectus(imagePath: string, filename: string, token: string): Promise<string | null> {
  try {
    const formData = new FormData()
    formData.append('file', fs.createReadStream(imagePath), {
      filename: filename,
      contentType: 'image/jpeg',
    })

    const response = await axios.post(`${DIRECTUS_URL}/files`, formData, {
      headers: {
        ...formData.getHeaders(),
        'Authorization': `Bearer ${token}`,
      },
      maxContentLength: Infinity,
      maxBodyLength: Infinity,
    })

    return response.data.data.id
  } catch (error: any) {
    console.error(`Erreur upload image ${filename}:`, error.response?.data || error.message)
    return null
  }
}

/**
 * Obtient un token admin
 */
async function getAdminToken(): Promise<string> {
  const response = await fetch(`${DIRECTUS_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ 
      email: DIRECTUS_ADMIN_EMAIL, 
      password: DIRECTUS_ADMIN_PASSWORD 
    }),
  })

  if (!response.ok) {
    throw new Error(`Erreur authentification: ${response.status}`)
  }

  const data = await response.json()
  return data.data.access_token
}

/**
 * Supprime tous les articles existants dans Directus
 */
async function deleteAllArticles(token: string): Promise<number> {
  try {
    // Récupérer tous les IDs
    const response = await fetch(`${DIRECTUS_URL}/items/actus?fields=id`, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    })

    if (!response.ok) {
      throw new Error(`Erreur lors de la récupération des articles: ${response.status}`)
    }

    const data = await response.json()
    const articles = data.data || []
    const ids = articles.map((a: any) => a.id)

    if (ids.length === 0) {
      return 0
    }

    // Supprimer tous les articles
    const deleteResponse = await fetch(`${DIRECTUS_URL}/items/actus`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(ids),
    })

    if (!deleteResponse.ok) {
      const errorData = await deleteResponse.text()
      throw new Error(`Erreur lors de la suppression: ${deleteResponse.status} - ${errorData}`)
    }

    return ids.length
  } catch (error: any) {
    console.error('❌ Erreur lors de la suppression des articles:', error.message)
    throw error
  }
}

/**
 * Extrait le contenu avec OpenAI si nécessaire
 */
async function extractContentWithAI(page: any, title: string): Promise<string> {
  if (!OPENAI_API_KEY) {
    return ''
  }

  try {
    console.log('    🤖 Utilisation de l\'IA pour extraire et structurer le contenu...')
    
    const fullHTML = await page.content()
    const visibleText = await page.evaluate(() => {
      const section = document.querySelector('#content-wrapper section')
      if (section) {
        return section.innerText || section.textContent || ''
      }
      return document.body.innerText || document.body.textContent || ''
    })

    const openai = new OpenAI({ apiKey: OPENAI_API_KEY })
    
    const response = await openai.chat.completions.create({
      model: 'gpt-4',
      messages: [
        {
          role: 'system',
          content: 'Tu es un expert en extraction de contenu web. Extrait UNIQUEMENT le contenu principal de l\'article (texte en paragraphes) depuis le HTML fourni. Retourne le contenu en texte brut ou markdown simple, SANS HTML, SANS le titre (qui est déjà extrait séparément). Structure le contenu en paragraphes clairs séparés par des sauts de ligne. Ne garde que le texte principal, pas les menus, footers, etc.'
        },
        {
          role: 'user',
          content: `Titre de l'article: ${title}\n\nExtrait le contenu principal de l'article depuis ce HTML. Cherche dans #content-wrapper section. Retourne uniquement le texte en paragraphes, sans HTML:\n\n${fullHTML.substring(0, 100000)}`
        }
      ],
      max_tokens: 4000
    })

    const extractedContent = response.choices[0]?.message?.content || ''
    if (extractedContent && extractedContent.length > 50) {
      // Nettoyer le contenu extrait
      let cleaned = extractedContent
        .replace(/```markdown\n?/g, '')
        .replace(/```\n?/g, '')
        .replace(/<[^>]+>/g, '') // Enlever tout HTML restant
        .trim()
      
      console.log(`    ✓ Contenu extrait via IA (${cleaned.length} caractères)`)
      return cleaned
    }
  } catch (error: any) {
    console.warn(`    ⚠ Erreur avec OpenAI:`, error.message)
  }

  return ''
}

/**
 * Extrait la date de publication avec OpenAI
 */
async function extractDateWithAI(page: any, title: string, content: string): Promise<string | null> {
  if (!OPENAI_API_KEY) {
    return null
  }

  try {
    console.log('    🤖 Utilisation de l\'IA pour extraire la date de publication...')
    
    const fullHTML = await page.content()
    
    // Chercher d'abord dans les balises time et meta
    const timeElements = await page.$$eval('time[datetime], time', (elements: any[]) => {
      return elements.map(el => el.getAttribute('datetime') || el.textContent?.trim() || '').filter(Boolean)
    }).catch(() => [])
    
    const metaDates = await page.$$eval('meta[property="article:published_time"], meta[name="date"], meta[name="publishdate"]', (elements: any[]) => {
      return elements.map(el => el.getAttribute('content') || '').filter(Boolean)
    }).catch(() => [])

    const openai = new OpenAI({ apiKey: OPENAI_API_KEY })
    
    const response = await openai.chat.completions.create({
      model: 'gpt-4',
      messages: [
        {
          role: 'system',
          content: 'Tu es un expert en extraction de dates depuis des articles web. Extrait la date de publication de l\'article. IMPORTANT: Cherche dans le CONTENU de l\'article (comme "avril 2023", "janvier 2024", etc.) et dans les métadonnées. Retourne UNIQUEMENT la date au format ISO (YYYY-MM-DD), ou null si aucune date n\'est trouvée. Si tu trouves "avril 2023", retourne "2023-04-01". Si tu trouves "janvier 2024", retourne "2024-01-01". Utilise le premier jour du mois si seul le mois et l\'année sont donnés.'
        },
        {
          role: 'user',
          content: `Titre: ${title}\n\nContenu de l'article: ${content.substring(0, 3000)}\n\nBalises time trouvées: ${timeElements.join(', ')}\nMétadonnées trouvées: ${metaDates.join(', ')}\n\nExtrait la date de publication au format YYYY-MM-DD en cherchant dans le CONTENU de l'article (comme "avril 2023", "janvier 2024", etc.). Si aucune date n'est trouvée, retourne "null".`
        }
      ],
      max_tokens: 50
    })

    const extractedDate = response.choices[0]?.message?.content?.trim() || ''
    
    if (extractedDate && extractedDate !== 'null' && extractedDate.match(/^\d{4}-\d{2}-\d{2}$/)) {
      console.log(`    ✓ Date extraite: ${extractedDate}`)
      return extractedDate
    }
  } catch (error: any) {
    console.warn(`    ⚠ Erreur extraction date avec OpenAI:`, error.message)
  }

  return null
}

/**
 * Génère des tags cohérents avec OpenAI
 */
async function generateTagsWithAI(title: string, subtitle: string | undefined, content: string): Promise<string[]> {
  if (!OPENAI_API_KEY) {
    return []
  }

  try {
    console.log('    🤖 Utilisation de l\'IA pour générer des tags...')
    
    const openai = new OpenAI({ apiKey: OPENAI_API_KEY })
    
    const response = await openai.chat.completions.create({
      model: 'gpt-4',
      messages: [
        {
          role: 'system',
          content: 'Tu es un expert en catégorisation de contenu culturel et artistique. Génère 3-5 tags pertinents pour cet article. Les tags doivent être en français, en majuscules, courts (1-3 mots max), et cohérents avec le contenu. Retourne uniquement les tags séparés par des virgules, sans numérotation ni puces.'
        },
        {
          role: 'user',
          content: `Titre: ${title}\n${subtitle ? `Sous-titre: ${subtitle}\n` : ''}Contenu: ${content.substring(0, 3000)}\n\nGénère 3-5 tags pertinents pour cet article. Format: TAG1, TAG2, TAG3`
        }
      ],
      max_tokens: 100
    })

    const tagsText = response.choices[0]?.message?.content?.trim() || ''
    
    if (tagsText) {
      const tags = tagsText
        .split(',')
        .map(tag => tag.trim().toUpperCase())
        .filter(tag => tag.length > 0 && tag.length < 30)
        .slice(0, 5) // Maximum 5 tags
      
      if (tags.length > 0) {
        console.log(`    ✓ Tags générés: ${tags.join(', ')}`)
        return tags
      }
    }
  } catch (error: any) {
    console.warn(`    ⚠ Erreur génération tags avec OpenAI:`, error.message)
  }

  return []
}

/**
 * Fonction principale
 */
async function main() {
  console.log('🚀 Migration du premier article - Test\n')
  
  // 1. Authentification Directus
  console.log('1. Authentification Directus...')
  const token = DIRECTUS_STATIC_TOKEN || await getAdminToken()
  const client = createDirectus<Schema>(DIRECTUS_URL)
    .with(rest())
    .with(staticToken(token))
  console.log('✓ Authentifié\n')
  
  // 1.5. Supprimer les articles existants
  console.log('1.5. Suppression des articles existants...')
  try {
    const deletedCount = await deleteAllArticles(token)
    if (deletedCount > 0) {
      console.log(`✓ ${deletedCount} article(s) supprimé(s)\n`)
    } else {
      console.log('✓ Aucun article existant\n')
    }
  } catch (error: any) {
    console.warn(`⚠ Erreur lors de la suppression: ${error.message}`)
    console.warn('   Continuation malgré l\'erreur...\n')
  }
  
  // 2. Lancer Puppeteer
  console.log('2. Lancement du navigateur...')
  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  })
  console.log('✓ Navigateur lancé\n')
  
  const page = await browser.newPage()
  
  try {
    // 3. Aller sur la page d'articles
    console.log('3. Navigation vers la page d\'articles...')
    console.log(`   URL: ${PAGE_URL}`)
    await page.goto(PAGE_URL, { 
      waitUntil: 'networkidle2',
      timeout: 30000 
    })
    
    // Scroller pour charger tous les articles
    await page.evaluate(() => {
      return new Promise<void>((resolve) => {
        let totalHeight = 0
        const distance = 100
        const timer = setInterval(() => {
          const scrollHeight = document.body.scrollHeight
          window.scrollBy(0, distance)
          totalHeight += distance
          if (totalHeight >= scrollHeight) {
            clearInterval(timer)
            resolve()
          }
        }, 100)
      })
    })
    
    await new Promise(resolve => setTimeout(resolve, 3000))
    console.log('✓ Page chargée\n')
    
    // 4. Trouver le premier article
    console.log('4. Recherche du premier article...')
    const articleContainers = await page.$$('#pro-gallery-margin-container-pro-blog [data-hook="item-link-wrapper"]')
    
    if (articleContainers.length === 0) {
      console.error('❌ Aucun article trouvé!')
      process.exit(1)
    }
    
    console.log(`✓ ${articleContainers.length} article(s) trouvé(s)`)
    console.log('   Traitement du premier article...\n')
    
    // 5. Récupérer l'URL du premier article
    const firstArticleUrl = await articleContainers[0].evaluate((el: any) => {
      const link = el.querySelector('a')
      return link ? link.href : null
    })
    
    if (!firstArticleUrl) {
      console.error('❌ Impossible de trouver l\'URL de l\'article!')
      process.exit(1)
    }
    
    console.log(`5. Navigation vers l'article:`)
    console.log(`   ${firstArticleUrl}\n`)
    
    // 6. Aller sur la page de l'article
    await page.goto(firstArticleUrl, { waitUntil: 'networkidle2', timeout: 30000 })
    await page.waitForSelector('#content-wrapper', { timeout: 15000 })
    await new Promise(resolve => setTimeout(resolve, 3000))
    
    // 7. Extraire les données
    console.log('6. Extraction des données...')
    
    // Attendre que tout soit chargé
    await new Promise(resolve => setTimeout(resolve, 2000))
    
    // Titre - extraire depuis le header
    let title = ''
    try {
      title = await page.$eval('#content-wrapper header', (el: any) => {
        // Chercher le h1 en premier
        const h1 = el.querySelector('h1')
        if (h1) {
          return h1.textContent?.trim() || ''
        }
        // Sinon prendre le premier élément de texte significatif
        const text = el.textContent?.trim() || ''
        // Enlever les espaces multiples
        return text.replace(/\s+/g, ' ')
      })
    } catch (error) {
      // Essayer directement avec h1
      try {
        title = await page.$eval('h1', (el: any) => el.textContent?.trim() || '')
      } catch (e) {
        title = await page.title().catch(() => '')
        title = title.replace(/\s*[-|]\s*.*$/, '').trim()
      }
    }
    
    if (!title || title.length < 3) {
      console.error('❌ Impossible d\'extraire le titre!')
      process.exit(1)
    }
    
    console.log(`   ✓ Titre: ${title}`)
    
    // Sous-titre - extraire depuis le header (h2 ou élément après le titre)
    let subtitle: string | undefined = undefined
    try {
      subtitle = await page.$eval('#content-wrapper header', (el: any) => {
        // Chercher un h2
        const h2 = el.querySelector('h2')
        if (h2) {
          return h2.textContent?.trim() || ''
        }
        // Chercher un élément avec classe subtitle
        const subtitleEl = el.querySelector('.subtitle, [class*="subtitle"]')
        if (subtitleEl) {
          return subtitleEl.textContent?.trim() || ''
        }
        // Chercher le premier paragraphe après le h1
        const h1 = el.querySelector('h1')
        if (h1) {
          const nextSibling = h1.nextElementSibling
          if (nextSibling && (nextSibling.tagName === 'P' || nextSibling.tagName === 'H2')) {
            return nextSibling.textContent?.trim() || ''
          }
        }
        return ''
      })
      
      if (subtitle && subtitle.length > 0 && subtitle.length < 200) {
        console.log(`   ✓ Sous-titre: ${subtitle}`)
      } else {
        subtitle = undefined
      }
    } catch (error) {
      subtitle = undefined
    }
    
    // Contenu - extraire le texte proprement depuis la section
    const fullHTML = await page.content()
    const $ = require('cheerio').load(fullHTML)
    
    // Extraire la section
    const section = $('#content-wrapper section')
    let contentText = ''
    let sectionHTML = '' // Garder le HTML pour extraire les images
    
    if (section.length > 0) {
      // Enlever les scripts, styles, etc.
      section.find('script, style, nav, .menu, .navigation, .sidebar, aside').remove()
      
      // Garder le HTML pour les images
      sectionHTML = section.html() || ''
      
      // Extraire le texte en préservant les paragraphes et en convertissant les strong/b en ##
      const paragraphs: string[] = []
      
      // Traiter les paragraphes un par un
      section.find('p').each((_: any, p: any) => {
        const $p = $(p)
        const $clone = $p.clone()
        
        // Convertir les strong/b en ## avec saut de ligne après
        $clone.find('strong, b').each((_: any, el: any) => {
          const $el = $(el)
          const text = $el.text().trim()
          if (text && text.length > 0 && text.length < 100) {
            // Remplacer le strong/b par un h2 markdown suivi d'un saut de ligne
            $el.replaceWith(`## ${text}\n\n`)
          }
        })
        
        // Nettoyer le HTML restant et extraire le texte
        let text = $clone.html() || ''
        
        // Nettoyer les balises HTML restantes mais garder la structure
        text = text
          .replace(/<br\s*\/?>/gi, '\n')
          .replace(/<\/p>/gi, '\n\n')
          .replace(/<[^>]+>/g, '') // Enlever toutes les balises HTML restantes
          .trim()
        
        if (text && text.length > 10) {
          paragraphs.push(text)
        }
      })
      
      // Si pas de paragraphes, prendre tout le texte
      if (paragraphs.length === 0) {
        contentText = section.text().trim()
        // Diviser en paragraphes approximatifs (par double saut de ligne)
        paragraphs.push(...contentText.split(/\n\s*\n/).filter(p => p.trim().length > 10))
      } else {
        contentText = paragraphs.join('\n\n')
      }
    } else {
      // Si pas de section, prendre le content-wrapper sans le header
      const contentWrapper = $('#content-wrapper')
      if (contentWrapper.length > 0) {
        contentWrapper.find('header, script, style, nav, .menu, .navigation').remove()
        
        // Traiter les paragraphes
        const paragraphs: string[] = []
        contentWrapper.find('p').each((_: any, p: any) => {
          const $p = $(p)
          const $clone = $p.clone()
          
          // Convertir les strong/b en ##
          $clone.find('strong, b').each((_: any, el: any) => {
            const $el = $(el)
            const text = $el.text().trim()
            if (text && text.length > 0 && text.length < 100) {
              $el.replaceWith(`## ${text}\n\n`)
            }
          })
          
          let text = $clone.html() || ''
          text = text
            .replace(/<br\s*\/?>/gi, '\n')
            .replace(/<\/p>/gi, '\n\n')
            .replace(/<[^>]+>/g, '')
            .trim()
          
          if (text && text.length > 10) {
            paragraphs.push(text)
          }
        })
        
        sectionHTML = contentWrapper.html() || ''
        contentText = paragraphs.length > 0 ? paragraphs.join('\n\n') : contentWrapper.text().trim()
      }
    }
    
    // Nettoyer le texte et s'assurer que les ## sont bien formatés
    contentText = contentText
      .replace(/\*\*(.*?)\*\*/g, '## $1\n\n') // Markdown bold vers h2
      .replace(/\*(.*?)\*/g, '$1') // Enlever les italiques simples
      .replace(/\n{3,}/g, '\n\n') // Remplacer les sauts de ligne multiples (mais garder les doubles)
      .replace(/##\s+##/g, '##') // Nettoyer les doubles ##
      .replace(/##\s+([^\n]+)\n\n([^\n#])/g, '## $1\n\n$2') // S'assurer qu'il y a un saut de ligne après ##
      .trim()
    
    // Si le contenu est vide ou trop court, utiliser l'IA
    let markdown = contentText
    if (!markdown || markdown.length < 100) {
      console.log('   ⚠ Contenu trop court, utilisation de l\'IA pour extraire...')
      const aiContent = await extractContentWithAI(page, title)
      if (aiContent && aiContent.length > 50) {
        markdown = aiContent
      }
    }
    
    // Structurer le contenu en paragraphes markdown
    if (markdown && markdown.length > 0) {
      // Diviser en paragraphes si ce n'est pas déjà fait
      const paragraphs = markdown.split(/\n\s*\n/).filter(p => p.trim().length > 0)
      if (paragraphs.length > 1) {
        markdown = paragraphs.map(p => p.trim()).join('\n\n')
      } else {
        // Si un seul bloc, essayer de le diviser intelligemment
        const sentences = markdown.split(/[.!?]\s+/).filter(s => s.trim().length > 20)
        if (sentences.length > 3) {
          // Grouper les phrases en paragraphes de 2-3 phrases
          const grouped: string[] = []
          for (let i = 0; i < sentences.length; i += 2) {
            grouped.push(sentences.slice(i, i + 2).join('. '))
          }
          markdown = grouped.join('\n\n')
        }
      }
      
      // Nettoyer les titres h2 en double
      markdown = markdown.replace(/\n##\s+/g, '\n## ').replace(/##\s+##/g, '##')
    }
    
    if (!markdown || markdown.length < 50) {
      console.error('❌ Impossible d\'extraire le contenu!')
      process.exit(1)
    }
    
    console.log(`   ✓ Contenu: ${markdown.length} caractères (${markdown.split('\n\n').length} paragraphes)`)
    
    // 7. Extraire la date avec l'IA
    console.log('\n7. Extraction de la date de publication...')
    let articleDate = await extractDateWithAI(page, title, markdown)
    
    // Si pas de date trouvée, utiliser la date actuelle
    if (!articleDate) {
      articleDate = new Date().toISOString().split('T')[0]
      console.log(`   ⚠ Date non trouvée, utilisation de la date actuelle: ${articleDate}`)
    }
    
    // Générer le slug pour le nom de fichier
    const slug = title.toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '')
    
    // Images
    const images: string[] = []
    
    // Image principale depuis data-hook="image-viewer-au4eo"
    try {
      // Attendre que l'image soit chargée
      await page.waitForSelector('[data-hook="image-viewer-au4eo"]', { timeout: 5000 }).catch(() => {})
      
      const imageElement = await page.$('[data-hook="image-viewer-au4eo"]')
      if (imageElement) {
        const imageSrc = await imageElement.evaluate((el: any) => {
          // Essayer plusieurs attributs
          return el.src || 
                 el.getAttribute('src') || 
                 el.getAttribute('data-src') || 
                 el.getAttribute('data-lazy-src') ||
                 el.getAttribute('data-original') ||
                 (el.style && el.style.backgroundImage ? el.style.backgroundImage.replace(/url\(['"]?(.*?)['"]?\)/, '$1') : '')
        })
        
        if (imageSrc && imageSrc.trim()) {
          let imageUrl = imageSrc.trim()
          // Nettoyer l'URL si c'est un background-image
          imageUrl = imageUrl.replace(/^url\(['"]?/, '').replace(/['"]?\)$/, '')
          
          if (!imageUrl.startsWith('http')) {
            imageUrl = `${SOURCE_URL}${imageUrl.startsWith('/') ? '' : '/'}${imageUrl}`
          }
          
          if (imageUrl && !imageUrl.includes('data:image')) {
            images.push(imageUrl)
            console.log(`   ✓ Image principale trouvée: ${imageUrl}`)
          }
        }
      }
    } catch (error: any) {
      console.warn(`   ⚠ Erreur recherche image principale:`, error.message)
    }
    
    // Images dans le contenu HTML - utiliser le HTML de la section déjà extrait
    if (sectionHTML) {
      const $content = require('cheerio').load(sectionHTML)
      $content('img').each((_: any, img: any) => {
        const src = $content(img).attr('src') || 
                   $content(img).attr('data-src') || 
                   $content(img).attr('data-lazy-src') ||
                   $content(img).attr('data-original')
        if (src && !src.includes('data:image') && !src.includes('placeholder')) {
          let imageUrl = src
          if (!imageUrl.startsWith('http')) {
            imageUrl = `${SOURCE_URL}${imageUrl.startsWith('/') ? '' : '/'}${imageUrl}`
          }
          if (!images.includes(imageUrl)) {
            images.push(imageUrl)
          }
        }
      })
    }
    
    // Chercher aussi dans tout le body de la page
    try {
      const allImages = await page.$$eval('img[data-hook="image-viewer-au4eo"], [data-hook="image-viewer-au4eo"] img, #content-wrapper img', (imgs: any[]) => {
        return imgs.map((img: any) => {
          return img.src || img.getAttribute('src') || img.getAttribute('data-src') || ''
        }).filter((src: string) => src && !src.includes('data:image'))
      })
      
      allImages.forEach((src: string) => {
        let imageUrl = src
        if (!imageUrl.startsWith('http')) {
          imageUrl = `${SOURCE_URL}${imageUrl.startsWith('/') ? '' : '/'}${imageUrl}`
        }
        if (imageUrl && !images.includes(imageUrl)) {
          images.push(imageUrl)
        }
      })
    } catch (error) {
      // Ignorer les erreurs
    }
    
    console.log(`   ✓ Images: ${images.length} trouvée(s)`)
    
    // 9. Télécharger et uploader les images
    let coverImageId: string | null = null
    
    if (images.length > 0) {
      console.log('\n9. Téléchargement et upload des images...')
      const firstImage = images[0]
      
      // Déterminer l'extension du fichier original
      const urlObj = new URL(firstImage)
      const originalFilename = path.basename(urlObj.pathname)
      const extension = path.extname(originalFilename) || '.jpg'
      
      // Créer un nom de fichier basé sur le slug de l'article
      const imageFilename = `${slug}${extension}`
      const tempImagePath = path.join(TEMP_DIR, imageFilename)
      
      try {
        console.log(`   Téléchargement: ${originalFilename}`)
        console.log(`   Nom du fichier: ${imageFilename}`)
        await downloadFile(firstImage, tempImagePath)
        
        coverImageId = await uploadImageToDirectus(tempImagePath, imageFilename, token)
        
        if (coverImageId) {
          console.log(`   ✓ Image uploadée (ID: ${coverImageId}, nom: ${imageFilename})`)
        }
        
        if (fs.existsSync(tempImagePath)) {
          fs.unlinkSync(tempImagePath)
        }
      } catch (error: any) {
        console.warn(`   ⚠ Erreur image:`, error.message)
      }
    }
    
    // 10. Créer l'article dans Directus
    console.log('\n10. Création de l\'article dans Directus...')
    
    // Ajouter le titre en H1 au début du markdown
    const bodyWithTitle = `# ${title}\n\n${markdown}`
    
    const articleData: any = {
      title: title,
      body: bodyWithTitle,
      date: articleDate, // Date extraite avec l'IA
      slug: slug,
    }
    
    if (subtitle && subtitle.length > 0) {
      articleData.subtitle = subtitle
    }
    
    if (coverImageId) {
      articleData.cover = coverImageId
    }
    
    console.log('   Données à créer:', JSON.stringify(articleData, null, 2))
    
    try {
      // Utiliser l'API REST directement au lieu du SDK pour avoir de meilleurs messages d'erreur
      const response = await fetch(`${DIRECTUS_URL}/items/actus`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(articleData),
      })
      
      if (!response.ok) {
        const errorData = await response.text()
        let errorJson
        try {
          errorJson = JSON.parse(errorData)
        } catch {
          errorJson = errorData
        }
        throw new Error(`Erreur HTTP ${response.status}: ${JSON.stringify(errorJson)}`)
      }
      
      const result = await response.json()
      
      console.log('✓ Article créé dans Directus!')
      console.log(`   ID: ${result.data?.id || 'N/A'}`)
      console.log(`\n✅ Migration réussie!`)
      console.log(`   - Titre: ${title}`)
      console.log(`   - Sous-titre: ${subtitle || '(aucun)'}`)
      console.log(`   - Date: ${articleDate}`)
      console.log(`   - Contenu: ${markdown.length} caractères`)
      console.log(`   - Image: ${coverImageId ? `Oui (ID: ${coverImageId})` : 'Non'}`)
      console.log(`   - Slug: ${slug}`)
    } catch (error: any) {
      console.error('❌ Erreur lors de la création:')
      console.error('   Message:', error.message || String(error))
      console.error('   Stack:', error.stack)
      if (error.response) {
        console.error('   Response:', JSON.stringify(error.response.data, null, 2))
      }
      throw error
    }
    
  } catch (error: any) {
    console.error('❌ Erreur:', error.message)
    console.error(error.stack)
    process.exit(1)
  } finally {
    await page.close()
    await browser.close()
    
    // Nettoyer
    if (fs.existsSync(TEMP_DIR)) {
      fs.rmSync(TEMP_DIR, { recursive: true, force: true })
    }
  }
}

main().catch((error) => {
  console.error('❌ Erreur fatale:', error)
  process.exit(1)
})

