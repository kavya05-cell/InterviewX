import { useState } from "react";
import { useLocation } from "wouter";
import { Button, Input, Badge, Label, Progress } from "@/components/ui/index";
import { useToast } from "@/hooks/use-toast";
import { api } from "@/lib/api";
import { cn } from "@/lib/utils";
import {
  Github, Loader2, Play, Sparkles, Layers, Zap, Clock,
  Gauge, ChevronRight, Code2, GitBranch
} from "lucide-react";

const DURATIONS = [5, 10, 15, 30];
const PRESSURE = [
  { value: "low", label: "Soft", emoji: "🌱", desc: "Friendly, encouraging tone" },
  { value: "medium", label: "Medium", emoji: "⚡", desc: "Realistic, neutral — like a real interview" },
  { value: "high", label: "Brutal", emoji: "🔥", desc: "Tough follow-ups, no mercy" },
];

const EXAMPLE_REPOS = [
  "https://github.com/expressjs/express",
  "https://github.com/facebook/react",
  "https://github.com/vercel/next.js",
];

export default function Dashboard() {
  const [, navigate] = useLocation();
  const { toast } = useToast();
  const [url, setUrl] = useState("");
  const [analyzing, setAnalyzing] = useState(false);
  const [starting, setStarting] = useState(false);
  const [repoId, setRepoId] = useState(null);
  const [summary, setSummary] = useState(null);
  const [duration, setDuration] = useState(15);
  const [pressure, setPressure] = useState("medium");

  const onAnalyze = async () => {
    if (!url.trim()) return;
    setAnalyzing(true);
    setSummary(null);
    setRepoId(null);
    try {
      const r = await api.analyzeRepo(url.trim());
      setRepoId(r.repoId);
      setSummary(r.summary);
      toast({
        title: r.cached ? "Loaded from cache" : "Repo analyzed",
        description: r.summary.project_name,
      });
    } catch (err) {
      toast({ title: "Analysis failed", description: err.message, variant: "destructive" });
    } finally {
      setAnalyzing(false);
    }
  };

  const onStart = async () => {
    if (!repoId) return;
    setStarting(true);
    try {
      const r = await api.startInterview({
        repoId,
        duration,
        pressureLevel: pressure,
        repoUrl: url.trim(),
        summary,
      });
      sessionStorage.setItem(
        `iv:${r.interviewId}`,
        JSON.stringify({ firstQuestion: r.question, durationMinutes: r.durationMinutes })
      );
      navigate(`/interview/${r.interviewId}`);
    } catch (err) {
      toast({ title: "Could not start", description: err.message, variant: "destructive" });
      setStarting(false);
    }
  };

  const complexityColor = {
    low: "text-emerald-400 border-emerald-500/30 bg-emerald-500/8",
    medium: "text-amber-400 border-amber-500/30 bg-amber-500/8",
    high: "text-rose-400 border-rose-500/30 bg-rose-500/8",
  };

  return (
    <div className="max-w-5xl mx-auto px-6 py-12">
      {/* Header */}
      <div className="mb-10">
        <div className="text-xs font-medium uppercase tracking-widest text-primary/70 mb-2">
          New session
        </div>
        <h1 className="font-display text-4xl font-bold tracking-tight">Set up an interview</h1>
        <p className="text-muted-foreground mt-2">
          Drop a GitHub URL. We'll analyze the project and tailor every question to it.
        </p>
      </div>

      {/* Step 1: Repo URL */}
      <div className="rounded-xl border border-border bg-card p-6 mb-4">
        <div className="flex items-center gap-2 mb-4">
          <div className="size-6 rounded-md bg-primary/10 text-primary grid place-items-center text-xs font-bold font-mono">1</div>
          <Label className="text-sm font-semibold">GitHub repository</Label>
        </div>
        <div className="flex gap-2">
          <div className="relative flex-1">
            <Github className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
            <Input
              placeholder="https://github.com/owner/repo"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              className="pl-10 h-11"
              onKeyDown={(e) => e.key === "Enter" && onAnalyze()}
            />
          </div>
          <Button onClick={onAnalyze} disabled={analyzing || !url.trim()} className="h-11 px-6 shrink-0">
            {analyzing ? (
              <><Loader2 className="size-4 animate-spin" /> Analyzing…</>
            ) : (
              <><Sparkles className="size-4" /> Analyze</>
            )}
          </Button>
        </div>

        {!summary && !analyzing && (
          <div className="mt-3 flex flex-wrap gap-2">
            <span className="text-xs text-muted-foreground">Try:</span>
            {EXAMPLE_REPOS.map((r) => (
              <button
                key={r}
                onClick={() => setUrl(r)}
                className="text-xs text-primary hover:text-primary/80 underline underline-offset-2 transition-colors font-mono"
              >
                {r.replace("https://github.com/", "")}
              </button>
            ))}
          </div>
        )}

        {analyzing && (
          <div className="mt-4 space-y-2">
            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <span>Fetching repo metadata…</span>
            </div>
            <Progress value={65} className="h-1" />
          </div>
        )}
      </div>

      {/* Step 2: Repo Summary */}
      {summary && (
        <div className="rounded-xl border border-border bg-card p-6 mb-4 animate-in">
          <div className="flex items-start justify-between gap-4 mb-6">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <div className="size-6 rounded-md bg-primary/10 text-primary grid place-items-center text-xs font-bold font-mono">2</div>
                <div className="text-xs font-medium uppercase tracking-widest text-muted-foreground">
                  Project summary
                </div>
              </div>
              <h2 className="text-2xl font-bold tracking-tight">{summary.project_name}</h2>
              <p className="text-sm text-muted-foreground mt-2 max-w-2xl leading-relaxed">{summary.description}</p>
            </div>
            <span className={cn("text-xs font-medium px-2.5 py-1 rounded-lg border capitalize shrink-0", complexityColor[summary.complexity])}>
              {summary.complexity} complexity
            </span>
          </div>

          <div className="grid md:grid-cols-2 gap-6 mb-8">
            <div>
              <div className="flex items-center gap-1.5 text-xs font-medium uppercase tracking-wider text-muted-foreground mb-3">
                <Zap className="size-3" /> Tech stack
              </div>
              <div className="flex flex-wrap gap-2">
                {summary.tech_stack.map((t) => (
                  <div key={t} className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg border border-border bg-secondary/50 text-xs font-medium">
                    <Code2 className="size-3 text-primary/60" />{t}
                  </div>
                ))}
              </div>
            </div>
            <div>
              <div className="flex items-center gap-1.5 text-xs font-medium uppercase tracking-wider text-muted-foreground mb-3">
                <Layers className="size-3" /> Key modules
              </div>
              <ul className="space-y-1.5">
                {summary.key_modules.map((m) => (
                  <li key={m} className="flex items-center gap-2 text-sm text-foreground/80">
                    <GitBranch className="size-3 text-primary/60 shrink-0" />{m}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Step 3: Configure */}
          <div className="border-t border-border pt-6">
            <div className="flex items-center gap-2 mb-5">
              <div className="size-6 rounded-md bg-primary/10 text-primary grid place-items-center text-xs font-bold font-mono">3</div>
              <Label className="text-sm font-semibold">Configure session</Label>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              {/* Duration */}
              <div>
                <div className="flex items-center gap-1.5 text-xs font-medium uppercase tracking-wider text-muted-foreground mb-3">
                  <Clock className="size-3" /> Duration
                </div>
                <div className="grid grid-cols-4 gap-2">
                  {DURATIONS.map((d) => (
                    <button
                      key={d}
                      onClick={() => setDuration(d)}
                      className={cn(
                        "py-2.5 rounded-lg text-sm font-medium border transition-all",
                        duration === d
                          ? "border-primary bg-primary/10 text-foreground shadow-[0_0_12px_hsl(var(--primary)/0.2)]"
                          : "border-border bg-secondary/30 hover:border-primary/40 text-muted-foreground hover:text-foreground"
                      )}
                    >
                      {d}m
                    </button>
                  ))}
                </div>
              </div>

              {/* Pressure */}
              <div>
                <div className="flex items-center gap-1.5 text-xs font-medium uppercase tracking-wider text-muted-foreground mb-3">
                  <Gauge className="size-3" /> Pressure level
                </div>
                <div className="grid grid-cols-3 gap-2">
                  {PRESSURE.map((p) => (
                    <button
                      key={p.value}
                      onClick={() => setPressure(p.value)}
                      className={cn(
                        "p-2.5 rounded-lg text-sm border transition-all text-left",
                        pressure === p.value
                          ? "border-primary bg-primary/10 shadow-[0_0_12px_hsl(var(--primary)/0.2)]"
                          : "border-border bg-secondary/30 hover:border-primary/40"
                      )}
                    >
                      <div className="text-base mb-0.5">{p.emoji}</div>
                      <div className="font-semibold text-xs">{p.label}</div>
                      <div className="text-[10px] text-muted-foreground mt-0.5 leading-tight">{p.desc}</div>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <Button
              size="lg"
              onClick={onStart}
              disabled={starting}
              className="mt-6 w-full h-12 text-base font-semibold"
            >
              {starting ? (
                <><Loader2 className="size-4 animate-spin" /> Starting interview…</>
              ) : (
                <><Play className="size-4" /> Start interview <ChevronRight className="size-4" /></>
              )}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
