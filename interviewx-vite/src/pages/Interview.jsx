import { useEffect, useRef, useState } from "react";
import { useLocation, useParams } from "wouter";
import { Button, Textarea, Badge, Progress } from "@/components/ui/index";
import { useToast } from "@/hooks/use-toast";
import { api } from "@/lib/api";
import { cn } from "@/lib/utils";
import { Mic, MicOff, Send, Loader2, Clock, AlertCircle, CheckCircle2, Bot, User } from "lucide-react";

const SCORE_KEYS = [
  { key: "clarity", label: "Clarity" },
  { key: "technical_depth", label: "Depth" },
  { key: "correctness", label: "Correct" },
  { key: "confidence", label: "Conf." },
];

function ScorePill({ label, value }) {
  const color =
    value >= 7 ? "text-emerald-400 border-emerald-500/30 bg-emerald-500/8"
      : value >= 5 ? "text-amber-400 border-amber-500/30 bg-amber-500/8"
        : "text-rose-400 border-rose-500/30 bg-rose-500/8";
  return (
    <div className={cn("px-2 py-0.5 rounded-md border text-[11px] font-medium flex items-center gap-1", color)}>
      <span className="text-muted-foreground">{label}</span>
      <span className="font-bold">{value.toFixed(1)}</span>
    </div>
  );
}

