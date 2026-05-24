// app/api/auth/callback/route.ts
// ─────────────────────────────────────────────────────────────────────────────
// ONE-TIME USE ONLY — Spotify redirects here after artist approves.
// Exchanges the code for tokens and prints the refresh_token to the terminal.
// Copy the refresh_token into SPOTIFY_REFRESH_TOKEN in .env.local, then
// delete this file and app/api/auth/login/route.ts before going to production.

import { NextRequest, NextResponse } from 'next/server'

export async function GET(req: NextRequest) {
  const code = req.nextUrl.searchParams.get('code')
  if (!code) return new NextResponse('Missing code', { status: 400 })

  const res = await fetch('https://accounts.spotify.com/api/token', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      Authorization: `Basic ${Buffer.from(
        `${process.env.SPOTIFY_CLIENT_ID}:${process.env.SPOTIFY_CLIENT_SECRET}`
      ).toString('base64')}`,
    },
    body: new URLSearchParams({
      grant_type:   'authorization_code',
      code,
      redirect_uri: process.env.SPOTIFY_REDIRECT_URI!,
    }),
    cache: 'no-store',
  })

  const data = await res.json()

  if (!res.ok) {
    return new NextResponse(`Spotify error: ${JSON.stringify(data)}`, { status: 500 })
  }

  // ── Print to terminal so you can copy it ─────────────────────────────────
  console.log('\n')
  console.log('════════════════════════════════════════════════════════════')
  console.log('  ✅  Spotify auth successful!')
  console.log('  Copy this into your .env.local:')
  console.log(`  SPOTIFY_REFRESH_TOKEN=${data.refresh_token}`)
  console.log('════════════════════════════════════════════════════════════')
  console.log('\n')

  return new NextResponse(
    `<html><body style="font-family:monospace;padding:40px;background:#080808;color:#f0ece4">
      <h2 style="color:#00c9b1">✅ Auth successful!</h2>
      <p>Copy this line into your <code>.env.local</code> file, then restart the server:</p>
      <pre style="background:#111;padding:20px;border-radius:4px;color:#C8FF00;overflow:auto">SPOTIFY_REFRESH_TOKEN=${data.refresh_token}</pre>
      <p style="color:#8a857c">You can now delete <code>app/api/auth/</code> before deploying.</p>
    </body></html>`,
    { headers: { 'Content-Type': 'text/html' } }
  )
}