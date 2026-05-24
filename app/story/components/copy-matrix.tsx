'use client'

import { useState } from 'react'

export default function CopyLinkButton({ url }: { url: string }) {
  const [copied, setCopied] = useState(false)

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(url)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      // safe fallback
    }
  }

  return (
    <button
      onClick={handleCopy}
      className="w-full text-center py-2.5 border border-zinc-800 hover:border-maku-green/40 bg-zinc-950 rounded-lg font-label text-[0.62rem] text-zinc-500 hover:text-maku-green tracking-widest font-bold uppercase transition-all duration-300 outline-none"
    >
      {copied ? '✓ Link copied' : '⧉ Copy website link'}
    </button>
  )
}