import { create } from 'zustand';

const useAuthStore = create((set) => ({
  user: null,
  token: null,
  isAuthenticated: false,
  
  // Initialize: explicitly reset auth state (called on app mount)
  initialize: () => {
    // Clear any potential persisted state
    set({ user: null, token: null, isAuthenticated: false });
  },
  
  login: (user, token) => {
    set({ user, token, isAuthenticated: true });
  },
  
  logout: () => {
    set({ user: null, token: null, isAuthenticated: false });
  },
  
  updateUser: (userData) => {
    set((state) => ({
      user: { ...state.user, ...userData },
    }));
  },
}));

export default useAuthStore;

