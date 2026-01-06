/**
 * Script de migration des articles depuis florineclap.com vers Directus
 * 
 * Ce script :
 * 1. Scrape le site florineclap.com pour récupérer tous les articles
 * 2. Extrait titre, sous-titre, contenu markdown, images
 * 3. Télécharge les images et les upload dans Directus
 * 4. Crée les articles dans Directus avec l'ordre exact
 * 
 * Usage: npx tsx scripts/migrate-articles.ts
 */

import axios from 'axios'
import * as cheerio from 'cheerio'
import TurndownService from 'turndown'
import { createDirectus, rest, staticToken, readItems, createItem, updateItem, deleteItems } from '@directus/sdk'
import type { Schema } from '../lib/directus-types'
import * as fs from 'fs'
import * as path from 'path'
import * as https from 'https'
import * as http from 'http'
import FormData from 'form-data'
import puppeteer from 'puppeteer'
import OpenAI from 'openai'
import * as dotenv from 'dotenv'

// Charger les variables d'environnement
dotenv.config({ path: path.join(process.cwd(), '.env') })

// Configuration
const SOURCE_URL = 'https://www.florineclap.com'
const BASE_PAGE_URL = `${SOURCE_URL}/blank/page`
const FIRST_PAGE = 1 // Commencer à la page 1
const LAST_PAGE = 14
const ARTICLES_PER_PAGE = 5
const OPENAI_API_KEY = process.env.OPENAI_API_KEY || ''

const DIRECTUS_URL = process.env.DIRECTUS_INTERNAL_URL || process.env.NEXT_PUBLIC_DIRECTUS_URL || 'http://localhost:8055'
const DIRECTUS_STATIC_TOKEN = process.env.DIRECTUS_STATIC_TOKEN || ''
const DIRECTUS_ADMIN_EMAIL = process.env.DIRECTUS_ADMIN_EMAIL || 'admin@example.com'
const DIRECTUS_ADMIN_PASSWORD = process.env.DIRECTUS_ADMIN_PASSWORD || 'admin'

// Mode dry-run : ne crée pas les articles, juste affiche ce qui serait fait
const DRY_RUN = process.env.DRY_RUN === 'true' || process.argv.includes('--dry-run')

// Mode force : supprime tous les articles existants avant de migrer
const FORCE = process.env.FORCE === 'true' || process.argv.includes('--force')

// Mode update : met à jour les articles existants au lieu de créer des doublons
const UPDATE_EXISTING = process.env.UPDATE_EXISTING === 'true' || process.argv.includes('--update')

// Dossier temporaire pour les images
const TEMP_DIR = path.join(process.cwd(), '.temp-images')
if (!fs.existsSync(TEMP_DIR)) {
  fs.mkdirSync(TEMP_DIR, { recursive: true })
}

interface ScrapedArticle {
  title: string
  subtitle?: string
  content: string // Markdown
  images: string[] // URLs des images
  date?: string
  slug?: string
  order: number
  imageMap?: Map<string, string> // Map des URLs d'images vers les IDs Directus
}

// Initialiser Turndown pour convertir HTML en Markdown
const turndownService = new TurndownService({
  headingStyle: 'atx',
  codeBlockStyle: 'fenced',
  bulletListMarker: '-',
})

// Configuration personnalisée pour Turndown
turndownService.addRule('preserveImages', {
  filter: 'img',
  replacement: (content, node) => {
    const img = node as HTMLImageElement
    const src = img.getAttribute('src') || img.getAttribute('data-src') || ''
    const alt = img.getAttribute('alt') || ''
    const title = img.getAttribute('title') || ''
    return `![${alt}](${src}${title ? ` "${title}"` : ''})`
  }
})

/**
 * Télécharge un fichier depuis une URL
 */
