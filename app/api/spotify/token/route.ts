// app/api/spotify/token/route.ts
// ─────────────────────────────────────────────────────────────────────────────
// Serves a fresh Spotify access_token to every visitor.
// Uses the artist's stored SPOTIFY_REFRESH_TOKEN to silently generate one.
// The refresh_token never leaves the server — only the short-lived access_token
// (valid 60 minutes) is sent to the browser for the Web Playback SDK.
//
// In-memory cache avoids hammering the Spotify auth endpoint.

import { NextResponse } from 'next/server'

let cachedToken    = ''
let cacheExpiresAt = 0

async function getAccessToken(): Promise<string> {
  // Return cached token if still valid (with 2-minute buffer)
  if (cachedToken && Date.now() < cacheExpiresAt - 120_000) {
    return cachedToken
  }

  const refreshToken = process.env.SPOTIFY_REFRESH_TOKEN
  const clientId     = process.env.SPOTIFY_CLIENT_ID
  const clientSecret = process.env.SPOTIFY_CLIENT_SECRET

  if (!refreshToken || !clientId || !clientSecret) {
    throw new Error(
      'Missing env vars: SPOTIFY_REFRESH_TOKEN, SPOTIFY_CLIENT_ID or SPOTIFY_CLIENT_SECRET'
    )
  }

  const res = await fetch('https://accounts.spotify.com/api/token', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      Authorization: `Basic ${Buffer.from(`${clientId}:${clientSecret}`).toString('base64')}`,
    },
    body: new URLSearchParams({
      grant_type:    'refresh_token',
      refresh_token: refreshToken,
    }),
    cache: 'no-store',
  })

  if (!res.ok) {
    const err = await res.text()
    throw new Error(`Spotify token refresh failed (${res.status}): ${err}`)
  }

  const data       = await res.json()
  cachedToken      = data.access_token
  cacheExpiresAt   = Date.now() + data.expires_in * 1000

  return cachedToken
}

export async function GET() {
  try {
    const token = await getAccessToken()
    return NextResponse.json(
      { access_token: token },
      {
        headers: {
          // Don't cache in browser — always fetch fresh from server
          'Cache-Control': 'no-store',
        },
      }
    )
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error'
    console.error('[spotify/token]', message)
    return NextResponse.json({ error: message }, { status: 500 })
  }
}