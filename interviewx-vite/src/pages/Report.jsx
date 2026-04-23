import { useEffect, useState } from "react";
import { useParams, Link } from "wouter";
import {
  PieChart, Pie, Cell, ResponsiveContainer,
  BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, RadarChart, Radar, PolarGrid, PolarAngleAxis,
} from "recharts";
import { Badge, Button, Separator, Progress } from "@/components/ui/index";
import { api } from "@/lib/api";
import { cn } from "@/lib/utils";
import {
  Loader2, Github, ArrowLeft, TrendingUp, AlertTriangle, Lightbulb,
  RotateCcw, ChevronDown, ChevronUp,
} from "lucide-react";

const COLORS = [
  "hsl(152 100% 43%)",
  "hsl(200 90% 55%)",
  "hsl(48 96% 53%)",
  "hsl(280 80% 65%)",
];

const SCORE_LABELS = {
  clarity: "Clarity",
  technical_depth: "Depth",
  correctness: "Correctness",
  confidence: "Confidence",
};

function ScoreRing({ score }) {
  const color =
    score >= 7 ? "text-emerald-400"
      : score >= 5 ? "text-amber-400"
        : "text-rose-400";
  const ringColor =
    score >= 7 ? "hsl(152 100% 43%)"
      : score >= 5 ? "hsl(48 96% 53%)"
        : "hsl(0 84% 60%)";

  return (
    <div className="relative size-32">
      <svg className="size-32 -rotate-90" viewBox="0 0 120 120">
        <circle cx="60" cy="60" r="50" fill="none" stroke="hsl(var(--border))" strokeWidth="8" />
        <circle
          cx="60" cy="60" r="50" fill="none"
          stroke={ringColor} strokeWidth="8"
          strokeDasharray={`${(score / 10) * 314} 314`}
          strokeLinecap="round"
          style={{ filter: `drop-shadow(0 0 8px ${ringColor}60)` }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <div className={cn("font-display text-3xl font-bold tabular-nums", color)}>
          {score.toFixed(1)}
        </div>
        <div className="text-[10px] text-muted-foreground">/10</div>
      </div>
    </div>
  );
}

function Section({ icon: Icon, title, items, color }) {
  return (
    <div className="rounded-xl border border-border bg-card p-5">
      <div className="flex items-center gap-2 mb-4">
        <div className={cn("size-7 rounded-lg grid place-items-center", color)}>
          <Icon className="size-3.5" />
        </div>
        <div className="font-semibold text-sm">{title}</div>
      </div>
      <ul className="space-y-2.5">
        {items.map((s, i) => (
          <li key={i} className="text-sm text-foreground/80 leading-relaxed flex gap-2">
            <span className="text-primary mt-0.5 shrink-0">›</span>
            {s}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default function ReportPage() {
  const { id } = useParams();
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const [expandedTurns, setExpandedTurns] = useState({});

  useEffect(() => {
    if (!id) return;
    api.getReport(id).then(setData).catch((e) => setError(e.message || "Failed to load report"));
  }, [id]);

  if (error)
    return (
      <div className="max-w-3xl mx-auto px-6 py-20 text-center">
        <div className="text-destructive mb-4">{error}</div>
        <Link href="/dashboard"><Button>Back to Dashboard</Button></Link>
      </div>
    );

  if (!data)
    return (
      <div className="flex items-center justify-center py-20 text-muted-foreground">
        <Loader2 className="size-5 animate-spin mr-2 text-primary" /> Loading report…
      </div>
    );

  const { report, turns } = data;
  const total = Number(report.total_score);
  const breakdownArr = Object.entries(report.breakdown).map(([k, v], i) => ({
    name: SCORE_LABELS[k] || k,
    value: Number(v),
    color: COLORS[i % COLORS.length],
  }));

  const radarData = breakdownArr.map((b) => ({ subject: b.name, A: b.value, fullMark: 10 }));

  const turnsWithEval = turns.filter((t) => t.evaluation);
  const barData = turnsWithEval.map((t, i) => ({
    name: `Q${i + 1}`,
    Clarity: +(t.evaluation?.clarity ?? 0).toFixed(1),
    Depth: +(t.evaluation?.technical_depth ?? 0).toFixed(1),
    Correct: +(t.evaluation?.correctness ?? 0).toFixed(1),
    Conf: +(t.evaluation?.confidence ?? 0).toFixed(1),
  }));

  const scoreColor =
    total >= 7 ? "text-emerald-400"
      : total >= 5 ? "text-amber-400"
        : "text-rose-400";

  const tooltipStyle = {
    background: "hsl(var(--popover))",
    border: "1px solid hsl(var(--border))",
    borderRadius: "8px",
    color: "hsl(var(--foreground))",
    fontSize: "12px",
  };

  return (
    <div className="max-w-6xl mx-auto px-4 md:px-6 py-8">
      {/* Back */}
      <Link href="/record" className="text-sm text-muted-foreground hover:text-foreground inline-flex items-center gap-1 mb-6 transition-colors">
        <ArrowLeft className="size-3.5" /> All interviews
      </Link>

      {/* Header */}
      <div className="grid md:grid-cols-3 gap-4 mb-4">
        <div className="md:col-span-2 rounded-xl border border-border bg-card p-6 md:p-8">
          <div className="text-xs uppercase tracking-widest text-primary font-medium mb-1">Final report</div>
          <h1 className="font-display text-3xl font-bold tracking-tight mb-1">
            {report.repo_summary?.project_name || "Interview Report"}
          </h1>
          {report.repo_url && (
            <a
              href={report.repo_url}
              target="_blank"
              rel="noreferrer"
              className="text-xs text-muted-foreground hover:text-foreground inline-flex items-center gap-1 transition-colors"
            >
              <Github className="size-3" /> {report.repo_url.replace("https://github.com/", "")}
            </a>
          )}

          <div className="mt-6 flex items-end gap-6">
            <ScoreRing score={total} />
            <div className="flex-1 grid grid-cols-2 gap-2 mb-1">
              {breakdownArr.map((b) => (
                <div key={b.name} className="rounded-lg border border-border bg-background/50 px-3 py-2.5">
                  <div className="text-[10px] uppercase tracking-wider font-medium mb-1" style={{ color: b.color }}>
                    {b.name}
                  </div>
                  <div className="flex items-end gap-1.5">
                    <div className="font-bold tabular-nums font-mono">{b.value.toFixed(1)}</div>
                    <Progress value={(b.value / 10) * 100} className="h-1 flex-1 mb-1" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Radar chart */}
        <div className="rounded-xl border border-border bg-card p-6">
          <div className="text-xs uppercase tracking-wider text-muted-foreground mb-3 font-medium">
            Performance radar
          </div>
          <ResponsiveContainer width="100%" height={200}>
            <RadarChart data={radarData}>
              <PolarGrid stroke="hsl(var(--border))" />
              <PolarAngleAxis dataKey="subject" tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }} />
              <Radar
                dataKey="A"
                stroke="hsl(var(--primary))"
                fill="hsl(var(--primary))"
                fillOpacity={0.15}
                strokeWidth={2}
              />
            </RadarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Strengths / Weaknesses / Suggestions */}
      <div className="grid md:grid-cols-3 gap-4 mb-4">
        <Section
          icon={TrendingUp}
          title="Strengths"
          items={report.strengths}
          color="text-emerald-400 bg-emerald-500/10"
        />
        <Section
          icon={AlertTriangle}
          title="Weaknesses"
          items={report.weaknesses}
          color="text-amber-400 bg-amber-500/10"
        />
        <Section
          icon={Lightbulb}
          title="Suggestions"
          items={report.suggestions}
          color="text-primary bg-primary/10"
        />
      </div>

      {/* Per-question bar chart */}
      {barData.length > 0 && (
        <div className="rounded-xl border border-border bg-card p-6 mb-4">
          <div className="text-sm font-semibold mb-5">Per-question scores</div>
          <ResponsiveContainer width="100%" height={240}>
            <BarChart data={barData} barGap={2} barCategoryGap="20%">
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
              <XAxis dataKey="name" stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} />
              <YAxis domain={[0, 10]} stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} />
              <Tooltip contentStyle={tooltipStyle} />
              {["Clarity", "Depth", "Correct", "Conf"].map((k, i) => (
                <Bar key={k} dataKey={k} fill={COLORS[i]} radius={[3, 3, 0, 0]} />
              ))}
            </BarChart>
          </ResponsiveContainer>
          <div className="flex gap-4 mt-3 justify-center">
            {["Clarity", "Depth", "Correct", "Conf"].map((k, i) => (
              <div key={k} className="flex items-center gap-1.5 text-xs text-muted-foreground">
                <div className="size-2.5 rounded-sm" style={{ background: COLORS[i] }} />
                {k}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Transcript */}
      <div className="rounded-xl border border-border bg-card p-6 mb-8">
        <div className="text-sm font-semibold mb-5">Full transcript</div>
        <div className="space-y-4">
          {turns.map((t, i) => {
            const expanded = expandedTurns[i];
            return (
              <div key={i} className="border border-border/50 rounded-lg overflow-hidden">
                <button
                  className="w-full flex items-center justify-between gap-3 px-4 py-3 hover:bg-secondary/30 transition-colors text-left"
                  onClick={() => setExpandedTurns((prev) => ({ ...prev, [i]: !prev[i] }))}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="size-6 rounded-md bg-primary/10 text-primary text-[11px] font-bold font-mono grid place-items-center shrink-0">
                      Q{i + 1}
                    </div>
                    <div className="text-sm font-medium truncate">{t.question}</div>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    {t.evaluation && (
                      <div className="flex gap-1">
                        {SCORE_KEYS.map(({ key }) => (
                          <div
                            key={key}
                            className="w-1.5 rounded-full bg-primary/30"
                            style={{ height: `${(t.evaluation[key] / 10) * 20}px`, minHeight: "4px" }}
                          />
                        ))}
                      </div>
                    )}
                    {expanded ? <ChevronUp className="size-4 text-muted-foreground" /> : <ChevronDown className="size-4 text-muted-foreground" />}
                  </div>
                </button>

                {expanded && (
                  <div className="px-4 pb-4 border-t border-border/50 pt-3 space-y-3 animate-in">
                    {t.answer && (
                      <div>
                        <div className="text-[10px] text-muted-foreground uppercase tracking-widest mb-2">Your answer</div>
                        <div className="text-sm text-foreground/85 whitespace-pre-wrap leading-relaxed bg-secondary/30 rounded-lg p-3">
                          {t.answer}
                        </div>
                      </div>
                    )}
                    {t.evaluation && (
                      <div className="flex flex-wrap gap-1.5">
                        {SCORE_KEYS.map(({ key, label }) => (
                          <div key={key} className="px-2 py-1 rounded-md bg-secondary/50 border border-border text-xs flex items-center gap-1.5">
                            <span className="text-muted-foreground">{label}</span>
                            <span className="font-bold text-foreground">{t.evaluation[key].toFixed(1)}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      <div className="flex justify-center">
        <Link href="/dashboard">
          <Button size="lg" className="px-8 font-semibold">
            <RotateCcw className="size-4" /> Run another interview
          </Button>
        </Link>
      </div>
    </div>
  );
}

const SCORE_KEYS = [
  { key: "clarity", label: "Clarity" },
  { key: "technical_depth", label: "Depth" },
  { key: "correctness", label: "Correct" },
  { key: "confidence", label: "Conf." },
];
