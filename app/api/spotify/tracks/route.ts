// app/api/spotify/tracks/route.ts
// ─────────────────────────────────────────────────────────────────────────────
// Fetches the artist's top tracks from Spotify using Client Credentials
// (no user auth needed for metadata). Returns track list with URIs for the SDK.

import { NextRequest, NextResponse } from 'next/server'
import type { SpotifyTrack } from '@/hooks/useSpotify'

let _ccToken    = ''
let _ccTokenExp = 0

async function getClientCredentialsToken(): Promise<string> {
  if (_ccToken && Date.now() < _ccTokenExp - 60_000) return _ccToken

  const res = await fetch('https://accounts.spotify.com/api/token', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      Authorization: `Basic ${Buffer.from(
        `${process.env.SPOTIFY_CLIENT_ID}:${process.env.SPOTIFY_CLIENT_SECRET}`
      ).toString('base64')}`,
    },
    body: 'grant_type=client_credentials',
    cache: 'no-store',
  })

  if (!res.ok) throw new Error(`Client credentials failed: ${res.status}`)
  const data  = await res.json()
  _ccToken    = data.access_token
  _ccTokenExp = Date.now() + data.expires_in * 1000
  return _ccToken
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function mapTrack(t: any, fallbackCover?: string, fallbackAlbum?: string): SpotifyTrack {
  return {
    id:         t.id,
    title:      t.name,
    album:      t.album?.name ?? fallbackAlbum ?? '',
    durationMs: t.duration_ms,
    previewUrl: t.preview_url ?? null,
    spotifyUri: `spotify:track:${t.id}`,
    spotifyId:  t.id,
    coverUrl:   t.album?.images?.[0]?.url ?? fallbackCover ?? '/images/placeholder.jpg',
  }
}

export async function GET(req: NextRequest) {
  try {
    const artistId = (process.env.SPOTIFY_ARTIST_ID ?? '').trim()
    if (!artistId) {
      return NextResponse.json({ error: 'SPOTIFY_ARTIST_ID not configured' }, { status: 500 })
    }

    const { searchParams } = new URL(req.url)
    const type    = searchParams.get('type') ?? 'top'
    const albumId = searchParams.get('albumId')

    const token   = await getClientCredentialsToken()
    const headers = { Authorization: `Bearer ${token}` }

    let tracks: SpotifyTrack[] = []

    // ── Specific album ──────────────────────────────────────────────────────
    if (type === 'album' && albumId) {
      const [albumData, tracksData] = await Promise.all([
        fetch(`https://api.spotify.com/v1/albums/${albumId}`, { headers, next: { revalidate: 3600 } }).then(r => r.json()),
        fetch(`https://api.spotify.com/v1/albums/${albumId}/tracks?limit=50`, { headers, next: { revalidate: 3600 } }).then(r => r.json()),
      ])
      const cover = albumData.images?.[0]?.url
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      tracks = tracksData.items.map((t: any) => mapTrack(t, cover, albumData.name))

    // ── Top tracks (tries multiple markets) ─────────────────────────────────
    } else {
      const MARKETS = ['HR', 'SI', 'US', 'GB', 'DE', 'FR', 'AU']
      for (const market of MARKETS) {
        const res = await fetch(
          `https://api.spotify.com/v1/artists/${artistId}/top-tracks?market=${market}`,
          { headers, next: { revalidate: 3600 } }
        )
        if (res.ok) {
          const data = await res.json()
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          tracks = data.tracks.map((t: any) => mapTrack(t))
          break
        }
        console.warn(`[tracks] market ${market} → ${res.status}`)
      }

      // Fallback: pull from artist's album releases
      if (!tracks.length) {
        const albumsRes = await fetch(
          `https://api.spotify.com/v1/artists/${artistId}/albums?include_groups=album,single&limit=10`,
          { headers }
        )
        if (albumsRes.ok) {
          const albumsData = await albumsRes.json()
          for (const release of albumsData.items.slice(0, 3)) {
            const tRes = await fetch(
              `https://api.spotify.com/v1/albums/${release.id}/tracks?limit=20`,
              { headers }
            )
            if (!tRes.ok) continue
            const tData = await tRes.json()
            const cover = release.images?.[0]?.url
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            for (const t of tData.items as any[]) {
              tracks.push(mapTrack(t, cover, release.name))
              if (tracks.length >= 10) break
            }
            if (tracks.length >= 10) break
          }
        }
      }
    }

    if (!tracks.length) {
      return NextResponse.json({ error: 'No tracks found for this artist.' }, { status: 404 })
    }

    return NextResponse.json({ tracks }, { headers: { 'Cache-Control': 'public, s-maxage=3600' } })

  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err)
    console.error('[spotify/tracks]', msg)
    return NextResponse.json({ error: msg }, { status: 500 })
  }
}