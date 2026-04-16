import { create } from 'zustand';

export const useUserStore = create((set) => ({
  user: null, // { name: string, email: string, avatarUrl: string }
  isAuthenticated: false,
  pastInterviews: [],
  
  login: (userData) => set({ user: userData, isAuthenticated: true }),
  logout: () => set({ user: null, isAuthenticated: false, pastInterviews: [] }),
  setPastInterviews: (interviews) => set({ pastInterviews: interviews }),
  addInterviewToHistory: (interview) => set((state) => ({ 
    pastInterviews: [interview, ...state.pastInterviews] 
  })),
}));
