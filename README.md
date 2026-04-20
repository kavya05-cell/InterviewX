## 🚀 Feature: Repo Analysis + AI Integration

This PR introduces a full end-to-end pipeline for analyzing a GitHub repository and generating structured insights using a local LLM (Ollama).

### 🔧 What’s Added
- GitHub repo URL input in dashboard
- Backend API integration (`/api/github/analyze`)
- LLM-powered repo analysis using Ollama
- Structured output:
  - Project summary
  - Tech stack
  - Strengths & weaknesses
  - Interview questions

### 🧠 How It Works
1. User enters a GitHub repo URL
2. Backend fetches repo data (GitHub API)
3. LLM analyzes:
   - README
   - metadata
4. Returns structured JSON
5. UI renders insights dynamically

### 🎯 Why This Matters
- Simulates real interview scenarios
- Helps users prepare based on their own projects
- Moves beyond static Q&A into contextual evaluation

### ⚠️ Notes
- Requires Ollama running locally
- Tested with `tinyllama` model

---

## 📸 Demo
(Add screenshots or GIF later if needed)
