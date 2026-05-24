'use client'

import { usePlayer } from '@/context/player-context'

// ── Icons (kept exactly from original design) ─────────────────────────────────

function PlayIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
      <path d="M8 5v14l11-7z" />
    </svg>
  )
}
function PauseIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
      <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z" />
    </svg>
  )
}
function PrevIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
      <path d="M6 6h2v12H6zm3.5 6 8.5 6V6z" />
    </svg>
  )
}
function NextIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
      <path d="M6 18l8.5-6L6 6v12zM16 6v12h2V6h-2z" />
    </svg>
  )
}
function VolumeIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path strokeLinecap="round" strokeLinejoin="round"
        d="M15.536 8.464a5 5 0 010 7.072M12 6.253v11.494M21.213 2.787a10 10 0 010 14.142M7.5 9H4.5a1 1 0 00-1 1v4a1 1 0 001 1h3l4.243 4.243A1 1 0 0013.5 18.5V5.5a1 1 0 00-1.707-.707L7.5 9z" />
    </svg>
  )
}

// ── Main ──────────────────────────────────────────────────────────────────────

export default function MiniPlayer() {
  const {
    activeTrack,
    isPlaying,
    volume,
    togglePlay,
    next,
    prev,
    setVolume,
  } = usePlayer()

  // Don't render until a track has been selected
  if (!activeTrack) return null

  return (
    <div className="sticky bottom-6 w-full z-50">
      <div
        className="mx-4 sm:mx-6 md:mx-auto max-w-3xl
                   flex items-center justify-between gap-6
                   px-5 py-3.5
                   bg-zinc-900/80 backdrop-blur-md
                   border border-zinc-800 rounded-full shadow-2xl
                   transition-all duration-300"
        role="region"
        aria-label="Now playing player"
      >
        {/* ── Left: vinyl disc + track info ── */}
        <div className="flex items-center gap-3.5 min-w-0">
          {/* Vinyl disc — uses album art, spins while playing */}
          <div
            className={[
              'w-10 h-10 rounded-full flex-shrink-0 overflow-hidden',
              'border border-white/10 shadow-inner',
              isPlaying ? 'animate-spin [animation-duration:8s]' : '',
            ].join(' ')}
            aria-hidden="true"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={activeTrack.coverUrl}
              alt=""
              className="w-full h-full object-cover rounded-full"
            />
          </div>

          {/* Track meta */}
          <div className="flex flex-col min-w-0">
            <span className="text-[0.65rem] font-medium tracking-wider text-zinc-400 uppercase">
              NOW PLAYING
            </span>
            <span className="text-[0.875rem] font-semibold text-white truncate">
              {activeTrack.title}
            </span>
          </div>
        </div>

        {/* ── Centre: transport controls ── */}
        <div className="flex items-center gap-3 flex-shrink-0" aria-label="Playback controls">
          <button
            onClick={prev}
            className="text-zinc-400 hover:text-white transition-colors p-1"
            aria-label="Previous track"
          >
            <PrevIcon />
          </button>

          <button
            onClick={togglePlay}
            aria-label={isPlaying ? 'Pause' : 'Play'}
            className="flex items-center justify-center w-9 h-9 rounded-full
                       bg-white text-black hover:bg-zinc-200
                       hover:scale-105 active:scale-95 transition-all duration-200 shadow-md"
          >
            {isPlaying ? <PauseIcon /> : <PlayIcon />}
          </button>

          <button
            onClick={next}
            className="text-zinc-400 hover:text-white transition-colors p-1"
            aria-label="Next track"
          >
            <NextIcon />
          </button>
        </div>

        {/* ── Right: volume + EQ bars ── */}
        <div className="hidden md:flex items-center gap-4 flex-1 max-w-[240px] justify-end">
          <div className="flex flex-col gap-2 w-full">
            {/* Volume slider — functional, styled to match original */}
            <div className="flex items-center gap-2 text-zinc-500">
              <VolumeIcon />
              <div className="relative flex-1 h-1 bg-zinc-800 rounded-full overflow-hidden">
                <div
                  className="h-full bg-[#ccff00] rounded-full transition-[width] duration-150"
                  style={{ width: `${volume * 100}%` }}
                />
                <input
                  type="range"
                  min={0} max={1} step={0.01}
                  value={volume}
                  onChange={(e) => setVolume(parseFloat(e.target.value))}
                  aria-label="Volume"
                  className="absolute inset-0 w-full opacity-0 cursor-pointer"
                />
              </div>
            </div>
          </div>

          {/* Equaliser bars — visible only when playing */}
          {isPlaying && (
            <div
              className="flex items-end gap-[3px] h-4 w-5 flex-shrink-0 mb-1"
              aria-hidden="true"
            >
              <span className="w-[3px] bg-white rounded-full origin-bottom"
                style={{ height: '60%',  animation: 'pulseBar 0.6s 0s   ease-in-out infinite' }} />
              <span className="w-[3px] bg-white rounded-full origin-bottom"
                style={{ height: '100%', animation: 'pulseBar 0.8s 0.1s ease-in-out infinite' }} />
              <span className="w-[3px] bg-white rounded-full origin-bottom"
                style={{ height: '40%',  animation: 'pulseBar 0.7s 0.2s ease-in-out infinite' }} />
            </div>
          )}
        </div>
      </div>

      {/* <style>{`
        @keyframes pulseBar {
          0%, 100% { transform: scaleY(0.35); }
          50%       { transform: scaleY(1); }
        }
      `}</style> */}
    </div>
  )
}