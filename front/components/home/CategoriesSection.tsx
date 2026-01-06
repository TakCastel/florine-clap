'use client'

import { useEffect, useState, useMemo, useRef } from 'react'
import CategoryCard from '@/components/CategoryCard'
import { motion, useScroll, useTransform, useInView } from 'framer-motion'
import { HomeSettings, getImageUrl, getAllFilms, getAllMediations, getAllVideoArts, getAllActus } from '@/lib/directus'

interface CategoriesSectionProps {
  homeSettings?: HomeSettings | null
}

export default function CategoriesSection({ homeSettings }: CategoriesSectionProps) {
  const [isMobile, setIsMobile] = useState(false)
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null)
  const [randomImages, setRandomImages] = useState({
    films: '',
    mediations: '',
    'video-art': '',
    actus: ''
  })
  const [isReady, setIsReady] = useState(false)
  const sectionRef = useRef<HTMLElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const isInView = useInView(sectionRef, { once: true, margin: "-100px" })
  const intervalsRef = useRef<NodeJS.Timeout[]>([])
  const timeoutsRef = useRef<NodeJS.Timeout[]>([])
  
  // Variantes d'animation pour l'effet de fade in séquentiel
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15, // Délai plus court entre chaque card
        delayChildren: 0.05,
      },
    },
  }

  const getCardVariants = (index: number) => {
    const skewAngle = isMobile ? 0 : -3 // Pas de skew en mobile, -3deg en desktop
    const zIndexValue = 4 - index // z-index décroissant : 4, 3, 2, 1
    return {
      hidden: {
        opacity: 0,
        y: 20,
        skewX: `${skewAngle}deg`,
        zIndex: zIndexValue,
      },
      visible: {
        opacity: 1,
        y: 0,
        skewX: `${skewAngle}deg`,
        zIndex: zIndexValue,
        transition: {
          duration: 0.8,
          ease: [0.215, 0.61, 0.355, 1] as any, // easeOutCubic
        },
      },
    }
  }

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768)
    }
    
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  useEffect(() => {
    // Nettoyer les intervalles et timeouts précédents
    intervalsRef.current.forEach(interval => clearInterval(interval))
    timeoutsRef.current.forEach(timeout => clearTimeout(timeout))
    intervalsRef.current = []
    timeoutsRef.current = []

    // Récupérer les images depuis les contenus de chaque catégorie
    const fetchCategoryImage = async (category: 'films' | 'mediations' | 'video-art' | 'actus') => {
      try {
        let newImage = ''
        
        if (category === 'films') {
          const films = await getAllFilms()
          // Filtrer les films qui ont au moins une image (string UUID ou objet)
          const filmsWithImages = films.filter(film => 
            (film.heading && (typeof film.heading === 'object' || typeof film.heading === 'string')) || 
            (film.image && (typeof film.image === 'object' || typeof film.image === 'string'))
          )
          if (filmsWithImages.length > 0) {
            const randomFilm = filmsWithImages[Math.floor(Math.random() * filmsWithImages.length)]
            newImage = getImageUrl(randomFilm.heading) || getImageUrl(randomFilm.image) || ''
          }
        } else if (category === 'mediations') {
          const mediations = await getAllMediations()
          // Filtrer les médiations qui ont une image de couverture
          const mediationsWithImages = mediations.filter(mediation => 
            mediation.cover && (typeof mediation.cover === 'object' || typeof mediation.cover === 'string')
          )
          if (mediationsWithImages.length > 0) {
            const randomMediation = mediationsWithImages[Math.floor(Math.random() * mediationsWithImages.length)]
            newImage = getImageUrl(randomMediation.cover) || ''
          }
        } else if (category === 'video-art') {
          const videosArt = await getAllVideoArts()
          // Filtrer les vidéos qui ont une image
          const videosWithImages = videosArt.filter(video => 
            video.image && (typeof video.image === 'object' || typeof video.image === 'string')
          )
          if (videosWithImages.length > 0) {
            const randomVideoArt = videosWithImages[Math.floor(Math.random() * videosWithImages.length)]
            newImage = getImageUrl(randomVideoArt.image) || ''
          }
        } else if (category === 'actus') {
          const actus = await getAllActus()
          // Filtrer les actualités qui ont une image de couverture
          const actusWithImages = actus.filter(actu => 
            actu.cover && (typeof actu.cover === 'object' || typeof actu.cover === 'string')
          )
          if (actusWithImages.length > 0) {
            const randomActu = actusWithImages[Math.floor(Math.random() * actusWithImages.length)]
            newImage = getImageUrl(randomActu.cover) || ''
          }
        }

        // Ne mettre à jour que si on a une nouvelle image valide
        // Si l'image est vide, on garde l'image précédente pour éviter les transitions inutiles
        if (newImage) {
          setRandomImages(prev => ({
            ...prev,
            [category]: newImage
          }))
        }
      } catch (error) {
        console.error(`Erreur lors de la récupération de l'image pour ${category}:`, error)
      }
    }

    // Fonction pour récupérer toutes les images initiales
    const fetchAllCategoryImages = async () => {
      try {
        // Films : utiliser heading en priorité, sinon image
        const films = await getAllFilms()
        const filmsWithImages = films.filter(film => 
          (film.heading && (typeof film.heading === 'object' || typeof film.heading === 'string')) || 
          (film.image && (typeof film.image === 'object' || typeof film.image === 'string'))
        )
        const randomFilm = filmsWithImages.length > 0 
          ? filmsWithImages[Math.floor(Math.random() * filmsWithImages.length)] 
          : null
        const filmImage = randomFilm 
          ? (getImageUrl(randomFilm.heading) || getImageUrl(randomFilm.image) || null)
          : null

        // Médiations : utiliser cover
        const mediations = await getAllMediations()
        const mediationsWithImages = mediations.filter(mediation => 
          mediation.cover && (typeof mediation.cover === 'object' || typeof mediation.cover === 'string')
        )
        const randomMediation = mediationsWithImages.length > 0 
          ? mediationsWithImages[Math.floor(Math.random() * mediationsWithImages.length)] 
          : null
        const mediationImage = randomMediation?.cover ? getImageUrl(randomMediation.cover) : null

        // Videos-art : utiliser image
        const videosArt = await getAllVideoArts()
        const videosWithImages = videosArt.filter(video => 
          video.image && (typeof video.image === 'object' || typeof video.image === 'string')
        )
        const randomVideoArt = videosWithImages.length > 0 
          ? videosWithImages[Math.floor(Math.random() * videosWithImages.length)] 
          : null
        const videoArtImage = randomVideoArt?.image ? getImageUrl(randomVideoArt.image) : null

        // Actus : utiliser cover
        const actus = await getAllActus()
        const actusWithImages = actus.filter(actu => 
          actu.cover && (typeof actu.cover === 'object' || typeof actu.cover === 'string')
        )
        const randomActu = actusWithImages.length > 0 
          ? actusWithImages[Math.floor(Math.random() * actusWithImages.length)] 
          : null
        const actuImage = randomActu?.cover ? getImageUrl(randomActu.cover) : null

        setRandomImages({
          films: filmImage || '',
          mediations: mediationImage || '',
          'video-art': videoArtImage || '',
          actus: actuImage || ''
        })
        
        // Petit délai pour s'assurer que les images commencent à charger avant l'animation
        setTimeout(() => {
          setIsReady(true)
        }, 100)
      } catch (error) {
        console.error('Erreur lors de la récupération des images de catégories:', error)
        setRandomImages({
          films: '',
          mediations: '',
          'video-art': '',
          actus: ''
        })
        setIsReady(true) // Toujours marquer comme prêt même en cas d'erreur
      }
    }

    // Charger les images initiales
    fetchAllCategoryImages()

    // Créer un intervalle pour chaque carte avec un délai décalé
    // Carte 0 (Films) : commence après 0ms, puis toutes les 10 secondes
    // Carte 1 (Médiations) : commence après 2500ms, puis toutes les 10 secondes
    // Carte 2 (Videos-art) : commence après 5000ms, puis toutes les 10 secondes
    // Carte 3 (Actus) : commence après 7500ms, puis toutes les 10 secondes
    const categories: Array<'films' | 'mediations' | 'video-art' | 'actus'> = ['films', 'mediations', 'video-art', 'actus']
    
    categories.forEach((category, index) => {
      const delay = index * 2500 // 2.5 secondes entre chaque carte pour un effet plus fluide
      const intervalTime = 10000 // 10 secondes entre chaque changement (plus long pour laisser le temps aux transitions)
      
      // Premier changement après le délai initial
      const firstTimeout = setTimeout(() => {
        fetchCategoryImage(category)
        
        // Ensuite, changer toutes les 10 secondes
        const interval = setInterval(() => {
          fetchCategoryImage(category)
        }, intervalTime)
        
        intervalsRef.current.push(interval)
      }, delay)
      
      // Stocker le timeout pour le nettoyer
      timeoutsRef.current.push(firstTimeout)
    })

    return () => {
      intervalsRef.current.forEach(interval => clearInterval(interval))
      timeoutsRef.current.forEach(timeout => clearTimeout(timeout))
      intervalsRef.current = []
      timeoutsRef.current = []
    }
  }, [homeSettings])

  const cards = useMemo(() => [
    {
      href: '/films',
      title: 'Films',
      description: 'Mes créations cinématographiques, mes courts-métrages et mes projets artistiques',
      linkText: 'Découvrir',
      imageSrc: randomImages.films,
      imageAlt: 'Découvrir mes films',
      theme: 'films' as const,
      bgColor: 'bg-theme-films/85',
      hoverBgColor: 'group-hover:bg-theme-films/90',
      textColor: 'text-theme-films-text',
      linkColor: 'text-theme-films-text/80',
      hoverLinkColor: 'hover:text-theme-films-text',
      underlineClass: 'after:bg-theme-films-text'
    },
    {
      href: '/mediations',
      title: 'Médiations',
      description: 'Explorez mes médiations de médiation culturelle et mes formations pour tous publics',
      linkText: 'Découvrir',
      imageSrc: randomImages.mediations,
      imageAlt: 'Découvrir mes médiations',
      theme: 'mediations' as const,
      bgColor: 'bg-theme-mediations/85',
      hoverBgColor: 'group-hover:bg-theme-mediations/90',
      textColor: 'text-theme-mediations-text',
      linkColor: 'text-theme-mediations-text/80',
      hoverLinkColor: 'hover:text-theme-mediations-text',
      underlineClass: 'after:bg-theme-mediations-text'
    },
    {
      href: '/videos-art',
      title: 'Vidéos/art',
      description: 'Mes créations vidéo artistiques et mes projets expérimentaux',
      linkText: 'Découvrir',
      imageSrc: randomImages['video-art'],
      imageAlt: 'Découvrir mes vidéos artistiques',
      theme: 'videos-art' as const,
      bgColor: 'bg-theme-videos-art/85',
      hoverBgColor: 'group-hover:bg-theme-videos-art/90',
      textColor: 'text-theme-videos-art-text',
      linkColor: 'text-theme-videos-art-text/80',
      hoverLinkColor: 'hover:text-theme-videos-art-text',
      underlineClass: 'after:bg-theme-videos-art-text'
    },
    {
      href: '/actus',
      title: 'Actualités',
      description: 'Suivez mes dernières actualités, événements et projets en cours',
      linkText: 'Lire',
      imageSrc: randomImages.actus,
      imageAlt: 'Découvrir mes actualités',
      theme: 'actus' as const,
      bgColor: 'bg-theme-actus/85',
      hoverBgColor: 'group-hover:bg-theme-actus/90',
      textColor: 'text-theme-actus-text',
      linkColor: 'text-theme-actus-text/80',
      hoverLinkColor: 'hover:text-theme-actus-text',
      underlineClass: 'after:bg-theme-actus-text'
    }
  ], [randomImages])

  return (
    <section 
      ref={sectionRef}
      id="categories-section" 
      className="w-full min-h-screen flex items-center justify-center py-12 md:py-16 overflow-hidden relative border-b border-black/5 bg-gradient-to-br from-white to-gray-100/50"
      style={{ position: 'relative' }}
    >
      <div className="w-full max-w-[1600px] px-6 md:px-10 lg:px-16 relative z-10">
        <motion.div 
          ref={containerRef}
          className="w-full h-[400px] md:h-[450px] lg:h-[500px] flex flex-col md:flex-row gap-3 md:gap-4 items-stretch"
          style={{ position: 'relative' }}
          variants={containerVariants}
          initial="hidden"
          animate={isInView && isReady ? "visible" : "hidden"}
        >
          {cards.map((card, index) => {
            const skewAngle = isMobile ? 0 : -3 // Pas de skew en mobile, -3deg en desktop
            return (
            <motion.div 
              key={index} 
              className="relative flex-1 md:hover:flex-[1.5] transition-all duration-500 ease-out h-full group/card"
              variants={getCardVariants(index)}
              onMouseEnter={() => setHoveredIndex(index)}
              onMouseLeave={() => setHoveredIndex(null)}
              whileHover={{
                zIndex: 50,
                transition: { 
                  duration: 0.4,
                  ease: [0.16, 1, 0.3, 1] as [number, number, number, number]
                },
              }}
              style={{
                transform: `skewX(${skewAngle}deg)`,
              }}
            >
              <CategoryCard
                href={card.href}
                title={card.title}
                description={card.description}
                linkText={card.linkText}
                imageSrc={card.imageSrc}
                imageAlt={card.imageAlt}
                theme={card.theme}
                bgColor={card.bgColor}
                hoverBgColor={card.hoverBgColor}
                textColor={card.textColor}
                linkColor={card.linkColor}
                hoverLinkColor={card.hoverLinkColor}
                underlineClass={card.underlineClass}
                priority={index === 0}
              />
            </motion.div>
            )
          })}
        </motion.div>
      </div>
    </section>
  )
}