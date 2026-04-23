# InterviewX 🎯

AI-powered technical interviews, calibrated to your GitHub repository.

## Features

- 🔍 **Repo Analysis** — Paste any GitHub URL to analyze tech stack, modules, and complexity
- 🎙️ **Voice + Text Input** — Speak or type your answers with live transcription
- 🧠 **Adaptive AI** — Questions adapt based on your answer quality (via Claude API)
- 📊 **Scored Responses** — Clarity, Depth, Correctness, Confidence — per answer
- 📈 **Detailed Reports** — Charts, transcript, strengths, weaknesses, suggestions
- 💾 **Session History** — All past interviews saved locally

## Setup

### Requirements
- Node.js 18+
- npm or pnpm

### Install & Run

```bash
# Install dependencies
npm install
# or
pnpm install

# Start dev server
npm run dev
# or
pnpm dev
```

Open [http://localhost:5173](http://localhost:5173)

### Build for production

```bash
npm run build
npm run preview
```

## How It Works

1. **Dashboard** → Enter a GitHub repo URL → Analyze → Configure duration & pressure
2. **Interview** → Answer repo-specific questions by voice or text → Real-time scores appear
3. **Report** → Radar chart, bar charts, strengths/weaknesses, full transcript

## Architecture

```
src/
├── components/
│   ├── Navbar.jsx          # Sticky navigation
│   └── ui/index.jsx        # All UI primitives (Button, Input, Badge, Toast, etc.)
├── pages/
│   ├── Home.jsx            # Landing page
│   ├── Dashboard.jsx       # Repo analysis + interview setup
│   ├── Interview.jsx       # Live interview interface with voice
│   ├── Report.jsx          # Results with recharts visualizations
│   └── other-pages.jsx     # Record, About, Contact, Login, NotFound
├── lib/
│   ├── api.js              # Mock API (simulates backend, fully self-contained)
│   └── utils.js            # cn() helper
├── hooks/
│   ├── use-toast.js        # Toast notification hook
│   └── use-mobile.js       # Responsive hook
├── App.jsx                 # Router + providers
├── main.jsx                # Entry point
└── index.css               # Design tokens + Tailwind
```

## Notes

- This build is **fully self-contained** — no backend required. The `api.js` simulates all API calls with mock data and realistic delays.
- Interview sessions are stored in `sessionStorage`, history in `localStorage`.
- Voice input uses the Web Speech API (Chrome/Edge). Falls back gracefully to text-only.
- To connect a real backend, replace `src/lib/api.js` with actual `fetch()` calls.
