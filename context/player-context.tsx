'use client'

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useRef,
  useCallback,
  ReactNode,
} from 'react'

// ── Types Mapped to Local Audio Files ─────────────────────────────────────────

export type Track = {
  id: string
  title: string
  album: string
  durationMs: number
  audioUrl: string    // Path to asset within /public (e.g., '/audio/lorem.mp3')
  coverUrl: string    // Local file path or verified network image token
}

export type PlayerContextValue = {
  // State
  tracks: Track[]
  activeTrack: Track | null
  isPlaying: boolean
  position: number      // ms
  duration: number      // ms
  volume: number        // 0–1
  muted: boolean
  isReady: boolean

  // Actions
  loadTracks: (tracks: Track[]) => void
  playTrack: (track: Track) => void
  togglePlay: () => void
  next: () => void
  prev: () => void
  seek: (pct: number) => void // Expects layout slider float context (0 to 1)
  setVolume: (v: number) => void
  toggleMute: () => void
}

// ── Context Setup ─────────────────────────────────────────────────────────────

const PlayerContext = createContext<PlayerContextValue | null>(null)

export function usePlayer(): PlayerContextValue {
  const ctx = useContext(PlayerContext)
  if (!ctx) throw new Error('usePlayer must be used inside <PlayerProvider>')
  return ctx
}

// ── Provider Engine ───────────────────────────────────────────────────────────

