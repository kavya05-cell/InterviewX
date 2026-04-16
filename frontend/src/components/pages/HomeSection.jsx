import FeatureCard from "../shared/FeatureCard";
import Waitlist from "./Waitlist";
import { useState} from "react";

export default function HomeSection({
  homeFeatures,
  latestOverall,
  onOpenDashboard,
  onOpenRecords,
  pressureLabel,
  recordsCount,
  sessionDuration,
  //uniqueFeatures
}) {
  const [showWaitlist, setShowWaitlist] = useState(false);
  

  return (
    <section className="page-stack">

      {/* HERO */}
      <section className="hero-grid">
        <div className="hero-main card">
          <h2>
            Mock interviews that feel closer to a real hiring loop than a plain chat.
          </h2>

          <p className="section-copy">
            Link a code repository, choose the interview mode, practice with voice or video,
            and leave with replayable scorecards.
          </p>

          <div className="hero-actions">
            <button
              type="button"
              className="primary-btn"
              onClick={onOpenDashboard}
            >
              Open Dashboard
            </button>

            <button
              type="button"
              className="secondary-btn"
              onClick={onOpenRecords}
            >
              View Records
            </button>

            {/* ✅ FIXED BUTTON */}
            <button
              type="button"
              className="primary-btn"
              onClick={() => setShowWaitlist(true)}
            >
              Join Waitlist
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
        </aside>
      </section>

      {showWaitlist && (<Waitlist onClose={() => setShowWaitlist(false)} />)}

      {/* FEATURES */}
      <section className="section-block">
        <div className="feature-grid">
          {homeFeatures.map((feature) => (
            <FeatureCard key={feature.title} {...feature} />
          ))}
        </div>
      </section>

    </section>
  );
}