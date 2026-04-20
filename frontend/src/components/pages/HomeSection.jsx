import FeatureCard from "../shared/FeatureCard";
import Waitlist from "./Waitlist";
import { useState} from "react";

export default function HomeSection({
  homeFeatures=[],
  latestOverall=0,
  onOpenDashboard,
  onOpenRecords,
  pressureLabel="Medium",
  recordsCount=0,
  sessionDuration=25,
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
              onClick={()=>onOpenDashboard?.()}
            >
              Open Dashboard
            </button>

            <button
              type="button"
              className="secondary-btn"
              onClick={()=>onOpenRecords?.()}
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
            <strong>{pressureLabel || "Medium"}</strong>
          </div>

          <div className="snapshot-row">
            <span>Session plan</span>
            <strong>{sessionDuration || 25} minutes</strong>
          </div>

          <div className="snapshot-row">
            <span>Records saved</span>
            <strong>{recordsCount ?? 0}</strong>
          </div>

          <div className="snapshot-row">
            <span>Latest score</span>
            <strong>{latestOverall ?? 0}%</strong>
          </div>
        </aside>
      </section>

      {showWaitlist && (
  <div style={overlayStyle}>
    <Waitlist onClose={() => setShowWaitlist(false)} />
  </div>
)}

      {/* FEATURES */}
      <section className="section-block">
        <div className="feature-grid">
          {(homeFeatures || []).map((feature) => (
            <FeatureCard key={feature.title} {...feature} />
          ))}
        </div>
      </section>

    </section>
  );
}
const overlayStyle = {
  position: "fixed",
  top: 0,
  left: 0,
  width: "100%",
  height: "100%",
  background: "rgba(0,0,0,0.6)",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  zIndex: 1000,
};