import { create } from 'zustand';

export const useInterviewStore = create((set) => ({
  repoUrl: '',
  analysisResults: null, // metrics from repo analysis
  currentInterviewId: null,
  aiState: 'connecting', // connecting, listening, thinking, speaking
  transcript: [], // list of messages { role: 'ai' | 'user', text: string, timestamp: string }
  isMuted: true,
  isCallActive: false,

  setRepoUrl: (url) => set({ repoUrl: url }),
  setAnalysisResults: (results) => set({ analysisResults: results }),
  
  startInterview: (id) => set({ currentInterviewId: id, isCallActive: true, aiState: 'connecting', transcript: [] }),
  endInterview: () => set({ isCallActive: false }),
  setAiState: (state) => set({ aiState: state }),
  
  addTranscriptLine: (role, text) => set((state) => ({
    transcript: [...state.transcript, { role, text, timestamp: new Date().toISOString() }]
  })),
  
  setMuted: (muted) => set({ isMuted: muted })
}));
