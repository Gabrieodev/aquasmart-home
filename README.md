# AquaSmart Home Insights

A residential water-consumption monitoring dashboard. It lets homeowners track usage, spot possible waste or leaks, and follow their saving goals. This is a front-end prototype: all data is simulated locally and there is no backend.

## Features

- **Overview** – KPI cards (today, month, daily average, monthly savings) with period selector (Today / 7 days / 30 days) and a simulated live sensor reading
- **Water Consumption** – line, bar and pie charts (usage over time, daily comparison, breakdown by activity)
- **History** – daily consumption table with day-over-day variation, status and period filters
- **Alerts** – leak, night-time usage, goal exceeded and positive-trend notifications
- **Savings Goals** – monthly goal progress and reduction target
- **Settings** – profile, device info and notification toggles (visual only)
- Responsive layout with a collapsible sidebar on mobile

## Tech Stack

- [TanStack Start](https://tanstack.com/start) + TanStack Router / Query
- React 19, TypeScript, Vite
- Tailwind CSS 4, shadcn/ui (Radix UI), Lucide icons
- Recharts
- Vitest + Testing Library
- Bun (package manager)

## Getting Started

```sh
bun install
bun run dev       # start dev server
bun run build     # production build
bun run preview   # preview the build
bun run test      # run tests
bun run lint      # lint
```

## Project Structure

```
src/
├── components/
│   ├── dashboard/   # AppShell, charts, widgets
│   └── ui/          # shadcn/ui primitives
├── data/water.ts    # mock data layer (swap for a real API)
├── hooks/           # use-live-reading (simulated sensor)
└── routes/          # file-based routes (index, consumo, historico, alertas, metas, configuracoes)
```

The UI only imports data through the getter functions in `src/data/water.ts`, so a real API or sensor feed can replace the mock data without touching components.

## Notes

- No authentication, backend or external APIs (apart from the Inter font from Google Fonts).