async function downloadFile(url: string, filepath: string): Promise<void> {
  return new Promise((resolve, reject) => {
    const protocol = url.startsWith('https') ? https : http
    const file = fs.createWriteStream(filepath)
    
    protocol.get(url, (response) => {
      if (response.statusCode === 301 || response.statusCode === 302) {
        // Suivre les redirections
        return downloadFile(response.headers.location!, filepath).then(resolve).catch(reject)
      }
      
      if (response.statusCode !== 200) {
        file.close()
        fs.unlinkSync(filepath)
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
async function uploadImageToDirectus(
  imagePath: string,
  filename: string,
  token: string
): Promise<string | null> {
  try {
    const formData = new FormData()
    formData.append('file', fs.createReadStream(imagePath), {
      filename: filename,
      contentType: 'image/jpeg', // Adapter selon le type d'image
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
 * Extrait la date de publication avec OpenAI
 */
async function extractDateWithAI(page: any, title: string, content: string): Promise<string | null> {
  if (!OPENAI_API_KEY) {
    return null
  }

  try {
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
      return extractedDate
    }
  } catch (error: any) {
    // Erreur silencieuse, on utilisera une date par défaut
  }

  return null
}

/**
 * Scrape et crée les articles au fur et à mesure
 */
async function scrapeAndCreateArticles(
  browser: any,
  token: string,
  existingArticles: Map<string, string>
): Promise<void> {
  let globalOrder = 1
  let totalCreated = 0
  
  // Recharger la liste des articles existants au début (au cas où elle aurait changé)
  const client = createDirectus<Schema>(DIRECTUS_URL)
    .with(rest())
    .with(staticToken(token))
  const currentExistingArticles = await getExistingArticles(client, token)
  
  console.log(`Récupération des articles depuis les pages ${FIRST_PAGE} à ${LAST_PAGE}...`)
  
  for (let pageNum = FIRST_PAGE; pageNum <= LAST_PAGE; pageNum++) {
    const pageUrl = `${BASE_PAGE_URL}/${pageNum}`
    console.log(`\n📄 Page ${pageNum}/${LAST_PAGE}...`)
    
    const page = await browser.newPage()
    
    try {
      await page.goto(pageUrl, { 
        waitUntil: 'networkidle2',
        timeout: 30000 
      })
      
      // Attendre que le conteneur des articles soit chargé
      await page.waitForSelector('#pro-gallery-margin-container-pro-blog', { timeout: 10000 })
      
      // Scroller pour charger tous les articles (lazy loading possible)
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
      
      // Attendre un peu pour que le JavaScript charge tous les articles après le scroll
      await new Promise(resolve => setTimeout(resolve, 3000))
      
      // Utiliser data-hook="item-link-wrapper" pour trouver les articles
      let articleContainers: any[] = []
      
      // Sélecteur principal avec data-hook
      articleContainers = await page.$$('#pro-gallery-margin-container-pro-blog [data-hook="item-link-wrapper"]')
      
      console.log(`  Articles trouvés avec data-hook: ${articleContainers.length}`)
      
      // Si on ne trouve pas 5 articles, essayer de scroller encore plus
      if (articleContainers.length < ARTICLES_PER_PAGE) {
        // Scroller jusqu'en bas plusieurs fois
        for (let scroll = 0; scroll < 5; scroll++) {
          await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight))
          await new Promise(resolve => setTimeout(resolve, 1000))
          
          articleContainers = await page.$$('#pro-gallery-margin-container-pro-blog [data-hook="item-link-wrapper"]')
          if (articleContainers.length === ARTICLES_PER_PAGE) {
            console.log(`  ✓ Tous les articles chargés après ${scroll + 1} scroll(s)`)
            break
          }
        }
      }
      
      // Si on ne trouve toujours pas avec data-hook, essayer les autres sélecteurs en fallback
      if (articleContainers.length !== ARTICLES_PER_PAGE) {
        console.warn(`  ⚠ Avec data-hook: ${articleContainers.length} articles trouvés`)
        
        const fallbackSelectors = [
          '#pro-gallery-margin-container-pro-blog .gallery-item-container.item-container-regular',
          '#pro-gallery-margin-container-pro-blog .gallery-item-container',
          '#pro-gallery-margin-container-pro-blog .item-container-regular',
        ]
        
        for (const selector of fallbackSelectors) {
          const candidates = await page.$$(selector)
          if (candidates.length === ARTICLES_PER_PAGE) {
            articleContainers = candidates
            console.log(`  ✓ Sélecteur fallback trouvé: ${selector}`)
            break
          } else if (candidates.length > articleContainers.length) {
            articleContainers = candidates
          }
        }
      }
      
      const articleCount = articleContainers.length
      console.log(`  Trouvé ${articleCount} article(s) sur la page ${pageNum}`)
      
      // Vérifier qu'il y a le bon nombre d'articles par page
      // Dernière page peut avoir moins d'articles (3 au lieu de 5)
      const expectedCount = pageNum === LAST_PAGE ? 3 : ARTICLES_PER_PAGE
      
      if (articleCount !== expectedCount) {
        console.warn(`  ⚠ ATTENTION: ${articleCount} articles trouvés au lieu de ${expectedCount} sur la page ${pageNum}`)
        // Si on n'a pas le bon nombre, arrêter pour cette page
        if (articleCount === 0) {
          console.warn(`  ⚠ Aucun article trouvé, passage à la page suivante`)
          continue
        }
        // Si on a moins d'articles que prévu mais pas zéro, continuer quand même
      } else {
        console.log(`  ✓ Correct: ${articleCount} articles trouvés`)
      }
      
      // Pour chaque article, cliquer dessus et scraper le contenu
      for (let i = 0; i < articleContainers.length; i++) {
        try {
          // Re-récupérer les conteneurs à chaque itération car la page peut changer
          articleContainers = await page.$$('#pro-gallery-margin-container-pro-blog [data-hook="item-link-wrapper"]')
          
          if (i >= articleContainers.length) {
            console.warn(`    Index ${i} hors limites, arrêt du scraping de cette page`)
            break
          }
          
          console.log(`  Article ${i + 1}/${articleContainers.length}...`)
          
          // Trouver le lien dans le conteneur et cliquer dessus
          const currentUrl = page.url()
          
          // Récupérer l'URL du lien depuis l'élément
          const articleUrl = await articleContainers[i].evaluate((el: any) => {
            const link = el.querySelector('a')
            if (link && link.href) {
              return link.href
            }
            // Si pas de lien direct, chercher dans les attributs
            return el.getAttribute('href') || el.getAttribute('data-href') || null
          })
          
          if (articleUrl) {
            // Aller directement à l'URL de l'article
            console.log(`    Navigation vers: ${articleUrl}`)
            await page.goto(articleUrl, { waitUntil: 'networkidle2', timeout: 30000 })
          } else {
            // Si pas d'URL, cliquer sur l'élément
            await articleContainers[i].click()
            // Attendre la navigation
            await page.waitForNavigation({ waitUntil: 'networkidle2', timeout: 15000 })
          }
          
          // Attendre que le contenu soit chargé
          await page.waitForSelector('#content-wrapper', { timeout: 15000 })
          // Attendre un peu plus pour que tout le contenu se charge
          await new Promise(resolve => setTimeout(resolve, 2000))
          
          // Scraper l'article depuis la page actuelle
          const article = await scrapeArticleFromPage(page, globalOrder)
          
          if (article) {
            // Créer l'article immédiatement après le scraping
            await processAndCreateArticle(article, globalOrder, token, currentExistingArticles)
            // Mettre à jour la liste des articles existants après création
            const updatedExisting = await getExistingArticles(client, token)
            currentExistingArticles.clear()
            updatedExisting.forEach((value, key) => currentExistingArticles.set(key, value))
            totalCreated++
            globalOrder++
          }
          
          // Revenir à la page de liste
          // Utiliser l'URL de la page plutôt que goBack pour être sûr
          await page.goto(pageUrl, { waitUntil: 'networkidle2' })
          await page.waitForSelector('#pro-gallery-margin-container-pro-blog', { timeout: 10000 })
          
          // Scroller à nouveau pour recharger les articles
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
          
          await new Promise(resolve => setTimeout(resolve, 2000)) // Pause pour laisser la page se recharger
          
        } catch (error: any) {
          console.warn(`    ⚠ Erreur pour l'article ${i + 1} de la page ${pageNum}:`, error.message)
          // Essayer de revenir à la page de liste en cas d'erreur
          try {
            await page.goto(pageUrl, { waitUntil: 'networkidle2' })
            await page.waitForSelector('#pro-gallery-margin-container-pro-blog', { timeout: 10000 })
          } catch (e) {
            // Si on ne peut pas revenir, passer à la page suivante
            break
          }
        }
      }
      
    } catch (error: any) {
      console.warn(`  ⚠ Erreur sur la page ${pageNum}:`, error.message)
    } finally {
      await page.close()
    }
    
    // Pause entre les pages
    await new Promise(resolve => setTimeout(resolve, 2000))
  }
  
  console.log(`\n✅ Migration terminée! ${totalCreated} article(s) créé(s) au total`)
}

/**
 * Scrape un article depuis la page actuelle (déjà sur la page de l'article)
 */
async function scrapeArticleFromPage(page: any, order: number): Promise<ScrapedArticle | null> {
  try {
    const currentUrl = page.url()
    
    // Attendre que le contenu soit complètement chargé
    await page.waitForSelector('#content-wrapper section', { timeout: 10000 })
    // Attendre un peu plus pour le chargement asynchrone
    await new Promise(resolve => setTimeout(resolve, 2000))
    
    // Extraire le titre depuis #content-wrapper header
    let title = ''
    try {
      // Attendre que le header soit présent
      await page.waitForSelector('#content-wrapper header', { timeout: 8000 })
      title = await page.$eval('#content-wrapper header', (el: any) => {
        // Chercher le h1 ou le premier élément de texte significatif
        const h1 = el.querySelector('h1')
        if (h1) return h1.textContent?.trim() || ''
        return el.textContent?.trim() || ''
      })
    } catch (error) {
      // Essayer d'autres sélecteurs pour le titre
      try {
        await page.waitForSelector('h1', { timeout: 5000 })
        title = await page.$eval('h1', (el: any) => el.textContent?.trim() || '')
      } catch (e) {
        title = await page.title().catch(() => '')
        // Nettoyer le titre de la page
        title = title.replace(/\s*[-|]\s*.*$/, '')
      }
    }
    
    if (!title || title.length < 3) {
      console.warn(`    Pas de titre valide trouvé`)
      return null
    }
    
    // Extraire le sous-titre (peut être dans le header aussi)
    let subtitle: string | undefined = undefined
    try {
      subtitle = await page.$eval('#content-wrapper header', (el: any) => {
        const subtitleEl = el.querySelector('h2, .subtitle, [class*="subtitle"]')
        return subtitleEl?.textContent?.trim() || ''
      })
    } catch (error) {
      // Essayer d'autres sélecteurs
      try {
        subtitle = await page.$eval('h2', (el: any) => el.textContent?.trim() || '').catch(() => undefined)
      } catch (e) {
        subtitle = undefined
      }
    }
    
    // Contenu - extraire le texte proprement depuis la section (comme dans migrate-articles-simple.ts)
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
      if (OPENAI_API_KEY) {
        console.log(`    ⚠ Contenu trop court, utilisation de l'IA pour extraire...`)
        const openai = new OpenAI({ apiKey: OPENAI_API_KEY })
        
        try {
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
            let cleaned = extractedContent
              .replace(/```markdown\n?/g, '')
              .replace(/```\n?/g, '')
              .replace(/<[^>]+>/g, '') // Enlever tout HTML restant
              .trim()
            
            if (cleaned.length > 50) {
              markdown = cleaned
              console.log(`    ✓ Contenu extrait via IA (${cleaned.length} caractères)`)
            }
          }
        } catch (error: any) {
          console.warn(`    ⚠ Erreur avec OpenAI:`, error.message)
        }
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
      console.warn(`    Markdown trop court (${markdown.length} caractères)`)
      return null
    }
    
    console.log(`    ✓ Markdown généré (${markdown.length} caractères)`)
    
    // Extraire l'image depuis [data-hook="image-viewer-au4eo"]
    const images: string[] = []
    
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
          }
        }
      }
    } catch (error: any) {
      // Pas d'image principale, ce n'est pas grave
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
    
    // Extraire la date avec l'IA
    let date = await extractDateWithAI(page, title, markdown)
    
    // Si pas de date trouvée, utiliser la date actuelle
    if (!date) {
      date = new Date().toISOString().split('T')[0]
    }
    
    // Générer un slug depuis l'URL ou le titre
    const urlParts = currentUrl.split('/').filter(Boolean)
    let slug = urlParts[urlParts.length - 1]?.replace(/\.html?$/, '') || ''
    
    // Décoder l'URL si elle est encodée
    try {
      slug = decodeURIComponent(slug)
    } catch {
      // Si le décodage échoue, garder le slug tel quel
    }
    
    // Si pas de slug depuis l'URL, générer depuis le titre
    if (!slug || slug.length < 3) {
      slug = title.toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '')
    }
    
    // Nettoyer le slug pour éviter les caractères problématiques
    slug = slug
      .replace(/[^a-z0-9-]/g, '-')
      .replace(/-+/g, '-')
      .replace(/^-+|-+$/g, '')
      .substring(0, 100) // Limiter la longueur
    
    return {
      title,
      subtitle: subtitle && subtitle.length > 5 ? subtitle : undefined,
      content: markdown,
      images,
      date,
      slug,
      order
    }
  } catch (error: any) {
    console.error(`    Erreur lors du scraping:`, error.message)
    return null
  }
}



/**
 * Récupère tous les articles existants dans Directus
 */
async function getExistingArticles(
  client: ReturnType<typeof createDirectus<Schema>>,
  token: string
): Promise<Map<string, string>> {
  try {
    const response = await fetch(`${DIRECTUS_URL}/items/actus?fields=id,slug`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    })
    
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${await response.text()}`)
    }
    
    const result = await response.json()
    const articles = result.data || []
    const slugMap = new Map<string, string>() // slug -> id
    
    if (Array.isArray(articles)) {
      articles.forEach((article: any) => {
        if (article.slug) {
          slugMap.set(article.slug, article.id)
        }
      })
    }
    
    return slugMap
  } catch (error: any) {
    console.warn('⚠ Impossible de récupérer les articles existants:', error.message || error)
    return new Map()
  }
}

/**
 * Supprime tous les articles existants dans Directus
 */
async function deleteAllArticles(token: string): Promise<number> {
  try {
    // Récupérer tous les IDs
    const response = await fetch(`${DIRECTUS_URL}/items/actus?fields=id`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    })
    
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${await response.text()}`)
    }
    
    const result = await response.json()
    const articles = result.data || []
    const ids = Array.isArray(articles) ? articles.map((a: any) => a.id).filter(Boolean) : []
    
    if (ids.length === 0) {
      return 0
    }
    
    // Supprimer tous les articles
    await fetch(`${DIRECTUS_URL}/items/actus`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(ids),
    })
    
    console.log(`✓ ${ids.length} article(s) supprimé(s)`)
    return ids.length
  } catch (error: any) {
    console.error('❌ Erreur lors de la suppression des articles:', error.message)
    throw error
  }
}

