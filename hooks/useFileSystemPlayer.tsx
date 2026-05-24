'use client'

import { useEffect, useRef, useState, useCallback } from 'react'

// ── Types Mapped to Local Architecture ────────────────────────────────────────

export type Track = {
  id: string
  title: string
  album: string
  durationMs: number
  audioUrl: string      // Path to your public folder asset, e.g., '/audio/lorem.mp3'
  coverUrl: string      // Local image token or verified unsplash asset
  category?: string
}

export type PlayerState = {
  currentTrack: Track | null
  queue: Track[]
  isPlaying: boolean
  isLoading: boolean
  progressMs: number
  durationMs: number
  volume: number        // 0–1
  error: string | null
}

export type UseFileSystemPlayerReturn = {
  playerState: PlayerState
  loadTracks: (tracks: Track[]) => void
  play: (track: Track) => void
  pause: () => void
  resume: () => void
  next: () => void
  prev: () => void
  seek: (ms: number) => void
  setVolume: (v: number) => void
  isReady: boolean
}

// ── Helpers ───────────────────────────────────────────────────────────────────

export function formatMs(ms: number): string {
  if (!ms || ms < 0) return '0:00'
  const totalSecs = Math.floor(ms / 1000)
  const mins = Math.floor(totalSecs / 60)
  const secs = totalSecs % 60
  return `${mins}:${secs.toString().padStart(2, '0')}`
}

const DEFAULT_STATE: PlayerState = {
  currentTrack: null,
  queue: [],
  isPlaying: false,
  isLoading: false,
  progressMs: 0,
  durationMs: 0,
  volume: 0.8,
  error: null,
}

// ── Hook Implementation ───────────────────────────────────────────────────────

export function useFileSystemPlayer(): UseFileSystemPlayerReturn {
  const [state, setState] = useState<PlayerState>(DEFAULT_STATE)
  const [isReady, setIsReady] = useState(false)

  const audioRef = useRef<HTMLAudioElement | null>(null)
  const tickerRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const stateRef = useRef(state)
  stateRef.current = state

  // ── Initialize Native HTMLAudio Node ────────────────────────────────────────
  useEffect(() => {
    const audio = new Audio()
    audio.volume = DEFAULT_STATE.volume
    audio.preload = 'auto'
    audioRef.current = audio
    setIsReady(true)

    const onEnded = () => {
      clearTicker()
      const { currentTrack, queue } = stateRef.current
      const idx = queue.findIndex((t) => t.id === currentTrack?.id)
      const nextTrack = queue[idx + 1]
      
      if (nextTrack) {
        playTrack(nextTrack)
      } else {
        setState((s) => ({ ...s, isPlaying: false, progressMs: 0 }))
      }
    }

    const onWaiting = () => setState((s) => ({ ...s, isLoading: true }))
    const onCanPlay = () => setState((s) => ({ ...s, isLoading: false }))
    const onError = () => setState((s) => ({
      ...s,
      isPlaying: false,
      isLoading: false,
      error: 'System error: Could not read local file asset from storage matrix.',
    }))

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
      clearTicker()
    }
  }, [])

  // ── High-Accuracy Dynamic Time Tracker ──────────────────────────────────────
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
    }, 200) // Lowered to 200ms for tighter slider synchronization
  }

  // ── Engine Execution Pipeline ───────────────────────────────────────────────
  function playTrack(track: Track) {
    const audio = audioRef.current
    if (!audio) return

    audio.pause()
    // Directly target the path within the /public block or api local stream
    audio.src = track.audioUrl 
    audio.volume = stateRef.current.volume
    audio.currentTime = 0

    setState((s) => ({
      ...s,
      currentTrack: track,
      isPlaying: true,
      isLoading: true,
      progressMs: 0,
      durationMs: track.durationMs,
      error: null,
    }))

    audio.play()
      .then(() => {
        setState((s) => ({ ...s, isLoading: false }))
        startTicker()
      })
      .catch((err) => {
        console.error("Local context engine blocked execution: ", err)
        setState((s) => ({
          ...s,
          isPlaying: false,
          isLoading: false,
          error: 'System interaction interrupted. Select target directly to process stream.',
        }))
      })
  }

  // ── Context Core Interface Methods ──────────────────────────────────────────

  const loadTracks = useCallback((tracks: Track[]) => {
    setState((s) => ({ ...s, queue: tracks, error: null }))
  }, [])

  const play = useCallback((track: Track) => {
    playTrack(track)
  }, [])

  const pause = useCallback(() => {
    audioRef.current?.pause()
    clearTicker()
    setState((s) => ({ ...s, isPlaying: false }))
  }, [])

  const resume = useCallback(() => {
    if (!audioRef.current) return
    audioRef.current.play().catch(console.error)
    startTicker()
    setState((s) => ({ ...s, isPlaying: true }))
  }, [])

  const next = useCallback(() => {
    const { currentTrack, queue } = stateRef.current
    const idx = queue.findIndex((t) => t.id === currentTrack?.id)
    const track = queue[idx + 1]
    if (track) playTrack(track)
  }, [])

  const prev = useCallback(() => {
    const { currentTrack, queue, progressMs } = stateRef.current
    if (progressMs > 4000) { // Restarts track if user is more than 4s deep
      if (audioRef.current) audioRef.current.currentTime = 0
      setState((s) => ({ ...s, progressMs: 0 }))
      return
    }
    const idx = queue.findIndex((t) => t.id === currentTrack?.id)
    const track = queue[idx - 1]
    if (track) playTrack(track)
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