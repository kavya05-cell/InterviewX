// ─── Mock Data Store ────────────────────────────────────────────────────────
const mockInterviews = [];
let interviewCounter = 1;
let reportCounter = 1;

const MOCK_REPOS = {
  "expressjs/express": {
    project_name: "Express.js",
    description: "Fast, unopinionated, minimalist web framework for Node.js. Powers millions of production applications worldwide with its flexible routing, middleware pipeline, and extensive ecosystem.",
    complexity: "high",
    tech_stack: ["Node.js", "JavaScript", "HTTP", "Connect", "REST", "Middleware"],
    key_modules: ["Router", "Application", "Request/Response", "Middleware Pipeline", "Static File Serving"],
  },
  default: (url) => {
    const name = url.split("/").pop() || "Repository";
    return {
      project_name: name.charAt(0).toUpperCase() + name.slice(1).replace(/-/g, " "),
      description: `A modern ${name} application with clean architecture, comprehensive test coverage, and production-ready configuration. Built with developer experience in mind.`,
      complexity: ["low", "medium", "high"][Math.floor(Math.random() * 3)],
      tech_stack: ["React", "TypeScript", "Node.js", "PostgreSQL", "Docker", "CI/CD"].slice(0, 3 + Math.floor(Math.random() * 3)),
      key_modules: ["Authentication", "API Layer", "Database Models", "UI Components", "Configuration"],
    };
  },
};

const INTERVIEW_QUESTIONS = [
  "Walk me through the overall architecture of this project. What are the main components and how do they communicate?",
  "How does the routing system work in this codebase? What patterns or conventions does it follow?",
  "Explain the error handling strategy used in this project. How are errors propagated and surfaced to users?",
  "How would you scale this application to handle 10x the current traffic? What bottlenecks do you foresee?",
  "Describe the middleware pipeline in this project. How is request processing ordered and why?",
  "What testing strategy would you implement for this codebase? What test types are most important?",
  "How does this project handle authentication and authorization? What are the security considerations?",
  "Walk me through how you'd debug a production issue where API responses are slow. What tools would you use?",
  "Describe the data flow from a user action to database write in this application.",
  "How does this project handle database migrations and schema evolution?",
];

const FOLLOW_UP_QUESTIONS = [
  "Can you elaborate on the trade-offs of that approach?",
  "How would this change if you needed to support multiple regions?",
  "What would you do differently if you were starting fresh?",
  "How does that handle edge cases like network failures or timeouts?",
  "Walk me through a concrete example of that in the codebase.",
];

function generateEvaluation(answer) {
  const len = answer.trim().length;
  const quality = Math.min(1, len / 300);
  const base = 5 + quality * 3.5 + (Math.random() - 0.5);
  
  const clamp = (v) => Math.min(10, Math.max(1, parseFloat(v.toFixed(1))));
  return {
    clarity: clamp(base + (Math.random() - 0.5) * 1.5),
    technical_depth: clamp(base - 0.5 + (Math.random() - 0.5) * 2),
    correctness: clamp(base + 0.3 + (Math.random() - 0.5) * 1.5),
    confidence: clamp(base + (Math.random() - 0.5) * 2),
    weak_areas: quality < 0.4 ? ["depth", "examples"] : quality < 0.7 ? ["specificity"] : [],
  };
}