/**
 * Met à jour un article existant dans Directus
 */
async function updateArticleInDirectus(
  client: ReturnType<typeof createDirectus<Schema>>,
  articleId: string,
  article: ScrapedArticle,
  coverImageId: string | null
): Promise<void> {
  try {
    // Ajouter le titre en H1 au début du markdown
    const bodyWithTitle = `# ${article.title}\n\n${article.content}`
    
    const articleData: any = {
      title: article.title,
      body: bodyWithTitle,
      date: article.date || new Date().toISOString().split('T')[0],
      slug: article.slug,
    }
    
    if (article.subtitle && article.subtitle.length > 0) {
      articleData.subtitle = article.subtitle
    }
    
    if (coverImageId) {
      articleData.cover = coverImageId
    }
    
    // Utiliser l'API REST directement
    const token = (client as any).authentication?.token || ''
    const response = await fetch(`${DIRECTUS_URL}/items/actus/${articleId}`, {
      method: 'PATCH',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(articleData),
    })
    
    if (!response.ok) {
      const errorData = await response.text()
      throw new Error(`Erreur HTTP ${response.status}: ${errorData}`)
    }
    
    console.log(`✓ Article mis à jour: ${article.title}`)
  } catch (error: any) {
    console.error(`Erreur lors de la mise à jour de l'article "${article.title}":`, error.message)
    throw error
  }
}

