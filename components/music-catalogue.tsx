"use client";

import { useEffect, useState, useRef } from "react";
import { usePlayer, type Track } from "@/context/player-context";

// ── Helpers ───────────────────────────────────────────────────────────────────

function formatMs(ms: number): string {
  if (!ms || ms < 0) return "0:00";
  const totalSeconds = Math.floor(ms / 1000);
  const mins = Math.floor(totalSeconds / 60);
  const secs = totalSeconds % 60;
  return `${mins}:${String(secs).padStart(2, "0")}`;
}

// ── Icons ─────────────────────────────────────────────────────────────────────

function IconPlay({ size = 14 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 14 14" fill="currentColor">
      <path d="M3.5 2L11.5 7L3.5 12V2z" />
    </svg>
  );
}

function IconPause({ size = 14 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 14 14" fill="currentColor">
      <rect x="2.5" y="1.5" width="2.5" height="11" rx="0.5" />
      <rect x="9" y="1.5" width="2.5" height="11" rx="0.5" />
    </svg>
  );
}

function IconVolume({ muted, volume }: { muted: boolean; volume: number }) {
  const currentVol = muted ? 0 : volume;
  if (currentVol === 0) {
    return (
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M11 5L6 9H2v6h4l5 4V5z" />
        <line x1="22" y1="9" x2="16" y2="15" />
        <line x1="16" y1="9" x2="22" y2="15" />
      </svg>
    );
  }
  if (currentVol < 0.5) {
    return (
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M11 5L6 9H2v6h4l5 4V5z" />
        <path d="M15.54 8.46a5 5 0 0 1 0 7.07" />
      </svg>
    );
  }
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M11 5L6 9H2v6h4l5 4V5z" />
      <path d="M15.54 8.46a5 5 0 0 1 0 7.07" />
      <path d="M19.07 4.93a10 10 0 0 1 0 14.14" />
    </svg>
  );
}

function IconPrev() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
      <path d="M6 6h2v12H6V6zm3.5 6l8.5 6V6l-8.5 6z" />
    </svg>
  );
}

function IconNext() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
      <path d="M6 18l8.5-6L6 6v12zM16 6v12h2V6h-2z" />
    </svg>
  );
}

function EqBars() {
  return (
    <div className="flex items-end gap-[2px] h-3.5 w-4 overflow-hidden" aria-hidden="true">
      <span className="w-[2.5px] h-full bg-elara-teal rounded-full origin-bottom animate-[playingEq_0.6s_ease-in-out_infinite_alternate]" />
      <span className="w-[2.5px] h-full bg-elara-teal rounded-full origin-bottom animate-[playingEq_0.8s_ease-in-out_infinite_alternate_0.15s]" />
      <span className="w-[2.5px] h-full bg-elara-teal rounded-full origin-bottom animate-[playingEq_0.5s_ease-in-out_infinite_alternate_0.3s]" />
      <span className="w-[2.5px] h-full bg-elara-teal rounded-full origin-bottom animate-[playingEq_0.7s_ease-in-out_infinite_alternate_0.05s]" />
    </div>
  );
}

// ── Sub-Components ────────────────────────────────────────────────────────────

function SeekBar({ position, duration, onSeek }: { position: number; duration: number; onSeek: (pct: number) => void }) {
  const pct = duration > 0 ? Math.min((position / duration) * 100, 100) : 0;
  const barRef = useRef<HTMLDivElement>(null);

  const handleTimelineInteraction = (clientX: number) => {
    if (!barRef.current) return;
    const rect = barRef.current.getBoundingClientRect();
    const relativeX = clientX - rect.left;
    const calculatedPct = Math.max(0, Math.min(relativeX / rect.width, 1));
    onSeek(calculatedPct);
  };

  return (
    <div
      ref={barRef}
      className="group relative h-1 w-full bg-zinc-800/80 rounded-full cursor-pointer flex items-center"
      onClick={(e) => handleTimelineInteraction(e.clientX)}
      role="slider"
      tabIndex={0}
      aria-label="Audio timeline control slider"
      aria-valuenow={Math.round(pct)}
      aria-valuemin={0}
      aria-valuemax={100}
      onKeyDown={(e) => {
        if (!duration) return;
        if (e.key === "ArrowRight") onSeek(Math.min((position + 5000) / duration, 1));
        if (e.key === "ArrowLeft") onSeek(Math.max((position - 5000) / duration, 0));
      }}
    >
      <div className="h-full bg-elara-teal rounded-full relative transition-[width] duration-150 ease-out" style={{ width: `${pct}%` }}>
        <span className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/2 w-2.5 h-2.5 rounded-full bg-white opacity-0 group-hover:opacity-100 transition-opacity shadow-[0_0_8px_rgba(255,255,255,0.8)]" />
      </div>
    </div>
  );
}

// ── Hardcoded Local Matrix Catalog (10 Items) ─────────────────────────────────