function generateReport(interview) {
  const evals = interview.turns.filter((t) => t.evaluation);
  const avg = (key) =>
    evals.length ? evals.reduce((s, t) => s + t.evaluation[key], 0) / evals.length : 6;

  const clarity = avg("clarity");
  const depth = avg("technical_depth");
  const correctness = avg("correctness");
  const confidence = avg("confidence");
  const total = (clarity + depth + correctness + confidence) / 4;

  return {
    total_score: total,
    breakdown: { clarity, technical_depth: depth, correctness, confidence },
    strengths: [
      total > 7 ? "Demonstrated strong command of core concepts with clear, structured explanations." : "Showed understanding of foundational principles and project structure.",
      clarity > 7 ? "Communicated ideas with exceptional clarity and logical flow." : "Maintained coherent responses throughout the interview.",
      "Addressed questions directly without unnecessary tangents.",
    ],
    weaknesses: [
      depth < 6 ? "Technical depth in some answers could be improved with more concrete examples." : "Occasional gaps in production-readiness considerations.",
      confidence < 6 ? "Hesitation noticeable in answers about scalability and system design." : "Some trade-off discussions could be more thorough.",
    ],
    suggestions: [
      "Practice whiteboarding system design problems — focus on data flow and failure modes.",
      "Study the codebase's error handling patterns and be ready to critique them.",
      depth < 6 ? "Prepare concrete examples from experience for each technical area." : "Push answers further by proactively discussing edge cases.",
      "Review distributed systems fundamentals: CAP theorem, eventual consistency, idempotency.",
    ],
    repo_url: interview.repoUrl,
    repo_summary: interview.summary,
  };
}

// ─── Simulated delay ─────────────────────────────────────────────────────────
const delay = (ms) => new Promise((r) => setTimeout(r, ms));

