
// import ScoreBar from "../shared/ScoreBar";
// import React,{ useRef, useState} from "react";

// export default function DashboardSection({
//   activeQuestions,
//   answerText,
//   cameraStatus,
//   clearCurrentAnswer,
//   coach,
//   currentQuestion,
//   durationOptions,
//   finishSessionNow,
//   handleAnswerChange,
//   handleRepoUrlChange,
//   handleSettingChange,
//   interimText,
//   isListening,
//   latestSession,
//   liveMetrics,
//   pressureLabel,
//   questionProgress,
//   questionSet,
//   repoFeedback,
//   repoProfile,
//   repoUrl,
//   roleLabel,
//   roleOptions,
//   roundLabel,
//   roundOptions,
//   saveAndContinue,
//   scoreDelta,
//   session,
//   settings,
//   speechStatus,
//   startSession,
//   studioMessage,
//   timerText,
//   toggleVoiceCapture,
//   analysis/*={analysis}*/,
//   setAnalysis/*={setAnalysis}*/,
// }) {
//   const videoRef=useRef(null);
//   const [cameraOn, setCameraOn]=useState(false);
//   console.log("ANALYSIS:", analysis);
//   const startCamera=async()=>{
//     try{
//       const steam=await navigator.mediaDevices.getUserMedia({video:true});
//       if(videoRef.current){
//         videoRef.current.srcObject=steam;
//         setCameraOn(true);
//       }
//     }catch(err){
//       console.error("Error accessing camera:",err);
//       alert("Unable to access camera. Please check permissions and try again.");
//     }
//     }
//     const handleRepoSubmit = async (e) => {
//   console.log("🔥 BUTTON CLICKED");

//   if (e) e.preventDefault();

//   console.log("Repo URL:", repoUrl);

//   try {
//     const res = await fetch("http://localhost:8000/api/github/analyze", {
//       method: "POST",
//       headers: {
//         "Content-Type": "application/json",
//       },
//       body: JSON.stringify({ repo_url: repoUrl }),
//     });

//     const data = await res.json();

//     console.log("✅ RESPONSE:", data);

//     setAnalysis(data);

//   } catch (err) {
//     console.error("❌ ERROR:", err);
//   }
// };
//   return (
//     <section className="page-stack">
//       <div className="hero-section">
//         <h1>
//     Interview Studio <span>&</span><br/>
//     Performance Control Center
//      </h1>
//     <p>
//     Track your interview sessions, analyze repository insights,
//     and optimize performance with AI-powered feedback.
//    </p>
//        </div>


//       <div className="dashboard-grid">
//         <div className="dashboard-main">
//           <article className="card setup-card">
//             <div className="card-header">
//               <div>
//                 <p className="mini-heading">Interview setup</p>
//                 <h3>Shape the mock loop before you begin</h3>
//               </div>
//               <div className="control-cluster">
//                 <button
//                   type="button"
//                   className="primary-btn"
//                   onClick={startSession}
//                   disabled={session.active}
//                 >
//                   {session.active ? "Loop Running" : "Start Interview"}
//                 </button>
//                 <button
//                   type="button"
//                   className="secondary-btn"
//                   onClick={finishSessionNow}
//                   disabled={!session.active}
//                 >
//                   Finish Loop
//                 </button>
//               </div>
//             </div>

//             <div className="form-grid">
//               <label className="field">
//                 <span>Role</span>
//                 <select name="role" value={settings.role} onChange={handleSettingChange}>
//                   {roleOptions.map((option) => (
//                     <option key={option.value} value={option.value}>
//                       {option.label}
//                     </option>
//                   ))}
//                 </select>
//               </label>

//               <label className="field">
//                 <span>Round type</span>
//                 <select name="round" value={settings.round} onChange={handleSettingChange}>
//                   {roundOptions.map((option) => (
//                     <option key={option.value} value={option.value}>
//                       {option.label}
//                     </option>
//                   ))}
//                 </select>
//               </label>

