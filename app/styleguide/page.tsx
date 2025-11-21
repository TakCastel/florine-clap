'use client'

import { useState } from 'react'

export default function StyleguidePage() {
  const [activeSection, setActiveSection] = useState('typography')

  const sections = [
    { id: 'typography', label: 'Typographie' },
    { id: 'colors', label: 'Couleurs' },
    { id: 'components', label: 'Composants' },
    { id: 'navigation', label: 'Navigation' },
    { id: 'cards', label: 'Cartes' },
    { id: 'hero', label: 'Hero' },
    { id: 'spacing', label: 'Espacement' }
  ]

  return (
    <div className="min-h-screen bg-gray-50 pt-20">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-6xl font-display font-bold text-theme-dark mb-4">
            Styleguide
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl">
            Guide de style pour le site de Florine Clap. Ce document présente 
            les typographies, couleurs, composants et règles de design utilisés.
          </p>
        </div>

        {/* Navigation */}
        <nav className="mb-12">
          <div className="flex flex-wrap gap-4">
            {sections.map((section) => (
              <button
                key={section.id}
                onClick={() => setActiveSection(section.id)}
                className={`px-6 py-3 rounded-lg font-display font-medium transition-all duration-200 ${
                  activeSection === section.id
                    ? 'bg-theme-blue text-white'
                    : 'bg-white text-theme-dark hover:bg-gray-100 border border-gray-200'
                }`}
              >
                {section.label}
              </button>
            ))}
          </div>
        </nav>

        {/* Content */}
        <div className="bg-white rounded-lg shadow-lg p-8">
          {activeSection === 'typography' && <TypographySection />}
          {activeSection === 'colors' && <ColorsSection />}
          {activeSection === 'components' && <ComponentsSection />}
          {activeSection === 'navigation' && <NavigationSection />}
          {activeSection === 'cards' && <CardsSection />}
          {activeSection === 'hero' && <HeroSection />}
          {activeSection === 'spacing' && <SpacingSection />}
        </div>
      </div>
    </div>
  )
}

