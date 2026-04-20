
import { useEffect, useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import InterviewScreen from "./components/pages/InterviewScreen";
import AboutSection from "./components/pages/AboutSection";
import ContactSection from "./components/pages/ContactSection";
import DashboardSection from "./components/pages/DashboardSection";
import HomeSection from "./components/pages/HomeSection";
import RecordsSection from "./components/pages/RecordsSection";
import Header from "./components/Header";
import { useNavigate } from "react-router-dom";

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

  // 🚀 START INTERVIEW
  async function startSession() {
  if (!repoUrl.trim()) {
    setStudioMessage("Enter repo URL first");
    return;
  }

  try {
    const res = await fetch("http://127.0.0.1:8000/api/interview/start", {
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

    // 🔥 THIS IS WHAT YOU WERE MISSING
    navigate("/interview", {
      state: {
        sessionId: data.session_id,
        question: data.question
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

  const sectionMap = {
    home: (
      <HomeSection
        homeFeatures={[]}
        latestOverall={latestSession ? latestSession.overall : 0}
        recordsCount={records.length}
        onOpenDashboard={() => setActiveSection("dashboard")}
      />
    ),

    dashboard: (
      <DashboardSection
        repoUrl={repoUrl}
        handleRepoUrlChange={(e) => setRepoUrl(e.target.value)}
        startSession={startSession}
        studioMessage={studioMessage}
      />
    ),

    records: (
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
    ),

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

    <Header onLogout={handleLogout} />

    <main className="p-6">
      <Routes>
        <Route path="/" element={sectionMap.home} />
        <Route path="/dashboard" element={sectionMap.dashboard} />
        <Route path="/records" element={sectionMap.records} />
        <Route path="/about" element={sectionMap.about} />
        <Route path="/contact" element={sectionMap.contact} />

        <Route path="/interview" element={<InterviewScreen />} />
      </Routes>
    </main>

  </div>
);
}