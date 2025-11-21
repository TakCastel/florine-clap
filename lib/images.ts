// Liste des images pour chaque catégorie
// Ces listes seront mises à jour dynamiquement côté client pour éviter de hardcoder les noms

export const cardImages = {
  films: [
    '01_film_Florine_Clap.png',
    '02_film_Florine_Clap.png',
    '03_film_Florine_Clap.png',
    '04_film_Florine_Clap.png',
    '05_film_Florine_Clap.png',
    '06_film_Florine_Clap.png',
    '07_film_Florine_Clap.png',
    '08_film_Florine_Clap.png',
    '09_film_Florine_Clap.png',
    '10_film_Florine_Clap.png',
    '11_film_Florine_Clap.png',
    '12_film_Florine_Clap.png',
    '13_film_Florine_Clap.png',
    '14_film_Florine_Clap.png',
    '15_film_Florine_Clap.png',
    '16_film_Florine_Clap.png',
    '17_film_Florine_Clap.png',
    '18_film_Florine_Clap.png',
    '19_film_Florine_Clap.png',
    '20_film_Florine_Clap.png',
    '21_film_Florine_Clap.png',
    '22_film_Florine_Clap.png',
    '23_film_Florine_Clap.png',
    '24_film_Florine_Clap.jpg',
    '25_film_Florine_Clap.jpg',
    '26_film_Florine_Clap.jpg',
    '27_film_Florine_Clap.jpg',
    '28_film_Florine_Clap.jpg',
    '29_film_Florine_Clap.jpg',
  ],
  mediations: [
    '01_mediation_Florine_Clap.png',
    '02_mediation_Florine_Clap.png',
    '03_mediation_Florine_Clap.png',
    '04_mediation_Florine_Clap.png',
    '05_mediation_Florine_Clap.png',
    '06_mediation_Florine_Clap.png',
    '07_mediation_Florine_Clap.png',
    '08_mediation_Florine_Clap.png',
    '09_mediation_Florine_Clap.png',
    '10_mediation_Florine_Clap.png',
    '11_mediation_Florine_Clap.png',
    '12_mediation_Florine_Clap.png',
    '13_mediation_Florine_Clap.png',
    '14_mediation_Florine_Clap.png',
    '15_mediation_Florine_Clap.jpg',
  ],
  'video-art': [
    '01_art_video_Florine_Clap.png',
    '02_art_video_Florine_Cla.png',
    '03_art_video_Florine_Cla.png',
    '04_art_video_Florine_Cla.png',
    '05_art_video_Florine_Cla.png',
    '06_art_video_Florine_Cla.jpg',
    '07_art_video_Florine_Cla.jpg',
  ],
  actus: [
    'Florine Clap - Février 2023-34.jpg',
  ],
}

/**
 * Sélectionne une image aléatoire pour une catégorie donnée
 */
export function getRandomCardImage(category: 'films' | 'mediations' | 'video-art' | 'actus'): string {
  const images = cardImages[category]
  if (!images || images.length === 0) {
    return ''
  }
  const randomIndex = Math.floor(Math.random() * images.length)
  const imageName = images[randomIndex]
  const folderMap: Record<string, string> = {
    'films': 'card-film',
    'mediations': 'card-mediations',
    'video-art': 'card-video-art',
    'actus': 'card-actualites'
  }
  return `/images/${folderMap[category]}/${imageName}`
}

/**
 * Photo bio
 */
export const bioPhoto = '/images/photo-bio/Florine Clap - Février 2023-12.jpg'

