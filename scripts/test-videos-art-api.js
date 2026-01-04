#!/usr/bin/env node

/**
 * Script pour tester ce que l'API Directus retourne pour videos_art
 */

const axios = require('axios')
require('dotenv').config()

const DIRECTUS_URL = process.env.DIRECTUS_PUBLIC_URL || 'http://localhost:8055'

async function testVideosArtAPI() {
  try {
    console.log('🧪 Test de l\'API Directus pour videos_art...\n')
    console.log(`URL: ${DIRECTUS_URL}\n`)

    // Test 1: Récupérer tous les videos_art avec la même requête que le frontend
    console.log('📋 Test 1: Récupération avec fields=*,image.id,image.filename_download')
    const response1 = await axios.get(`${DIRECTUS_URL}/items/videos_art`, {
      params: {
        fields: '*,image.id,image.filename_download',
        sort: ['-annee', '-date_created'],
      },
    })
    
    const videoArts = response1.data.data || []
    console.log(`✅ ${videoArts.length} videos_art récupérés\n`)
    
    if (videoArts.length > 0) {
      console.log('📦 Premier item (format complet):')
      console.log(JSON.stringify(videoArts[0], null, 2))
      console.log('\n')
      
      console.log('📦 Détails de l\'image du premier item:')
      console.log({
        image: videoArts[0].image,
        imageType: typeof videoArts[0].image,
        imageIsObject: typeof videoArts[0].image === 'object',
        imageIsString: typeof videoArts[0].image === 'string',
        imageIsNull: videoArts[0].image === null,
        imageIsUndefined: videoArts[0].image === undefined,
      })
      console.log('\n')
      
      // Test 2: Récupérer avec une syntaxe différente
      console.log('📋 Test 2: Récupération avec fields=*,image.*')
      const response2 = await axios.get(`${DIRECTUS_URL}/items/videos_art`, {
        params: {
          fields: '*,image.*',
          sort: ['-annee', '-date_created'],
          limit: 1,
        },
      })
      
      if (response2.data.data && response2.data.data.length > 0) {
        console.log('📦 Premier item avec image.*:')
        console.log(JSON.stringify(response2.data.data[0], null, 2))
        console.log('\n')
      }
      
      // Test 3: Vérifier la relation
      console.log('📋 Test 3: Vérification de la relation')
      const relationResponse = await axios.get(`${DIRECTUS_URL}/relations/videos_art`)
      const relations = relationResponse.data.data || []
      const imageRelation = relations.find(r => r.field === 'image')
      
      if (imageRelation) {
        console.log('✅ Relation trouvée:')
        console.log(JSON.stringify(imageRelation, null, 2))
      } else {
        console.log('❌ Aucune relation trouvée pour videos_art.image')
      }
    }

  } catch (error) {
    console.error('❌ Erreur:', error.response?.data || error.message)
    if (error.response?.data?.errors) {
      console.error('Détails:', error.response.data.errors)
    }
    process.exit(1)
  }
}

testVideosArtAPI().catch((error) => {
  console.error('❌ Erreur lors du test:', error.response?.data || error.message)
  process.exit(1)
})