//               <label className="field">
//                 <span>Duration</span>
//                 <select name="duration" value={settings.duration} onChange={handleSettingChange}>
//                   {durationOptions.map((option) => (
//                     <option key={option.value} value={option.value}>
//                       {option.label}
//                     </option>
//                   ))}
//                 </select>
//               </label>

//               <label className="field range-field">
//                 <span>Pressure dial: {pressureLabel}</span>
//                 <input
//                   name="pressure"
//                   type="range"
//                   min="1"
//                   max="4"
//                   value={settings.pressure}
//                   onChange={handleSettingChange}
//                 />
//               </label>
//             </div>

//             <div className="toggle-row">
//               <label className="toggle-chip">
//                 <input
//                   name="voiceEnabled"
//                   type="checkbox"
//                   checked={settings.voiceEnabled}
//                   onChange={handleSettingChange}
//                 />
//                 <span>Voice ready</span>
//               </label>
//               <label className="toggle-chip">
//                 <input
//                   name="videoEnabled"
//                   type="checkbox"
//                   checked={settings.videoEnabled}
//                   onChange={handleSettingChange}
//                 />
//                 <span>Video preview</span>
//               </label>
//               <span className="inline-note">
//                 Pressure dial changes follow-up tone across the generated question set.
//               </span>
//             </div>
//           </article>

//           <article className="card repo-card">
//             <div className="card-header">
//               <div>
//                 <p className="mini-heading">Repository analyzer</p>
//                 <h3>Paste a Git repo and generate project-specific prompts</h3>
//               </div>
//               <span className="badge">Repo Mirror</span>
//             </div>

//             <div className="repo-form" >
//               <label className="field grow">
//                 <span>Repository URL</span>
//                 <input
//                   type="url"
//                   placeholder="https://github.com/owner/project"
//                   value={repoUrl}
//                   onChange={handleRepoUrlChange}
//                 />
//               </label>
//               <button type="button" className="primary-btn" onClick={handleRepoSubmit}>Analyze</button>
//             </div>
//             <p className={`helper-text ${repoFeedback.type}`.trim()}>{repoFeedback.text}</p>

//             <div className="repo-layout">
//               <div className="repo-copy">
//                 {analysis && (<div className="analysis-container">
//                 <div className="card">
//                   <h2>Project Summary</h2>
//       <p>{analysis?.summary?.project_summary || "No summary available"}</p>
//     </div>

//     <div className="card">
//       <h2>Tech Stack</h2>
//       <ul>
//         {analysis?.summary?.tech_stack?.map((tech, i) => (
//           <li key={i}>{tech}</li>
//         ))}
//       </ul>
//     </div>

//     <div className="card">
//       <h2>Strengths</h2>
//       <ul>
//         {analysis?.summary?.strengths?.map((s, i) => (
//           <li key={i}>{s}</li>
//         ))}
//       </ul>
//     </div>

//     <div className="card">
//       <h2>Weaknesses</h2>
//       <ul>
//         {analysis?.summary?.weaknesses?.map((w, i) => (
//           <li key={i}>{w}</li>
//         ))}
//       </ul>
//     </div>

//     <div className="card">
//       <h2>Interview Questions</h2>
//       <ul>
//         {analysis?.summary?.interview_questions?.map((q, i) => (
//           <li key={i}>{q}</li>
//         ))}
//       </ul>
//     </div>

//   </div>
// )}


//                 <div className="tag-cloud">
//                   {repoProfile.stack.map((item) => (
//                     <span key={item} className="pill">
//                       {item}
//                     </span>
//                   ))}
//                 </div>

//                 <div className="mini-list-grid">
//                   <div>
//                     <p className="mini-heading">Hotspots</p>
//                     <ul className="bullet-list">
//                       {repoProfile.hotspots.map((item) => (
//                         <li key={item}>{item}</li>
//                       ))}
//                     </ul>
//                   </div>
//                   <div>
//                     <p className="mini-heading">Standout answer cues</p>
//                     <ul className="bullet-list">
//                       {repoProfile.standout.map((item) => (
//                         <li key={item}>{item}</li>
//                       ))}
//                     </ul>
//                   </div>
//                 </div>
//               </div>

