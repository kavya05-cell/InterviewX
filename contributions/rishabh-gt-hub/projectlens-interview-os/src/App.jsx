import { useEffect, useMemo, useRef, useState } from "react";

const STORAGE_KEYS = {
  auth: "projectlens_auth",
  records: "projectlens_records"
};

const navItems = [
  { id: "home", label: "Home" },
  { id: "dashboard", label: "Dashboard" },
  { id: "records", label: "Records" },
  { id: "about", label: "About" },
  { id: "contact", label: "Contact" }
];

const roleOptions = [
  { value: "fullstack", label: "Full Stack Engineer" },
  { value: "frontend", label: "Frontend Engineer" },
  { value: "backend", label: "Backend Engineer" },
  { value: "ai", label: "AI Product Engineer" }
];

const roundOptions = [
  { value: "project", label: "Project Deep Dive" },
  { value: "system", label: "System Design" },
  { value: "behavioral", label: "Behavioral + Ownership" },
  { value: "bar", label: "Bar Raiser Mix" }
];

const durationOptions = [
  { value: 15, label: "15 min sprint" },
  { value: 25, label: "25 min balanced" },
  { value: 40, label: "40 min full loop" }
];

const homeFeatures = [
  {
    tag: "Repo Mirror",
    title: "Turn a Git repository into a realistic interview brief",
    copy:
      "Paste a repo URL and the studio generates architecture angles, risk hotspots, project prompts, and hiring-style follow-up questions."
  },
  {
    tag: "Voice + Video",
    title: "Practice out loud with browser microphone and camera",
    copy:
      "Use live transcript capture, camera preview, and typed fallback notes so the flow feels like a real interview instead of a chat box."
  },
  {
    tag: "Signal Replay",
    title: "Track your trend lines across every mock loop",
    copy:
      "ProjectLens stores previous sessions, compares overall score movement, and shows the habits that are improving or slipping."
  },
  {
    tag: "Evidence Ledger",
    title: "Catch missing metrics before interviewers do",
    copy:
      "The app extracts impact signals from your answers so you can quickly see whether you used numbers, outcomes, and ownership language."
  }
];

const uniqueFeatures = [
  {
    title: "Pressure Dial",
    copy:
      "Shift from warm-up mode to bar raiser intensity and the generated follow-ups become sharper, more skeptical, and more leadership-focused."
  },
  {
    title: "Ownership Radar",
    copy:
      "A four-signal heat map makes it easy to spot whether your answer is strong on clarity, technical depth, delivery, and personal ownership."
  },
  {
    title: "Panel Blend",
    copy:
      "The question set mixes project, behavioral, and systems thinking so you do not overfit to one style of mock interview."
  }
];

const seededRecords = [
  {
    id: "seed-1",
    date: "2026-03-16T10:00:00.000Z",
    role: "Frontend Engineer",
    round: "Project Deep Dive",
    repo: "northwind/checkout-web",
    overall: 84,
    confidence: 82,
    clarity: 87,
    depth: 79,
    ownership: 86,
    delivery: 82,
    strengths: ["Clear architecture summary", "Strong tradeoff framing", "Good delivery control"],
    improvements: ["Use more business metrics", "Tighten answer openings", "Add one failure example"],
    keyInsight: "Lead with user impact, then explain implementation tradeoffs.",
    evidence: ["27%", "latency", "conversion"]
  },
  {
    id: "seed-2",
    date: "2026-03-11T10:00:00.000Z",
    role: "Full Stack Engineer",
    round: "System Design",
    repo: "acme/orders-platform",
    overall: 78,
    confidence: 76,
    clarity: 79,
    depth: 80,
    ownership: 74,
    delivery: 77,
    strengths: ["Good backend reasoning", "Healthy pace", "Solid failure handling"],
    improvements: ["Mention monitoring", "Use more first-person ownership", "Close with next-step plan"],
    keyInsight: "Name the constraint first and explain why your design matched it.",
    evidence: ["p95", "99.9%", "cost"]
  }
];

const defaultRepoProfile = {
  linked: false,
  repoUrl: "",
  repoName: "No repository linked",
  lens: "General engineering walkthrough",
  summary:
    "Link a Git repository to tailor project-specific prompts, follow-ups, and architecture hotspots.",
  stack: ["Architecture", "Tradeoffs", "Execution"],
  hotspots: ["Ownership story", "Impact metrics", "Scaling decisions"],
  scorecard: {
    architecture: 72,
    reliability: 70,
    product: 74,
    execution: 73
  },
  standout: ["Explain why it exists", "Share one hard tradeoff", "Quantify outcomes"],
  themes: ["Architecture story", "Tradeoff clarity", "Customer impact"],
  questionSeeds: [
    "Walk me through your last project from problem statement to shipped outcome.",
    "What was the hardest engineering tradeoff you had to make?",
    "If you had one more sprint, what would you improve first?"
  ]
};

const defaultSettings = {
  role: "fullstack",
  round: "project",
  duration: 25,
  pressure: 2,
  voiceEnabled: true,
  videoEnabled: false
};

const initialSession = {
  active: false,
  elapsedSeconds: 0,
  questionSeconds: 0,
  currentQuestionIndex: 0,
  answers: [],
  summary: null
};

const defaultContact = {
  name: "",
  email: "",
  message: ""
};

function readStoredValue(key, fallback) {
  if (typeof window === "undefined") {
    return fallback;
  }

  try {
    const raw = window.localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
}

function clamp(value, min, max) {
  return Math.min(max, Math.max(min, Math.round(value)));
}

function hashString(value) {
  let hash = 0;

  for (let index = 0; index < value.length; index += 1) {
    hash = (hash * 31 + value.charCodeAt(index)) | 0;
  }

  return Math.abs(hash);
}

function average(values) {
  if (!values.length) {
    return 0;
  }

  return Math.round(values.reduce((sum, value) => sum + value, 0) / values.length);
}

function createId() {
  if (typeof crypto !== "undefined" && crypto.randomUUID) {
    return crypto.randomUUID();
  }

  return `id-${Date.now()}-${Math.round(Math.random() * 100000)}`;
}

function getRoleLabel(role) {
  return roleOptions.find((option) => option.value === role)?.label ?? "Engineer";
}

function getRoundLabel(round) {
  return roundOptions.find((option) => option.value === round)?.label ?? "Mock Interview";
}

function getPressureLabel(pressure) {
  const labels = {
    1: "Warm-up",
    2: "Hiring manager",
    3: "Panel",
    4: "Bar raiser"
  };

  return labels[pressure] ?? "Hiring manager";
}

function formatDuration(totalSeconds) {
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
}

function formatRecordDate(isoString) {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric"
  }).format(new Date(isoString));
}

function parseRepositoryUrl(url) {
  try {
    const parsed = new URL(url);
    const host = parsed.hostname.replace(/^www\./, "").toLowerCase();
    const supportedHosts = ["github.com", "gitlab.com", "bitbucket.org"];
    const segments = parsed.pathname.split("/").filter(Boolean);

    if (!supportedHosts.includes(host) || segments.length < 2) {
      return null;
    }

    return {
      host,
      owner: segments[0],
      repo: segments[1].replace(/\.git$/i, "")
    };
  } catch {
    return null;
  }
}