/**
 * Crée un nouvel article dans Directus
 */
async function createArticleInDirectus(
  client: ReturnType<typeof createDirectus<Schema>>,
  article: ScrapedArticle,
  coverImageId: string | null,
  token?: string
): Promise<void> {
  // Ajouter le titre en H1 au début du markdown
  const bodyWithTitle = `# ${article.title}\n\n${article.content}`
  
  const articleData: any = {
    title: article.title,
    body: bodyWithTitle,
    date: article.date || new Date().toISOString().split('T')[0],
    slug: article.slug,
  }
  
  if (article.subtitle && article.subtitle.length > 0) {
    articleData.subtitle = article.subtitle
  }
  
  if (coverImageId) {
    articleData.cover = coverImageId
  }
  
  // Vérifier que le slug est valide
  if (!article.slug || article.slug.length === 0) {
    throw new Error(`Slug invalide pour l'article "${article.title}"`)
  }
  
  try {
    // Utiliser l'API REST directement pour avoir de meilleurs messages d'erreur
    if (!token) {
      throw new Error('Token manquant pour créer l\'article')
    }
    const authToken = token
    
    const response = await fetch(`${DIRECTUS_URL}/items/actus`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${authToken}`,
        'Content-Type': 'application/json',
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
    console.log(`✓ Article créé: ${article.title}`)
    return result
  } catch (error: any) {
    const errorMessage = error.message || error.toString() || 'Erreur inconnue'
    console.error(`Erreur lors de la création de l'article "${article.title}":`, errorMessage)
    
    // Afficher plus de détails sur l'erreur
    if (error.response) {
      console.error(`  Status: ${error.response.status}`)
      console.error(`  Détails:`, JSON.stringify(error.response.data || error.response, null, 2))
    } else if (error.errors) {
      console.error(`  Erreurs:`, JSON.stringify(error.errors, null, 2))
    } else if (error.data) {
      console.error(`  Données d'erreur:`, JSON.stringify(error.data, null, 2))
    }
    
    // Afficher les données qui ont été envoyées
    console.error(`  Données envoyées:`, JSON.stringify(articleData, null, 2))
    
    throw error
  }
}

/**
 * Traite un article (télécharge les images, upload, crée dans Directus)
 */
async function processAndCreateArticle(
  article: ScrapedArticle,
  order: number,
  token: string,
  existingArticles: Map<string, string>
): Promise<void> {
  console.log(`\n📄 Article ${order}: ${article.title}`)
  
  let coverImageId: string | null = null
  const imageMap = new Map<string, string>() // Map URL -> Directus ID
  
  // Télécharger et uploader toutes les images
  if (article.images.length > 0) {
    console.log(`  📸 ${article.images.length} image(s) à traiter...`)
    
    for (let i = 0; i < article.images.length; i++) {
      const imageUrl = article.images[i]
      const urlObj = new URL(imageUrl)
      
      // Utiliser le slug de l'article pour nommer l'image
      const slug = article.slug || article.title.toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '')
      
      // Déterminer l'extension du fichier original
      const originalFilename = path.basename(urlObj.pathname)
      const extension = path.extname(originalFilename) || '.jpg'
      
      // Créer un nom de fichier basé sur le slug de l'article
      const imageFilename = i === 0 ? `${slug}${extension}` : `${slug}-${i + 1}${extension}`
      const tempImagePath = path.join(TEMP_DIR, imageFilename)
      
      try {
        if (!DRY_RUN) {
          console.log(`    Téléchargement: ${imageFilename}`)
          await downloadFile(imageUrl, tempImagePath)
          
          const uploadedId = await uploadImageToDirectus(tempImagePath, imageFilename, token)
          
          if (uploadedId) {
            imageMap.set(imageUrl, uploadedId)
            if (i === 0) {
              coverImageId = uploadedId
            }
            console.log(`    ✓ Image uploadée (ID: ${uploadedId})`)
          }
          
          // Nettoyer le fichier temporaire
          if (fs.existsSync(tempImagePath)) {
            fs.unlinkSync(tempImagePath)
          }
        } else {
          console.log(`    [DRY-RUN] Image serait téléchargée: ${imageFilename}`)
        }
      } catch (error: any) {
        console.warn(`    ⚠ Erreur image ${imageFilename}:`, error.message)
      }
    }
  }
  
  // Créer l'article dans Directus
  if (!DRY_RUN) {
    try {
      const client = createDirectus<Schema>(DIRECTUS_URL)
        .with(rest())
        .with(staticToken(token))
      
      // Vérifier si l'article existe déjà
      const existingId = existingArticles.get(article.slug || '')
      
      if (existingId && UPDATE_EXISTING) {
        console.log(`  🔄 Mise à jour de l'article existant...`)
        await updateArticleInDirectus(client, existingId, article, coverImageId)
      } else if (!existingId) {
        console.log(`  ➕ Création de l'article dans Directus...`)
        console.log(`     Slug: ${article.slug}`)
        console.log(`     Titre: ${article.title}`)
        console.log(`     Date: ${article.date}`)
        await createArticleInDirectus(client, article, coverImageId, token)
        console.log(`  ✅ Article créé avec succès!`)
      } else {
        console.log(`  ⚠ Article déjà existant (slug: ${article.slug}), ignoré`)
      }
    } catch (error: any) {
      const errorMessage = error.message || error.toString() || 'Erreur inconnue'
      console.error(`  ❌ Erreur lors de la création:`, errorMessage)
      
      // Afficher plus de détails
      if (error.response) {
        console.error(`    Status: ${error.response.status}`)
        console.error(`    Détails:`, JSON.stringify(error.response.data || error.response, null, 2))
      } else if (error.errors) {
        console.error(`    Erreurs:`, JSON.stringify(error.errors, null, 2))
      } else if (error.data) {
        console.error(`    Données d'erreur:`, JSON.stringify(error.data, null, 2))
      } else {
        console.error(`    Erreur complète:`, JSON.stringify(error, Object.getOwnPropertyNames(error), 2))
      }
      
      // Afficher les données de l'article pour debug
      console.error(`    Données de l'article:`, JSON.stringify({
        title: article.title,
        slug: article.slug,
        date: article.date,
        hasSubtitle: !!article.subtitle,
        hasCover: !!coverImageId,
        contentLength: article.content.length
      }, null, 2))
      
      throw error
    }
  } else {
    console.log(`  [DRY-RUN] Article serait créé: ${article.title}`)
  }
}

