# SurakshAI Frontend

Autonomous Cyber Threat Intelligence Platform — React frontend.

## Quick Start

```bash
npm install
npm run dev
# Opens at http://localhost:5173
```

## Pages

| Route        | Page                        | Owner          |
|--------------|-----------------------------|----------------|
| `/`          | Landing                     | Frontend Dev 1 |
| `/dashboard` | Threat Intelligence Dashboard | Frontend Dev 1 |
| `/verify`    | Citizen Verification Portal | Frontend Dev 2 |
| `/campaigns` | Campaign Tracker            | Frontend Dev 2 |
| `/alerts`    | Alert History               | Frontend Dev 2 |

## Key Components

### Dashboard
- `StatsBar` — 4 live stat cards (polls every 5s)
- `ThreatFeed` — real-time scrolling threat list
- `IndiaHeatmap` — D3 choropleth, click state to filter
- `NetworkGraph` — D3 force graph of operator network
- `ThreatVolumeChart` — Recharts line chart by type
- `ThreatTypeDonut` — Recharts donut breakdown

### Verify
- `VerifyInput` — 3-tab input (phone/UPI/video)
- `VerifyResult` — animated result with fraud score

### Campaigns
- `CampaignTable` — filterable table with expandable rows
- `CampaignDetail` — threats, network, states per campaign

### Alerts
- `AlertTable` — full alert history
- `AlertPayloadModal` — CERT-In JSON payload viewer

## Environment Variables

```env
VITE_API_URL=http://localhost:8000
VITE_POCKETBASE_URL=http://127.0.0.1:8090
```

## Deploy to Vercel

```bash
npx vercel
# Set env vars in Vercel dashboard
```

## Demo Trigger

The **Test Alert** button in the topbar calls `POST /trigger/test`
on the backend — fires a demo threat and runs campaign detection.
Use this during the judge demo for the live cascade effect.
