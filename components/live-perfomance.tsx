'use client'

import { useState, useEffect, useCallback } from 'react'

type PerformanceVideo = {
  id:          string
  title:       string
  venue:       string
  date:        string
  duration:    string
  thumbUrl:    string
  embedUrl:    string
  featured?:  boolean
}

const PERFORMANCES: PerformanceVideo[] = [
  {
    id:        'glastonbury-24',
    title:     'MIDNIGHT ECHOES',
    venue:     'Glastonbury Festival — Pyramid Stage',
    date:      'JUN 2024',
    duration:  '18:42',
    thumbUrl:  '/images/live-arena.jpg',
    embedUrl:  'https://www.youtube.com/embed/placeholder?autoplay=1',
    featured:  true,
  },
  {
    id:        'abyss-sessions',
    title:     'NEON PULSE',
    venue:     'The Abyss Sessions — Studio Live',
    date:      'MAR 2024',
    duration:  '12:15',
    thumbUrl:  '/images/live-studio.jpg',
    embedUrl:  'https://www.youtube.com/embed/placeholder2?autoplay=1',
  }
]

export default function LivePerformances() {
  const [activeVideo, setActiveVideo] = useState<PerformanceVideo | null>(null)

  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (e.key === 'Escape') setActiveVideo(null)
  }, [])

  useEffect(() => {
    if (activeVideo) {
      document.body.style.overflow = 'hidden'
      window.addEventListener('keydown', handleKeyDown)
    } else {
      document.body.style.overflow = ''
      window.removeEventListener('keydown', handleKeyDown)
    }
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [activeVideo, handleKeyDown])

  const featured = PERFORMANCES.find((v) => v.featured)
  const rest = PERFORMANCES.filter((v) => !v.featured)

  return (
    <section className="relative py-24 bg-[#030303] overflow-hidden">
      <p className="absolute right-6 top-10 font-label text-[12vw] font-bold text-white/[0.01] tracking-tighter select-none pointer-events-none">
        LIVE
      </p>

      <div className="relative max-w-[1280px] mx-auto px-6 lg:px-16">
        <div className="flex items-end justify-between mb-10 gap-4">
          <div>
            <p className="font-label text-[0.5rem] tracking-[0.28em] text-zinc-500 mb-2">STAGE & SCREEN</p>
            <h2 className="font-label text-[clamp(2rem,5vw,3.5rem)] font-bold tracking-tight text-white leading-none">
              LIVE PERFORMANCES
            </h2>
          </div>
          <a href="/live" className="font-label text-[0.52rem] tracking-[0.22em] text-[#00c9b1] hover:opacity-70 transition-opacity">
            VIEW ALL
          </a>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {featured && <div onClick={() => setActiveVideo(featured)} className="md:col-span-2 group relative aspect-[16/9.5] w-full bg-zinc-900 rounded overflow-hidden cursor-pointer"><div className="absolute inset-0 bg-cover bg-center transition-transform duration-700 scale-100 group-hover:scale-105" style={{ backgroundImage: `url(${featured.thumbUrl})` }} /><div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent" /><div className="absolute bottom-6 left-6 right-6 flex items-end justify-between gap-4"><div><p className="font-label text-[0.52rem] tracking-widest text-[#00c9b1] mb-1">{featured.venue}</p><h3 className="font-label text-xl font-bold tracking-wide text-white">{featured.title}</h3></div><span className="font-label text-[0.55rem] text-white/60 bg-white/5 border border-white/10 px-2 py-1 rounded">{featured.duration}</span></div></div>}
          {rest.map((v) => (
            <div key={v.id} onClick={() => setActiveVideo(v)} className="group relative aspect-[4/3] w-full bg-zinc-900 rounded overflow-hidden cursor-pointer"><div className="absolute inset-0 bg-cover bg-center transition-transform duration-700 scale-100 group-hover:scale-105" style={{ backgroundImage: `url(${v.thumbUrl})` }} /><div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-transparent" /><div className="absolute bottom-5 left-5 right-5"><p className="font-label text-[0.48rem] tracking-widest text-[#00c9b1] mb-0.5">{v.venue}</p><h3 className="font-label text-base font-bold tracking-wide text-white truncate">{v.title}</h3></div></div>
          ))}
        </div>
      </div>

      {activeVideo && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/95 backdrop-blur-md" onClick={() => setActiveVideo(null)}>
          <div className="relative w-full max-w-5xl aspect-video bg-black rounded overflow-hidden" onClick={(e) => e.stopPropagation()}>
            <iframe src={activeVideo.embedUrl} title={activeVideo.title} className="w-full h-full border-0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen />
            <button onClick={() => setActiveVideo(null)} className="absolute top-4 right-4 w-9 h-9 flex items-center justify-center rounded-full bg-black/60 text-white hover:bg-white hover:text-black transition-colors">✕</button>
          </div>
        </div>
      )}
    </section>
  )
}