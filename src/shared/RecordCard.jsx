import ScoreBar from "./ScoreBar";

export default function RecordCard({ formatRecordDate, record }) {
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
