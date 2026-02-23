import { useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false)
  const navigate = useNavigate()
  const location = useLocation()

  const navLinks = [
    { label: 'Como Funciona', path: '/#solucion' },
    { label: 'Ejercicios', path: '/exercises' },
    { label: 'Mi Plan', path: '/dashboard' },
  ]

  const handleNavClick = (path) => {
    setMenuOpen(false)
    if (path.startsWith('/#')) {
      if (location.pathname === '/') {
        document.getElementById(path.slice(2))?.scrollIntoView({ behavior: 'smooth' })
      } else {
        navigate('/')
        setTimeout(() => {
          document.getElementById(path.slice(2))?.scrollIntoView({ behavior: 'smooth' })
        }, 100)
      }
    } else {
      navigate(path)
    }
  }

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-border">
      <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
        {/* Logo */}
        <button
          onClick={() => navigate('/')}
          className="flex items-center gap-2 group"
        >
          <div className="w-9 h-9 rounded-full bg-gradient-to-br from-accent-orange to-accent-pink flex items-center justify-center text-white font-bold text-sm">
            PR
          </div>
          <span className="text-lg font-bold text-black hidden sm:block">
            Pre-Running
          </span>
        </button>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <button
              key={link.path}
              onClick={() => handleNavClick(link.path)}
              className="text-sm font-medium text-muted hover:text-black transition-colors"
            >
              {link.label}
            </button>
          ))}
          <button
            onClick={() => navigate('/onboarding')}
            className="px-5 py-2 rounded-full bg-gradient-to-r from-accent-orange to-accent-pink text-white text-sm font-semibold hover:scale-[1.02] transition-all duration-300"
          >
            Empezar
          </button>
        </nav>

        {/* Mobile Hamburger */}
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="md:hidden p-2 text-black"
          aria-label="Toggle menu"
        >
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
            {menuOpen ? (
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
            )}
          </svg>
        </button>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="md:hidden bg-white border-t border-border px-4 py-4 space-y-3">
          {navLinks.map((link) => (
            <button
              key={link.path}
              onClick={() => handleNavClick(link.path)}
              className="block w-full text-left text-base font-medium text-black py-2"
            >
              {link.label}
            </button>
          ))}
          <button
            onClick={() => { setMenuOpen(false); navigate('/onboarding') }}
            className="w-full px-5 py-3 rounded-xl bg-gradient-to-r from-accent-orange to-accent-pink text-white font-semibold text-center"
          >
            Empezar
          </button>
        </div>
      )}
    </header>
  )
}
