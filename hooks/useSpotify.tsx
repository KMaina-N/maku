'use client'

// ─── useSpotify ────────────────────────────────────────────────────────────────
// In-app audio playback using Spotify preview_url MP3s (30s).
// Audio is streamed through our own /api/spotify/preview proxy to avoid CORS.
//
// Full playback (full songs, not just previews) requires:
//   - Spotify Web Playback SDK  (Premium users only)
//   - User OAuth login (Authorization Code flow)
// That can be layered in later without changing this hook's interface.

import { useEffect, useRef, useState, useCallback } from 'react'

// ── Types ─────────────────────────────────────────────────────────────────────

export type SpotifyTrack = {
  id:          string
  title:       string
  album:       string
  durationMs:  number
  previewUrl:  string | null  // 30s MP3 from Spotify CDN; null ~15% of tracks
  spotifyUri:  string
  spotifyId:   string
  coverUrl:    string
}

export type PlayerState = {
  currentTrack:  SpotifyTrack | null
  queue:         SpotifyTrack[]
  isPlaying:     boolean
  isLoading:     boolean       // buffering / fetching
  progressMs:    number
  durationMs:    number
  volume:        number        // 0–1
  error:         string | null
}

export type UseSpotifyReturn = {
  playerState:  PlayerState
  loadTracks:   (tracks: SpotifyTrack[]) => void
  play:         (track: SpotifyTrack) => void
  pause:        () => void
  resume:       () => void
  next:         () => void
  prev:         () => void
  seek:         (ms: number) => void
  setVolume:    (v: number) => void
  isReady:      boolean
}

// ── Helpers ───────────────────────────────────────────────────────────────────

export function formatMs(ms: number): string {
  if (!ms || ms < 0) return '0:00'
  const totalSecs = Math.floor(ms / 1000)
  const mins      = Math.floor(totalSecs / 60)
  const secs      = totalSecs % 60
  return `${mins}:${secs.toString().padStart(2, '0')}`
}

// Proxy Spotify CDN URL through our server to avoid CORS
function proxyUrl(previewUrl: string): string {
  return `/api/spotify/preview?url=${encodeURIComponent(previewUrl)}`
}

// ── Default state ─────────────────────────────────────────────────────────────

const DEFAULT_STATE: PlayerState = {
  currentTrack: null,
  queue:        [],
  isPlaying:    false,
  isLoading:    false,
  progressMs:   0,
  durationMs:   0,
  volume:       0.8,
  error:        null,
}

// ── Hook ──────────────────────────────────────────────────────────────────────

