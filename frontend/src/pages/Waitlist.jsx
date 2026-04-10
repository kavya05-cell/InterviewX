import { useState } from "react";

export default function Waitlist({ onClose }) {
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({
    first_name: "",
    last_name: "",
    email: "",
    phone_no: "",
    reason: ""
  });
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
  e.preventDefault();

  try {
    const res = await fetch("http://localhost:3000/api/create", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(form),
    });

    const data = await res.json();

    if (!res.ok) {
      alert(data.message || "Error ❌");
      return;
    }

    // ✅ SUCCESS MESSAGE
    alert("Submitted successfully 🚀");

    // ✅ RESET FORM
    setForm({
      first_name: "",
      last_name: "",
      email: "",
      phone_no: "",
      reason: ""
    });

    // ✅ CLOSE MODAL
    if (onClose) onClose();

  } catch (err) {
    console.error(err);
    alert("Something went wrong ❌");
  }
};

  return (
    <div style={{ textAlign: "center", marginTop: "20px" }}>

      {/* 🔥 BUTTON */}
      <button
  onClick={() => setShowForm(!showForm)}
  style={{
    padding: "12px 24px",
    fontSize: "16px",
    fontWeight: "bold",
    border: "none",
    borderRadius: "30px",
    background: "linear-gradient(135deg, #18c5ff, #00f2ff)",
    color: "white",
    cursor: "pointer",
    boxShadow: "0 0 15px rgba(0, 255, 255, 0.83)",
    transition: "all 0.3s ease"
  }}
  onMouseOver={(e) => {
    e.target.style.boxShadow = "0 0 25px rgb(0, 238, 255)";
    e.target.style.transform = "scale(1.05)";
  }}
  onMouseOut={(e) => {
    e.target.style.boxShadow = "0 0 15px rgba(0, 229, 255, 0.7)";
    e.target.style.transform = "scale(1)";
  }}
>
  {showForm ? "Close Waitlist " : "Join Waitlist"}
</button>

      {/* 🔥 FORM (only when clicked) */}
      {showForm && (
        <div style={{
          background: "white",
          padding: "20px",
          marginTop: "20px",
          borderRadius: "10px"
        }}>
          <h2 style={{ color: "#111", textAlign: "center" }}>Join Waitlist</h2>
          
           <form onSubmit={handleSubmit}>
  <input
    placeholder="First Name"
    onChange={(e) => setForm({ ...form, first_name: e.target.value })}
    style={{ width: "100%", marginBottom: "10px", padding: "8px" }}
  />

  <input
    placeholder="Last Name"
    onChange={(e) => setForm({ ...form, last_name: e.target.value })}
    style={{ width: "100%", marginBottom: "10px", padding: "8px" }}
  />

  <input
    placeholder="Email"
    onChange={(e) => setForm({ ...form, email: e.target.value })}
    style={{ width: "100%", marginBottom: "10px", padding: "8px" }}
  />

  <input
    placeholder="Phone"
    onChange={(e) => setForm({ ...form, phone_no: e.target.value })}
    style={{ width: "100%", marginBottom: "10px", padding: "8px" }}
  />

  <input
    placeholder="Reason"
    onChange={(e) => setForm({ ...form, reason: e.target.value })}
    style={{ width: "100%", marginBottom: "10px", padding: "8px" }}
  />

  {/* 🔥 THIS WAS MISSING */}
  <button
    type="submit"
    style={{
      width: "100%",
      padding: "10px",
      background: "#18c5ff",
      color: "white",
      border: "none",
      borderRadius: "8px",
      cursor: "pointer"
    }}
  >
    Submit
  </button>

</form>

          <p>{message}</p>
        </div>
      )}
    </div>
  );
}

