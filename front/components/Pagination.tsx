import Link from 'next/link'

type Props = {
  currentPage: number
  totalPages: number
  basePath: string
}

export default function Pagination({ currentPage, totalPages, basePath }: Props) {
  // Afficher la pagination même avec une seule page pour la démo

  const getPageNumbers = () => {
    const pages = []
    const maxVisible = 5
    
    if (totalPages <= maxVisible) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i)
      }
    } else {
      if (currentPage <= 3) {
        for (let i = 1; i <= 4; i++) {
          pages.push(i)
        }
        pages.push('...')
        pages.push(totalPages)
      } else if (currentPage >= totalPages - 2) {
        pages.push(1)
        pages.push('...')
        for (let i = totalPages - 3; i <= totalPages; i++) {
          pages.push(i)
        }
      } else {
        pages.push(1)
        pages.push('...')
        for (let i = currentPage - 1; i <= currentPage + 1; i++) {
          pages.push(i)
        }
        pages.push('...')
        pages.push(totalPages)
      }
    }
    
    return pages
  }

  const pageNumbers = getPageNumbers()

  return (
    <div className="flex justify-center items-center space-x-2 mt-12">
      {/* Bouton Précédent */}
      {currentPage > 1 && (
        <Link 
          href={currentPage === 2 ? basePath : `${basePath}?page=${currentPage - 1}`}
          className="px-4 py-2 bg-black text-white hover:bg-gray-800 transition-colors"
        >
          Précédent
        </Link>
      )}

      {/* Numéros de pages */}
      {pageNumbers.map((page, index) => (
        <span key={index}>
          {page === '...' ? (
            <span className="px-2 text-orange-300">...</span>
          ) : (
            <Link
              href={page === 1 ? basePath : `${basePath}?page=${page}`}
              className={`w-10 h-10 flex items-center justify-center transition-colors ${
                page === currentPage
                  ? 'bg-black text-white'
                  : 'bg-gray-200 text-black hover:bg-gray-300'
              }`}
            >
              {page}
            </Link>
          )}
        </span>
      ))}

      {/* Bouton Suivant */}
      {currentPage < totalPages && (
        <Link 
          href={`${basePath}?page=${currentPage + 1}`}
          className="px-4 py-2 bg-black text-white hover:bg-gray-800 transition-colors"
        >
          Suivant
        </Link>
      )}
    </div>
  )
}