export function useSpotify(): UseSpotifyReturn {
  const [state,   setState]   = useState<PlayerState>(DEFAULT_STATE)
  const [isReady, setIsReady] = useState(false)

  const audioRef    = useRef<HTMLAudioElement | null>(null)
  const tickerRef   = useRef<ReturnType<typeof setInterval> | null>(null)
  const stateRef    = useRef(state)
  stateRef.current  = state

  // ── Init HTMLAudioElement ─────────────────────────────────────────────────
  useEffect(() => {
    const audio       = new Audio()
    audio.volume      = DEFAULT_STATE.volume
    audio.preload     = 'auto'
    audioRef.current  = audio
    setIsReady(true)

    const onEnded = () => {
      clearTicker()
      // Auto-advance to next track in queue
      const { currentTrack, queue } = stateRef.current
      const idx = queue.findIndex((t) => t.id === currentTrack?.id)
      const next = queue[idx + 1]
      if (next && next.previewUrl) {
        playTrack(next)
      } else {
        setState((s) => ({ ...s, isPlaying: false, progressMs: 0 }))
      }
    }

    const onWaiting  = () => setState((s) => ({ ...s, isLoading: true }))
    const onCanPlay  = () => setState((s) => ({ ...s, isLoading: false }))
    const onError    = () => setState((s) => ({
      ...s,
      isPlaying: false,
      isLoading: false,
      error: 'Could not load audio. This preview may be unavailable.',
    }))

    audio.addEventListener('ended',   onEnded)
    audio.addEventListener('waiting', onWaiting)
    audio.addEventListener('canplay', onCanPlay)
    audio.addEventListener('error',   onError)

    return () => {
      audio.pause()
      audio.src = ''
      audio.removeEventListener('ended',   onEnded)
      audio.removeEventListener('waiting', onWaiting)
      audio.removeEventListener('canplay', onCanPlay)
      audio.removeEventListener('error',   onError)
      clearTicker()
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // ── Progress ticker ───────────────────────────────────────────────────────
  function clearTicker() {
    if (tickerRef.current) clearInterval(tickerRef.current)
  }

  function startTicker() {
    clearTicker()
    tickerRef.current = setInterval(() => {
      const audio = audioRef.current
      if (!audio) return
      setState((s) => ({
        ...s,
        progressMs: Math.floor(audio.currentTime * 1000),
        durationMs: isFinite(audio.duration) ? Math.floor(audio.duration * 1000) : s.durationMs,
      }))
    }, 250)
  }

  // ── Internal play ─────────────────────────────────────────────────────────
  function playTrack(track: SpotifyTrack) {
    const audio = audioRef.current
    if (!audio) return

    if (!track.previewUrl) {
      setState((s) => ({
        ...s,
        currentTrack: track,
        isPlaying:    false,
        isLoading:    false,
        error:        'No preview available for this track.',
      }))
      return
    }

    audio.pause()
    audio.src         = proxyUrl(track.previewUrl)
    audio.volume      = stateRef.current.volume
    audio.currentTime = 0

    setState((s) => ({
      ...s,
      currentTrack: track,
      isPlaying:    true,
      isLoading:    true,
      progressMs:   0,
      durationMs:   track.durationMs,
      error:        null,
    }))

    audio.play()
      .then(() => {
        setState((s) => ({ ...s, isLoading: false }))
        startTicker()
      })
      .catch(() => {
        setState((s) => ({
          ...s,
          isPlaying: false,
          isLoading: false,
          error:     'Playback blocked. Tap play to try again.',
        }))
      })
  }

  // ── Public API ────────────────────────────────────────────────────────────

  const loadTracks = useCallback((tracks: SpotifyTrack[]) => {
    setState((s) => ({ ...s, queue: tracks, error: null }))
  }, [])

  const play = useCallback((track: SpotifyTrack) => {
    playTrack(track)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const pause = useCallback(() => {
    audioRef.current?.pause()
    clearTicker()
    setState((s) => ({ ...s, isPlaying: false }))
  }, [])

  const resume = useCallback(() => {
    audioRef.current?.play().catch(console.error)
    startTicker()
    setState((s) => ({ ...s, isPlaying: true }))
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const next = useCallback(() => {
    const { currentTrack, queue } = stateRef.current
    const idx   = queue.findIndex((t) => t.id === currentTrack?.id)
    const track = queue[idx + 1]
    if (track) playTrack(track)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const prev = useCallback(() => {
    const { currentTrack, queue, progressMs } = stateRef.current
    // If more than 3s in, restart current track; otherwise go to previous
    if (progressMs > 3000) {
      if (audioRef.current) audioRef.current.currentTime = 0
      setState((s) => ({ ...s, progressMs: 0 }))
      return
    }
    const idx   = queue.findIndex((t) => t.id === currentTrack?.id)
    const track = queue[idx - 1]
    if (track) playTrack(track)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const seek = useCallback((ms: number) => {
    if (!audioRef.current) return
    const clamped = Math.max(0, Math.min(ms, stateRef.current.durationMs))
    audioRef.current.currentTime = clamped / 1000
    setState((s) => ({ ...s, progressMs: clamped }))
  }, [])

  const setVolume = useCallback((v: number) => {
    const clamped = Math.max(0, Math.min(1, v))
    if (audioRef.current) audioRef.current.volume = clamped
    setState((s) => ({ ...s, volume: clamped }))
  }, [])

  return {
    playerState: state,
    loadTracks,
    play,
    pause,
    resume,
    next,
    prev,
    seek,
    setVolume,
    isReady,
  }
}