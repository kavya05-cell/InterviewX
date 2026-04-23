import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";

import AboutSection from "./components/pages/AboutSection";
import ContactSection from "./components/pages/ContactSection";
import DashboardSection from "./components/pages/DashboardSection";
import HomeSection from "./components/pages/HomeSection";
import RecordsSection from "./components/pages/RecordsSection";

const STORAGE_KEYS = {
  auth: "projectlens_auth",
  records: "projectlens_records"
};

const defaultRepoProfile = {
  linked: false,
  repoUrl: "",
  repoName: "No repository linked"
};

export default function App() {
  const navigate = useNavigate();
  const location = useLocation();

  // 🔐 Auth
  const [user, setUser] = useState(() => {
    const raw = localStorage.getItem(STORAGE_KEYS.auth);
    return raw ? JSON.parse(raw) : null;
  });

  // 📊 Records
  const [records, setRecords] = useState(() => {
    const raw = localStorage.getItem(STORAGE_KEYS.records);
    return raw ? JSON.parse(raw) : [];
  });

  const [latestSession, setLatestSession] = useState(null);

  // 🧭 Navigation
  const [activeSection, setActiveSection] = useState("home");

  // 📦 Repo
  const [repoUrl, setRepoUrl] = useState("");
  const [repoProfile, setRepoProfile] = useState(defaultRepoProfile);

  const [studioMessage, setStudioMessage] = useState("");

  // 💾 Persist
  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.records, JSON.stringify(records));
  }, [records]);

  useEffect(() => {
    if (user) {
      localStorage.setItem(STORAGE_KEYS.auth, JSON.stringify(user));
    }
  }, [user]);

  // 🧠 Capture report after navigation
  useEffect(() => {
    const report = location.state?.reportData;

    if (report) {
      setRecords(prev => [report, ...prev]);
      setLatestSession(report);
    }
  }, [location.state]);

  // 🚀 START INTERVIEW (REAL)
  async function startSession() {
    if (!repoUrl.trim()) {
      setStudioMessage("Enter repo URL first");
      return;
    }

    try {
      const res = await fetch("http://127.0.0.1:8000/start", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          repo_url: repoUrl,
          difficulty: "medium"
        })
      });

      const data = await res.json();

      if (!data.session_id) {
        setStudioMessage("Failed to start session");
        return;
      }

      navigate("/interview", {
        state: {
          sessionId: data.session_id,
          firstQuestion: data.question
        }
      });

    } catch (err) {
      console.error(err);
      setStudioMessage("Backend connection failed");
    }
  }

  function handleLogout() {
    setUser(null);
  }

  // 🧩 Views

  const homeView = (
    <HomeSection
      homeFeatures={[]}
      uniqueFeatures={[]}
      latestOverall={latestSession ? latestSession.overall : 0}
      recordsCount={records.length}
      onOpenDashboard={()=>setActiveSection("dashboard")}
    />
  );

  const dashboardView = (
    <DashboardSection
      repoUrl={repoUrl}
      handleRepoUrlChange={(e) => setRepoUrl(e.target.value)}
      startSession={startSession}
      studioMessage={studioMessage}
    />
  );

  const recordsView = (
    <RecordsSection
      records={records}
      latestSession={latestSession}
      averageRecordScore={
        records.length
          ? Math.round(records.reduce((a, b) => a + b.overall, 0) / records.length)
          : 0
      }
      bestRecord={records[0]}
      formatRecordDate={(d) => new Date(d).toDateString()}
    />
  );

  const sectionMap = {
    home: homeView,
    dashboard: dashboardView,
    records: recordsView,
    about: <AboutSection />,
    contact: <ContactSection />
  };

  // 🔐 Auth Gate
  if (!user) {
    return (
      <div className="h-screen flex items-center justify-center">
        <button
          onClick={() => setUser({ name: "User" })}
          className="primary-btn"
        >
          Enter App
        </button>
      </div>
    );
  }

  // 🧠 MAIN UI
  return (
    <div className="app-shell">

      <header className="topbar flex justify-between px-6 py-4">
        <h1>ProjectLens</h1>

        <div className="flex gap-4">
          <button onClick={() => setActiveSection("home")}>Home</button>
          <button onClick={() => setActiveSection("dashboard")}>Dashboard</button>
          <button onClick={() => setActiveSection("records")}>Records</button>
          <button onClick={handleLogout}>Logout</button>
        </div>
      </header>

      <main className="p-6">
        {sectionMap[activeSection]}
      </main>
    </div>
  );
}