function buildRepoTheme(repoName) {
  const normalized = repoName.toLowerCase();

  if (
    normalized.includes("ui") ||
    normalized.includes("web") ||
    normalized.includes("front") ||
    normalized.includes("react") ||
    normalized.includes("dashboard")
  ) {
    return {
      lens: "Frontend system design",
      summary:
        "This repo looks like a customer-facing web application, so the interview will probe state boundaries, UI performance, accessibility, and component ownership.",
      stack: ["React architecture", "State orchestration", "Accessibility", "Rendering performance"],
      hotspots: ["Component boundaries", "Data-fetch tradeoffs", "Design system quality"],
      standout: ["Narrate a user flow", "Explain state ownership", "Mention performance budgets"],
      themes: ["UX tradeoffs", "State strategy", "Release quality"]
    };
  }

  if (
    normalized.includes("api") ||
    normalized.includes("server") ||
    normalized.includes("backend") ||
    normalized.includes("auth") ||
    normalized.includes("service")
  ) {
    return {
      lens: "Backend reliability review",
      summary:
        "This repo reads like a service layer, so the interview will focus on reliability, contracts, scaling, and how you handle bad states under load.",
      stack: ["API boundaries", "Database design", "Caching", "Observability"],
      hotspots: ["Failure handling", "Data consistency", "Latency management"],
      standout: ["State the SLA", "Explain fallback paths", "Talk through monitoring"],
      themes: ["Reliability decisions", "Scaling strategy", "Operational ownership"]
    };
  }

  if (
    normalized.includes("ai") ||
    normalized.includes("ml") ||
    normalized.includes("llm") ||
    normalized.includes("gpt") ||
    normalized.includes("model")
  ) {
    return {
      lens: "AI product integration review",
      summary:
        "This repo appears AI-heavy, so the interview will go after evaluation loops, model tradeoffs, prompt design, latency, and trust or safety decisions.",
      stack: ["Model orchestration", "Evaluation", "Prompt design", "Guardrails"],
      hotspots: ["Output quality", "Hallucination handling", "Latency versus cost"],
      standout: ["Define quality metrics", "Explain fallback behavior", "Show user safety thinking"],
      themes: ["Model quality", "Evaluation design", "Human trust"]
    };
  }

  if (
    normalized.includes("shop") ||
    normalized.includes("checkout") ||
    normalized.includes("cart") ||
    normalized.includes("commerce")
  ) {
    return {
      lens: "Commerce product deep dive",
      summary:
        "This repo suggests transactional flows, so the interview will focus on reliability, conversion, trust, and how engineering choices map to business outcomes.",
      stack: ["Checkout flow", "Payment resilience", "Experimentation", "Performance"],
      hotspots: ["Drop-off points", "Recovery paths", "Experiment impact"],
      standout: ["Name key metrics", "Explain trust considerations", "Tie work to revenue outcomes"],
      themes: ["Conversion impact", "Operational rigor", "Experiment learning"]
    };
  }

  if (
    normalized.includes("data") ||
    normalized.includes("etl") ||
    normalized.includes("analytics") ||
    normalized.includes("pipeline")
  ) {
    return {
      lens: "Data platform interview",
      summary:
        "This repo looks data-oriented, so the interview will likely cover lineage, consistency, throughput, and how consumers trust the generated outputs.",
      stack: ["Pipelines", "Schemas", "Quality checks", "Consumption patterns"],
      hotspots: ["Freshness", "Backfills", "Schema changes"],
      standout: ["Explain lineage", "Call out contracts", "Mention quality thresholds"],
      themes: ["Data trust", "Pipeline scale", "Consumer ownership"]
    };
  }

  return {
    lens: "Full-stack delivery review",
    summary:
      "This repo looks like a full-stack product, so the interview will blend customer framing, architecture choices, tradeoffs, and execution quality.",
    stack: ["Frontend", "Backend", "Testing", "Delivery workflow"],
    hotspots: ["Boundary decisions", "Feature prioritization", "Execution quality"],
    standout: ["Start with the problem", "Call out tradeoffs", "Quantify the impact"],
    themes: ["Product thinking", "Engineering judgment", "Execution clarity"]
  };
}

function buildRepoProfile(url) {
  const parsed = parseRepositoryUrl(url);

  if (!parsed) {
    return null;
  }

  const repoName = `${parsed.owner}/${parsed.repo}`;
  const theme = buildRepoTheme(parsed.repo);
  const seed = hashString(repoName);

  return {
    linked: true,
    repoUrl: url,
    repoName,
    lens: theme.lens,
    summary: theme.summary,
    stack: theme.stack,
    hotspots: theme.hotspots,
    standout: theme.standout,
    themes: theme.themes,
    scorecard: {
      architecture: 70 + (seed % 18),
      reliability: 68 + ((seed >> 2) % 20),
      product: 72 + ((seed >> 4) % 17),
      execution: 71 + ((seed >> 6) % 18)
    },
    questionSeeds: [
      `Give me a crisp walkthrough of ${repoName}. What problem does it solve and how is it structured?`,
      `Which part of ${repoName} would you defend most strongly in a code review, and why?`,
      `If traffic or usage doubled tomorrow, what would break first in ${repoName}?`
    ]
  };
}

function generateQuestionSet(repoProfile, settings) {
  const repoName = repoProfile.linked ? repoProfile.repoName : "your most relevant project";
  const pressurePrompt = {
    1: "Keep the answer concise and user-focused.",
    2: "Call out the tradeoffs and how you validated the decision.",
    3: "Assume a skeptical panel asks for evidence and alternatives.",
    4: "Defend the decision under strong pushback and show leadership judgment."
  }[settings.pressure];

  const rolePrompt = {
    fullstack: `Where did you draw the boundary between client and server in ${repoName}, and what tradeoffs came with it?`,
    frontend: `How did you keep ${repoName} responsive, accessible, and maintainable as the UI grew?`,
    backend: `What reliability mechanisms matter most in ${repoName}, and how would you prove they work?`,
    ai: `How would you evaluate the quality and trustworthiness of the AI-driven parts of ${repoName}?`
  }[settings.role];

  const rounds = {
    project: [
      `Walk me through ${repoName} like I just joined the team yesterday. What matters most first?`,
      rolePrompt,
      `Tell me about one hard tradeoff you made in ${repoName}. What did you optimize for and what did you accept?`,
      `What metrics or signals told you the project was working, and which signal would make you worry?`,
      `If you owned the next release for ${repoName}, what would you improve in the next 30 days?`
    ],
    system: [
      `Describe the architecture of ${repoName}. How do the major pieces talk to each other?`,
      `Where are the scaling or latency risks in ${repoName}, and how would you harden them?`,
      `Which design decision in ${repoName} would become painful at 10x usage?`,
      `How would you monitor and debug a production incident in this system?`,
      `What would you refactor first if reliability became the primary goal?`
    ],
    behavioral: [
      `Tell me about a moment in ${repoName} when you had incomplete information but still had to move forward.`,
      `Describe a disagreement on direction for ${repoName}. How did you handle it?`,
      `When did you take ownership of a messy problem related to ${repoName}?`,
      `Share an example where you changed your mind during the project. What evidence caused it?`,
      `What did you learn from shipping ${repoName} that changed how you build now?`
    ],
    bar: [
      `Pretend I am a bar raiser. Why should I trust you with a critical project like ${repoName}?`,
      `What decision in ${repoName} would you challenge if you inherited it today?`,
      `Tell me about the biggest risk you knowingly accepted in ${repoName}.`,
      `How did you simplify the project when complexity started to grow faster than value?`,
      `What is the strongest criticism an interviewer could make about ${repoName}, and how would you respond?`
    ]
  };

  const prompts = rounds[settings.round] ?? rounds.project;

  return prompts.map((prompt, index) => ({
    id: `${settings.round}-${index + 1}`,
    prompt,
    followUps: [
      repoProfile.themes[index % repoProfile.themes.length],
      repoProfile.hotspots[index % repoProfile.hotspots.length],
      `${getPressureLabel(settings.pressure)} follow-up: ${pressurePrompt}`
    ]
  }));
}

function countWords(text) {
  const cleaned = text.trim();
  return cleaned ? cleaned.split(/\s+/).length : 0;
}

function countFillerWords(text) {
  const matches =
    text
      .toLowerCase()
      .match(/\b(um|uh|like|actually|basically|literally|you know|sort of|kind of)\b/g) ?? [];

  return matches.length;
}

