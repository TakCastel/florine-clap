interface LogoProps {
  isHomePage?: boolean
}

export default function Logo({ isHomePage = false }: LogoProps) {
  return (
    <a 
      href="/" 
      className={`text-2xl font-bold hover:text-theme-orange transition-colors ${
        isHomePage ? 'text-theme-beige' : 'text-theme-dark'
      }`}
    >
      Florine Clap
    </a>
  )
}
