import React from "react";
import { Cpu } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function Header({ setActiveSection, onLogout }) {
  const navigate = useNavigate();
  return (
    <header style={nav}>

      {/* LOGO */}
      <div style={logo} onClick={() => setActiveSection("home")}>
        InterviewX
      </div>

      {/* NAV */}
     {/* <button onClick={() => setActiveSection("home")}>Home</button>
<button onClick={() => setActiveSection("dashboard")}>Dashboard</button>
<button onClick={() => setActiveSection("records")}>Records</button>
<button onClick={() => setActiveSection("about")}>About</button>
<button onClick={() => setActiveSection("contact")}>Contact</button> */}


<button onClick={() => navigate("/")}>Home</button>
<button onClick={() => navigate("/dashboard")}>Dashboard</button>
<button onClick={() => navigate("/records")}>Records</button>
<button onClick={() => navigate("/about")}>About</button>
<button onClick={() => navigate("/contact")}>Contact</button>



      {/* RIGHT */}
      <div style={right}>
        <button onClick={onLogout} className="logout-btn">Log Out</button>

        <div style={avatar}>KR</div>
      </div>

    </header>
  );
}
<style>{`
.logout-btn {
  background: #ff7a00;
  color: orange;
  border: none;
  padding: 8px 14px;
  border-radius: 8px;
  cursor: pointer;
}
`}</style>
const nav = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  padding: "40px 30px",
  background: "#0f172a",
  color: "White",
  boxShadow: "0 4px 20px rgba(0,0,0,0.2)",
};

const logo = {
  display: "flex",
  alignItems: "center",
  gap: 8,
  fontWeight: "bold",
  fontSize: 25,
  cursor: "pointer",
};

const navLinks = {
  display: "flex",
  gap: 15
};

const link = {
  cursor: "pointer",
  fontSize: 14,
  opacity: 0.8,
};

const right = {
  display: "flex",
  alignItems: "center",
  gap: 15,
};

const logoutBtn = {
  padding: "6px 12px",
  borderRadius: 8,
  border: "none",
  background: "#ff7a00",
  color: "orange",
  cursor: "pointer",
  fontSize: 13,
};

const avatar = {
  width: 32,
  height: 32,
  borderRadius: "50%",
  background: "#ff7a00",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  fontSize: 12,
  fontWeight: "bold",
};