export default function Interview() {
  const params = useParams();
  const [, navigate] = useLocation();
  const { toast } = useToast();
  const interviewId = params.id;

  const [turns, setTurns] = useState([]);
  const [draft, setDraft] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [listening, setListening] = useState(false);
  const [interim, setInterim] = useState("");
  const [processing, setProcessing] = useState(false);
  const [progress, setProgress] = useState({ answered: 0, total: 0 });
  const [secondsLeft, setSecondsLeft] = useState(null);
  const [voiceUnsupported, setVoiceUnsupported] = useState(false);
  const [done, setDone] = useState(false);

  const recRef = useRef(null);
  const scrollRef = useRef(null);
  const finalChunkRef = useRef("");

  // Load session
  useEffect(() => {
    const raw = sessionStorage.getItem(`iv:${interviewId}`);
    if (!raw) {
      toast({ title: "Interview not found", description: "Returning to dashboard", variant: "destructive" });
      navigate("/dashboard");
      return;
    }
    const data = JSON.parse(raw);
    setTurns([{ question: data.firstQuestion }]);
    setSecondsLeft(data.durationMinutes * 60);
  }, [interviewId]);

  // Timer
  useEffect(() => {
    if (secondsLeft === null || done || secondsLeft <= 0) return;
    const t = setInterval(() => setSecondsLeft((s) => Math.max(0, s - 1)), 1000);
    return () => clearInterval(t);
  }, [secondsLeft, done]);

  // Auto-finish on timer
  useEffect(() => {
    if (secondsLeft === 0 && !done && turns.length > 0) {
      finishEarly();
    }
  }, [secondsLeft]);

  // Speech recognition
  useEffect(() => {
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SR) { setVoiceUnsupported(true); return; }

    const rec = new SR();
    rec.continuous = true;
    rec.interimResults = true;
    rec.lang = "en-US";

    rec.onresult = (e) => {
      let interimText = "", finalText = "";
      for (let i = e.resultIndex; i < e.results.length; i++) {
        const r = e.results[i];
        if (r.isFinal) finalText += r[0].transcript;
        else interimText += r[0].transcript;
      }
      if (finalText) {
        finalChunkRef.current += finalText + " ";
        setDraft((d) => (d ? `${d} ${finalText}`.trim() : finalText.trim()));
      }
      setInterim(interimText);
    };

    rec.onend = () => { setListening(false); setInterim(""); };
    rec.onerror = () => { setListening(false); setInterim(""); };
    recRef.current = rec;
    return () => { try { rec.stop(); } catch {} };
  }, []);

  // Auto-scroll
  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [turns, interim, processing]);

  const toggleMic = () => {
    if (!recRef.current) return;
    if (listening) {
      try { recRef.current.stop(); } catch {}
    } else {
      try {
        finalChunkRef.current = "";
        recRef.current.start();
        setListening(true);
      } catch {}
    }
  };

  const submitAnswer = async () => {
    if (!draft.trim() || submitting) return;
    if (listening) { try { recRef.current?.stop(); } catch {} }

    const answer = draft.trim();
    setSubmitting(true);
    setProcessing(true);
    setTurns((prev) => {
      const copy = [...prev];
      const last = copy[copy.length - 1];
      if (last) last.answer = answer;
      return copy;
    });
    setDraft("");

    try {
      const r = await api.submitAnswer({ interviewId, answer });
      setProgress({ answered: r.answered, total: r.totalQuestions });
      setTurns((prev) => {
        const copy = [...prev];
        const last = copy[copy.length - 1];
        if (last) last.evaluation = r.evaluation;
        if (!r.done && r.nextQuestion) copy.push({ question: r.nextQuestion });
        return copy;
      });
      if (r.done) {
        setDone(true);
        toast({ title: "Interview complete!", description: "Generating your report…" });
        const fr = await api.finishInterview(interviewId);
        sessionStorage.removeItem(`iv:${interviewId}`);
        navigate(`/report/${fr.reportId}`);
      }
    } catch (err) {
      toast({ title: "Submit failed", description: err.message, variant: "destructive" });
    } finally {
      setSubmitting(false);
      setProcessing(false);
    }
  };

  const finishEarly = async () => {
    setDone(true);
    setSubmitting(true);
    try {
      const fr = await api.finishInterview(interviewId);
      sessionStorage.removeItem(`iv:${interviewId}`);
      navigate(`/report/${fr.reportId}`);
    } catch (err) {
      toast({ title: "Could not finish", description: err.message, variant: "destructive" });
      setDone(false);
      setSubmitting(false);
    }
  };

  const fmt = (s) =>
    `${String(Math.floor(s / 60)).padStart(2, "0")}:${String(s % 60).padStart(2, "0")}`;

  const timerCritical = secondsLeft !== null && secondsLeft < 60;
  const progressPct = progress.total > 0 ? (progress.answered / progress.total) * 100 : 0;

  return (
    <div className="max-w-4xl mx-auto px-4 md:px-6 py-6 flex flex-col" style={{ height: "calc(100vh - 4rem)" }}>
      {/* Header */}
      <div className="flex items-center justify-between mb-4 shrink-0">
        <div>
          <div className="text-xs uppercase tracking-widest text-muted-foreground font-medium mb-0.5">
            Interview in progress
          </div>
          <div className="flex items-center gap-2">
            <div className="text-sm font-semibold">
              Question {turns.length}
              {progress.total > 0 && <span className="text-muted-foreground"> of ~{progress.total}</span>}
            </div>
            {progress.total > 0 && (
              <div className="w-20">
                <Progress value={progressPct} />
              </div>
            )}
          </div>
        </div>

        <div className="flex items-center gap-2">
          {secondsLeft !== null && (
            <div className={cn(
              "flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-sm font-mono tabular-nums",
              timerCritical
                ? "border-rose-500/50 bg-rose-500/8 text-rose-400"
                : "border-border text-foreground"
            )}>
              <Clock className="size-3.5" />
              {fmt(secondsLeft)}
            </div>
          )}
          <Button variant="outline" size="sm" onClick={finishEarly} disabled={submitting}>
            End early
          </Button>
        </div>
      </div>

      {/* Chat area */}
      <div
        ref={scrollRef}
        className="flex-1 overflow-y-auto rounded-xl border border-border bg-card/40 p-4 md:p-6 space-y-6 min-h-0"
      >
        {turns.map((t, i) => (
          <div key={i} className="space-y-3 animate-in">
            {/* AI question */}
            <div className="flex gap-3">
              <div className="size-8 shrink-0 rounded-lg bg-primary/15 text-primary grid place-items-center">
                <Bot className="size-4" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-[10px] text-primary uppercase tracking-widest font-medium mb-1.5">
                  Interviewer
                </div>
                <div className="text-base text-foreground leading-relaxed">{t.question}</div>
              </div>
            </div>

            {/* User answer */}
            {t.answer && (
              <div className="flex gap-3 pl-11">
                <div className="flex-1 rounded-xl bg-secondary/40 border border-border/50 px-4 py-3">
                  <div className="text-[10px] text-muted-foreground uppercase tracking-widest font-medium mb-1.5 flex items-center gap-1.5">
                    <User className="size-3" /> You
                  </div>
                  <div className="text-sm text-foreground/90 whitespace-pre-wrap leading-relaxed">
                    {t.answer}
                  </div>
                  {t.evaluation && (
                    <div className="mt-3 pt-3 border-t border-border/50">
                      <div className="flex flex-wrap gap-1.5">
                        {SCORE_KEYS.map(({ key, label }) => (
                          <ScorePill key={key} label={label} value={t.evaluation[key]} />
                        ))}
                      </div>
                      {t.evaluation.weak_areas?.length > 0 && (
                        <div className="mt-2 text-[11px] text-muted-foreground">
                          Focus on: {t.evaluation.weak_areas.join(", ")}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        ))}

        {/* Processing */}
        {processing && (
          <div className="flex items-center gap-2 text-sm text-muted-foreground pl-11 animate-in">
            <Loader2 className="size-3.5 animate-spin text-primary" />
            <span>Evaluating your answer…</span>
          </div>
        )}

        {/* Live transcript */}
        {listening && interim && (
          <div className="flex gap-3 pl-11">
            <div className="flex-1 rounded-xl bg-primary/5 border border-primary/20 px-4 py-3">
              <div className="text-[10px] text-primary uppercase tracking-widest font-medium mb-1.5 flex items-center gap-1.5">
                <span className="relative flex size-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-primary" />
                </span>
                Live transcript
              </div>
              <div className="text-sm text-foreground/70 italic">{interim}</div>
            </div>
          </div>
        )}
      </div>

      {/* Input area */}
      <div className="mt-3 rounded-xl border border-border bg-card p-4 shrink-0">
        {voiceUnsupported && (
          <div className="flex items-center gap-2 text-xs text-amber-400 mb-2">
            <AlertCircle className="size-3.5" />
            Voice not supported in this browser — type your answer.
          </div>
        )}
        <div className="flex items-end gap-2">
          <Textarea
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            placeholder={listening ? "Listening… speak naturally." : "Type or speak your answer…"}
            disabled={submitting || done}
            className="min-h-[72px] bg-background/50 border-border/50 focus-visible:border-primary/40"
            onKeyDown={(e) => {
              if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) {
                e.preventDefault();
                submitAnswer();
              }
            }}
          />
          <div className="flex flex-col gap-2">
            <Button
              type="button"
              onClick={toggleMic}
              variant={listening ? "destructive" : "outline"}
              size="icon"
              disabled={voiceUnsupported || submitting || done}
              className="size-11 shrink-0"
              title={listening ? "Stop listening" : "Start speaking"}
            >
              {listening ? <MicOff className="size-4" /> : <Mic className="size-4" />}
            </Button>
            <Button
              type="button"
              onClick={submitAnswer}
              disabled={!draft.trim() || submitting || done}
              size="icon"
              className="size-11 shrink-0"
              title="Submit (Cmd/Ctrl + Enter)"
            >
              {submitting ? <Loader2 className="size-4 animate-spin" /> : <Send className="size-4" />}
            </Button>
          </div>
        </div>
        <div className="mt-2 flex items-center justify-between text-xs text-muted-foreground">
          <span>Cmd/Ctrl + Enter to submit</span>
          {progress.total > 0 && (
            <span>{progress.answered}/{progress.total} answered</span>
          )}
        </div>
      </div>
    </div>
  );
}