// ─── API Surface ─────────────────────────────────────────────────────────────
export const api = {
  async analyzeRepo(repoUrl) {
    await delay(1400 + Math.random() * 600);
    const key = Object.keys(MOCK_REPOS).find(
      (k) => k !== "default" && repoUrl.includes(k)
    );
    const summary = key ? MOCK_REPOS[key] : MOCK_REPOS.default(repoUrl);
    const repoId = `repo_${Date.now()}`;
    return { repoId, summary, cached: !!key };
  },

  async startInterview({ repoId, duration, pressureLevel, repoUrl, summary }) {
    await delay(800);
    const interviewId = `iv_${interviewCounter++}`;
    const questionPool = [...INTERVIEW_QUESTIONS].sort(() => Math.random() - 0.5);
    const totalQuestions = Math.min(questionPool.length, Math.ceil(duration * 0.8));

    const interview = {
      id: interviewId,
      repoId,
      repoUrl: repoUrl || "https://github.com/example/repo",
      summary: summary || { project_name: "Project", description: "" },
      duration,
      pressureLevel,
      turns: [],
      questionPool,
      totalQuestions,
      status: "in_progress",
      createdAt: new Date().toISOString(),
    };
    mockInterviews.push(interview);
    sessionStorage.setItem(`iv_store_${interviewId}`, JSON.stringify(interview));

    return {
      interviewId,
      question: questionPool[0],
      durationMinutes: duration,
    };
  },

  async submitAnswer({ interviewId, answer }) {
    await delay(900 + Math.random() * 400);
    const raw = sessionStorage.getItem(`iv_store_${interviewId}`);
    if (!raw) throw new Error("Interview session not found");
    const interview = JSON.parse(raw);

    const turnIdx = interview.turns.length;
    const evaluation = generateEvaluation(answer);

    if (turnIdx < interview.turns.length) {
      interview.turns[turnIdx].answer = answer;
      interview.turns[turnIdx].evaluation = evaluation;
    } else {
      const questionAsked = interview.questionPool[turnIdx];
      interview.turns.push({ question: questionAsked, answer, evaluation });
    }

    const answered = interview.turns.filter((t) => t.answer).length;
    const done = answered >= interview.totalQuestions;

    let nextQuestion = null;
    if (!done) {
      const pressure = interview.pressureLevel;
      const lastEval = evaluation;
      const avgScore = (lastEval.clarity + lastEval.technical_depth + lastEval.correctness) / 3;

      if (pressure === "high" && avgScore < 6) {
        nextQuestion = FOLLOW_UP_QUESTIONS[Math.floor(Math.random() * FOLLOW_UP_QUESTIONS.length)];
      } else {
        nextQuestion = interview.questionPool[answered] || INTERVIEW_QUESTIONS[answered % INTERVIEW_QUESTIONS.length];
      }
      interview.turns.push({ question: nextQuestion });
    }

    sessionStorage.setItem(`iv_store_${interviewId}`, JSON.stringify(interview));

    return {
      answered,
      totalQuestions: interview.totalQuestions,
      evaluation,
      nextQuestion,
      done,
    };
  },

  async finishInterview(interviewId) {
    await delay(1200);
    const raw = sessionStorage.getItem(`iv_store_${interviewId}`);
    if (!raw) throw new Error("Interview not found");
    const interview = JSON.parse(raw);
    interview.status = "completed";

    const reportId = `rep_${reportCounter++}`;
    const report = generateReport(interview);
    const reportData = { reportId, report, turns: interview.turns.filter((t) => t.answer) };

    sessionStorage.setItem(`rep_${reportId}`, JSON.stringify(reportData));
    sessionStorage.setItem(`iv_store_${interviewId}`, JSON.stringify({ ...interview, reportId }));

    // Save to list
    const listRaw = localStorage.getItem("ix_interviews") || "[]";
    const list = JSON.parse(listRaw);
    list.unshift({
      id: interviewId,
      project_name: interview.summary?.project_name || "Interview",
      repo_url: interview.repoUrl,
      status: "completed",
      created_at: interview.createdAt,
      duration: interview.duration,
      pressure_level: interview.pressureLevel,
      report_id: reportId,
      total_score: report.total_score,
    });
    localStorage.setItem("ix_interviews", JSON.stringify(list.slice(0, 20)));

    return { reportId };
  },

  async listInterviews() {
    await delay(400);
    const raw = localStorage.getItem("ix_interviews") || "[]";
    return { interviews: JSON.parse(raw) };
  },

  async getReport(id) {
    await delay(500);
    const raw = sessionStorage.getItem(`rep_${id}`);
    if (raw) return JSON.parse(raw);

    // Demo report for sharing
    const demo = {
      reportId: id,
      report: {
        total_score: 7.4,
        breakdown: { clarity: 7.8, technical_depth: 6.9, correctness: 7.6, confidence: 7.3 },
        strengths: [
          "Strong command of core Express.js patterns and middleware composition.",
          "Clear articulation of request/response lifecycle with accurate details.",
          "Proactively discussed trade-offs without prompting.",
        ],
        weaknesses: [
          "System design answers lacked discussion of failure modes.",
          "Testing strategy could be more comprehensive.",
        ],
        suggestions: [
          "Deep-dive into distributed tracing for production debugging scenarios.",
          "Study chaos engineering principles for resilience discussions.",
          "Practice load testing methodology with concrete metrics.",
          "Review database connection pooling and query optimization techniques.",
        ],
        repo_url: "https://github.com/expressjs/express",
        repo_summary: {
          project_name: "Express.js",
          description: "Fast, unopinionated web framework for Node.js",
          complexity: "high",
        },
      },
      turns: [
        {
          idx: 0,
          question: "Walk me through the overall architecture of this project.",
          answer: "Express follows a middleware-based architecture where the application processes requests through a chain of functions. The core is the app object which maintains a router stack...",
          evaluation: { clarity: 8.1, technical_depth: 7.2, correctness: 8.0, confidence: 7.5, weak_areas: [] },
        },
        {
          idx: 1,
          question: "How does the routing system work?",
          answer: "The routing system uses a layer-based approach. Each route is a Layer with a regexp and handler. The Router matches incoming URLs against these layers...",
          evaluation: { clarity: 7.5, technical_depth: 7.8, correctness: 7.9, confidence: 6.8, weak_areas: ["depth"] },
        },
        {
          idx: 2,
          question: "How would you scale this to 10x traffic?",
          answer: "I'd start with horizontal scaling behind a load balancer, implement connection pooling, add Redis for session storage, and use CDN for static assets...",
          evaluation: { clarity: 7.2, technical_depth: 6.5, correctness: 7.0, confidence: 7.8, weak_areas: ["specificity"] },
        },
      ].map((t, i) => ({ ...t, idx: i })),
    };
    return demo;
  },

  async joinWaitlist(email) {
    await delay(700);
    const raw = localStorage.getItem("ix_waitlist") || "[]";
    const list = JSON.parse(raw);
    list.push({ email, joinedAt: new Date().toISOString() });
    localStorage.setItem("ix_waitlist", JSON.stringify(list));
    return { ok: true };
  },
};