function extractImpactSignals(text) {
  const matches =
    text.match(
      /\b\d+(?:\.\d+)?(?:%|x|ms|s|sec|seconds|minutes|hours|users|req\/s|qps)?\b|\b(latency|conversion|retention|revenue|adoption|uptime|cost|throughput|availability|p95|p99|sla|nps|error rate)\b/gi
    ) ?? [];

  return [...new Set(matches.map((item) => item.trim()))].slice(0, 6);
}

function computeMetrics(text, questionSeconds, repoProfile) {
  const words = countWords(text);

  if (!words) {
    return {
      clarity: 0,
      depth: 0,
      ownership: 0,
      delivery: 0,
      confidence: 0,
      overall: 0,
      fillerCount: 0,
      pace: "Waiting",
      wpm: 0,
      evidence: []
    };
  }

  const normalized = text.toLowerCase();
  const fillerCount = countFillerWords(text);
  const evidence = extractImpactSignals(text);
  const structureHits = [
    "first",
    "then",
    "because",
    "result",
    "impact",
    "tradeoff",
    "before",
    "after",
    "finally",
    "measured",
    "learned"
  ].filter((keyword) => normalized.includes(keyword)).length;
  const repoHits = [...repoProfile.stack, ...repoProfile.hotspots].filter((keyword) =>
    normalized.includes(keyword.toLowerCase().split(" ")[0])
  ).length;
  const ownershipHits = (normalized.match(/\b(i|my|mine|we|our|owned|led|decided|drove)\b/g) ?? []).length;
  const wpm = questionSeconds > 0 ? Math.round((words / questionSeconds) * 60) : words * 10;

  let pace = "Optimal";

  if (wpm < 95) {
    pace = "Slow";
  } else if (wpm > 170) {
    pace = "Fast";
  }

  const clarity = clamp(58 + structureHits * 6 + Math.min(words, 180) / 10 - fillerCount * 3, 32, 98);
  const depth = clamp(50 + repoHits * 8 + evidence.length * 6 + (repoProfile.linked ? 6 : 0), 28, 98);
  const ownership = clamp(48 + Math.min(ownershipHits, 10) * 3 + evidence.length * 4, 28, 99);
  const delivery = clamp(82 - Math.abs(wpm - 138) / 2 - fillerCount * 2, 30, 98);
  const confidence = clamp((clarity + depth + ownership + delivery) / 4 + (evidence.length > 0 ? 3 : 0), 30, 99);
  const overall = clamp((clarity + depth + ownership + delivery) / 4, 30, 99);

  return {
    clarity,
    depth,
    ownership,
    delivery,
    confidence,
    overall,
    fillerCount,
    pace,
    wpm,
    evidence
  };
}

function buildCoach(metrics, repoProfile) {
  if (!metrics.overall) {
    return {
      strengths: ["Repo-aware prompts are ready", "Voice and video tools can be enabled", "Records tracking is live"],
      improvements: [
        "Start a session and answer the first question out loud",
        "Use impact numbers or timelines in your answer",
        repoProfile.linked ? "Mention concrete components from the linked repo" : "Link a repo for sharper technical prompts"
      ],
      summary: "Your live coaching panel will populate as soon as an answer is captured."
    };
  }

  const strengths = [];
  const improvements = [];

  if (metrics.clarity >= 78) {
    strengths.push("Your answer structure is easy to follow.");
  }
  if (metrics.depth >= 76) {
    strengths.push("You are naming technical tradeoffs instead of staying generic.");
  }
  if (metrics.ownership >= 76) {
    strengths.push("Your wording shows ownership and decision-making, not just participation.");
  }
  if (metrics.delivery >= 74) {
    strengths.push("Your pacing is close to interview-ready.");
  }

  if (metrics.clarity < 75) {
    improvements.push("Open with the problem, then walk through the decision and result.");
  }
  if (metrics.depth < 75) {
    improvements.push("Use repo-specific components, constraints, and tradeoffs to deepen the answer.");
  }
  if (metrics.ownership < 75) {
    improvements.push("Say what you drove, decided, or changed personally.");
  }
  if (metrics.fillerCount > 4) {
    improvements.push("Pause between points instead of filling space with placeholder words.");
  }
  if (!metrics.evidence.length) {
    improvements.push("Add a number, timeline, or measurable outcome so the answer feels grounded.");
  }

  return {
    strengths: strengths.slice(0, 3),
    improvements: improvements.slice(0, 3),
    summary:
      improvements[0] ??
      "Your answer is trending well. Keep tightening the opening and defend each tradeoff with evidence."
  };
}

function summarizeSession(answerSnapshots) {
  if (!answerSnapshots.length) {
    return {
      overall: 0,
      confidence: 0,
      clarity: 0,
      depth: 0,
      ownership: 0,
      delivery: 0,
      strengths: ["No saved answers yet"],
      improvements: ["Record at least one answer to generate a session report"],
      keyInsight: "Finish at least one question to store a replayable record.",
      evidence: []
    };
  }

  const metrics = answerSnapshots.map((answer) => answer.metrics);
  const mergedEvidence = [...new Set(answerSnapshots.flatMap((answer) => answer.signals))].slice(0, 6);
  const clarity = average(metrics.map((metric) => metric.clarity));
  const depth = average(metrics.map((metric) => metric.depth));
  const ownership = average(metrics.map((metric) => metric.ownership));
  const delivery = average(metrics.map((metric) => metric.delivery));
  const confidence = average(metrics.map((metric) => metric.confidence));
  const overall = average(metrics.map((metric) => metric.overall));
  const fillerAverage = average(metrics.map((metric) => metric.fillerCount));
  const strengths = [];
  const improvements = [];

  if (clarity >= 78) {
    strengths.push("Answers were well-structured and easy to track.");
  }
  if (depth >= 78) {
    strengths.push("Technical discussion had useful detail and tradeoff depth.");
  }
  if (ownership >= 78) {
    strengths.push("You sounded accountable for outcomes and decision-making.");
  }
  if (delivery >= 75) {
    strengths.push("Delivery stayed controlled across the loop.");
  }

  if (clarity < 76) {
    improvements.push("Tighten your first 30 seconds so each answer starts stronger.");
  }
  if (depth < 76) {
    improvements.push("Bring in more architecture detail, constraints, and measurable reasoning.");
  }
  if (ownership < 76) {
    improvements.push("Use more direct ownership language when describing your contributions.");
  }
  if (fillerAverage > 4) {
    improvements.push("Reduce filler words by pausing before your next point.");
  }
  if (!mergedEvidence.length) {
    improvements.push("Include more numbers, timelines, and business outcomes.");
  }

  return {
    overall,
    confidence,
    clarity,
    depth,
    ownership,
    delivery,
    strengths: strengths.slice(0, 3),
    improvements: improvements.slice(0, 3),
    keyInsight:
      improvements[0] ??
      "You are close to interview-ready. Keep reinforcing decisions with evidence and customer impact.",
    evidence: mergedEvidence
  };
}

function ScoreBar({ label, value }) {
  return (
    <div className="score-row">
      <div className="score-label-row">
        <span>{label}</span>
        <strong>{value}%</strong>
      </div>
      <div className="score-track">
        <div className="score-fill" style={{ width: `${value}%` }}></div>
      </div>
    </div>
  );
}

function FeatureCard({ tag, title, copy }) {
  return (
    <article className="feature-card">
      <span className="feature-tag">{tag}</span>
      <h3>{title}</h3>
      <p>{copy}</p>
    </article>
  );
}

