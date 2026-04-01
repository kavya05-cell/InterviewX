import RecordCard from "../shared/RecordCard";
import ScoreBar from "../shared/ScoreBar";

export default function RecordsSection({
  averageRecordScore,
  bestRecord,
  formatRecordDate,
  latestSession,
  records
}) {
  return (
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
            <RecordCard key={record.id} formatRecordDate={formatRecordDate} record={record} />
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
}
