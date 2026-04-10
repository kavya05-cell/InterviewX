import FeatureCard from "../shared/FeatureCard";

export default function HomeSection({
  homeFeatures,
  latestOverall,
  onOpenDashboard,
  onOpenRecords,
  pressureLabel,
  recordsCount,
  sessionDuration,
  uniqueFeatures
}) {
  return (
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
            <button type="button" className="primary-btn" onClick={onOpenDashboard}>
              Open Dashboard
            </button>
            <button type="button" className="secondary-btn" onClick={onOpenRecords}>
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
            <strong>{pressureLabel}</strong>
          </div>
          <div className="snapshot-row">
            <span>Session plan</span>
            <strong>{sessionDuration} minutes</strong>
          </div>
          <div className="snapshot-row">
            <span>Records saved</span>
            <strong>{recordsCount}</strong>
          </div>
          <div className="snapshot-row">
            <span>Latest score</span>
            <strong>{latestOverall}%</strong>
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
}
