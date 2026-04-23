// ─── Record Page ─────────────────────────────────────────────────────────────
import { useEffect, useState } from "react";
import { Link } from "wouter";
import { Button, Badge, Separator } from "@/components/ui/index";
import { api } from "@/lib/api";
import { cn } from "@/lib/utils";
import {
  Loader2, FileText, Github, ChevronRight, Plus,
  Clock, Flame, Sprout, Zap, TrendingUp
} from "lucide-react";

const pressureIcon = { low: Sprout, medium: Zap, high: Flame };
const pressureColor = {
  low: "text-emerald-400",
  medium: "text-amber-400",
  high: "text-rose-400",
};

export function Record() {
  const [rows, setRows] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    api.listInterviews()
      .then((r) => setRows(r.interviews))
      .catch((e) => setError(e.message || "Failed"));
  }, []);

  return (
    <div className="max-w-5xl mx-auto px-6 py-12">
      <div className="mb-8 flex items-end justify-between">
        <div>
          <div className="text-xs font-medium uppercase tracking-widest text-primary/70 mb-2">History</div>
          <h1 className="font-display text-4xl font-bold tracking-tight">Record</h1>
          <p className="text-muted-foreground mt-1">Past interviews and their reports.</p>
        </div>
        <Link href="/dashboard">
          <Button className="gap-2"><Plus className="size-4" /> New interview</Button>
        </Link>
      </div>

      {!rows && !error && (
        <div className="flex items-center justify-center py-20 text-muted-foreground">
          <Loader2 className="size-5 animate-spin text-primary mr-2" /> Loading…
        </div>
      )}

      {error && (
        <div className="rounded-xl border border-destructive/30 bg-destructive/8 p-5 text-sm text-destructive">
          {error}
        </div>
      )}

      {rows && rows.length === 0 && (
        <div className="rounded-xl border border-border bg-card p-16 text-center">
          <div className="size-14 rounded-2xl bg-secondary mx-auto grid place-items-center mb-4">
            <FileText className="size-6 text-muted-foreground" />
          </div>
          <h3 className="text-lg font-semibold mb-1">No interviews yet</h3>
          <p className="text-sm text-muted-foreground">Run your first one to see results here.</p>
          <Link href="/dashboard">
            <Button className="mt-6 gap-2"><Plus className="size-4" /> Start now</Button>
          </Link>
        </div>
      )}

      {rows && rows.length > 0 && (
        <div className="rounded-xl border border-border bg-card overflow-hidden">
          {rows.map((r, i) => {
            const PIcon = pressureIcon[r.pressure_level] || Zap;
            const score = r.total_score ? Number(r.total_score) : null;
            const scoreColor = score >= 7 ? "text-emerald-400" : score >= 5 ? "text-amber-400" : "text-rose-400";
            return (
              <div key={r.id}>
                {i > 0 && <Separator />}
                <div className="p-5 hover:bg-secondary/20 transition-colors flex items-center gap-4">
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="font-semibold truncate">{r.project_name || "Untitled"}</h3>
                      <Badge
                        variant="outline"
                        className={cn(
                          "text-[10px] uppercase tracking-wider",
                          r.status === "completed"
                            ? "border-emerald-500/30 text-emerald-400"
                            : "border-amber-500/30 text-amber-400"
                        )}
                      >
                        {r.status.replace("_", " ")}
                      </Badge>
                    </div>
                    <a
                      href={r.repo_url}
                      target="_blank"
                      rel="noreferrer"
                      className="text-xs text-muted-foreground hover:text-foreground inline-flex items-center gap-1 mt-0.5 transition-colors"
                    >
                      <Github className="size-3" />
                      {r.repo_url?.replace("https://github.com/", "") || r.repo_url}
                    </a>
                    <div className="flex items-center gap-3 text-xs text-muted-foreground mt-1">
                      <span>{new Date(r.created_at).toLocaleDateString()}</span>
                      <span className="flex items-center gap-1">
                        <Clock className="size-3" />{r.duration}m
                      </span>
                      <span className={cn("flex items-center gap-1 capitalize", pressureColor[r.pressure_level])}>
                        <PIcon className="size-3" />{r.pressure_level}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 shrink-0">
                    {score !== null && (
                      <div className={cn("font-display text-xl font-bold tabular-nums", scoreColor)}>
                        {score.toFixed(1)}
                      </div>
                    )}
                    {r.report_id ? (
                      <Link href={`/report/${r.report_id}`}>
                        <Button variant="outline" size="sm" className="gap-1">
                          Report <ChevronRight className="size-3.5" />
                        </Button>
                      </Link>
                    ) : (
                      <span className="text-xs text-muted-foreground">No report</span>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

// ─── About Page ──────────────────────────────────────────────────────────────
export function About() {
  const steps = [
    { n: "01", t: "We analyze your repo", b: "Pull the README, tree, and metadata — summarize project, stack, modules, and complexity. Cached so we don't re-analyze." },
    { n: "02", t: "We run a stateful interview", b: "Questions rotate through overview, implementation, system design, edge cases, and scalability. Coverage and weak areas tracked." },
    { n: "03", t: "Voice or text — your call", b: "Speak naturally with live transcription, or type. We call the model once you finish, never during streaming." },
    { n: "04", t: "Adaptive follow-ups", b: "Each answer is scored on clarity, depth, correctness, and confidence. The next question depends on the result." },
    { n: "05", t: "Honest report", b: "Final report grades you across all dimensions, surfaces strengths and weaknesses, and gives concrete suggestions." },
  ];

  return (
    <div className="max-w-3xl mx-auto px-6 py-16">
      <div className="text-xs font-medium uppercase tracking-widest text-primary/70 mb-3">About</div>
      <h1 className="font-display text-4xl font-bold tracking-tight mb-4">InterviewX</h1>
      <p className="text-muted-foreground leading-relaxed mb-12">
        InterviewX is an AI interviewer that takes a real GitHub project, learns what it does, and
        runs you through a structured technical interview. It is not a chatbot. It is not a quiz generator.
        It is a simulation of a senior engineer trying to understand whether you actually know your own code.
      </p>

      <div className="space-y-0">
        {steps.map((s, i) => (
          <div key={s.n} className="flex gap-6 group">
            <div className="flex flex-col items-center">
              <div className="size-11 rounded-xl border border-primary/30 bg-primary/5 text-primary grid place-items-center font-mono font-bold text-sm shrink-0 group-hover:border-primary/60 group-hover:bg-primary/10 transition-all">
                {s.n}
              </div>
              {i < steps.length - 1 && <div className="w-px flex-1 bg-border my-2" />}
            </div>
            <div className="pb-10 pt-2">
              <h3 className="font-semibold text-base">{s.t}</h3>
              <p className="text-sm text-muted-foreground mt-1.5 leading-relaxed">{s.b}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Contact Page ─────────────────────────────────────────────────────────────
import { Input, Label, Textarea } from "@/components/ui/index";
import { useToast } from "@/hooks/use-toast";
import { Mail, MessageSquare, Send } from "lucide-react";

export function Contact() {
  const { toast } = useToast();
  const [submitting, setSubmitting] = useState(false);

  const onSubmit = (e) => {
    e.preventDefault();
    setSubmitting(true);
    setTimeout(() => {
      toast({ title: "Message sent!", description: "We'll get back to you shortly." });
      setSubmitting(false);
      e.target.reset();
    }, 700);
  };

  return (
    <div className="max-w-2xl mx-auto px-6 py-16">
      <div className="text-xs font-medium uppercase tracking-widest text-primary/70 mb-3">Get in touch</div>
      <h1 className="font-display text-4xl font-bold tracking-tight mb-2">Contact</h1>
      <p className="text-muted-foreground mb-10">Bug, feature request, or feedback? Drop us a note.</p>

      <div className="rounded-xl border border-border bg-card p-8">
        <form onSubmit={onSubmit} className="space-y-5">
          <div className="grid sm:grid-cols-2 gap-5">
            <div>
              <Label htmlFor="name" className="text-xs uppercase tracking-wider text-muted-foreground">Name</Label>
              <Input id="name" required className="mt-2 bg-background/50" placeholder="Your name" />
            </div>
            <div>
              <Label htmlFor="email" className="text-xs uppercase tracking-wider text-muted-foreground">Email</Label>
              <Input id="email" type="email" required className="mt-2 bg-background/50" placeholder="you@company.com" />
            </div>
          </div>
          <div>
            <Label htmlFor="msg" className="text-xs uppercase tracking-wider text-muted-foreground">Message</Label>
            <Textarea id="msg" required rows={5} className="mt-2 bg-background/50" placeholder="Tell us what you think…" />
          </div>
          <Button type="submit" disabled={submitting} className="w-full gap-2">
            {submitting ? <><Loader2 className="size-4 animate-spin" /> Sending…</> : <><Send className="size-4" /> Send message</>}
          </Button>
        </form>
      </div>
    </div>
  );
}

// ─── Login Page ───────────────────────────────────────────────────────────────
import { CheckCircle2, Sparkles } from "lucide-react";

export function Login() {
  const { toast } = useToast();
  const [email, setEmail] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [joined, setJoined] = useState(false);

  const onSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await api.joinWaitlist(email);
      setJoined(true);
      toast({ title: "You're on the list!", description: "We'll be in touch soon." });
    } catch (err) {
      toast({ title: "Could not join", description: err.message || "Try again", variant: "destructive" });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-md mx-auto px-6 py-20">
      <div className="rounded-2xl border border-border bg-card p-8">
        <div className="size-12 rounded-xl bg-primary/15 text-primary grid place-items-center mb-6 glow-primary">
          <Sparkles className="size-6" />
        </div>
        <h1 className="font-display text-2xl font-bold tracking-tight">Join the waitlist</h1>
        <p className="text-sm text-muted-foreground mt-2">
          Accounts are coming soon. Drop your email — we'll let you in early.
        </p>

        {joined ? (
          <div className="mt-6 rounded-xl border border-emerald-500/30 bg-emerald-500/8 p-5 flex items-start gap-3">
            <CheckCircle2 className="size-5 text-emerald-400 shrink-0 mt-0.5" />
            <div>
              <div className="font-semibold text-sm text-emerald-400">You're in.</div>
              <div className="text-xs text-muted-foreground mt-1">
                We added <span className="text-foreground font-medium">{email}</span> to the list.
              </div>
            </div>
          </div>
        ) : (
          <form onSubmit={onSubmit} className="mt-6 space-y-4">
            <div>
              <Label htmlFor="email">Email address</Label>
              <Input
                id="email"
                type="email"
                required
                placeholder="you@company.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="mt-1.5 bg-background/50"
              />
            </div>
            <Button type="submit" disabled={submitting} className="w-full">
              {submitting ? "Adding…" : "Join waitlist"}
            </Button>
          </form>
        )}
      </div>
    </div>
  );
}

// ─── NotFound Page ────────────────────────────────────────────────────────────
export function NotFound() {
  return (
    <div className="max-w-md mx-auto px-6 py-24 text-center">
      <div className="font-display text-8xl font-bold text-primary/20 mb-4">404</div>
      <h1 className="font-display text-2xl font-bold mb-2">Page not found</h1>
      <p className="text-muted-foreground mb-8">That route doesn't exist. You might have followed an old link.</p>
      <Link href="/"><Button>Back to Home</Button></Link>
    </div>
  );
}
