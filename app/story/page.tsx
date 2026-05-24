import type { Metadata } from 'next'
import { PROJECTS } from '@/lib/projects'
import CopyLinkButton from './components/copy-matrix'
import InteractiveMasonry from './components/projects'

export const metadata: Metadata = {
  title: 'Maku — Music Archive',
  description: 'The official profile and collection index of music producer and composer Maku.',
}

export default function ArtistProfilePage() {
  return (
    <main className="bg-[#080808] text-zinc-400 min-h-screen py-16 md:py-24 px-6 md:px-12 lg:px-16 font-mono antialiased">
      <div className="max-w-[1280px] mx-auto flex flex-col gap-16">
        
        {/* ── MAIN IMMERSIVE SITE HEADER ───────────────────────────────────── */}
        <header className="flex flex-col md:flex-row md:items-end justify-between border-b border-zinc-900 pb-12 gap-8">
          <div className="space-y-4 max-w-2xl">
            <div className="flex items-center gap-3">
              <span className="font-label text-[0.65rem] tracking-[0.4em] text-maku-green font-bold uppercase block">
                My Story
              </span>
            </div>
            <h1 className="font-label text-[clamp(3rem,8vw,6rem)] font-bold tracking-tighter text-white leading-[0.85] uppercase">
              MAKU
            </h1>
          </div>
          
          {/* <div className="flex flex-col items-start md:items-end gap-1.5 font-body text-xs text-zinc-500 border-l md:border-l-0 md:border-r border-zinc-800 pl-4 md:pl-0 md:pr-4">
            <span className="text-zinc-400 tracking-widest font-semibold">ZAGREB, CROATIA</span>
            <span className="font-label text-[0.6rem] tracking-[0.25em] text-maku-green/90 bg-maku-green/5 border border-maku-green/10 px-2 py-0.5 rounded-sm font-bold">
              INDEX // 2026
            </span>
          </div> */}
        </header>

        {/* ── SPLIT LAYOUT ENGINE ─────────────────────────────────────────── */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
          
          {/* LEFT SIDE COLUMN: STICKY BIOGRAPHY & CONTROL BOARD */}
          <aside className="lg:col-span-4 space-y-12 lg:sticky lg:top-12 self-start border-b lg:border-b-0 border-zinc-900 pb-12 lg:pb-0">
            <div className="space-y-6">
              <div className="flex items-center gap-2">
                <span className="text-zinc-600 font-body text-xs">01 /</span>
                <h2 className="font-label text-xs font-bold text-white uppercase tracking-[0.25em]">
                  Biography
                </h2>
              </div>
              <div className="font-body text-[0.95rem] font-light text-zinc-300/80 space-y-5 leading-relaxed">
                <p>
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin elementum id arcu id feugiat. Duis finibus sollicitudin lacus eget interdum. Cras sed elementum magna. Suspendisse sit amet interdum elit, eget molestie lectus.
                </p>
                <p>
                  Morbi dictum, lectus ut cursus accumsan, leo dolor condimentum velit, eu elementum arcu felis sed nisl. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia curae.
                </p>
              </div>
            </div>

            {/* Practical Share Interaction Component Container */}
            <div className="bg-zinc-950/40 border border-zinc-900/60 p-4 rounded-xl space-y-3">
              <span className="text-[10px] text-zinc-600 block uppercase tracking-wider">Share Portfolio Link</span>
              <CopyLinkButton url="https://maku.audio" />
            </div>
          </aside>

          {/* RIGHT SIDE COLUMN: MASONRY FEED */}
          <section className="lg:col-span-8 space-y-8">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-zinc-900 pb-6">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="text-zinc-600 font-body text-xs">02 /</span>
                  <h2 className="font-label text-sm font-bold text-white uppercase tracking-wide">
                    Selected Projects
                  </h2>
                </div>
                <p className="font-body text-xs text-zinc-500">
                  The following is a curated selection of projects I have been involved in
                </p>
              </div>
              
              <div className="text-[11px] font-mono text-zinc-600 bg-zinc-950 px-2.5 py-1 rounded border border-zinc-900/50 self-start sm:self-auto">
                TOTAL PROJECTS: {PROJECTS.length}
              </div>
            </div>
            
            {/* Masonry Stream Component Mount */}
            <div className="w-full pt-2">
              <InteractiveMasonry items={PROJECTS} />
            </div>
          </section>

        </div>

      </div>
    </main>
  )
}