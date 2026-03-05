import HomeSkeleton from '@/components/home/HomeSkeleton'

/**
 * Affiché immédiatement au début de toute navigation (surtout vers /).
 * Évite de rester sur l'ancienne page pendant le chargement.
 */
export default function Loading() {
  return <HomeSkeleton />
}