const LOCAL_CATALOGUE: Track[] = [
  { id: "01", title: "Lorem Ipsum Dolor", album: "Sit Amet Consectetur", durationMs: 180000, audioUrl: "/audio/track-1.mp3", coverUrl: "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?q=80&w=600&auto=format&fit=crop" },
  { id: "02", title: "Sed Elementum Magna", album: "Morbi Dictum Lectus", durationMs: 215000, audioUrl: "/audio/track-2.mp3", coverUrl: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=600&auto=format&fit=crop" },
  { id: "03", title: "Accumsan Ligula At", album: "Condimentum Nisi Sed", durationMs: 142000, audioUrl: "/audio/track-3.mp3", coverUrl: "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?q=80&w=600&auto=format&fit=crop" },
  { id: "04", title: "Taciti Sociosqu Ad", album: "Litora Torquent Per", durationMs: 264000, audioUrl: "/audio/track-4.mp3", coverUrl: "https://images.unsplash.com/photo-1614680376593-902f74fa0d41?q=80&w=600&auto=format&fit=crop" },
];

// ── Main Component ────────────────────────────────────────────────────────────

export default function MusicCatalogue() {
  const {
    tracks,
    activeTrack,
    isPlaying,
    position,
    duration,
    volume,
    muted,
    loadTracks,
    playTrack,
    togglePlay,
    next,
    prev,
    seek,
    setVolume,
    toggleMute,
  } = usePlayer();

  const [isReady, setIsReady] = useState(false);
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  // Seed standard local system array parameters directly into state context matrix on mount
  useEffect(() => {
    loadTracks(LOCAL_CATALOGUE);
    setIsReady(true);
  }, [loadTracks]);

  return (
    <section id="music" className="bg-[#030303] border-t border-zinc-900/60 pt-24 pb-40 lg:pb-24 px-6 lg:px-16" aria-labelledby="catalogue-heading">
      <div className="max-w-[1280px] mx-auto">
        
        {/* Editorial Section Header */}
        <div className="flex flex-col mb-16">
          <p className="font-label text-[0.52rem] tracking-[0.35em] text-zinc-500 mb-2 font-bold uppercase">
            AUDIO INTERFACE
          </p>
          <h2 id="catalogue-heading" className="font-label text-[clamp(2.2rem,4.5vw,3.6rem)] font-bold tracking-tight text-white leading-none">
            RELEASED CATALOGUE
          </h2>
        </div>

        {/* Master Split Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
          
          {/* Left Column: Interactive Track Archive list */}
          <div className="lg:col-span-7 flex flex-col">
            {!isReady ? (
              <div className="text-zinc-500 text-xs tracking-wider">INITIALIZING INDEX SYSTEM...</div>
            ) : (
              <div className="divide-y divide-zinc-900/60 border-b border-zinc-900/60">
                {tracks.map((track, i) => {
                  const isActive = activeTrack?.id === track.id;
                  const isThisPlaying = isActive && isPlaying;
                  const isHovered = hoveredId === track.id;

                  return (
                    <button
                      key={track.id}
                      onClick={() => (isActive ? togglePlay() : playTrack(track))}
                      onMouseEnter={() => setHoveredId(track.id)}
                      onMouseLeave={() => setHoveredId(null)}
                      className={`group flex items-center gap-6 py-4 px-4 -mx-4 rounded-lg text-left w-[calc(100%+2rem)] border transition-all duration-300 select-none outline-none ${
                        isActive
                          ? "bg-elara-teal/10 border-elara-teal/30 shadow-[0_0_20px_rgba(0,201,177,0.05)]"
                          : "bg-transparent border-transparent hover:bg-zinc-900/20"
                      }`}
                      aria-label={`${isThisPlaying ? "Pause" : "Play"} ${track.title}`}
                    >
                      {/* Metric/Control Index Column */}
                      <div className="w-6 flex items-center justify-end flex-shrink-0">
                        {isThisPlaying ? (
                          <EqBars />
                        ) : isHovered || isActive ? (
                          <span className={isActive ? "text-elara-teal" : "text-zinc-400"}>
                            {isThisPlaying ? <IconPause size={11} /> : <IconPlay size={11} />}
                          </span>
                        ) : (
                          <span className="font-label text-[0.65rem] tracking-wider text-zinc-600 font-light tabular-nums">
                            {String(i + 1).padStart(2, "0")}
                          </span>
                        )}
                      </div>

                      {/* Cover Thumbnail Image Layer */}
                      <div className={`relative w-12 h-12 flex-shrink-0 bg-zinc-900 border overflow-hidden rounded transition-colors ${isActive ? "border-elara-teal/40" : "border-white/5"}`}>
                        <img
                          src={track.coverUrl}
                          alt=""
                          className={`w-full h-full object-cover transition-all duration-500 scale-100 group-hover:scale-105 ${isActive ? "grayscale-0 opacity-100" : "grayscale opacity-75 group-hover:grayscale-0 group-hover:opacity-100"}`}
                          loading="lazy"
                        />
                        {isThisPlaying && (
                          <div className="absolute inset-0 bg-black/40 backdrop-blur-[1px] flex items-center justify-center">
                            <EqBars />
                          </div>
                        )}
                      </div>

                      {/* Identity Text Blocks */}
                      <div className="flex-1 min-w-0">
                        <h3 className={`font-label text-[0.88rem] font-bold tracking-wide truncate transition-colors duration-300 ${isActive ? "text-elara-teal" : "text-white group-hover:text-elara-teal"}`}>
                          {track.title}
                        </h3>
                        <p className={`font-body text-[0.68rem] font-light tracking-wider truncate mt-0.5 ${isActive ? "text-zinc-400" : "text-zinc-500"}`}>
                          {track.album}
                        </p>
                      </div>

                      {/* Micro Metric Duration Block */}
                      <span className={`font-body text-[0.68rem] tracking-widest flex-shrink-0 tabular-nums ${isActive ? "text-elara-teal font-medium" : "text-zinc-400"}`}>
                        {isActive && duration > 0 ? formatMs(position) + " / " + formatMs(duration) : formatMs(track.durationMs)}
                      </span>
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {/* Right Column: Desktop Sticky Console Card */}
          <div className="fixed bottom-4 left-4 right-4 z-50 lg:relative lg:bottom-0 lg:left-0 lg:right-0 lg:z-0 lg:col-span-5 lg:sticky lg:top-28 hidden md:block">
            <div className="bg-[#0a0a0a]/90 lg:bg-[#0a0a0a]/40 backdrop-blur-2xl lg:backdrop-blur-xl border border-zinc-900 shadow-2xl relative overflow-hidden transition-all duration-500 p-6 rounded-xl">
              <div className="absolute top-0 inset-x-0 h-[1px] bg-gradient-to-r from-transparent via-white/10 to-transparent" aria-hidden="true" />

              <div className="flex flex-col gap-5">
                {/* Master Artwork Port Frame */}
                <div className="hidden lg:flex relative aspect-video w-full bg-zinc-950 border border-white/[0.03] overflow-hidden group items-center justify-center rounded-lg">
                  {activeTrack ? (
                    <>
                      <img
                        key={activeTrack.id}
                        src={activeTrack.coverUrl}
                        alt=""
                        className="w-full h-full object-cover mix-blend-luminosity brightness-75 transition-all duration-700 group-hover:scale-102"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-black/30 to-transparent" aria-hidden="true" />
                      {isPlaying && (
                        <div className="absolute inset-0 pointer-events-none transition-opacity duration-500 animate-pulse" style={{ boxShadow: "inset 0 0 60px rgba(0, 201, 177, 0.12)" }} aria-hidden="true" />
                      )}
                    </>
                  ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center gap-2 p-8 text-center select-none">
                      <span className="font-label text-[0.55rem] tracking-[0.25em] text-zinc-600 font-bold uppercase">No Track Selected</span>
                    </div>
                  )}
                </div>

                {/* Control Panel Track Info */}
                {activeTrack && (
                  <div className="flex flex-col gap-4">
                    <div className="flex items-center justify-between gap-4">
                      <div className="min-w-0">
                        <h4 className="font-label text-sm font-bold text-white tracking-wide truncate">{activeTrack.title}</h4>
                        <p className="font-body text-xs text-zinc-400 mt-0.5 truncate">{activeTrack.album}</p>
                      </div>
                    </div>

                    {/* Timeline Interaction Node */}
                    <div className="space-y-1">
                      <SeekBar position={position} duration={duration} onSeek={seek} />
                      <div className="flex justify-between font-body text-[0.65rem] text-zinc-500 tracking-wider tabular-nums">
                        <span>{formatMs(position)}</span>
                        <span>{formatMs(duration)}</span>
                      </div>
                    </div>

                    {/* Player Control Trigger Strip */}
                    <div className="flex items-center justify-center gap-6 py-2">
                      <button onClick={prev} className="text-zinc-400 hover:text-white transition-colors outline-none" aria-label="Previous track">
                        <IconPrev />
                      </button>
                      <button onClick={togglePlay} className="w-10 h-10 rounded-full bg-white text-black flex items-center justify-center hover:scale-105 transition-transform outline-none" aria-label={isPlaying ? "Pause" : "Play"}>
                        {isPlaying ? <IconPause size={14} /> : <IconPlay size={14} />}
                      </button>
                      <button onClick={next} className="text-zinc-400 hover:text-white transition-colors outline-none" aria-label="Next track">
                        <IconNext />
                      </button>
                    </div>

                    {/* Volume Infrastructure Node */}
                    <div className="flex items-center gap-3 border-t border-zinc-900 pt-4">
                      <button onClick={toggleMute} className="text-zinc-400 hover:text-white transition-colors" aria-label="Toggle mute">
                        <IconVolume muted={muted} volume={volume} />
                      </button>
                      <input
                        type="range"
                        min="0"
                        max="1"
                        step="0.01"
                        value={muted ? 0 : volume}
                        onChange={(e) => setVolume(parseFloat(e.target.value))}
                        className="w-full h-1 bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-elara-teal"
                        aria-label="Volume slider"
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

        </div>
      </div>

      <style>{`
        @keyframes playingEq {
          0% { transform: scaleY(0.15); }
          100% { transform: scaleY(1); }
        }
      `}</style>
    </section>
  );
}