export function PlayerProvider({ children }: { children: ReactNode }) {
  const [tracks, setTracks] = useState<Track[]>([])
  const [activeTrack, setActiveTrack] = useState<Track | null>(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [position, setPosition] = useState(0)
  const [duration, setDuration] = useState(0)
  const [volume, setVolumeState] = useState(0.8)
  const [muted, setMuted] = useState(false)
  const [prevVol, setPrevVol] = useState(0.8)
  const [isReady, setIsReady] = useState(false)

  // Native HTML5 Audio elements run smoothly directly inside standard React references
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const tickerRef = useRef<ReturnType<typeof setInterval> | null>(null)

  // Keep ref values in sync with the loop to eliminate closure state drift
  const stateRef = useRef({ tracks, activeTrack, volume, isPlaying, duration })
  useEffect(() => {
    stateRef.current = { tracks, activeTrack, volume, isPlaying, duration }
  }, [tracks, activeTrack, volume, isPlaying, duration])

  // ── High Accuracy Sync Ticker ───────────────────────────────────────────────
  const clearTicker = useCallback(() => {
    if (tickerRef.current) clearInterval(tickerRef.current)
  }, [])

  const startTicker = useCallback(() => {
    clearTicker()
    tickerRef.current = setInterval(() => {
      const audio = audioRef.current
      if (!audio) return
      
      setPosition(Math.floor(audio.currentTime * 1000))
      if (isFinite(audio.duration)) {
        setDuration(Math.floor(audio.duration * 1000))
      }
    }, 200)
  }, [clearTicker])

  // ── Initialize Local Core Engine ────────────────────────────────────────────
  useEffect(() => {
    const audio = new Audio()
    audio.volume = volume
    audio.preload = 'auto'
    audioRef.current = audio
    setIsReady(true)

    const onEnded = () => {
      clearTicker()
      const { tracks: currentTracks, activeTrack: currentActive } = stateRef.current
      const idx = currentTracks.findIndex((t) => t.id === currentActive?.id)
      const nextTrack = currentTracks[idx + 1]
      
      if (nextTrack) {
        playTrackFn(nextTrack)
      } else {
        setIsPlaying(false)
        setPosition(0)
      }
    }

    const onWaiting = () => {} // Optional: map hook loading states here
    const onCanPlay = () => {}
    const onError = () => {
      console.error("Local file interface runtime error processing file route pointer.")
    }

    audio.addEventListener('ended', onEnded)
    audio.addEventListener('waiting', onWaiting)
    audio.addEventListener('canplay', onCanPlay)
    audio.addEventListener('error', onError)

    return () => {
      audio.pause()
      audio.src = ''
      audio.removeEventListener('ended', onEnded)
      audio.removeEventListener('waiting', onWaiting)
      audio.removeEventListener('canplay', onCanPlay)
      audio.removeEventListener('error', onError)
      if (tickerRef.current) clearInterval(tickerRef.current)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // ── Core Play Execution Functional Engine ───────────────────────────────────
  const playTrackFn = useCallback((track: Track) => {
    const audio = audioRef.current
    if (!audio) return

    audio.pause()
    audio.src = track.audioUrl
    audio.currentTime = 0
    
    // Maintain structural volume assignments during track migration
    audio.volume = muted ? 0 : stateRef.current.volume

    setActiveTrack(track)
    setPosition(0)
    setDuration(track.durationMs || 0)
    setIsPlaying(true)

    audio.play()
      .then(() => {
        startTicker()
      })
      .catch((err) => {
        console.warn("Media interaction node state blocked initialization: ", err)
        setIsPlaying(false)
      })
  }, [muted, startTicker])

  // ── Control Pipeline Declarations ───────────────────────────────────────────

  const loadTracks = useCallback((t: Track[]) => setTracks(t), [])

  const playTrack = useCallback((track: Track) => playTrackFn(track), [playTrackFn])

  const togglePlay = useCallback(() => {
    const audio = audioRef.current
    if (!audio || !activeTrack) return

    if (isPlaying) {
      audio.pause()
      setIsPlaying(false)
      clearTicker()
    } else {
      audio.play().then(() => startTicker()).catch(console.error)
      setIsPlaying(true)
    }
  }, [activeTrack, isPlaying, clearTicker, startTicker])

  const next = useCallback(() => {
    const { tracks: currentTracks, activeTrack: currentActive } = stateRef.current
    const idx = currentTracks.findIndex((t) => t.id === currentActive?.id)
    const track = currentTracks[idx + 1]
    if (track) playTrackFn(track)
  }, [playTrackFn])

  const prev = useCallback(() => {
    const audio = audioRef.current
    if (!audio) return

    // If track is more than 3 seconds in, reset execution timeline head
    if (audio.currentTime > 3) {
      audio.currentTime = 0
      setPosition(0)
      return
    }

    const { tracks: currentTracks, activeTrack: currentActive } = stateRef.current
    const idx = currentTracks.findIndex((t) => t.id === currentActive?.id)
    const track = currentTracks[idx - 1]
    if (track) playTrackFn(track)
  }, [playTrackFn])

  const seek = useCallback((pct: number) => {
    const audio = audioRef.current
    const currentDuration = stateRef.current.duration
    if (!audio || !currentDuration) return

    const clampedPct = Math.max(0, Math.min(1, pct))
    const calculatedSeconds = clampedPct * (currentDuration / 1000)
    
    audio.currentTime = calculatedSeconds
    setPosition(Math.floor(clampedPct * currentDuration))
  }, [])

  const setVolume = useCallback((v: number) => {
    const audio = audioRef.current
    const clamped = Math.max(0, Math.min(1, v))
    
    if (audio) audio.volume = clamped
    setVolumeState(clamped)
    if (clamped > 0) setMuted(false)
  }, [])

  const toggleMute = useCallback(() => {
    const audio = audioRef.current
    if (!audio) return

    if (muted) {
      audio.volume = prevVol
      setVolumeState(prevVol)
      setMuted(false)
    } else {
      setPrevVol(volume)
      audio.volume = 0
      setVolumeState(0)
      setMuted(true)
    }
  }, [muted, volume, prevVol])

  return (
    <PlayerContext.Provider value={{
      tracks, activeTrack, isPlaying, position, duration, volume, muted, isReady,
      loadTracks, playTrack, togglePlay, next, prev, seek, setVolume, toggleMute,
    }}>
      {children}
    </PlayerContext.Provider>
  )
}