//               <div className="score-panel">
//                 <p className="mini-heading">Ownership radar</p>
//                 <ScoreBar label="Architecture" value={repoProfile.scorecard.architecture} />
//                 <ScoreBar label="Reliability" value={repoProfile.scorecard.reliability} />
//                 <ScoreBar label="Product" value={repoProfile.scorecard.product} />
//                 <ScoreBar label="Execution" value={repoProfile.scorecard.execution} />
//               </div>
//             </div>
//           </article>

//           <article className="card stage-card">
//             <div className="card-header">
//               <div>
//                 <p className="mini-heading">Live interview</p>
//                 <h3>
//                   {session.active
//                     ? `Question ${session.currentQuestionIndex + 1} of ${questionSet.length}`
//                     : "Preview the next question set"}
//                 </h3>
//               </div>
//               <span className={`status-badge ${session.active ? "live" : ""}`.trim()}>
//                 {session.active ? "Session live" : "Preview mode"}
//               </span>
//             </div>

//             <div className="question-card">
//               <p className="prompt-text">{currentQuestion?.prompt}</p>
//               <div className="followup-row">
//                 {currentQuestion?.followUps.map((item) => (
//                   <span key={item} className="followup-chip">
//                     {item}
//                   </span>
//                 ))}
//               </div>
//             </div>

//             <label className="field">
//               <span>Voice transcript and answer notes</span>
//               <textarea
//                 placeholder="Speak your answer or type it here. Use numbers, impact, and clear ownership language."
//                 value={answerText}
//                 onChange={handleAnswerChange}
//               ></textarea>
//             </label>

//             {interimText ? (
//               <div className="interim-box">
//                 <p className="mini-heading">Live transcript</p>
//                 <p>{interimText}</p>
//               </div>
//             ) : null}

//             <div className="control-cluster wrap">
//               <button
//                 type="button"
//                 className={`secondary-btn ${isListening ? "recording" : ""}`.trim()}
//                 onClick={toggleVoiceCapture}
//                 disabled={!settings.voiceEnabled}
//               >
//                 {isListening ? "Stop Voice Input" : "Start Voice Input"}
//               </button>
//               <button type="button" className="secondary-btn" onClick={clearCurrentAnswer}>
//                 Clear Draft
//               </button>
//               <button type="button" className="primary-btn" onClick={saveAndContinue}>
//                 {session.active && session.currentQuestionIndex >= questionSet.length - 1
//                   ? "Save And Finish"
//                   : "Save And Next"}
//               </button>
//             </div>

//             <p className="helper-text">{speechStatus}</p>
//           </article>

//           <article className="card question-stack-card">
//             <div className="card-header">
//               <div>
//                 <p className="mini-heading">Question stack</p>
//                 <h3>Generated prompts for this mock loop</h3>
//               </div>
//               <span className="badge">{questionProgress}% progress</span>
//             </div>

//             <div className="question-stack">
//               {activeQuestions.map((question, index) => (
//                 <article
//                   key={question.id}
//                   className={`question-stack-item ${index === session.currentQuestionIndex ? "active" : ""}`.trim()}
//                 >
//                   <span>{String(index + 1).padStart(2, "0")}</span>
//                   <div>
//                     <strong>{question.prompt}</strong>
//                     <p>{question.followUps[2]}</p>
//                   </div>
//                 </article>
//               ))}
//             </div>
//           </article>
//         </div>

//         <aside className="dashboard-side">
//           <article className="card video-card">
//             <div className="card-header">
//               <div>
//                 <p className="mini-heading">Video rehearsal</p>
//                 <div className="video-preview">
//                   {cameraOn ? (<video ref={videoRef}
//                   autoPlay
//                   playsInline
//                   className="w-full rounded-lg"/>) : (
//                 <div>
//                   <p>Camera is off</p>
//                   <button onClick={startCamera}>Turn On Camera
//                   </button>
//                 </div>)}
//               </div>
//               </div>
//               <span className="badge">{settings.videoEnabled ? "Enabled" : "Off"}</span>
//             </div>

