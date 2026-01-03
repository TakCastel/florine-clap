/**
 * Types TypeScript pour le schéma Directus
 * Générés automatiquement ou définis manuellement
 */

export interface Schema {
  films: Film[]
  mediations: Mediation[]
  actus: Actu[]
  pages: Page[]
  videos_art: VideoArt[]
  home_settings: HomeSettings[]
}

export interface Film {
  id: string
  slug: string
  title: string
  image?: string
  content?: string
  heading?: string
  type?: string
  duree?: string
  annee?: string
  langue?: string
  pays_production?: string
  short_synopsis?: string
  realisation?: string
  mixage?: string
  son?: string
  musique?: string
  montage?: string
  avec?: string
  production?: string
  scenario?: string
  assistants_mise_en_scene?: string
  assistante_mise_en_scene?: string
  assistants_images?: string
  steadycamer?: string
  etalonnage?: string
  montage_son?: string
  producteurs?: string
  realisateur_captation?: string
  image_captation?: string
  diffusion?: string[]
  selection?: string[]
  lien_film?: string
  body?: string
  date_created?: string
  date_updated?: string
}

export interface Mediation {
  id: string
  slug: string
  title: string
  date: string
  lieu: string
  duree?: string
  modalites?: string
  lien_inscription?: string
  gallery?: string[]
  excerpt?: string
  tags?: string[]
  cover?: string
  body?: string
  date_created?: string
  date_updated?: string
}

export interface Actu {
  id: string
  slug: string
  title: string
  subtitle?: string
  date: string
  excerpt?: string
  tags?: string[]
  cover?: string
  location?: string
  body?: string
  date_created?: string
  date_updated?: string
}

export interface Page {
  id: string
  slug: string
  title: string
  portrait?: string
  hero_video?: string
  hero_image?: string
  cta_text?: string
  cta_link?: string
  body?: string
  date_created?: string
  date_updated?: string
}

export interface VideoArt {
  id: string
  slug: string
  title: string
  image?: string
  type?: string
  duree?: string
  annee?: string
  vimeo_id?: string
  video_url?: string
  short_synopsis?: string
  realisation?: string
  mixage?: string
  texte?: string
  production?: string
  body?: string
  date_created?: string
  date_updated?: string
}

export interface HomeSettings {
  id: string
  hero_text?: string
  hero_image?: string
  hero_video_url?: string
  bio_text?: string
  bio_image?: string
  category_films_image?: string
  category_mediations_image?: string
  category_video_art_image?: string
  category_actus_image?: string
  date_created?: string
  date_updated?: string
}