/**
 * Fonction principale
 */
async function main() {
  console.log('🚀 Démarrage de la migration des articles...\n')
  
  // 1. Authentification Directus
  console.log('1. Authentification Directus...')
  let client: ReturnType<typeof createDirectus<Schema>>
  let token: string
  
  if (DIRECTUS_STATIC_TOKEN) {
    token = DIRECTUS_STATIC_TOKEN
    client = createDirectus<Schema>(DIRECTUS_URL)
      .with(rest())
      .with(staticToken(DIRECTUS_STATIC_TOKEN))
  } else {
    token = await getAdminToken()
    client = createDirectus<Schema>(DIRECTUS_URL)
      .with(rest())
      .with(staticToken(token))
  }
  console.log('✓ Authentifié\n')
  
  // 1.5. Vérifier et gérer les articles existants
  console.log('1.5. Vérification des articles existants...')
  const existingArticles = await getExistingArticles(client, token)
  console.log(`✓ ${existingArticles.size} article(s) existant(s) trouvé(s)`)
  
  if (existingArticles.size > 0) {
    if (FORCE && !DRY_RUN) {
      console.log(`\n🗑️  Suppression de ${existingArticles.size} article(s) existant(s)...`)
      const deletedCount = await deleteAllArticles(token)
      console.log(`✓ ${deletedCount} article(s) supprimé(s)\n`)
    } else if (FORCE && DRY_RUN) {
      console.log(`\n[DRY-RUN] ${existingArticles.size} article(s) seraient supprimé(s)\n`)
    } else if (!UPDATE_EXISTING) {
      console.warn(`\n⚠️  ATTENTION: ${existingArticles.size} article(s) existant(s) dans Directus!`)
      console.warn(`   Utilisez --force pour les supprimer avant la migration`)
      console.warn(`   Ou utilisez --update pour mettre à jour les articles existants au lieu de créer des doublons`)
      console.warn(`   Sinon, des doublons seront créés!\n`)
    } else {
      console.log(`\n✓ Mode UPDATE: les articles existants seront mis à jour\n`)
    }
  } else {
    console.log('✓ Aucun article existant\n')
  }
  
  // 2. Lancer Puppeteer
  console.log('2. Lancement du navigateur...')
  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  })
  console.log('✓ Navigateur lancé\n')
  
  try {
    // 3. Scraper et créer les articles au fur et à mesure
    console.log('3. Scraping et création des articles au fur et à mesure...\n')
    if (DRY_RUN) {
      console.log('⚠ Mode DRY-RUN activé : aucun article ne sera créé\n')
    }
    
    const token = DIRECTUS_STATIC_TOKEN || await getAdminToken()
    
    // Scraper et créer les articles page par page
    await scrapeAndCreateArticles(browser, token, existingArticles)
    
    // 6. Nettoyer le dossier temporaire
    console.log('\n6. Nettoyage...')
    if (fs.existsSync(TEMP_DIR)) {
      fs.rmSync(TEMP_DIR, { recursive: true, force: true })
    }
    
    console.log('\n✅ Migration terminée!')
  } finally {
    // Fermer le navigateur
    await browser.close()
    console.log('✓ Navigateur fermé')
  }
}

// Exécuter le script
main().catch((error) => {
  console.error('❌ Erreur fatale:', error)
  process.exit(1)
})

