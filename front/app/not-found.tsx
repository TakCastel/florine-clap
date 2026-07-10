'use client'

import Link from 'next/link'

export default function NotFound() {
  return (
    <div
      className="min-h-screen bg-theme-white text-black flex items-center justify-center px-6 md:px-10 lg:px-16"
    >
      <section className="w-full max-w-container-small mx-auto py-24 md:py-32">
        <p className="text-xs uppercase tracking-[0.22em] text-black/45 mb-4">Erreur 404</p>
        <h1 className="text-2xl md:text-4xl font-bold tracking-tight leading-tight text-black mb-6">
          Cette page est introuvable
        </h1>
        <p className="text-sm md:text-base text-black/70 leading-relaxed max-w-2xl mb-10">
          Le lien est peut-etre ancien, incomplet, ou la page a ete deplacee.
          Vous pouvez revenir a l&apos;accueil ou explorer les sections principales.
        </p>

        <nav className="flex flex-wrap items-center gap-4 md:gap-8" aria-label="Actions 404">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-black/80 hover:text-black transition-colors text-xs uppercase tracking-[0.12em]"
          >
            Retour a l&apos;accueil
          </Link>
          <Link
            href="/films"
            className="inline-flex items-center gap-2 text-black/60 hover:text-black transition-colors text-xs uppercase tracking-[0.12em]"
          >
            Films
          </Link>
          <Link
            href="/videos-art"
            className="inline-flex items-center gap-2 text-black/60 hover:text-black transition-colors text-xs uppercase tracking-[0.12em]"
          >
            Videos/Art
          </Link>
          <Link
            href="/actus"
            className="inline-flex items-center gap-2 text-black/60 hover:text-black transition-colors text-xs uppercase tracking-[0.12em]"
          >
            Actualites
          </Link>
        </nav>
      </section>
    </div>
  )
}
