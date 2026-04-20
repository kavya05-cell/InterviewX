import { useEffect, useState, useRef } from "react";

export default function DashboardSection({
  repoUrl,
  handleRepoUrlChange,
  startSession,
}) {
  const [analysis, setAnalysis] = useState(null);
  const [loading, setLoading] = useState(false);
  const [finalized, setFinalized] = useState(false);

  const videoRef = useRef(null);

  // 🎥 Camera preview
  useEffect(() => {
    navigator.mediaDevices
      .getUserMedia({ video: true })
      .then((stream) => {
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      })
      .catch(() => console.log("Camera blocked"));
  }, []);

  // 🔍 ANALYZE
const analyzeRepo = async () => {
  try {
    const res = await fetch("http://127.0.0.1:8000/api/github/analyze", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ repo_url: repoUrl }),
    });

    const data = await res.json();

    console.log("FINAL DATA:", data); // 👈 CHECK THIS

    setAnalysis(data);

  } catch (err) {
    console.error(err);
  }
};

  // 🚀 START INTERVIEW
  const startInterview = async () => {
    try {
      const res = await fetch("http://127.0.0.1:8000/api/start", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ repo_url: repoUrl }),
      });

      const data = await res.json();

      if (data.session_id) {
        startSession(data.session_id);
      }
    } catch (err) {
      console.error("Start interview error:", err);
    }
  };

  return (
    <div className="dashboard">

      {/* 🔥 HEADER */}
      <h1 className="title">Interview Studio</h1>

      {/* 🔍 ANALYZER */}
      <div className="card analyzer">
        <h2>Repository Analyzer</h2>

        <div className="input-row">
          <input
            value={repoUrl}
            onChange={handleRepoUrlChange}
            placeholder="Paste GitHub repo URL..."
          />
          <button onClick={analyzeRepo}>Analyze</button>
        </div>

        {loading && <p className="loading">Analyzing...</p>}

        {analysis && (
  <div className="analysis">

    {/* SUMMARY */}
    <p className="summary">
      {analysis.summary || "No summary available"}
    </p>

    <div className="grid">

      {/* TECH STACK */}
      <div className="box">
        <h3>Tech Stack</h3>
        <div className="tags">
          {(analysis.techstack || []).map((t, i) => (
            <span key={i} className="tag">{t}</span>
          ))}
        </div>
      </div>

      {/* STRENGTHS */}
      <div className="box">
        <h3 style={{ color: "green" }}>Strengths</h3>
        <div className="tags">
          {(analysis.strengths || []).map((s, i) => (
            <span key={i} className="tag green">{s}</span>
          ))}
        </div>
      </div>

      {/* WEAKNESSES */}
      <div className="box">
        <h3 style={{ color: "red" }}>Weaknesses</h3>
        <div className="tags">
          {(analysis.weaknesses || []).map((w, i) => (
            <span key={i} className="tag red">{w}</span>
          ))}
        </div>
      </div>

    </div>
  </div>
)}
      </div>
      {/* 🎯 INTERVIEW */}
      <div className="card controls">
        <h2>Interview Controls</h2>

        <select>
          <option>5 minutes</option>
          <option>15 minutes</option>
          <option>30 minutes</option>
        </select>

        <select>
          <option>Easy</option>
          <option>Medium</option>
          <option>Hard</option>
        </select>

        <button className="start-btn" onClick={startSession}>
          ▶ Start Interview
        </button>
      </div>

      {/* 🎥 CAMERA */}
      <div className="card camera">
        <h2>Camera Preview</h2>
        <video ref={videoRef} autoPlay playsInline />
      </div>

      {/* 🎨 STYLES */}
      <style>{`
        .dashboard {
          padding: 30px;
          background: #f8fafc;
          font-family: sans-serif;
        }

        .title {
          font-size: 28px;
          margin-bottom: 20px;
        }

        .card {
          background: white;
          padding: 20px;
          border-radius: 14px;
          margin-bottom: 20px;
          box-shadow: 0 5px 20px rgba(0,0,0,0.05);
        }

        .input-row {
          display: flex;
          gap: 10px;
        }

        input {
          flex: 1;
          padding: 12px;
          border-radius: 8px;
          border: 1px solid #ddd;
        }

        button {
          background: #ff7a00;
          color: white;
          border: none;
          padding: 12px 16px;
          border-radius: 8px;
          cursor: pointer;
        }

        .loading {
          margin-top: 10px;
          color: gray;
        }

        .summary {
          margin: 20px 0;
          color: #444;
        }

        .grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 20px;
        }

        .box {
          background: #f1f5f9;
          padding: 15px;
          border-radius: 10px;
        }

        .tags {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
        }

        .tag {
          background: #e2e8f0;
          padding: 6px 10px;
          border-radius: 20px;
          font-size: 12px;
        }

        .green { color: #16a34a; }
        .red { color: #dc2626; }

        .pill {
          padding: 8px;
          border-radius: 8px;
          margin: 6px 0;
        }

        .green-bg { background: #dcfce7; }
        .red-bg { background: #fee2e2; }

        .start-btn {
          width: 100%;
          margin-top: 10px;
        }

        video {
          width: 100%;
          border-radius: 10px;
          margin-top: 10px;
        }
      `}</style>
    </div>
  );
}