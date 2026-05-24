'use client'

// ─── PlayerContext ─────────────────────────────────────────────────────────────
// Single source of truth for the Spotify embed player.
// Both MusicCatalogue (full list) and MiniPlayer (sticky bar) consume this.
// The hidden iframe lives here so it persists when navigating between sections.

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useRef,
  useCallback,
  ReactNode,
} from 'react'

// ── Types ─────────────────────────────────────────────────────────────────────

export type Track = {
  id:         string
  title:      string
  album:      string
  durationMs: number
  spotifyUri: string
  spotifyId:  string
  coverUrl:   string
}

export type PlayerContextValue = {
  // State
  tracks:      Track[]
  activeTrack: Track | null
  isPlaying:   boolean
  position:    number      // ms
  duration:    number      // ms
  volume:      number      // 0–1
  muted:       boolean
  isReady:     boolean

  // Actions
  loadTracks:  (tracks: Track[]) => void
  playTrack:   (track: Track) => void
  togglePlay:  () => void
  next:        () => void
  prev:        () => void
  seek:        (pct: number) => void
  setVolume:   (v: number) => void
  toggleMute:  () => void
}

// ── Context ───────────────────────────────────────────────────────────────────

const PlayerContext = createContext<PlayerContextValue | null>(null)

export function usePlayer(): PlayerContextValue {
  const ctx = useContext(PlayerContext)
  if (!ctx) throw new Error('usePlayer must be used inside <PlayerProvider>')
  return ctx
}

// ── Provider ──────────────────────────────────────────────────────────────────

export function PlayerProvider({ children }: { children: ReactNode }) {
  const [tracks,      setTracks]      = useState<Track[]>([])
  const [activeTrack, setActiveTrack] = useState<Track | null>(null)
  const [isPlaying,   setIsPlaying]   = useState(false)
  const [position,    setPosition]    = useState(0)
  const [duration,    setDuration]    = useState(0)
  const [volume,      setVolumeState] = useState(0.8)
  const [muted,       setMuted]       = useState(false)
  const [prevVol,     setPrevVol]     = useState(0.8)
  const [isReady,     setIsReady]     = useState(false)

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const controllerRef = useRef<any>(null)
  const iframeRef     = useRef<HTMLDivElement>(null)

  // ── Load Spotify iFrame API script once ────────────────────────────────
  useEffect(() => {
    if (document.getElementById('spotify-iframe-api')) return
    const script  = document.createElement('script')
    script.id     = 'spotify-iframe-api'
    script.src    = 'https://open.spotify.com/embed/iframe-api/v1'
    script.async  = true
    document.head.appendChild(script)
  }, [])

  // ── Init controller for a given track ──────────────────────────────────
  const initController = useCallback((track: Track) => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const IFrameAPI = (window as any).SpotifyIframeApi
    if (!IFrameAPI || !iframeRef.current) return

    // Destroy previous controller if any
    controllerRef.current?.destroy?.()
    controllerRef.current = null
    iframeRef.current.innerHTML = ''

    IFrameAPI.createController(
      iframeRef.current,
      { uri: `spotify:track:${track.spotifyId}`, width: '100%', height: '80' },
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (ctrl: any) => {
        controllerRef.current = ctrl
        setIsReady(true)

        ctrl.addListener('ready', () => setIsReady(true))

        ctrl.addListener('playback_update', (e: {
          data: { isPaused: boolean; position: number; duration: number }
        }) => {
          setIsPlaying(!e.data.isPaused)
          setPosition(Math.floor(e.data.position * 1000))
          setDuration(Math.floor(e.data.duration * 1000))
        })
      }
    )
  }, [])

  // ── Register global SDK ready callback ─────────────────────────────────
  useEffect(() => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ;(window as any).onSpotifyIframeApiReady = (IFrameAPI: any) => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      ;(window as any).SpotifyIframeApi = IFrameAPI
      // If a track was selected before the SDK loaded, init now
      if (activeTrack) initController(activeTrack)
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeTrack, initController])

  // ── Auto-advance ────────────────────────────────────────────────────────
  useEffect(() => {
    if (duration > 0 && position >= duration - 500 && isPlaying) {
      const idx  = tracks.findIndex((t) => t.id === activeTrack?.id)
      const next = tracks[idx + 1]
      if (next) playTrackFn(next)
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [position, duration, isPlaying])

  // ── Internal play ───────────────────────────────────────────────────────
  const playTrackFn = useCallback((track: Track) => {
    setActiveTrack(track)
    setPosition(0)

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const IFrameAPI = (window as any).SpotifyIframeApi

    if (controllerRef.current) {
      controllerRef.current.loadUri(`spotify:track:${track.spotifyId}`)
      setTimeout(() => { controllerRef.current?.play(); setIsPlaying(true) }, 300)
    } else if (IFrameAPI && iframeRef.current) {
      initController(track)
      setTimeout(() => { controllerRef.current?.play(); setIsPlaying(true) }, 800)
    }
    // else: onSpotifyIframeApiReady will handle it once script loads
  }, [initController])

  // ── Public actions ──────────────────────────────────────────────────────

  const loadTracks = useCallback((t: Track[]) => setTracks(t), [])

  const playTrack = useCallback((track: Track) => playTrackFn(track), [playTrackFn])

  const togglePlay = useCallback(() => {
    if (!controllerRef.current) return
    if (isPlaying) { controllerRef.current.pause(); setIsPlaying(false) }
    else           { controllerRef.current.play();  setIsPlaying(true)  }
  }, [isPlaying])

  const next = useCallback(() => {
    const idx   = tracks.findIndex((t) => t.id === activeTrack?.id)
    const track = tracks[idx + 1]
    if (track) playTrackFn(track)
  }, [tracks, activeTrack, playTrackFn])

  const prev = useCallback(() => {
    if (position > 3000) {
      controllerRef.current?.seek(0)
      setPosition(0)
      return
    }
    const idx   = tracks.findIndex((t) => t.id === activeTrack?.id)
    const track = tracks[idx - 1]
    if (track) playTrackFn(track)
  }, [tracks, activeTrack, position, playTrackFn])

  const seek = useCallback((pct: number) => {
    if (!controllerRef.current || !duration) return
    controllerRef.current.seek(pct * (duration / 1000))
    setPosition(Math.floor(pct * duration))
  }, [duration])

  const setVolume = useCallback((v: number) => {
    const clamped = Math.max(0, Math.min(1, v))
    controllerRef.current?.setVolume(clamped)
    setVolumeState(clamped)
    if (clamped > 0) setMuted(false)
  }, [])

  const toggleMute = useCallback(() => {
    if (muted) { setVolume(prevVol); setMuted(false) }
    else       { setPrevVol(volume); setVolume(0); setMuted(true) }
  }, [muted, volume, prevVol, setVolume])

  return (
    <PlayerContext.Provider value={{
      tracks, activeTrack, isPlaying, position, duration, volume, muted, isReady,
      loadTracks, playTrack, togglePlay, next, prev, seek, setVolume, toggleMute,
    }}>
      {children}

      {/* Hidden iframe — lives here so it never unmounts */}
      <div className="fixed w-0 h-0 overflow-hidden opacity-0 pointer-events-none" aria-hidden="true">
        <div ref={iframeRef} id="spotify-embed-target" />
      </div>
    </PlayerContext.Provider>
  )
}