import { useState } from "react";

export default function Waitlist({ onClose }) {
  const [form, setForm] = useState({
    first_name: "",
    last_name: "",
    email: "",
    phone_no: "",
    reason: ""
  });

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const API = import.meta.env.VITE_API_URL;
      const res = await fetch(`${API}/api/create`, {
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

      alert("Submitted successfully 🚀");

      // reset form
      setForm({
        first_name: "",
        last_name: "",
        email: "",
        phone_no: "",
        reason: ""
      });

      // close if needed
      if (onClose) onClose();

    } catch (err) {
      console.error(err);
      alert("Something went wrong ❌");
    }
  };

  return (
    <div
      style={{
        background: "white",
        padding: "25px",
        borderRadius: "12px",
        maxWidth: "400px",
        margin: "40px auto",
        boxShadow: "0 10px 30px rgba(0,0,0,0.2)"
      }}
    >
      <h2 style={{ textAlign: "center", marginBottom: "15px" }}>
        Join Waitlist
      </h2>

      <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "10px" }}>

        <input
          placeholder="First Name"
          value={form.first_name}
          onChange={(e) =>
            setForm({ ...form, first_name: e.target.value })
          }
        />

        <input
          placeholder="Last Name"
          value={form.last_name}
          onChange={(e) =>
            setForm({ ...form, last_name: e.target.value })
          }
        />

        <input
          type="email"
          placeholder="Email"
          value={form.email}
          onChange={(e) =>
            setForm({ ...form, email: e.target.value })
          }
        />

        <input
          placeholder="Phone Number"
          value={form.phone_no}
          onChange={(e) =>
            setForm({ ...form, phone_no: e.target.value })
          }
        />

        <input
          placeholder="Why are you interested?"
          value={form.reason}
          onChange={(e) =>
            setForm({ ...form, reason: e.target.value })
          }
        />

        <button
          type="submit"
          style={{
            marginTop: "10px",
            padding: "10px",
            borderRadius: "8px",
            border: "none",
            background: "#22c55e",
            color: "white",
            fontWeight: "bold",
            cursor: "pointer"
          }}
        >
          Submit
        </button>

        {/* Optional close button */}
        {onClose && (
          <button
            type="button"
            onClick={onClose}
            style={{
              marginTop: "5px",
              background: "transparent",
              border: "none",
              color: "#555",
              cursor: "pointer"
            }}
          >
            Cancel
          </button>
        )}

      </form>
    </div>
  );
}