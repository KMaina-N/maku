'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import type { Project } from '@/lib/projects'

export default function InteractiveMasonry({ items }: { items: Project[] }) {
  const [activeId, setActiveId] = useState<string | null>(null)

  return (
    <div className="columns-1 md:columns-2 lg:columns-3 gap-6 [column-fill:_balance] w-full space-y-6">
      {items.map((item) => {
        const isSelected = activeId === item.id
        const isTall = item.size === 'tall'

        return (
          <Link
            key={item.id}
            href={`/projects/${item.slug}`}
            onMouseEnter={() => setActiveId(item.id)}
            onMouseLeave={() => setActiveId(null)}
            className={`break-inside-avoid mb-6 w-full border rounded-xl p-5 bg-zinc-950/30 backdrop-blur-xs transition-all duration-500 relative flex flex-col justify-between block outline-none group ${
              isTall ? 'min-h-[380px]' : 'min-h-[260px]'
            } ${
              isSelected 
                ? 'border-maku-green/40 bg-zinc-950/60 shadow-[0_0_30px_rgba(204,255,0,0.02)]' 
                : 'border-zinc-900'
            }`}
          >
            {/* Background Image Layer */}
            <div className="absolute inset-0 opacity-[0.04] group-hover:opacity-[0.12] transition-all duration-700 ease-out pointer-events-none overflow-hidden rounded-xl">
              <Image
                src={item.image}
                alt=""
                fill
                className="object-cover mix-blend-luminosity scale-100 group-hover:scale-102 transition-transform duration-700"
                sizes="(max-w-768px) 100vw, (max-w-1200px) 50vw, 33vw"
              />
            </div>

            {/* Layout Information Block */}
            <div className="space-y-4 z-10">
              <div className="flex items-center justify-between font-label text-[0.62rem] tracking-wider text-zinc-600 font-bold">
                <span>PROJECT // {item.id}</span>
                <span className="font-body font-light text-zinc-500 uppercase">{item.type}</span>
              </div>

              <div>
                <h3 className="font-label text-base font-bold text-zinc-100 group-hover:text-maku-green uppercase tracking-wide transition-colors duration-300">
                  {item.title}
                </h3>
              </div>
            </div>

            {/* Meta Tags Block */}
            <div className="pt-12 z-10 flex flex-wrap gap-1.5">
              {item.tags.map((tag) => (
                <span
                  key={tag}
                  className="font-body text-[0.65rem] tracking-wide bg-zinc-900/50 text-zinc-500 group-hover:text-zinc-200 px-2.5 py-0.5 rounded border border-zinc-900 transition-all duration-300"
                >
                  {tag}
                </span>
              ))}
            </div>
          </Link>
        )
      })}
    </div>
  )
}