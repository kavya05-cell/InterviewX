


import React, { useRef, useState } from "react";

export default function DashboardSection({
  repoUrl,
  handleRepoUrlChange,
  setAnalysis,
  analysis,
  startSession,
  session={},
  settings={},
  handleSettingChange,
  durationOptions,
  pressureLabel,
}) {
  const videoRef = useRef(null);
  const [cameraOn, setCameraOn] = useState(false);

  const startCamera = async () => {
  try {
    const stream = await navigator.mediaDevices.getUserMedia({
      video: true,
    });

    if (videoRef.current) {
      videoRef.current.srcObject = stream;

      // 🔥 IMPORTANT
      await videoRef.current.play();

      setCameraOn(true);
    }
  } catch (err) {
    console.error("Camera error:", err);
  }
};

  const handleRepoSubmit = async () => {
    try {
      const res = await fetch("http://localhost:8000/api/github/analyze", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ repo_url: repoUrl }),
      });

      const data = await res.json();
      setAnalysis(data);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <section className="dashboard">

      {/* HERO */}
      <div className="hero">
        <h1>
          Interview Studio <span>&</span> <br />
          Performance Control Center
        </h1>
        <p>
          Track your interview sessions, analyze repository insights,
          and optimize performance with AI-powered feedback.
        </p>
      </div>

      {/* REPO INPUT */}
      <div className="repo-card">
        <h3>Repository Analyzer</h3>
        <p>Paste your GitHub repository URL</p>

        <div className="repo-input">
          <input
            type="text"
            placeholder="https://github.com/username/project"
            value={repoUrl}
            onChange={handleRepoUrlChange}
          />
          <button onClick={handleRepoSubmit}>Analyze</button>
        </div>
      </div>

      {/* ANALYSIS */}
      {analysis && (
        <div className="analysis-section">

          {/* SUMMARY */}
          <div className="card">
            <h3>Project Summary</h3>
            <p>{analysis?.summary?.project_summary}</p>
          </div>

          {/* TECH STACK */}
          <div className="card">
            <h3>Tech Stack</h3>
            <div className="tech">
              {analysis?.summary?.tech_stack?.map((tech, i) => (
                <span key={i} className="pill">{tech}</span>
              ))}
            </div>
          </div>

          {/* STRENGTH + WEAKNESS */}
          <div className="grid">
            <div className="card green">
              <h3>Strengths</h3>
              {analysis?.summary?.strengths?.map((s, i) => (
                <p key={i}>✔ {s}</p>
              ))}
            </div>

            <div className="card yellow">
              <h3>Weaknesses</h3>
              {analysis?.summary?.weaknesses?.map((w, i) => (
                <p key={i}>⚠ {w}</p>
              ))}
            </div>
          </div>

          {/* INTERVIEW INSIGHTS */}
          <div className="card">
            <h3>Interview Insights</h3>
            <div className="insights">
              {analysis?.summary?.interview_questions?.map((q, i) => (
                <div key={i} className="insight-box">
                  {q}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* BOTTOM SECTION */}
      <div className="bottom-grid">

        {/* INTERVIEW CONTROLS */}
        <div className="card">
          <h3>Interview Controls</h3>

          <label>Duration</label>
          <select
            name="duration"
            value={settings?.duration || 0}
            onChange={handleSettingChange}
          >
            {durationOptions.map((d) => (
              <option key={d.value} value={d.value}>
                {d.label}
              </option>
            ))}
          </select>

          <label>Pressure Level</label>
          <input
            type="range"
            min="1"
            max="4"
            name="pressure"
            value={settings.pressure}
            onChange={handleSettingChange}
          />
          <p>{pressureLabel}</p>

          <button
            className="start-btn"
            onClick={startSession}
            disabled={session.active}
          >
            {session.active ? "Running..." : "Start Interview"}
          </button>
        </div>

        {/* CAMERA */}
        <div className="card">
          <h3>Camera & Mic Preview</h3>

          {cameraOn ? (
  <video
    ref={videoRef}
    autoPlay
    playsInline
    muted
    className="video"
  />
) : (
  <div className="camera-off">
    <p>Camera is off</p>
    <button onClick={startCamera}>Turn On</button>
  </div>
)}
        </div>
      </div>

      {/* STYLES */}
      <style>{`
        .dashboard {
  background: #f5f5f5;
  min-height: 100vh;
}
        .hero {
          color: black;
        }

.hero p {
  color: #444;
}

        .hero span {
          color: orange;
        }

        .repo-card {
          margin-top: 20px;
          background: #111;
          padding: 20px;
          border-radius: 10px;
          color: white;
        }

        .repo-input {
          display: flex;
          gap: 10px;
          margin-top: 10px;
        }

        input {
          flex: 1;
          padding: 10px;
          background: #111;
          border: 1px solid #333;
          color: white;
        }

        button {
          background: orange;
          border: none;
          padding: 10px 20px;
          cursor: pointer;
        }

        .analysis-section {
          margin-top: 30px;
        }

        .card {
  background: #ffffff;
  color: #000;
  border-radius: 12px;
  padding: 20px;
  border: 1px solid #e5e5e5;
}

        .grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 20px;
        }

        .green {
  border-left: 4px solid #22c55e;
  background: #f0fdf4;
}

.yellow {
  border-left: 4px solid #facc15;
  background: #fffbeb;
}
        .tech {
          display: flex;
          gap: 10px;
          flex-wrap: wrap;
        }

        .pill {
  background: #f3f4f6;
  color: #000;
  border-radius: 20px;
  padding: 6px 12px;
}

        .insights {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 10px;
        }

        .insight-box {
          background: #1a1a1a;
          padding: 10px;
          border-radius: 8px;
          color: white;
        }

        .bottom-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 20px;
          margin-top: 30px;
        }

        .start-btn {
          margin-top: 20px;
          width: 100%;
        }
          button {
  background: orange;
  color: black;
  font-weight: 600;
}

        .camera-off {
          text-align: center;
        }

        .video {
          width: 100%;
          border-radius: 10px;
          height:auto;
          background: black;
        }
      `}</style>
    </section>
  );
}
