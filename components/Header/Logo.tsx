interface LogoProps {
  isHomePage?: boolean
}

export default function Logo({ isHomePage = false }: LogoProps) {
  return (
    <a 
      href="/" 
      className={`heading-main transition-colors ${
        isHomePage 
          ? 'text-theme-beige hover:text-theme-orange' 
          : 'text-theme-dark hover:text-black'
      }`}
    >
      Florine Clap
    </a>
  )
}
