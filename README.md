# PodPulse App

> Internal — private repository.

Next.js frontend for the PodPulse platform. Displays real-time Kubernetes incident diagnostics, AI-generated root cause analysis, and GitHub PR status.

---

## Stack

- **Framework**: Next.js 15 (App Router)
- **UI**: shadcn/ui (Luma preset)
- **Real-time**: SSE (Server-Sent Events) for live incident updates
- **Styling**: Tailwind CSS

---

## Prerequisites

- Node.js 20+
- A running PodPulse backend (see `podpulse-backend`)
- A valid API key provisioned via the backend admin endpoints

---

## Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

---

## Configuration

Create a `.env.local` at the root:

```env
NEXT_PUBLIC_API_URL=http://localhost:8080
NEXT_PUBLIC_API_KEY=pk_live_...
```

| Variable | Description |
|---|---|
| `NEXT_PUBLIC_API_URL` | PodPulse backend base URL |
| `NEXT_PUBLIC_API_KEY` | API key for backend authentication |

---

## Key Features

- **Incident list** — real-time updates via SSE, no polling
- **Incident status** — `Detected → Diagnosing → PR Opened → Resolved`
- **PR tracking** — live `PrState` badge (`Open / Merged / Closed`) updated via GitHub webhook
- **Confidence score** — visual indicator per incident (`High / Moderate / Below threshold`)
- **Incident types** — `OOMKilled`, `CrashLoopBackOff` (W8+)

---

## Project Structure

```
app/
├── incidents/          # Incident list + detail pages
│   ├── page.tsx
│   ├── IncidentsClient.tsx
│   └── [id]/
components/
├── incidents/
│   ├── IncidentTable.tsx
│   ├── IncidentStatusBadge.tsx
│   ├── PullRequestBadge.tsx
│   └── ConfidenceScore.tsx
lib/
├── types.ts            # IncidentStatus, PrStatus, PrState enums
├── incident-ui.ts      # Status/PR/confidence metadata + formatters
└── utils.ts
```

---

## Incident Status Flow

```
Detected
   │
   ▼
Diagnosing  (LLM call in progress)
   │
   ├── confidence >= threshold → PrOpened
   │                                │
   │                          PR merged → (Resolved — future)
   │                          PR closed → back to Diagnosed
   │
   └── confidence < threshold → Diagnosed (UI only, no PR)
```

---

## Real-time Updates

Incidents are streamed via SSE from the backend:

```
GET /api/incidents/stream
Header: X-Api-Key: pk_live_...
```

The `IncidentsClient` component maintains an `EventSource` connection and updates the incident list in real time without page refresh.

---

## PR Status Tracking

`PrState` is updated via GitHub webhook → backend → DB. The frontend reflects the current state via the SSE stream or on next page load.

| State | Badge |
|---|---|
| `Open` | Blue — PR Open |
| `Merged` | Green — Merged |
| `Closed` | Grey — Closed |

---

## Production Deployment

Target: **Vercel**

```bash
vercel deploy
```

Environment variables must be set in the Vercel project settings — never commit `.env.local`.

---

## Related Repositories

| Repo | Description |
|---|---|
| `podpulse-agent` | In-cluster Go agent (open source) |
| `podpulse-backend` | ASP.NET Core backend (private) |
| `podpulse-helm` | Helm chart for agent deployment (public) |