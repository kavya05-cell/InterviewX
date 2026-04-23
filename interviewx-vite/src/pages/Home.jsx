import { Link } from "wouter";
import { Button, Badge } from "@/components/ui/index";
import { ArrowRight, Github, Mic, Sparkles, BarChart3, Brain, Zap, Shield, Target } from "lucide-react";

const features = [
  {
    icon: Github,
    title: "Repo-aware questions",
    body: "Point us at any GitHub URL. We extract README, file tree, and stack to ground every question in your actual code — not generic trivia.",
  },
  {
    icon: Mic,
    title: "Real-time voice",
    body: "Stream your answer with live transcription. We call the AI only once you're done speaking — fast, focused, low-latency.",
  },
  {
    icon: Brain,
    title: "Adaptive pressure",
    body: "Weak answers get probed deeper. Strong answers move forward. The pipeline simulates a real senior interviewer.",
  },
  {
    icon: BarChart3,
    title: "Scored on what matters",
    body: "Clarity, technical depth, correctness, confidence — graded per turn, then rolled into a final detailed report.",
  },
  {
    icon: Target,
    title: "Stateful, not chatty",
    body: "We track covered topics, weak areas, and rotate through overview, design, edge cases, and scalability.",
  },
  {
    icon: Zap,
    title: "Reports you can act on",
    body: "Strengths, weaknesses, and concrete suggestions with charts and full transcript to review after.",
  },
];

const stats = [
  { value: "10x", label: "More relevant than generic prep" },
  { value: "<2s", label: "Response latency" },
  { value: "4", label: "Scoring dimensions" },
];

export default function Home() {
  return (
    <div className="relative overflow-hidden">
      {/* Grid background */}
      <div className="absolute inset-0 grid-bg opacity-30 pointer-events-none" />

      {/* Hero */}
      <section className="relative max-w-6xl mx-auto px-6 pt-20 pb-24 text-center">
        <div className="inline-flex items-center gap-2 text-xs font-medium px-3 py-1.5 rounded-full border border-primary/30 bg-primary/5 text-primary mb-8 animate-in">
          <Sparkles className="size-3" />
          AI-powered technical interviews, calibrated to your repo
        </div>

        <h1 className="font-display text-5xl md:text-7xl font-bold tracking-tight leading-[1.05] text-balance mb-6">
          Practice the interview
          <br />
          <span className="text-gradient-primary">you're afraid of.</span>
        </h1>

        <p className="text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed mb-10">
          InterviewX analyzes your GitHub repo and runs a stateful, adaptive technical interview —
          live voice, real evaluation, and a brutally honest report at the end.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mb-16">
          <Link href="/dashboard">
            <Button size="lg" className="gap-2 font-semibold text-base px-8">
              Start an interview <ArrowRight className="size-4" />
            </Button>
          </Link>
          <Link href="/about">
            <Button size="lg" variant="outline" className="font-medium">
              How it works
            </Button>
          </Link>
        </div>

        {/* Stats */}
        <div className="flex items-center justify-center gap-8 md:gap-16">
          {stats.map((s) => (
            <div key={s.value} className="text-center">
              <div className="font-display text-3xl font-bold text-primary">{s.value}</div>
              <div className="text-xs text-muted-foreground mt-1">{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section className="max-w-6xl mx-auto px-6 pb-24">
        <div className="text-center mb-12">
          <div className="text-xs font-medium uppercase tracking-widest text-primary/70 mb-3">
            How it works
          </div>
          <h2 className="font-display text-3xl md:text-4xl font-bold">
            Built different. Evaluated correctly.
          </h2>
        </div>

        <div className="grid md:grid-cols-3 gap-4">
          {features.map((f, i) => (
            <div
              key={f.title}
              className="rounded-xl border border-border bg-card p-6 card-hover group"
              style={{ animationDelay: `${i * 80}ms` }}
            >
              <div className="size-10 rounded-lg bg-primary/10 text-primary grid place-items-center mb-4 group-hover:bg-primary/20 transition-colors">
                <f.icon className="size-5" />
              </div>
              <h3 className="font-semibold text-base mb-2">{f.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{f.body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Process flow */}
      <section className="max-w-4xl mx-auto px-6 pb-24">
        <div className="rounded-2xl border border-border bg-card overflow-hidden">
          <div className="p-8 md:p-12">
            <div className="font-display text-2xl font-bold mb-8">How a session works</div>
            <div className="space-y-0">
              {[
                { step: "01", title: "Drop a GitHub URL", desc: "We analyze the repo in ~2 seconds. README, tree, stack, complexity — all summarized." },
                { step: "02", title: "Configure the session", desc: "Choose duration (5–30 min) and pressure level (friendly → brutal)." },
                { step: "03", title: "Interview begins", desc: "AI asks repo-specific questions. You speak or type. Scores appear live." },
                { step: "04", title: "Get your report", desc: "Full breakdown with charts, transcript, and concrete next steps." },
              ].map((s, i) => (
                <div key={s.step} className="flex gap-6 group">
                  <div className="flex flex-col items-center">
                    <div className="size-10 rounded-lg border border-primary/30 bg-primary/5 text-primary grid place-items-center text-sm font-mono font-bold shrink-0">
                      {s.step}
                    </div>
                    {i < 3 && <div className="w-px flex-1 bg-border my-2" />}
                  </div>
                  <div className="pb-8 pt-1.5">
                    <div className="font-semibold text-sm">{s.title}</div>
                    <div className="text-sm text-muted-foreground mt-1 leading-relaxed">{s.desc}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="max-w-4xl mx-auto px-6 pb-24">
        <div className="rounded-2xl border border-primary/20 bg-gradient-to-br from-primary/8 via-card to-card p-10 md:p-16 text-center relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-primary/3 to-transparent animate-[shimmer_4s_ease-in-out_infinite] pointer-events-none" />
          <Shield className="size-8 text-primary mx-auto mb-4" />
          <h2 className="font-display text-3xl md:text-4xl font-bold tracking-tight">
            Stop guessing. Start interviewing.
          </h2>
          <p className="mt-3 text-muted-foreground max-w-lg mx-auto">
            One repo. One interview. A report that tells you exactly what to fix.
          </p>
          <Link href="/dashboard">
            <Button size="lg" className="mt-8 px-10 font-semibold">
              Run my first interview <ArrowRight className="size-4" />
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
}
