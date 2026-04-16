const BASE_URL = "http://127.0.0.1:8000/api";

export const startInterview = async (repoUrl) => {
  const res = await fetch(`${BASE_URL}/interview/start`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ repo_url: repoUrl })
  });

  if (!res.ok) throw new Error("Failed to start interview");

  return res.json();
};

export const sendAnswer = async (sessionId, answer) => {
  const res = await fetch(`${BASE_URL}/interview/answer`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      session_id: sessionId,
      answer
    })
  });

  if (!res.ok) throw new Error("Failed to send answer");

  return res.json();
};