function TypographySection() {
  return (
    <div>
      <h2 className="text-4xl font-display font-bold text-theme-dark mb-8">
        Typographie
      </h2>
      
      {/* Police d'affichage - MuseoModerno */}
      <div className="mb-12">
        <h3 className="text-2xl font-display font-bold text-theme-blue mb-6">
          Police d'affichage - MuseoModerno
        </h3>
        <div className="space-y-6">
          <div>
            <h4 className="text-lg font-display font-semibold text-gray-700 mb-2">
              Titre principal (H1)
            </h4>
            <h1 className="text-6xl font-display font-bold text-theme-dark">
              Titre Principal
            </h1>
            <code className="text-sm text-gray-500 mt-2 block">
              text-6xl font-display font-bold
            </code>
          </div>
          
          <div>
            <h4 className="text-lg font-display font-semibold text-gray-700 mb-2">
              Titre secondaire (H2)
            </h4>
            <h2 className="text-4xl font-display font-bold text-theme-dark">
              Titre Secondaire
            </h2>
            <code className="text-sm text-gray-500 mt-2 block">
              text-4xl font-display font-bold
            </code>
          </div>
          
          <div>
            <h4 className="text-lg font-display font-semibold text-gray-700 mb-2">
              Titre tertiaire (H3)
            </h4>
            <h3 className="text-2xl font-display font-bold text-theme-dark">
              Titre Tertiaire
            </h3>
            <code className="text-sm text-gray-500 mt-2 block">
              text-2xl font-display font-bold
            </code>
          </div>
        </div>
      </div>

      {/* Police de texte - Andale Mono */}
      <div className="mb-12">
        <h3 className="text-2xl font-display font-bold text-theme-blue mb-6">
          Police de texte - Andale Mono
        </h3>
        <div className="space-y-6">
          <div>
            <h4 className="text-lg font-display font-semibold text-gray-700 mb-2">
              Texte large
            </h4>
            <p className="text-xl text-gray-700 leading-relaxed">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor 
              incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam.
            </p>
            <code className="text-sm text-gray-500 mt-2 block">
              text-xl
            </code>
          </div>
          
          <div>
            <h4 className="text-lg font-display font-semibold text-gray-700 mb-2">
              Texte normal
            </h4>
            <p className="text-base text-gray-700 leading-relaxed">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor 
              incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis 
              nostrud exercitation ullamco laboris.
            </p>
            <code className="text-sm text-gray-500 mt-2 block">
              text-base
            </code>
          </div>
          
          <div>
            <h4 className="text-lg font-display font-semibold text-gray-700 mb-2">
              Texte petit
            </h4>
            <p className="text-sm text-gray-600 leading-relaxed">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor 
              incididunt ut labore et dolore magna aliqua.
            </p>
            <code className="text-sm text-gray-500 mt-2 block">
              text-sm
            </code>
          </div>
        </div>
      </div>

      {/* Poids de police */}
      <div>
        <h3 className="text-2xl font-display font-bold text-theme-blue mb-6">
          Poids de police
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h4 className="text-lg font-display font-semibold text-gray-700 mb-2">
              MuseoModerno
            </h4>
            <div className="space-y-2">
              <p className="font-display font-light text-lg">Light (300)</p>
              <p className="font-display font-normal text-lg">Normal (400)</p>
              <p className="font-display font-medium text-lg">Medium (500)</p>
              <p className="font-display font-semibold text-lg">Semibold (600)</p>
              <p className="font-display font-bold text-lg">Bold (700)</p>
              <p className="font-display font-extrabold text-lg">Extrabold (800)</p>
            </div>
          </div>
          
          <div>
            <h4 className="text-lg font-display font-semibold text-gray-700 mb-2">
              Andale Mono
            </h4>
            <div className="space-y-2">
              <p className="font-sans font-light text-lg">Light (300)</p>
              <p className="font-sans font-normal text-lg">Normal (400)</p>
              <p className="font-sans font-medium text-lg">Medium (500)</p>
              <p className="font-sans font-semibold text-lg">Semibold (600)</p>
              <p className="font-sans font-bold text-lg">Bold (700)</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function ColorsSection() {
  const colorGroups = [
    {
      title: 'Couleurs principales',
      colors: [
        { name: 'theme-blue', value: '#26436C', description: 'Bleu principal' },
        { name: 'theme-dark', value: '#0B1426', description: 'Bleu nuit profond' },
        { name: 'theme-yellow', value: '#FFD700', description: 'Jaune pop art' },
        { name: 'theme-grey', value: '#D9D5CC', description: 'Gris chaud' }
      ]
    },
    {
      title: 'Couleurs secondaires',
      colors: [
        { name: 'theme-sage', value: '#8B9A8B', description: 'Vert sauge' },
        { name: 'theme-burgundy', value: '#6B2C3E', description: 'Bordeaux profond' },
        { name: 'theme-slate', value: '#4A5568', description: 'Ardoise froide' },
        { name: 'theme-orange', value: '#E8B95C', description: 'Jaune moutarde' }
      ]
    }
  ]

  return (
    <div>
      <h2 className="text-4xl font-display font-bold text-theme-dark mb-8">
        Palette de couleurs
      </h2>
      
      {colorGroups.map((group, groupIndex) => (
        <div key={groupIndex} className="mb-12">
          <h3 className="text-2xl font-display font-bold text-theme-blue mb-6">
            {group.title}
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {group.colors.map((color, colorIndex) => (
              <div key={colorIndex} className="bg-white border border-gray-200 rounded-lg p-4">
                <div 
                  className="w-full h-24 rounded-lg mb-3"
                  style={{ backgroundColor: color.value }}
                ></div>
                <h4 className="font-display font-semibold text-gray-800 mb-1">
                  {color.name}
                </h4>
                <p className="text-sm text-gray-600 mb-2">{color.value}</p>
                <p className="text-xs text-gray-500">{color.description}</p>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}

function ComponentsSection() {
  return (
    <div>
      <h2 className="text-4xl font-display font-bold text-theme-dark mb-8">
        Composants
      </h2>
      
      {/* Boutons */}
      <div className="mb-12">
        <h3 className="text-2xl font-display font-bold text-theme-blue mb-6">
          Boutons
        </h3>
        <div className="flex flex-wrap gap-4">
          <button className="px-6 py-3 bg-theme-blue text-white rounded-lg font-display font-medium hover:bg-theme-blue/90 transition-colors">
            Bouton principal
          </button>
          <button className="px-6 py-3 bg-theme-yellow text-theme-dark rounded-lg font-display font-medium hover:bg-theme-yellow/90 transition-colors">
            Bouton secondaire
          </button>
          <button className="px-6 py-3 border-2 border-theme-blue text-theme-blue rounded-lg font-display font-medium hover:bg-theme-blue hover:text-white transition-colors">
            Bouton outline
          </button>
        </div>
      </div>

      {/* Cartes */}
      <div className="mb-12">
        <h3 className="text-2xl font-display font-bold text-theme-blue mb-6">
          Cartes
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
            <h4 className="text-xl font-display font-bold text-theme-dark mb-3">
              Carte simple
            </h4>
            <p className="text-gray-600 mb-4">
              Exemple de carte avec titre et contenu.
            </p>
            <button className="text-theme-blue font-display font-medium hover:underline">
              Lire plus
            </button>
          </div>
          
          <div className="bg-theme-blue text-white rounded-lg p-6">
            <h4 className="text-xl font-display font-bold mb-3">
              Carte colorée
            </h4>
            <p className="text-white/90 mb-4">
              Exemple de carte avec fond coloré.
            </p>
            <button className="text-theme-yellow font-display font-medium hover:underline">
              Action
            </button>
          </div>
        </div>
      </div>

      {/* Formulaires */}
      <div>
        <h3 className="text-2xl font-display font-bold text-theme-blue mb-6">
          Formulaires
        </h3>
        <div className="max-w-md">
          <div className="mb-4">
            <label className="block font-display font-medium text-gray-700 mb-2">
              Nom
            </label>
            <input 
              type="text" 
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-theme-blue focus:border-transparent"
              placeholder="Votre nom"
            />
          </div>
          <div className="mb-4">
            <label className="block font-display font-medium text-gray-700 mb-2">
              Email
            </label>
            <input 
              type="email" 
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-theme-blue focus:border-transparent"
              placeholder="votre@email.com"
            />
          </div>
          <button className="w-full px-6 py-3 bg-theme-blue text-white rounded-lg font-display font-medium hover:bg-theme-blue/90 transition-colors">
            Envoyer
          </button>
        </div>
      </div>
    </div>
  )
}

function NavigationSection() {
  return (
    <div>
      <h2 className="text-4xl font-display font-bold text-theme-dark mb-8">
        Navigation
      </h2>
      
      {/* Header principal */}
      <div className="mb-12">
        <h3 className="text-2xl font-display font-bold text-theme-blue mb-6">
          Header principal
        </h3>
        <div className="bg-theme-dark p-6 rounded-lg">
          <div className="flex items-center justify-between">
            <div className="text-2xl font-display font-bold text-white">
              Florine Clap
            </div>
            <nav className="flex items-center gap-8">
              <a href="#" className="text-xl font-display font-bold text-white hover:text-theme-yellow transition-colors">
                FILMS
              </a>
              <a href="#" className="text-xl font-display font-bold text-white hover:text-theme-yellow transition-colors">
                MÉDIATIONS
              </a>
              <a href="#" className="text-xl font-display font-bold text-white hover:text-theme-yellow transition-colors">
                ACTUALITÉS
              </a>
              <a href="#" className="text-xl font-display font-bold text-white hover:text-theme-yellow transition-colors">
                BIO
              </a>
            </nav>
          </div>
        </div>
      </div>

      {/* Navigation mobile */}
      <div className="mb-12">
        <h3 className="text-2xl font-display font-bold text-theme-blue mb-6">
          Navigation mobile
        </h3>
        <div className="bg-white border border-gray-200 p-4 rounded-lg">
          <div className="flex items-center justify-between">
            <div className="text-xl font-display font-bold text-theme-dark">
              Florine Clap
            </div>
            <button className="p-2 text-theme-dark hover:bg-gray-100 rounded">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Breadcrumb */}
      <div>
        <h3 className="text-2xl font-display font-bold text-theme-blue mb-6">
          Fil d'Ariane
        </h3>
        <nav className="flex items-center text-sm font-display text-gray-600">
          <a href="#" className="hover:text-theme-blue transition-colors">Accueil</a>
          <span className="mx-2 text-gray-400">/</span>
          <a href="#" className="hover:text-theme-blue transition-colors">Films</a>
          <span className="mx-2 text-gray-400">/</span>
          <span className="text-theme-dark font-medium">Titre du film</span>
        </nav>
      </div>
    </div>
  )
}

function CardsSection() {
  return (
    <div>
      <h2 className="text-4xl font-display font-bold text-theme-dark mb-8">
        Cartes
      </h2>
      
      {/* FilmCard */}
      <div className="mb-12">
        <h3 className="text-2xl font-display font-bold text-theme-blue mb-6">
          Carte de film
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="group block">
            <article className="relative overflow-hidden bg-black rounded-lg shadow-2xl hover:shadow-3xl transition-all duration-500 hover:scale-[1.02] transform">
              <div className="aspect-[16/9] bg-gradient-to-br from-theme-blue to-theme-dark">
                <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-transparent"></div>
                <div className="relative z-10 p-6 h-full flex flex-col justify-end">
                  <div className="flex items-center gap-3 text-white/80 text-sm font-display mb-2">
                    <span className="flex items-center gap-1">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      15 min
                    </span>
                    <span className="flex items-center gap-1">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      2023
                    </span>
                  </div>
                  <h3 className="text-2xl font-display font-bold text-white mb-3 leading-tight">
                    Titre du film
                  </h3>
                  <p className="text-white/80 text-sm mb-4 line-clamp-2">
                    Synopsis du film qui décrit brièvement le contenu et l'approche documentaire.
                  </p>
                  <div className="inline-flex items-center text-white font-display font-medium group-hover:text-white/80 transition-colors">
                    Voir la page du film
                    <svg className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </div>
              </div>
            </article>
          </div>
        </div>
      </div>

      {/* ActuCard */}
      <div className="mb-12">
        <h3 className="text-2xl font-display font-bold text-theme-blue mb-6">
          Carte d'actualité
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="group block">
            <article className="bg-white/95 hover:bg-white transition-all duration-300 rounded-lg shadow-lg hover:shadow-xl hover:scale-[1.01] overflow-hidden transform">
              <div className="aspect-[3/2] bg-gradient-to-br from-theme-yellow to-theme-orange">
                <div className="absolute inset-0 bg-gradient-to-t from-theme-dark/60 to-transparent"></div>
                <div className="relative z-10 p-4 h-full flex flex-col justify-end">
                  <div className="text-theme-yellow text-xs font-display mb-1">
                    15 décembre 2023
                  </div>
                  <h3 className="text-base font-display font-bold text-white mb-1 leading-tight line-clamp-2 group-hover:text-white/90 transition-colors">
                    Nouvelle actualité importante
                  </h3>
                </div>
              </div>
            </article>
          </div>
        </div>
      </div>

      {/* ProjectCard */}
      <div>
        <h3 className="text-2xl font-display font-bold text-theme-blue mb-6">
          Carte de projet
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow">
            <div className="aspect-video bg-gradient-to-br from-theme-sage to-theme-burgundy rounded-lg mb-4"></div>
            <h4 className="text-xl font-display font-bold text-theme-dark mb-2">
              Titre du projet
            </h4>
            <p className="text-gray-600 mb-4">
              Description du projet et de son approche documentaire.
            </p>
            <div className="flex items-center gap-4 text-sm text-gray-500">
              <span className="flex items-center gap-1">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                20 min
              </span>
              <span>2023</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function HeroSection() {
  return (
    <div>
      <h2 className="text-4xl font-display font-bold text-theme-dark mb-8">
        Section Hero
      </h2>
      
      {/* Hero avec vidéo */}
      <div className="mb-12">
        <h3 className="text-2xl font-display font-bold text-theme-blue mb-6">
          Hero avec vidéo
        </h3>
        <div className="relative h-96 bg-gradient-to-br from-theme-dark to-theme-blue rounded-lg overflow-hidden">
          <div className="absolute inset-0 bg-black/40"></div>
          <div className="relative z-10 h-full flex items-center justify-center">
            <div className="text-center text-white">
              <h1 className="text-6xl font-display font-bold mb-4">
                Florine Clap
              </h1>
              <p className="text-xl text-white/80 mb-8">
                Réalisatrice et monteuse documentaire
              </p>
            </div>
          </div>
          <div className="absolute bottom-0 left-0 right-0 h-20 bg-black flex items-center justify-center z-30">
            <button className="group text-white/60 hover:text-white/90 transition-all duration-1000 ease-out">
              <svg className="w-6 h-6 transition-all duration-1000 group-hover:translate-y-0.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path d="M19 14l-7 7m0 0l-7-7m7 7V3"/>
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Hero avec image */}
      <div className="mb-12">
        <h3 className="text-2xl font-display font-bold text-theme-blue mb-6">
          Hero avec image
        </h3>
        <div className="relative h-96 bg-gradient-to-br from-theme-sage to-theme-burgundy rounded-lg overflow-hidden">
          <div className="absolute inset-0 bg-black/30"></div>
          <div className="relative z-10 h-full flex items-center justify-center">
            <div className="text-center text-white">
              <h1 className="text-5xl font-display font-bold mb-4">
                Films
              </h1>
              <p className="text-lg text-white/80">
                Découvrez mes réalisations documentaires
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Hero simple */}
      <div>
        <h3 className="text-2xl font-display font-bold text-theme-blue mb-6">
          Hero simple
        </h3>
        <div className="bg-theme-blue text-white p-12 rounded-lg">
          <h1 className="text-4xl font-display font-bold mb-4">
            Actualités
          </h1>
          <p className="text-lg text-white/80">
            Suivez mes dernières actualités et projets
          </p>
        </div>
      </div>
    </div>
  )
}

function SpacingSection() {
  const spacingSizes = [
    { class: 'p-1', value: '4px', description: 'Très petit' },
    { class: 'p-2', value: '8px', description: 'Petit' },
    { class: 'p-4', value: '16px', description: 'Normal' },
    { class: 'p-6', value: '24px', description: 'Moyen' },
    { class: 'p-8', value: '32px', description: 'Grand' },
    { class: 'p-12', value: '48px', description: 'Très grand' },
    { class: 'p-16', value: '64px', description: 'Énorme' }
  ]

  return (
    <div>
      <h2 className="text-4xl font-display font-bold text-theme-dark mb-8">
        Système d'espacement
      </h2>
      
      <div className="mb-12">
        <h3 className="text-2xl font-display font-bold text-theme-blue mb-6">
          Padding
        </h3>
        <div className="space-y-4">
          {spacingSizes.map((spacing, index) => (
            <div key={index} className="flex items-center gap-4">
              <div className={`bg-theme-blue/20 border border-theme-blue ${spacing.class} min-w-16 h-16 flex items-center justify-center`}>
                <span className="text-xs font-display font-bold text-theme-blue">P</span>
              </div>
              <div>
                <code className="font-display font-medium text-gray-800">{spacing.class}</code>
                <p className="text-sm text-gray-600">{spacing.value} - {spacing.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div>
        <h3 className="text-2xl font-display font-bold text-theme-blue mb-6">
          Marges
        </h3>
        <div className="space-y-4">
          {spacingSizes.map((spacing, index) => (
            <div key={index} className="flex items-center gap-4">
              <div className="bg-gray-100 p-2">
                <div className={`bg-theme-blue/20 border border-theme-blue ${spacing.class.replace('p-', 'm-')} min-w-16 h-16 flex items-center justify-center`}>
                  <span className="text-xs font-display font-bold text-theme-blue">M</span>
                </div>
              </div>
              <div>
                <code className="font-display font-medium text-gray-800">{spacing.class.replace('p-', 'm-')}</code>
                <p className="text-sm text-gray-600">{spacing.value} - {spacing.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
