import ScoreBar from "../shared/ScoreBar";

export default function DashboardSection({
  activeQuestions,
  answerText,
  cameraStatus,
  clearCurrentAnswer,
  coach,
  currentQuestion,
  durationOptions,
  finishSessionNow,
  handleAnswerChange,
  handleRepoSubmit,
  handleRepoUrlChange,
  handleSettingChange,
  interimText,
  isListening,
  latestSession,
  liveMetrics,
  pressureLabel,
  questionProgress,
  questionSet,
  questionTimerText,
  repoFeedback,
  repoProfile,
  repoUrl,
  roleLabel,
  roleOptions,
  roundLabel,
  roundOptions,
  saveAndContinue,
  scoreDelta,
  session,
  settings,
  speechStatus,
  startSession,
  studioMessage,
  timerText,
  toggleVoiceCapture,
  videoRef
}) {
  return (
    <section className="page-stack">
      <section className="dashboard-header-row">
        <div>
          <p className="eyebrow">Dashboard</p>
          <h2>Interview studio and performance control center</h2>
          <p className="section-copy">{studioMessage}</p>
        </div>
        <div className="timer-card card">
          <span>Session timer</span>
          <strong>{timerText}</strong>
          <small>Question timer {questionTimerText}</small>
        </div>
      </section>

      <div className="summary-grid">
        <article className="summary-card card">
          <p className="mini-heading">Repo lens</p>
          <strong>{repoProfile.repoName}</strong>
          <span>{repoProfile.lens}</span>
        </article>
        <article className="summary-card card">
          <p className="mini-heading">Role track</p>
          <strong>{roleLabel}</strong>
          <span>{roundLabel}</span>
        </article>
        <article className="summary-card card">
          <p className="mini-heading">Pressure dial</p>
          <strong>{pressureLabel}</strong>
          <span>{settings.duration}-minute loop</span>
        </article>
        <article className="summary-card card">
          <p className="mini-heading">Signal replay</p>
          <strong>{latestSession?.overall ?? 0}%</strong>
          <span>{scoreDelta >= 0 ? `+${scoreDelta}` : scoreDelta}% versus previous saved record</span>
        </article>
      </div>

      <div className="dashboard-grid">
        <div className="dashboard-main">
          <article className="card setup-card">
            <div className="card-header">
              <div>
                <p className="mini-heading">Interview setup</p>
                <h3>Shape the mock loop before you begin</h3>
              </div>
              <div className="control-cluster">
                <button
                  type="button"
                  className="primary-btn"
                  onClick={startSession}
                  disabled={session.active}
                >
                  {session.active ? "Loop Running" : "Start Interview"}
                </button>
                <button
                  type="button"
                  className="secondary-btn"
                  onClick={finishSessionNow}
                  disabled={!session.active}
                >
                  Finish Loop
                </button>
              </div>
            </div>

            <div className="form-grid">
              <label className="field">
                <span>Role</span>
                <select name="role" value={settings.role} onChange={handleSettingChange}>
                  {roleOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </label>

              <label className="field">
                <span>Round type</span>
                <select name="round" value={settings.round} onChange={handleSettingChange}>
                  {roundOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </label>

              <label className="field">
                <span>Duration</span>
                <select name="duration" value={settings.duration} onChange={handleSettingChange}>
                  {durationOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </label>

              <label className="field range-field">
                <span>Pressure dial: {pressureLabel}</span>
                <input
                  name="pressure"
                  type="range"
                  min="1"
                  max="4"
                  value={settings.pressure}
                  onChange={handleSettingChange}
                />
              </label>
            </div>

            <div className="toggle-row">
              <label className="toggle-chip">
                <input
                  name="voiceEnabled"
                  type="checkbox"
                  checked={settings.voiceEnabled}
                  onChange={handleSettingChange}
                />
                <span>Voice ready</span>
              </label>
              <label className="toggle-chip">
                <input
                  name="videoEnabled"
                  type="checkbox"
                  checked={settings.videoEnabled}
                  onChange={handleSettingChange}
                />
                <span>Video preview</span>
              </label>
              <span className="inline-note">
                Pressure dial changes follow-up tone across the generated question set.
              </span>
            </div>
          </article>

          <article className="card repo-card">
            <div className="card-header">
              <div>
                <p className="mini-heading">Repository analyzer</p>
                <h3>Paste a Git repo and generate project-specific prompts</h3>
              </div>
              <span className="badge">Repo Mirror</span>
            </div>

            <form className="repo-form" onSubmit={handleRepoSubmit}>
              <label className="field grow">
                <span>Repository URL</span>
                <input
                  type="url"
                  placeholder="https://github.com/owner/project"
                  value={repoUrl}
                  onChange={handleRepoUrlChange}
                />
              </label>
              <button type="submit" className="primary-btn">
                Analyze Repo
              </button>
            </form>
            <p className={`helper-text ${repoFeedback.type}`.trim()}>{repoFeedback.text}</p>

            <div className="repo-layout">
              <div className="repo-copy">
                <h4>{repoProfile.lens}</h4>
                <p>{repoProfile.summary}</p>

                <div className="tag-cloud">
                  {repoProfile.stack.map((item) => (
                    <span key={item} className="pill">
                      {item}
                    </span>
                  ))}
                </div>

                <div className="mini-list-grid">
                  <div>
                    <p className="mini-heading">Hotspots</p>
                    <ul className="bullet-list">
                      {repoProfile.hotspots.map((item) => (
                        <li key={item}>{item}</li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <p className="mini-heading">Standout answer cues</p>
                    <ul className="bullet-list">
                      {repoProfile.standout.map((item) => (
                        <li key={item}>{item}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>

              <div className="score-panel">
                <p className="mini-heading">Ownership radar</p>
                <ScoreBar label="Architecture" value={repoProfile.scorecard.architecture} />
                <ScoreBar label="Reliability" value={repoProfile.scorecard.reliability} />
                <ScoreBar label="Product" value={repoProfile.scorecard.product} />
                <ScoreBar label="Execution" value={repoProfile.scorecard.execution} />
              </div>
            </div>
          </article>

          <article className="card stage-card">
            <div className="card-header">
              <div>
                <p className="mini-heading">Live interview</p>
                <h3>
                  {session.active
                    ? `Question ${session.currentQuestionIndex + 1} of ${questionSet.length}`
                    : "Preview the next question set"}
                </h3>
              </div>
              <span className={`status-badge ${session.active ? "live" : ""}`.trim()}>
                {session.active ? "Session live" : "Preview mode"}
              </span>
            </div>

            <div className="question-card">
              <p className="prompt-text">{currentQuestion?.prompt}</p>
              <div className="followup-row">
                {currentQuestion?.followUps.map((item) => (
                  <span key={item} className="followup-chip">
                    {item}
                  </span>
                ))}
              </div>
            </div>

            <label className="field">
              <span>Voice transcript and answer notes</span>
              <textarea
                placeholder="Speak your answer or type it here. Use numbers, impact, and clear ownership language."
                value={answerText}
                onChange={handleAnswerChange}
              ></textarea>
            </label>

            {interimText ? (
              <div className="interim-box">
                <p className="mini-heading">Live transcript</p>
                <p>{interimText}</p>
              </div>
            ) : null}

            <div className="control-cluster wrap">
              <button
                type="button"
                className={`secondary-btn ${isListening ? "recording" : ""}`.trim()}
                onClick={toggleVoiceCapture}
                disabled={!settings.voiceEnabled}
              >
                {isListening ? "Stop Voice Input" : "Start Voice Input"}
              </button>
              <button type="button" className="secondary-btn" onClick={clearCurrentAnswer}>
                Clear Draft
              </button>
              <button type="button" className="primary-btn" onClick={saveAndContinue}>
                {session.active && session.currentQuestionIndex >= questionSet.length - 1
                  ? "Save And Finish"
                  : "Save And Next"}
              </button>
            </div>

            <p className="helper-text">{speechStatus}</p>
          </article>

          <article className="card question-stack-card">
            <div className="card-header">
              <div>
                <p className="mini-heading">Question stack</p>
                <h3>Generated prompts for this mock loop</h3>
              </div>
              <span className="badge">{questionProgress}% progress</span>
            </div>

            <div className="question-stack">
              {activeQuestions.map((question, index) => (
                <article
                  key={question.id}
                  className={`question-stack-item ${index === session.currentQuestionIndex ? "active" : ""}`.trim()}
                >
                  <span>{String(index + 1).padStart(2, "0")}</span>
                  <div>
                    <strong>{question.prompt}</strong>
                    <p>{question.followUps[2]}</p>
                  </div>
                </article>
              ))}
            </div>
          </article>
        </div>

        <aside className="dashboard-side">
          <article className="card video-card">
            <div className="card-header">
              <div>
                <p className="mini-heading">Video rehearsal</p>
                <h3>Camera preview</h3>
              </div>
              <span className="badge">{settings.videoEnabled ? "Enabled" : "Off"}</span>
            </div>

            <div className="video-frame">
              {settings.videoEnabled ? (
                <video ref={videoRef} autoPlay muted playsInline />
              ) : (
                <div className="video-placeholder">
                  <span>Video preview</span>
                  <strong>Turn on camera in the setup card to rehearse posture and eye contact.</strong>
                </div>
              )}
            </div>
            <p className="helper-text">{cameraStatus}</p>
          </article>

          <article className="card metrics-card">
            <div className="card-header">
              <div>
                <p className="mini-heading">Live performance</p>
                <h3>Ownership radar</h3>
              </div>
              <span className="badge">Signal Replay</span>
            </div>

            <div className="metric-grid">
              <div className="metric-tile">
                <span>Confidence</span>
                <strong>{liveMetrics.confidence}%</strong>
              </div>
              <div className="metric-tile">
                <span>Clarity</span>
                <strong>{liveMetrics.clarity}%</strong>
              </div>
              <div className="metric-tile">
                <span>Depth</span>
                <strong>{liveMetrics.depth}%</strong>
              </div>
              <div className="metric-tile">
                <span>Ownership</span>
                <strong>{liveMetrics.ownership}%</strong>
              </div>
            </div>

            <div className="mini-list-grid">
              <div className="stat-panel">
                <span>Speaking pace</span>
                <strong>{liveMetrics.pace}</strong>
                <small>{liveMetrics.wpm} WPM</small>
              </div>
              <div className="stat-panel">
                <span>Filler count</span>
                <strong>{liveMetrics.fillerCount}</strong>
                <small>Lower is better</small>
              </div>
            </div>
          </article>

          <article className="card coach-card">
            <div className="card-header">
              <div>
                <p className="mini-heading">Coaching insight</p>
                <h3>Strengths and next improvements</h3>
              </div>
              <span className="badge">Actionable</span>
            </div>

            <p className="section-copy tight">{coach.summary}</p>

            <div className="mini-list-grid">
              <div>
                <p className="mini-heading">Doing well</p>
                <ul className="bullet-list">
                  {coach.strengths.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </div>
              <div>
                <p className="mini-heading">Improve next</p>
                <ul className="bullet-list">
                  {coach.improvements.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </div>
            </div>
          </article>

          <article className="card evidence-card">
            <div className="card-header">
              <div>
                <p className="mini-heading">Evidence ledger</p>
                <h3>What your answer proved</h3>
              </div>
              <span className="badge">Unique feature</span>
            </div>

            <p className="section-copy tight">
              This panel extracts measurable proof points from your current answer so you can see
              whether the response sounds concrete enough for a real interviewer.
            </p>

            <div className="evidence-ledger">
              {liveMetrics.evidence.length ? (
                liveMetrics.evidence.map((item) => (
                  <span key={item} className="signal-chip">
                    {item}
                  </span>
                ))
              ) : (
                <span className="muted-inline">
                  Add numbers, timings, uptime, users, costs, or impact words to make the answer stronger.
                </span>
              )}
            </div>
          </article>
        </aside>
      </div>
    </section>
  );
}
