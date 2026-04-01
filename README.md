# ProjectLens Interview OS

ProjectLens Interview OS is a React + Vite frontend for repo-aware mock interview practice. The app simulates a realistic interview loop by combining repository-based prompts, live answer capture, performance feedback, and session history in one interface.

## Overview

This project is designed as an interview rehearsal workspace where a user can:

- sign in to a mock interview dashboard
- link a Git repository URL for repo-specific interview prompts
- practice project, system design, behavioral, and bar-raiser style questions
- use browser voice transcription and camera preview during rehearsal
- track coaching insights, metrics, and saved records across sessions

## Main Features

- Repo-aware interview setup with GitHub, GitLab, and Bitbucket URL parsing
- Multiple interview modes and pressure levels
- Voice transcript capture using browser speech recognition
- Camera preview support for posture and presentation rehearsal
- Real-time answer scoring for clarity, depth, ownership, and delivery
- Evidence extraction from answers such as metrics, latency, uptime, and impact terms
- Session summaries and locally stored practice history
- Separate UI sections for Home, Dashboard, Records, About, and Contact

## Tech Stack

- React 18
- Vite 5
- Plain CSS
- Browser APIs for speech recognition, media devices, and local storage

## Getting Started

### Prerequisites

- Node.js 18+ recommended
- npm

### Install

```bash
npm install
```

### Run Development Server

```bash
npm run dev
```

### Create Production Build

```bash
npm run build
```

### Preview Production Build

```bash
npm run preview
```

## Available Scripts

- `npm run dev` starts the Vite development server
- `npm run build` creates the production bundle
- `npm run preview` previews the production build locally

## Project Structure

```text
InterviewX/
├─ public/
│  └─ brand-mark.svg
├─ src/
│  ├─ components/
│  │  ├─ pages/
│  │  │  ├─ AboutSection.jsx
│  │  │  ├─ ContactSection.jsx
│  │  │  ├─ DashboardSection.jsx
│  │  │  ├─ HomeSection.jsx
│  │  │  └─ RecordsSection.jsx
│  │  └─ shared/
│  │     ├─ FeatureCard.jsx
│  │     ├─ RecordCard.jsx
│  │     └─ ScoreBar.jsx
│  ├─ App.jsx
│  ├─ main.jsx
│  └─ styles.css
├─ index.html
├─ package.json
└─ vite.config.js
```

## Notes

- The active UI composition currently uses `src/components/pages` and `src/components/shared`.
- Session data is stored in browser local storage, so records are local to the device/browser profile.
- Voice transcription depends on browser support for `SpeechRecognition` or `webkitSpeechRecognition`.
- Camera rehearsal depends on `navigator.mediaDevices.getUserMedia`.


