// app/api/auth/login/route.ts
// ─────────────────────────────────────────────────────────────────────────────
// ONE-TIME USE ONLY — the artist visits this once to authorise the app.
// After you have SPOTIFY_REFRESH_TOKEN in .env.local, this route is no longer
// needed and can be deleted before deploying to production.
//
// Visit: http://localhost:3000/api/auth/login

import { NextResponse } from 'next/server'

export async function GET() {
  const params = new URLSearchParams({
    response_type: 'code',
    client_id:     process.env.SPOTIFY_CLIENT_ID!,
    scope:         'streaming user-read-email user-read-private user-read-playback-state user-modify-playback-state',
    redirect_uri:  process.env.SPOTIFY_REDIRECT_URI!,
  })
  return NextResponse.redirect(`https://accounts.spotify.com/authorize?${params}`)
}