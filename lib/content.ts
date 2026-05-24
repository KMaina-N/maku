// ─── TYPES ────────────────────────────────────────────────────────────────────

export type Release = {
  id: string
  title: string
  type: 'ALBUM' | 'EP' | 'SINGLE'
  year: number
  description: string
  coverUrl: string
  featured?: boolean
}

export type LivePhoto = {
  id: string
  src: string
  alt: string
  className?: string
}

export type NavLink = {
  label: string
  href: string
}

// ─── STATIC CONTENT ───────────────────────────────────────────────────────────

export const NAV_LINKS: NavLink[] = [
  { label: 'Music',   href: '#music' },
  { label: 'Story',   href: 'story' },
  { label: 'Contact', href: '#contact' },
]

export const HERO_CONTENT = {
  eyebrow:   'HI THERE, I AM',
  name:      'MAKU',
  tagline:   'A soulful singer and performer blending deep storytelling, live grooves, and global sounds.',
  nowPlaying: { title: 'Tamu (Cover)', label: 'NOW PLAYING' },
}

export const RELEASES: Release[] = [
  {
    id:          'midnight-echoes',
    title:       'Midnight Echoes',
    type:        'ALBUM',
    year:        2024,
    description: 'A cinematic odyssey between dusk and dawn.',
    coverUrl:    '/images/midnight-echoes.jpg',
    featured:    true,
  },
  {
    id:          'shattered-glass',
    title:       'Shattered Glass',
    type:        'SINGLE',
    year:        2024,
    description: 'An intimate exploration of reflection and identity.',
    coverUrl:    '/images/shattered-glass.jpg',
  },
  {
    id:          'neon-pulse',
    title:       'Neon Pulse',
    type:        'EP',
    year:        2023,
    description: 'Energetic, synth-driven narratives from the city night.',
    coverUrl:    '/images/neon-pulse.jpg',
  },
]

export const LIVE_PHOTOS: LivePhoto[] = [
  { id: 'lp1', src: '/images/live-guitar.jpg', alt: 'Elara playing acoustic guitar',        className: 'row-span-2' },
  { id: 'lp2', src: '/images/live-mic.jpg',    alt: 'Elara performing live with microphone', className: '' },
  { id: 'lp3', src: '/images/live-keys.jpg',   alt: 'Keys player on stage',                  className: '' },
  { id: 'lp4', src: '/images/live-arena.jpg',  alt: 'Arena concert with dramatic lighting',  className: 'col-span-2' },
]

export const FOOTER_LINKS = [
  { label: 'Instagram', href: 'https://instagram.com' },
  { label: 'Spotify',   href: 'https://spotify.com' },
]