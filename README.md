# InterviewX 🎯

AI-powered technical interviews, calibrated to your GitHub repository.

---

## ▶ Quick Start — No Install Required

**Just open `index.html` in your browser.**

Double-click `index.html` → Works instantly. No server, no build, no npm.

This is a fully self-contained single-file React app using CDN imports. All pages, routing, charts, voice input, mock API, and toast notifications are included.

---

## ▶ Full Vite/React App (Production-Grade)

For the complete structured codebase with Tailwind, proper component separation, and Vite build pipeline:

```bash
cd interviewx-vite
npm install
npm run dev
```

Open → http://localhost:5173

### Build for production:
```bash
npm run build
npm run preview
```

---

## Features

| Feature | Standalone | Vite App |
|---------|-----------|----------|
| All 8 pages | ✅ | ✅ |
| Mock API (no backend) | ✅ | ✅ |
| Voice input (Web Speech API) | ✅ | ✅ |
| Recharts (radar + bar) | ✅ | ✅ |
| Tailwind CSS | inline styles | ✅ |
| Hot reload | ❌ | ✅ |
| Tree-shakeable | ❌ | ✅ |
| TypeScript ready | ❌ | ✅ |

---

## Pages

- `/` — Hero landing page with features + process flow
- `/dashboard` — GitHub repo analysis + interview setup (duration + pressure)
- `/interview/:id` — Live interview with voice input, real-time scores, timer
- `/report/:id` — Radar chart, bar chart, strengths/weaknesses, collapsible transcript
- `/record` — History of all past interviews
- `/about` — How InterviewX works (step-by-step)
- `/contact` — Contact form
- `/login` — Waitlist signup

---

## How the Mock API Works

No backend is needed. `src/lib/api.js` (Vite) / inline in `index.html` simulates:

- **analyzeRepo** — Returns realistic project summaries for known repos (express, react, next.js) or generates one for any URL
- **startInterview** — Creates a session with shuffled questions stored in `sessionStorage`
- **submitAnswer** — Scores answers based on length/quality, returns next question
- **finishInterview** — Generates a full report, saves to `localStorage`
- **listInterviews** — Reads history from `localStorage`
- **getReport** — Retrieves from `sessionStorage` or returns a demo report

To connect a real backend: replace `src/lib/api.js` with actual `fetch()` calls to your API.

---

## Design

- **Dark theme** with `#0b0e14` background and `#00e07a` (emerald green) primary
- **Fonts**: Syne (display/headings) + DM Sans (body) + JetBrains Mono (code/numbers)  
- **Voice input** via Web Speech API — works in Chrome/Edge, gracefully degrades to text-only
- **No external auth** — sessions stored in browser storage