//             <div className="video-frame">
//               {settings.videoEnabled ? (
//                 <video ref={videoRef} autoPlay muted playsInline />
//               ) : (
//                 <div className="video-placeholder">
//                   <span>Video preview</span>
//                   <strong>Turn on camera in the setup card to rehearse posture and eye contact.</strong>
//                 </div>
//               )}
//             </div>
//             <p className="helper-text">{cameraStatus}</p>
//           </article>

//           <article className="card metrics-card">
//             <div className="card-header">
//               <div>
//                 <p className="mini-heading">Live performance</p>
//                 <h3>Ownership radar</h3>
//               </div>
//               <span className="badge">Signal Replay</span>
//             </div>

//             <div className="metric-grid">
//               <div className="metric-tile">
//                 <span>Confidence</span>
//                 <strong>{liveMetrics.confidence}%</strong>
//               </div>
//               <div className="metric-tile">
//                 <span>Clarity</span>
//                 <strong>{liveMetrics.clarity}%</strong>
//               </div>
//               <div className="metric-tile">
//                 <span>Depth</span>
//                 <strong>{liveMetrics.depth}%</strong>
//               </div>
//               <div className="metric-tile">
//                 <span>Ownership</span>
//                 <strong>{liveMetrics.ownership}%</strong>
//               </div>
//             </div>

//             <div className="mini-list-grid">
//               <div className="stat-panel">
//                 <span>Speaking pace</span>
//                 <strong>{liveMetrics.pace}</strong>
//                 <small>{liveMetrics.wpm} WPM</small>
//               </div>
//               <div className="stat-panel">
//                 <span>Filler count</span>
//                 <strong>{liveMetrics.fillerCount}</strong>
//                 <small>Lower is better</small>
//               </div>
//             </div>
//           </article>

//           <article className="card coach-card">
//             <div className="card-header">
//               <div>
//                 <p className="mini-heading">Coaching insight</p>
//                 <h3>Strengths and next improvements</h3>
//               </div>
//               <span className="badge">Actionable</span>
//             </div>

//             <p className="section-copy tight">{coach.summary}</p>

//             <div className="mini-list-grid">
//               <div>
//                 <p className="mini-heading">Doing well</p>
//                 <ul className="bullet-list">
//                   {coach.strengths.map((item) => (
//                     <li key={item}>{item}</li>
//                   ))}
//                 </ul>
//               </div>
//               <div>
//                 <p className="mini-heading">Improve next</p>
//                 <ul className="bullet-list">
//                   {coach.improvements.map((item) => (
//                     <li key={item}>{item}</li>
//                   ))}
//                 </ul>
//               </div>
//             </div>
//           </article>

//           <article className="card evidence-card">
//             <div className="card-header">
//               <div>
//                 <p className="mini-heading">Evidence ledger</p>
//                 <h3>What your answer proved</h3>
//               </div>
//               <span className="badge">Unique feature</span>
//             </div>

//             <p className="section-copy tight">
//               This panel extracts measurable proof points from your current answer so you can see
//               whether the response sounds concrete enough for a real interviewer.
//             </p>

//             <div className="evidence-ledger">
//               {liveMetrics.evidence.length ? (
//                 liveMetrics.evidence.map((item) => (
//                   <span key={item} className="signal-chip">
//                     {item}
//                   </span>
//                 ))
//               ) : (
//                 <span className="muted-inline">
//                   Add numbers, timings, uptime, users, costs, or impact words to make the answer stronger.
//                 </span>
//               )}
//             </div>
//           </article>
//         </aside>
//       </div>
//     </section>
//   );
// }



import React, { useRef, useState } from "react";

export default function DashboardSection({
  repoUrl,
  handleRepoUrlChange,
  setAnalysis,
  analysis,
  startSession,
  session,
  settings,
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
            value={settings.duration}
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
