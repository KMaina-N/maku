'use client'

import { useEffect, useState } from 'react'
import { NAV_LINKS } from '@/lib/content'
import Link from 'next/link'

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${scrolled ? 'bg-elara-bg/85 md:backdrop-blur-md ' : 'bg-transparent'}`}>
      <nav className="max-w-[1280px] mx-auto px-6 lg:px-16 h-16 flex items-center justify-between gap-8" aria-label="Main navigation">
        
        {/* Logo */}
        <Link href="/" className="font-label text-[0.75rem] tracking-[0.25em] font-bold text-ink-primary hover:opacity-70 transition-opacity uppercase">
          MAKU
        </Link>

        {/* Desktop Links */}
        <div className="hidden md:flex items-center gap-10">
          {NAV_LINKS.map((link) => (
            <a key={link.href} href={link.href} className="font-label text-[0.55rem] tracking-[0.22em] text-ink-secondary hover:text-ink-primary uppercase transition-colors">
              {link.label}
            </a>
          ))}
        </div>

        {/* Mobile Menu Button */}
        <button onClick={() => setMenuOpen(!menuOpen)} className="md:hidden flex flex-col justify-center items-center w-6 h-6 gap-[5px] z-50 p-1 bg-transparent border-0 cursor-pointer" aria-expanded={menuOpen} aria-label="Toggle Navigation Menu">
          <span className={`block w-[22px] h-[1.5px] bg-white/95 transition-transform duration-300 origin-center ${menuOpen ? 'translate-y-[6.5px] rotate-45' : ''}`} />
          <span className={`block w-[22px] h-[1.5px] bg-white/95 transition-opacity duration-300 ${menuOpen ? 'opacity-0' : ''}`} />
          <span className={`block w-[22px] h-[1.5px] bg-white/95 transition-transform duration-300 origin-center ${menuOpen ? '-translate-y-[6.5px] -rotate-45' : ''}`} />
        </button>
      </nav>

      {/* Mobile Dropdown Overlay Menu */}
      <div className={`md:hidden flex flex-col bg-elara-bg/95 backdrop-blur-2xl border-b border-elara-border px-6 pb-6 overflow-hidden transition-all duration-300 ${menuOpen ? 'max-h-80 opacity-100' : 'max-h-0 opacity-0 pointer-events-none'}`} aria-hidden={!menuOpen}>
        {NAV_LINKS.map((link) => (
          <Link key={link.href} href={link.href} onClick={() => setMenuOpen(false)} className="font-label text-xs tracking-widest text-ink-secondary hover:text-ink-primary py-3.5 border-b border-elara-border/50 last:border-0 transition-colors uppercase">
            {link.label}
          </Link>
        ))}
      </div>
    </header>
  )
}