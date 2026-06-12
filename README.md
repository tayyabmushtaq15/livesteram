# LiveSport — Live Match Streaming App

## Quick Start
```bash
npm install
npm run dev
# http://localhost:3000
```

## Admin Panel
Navigate to: `http://localhost:3000/admin`
Default password: `admin123`

## Deploy on Vercel
```bash
npm i -g vercel
vercel
```
Then set environment variables in Vercel dashboard.

## Environment Variables (set in Vercel dashboard)
| Variable | Description |
|---|---|
| `ADMIN_KEY` | Admin panel password |
| `NEXT_PUBLIC_ADSENSE_CLIENT` | Google AdSense publisher ID (ca-pub-...) |
| `NEXT_PUBLIC_AD_SLOT_BELOW_VIDEO` | AdSense slot ID below video |
| `NEXT_PUBLIC_AD_SLOT_SIDEBAR` | AdSense slot ID sidebar |
| `NEXT_PUBLIC_AD_SLOT_BOTTOM` | AdSense slot ID bottom banner |
| `NEXT_PUBLIC_META_PIXEL_ID` | Meta/Facebook Pixel ID |
