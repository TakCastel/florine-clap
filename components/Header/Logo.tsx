interface LogoProps {
  isHomePage?: boolean
}

export default function Logo({ isHomePage = false }: LogoProps) {
  return (
    <a 
      href="/" 
      className={`text-2xl font-bold font-display transition-colors ${
        isHomePage 
          ? 'text-theme-beige hover:text-theme-orange' 
          : 'text-theme-dark hover:text-black'
      }`}
    >
      Florine Clap
    </a>
  )
}
