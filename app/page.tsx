// ─── SERVER COMPONENT ─────────────────────────────────────────────────────────
// Page shell — assembles all sections. Server-rendered for instant HTML + SEO.
// Client interactivity is isolated to leaf components only.

import Hero from "@/components/hero";
// import LivePerformances from "@/components/live-perfomance";
import MiniPlayer from "@/components/mini-player";
import MusicCatalogue from "@/components/music-catalogue";
// import Navbar from "@/components/navbar";
import { PlayerProvider } from "@/context/player-context";

export default function HomePage() {
  return (
    <main>
      
      <PlayerProvider>
        <Hero />
        <MusicCatalogue />
         {/* <LivePerformances /> */}
        {/* <LatestMusic />
     
      <Newsletter />
      <Footer /> */}
        <MiniPlayer />
      </PlayerProvider>
    </main>
  );
}