function RecordCard({ record }) {
  return (
    <article className="record-card">
      <div className="record-topline">
        <div>
          <p className="eyebrow">Session Record</p>
          <h3>{record.repo}</h3>
        </div>
        <span className="score-pill">{record.overall}% overall</span>
      </div>

      <div className="record-meta">
        <span>{formatRecordDate(record.date)}</span>
        <span>{record.role}</span>
        <span>{record.round}</span>
      </div>

      <div className="record-grid">
        <ScoreBar label="Clarity" value={record.clarity} />
        <ScoreBar label="Depth" value={record.depth} />
        <ScoreBar label="Ownership" value={record.ownership} />
        <ScoreBar label="Delivery" value={record.delivery} />
      </div>

      <div className="record-lists">
        <div>
          <p className="mini-heading">Strengths</p>
          <ul className="bullet-list">
            {record.strengths.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </div>

        <div>
          <p className="mini-heading">Improve Next</p>
          <ul className="bullet-list">
            {record.improvements.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </div>
      </div>

      <div className="evidence-ledger">
        {record.evidence.map((item) => (
          <span key={item} className="signal-chip">
            {item}
          </span>
        ))}
      </div>
    </article>
  );
}

export default function App() {
  const [user, setUser] = useState(() => readStoredValue(STORAGE_KEYS.auth, null));
  const [records, setRecords] = useState(() => readStoredValue(STORAGE_KEYS.records, seededRecords));
  const [activeSection, setActiveSection] = useState("home");
  const [authForm, setAuthForm] = useState({
    name: "",
    email: "",
    password: ""
  });
  const [authMessage, setAuthMessage] = useState({
    text: "Use any name, email, and password to enter the prototype.",
    type: ""
  });
  const [repoUrl, setRepoUrl] = useState("");
  const [repoProfile, setRepoProfile] = useState(defaultRepoProfile);
  const [repoFeedback, setRepoFeedback] = useState({
    text: "Paste a GitHub, GitLab, or Bitbucket repo URL to tailor the interview.",
    type: ""
  });
  const [settings, setSettings] = useState(defaultSettings);
  const [questionSet, setQuestionSet] = useState(() => generateQuestionSet(defaultRepoProfile, defaultSettings));
  const [session, setSession] = useState(initialSession);
  const [answerText, setAnswerText] = useState("");
  const [interimText, setInterimText] = useState("");
  const [studioMessage, setStudioMessage] = useState(
    "Configure the loop, link a repo, and start a mock interview when you are ready."
  );
  const [contactForm, setContactForm] = useState(defaultContact);
  const [contactMessage, setContactMessage] = useState("");
  const [speechSupported, setSpeechSupported] = useState(false);
  const [speechStatus, setSpeechStatus] = useState(
    "Checking whether browser voice transcription is available..."
  );
  const [isListening, setIsListening] = useState(false);
  const [cameraStatus, setCameraStatus] = useState("Camera preview is off.");
  const [latestSession, setLatestSession] = useState(() => {
    const firstRecord = readStoredValue(STORAGE_KEYS.records, seededRecords)[0];
    return firstRecord ?? null;
  });

  const recognitionRef = useRef(null);
  const videoRef = useRef(null);
  const streamRef = useRef(null);

  const draftQuestions = useMemo(
    () => generateQuestionSet(repoProfile, settings),
    [repoProfile, settings]
  );
  const activeQuestions = session.active ? questionSet : draftQuestions;
  const currentQuestion = activeQuestions[session.currentQuestionIndex] ?? activeQuestions[0];
  const timerText = formatDuration(session.elapsedSeconds);
  const questionTimerText = formatDuration(session.questionSeconds);
  const liveText = `${answerText} ${interimText}`.trim();
  const liveMetrics = useMemo(
    () => computeMetrics(liveText, session.questionSeconds, repoProfile),
    [liveText, session.questionSeconds, repoProfile]
  );
  const coach = useMemo(() => buildCoach(liveMetrics, repoProfile), [liveMetrics, repoProfile]);
  const questionProgress = activeQuestions.length
    ? Math.round(
        ((Math.min(session.currentQuestionIndex, activeQuestions.length - 1) + (session.active ? 1 : 0)) /
          activeQuestions.length) *
          100
      )
    : 0;
  const averageRecordScore = records.length ? average(records.map((record) => record.overall)) : 0;
  const bestRecord = records.reduce(
    (best, record) => (record.overall > best.overall ? record : best),
    records[0] ?? seededRecords[0]
  );
  const previousRecord = records[1] ?? null;
  const scoreDelta =
    latestSession && previousRecord ? latestSession.overall - previousRecord.overall : 0;

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    if (user) {
      window.localStorage.setItem(STORAGE_KEYS.auth, JSON.stringify(user));
    } else {
      window.localStorage.removeItem(STORAGE_KEYS.auth);
    }
  }, [user]);

  useEffect(() => {
    if (typeof window !== "undefined") {
      window.localStorage.setItem(STORAGE_KEYS.records, JSON.stringify(records));
    }
  }, [records]);

  useEffect(() => {
    if (!session.active) {
      return undefined;
    }

    const timerId = window.setInterval(() => {
      setSession((current) => ({
        ...current,
        elapsedSeconds: current.elapsedSeconds + 1,
        questionSeconds: current.questionSeconds + 1
      }));
    }, 1000);

    return () => window.clearInterval(timerId);
  }, [session.active]);

  useEffect(() => {
    if (typeof window === "undefined") {
      return undefined;
    }

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      setSpeechStatus("Browser voice transcription is unavailable here. Type answers manually if needed.");
      return undefined;
    }

    const recognition = new SpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = "en-US";

    recognition.onstart = () => {
      setIsListening(true);
      setSpeechStatus("Listening now. Speak naturally and ProjectLens will transcribe live.");
    };

    recognition.onresult = (event) => {
      let interim = "";
      let finalTranscript = "";

      for (let index = event.resultIndex; index < event.results.length; index += 1) {
        const transcript = event.results[index][0]?.transcript ?? "";

        if (event.results[index].isFinal) {
          finalTranscript += `${transcript} `;
        } else {
          interim += transcript;
        }
      }

      if (finalTranscript.trim()) {
        setAnswerText((current) =>
          `${current}${current && !current.endsWith(" ") ? " " : ""}${finalTranscript.trim()}`.trim()
        );
      }

      setInterimText(interim.trim());
    };

    recognition.onerror = (event) => {
      setIsListening(false);
      setInterimText("");
      setSpeechStatus(`Voice input issue: ${event.error}. You can keep typing and continue the mock.`);
    };

    recognition.onend = () => {
      setIsListening(false);
      setInterimText("");
      setSpeechStatus("Voice capture ready. Start again whenever you want to continue speaking.");
    };

    recognitionRef.current = recognition;
    setSpeechSupported(true);
    setSpeechStatus("Voice capture ready. Start a session to transcribe your answers.");

    return () => {
      recognition.onstart = null;
      recognition.onresult = null;
      recognition.onerror = null;
      recognition.onend = null;

      try {
        recognition.stop();
      } catch {
        // Ignore cleanup failures for browsers that already stopped recognition.
      }
    };
  }, []);

  useEffect(() => {
    async function startCameraPreview() {
      if (!session.active || !settings.videoEnabled) {
        if (streamRef.current) {
          streamRef.current.getTracks().forEach((track) => track.stop());
          streamRef.current = null;
        }

        if (videoRef.current) {
          videoRef.current.srcObject = null;
        }

        setCameraStatus("Camera preview is off.");
        return;
      }

      if (!navigator.mediaDevices?.getUserMedia) {
        setCameraStatus("This browser cannot open a camera preview.");
        return;
      }

      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { width: 1280, height: 720 },
          audio: false
        });

        streamRef.current = stream;

        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }

        setCameraStatus("Camera preview live. Use this to rehearse eye contact and posture.");
      } catch {
        setCameraStatus("Camera access was blocked or unavailable.");
      }
    }

    startCameraPreview();

    return () => {
      if (!session.active && streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop());
        streamRef.current = null;
      }
    };
  }, [session.active, settings.videoEnabled]);

  function stopListening() {
    if (!recognitionRef.current || !isListening) {
      return;
    }

    try {
      recognitionRef.current.stop();
    } catch {
      setSpeechStatus("Voice capture stopped.");
    }
  }

  function stopCameraPreview() {
    if (!streamRef.current) {
      return;
    }

    streamRef.current.getTracks().forEach((track) => track.stop());
    streamRef.current = null;

    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }

    setCameraStatus("Camera preview is off.");
  }

  function handleAuthChange(event) {
    const { name, value } = event.target;
    setAuthForm((current) => ({ ...current, [name]: value }));
  }

  function handleLogin(event) {
    event.preventDefault();

    if (!authForm.name.trim() || !authForm.email.trim() || !authForm.password.trim()) {
      setAuthMessage({
        text: "Add your name, email, and password to unlock the dashboard.",
        type: "error"
      });
      return;
    }

    setUser({
      name: authForm.name.trim(),
      email: authForm.email.trim()
    });
    setAuthMessage({
      text: "Login successful. Your interview workspace is ready.",
      type: "success"
    });
    setActiveSection("home");
  }

  function handleLogout() {
    stopListening();
    stopCameraPreview();
    setUser(null);
    setSession(initialSession);
    setAnswerText("");
    setInterimText("");
    setSettings(defaultSettings);
    setActiveSection("home");
  }

  function handleSettingChange(event) {
    const { name, value, type, checked } = event.target;
    const nextValue =
      type === "checkbox" ? checked : name === "duration" || name === "pressure" ? Number(value) : value;

    setSettings((current) => ({
      ...current,
      [name]: nextValue
    }));
  }

  function handleRepoSubmit(event) {
    event.preventDefault();

    const profile = buildRepoProfile(repoUrl.trim());

    if (!profile) {
      setRepoFeedback({
        text: "Enter a valid GitHub, GitLab, or Bitbucket repository URL such as https://github.com/owner/project.",
        type: "error"
      });
      return;
    }

    setRepoProfile(profile);
    setRepoFeedback({
      text: `${profile.repoName} linked. ProjectLens refreshed the architecture lens, hotspots, and question prompts.`,
      type: "success"
    });
    setStudioMessage("Repo context updated. Start a new mock loop to interview against this codebase.");
  }

  function startSession() {
    const nextQuestions = generateQuestionSet(repoProfile, settings);
    setQuestionSet(nextQuestions);
    setSession({
      active: true,
      elapsedSeconds: 0,
      questionSeconds: 0,
      currentQuestionIndex: 0,
      answers: [],
      summary: null
    });
    setAnswerText("");
    setInterimText("");
    setStudioMessage("Interview live. Answer the question, save it, and move through the loop like a real panel.");
    setActiveSection("dashboard");
  }

  function toggleVoiceCapture() {
    if (!session.active) {
      setSpeechStatus("Start a session before turning on voice capture.");
      return;
    }

    if (!speechSupported) {
      setSpeechStatus("Voice capture is unavailable in this browser. You can still type answers below.");
      return;
    }

    if (isListening) {
      stopListening();
      return;
    }

    try {
      recognitionRef.current?.start();
    } catch {
      setSpeechStatus("Voice capture is already starting. Give it a moment and try again.");
    }
  }

  function buildCurrentSnapshot() {
    const question = questionSet[session.currentQuestionIndex] ?? currentQuestion;
    const metrics = computeMetrics(liveText, Math.max(session.questionSeconds, 1), repoProfile);

    return {
      id: createId(),
      question: question.prompt,
      followUps: question.followUps,
      answer: liveText,
      metrics,
      signals: metrics.evidence
    };
  }

  function finalizeSession(savedAnswers) {
    stopListening();
    stopCameraPreview();

    const summary = summarizeSession(savedAnswers);
    const record = {
      id: createId(),
      date: new Date().toISOString(),
      role: getRoleLabel(settings.role),
      round: getRoundLabel(settings.round),
      repo: repoProfile.linked ? repoProfile.repoName : "General mock loop",
      overall: summary.overall,
      confidence: summary.confidence,
      clarity: summary.clarity,
      depth: summary.depth,
      ownership: summary.ownership,
      delivery: summary.delivery,
      strengths: summary.strengths,
      improvements: summary.improvements,
      keyInsight: summary.keyInsight,
      evidence: summary.evidence
    };

    if (savedAnswers.length) {
      setRecords((current) => [record, ...current].slice(0, 12));
      setLatestSession(record);
    }

    setSession({
      active: false,
      elapsedSeconds: 0,
      questionSeconds: 0,
      currentQuestionIndex: 0,
      answers: savedAnswers,
      summary: savedAnswers.length ? record : null
    });
    setAnswerText("");
    setInterimText("");
    setSettings((current) => ({ ...current, videoEnabled: false }));
    setStudioMessage(
      savedAnswers.length
        ? "Session complete. Your replayable report and improvement notes were saved to Records."
        : "Session ended. Save at least one answer next time to create a record."
    );
  }

  function saveAndContinue() {
    if (!session.active) {
      return;
    }

    const trimmed = liveText.trim();

    if (!trimmed) {
      setStudioMessage("Capture a spoken or typed answer before moving to the next question.");
      return;
    }

    stopListening();
    const snapshot = buildCurrentSnapshot();
    const nextAnswers = [...session.answers, snapshot];
    const isLastQuestion = session.currentQuestionIndex >= questionSet.length - 1;

    if (isLastQuestion) {
      finalizeSession(nextAnswers);
      return;
    }

    setSession((current) => ({
      ...current,
      answers: nextAnswers,
      currentQuestionIndex: current.currentQuestionIndex + 1,
      questionSeconds: 0
    }));
    setAnswerText("");
    setInterimText("");
    setStudioMessage("Answer saved. The next question and follow-ups are ready.");
  }

  function finishSessionNow() {
    if (!session.active) {
      return;
    }

    const nextAnswers = [...session.answers];

    if (liveText.trim()) {
      nextAnswers.push(buildCurrentSnapshot());
    }

    finalizeSession(nextAnswers);
  }

  function clearCurrentAnswer() {
    setAnswerText("");
    setInterimText("");
    setStudioMessage("Current draft cleared. You can speak again or rewrite the answer.");
  }

  function handleContactChange(event) {
    const { name, value } = event.target;
    setContactForm((current) => ({ ...current, [name]: value }));
  }

  function handleContactSubmit(event) {
    event.preventDefault();

    if (!contactForm.name.trim() || !contactForm.email.trim() || !contactForm.message.trim()) {
      setContactMessage("Complete all contact fields before sending your message.");
      return;
    }

    setContactMessage("Message sent. In a real product this would reach the support or product team.");
    setContactForm(defaultContact);
  }

  const authView = (
    <section className="auth-shell">
      <div className="auth-layout">
        <div className="auth-copy card dark-panel">
          <div className="brand-lockup">
            <img src="/brand-mark.svg" alt="ProjectLens logo" className="brand-mark" />
            <div>
              <p className="eyebrow amber">ProjectLens Interview OS</p>
              <h1>Practice the exact interview loop your Git repo deserves.</h1>
            </div>
          </div>

          <p className="hero-copy-text">
            A frontend prototype for repo-aware mock interviews with live voice transcription,
            camera rehearsal, performance scorecards, and replayable coaching insights.
          </p>

          <div className="hero-stat-grid">
            <div className="hero-stat">
              <strong>Repo-aware</strong>
              <span>Questions adapt to the linked project</span>
            </div>
            <div className="hero-stat">
              <strong>Voice + Video</strong>
              <span>Browser microphone and camera practice tools</span>
            </div>
            <div className="hero-stat">
              <strong>Replay Records</strong>
              <span>Trend tracking across multiple mock loops</span>
            </div>
          </div>

          <div className="auth-preview-list">
            <div className="preview-tile">
              <p className="mini-heading">Unique angle</p>
              <h3>Pressure Dial</h3>
              <p>Move from warm-up to bar raiser mode and the follow-ups get sharper.</p>
            </div>
            <div className="preview-tile">
              <p className="mini-heading">What it catches</p>
              <h3>Evidence gaps</h3>
              <p>The Evidence Ledger shows whether you used numbers, outcomes, and ownership.</p>
            </div>
          </div>
        </div>

        <form className="auth-card card" onSubmit={handleLogin} noValidate>
          <p className="eyebrow">Login</p>
          <h2>Enter your interview workspace</h2>
          <p className="section-copy">
            Sign in to open the landing page, dashboard, records tracker, and coaching panels.
          </p>

          <label className="field">
            <span>Name</span>
            <input
              name="name"
              type="text"
              placeholder="Rishabh"
              value={authForm.name}
              onChange={handleAuthChange}
            />
          </label>

          <label className="field">
            <span>Email</span>
            <input
              name="email"
              type="email"
              placeholder="you@example.com"
              value={authForm.email}
              onChange={handleAuthChange}
            />
          </label>

          <label className="field">
            <span>Password</span>
            <input
              name="password"
              type="password"
              placeholder="Enter password"
              value={authForm.password}
              onChange={handleAuthChange}
            />
          </label>

          <button type="submit" className="primary-btn full-width">
            Sign In
          </button>
          <p className={`helper-text ${authMessage.type}`.trim()}>{authMessage.text}</p>
        </form>
      </div>
    </section>
  );

  const homeView = (
    <section className="page-stack">
      <section className="hero-grid">
        <div className="hero-main card">
          <p className="eyebrow">Amazon-inspired simple UI</p>
          <h2>Mock interviews that feel closer to a real hiring loop than a plain chat.</h2>
          <p className="section-copy">
            Link a code repository, choose the interview mode, practice with voice or video, and
            leave with replayable scorecards that show how your answers are changing over time.
          </p>

          <div className="hero-actions">
            <button type="button" className="primary-btn" onClick={() => setActiveSection("dashboard")}>
              Open Dashboard
            </button>
            <button type="button" className="secondary-btn" onClick={() => setActiveSection("records")}>
              View Records
            </button>
          </div>

          <div className="pill-row">
            <span className="pill">Git repo input</span>
            <span className="pill">Voice transcription</span>
            <span className="pill">Camera rehearsal</span>
            <span className="pill">Performance coaching</span>
          </div>
        </div>

        <aside className="hero-side card spotlight-card">
          <p className="mini-heading">Live snapshot</p>
          <div className="snapshot-row">
            <span>Pressure</span>
            <strong>{getPressureLabel(settings.pressure)}</strong>
          </div>
          <div className="snapshot-row">
            <span>Session plan</span>
            <strong>{settings.duration} minutes</strong>
          </div>
          <div className="snapshot-row">
            <span>Records saved</span>
            <strong>{records.length}</strong>
          </div>
          <div className="snapshot-row">
            <span>Latest score</span>
            <strong>{latestSession?.overall ?? 0}%</strong>
          </div>
          <div className="callout-box">
            <p>
              Different from a normal chatbot: ProjectLens builds repo context, pressure-based
              follow-ups, evidence tracking, and replayable scorecards into one focused flow.
            </p>
          </div>
        </aside>
      </section>

      <section className="section-block">
        <div className="section-heading">
          <p className="eyebrow">Core features</p>
          <h2>Main product features on the web app</h2>
        </div>
        <div className="feature-grid">
          {homeFeatures.map((feature) => (
            <FeatureCard key={feature.title} {...feature} />
          ))}
        </div>
      </section>

      <section className="section-block">
        <div className="section-heading">
          <p className="eyebrow">Why this feels different</p>
          <h2>Unique details that separate it from typical interview apps</h2>
        </div>
        <div className="difference-grid">
          {uniqueFeatures.map((item) => (
            <article key={item.title} className="difference-card card">
              <h3>{item.title}</h3>
              <p>{item.copy}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="section-block workflow-panel card">
        <div className="section-heading">
          <p className="eyebrow">How it works</p>
          <h2>Fast interview workflow</h2>
        </div>

        <div className="workflow-grid">
          <article>
            <span className="step-badge">01</span>
            <h3>Link a repository</h3>
            <p>The repo analyzer creates a project lens, hotspot map, and tailored prompts.</p>
          </article>
          <article>
            <span className="step-badge">02</span>
            <h3>Run the mock loop</h3>
            <p>Choose pressure level, answer out loud, and let the app surface follow-up angles.</p>
          </article>
          <article>
            <span className="step-badge">03</span>
            <h3>Replay your performance</h3>
            <p>Review score movement, evidence usage, strengths, and next-practice priorities.</p>
          </article>
        </div>
      </section>
    </section>
  );

  const dashboardView = (
    <section className="page-stack">
      <section className="dashboard-header-row">
        <div>
          <p className="eyebrow">Dashboard</p>
          <h2>Interview studio and performance control center</h2>
          <p className="section-copy">{studioMessage}</p>
        </div>
        <div className="timer-card card">
          <span>Session timer</span>
          <strong>{timerText}</strong>
          <small>Question timer {questionTimerText}</small>
        </div>
      </section>

      <div className="summary-grid">
        <article className="summary-card card">
          <p className="mini-heading">Repo lens</p>
          <strong>{repoProfile.repoName}</strong>
          <span>{repoProfile.lens}</span>
        </article>
        <article className="summary-card card">
          <p className="mini-heading">Role track</p>
          <strong>{getRoleLabel(settings.role)}</strong>
          <span>{getRoundLabel(settings.round)}</span>
        </article>
        <article className="summary-card card">
          <p className="mini-heading">Pressure dial</p>
          <strong>{getPressureLabel(settings.pressure)}</strong>
          <span>{settings.duration}-minute loop</span>
        </article>
        <article className="summary-card card">
          <p className="mini-heading">Signal replay</p>
          <strong>{latestSession?.overall ?? 0}%</strong>
          <span>{scoreDelta >= 0 ? `+${scoreDelta}` : scoreDelta}% versus previous saved record</span>
        </article>
      </div>

      <div className="dashboard-grid">
        <div className="dashboard-main">
          <article className="card setup-card">
            <div className="card-header">
              <div>
                <p className="mini-heading">Interview setup</p>
                <h3>Shape the mock loop before you begin</h3>
              </div>
              <div className="control-cluster">
                <button
                  type="button"
                  className="primary-btn"
                  onClick={startSession}
                  disabled={session.active}
                >
                  {session.active ? "Loop Running" : "Start Interview"}
                </button>
                <button
                  type="button"
                  className="secondary-btn"
                  onClick={finishSessionNow}
                  disabled={!session.active}
                >
                  Finish Loop
                </button>
              </div>
            </div>

            <div className="form-grid">
              <label className="field">
                <span>Role</span>
                <select name="role" value={settings.role} onChange={handleSettingChange}>
                  {roleOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </label>

              <label className="field">
                <span>Round type</span>
                <select name="round" value={settings.round} onChange={handleSettingChange}>
                  {roundOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </label>

              <label className="field">
                <span>Duration</span>
                <select name="duration" value={settings.duration} onChange={handleSettingChange}>
                  {durationOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </label>

              <label className="field range-field">
                <span>Pressure dial: {getPressureLabel(settings.pressure)}</span>
                <input
                  name="pressure"
                  type="range"
                  min="1"
                  max="4"
                  value={settings.pressure}
                  onChange={handleSettingChange}
                />
              </label>
            </div>

            <div className="toggle-row">
              <label className="toggle-chip">
                <input
                  name="voiceEnabled"
                  type="checkbox"
                  checked={settings.voiceEnabled}
                  onChange={handleSettingChange}
                />
                <span>Voice ready</span>
              </label>
              <label className="toggle-chip">
                <input
                  name="videoEnabled"
                  type="checkbox"
                  checked={settings.videoEnabled}
                  onChange={handleSettingChange}
                />
                <span>Video preview</span>
              </label>
              <span className="inline-note">
                Pressure dial changes follow-up tone across the generated question set.
              </span>
            </div>
          </article>

          <article className="card repo-card">
            <div className="card-header">
              <div>
                <p className="mini-heading">Repository analyzer</p>
                <h3>Paste a Git repo and generate project-specific prompts</h3>
              </div>
              <span className="badge">Repo Mirror</span>
            </div>

            <form className="repo-form" onSubmit={handleRepoSubmit}>
              <label className="field grow">
                <span>Repository URL</span>
                <input
                  type="url"
                  placeholder="https://github.com/owner/project"
                  value={repoUrl}
                  onChange={(event) => setRepoUrl(event.target.value)}
                />
              </label>
              <button type="submit" className="primary-btn">
                Analyze Repo
              </button>
            </form>
            <p className={`helper-text ${repoFeedback.type}`.trim()}>{repoFeedback.text}</p>

            <div className="repo-layout">
              <div className="repo-copy">
                <h4>{repoProfile.lens}</h4>
                <p>{repoProfile.summary}</p>

                <div className="tag-cloud">
                  {repoProfile.stack.map((item) => (
                    <span key={item} className="pill">
                      {item}
                    </span>
                  ))}
                </div>

                <div className="mini-list-grid">
                  <div>
                    <p className="mini-heading">Hotspots</p>
                    <ul className="bullet-list">
                      {repoProfile.hotspots.map((item) => (
                        <li key={item}>{item}</li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <p className="mini-heading">Standout answer cues</p>
                    <ul className="bullet-list">
                      {repoProfile.standout.map((item) => (
                        <li key={item}>{item}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>

              <div className="score-panel">
                <p className="mini-heading">Ownership radar</p>
                <ScoreBar label="Architecture" value={repoProfile.scorecard.architecture} />
                <ScoreBar label="Reliability" value={repoProfile.scorecard.reliability} />
                <ScoreBar label="Product" value={repoProfile.scorecard.product} />
                <ScoreBar label="Execution" value={repoProfile.scorecard.execution} />
              </div>
            </div>
          </article>

          <article className="card stage-card">
            <div className="card-header">
              <div>
                <p className="mini-heading">Live interview</p>
                <h3>
                  {session.active
                    ? `Question ${session.currentQuestionIndex + 1} of ${questionSet.length}`
                    : "Preview the next question set"}
                </h3>
              </div>
              <span className={`status-badge ${session.active ? "live" : ""}`.trim()}>
                {session.active ? "Session live" : "Preview mode"}
              </span>
            </div>

            <div className="question-card">
              <p className="prompt-text">{currentQuestion?.prompt}</p>
              <div className="followup-row">
                {currentQuestion?.followUps.map((item) => (
                  <span key={item} className="followup-chip">
                    {item}
                  </span>
                ))}
              </div>
            </div>

            <label className="field">
              <span>Voice transcript and answer notes</span>
              <textarea
                placeholder="Speak your answer or type it here. Use numbers, impact, and clear ownership language."
                value={answerText}
                onChange={(event) => setAnswerText(event.target.value)}
              ></textarea>
            </label>

            {interimText ? (
              <div className="interim-box">
                <p className="mini-heading">Live transcript</p>
                <p>{interimText}</p>
              </div>
            ) : null}

            <div className="control-cluster wrap">
              <button
                type="button"
                className={`secondary-btn ${isListening ? "recording" : ""}`.trim()}
                onClick={toggleVoiceCapture}
                disabled={!settings.voiceEnabled}
              >
                {isListening ? "Stop Voice Input" : "Start Voice Input"}
              </button>
              <button type="button" className="secondary-btn" onClick={clearCurrentAnswer}>
                Clear Draft
              </button>
              <button type="button" className="primary-btn" onClick={saveAndContinue}>
                {session.active && session.currentQuestionIndex >= questionSet.length - 1
                  ? "Save And Finish"
                  : "Save And Next"}
              </button>
            </div>

            <p className="helper-text">{speechStatus}</p>
          </article>

          <article className="card question-stack-card">
            <div className="card-header">
              <div>
                <p className="mini-heading">Question stack</p>
                <h3>Generated prompts for this mock loop</h3>
              </div>
              <span className="badge">{questionProgress}% progress</span>
            </div>

            <div className="question-stack">
              {activeQuestions.map((question, index) => (
                <article
                  key={question.id}
                  className={`question-stack-item ${index === session.currentQuestionIndex ? "active" : ""}`.trim()}
                >
                  <span>{String(index + 1).padStart(2, "0")}</span>
                  <div>
                    <strong>{question.prompt}</strong>
                    <p>{question.followUps[2]}</p>
                  </div>
                </article>
              ))}
            </div>
          </article>
        </div>

        <aside className="dashboard-side">
          <article className="card video-card">
            <div className="card-header">
              <div>
                <p className="mini-heading">Video rehearsal</p>
                <h3>Camera preview</h3>
              </div>
              <span className="badge">{settings.videoEnabled ? "Enabled" : "Off"}</span>
            </div>

            <div className="video-frame">
              {settings.videoEnabled ? (
                <video ref={videoRef} autoPlay muted playsInline />
              ) : (
                <div className="video-placeholder">
                  <span>Video preview</span>
                  <strong>Turn on camera in the setup card to rehearse posture and eye contact.</strong>
                </div>
              )}
            </div>
            <p className="helper-text">{cameraStatus}</p>
          </article>

          <article className="card metrics-card">
            <div className="card-header">
              <div>
                <p className="mini-heading">Live performance</p>
                <h3>Ownership radar</h3>
              </div>
              <span className="badge">Signal Replay</span>
            </div>

            <div className="metric-grid">
              <div className="metric-tile">
                <span>Confidence</span>
                <strong>{liveMetrics.confidence}%</strong>
              </div>
              <div className="metric-tile">
                <span>Clarity</span>
                <strong>{liveMetrics.clarity}%</strong>
              </div>
              <div className="metric-tile">
                <span>Depth</span>
                <strong>{liveMetrics.depth}%</strong>
              </div>
              <div className="metric-tile">
                <span>Ownership</span>
                <strong>{liveMetrics.ownership}%</strong>
              </div>
            </div>

            <div className="mini-list-grid">
              <div className="stat-panel">
                <span>Speaking pace</span>
                <strong>{liveMetrics.pace}</strong>
                <small>{liveMetrics.wpm} WPM</small>
              </div>
              <div className="stat-panel">
                <span>Filler count</span>
                <strong>{liveMetrics.fillerCount}</strong>
                <small>Lower is better</small>
              </div>
            </div>
          </article>

          <article className="card coach-card">
            <div className="card-header">
              <div>
                <p className="mini-heading">Coaching insight</p>
                <h3>Strengths and next improvements</h3>
              </div>
              <span className="badge">Actionable</span>
            </div>

            <p className="section-copy tight">{coach.summary}</p>

            <div className="mini-list-grid">
              <div>
                <p className="mini-heading">Doing well</p>
                <ul className="bullet-list">
                  {coach.strengths.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </div>
              <div>
                <p className="mini-heading">Improve next</p>
                <ul className="bullet-list">
                  {coach.improvements.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </div>
            </div>
          </article>

          <article className="card evidence-card">
            <div className="card-header">
              <div>
                <p className="mini-heading">Evidence ledger</p>
                <h3>What your answer proved</h3>
              </div>
              <span className="badge">Unique feature</span>
            </div>

            <p className="section-copy tight">
              This panel extracts measurable proof points from your current answer so you can see
              whether the response sounds concrete enough for a real interviewer.
            </p>

            <div className="evidence-ledger">
              {liveMetrics.evidence.length ? (
                liveMetrics.evidence.map((item) => (
                  <span key={item} className="signal-chip">
                    {item}
                  </span>
                ))
              ) : (
                <span className="muted-inline">
                  Add numbers, timings, uptime, users, costs, or impact words to make the answer stronger.
                </span>
              )}
            </div>
          </article>
        </aside>
      </div>
    </section>
  );

  const recordsView = (
    <section className="page-stack">
      <section className="section-heading">
        <p className="eyebrow">Records</p>
        <h2>Track previous mock sessions and measure improvement</h2>
        <p className="section-copy">
          Every saved loop becomes a replayable record so you can compare overall score, clarity,
          depth, ownership, and the evidence you used.
        </p>
      </section>

      <div className="summary-grid">
        <article className="summary-card card">
          <p className="mini-heading">Saved sessions</p>
          <strong>{records.length}</strong>
          <span>History stored locally in the browser</span>
        </article>
        <article className="summary-card card">
          <p className="mini-heading">Average score</p>
          <strong>{averageRecordScore}%</strong>
          <span>Across all recorded mock loops</span>
        </article>
        <article className="summary-card card">
          <p className="mini-heading">Best replay</p>
          <strong>{bestRecord?.overall ?? 0}%</strong>
          <span>{bestRecord?.repo ?? "No sessions yet"}</span>
        </article>
        <article className="summary-card card">
          <p className="mini-heading">Latest coaching note</p>
          <strong>{latestSession?.keyInsight ?? "Complete a session"}</strong>
          <span>Most recent insight from the dashboard</span>
        </article>
      </div>

      <div className="records-layout">
        <div className="records-column">
          {records.map((record) => (
            <RecordCard key={record.id} record={record} />
          ))}
        </div>

        <aside className="dashboard-side">
          <article className="card">
            <div className="card-header">
              <div>
                <p className="mini-heading">Trend pulse</p>
                <h3>How your practice is moving</h3>
              </div>
              <span className="badge">Replay</span>
            </div>

            <ScoreBar label="Latest overall" value={latestSession?.overall ?? 0} />
            <ScoreBar label="Average overall" value={averageRecordScore} />
            <ScoreBar label="Best overall" value={bestRecord?.overall ?? 0} />
          </article>

          <article className="card">
            <div className="card-header">
              <div>
                <p className="mini-heading">Suggested next loop</p>
                <h3>Use the dashboard to sharpen weak spots</h3>
              </div>
            </div>

            <ul className="bullet-list">
              <li>Run a higher pressure session if your recent delivery already feels stable.</li>
              <li>Link a stronger repo example if you need deeper project storytelling.</li>
              <li>Practice adding one metric to every answer before moving to the next question.</li>
            </ul>
          </article>
        </aside>
      </div>
    </section>
  );

  const aboutView = (
    <section className="page-stack">
      <section className="section-heading">
        <p className="eyebrow">About us</p>
        <h2>A mock interview product built around repo ownership, not generic prompts</h2>
      </section>

      <div className="difference-grid">
        <article className="difference-card card">
          <h3>What the app is for</h3>
          <p>
            ProjectLens is designed for candidates who want their mock interview practice to feel
            like a real product conversation. Instead of asking only generic questions, it frames
            the interview around an actual repository and the judgment behind it.
          </p>
        </article>
        <article className="difference-card card">
          <h3>How the frontend prototype works</h3>
          <p>
            This React frontend simulates repo analysis, question generation, live scoring, voice
            transcript capture, camera rehearsal, and local records tracking so the core product
            experience is tangible end to end.
          </p>
        </article>
        <article className="difference-card card">
          <h3>Design direction</h3>
          <p>
            The interface uses a clean Amazon-inspired visual language with dark navigation, bright
            utility actions, straightforward content hierarchy, and responsive card-based layouts
            for real-world usability.
          </p>
        </article>
      </div>
    </section>
  );

  const contactView = (
    <section className="page-stack">
      <section className="section-heading">
        <p className="eyebrow">Contact</p>
        <h2>Reach the team or collect product interest</h2>
        <p className="section-copy">
          This section rounds out the frontend with a realistic contact area for support, founder
          outreach, or early product requests.
        </p>
      </section>

      <div className="contact-layout">
        <article className="card contact-card">
          <p className="mini-heading">Contact details</p>
          <h3>ProjectLens Mock Studio</h3>
          <ul className="bullet-list">
            <li>Email: hello@projectlens.ai</li>
            <li>Support: support@projectlens.ai</li>
            <li>Location: Greater Noida, India</li>
          </ul>
        </article>

        <form className="card contact-form" onSubmit={handleContactSubmit}>
          <p className="mini-heading">Send a message</p>
          <h3>Ask for a demo, feedback, or product roadmap details</h3>

          <label className="field">
            <span>Name</span>
            <input
              name="name"
              type="text"
              value={contactForm.name}
              onChange={handleContactChange}
              placeholder="Your name"
            />
          </label>

          <label className="field">
            <span>Email</span>
            <input
              name="email"
              type="email"
              value={contactForm.email}
              onChange={handleContactChange}
              placeholder="Your email"
            />
          </label>

          <label className="field">
            <span>Message</span>
            <textarea
              name="message"
              value={contactForm.message}
              onChange={handleContactChange}
              placeholder="Tell us what kind of interview experience you want to build."
            ></textarea>
          </label>

          <button type="submit" className="primary-btn">
            Send Message
          </button>
          <p className="helper-text">{contactMessage}</p>
        </form>
      </div>
    </section>
  );

  const sectionMap = {
    home: homeView,
    dashboard: dashboardView,
    records: recordsView,
    about: aboutView,
    contact: contactView
  };

  return !user ? (
    authView
  ) : (
    <div className="app-shell">
      <header className="topbar">
        <div className="brand-lockup">
          <img src="/brand-mark.svg" alt="ProjectLens logo" className="brand-mark" />
          <div>
            <p className="eyebrow">Repo-aware interview practice</p>
            <h1>ProjectLens Interview OS</h1>
          </div>
        </div>

        <nav className="nav-links" aria-label="Primary">
          {navItems.map((item) => (
            <button
              key={item.id}
              type="button"
              className={`nav-link ${activeSection === item.id ? "active" : ""}`.trim()}
              onClick={() => setActiveSection(item.id)}
            >
              {item.label}
            </button>
          ))}
        </nav>

        <div className="topbar-actions">
          <div className="user-chip">
            <span className="user-chip-label">Signed in</span>
            <strong>{user.name}</strong>
          </div>
          <button type="button" className="secondary-btn topbar-btn" onClick={handleLogout}>
            Log Out
          </button>
        </div>
      </header>

      <main className="main-shell">{sectionMap[activeSection] ?? homeView}</main>

      <footer className="site-footer">
        <div className="footer-grid">
          <section className="footer-card">
            <p className="mini-heading">Platform</p>
            <h3>ProjectLens Interview OS</h3>
            <p>
              Repo-aware mock interviews with dashboard analytics, voice and video rehearsal, and
              saved improvement history.
            </p>
          </section>
          <section className="footer-card">
            <p className="mini-heading">Navigation</p>
            <p>Home, Dashboard, Records, About, Contact</p>
            <p>Built as a React frontend prototype for fast iteration.</p>
          </section>
          <section className="footer-card">
            <p className="mini-heading">Why it stands out</p>
            <p>
              Pressure-based follow-ups, evidence extraction, repo context, and session replay make
              it feel meaningfully different from a generic chatbot workflow.
            </p>
          </section>
        </div>
      </footer>
    </div>
  );
}
