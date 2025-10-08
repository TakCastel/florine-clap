// Données statiques pour le site
export interface Film {
  id: string
  title: string
  slug: string
  annee: number
  duree?: string
  synopsis?: string
  statut?: string
  vimeo?: string
  youtube?: string
  credits?: string
  selections?: string[]
  selections_text?: string
  cover?: string
  gallery?: string[]
  excerpt?: string
  tags?: string[]
  category?: string
  role?: string
  seo_title?: string
  seo_description?: string
  seo_image?: string
  noindex?: boolean
  body: string
}

export interface Atelier {
  id: string
  title: string
  slug: string
  date: string
  lieu: string
  duree?: string
  modalites?: string
  lien_inscription?: string
  gallery?: string[]
  excerpt?: string
  tags?: string[]
  seo_title?: string
  seo_description?: string
  seo_image?: string
  noindex?: boolean
  body: string
}

export interface Actu {
  id: string
  title: string
  slug: string
  date: string
  cover?: string
  excerpt?: string
  tags?: string[]
  seo_title?: string
  seo_description?: string
  seo_image?: string
  noindex?: boolean
  body: string
}

export interface Page {
  id: string
  title: string
  slug: string
  portrait?: string
  hero_video?: string
  hero_image?: string
  cta_text?: string
  cta_link?: string
  seo_title?: string
  seo_description?: string
  seo_image?: string
  noindex?: boolean
  body: string
}

// Données statiques
export const films: Film[] = [
  {
    id: "1",
    title: "123 Soleil",
    slug: "123-soleil",
    annee: 2023,
    duree: "15 minutes",
    synopsis: "Un court métrage poétique qui explore la relation entre l'homme et la nature à travers le prisme de la lumière.",
    statut: "En sélection",
    vimeo: "https://vimeo.com/example",
    excerpt: "Un voyage lumineux à travers les saisons",
    tags: ["documentaire", "nature", "poésie"],
    category: "Court métrage",
    role: "Réalisatrice",
    body: `
# 123 Soleil

Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.

## Synopsis détaillé

Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.

### Les thèmes abordés

- La relation homme-nature
- Le cycle des saisons
- La poésie du quotidien
- La lumière comme métaphore

## Processus de création

Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo.

Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt.
    `
  }
]

export const m�diations: Atelier[] = [
  {
    id: "1",
    title: "Atelier Cinéma Documentaire",
    slug: "atelier-cinema-documentaire",
    date: "2024-03-15",
    lieu: "Médiathèque de la ville",
    duree: "3 heures",
    modalites: "Gratuit, sur inscription. Matériel fourni.",
    lien_inscription: "https://example.com/inscription",
    excerpt: "Découvrez les techniques du cinéma documentaire",
    tags: ["documentaire", "initiation", "technique"],
    body: `
# Atelier Cinéma Documentaire

Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.

## Objectifs de l'atelier

- Comprendre les spécificités du documentaire
- Apprendre les techniques de base
- Réaliser un court documentaire
- Développer son regard critique

## Programme détaillé

### 1. Introduction au documentaire (45 min)
Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.

### 2. Techniques de tournage (60 min)
Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.

### 3. Montage et post-production (75 min)
Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.

## Matériel nécessaire

- Caméra ou smartphone
- Ordinateur portable (optionnel)
- Carnet de notes

## Modalités pratiques

Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo.
    `
  }
]

export const actus: Actu[] = [
  {
    id: "1",
    title: "Nouvelle sélection au Festival de Cannes",
    slug: "selection-festival-cannes",
    date: "2024-02-20",
    cover: "/images/uploads/actu-cannes.jpg",
    excerpt: "Notre court métrage '123 Soleil' a été sélectionné pour la section Short Film Corner du Festival de Cannes 2024.",
    tags: ["festival", "cannes", "sélection"],
    body: `
# Nouvelle sélection au Festival de Cannes

Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.

## Une reconnaissance importante

Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.

### Le parcours du film

Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum. Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium.

## Prochaines étapes

- Projection au Festival de Cannes
- Rencontres professionnelles
- Développement de nouveaux projets

## Remerciements

Totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo. Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit.
    `
  }
]

export const pages: Page[] = [
  {
    id: "1",
    title: "À propos",
    slug: "bio",
    portrait: "/images/florine-portrait.jpg",
    hero_video: "/videos/example.mp4",
    cta_text: "Découvrir mes films",
    cta_link: "/films",
    body: `
# Florine Clap

Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.

## Mon parcours

Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.

### Formation

- Master en Cinéma Documentaire
- École de cinéma de Paris
- Spécialisation en réalisation

### Expérience

Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum. Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium.

## Ma vision du cinéma

Totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo. Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit.
    `
  },
  {
    id: "2",
    title: "Accueil",
    slug: "home",
    hero_image: "/images/uploads/hero-home.jpg",
    cta_text: "Découvrir mes films",
    cta_link: "/films",
    body: `
# Bienvenue sur mon site

Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.

## Mes dernières créations

Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.

### Films récents

- 123 Soleil (2023)
- Projet en cours (2024)

### m�diations et formations

Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.
    `
  }
]
