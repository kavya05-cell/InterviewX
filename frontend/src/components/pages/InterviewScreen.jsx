import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Mic, MicOff, PhoneOff, Activity, RefreshCw } from 'lucide-react';
import { Button } from '../ui/Button';

export default function InterviewScreen() {
  const navigate = useNavigate();
  const location = useLocation();

  // ✅ Get session from Dashboard
  const sessionId = location.state?.sessionId;
  const firstQuestion = location.state?.firstQuestion;

  const [sessionTime, setSessionTime] = useState(0);
  const [aiState, setAiState] = useState("connecting");
  const [isMuted, setMuted] = useState(true);
  const [isListening, setIsListening] = useState(false);

  const [messages, setMessages] = useState([
    { role: "ai", text: firstQuestion || "Starting interview..." }
  ]);

  const ws = useRef(null);
  const recognition = useRef(null);

  // ⏱ Timer
  useEffect(() => {
    const timer = setInterval(() => setSessionTime(t => t + 1), 1000);
    return () => clearInterval(timer);
  }, []);

// 🌐 WebSocket Connection
useEffect(() => {
  if (!sessionId) return;

  ws.current = new WebSocket("ws://localhost:8000/api/interview/ws");

  ws.current.onopen = () => {
  ws.current.send(JSON.stringify({
    type:"start",
    session_id: sessionId
  }));
};

  ws.current.onerror = (err) => {
    console.error("❌ WebSocket ERROR:", err);
  };

  ws.current.onmessage = (event) => {

      const msg = JSON.parse(event.data);
      if (msg.type === "ai_state") {
        setAiState(msg.state);
      }

      if (msg.type === "question") {
        setMessages(prev => [
          ...prev,
          { role: "ai", text: msg.text_transcript }
        ]);
      }
      if(msg.type ==="feedback"){
        setMessages(prev => [
          ...prev,
          { role: "ai", text: `Feedback: ${msg.feedback}` }
        ]);
      }
      if(msg.type === "end"){
        navigate("/report",{
          state:{reportData:msg.report}
        });
      }
    
  };
return () => ws.current?.close();
  [sessionId]
  ws.current.onclose = () => {
    console.log("❌ WebSocket closed");
  };

  // ✅ Send session_id (FIXED)
  ws.current.send(JSON.stringify({
    type: "start",
    text: transcript,
    session_id: sessionId
  }));

  return () => {
    if (ws.current) ws.current.close();
  };

}, [sessionId]);

  // 🎤 Speech Recognition
  useEffect(() => {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition) return;

    recognition.current = new SpeechRecognition();
    recognition.current.continuous = false;
    recognition.current.interimResults = false;

    recognition.current.onstart = () => setIsListening(true);

    recognition.current.onresult = (event) => {
      const transcript = event.results[0][0].transcript;

      // ✅ Show user message
      setMessages(prev => [
        ...prev,
        { role: "user", text: transcript }
      ]);

      // ✅ Send to backend
      if (ws.current && ws.current.readyState === WebSocket.OPEN) {
        ws.current.send(transcript);
      }
    };

    recognition.current.onend = () => {
      setIsListening(false);
      setMuted(true);
    };

  }, []);

  const toggleMute = () => {
    if (isMuted) {
      setMuted(false);
      recognition.current?.start();
    } else {
      setMuted(true);
      recognition.current?.stop();
    }
  };

  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60).toString().padStart(2, '0');
    const s = (seconds % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  };

  const handleEndCall = () => {
    navigate('/report/inv_new');
  };

  return (
    <div className="h-screen flex flex-col items-center justify-center bg-black text-white p-6">

      <h1 className="text-2xl font-bold mb-4">Interview Session</h1>

      {/* Chat Messages */}
      <div className="w-full max-w-xl space-y-3 mb-6 overflow-y-auto max-h-[400px]">
        {messages.map((msg, i) => (
          <div key={i} className={msg.role === "ai" ? "text-left" : "text-right"}>
            <p className="bg-gray-800 p-3 rounded">{msg.text}</p>
          </div>
        ))}
      </div>

      {/* AI State */}
      <p className="mb-4 text-sm text-gray-400">
        State: {aiState}
      </p>

      {/* Controls */}
      <div className="flex items-center gap-6">

        <div className="text-lg font-mono">
          {formatTime(sessionTime)}
        </div>

        <Button
          onClick={toggleMute}
          className="rounded-full"
        >
          {isMuted ? <MicOff /> : <Mic />}
        </Button>

        <Button
          variant="destructive"
          onClick={handleEndCall}
        >
          <PhoneOff /> End
        </Button>
      </div>

        <p className={isListening ? "text-green-400" : "text-gray-500"}>{isListening ? "🎤 Listening..." : "Idle"}</p>
      </div>
    );
  }
