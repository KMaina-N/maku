// app/api/spotify/preview/route.ts
// ─── SERVER ROUTE ─────────────────────────────────────────────────────────────
// Proxies Spotify preview MP3s through the Next.js server.
//
// Why proxy?
//   Spotify preview_url links are direct CDN URLs. Most browsers can fetch them
//   directly, but some corporate networks / proxies block cross-origin audio.
//   Routing through our own domain ensures playback always works.
//
// Usage: GET /api/spotify/preview?url=https://p.scdn.co/mp3-preview/...

import { NextRequest, NextResponse } from 'next/server'

export async function GET(req: NextRequest) {
  const previewUrl = req.nextUrl.searchParams.get('url')

  if (!previewUrl) {
    return NextResponse.json({ error: 'Missing url param' }, { status: 400 })
  }

  // Only allow Spotify CDN URLs — reject anything else
  const allowed = [
    'https://p.scdn.co/',
    'https://audio-ssl.itunes.apple.com/', // fallback previews sometimes use Apple CDN
  ]
  if (!allowed.some((prefix) => previewUrl.startsWith(prefix))) {
    return NextResponse.json({ error: 'URL not allowed' }, { status: 403 })
  }

  try {
    const upstream = await fetch(previewUrl, {
      headers: {
        // Forward range headers for seeking support
        ...(req.headers.get('range') ? { Range: req.headers.get('range')! } : {}),
      },
    })

    if (!upstream.ok && upstream.status !== 206) {
      return NextResponse.json(
        { error: `Upstream error: ${upstream.status}` },
        { status: upstream.status },
      )
    }

    const body = await upstream.arrayBuffer()

    return new NextResponse(body, {
      status: upstream.status,
      headers: {
        'Content-Type':  upstream.headers.get('Content-Type')  ?? 'audio/mpeg',
        'Content-Length': upstream.headers.get('Content-Length') ?? String(body.byteLength),
        'Accept-Ranges': 'bytes',
        'Cache-Control': 'public, max-age=86400',
        // Allow the browser audio element to load the stream
        'Access-Control-Allow-Origin': '*',
      },
    })
  } catch (err) {
    console.error('[spotify/preview]', err)
    return NextResponse.json({ error: 'Proxy error' }, { status: 502 })
  }
}