import { useState } from "react";

export default function InterviewScreen({ sessionId, question }) {
  const [currentQuestion, setCurrentQuestion] = useState(question);
  const [answer, setAnswer] = useState("");

  async function handleSubmit() {
    if (!answer.trim()) return;

    try {
      const formData = new FormData();

      // 👇 fake audio for now (backend expects file)
      formData.append("file", new Blob(["dummy"], { type: "audio/wav" }), "audio.wav");

      const res = await fetch(
        `http://127.0.0.1:8000/voice-next?session_id=${sessionId}`,
        {
          method: "POST",
          body: formData
        }
      );

      const data = await res.json();

      setCurrentQuestion(data.next_question);
      setAnswer("");

    } catch (err) {
      console.error("Error:", err);
    }
  }

  return (
    <div className="p-6 text-white max-w-3xl mx-auto">

      <h2 className="text-xl font-semibold mb-4">
        Question
      </h2>

      <div className="bg-[#111] p-5 rounded-xl mb-6">
        {currentQuestion}
      </div>

      <h3 className="mb-2">Your Answer</h3>

      <textarea
        value={answer}
        onChange={(e) => setAnswer(e.target.value)}
        className="w-full p-4 bg-[#111] rounded-xl mb-4"
        placeholder="Type your answer..."
      />

      <button
        onClick={handleSubmit}
        className="w-full bg-orange-500 py-3 rounded-xl font-semibold"
      >
        Submit Answer
      </button>

    </div>
  );
}