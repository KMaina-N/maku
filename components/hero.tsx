"use client";

import { useEffect, useTransition } from "react";
import { usePlayer } from "@/context/player-context";
import { HeroCanvas } from "./hero-canvas";
import { HERO_CONTENT } from "@/lib/content";

// --- Icons ---

function PlayIcon() {
  return (
    <svg width="11" height="11" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M8 5v14l11-7z" />
    </svg>
  );
}

function PauseIcon() {
  return (
    <svg width="11" height="11" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z" />
    </svg>
  );
}

// --- Main Component ---

export default function Hero() {
  const { tracks, activeTrack, isPlaying, playTrack, togglePlay } = usePlayer();
  const [isPending, startTransition] = useTransition();

  // Sync with native OS MediaSession API
  useEffect(() => {
    if (typeof window === "undefined" || !("mediaSession" in navigator) || !activeTrack) return;

    navigator.mediaSession.metadata = new MediaMetadata({
      title: activeTrack.title,
      artist: HERO_CONTENT.eyebrow,
      album: activeTrack.album || HERO_CONTENT.name,
      artwork: [{ src: activeTrack.coverUrl, sizes: "512x512", type: "image/png" }],
    });

    navigator.mediaSession.playbackState = isPlaying ? "playing" : "paused";
    navigator.mediaSession.setActionHandler("play", () => togglePlay());
    navigator.mediaSession.setActionHandler("pause", () => togglePlay());
  }, [activeTrack, isPlaying, togglePlay]);

  const handleListenNow = () => {
    if (!tracks?.length) return;

    startTransition(() => {
      if (activeTrack) {
        togglePlay();
      } else {
        playTrack(tracks[0]);
      }
    });
  };

  const getCtaText = () => {
    if (isPending) return "LOADING...";
    if (isPlaying) return "PAUSE";
    if (activeTrack && !isPlaying) return "RESUME";
    return "LISTEN NOW";
  };

  return (
    <section
      className="relative h-screen w-full overflow-hidden bg-[#030303] select-none"
      aria-labelledby="hero-heading"
    >
      {/* Background Image */}
      <div className="absolute inset-0 z-0 pointer-events-none" aria-hidden="true">
        <div className="absolute inset-0 bg-[url('/images/hero_image.png')] bg-cover bg-[center_22%] opacity-35 mix-blend-luminosity grayscale contrast-[1.15] brightness-[0.85] scale-100 will-change-transform" />
      </div>

      {/* WebGL Canvas Overlay */}
      <div className="absolute inset-0 z-[1] pointer-events-none opacity-90 mix-blend-screen" aria-hidden="true">
        {/* <HeroCanvas isPlaying={isPlaying} /> */}
      </div>

      {/* Atmospheric Gradients */}
      <div className="absolute inset-0 z-[2] pointer-events-none" aria-hidden="true">
        <div className="absolute inset-0 bg-gradient-to-t from-[#030303] via-[#030303]/80 to-transparent" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_12%_30%,transparent_25%,#030303_125%)]" />
      </div>

      {/* Content Layout */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-full z-[3] px-6 md:px-16 lg:px-24 pb-28 md:pb-36 max-w-[1440px] flex flex-col items-start">
        <div className="max-w-2xl transform-gpu">
          <p className="font-label text-[0.6rem] tracking-[0.3em] text-elara-teal mb-4 animate-fade-up-1">
            {HERO_CONTENT.eyebrow}
          </p>

          <h1
            id="hero-heading"
            className="font-label text-[clamp(4.2rem,12vw,8rem)] font-bold tracking-tight leading-[0.82] text-white mb-6 select-text animate-fade-up-2"
          >
            {HERO_CONTENT.name}
          </h1>

          <p className="font-body text-[clamp(0.92rem,1.35vw,1.08rem)] font-light text-zinc-400/90 leading-relaxed max-w-md mb-10 select-text animate-fade-up-3">
            {HERO_CONTENT.tagline}
          </p>

          <div className="animate-fade-up-4">
            <button
              onClick={handleListenNow}
              disabled={!tracks?.length || isPending}
              aria-label={isPlaying ? "Pause immersive audio stream" : "Listen to active catalogue experience"}
              className="inline-flex items-center gap-4 font-label text-[0.62rem] tracking-[0.28em] font-bold text-white border border-white/10 rounded-full pl-2 pr-7 py-2.5 cursor-pointer bg-white/[0.01] backdrop-blur-xl transition-all duration-500 hover:border-maku-green/30 hover:bg-maku-green/15 hover:shadow-[0_0_40px_rgba(204,255,0,0.06)] disabled:opacity-20 disabled:pointer-events-none group outline-none focus-visible:ring-1 focus-visible:ring-maku-green/50"
            >
              <span className="flex items-center justify-center w-8.5 h-8.5 rounded-full bg-white text-black flex-shrink-0 transition-all duration-700 ease-out transform-gpu group-hover:bg-maku-green group-hover:text-black">
                {isPlaying ? <PauseIcon /> : <PlayIcon />}
              </span>
              <span className="font-medium tracking-[0.3em]">
                {getCtaText()}
              </span>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}